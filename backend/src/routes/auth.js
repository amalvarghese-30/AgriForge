import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import * as authService from '../services/auth.service.js';
import * as emailService from '../services/email.service.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(fastify) {
  fastify.post('/register', {
    preHandler: validate(registerSchema),
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
  }, async (request, reply) => {
    const data = await authService.register(request.validated);
    emailService.sendWelcome(data.user).catch(() => {});
    return reply.status(201).send({ success: true, data });
  });

  fastify.post('/login', {
    preHandler: validate(loginSchema),
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
  }, async (request, reply) => {
    const data = await authService.login(request.validated);
    return reply.send({ success: true, data });
  });

  fastify.post('/refresh', { preHandler: validate(refreshSchema) }, async (request, reply) => {
    const data = await authService.refreshToken(request.validated.refreshToken);
    return reply.send({ success: true, data });
  });

  fastify.post('/logout', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { refreshToken } = request.body || {};
    await authService.logout(request.user.sub, refreshToken);
    return reply.send({ success: true, data: { message: 'Logged out successfully' } });
  });

  fastify.get('/me', { preHandler: [authMiddleware] }, async (request, reply) => {
    const user = await authService.getMe(request.user.sub);
    return reply.send({ success: true, data: user });
  });
}
