import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import Review from '../../models/Review.js';
import Coupon from '../../models/Coupon.js';
import Category from '../../models/Category.js';
import Brand from '../../models/Brand.js';
import ContactMessage from '../../models/ContactMessage.js';
import NewsletterSubscriber from '../../models/NewsletterSubscriber.js';
import StockNotification from '../../models/StockNotification.js';
import { authMiddleware } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { paginate, paginatedResponse } from '../../utils/pagination.js';
import * as emailService from '../../services/email.service.js';

export async function adminRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', requireRole('admin', 'super_admin'));

  // GET /api/admin/stats
  fastify.get('/stats', async () => {
    const [totalProducts, totalOrders, totalRevenue, totalCustomers, pendingReviews, unreadMessages] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]).then((r) => r[0]?.total || 0),
      User.countDocuments({ roles: 'customer' }),
      Review.countDocuments({ approved: false }),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        pendingReviews,
        lowStockProducts: await Product.countDocuments({ stockQuantity: { $lt: 5 }, inStock: true }),
        unreadMessages,
      },
    };
  });

  // Products
  fastify.get('/products', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('categoryId', 'name').populate('brandId', 'name'),
      Product.countDocuments(),
    ]);
    return { success: true, ...paginatedResponse(products, total, page, limit) };
  });

  fastify.get('/products/:id', async (request, reply) => {
    const p = await Product.findById(request.params.id).populate('categoryId', 'name').populate('brandId', 'name');
    if (!p) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: p };
  });

  fastify.post('/products', async (request, reply) => {
    const p = await Product.create(request.body);
    return reply.status(201).send({ success: true, data: p });
  });

  fastify.put('/products/:id', async (request, reply) => {
    const p = await Product.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!p) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: p };
  });

  fastify.delete('/products/:id', async (request) => {
    await Product.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Orders
  fastify.get('/orders', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const filter = {};
    if (request.query.status) filter.status = request.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'email fullName'),
      Order.countDocuments(filter),
    ]);
    return { success: true, ...paginatedResponse(orders, total, page, limit) };
  });

  fastify.put('/orders/:id', async (request, reply) => {
    const { status, trackingNumber } = request.body || {};
    const order = await Order.findById(request.params.id).populate('userId', 'email fullName');
    if (!order) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });

    if (status) {
      order.status = status;
      order.statusHistory.push({ status, timestamp: new Date(), note: `Status changed to ${status}` });
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    // Send shipping email when status changes to shipped
    if (status === 'shipped') {
      emailService.sendShippingUpdate(order).catch(() => {});
    }

    return { success: true, data: order };
  });

  // Reviews
  fastify.get('/reviews', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [reviews, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('productId', 'title slug').populate('userId', 'fullName email'),
      Review.countDocuments(),
    ]);
    return { success: true, ...paginatedResponse(reviews, total, page, limit) };
  });

  fastify.put('/reviews/:id', async (request, reply) => {
    const { approved, adminResponse } = request.body || {};
    const review = await Review.findByIdAndUpdate(request.params.id, { approved, adminResponse }, { new: true });
    if (!review) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: review };
  });

  fastify.delete('/reviews/:id', async (request) => {
    await Review.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Coupons
  fastify.get('/coupons', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [coupons, total] = await Promise.all([Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit), Coupon.countDocuments()]);
    return { success: true, ...paginatedResponse(coupons, total, page, limit) };
  });

  fastify.post('/coupons', async (request, reply) => {
    const c = await Coupon.create(request.body);
    return reply.status(201).send({ success: true, data: c });
  });

  fastify.put('/coupons/:id', async (request, reply) => {
    const c = await Coupon.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!c) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: c };
  });

  fastify.delete('/coupons/:id', async () => {
    await Coupon.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Categories
  fastify.get('/categories', async () => {
    const cats = await Category.find();
    return { success: true, data: cats };
  });

  fastify.post('/categories', async (request, reply) => {
    const c = await Category.create(request.body);
    return reply.status(201).send({ success: true, data: c });
  });

  fastify.put('/categories/:id', async (request, reply) => {
    const c = await Category.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!c) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: c };
  });

  fastify.delete('/categories/:id', async () => {
    await Category.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Brands
  fastify.get('/brands', async () => {
    const brands = await Brand.find();
    return { success: true, data: brands };
  });

  fastify.post('/brands', async (request, reply) => {
    const b = await Brand.create(request.body);
    return reply.status(201).send({ success: true, data: b });
  });

  fastify.put('/brands/:id', async (request, reply) => {
    const b = await Brand.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!b) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: b };
  });

  fastify.delete('/brands/:id', async () => {
    await Brand.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Messages
  fastify.get('/messages', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [messages, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(),
    ]);
    return { success: true, ...paginatedResponse(messages, total, page, limit) };
  });

  fastify.put('/messages/:id', async (request, reply) => {
    const m = await ContactMessage.findByIdAndUpdate(request.params.id, request.body, { new: true });
    if (!m) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
    return { success: true, data: m };
  });

  fastify.delete('/messages/:id', async () => {
    await ContactMessage.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Subscribers
  fastify.get('/subscribers', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [subs, total] = await Promise.all([
      NewsletterSubscriber.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      NewsletterSubscriber.countDocuments(),
    ]);
    return { success: true, ...paginatedResponse(subs, total, page, limit) };
  });

  fastify.delete('/subscribers/:id', async () => {
    await NewsletterSubscriber.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });

  // Stock alerts
  fastify.get('/stock-alerts', async (request) => {
    const { page, limit, skip } = paginate(request.query);
    const [alerts, total] = await Promise.all([
      StockNotification.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('productId', 'title slug'),
      StockNotification.countDocuments(),
    ]);
    return { success: true, ...paginatedResponse(alerts, total, page, limit) };
  });

  fastify.post('/stock-alerts/:id/notify', async (request, reply) => {
    const n = await StockNotification.findById(request.params.id).populate('productId', 'title');
    if (!n) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });

    n.notified = true;
    await n.save();

    const productTitle = n.productId?.title || 'Product';
    emailService.sendStockNotification(productTitle, n.email).catch(() => {});

    return { success: true, data: n };
  });

  fastify.delete('/stock-alerts/:id', async () => {
    await StockNotification.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Deleted' } };
  });
}
