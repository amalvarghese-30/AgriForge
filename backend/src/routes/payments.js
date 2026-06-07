import { authMiddleware } from '../middleware/auth.js';
import * as paymentService from '../services/payment.service.js';
import Order from '../models/Order.js';
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';

export async function paymentRoutes(fastify) {
  // Create Razorpay order
  fastify.post('/payments/create-order', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { orderId } = request.body || {};
    if (!orderId) throw new AppError('orderId required', 400, 'MISSING_ORDER_ID');

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');
    if (order.userId.toString() !== request.user.sub) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    const rzpOrder = await paymentService.createOrder(order.total * 100, order.orderNumber);
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    return reply.send({
      success: true,
      data: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: env.RAZORPAY_KEY_ID,
      },
    });
  });

  // Verify payment
  fastify.post('/payments/verify', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = request.body || {};

    const valid = paymentService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!valid) throw new AppError('Invalid signature', 400, 'INVALID_SIGNATURE');

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) throw new AppError('Order not found', 404, 'NOT_FOUND');

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment verified' });
    await order.save();

    return reply.send({ success: true, data: { orderId: order._id, orderNumber: order.orderNumber, status: order.status } });
  });

  // Razorpay webhook
  fastify.post('/payments/webhook', { config: { rawBody: true } }, async (request, reply) => {
    const signature = request.headers['x-razorpay-signature'];

    // Verify webhook
    const body = request.body;
    const valid = paymentService.verifyWebhookSignature(body, signature);
    if (!valid) return reply.status(400).send({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } });

    const event = body.event;

    if (event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment captured via webhook' });
        await order.save();
      }
    }

    if (event === 'order.paid') {
      const rzpOrder = body.payload.order.entity;
      const order = await Order.findOne({ razorpayOrderId: rzpOrder.id });
      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
      }
    }

    return reply.send({ success: true });
  });
}
