import mongoose from 'mongoose';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { paginate, paginatedResponse } from '../utils/pagination.js';
import { AppError } from '../utils/errors.js';
import * as emailService from '../services/email.service.js';

const placeOrderSchema = z.object({
  addressId: z.string(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
  couponCode: z.string().optional(),
});

const trackSchema = z.object({
  orderNumber: z.string(),
  email: z.string().email(),
});

export async function orderRoutes(fastify) {
  // POST /api/orders — place order
  fastify.post('/', { preHandler: [authMiddleware, validate(placeOrderSchema)] }, async (request, reply) => {
    const { addressId, paymentMethod, couponCode } = request.validated;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const user = await User.findById(request.user.sub).session(session);
      if (!user.cart.length) throw new AppError('Cart is empty', 400, 'CART_EMPTY');

      const address = user.addresses.id(addressId);
      if (!address) throw new AppError('Address not found', 404, 'NOT_FOUND');

      // Build order items
      const productIds = user.cart.map(c => c.productId);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      const productMap = new Map(products.map(p => [p._id.toString(), p]));

      const items = [];
      for (const cartItem of user.cart) {
        const product = productMap.get(cartItem.productId.toString());
        if (!product) throw new AppError(`Product not found: ${cartItem.productId}`, 400, 'NOT_FOUND');

        const variant = cartItem.variantSku
          ? product.variants.find(v => v.sku === cartItem.variantSku)
          : null;

        const price = variant?.price || product.salePrice || product.basePrice;
        const thumbnail = product.images?.[0]?.url || product.thumbnail;

        items.push({
          productId: product._id,
          title: product.title,
          variantSku: cartItem.variantSku || null,
          variantName: variant?.name || null,
          quantity: cartItem.quantity,
          price,
          image: thumbnail,
        });
      }

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const tax = Math.round(subtotal * 0.18);
      const shipping = subtotal > 50000 ? 0 : 5000;
      let discount = 0;

      // Apply coupon
      if (couponCode) {
        const Coupon = mongoose.model('Coupon');
        const coupon = await Coupon.findOne({
          code: couponCode.toUpperCase(),
          isActive: true,
          $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
          $or2: [{ usageLimit: 0 }, { $expr: { $lt: ['$currentUsage', '$usageLimit'] } }],
        }).session(session);

        if (coupon && subtotal >= coupon.minOrderValue) {
          discount = coupon.type === 'percentage'
            ? Math.round(subtotal * coupon.value / 100)
            : Math.min(coupon.value, subtotal);
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

          coupon.currentUsage += 1;
          coupon.redemptions.push({ userId: user._id, orderId: null, discountAmount: discount });
          await coupon.save({ session });
        }
      }

      const total = subtotal + tax + shipping - discount;

      const order = await Order.create([{
        orderNumber: `AGF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        userId: user._id,
        status: 'pending',
        items,
        subtotal,
        tax,
        shipping,
        discount,
        couponCode: couponCode || null,
        total: Math.max(0, total),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod,
        statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
      }], { session });

      // Clear cart
      user.cart = [];
      await user.save({ session });

      await session.commitTransaction();

      const created = order[0];

      // Send order confirmation email (non-blocking)
      emailService.sendOrderConfirmation(created).catch(() => {});

      // Generate Razorpay order if applicable
      let razorpayData = null;
      if (paymentMethod === 'razorpay' && process.env.RAZORPAY_KEY_ID) {
        try {
          const Razorpay = (await import('razorpay')).default;
          const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
          });
          const rzpOrder = await razorpay.orders.create({
            amount: created.total * 100,
            currency: 'INR',
            receipt: created.orderNumber,
          });
          created.razorpayOrderId = rzpOrder.id;
          await created.save();
          razorpayData = { orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID };
        } catch { /* Razorpay not configured */ }
      }

      return reply.status(201).send({ success: true, data: { order: created, razorpay: razorpayData } });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  });

  // GET /api/orders
  fastify.get('/', { preHandler: authMiddleware }, async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const filter = { userId: request.user.sub };
    if (request.query.status) filter.status = request.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-statusHistory'),
      Order.countDocuments(filter),
    ]);

    return reply => reply.send(paginatedResponse(orders, total, page, limit));
  });

  // GET /api/orders/:id
  fastify.get('/:id', { preHandler: authMiddleware }, async (request, reply) => {
    const order = await Order.findById(request.params.id).populate('items.productId', 'title slug basePrice salePrice images');
    if (!order) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });

    if (order.userId.toString() !== request.user.sub && !request.user.roles.includes('admin')) {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Not your order' } });
    }

    return reply.send({ success: true, data: order });
  });

  // POST /api/track-order
  fastify.post('/track-order', { preHandler: validate(trackSchema) }, async (request, reply) => {
    const order = await Order.findOne({ orderNumber: request.validated.orderNumber })
      .populate('items.productId', 'title slug thumbnail');

    if (!order) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });

    // Verify email matches (check shippingAddress.email or look up user)
    const user = await User.findById(order.userId);
    if (!user || user.email !== request.validated.email) {
      // Return limited info
      return reply.send({ success: true, data: { order: { orderNumber: order.orderNumber, status: order.status, trackingNumber: order.trackingNumber, statusHistory: order.statusHistory } } });
    }

    return reply.send({ success: true, data: { order } });
  });
}
