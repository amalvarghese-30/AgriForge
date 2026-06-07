import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import StockNotification from '../models/StockNotification.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

const stockNotifySchema = z.object({
  productId: z.string(),
  variantSku: z.string().optional(),
  email: z.string().email().optional(),
});

export async function miscRoutes(fastify) {
  // POST /api/contact
  fastify.post('/contact', { preHandler: validate(contactSchema) }, async (request, reply) => {
    await ContactMessage.create(request.validated);
    return reply.status(201).send({ success: true, data: { message: 'Message sent successfully' } });
  });

  // POST /api/newsletter/subscribe
  fastify.post('/newsletter/subscribe', { preHandler: validate(newsletterSchema) }, async (request, reply) => {
    const exists = await NewsletterSubscriber.findOne({ email: request.validated.email });
    if (!exists) {
      await NewsletterSubscriber.create({ email: request.validated.email });
    }
    return reply.status(201).send({ success: true, data: { message: 'Subscribed successfully' } });
  });

  // POST /api/stock-notifications
  fastify.post('/stock-notifications', { preHandler: [optionalAuth, validate(stockNotifySchema)] }, async (request, reply) => {
    const email = request.validated.email || request.user?.email;
    if (!email) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email is required' } });
    }

    await StockNotification.create({
      productId: request.validated.productId,
      userId: request.user?.sub || null,
      variantSku: request.validated.variantSku,
      email,
    });

    return reply.status(201).send({ success: true, data: { message: 'You will be notified when this product is back in stock' } });
  });
}
