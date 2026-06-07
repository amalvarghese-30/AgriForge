import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import Review from '../models/Review.js';
import { paginate, paginatedResponse } from '../utils/pagination.js';

const createSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().max(2000).optional(),
});

export async function reviewRoutes(fastify) {
  // GET /api/products/:productId/reviews
  fastify.get('/:productId/reviews', async (request) => {
    const { page, limit, skip } = paginate(request.query);

    const [reviews, total] = await Promise.all([
      Review.find({ productId: request.params.productId, approved: true })
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit)
        .populate('userId', 'fullName avatarUrl'),
      Review.countDocuments({ productId: request.params.productId, approved: true }),
    ]);

    return { success: true, data: paginatedResponse(reviews, total, page, limit).data, pagination: paginatedResponse(reviews, total, page, limit).pagination };
  });

  // POST /api/products/:productId/reviews
  fastify.post('/:productId/reviews', { preHandler: [authMiddleware, validate(createSchema)] }, async (request, reply) => {
    const existing = await Review.findOne({
      productId: request.params.productId,
      userId: request.user.sub,
    });
    if (existing) {
      return reply.status(409).send({ success: false, error: { code: 'CONFLICT', message: 'You already reviewed this product' } });
    }

    const review = await Review.create({
      productId: request.params.productId,
      userId: request.user.sub,
      rating: request.validated.rating,
      title: request.validated.title,
      comment: request.validated.comment,
    });

    return reply.status(201).send({ success: true, data: review });
  });

  // DELETE /api/reviews/:id
  fastify.delete('/reviews/:id', { preHandler: authMiddleware }, async (request, reply) => {
    const review = await Review.findById(request.params.id);
    if (!review) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Review not found' } });

    if (review.userId.toString() !== request.user.sub) {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Not your review' } });
    }

    await Review.findByIdAndDelete(request.params.id);
    return { success: true, data: { message: 'Review deleted' } };
  });
}
