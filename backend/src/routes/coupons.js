import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import Coupon from '../models/Coupon.js';

const validateSchema = z.object({
  code: z.string().min(1),
  cartTotal: z.number().min(0),
});

export async function couponRoutes(fastify) {
  // POST /api/coupons/validate
  fastify.post('/validate', { preHandler: validate(validateSchema) }, async (request, reply) => {
    const { code, cartTotal } = request.validated;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    });

    if (!coupon) return reply.status(400).send({ success: false, error: { code: 'INVALID_COUPON', message: 'Invalid coupon code' } });
    if (coupon.usageLimit > 0 && coupon.currentUsage >= coupon.usageLimit) {
      return reply.status(400).send({ success: false, error: { code: 'INVALID_COUPON', message: 'Coupon usage limit reached' } });
    }
    if (cartTotal < coupon.minOrderValue) {
      return reply.status(400).send({ success: false, error: { code: 'INVALID_COUPON', message: `Minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required` } });
    }

    let discount = coupon.type === 'percentage'
      ? Math.round(cartTotal * coupon.value / 100)
      : coupon.value;

    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    return { success: true, data: { valid: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } } };
  });
}
