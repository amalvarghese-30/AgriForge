import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import { AppError } from '../utils/errors.js';

export async function accountRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware);

  // GET /api/account/profile
  fastify.get('/profile', async (request) => {
    const user = await User.findById(request.user.sub).select('-passwordHash -refreshTokens');
    return { success: true, data: user };
  });

  // PUT /api/account/profile
  fastify.put('/profile', async (request) => {
    const { fullName, phone, avatarUrl } = request.body || {};
    const update = {};
    if (fullName) update.fullName = fullName;
    if (phone !== undefined) update.phone = phone;
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(request.user.sub, update, { new: true }).select('-passwordHash -refreshTokens');
    return { success: true, data: user };
  });

  // GET /api/account/addresses
  fastify.get('/addresses', async (request) => {
    const user = await User.findById(request.user.sub);
    return { success: true, data: { addresses: user.addresses || [] } };
  });

  // POST /api/account/addresses
  fastify.post('/addresses', async (request, reply) => {
    const user = await User.findById(request.user.sub);
    const addr = request.body;

    if (addr.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push(addr);
    await user.save();

    return reply.status(201).send({ success: true, data: { address: user.addresses[user.addresses.length - 1] } });
  });

  // PUT /api/account/addresses/:id
  fastify.put('/addresses/:id', async (request, reply) => {
    const user = await User.findById(request.user.sub);
    const addr = user.addresses.id(request.params.id);
    if (!addr) throw new AppError('Address not found', 404, 'NOT_FOUND');

    Object.assign(addr, request.body);

    if (request.body.isDefault) {
      user.addresses.forEach(a => { if (a._id.toString() !== request.params.id) a.isDefault = false; });
    }

    await user.save();
    return { success: true, data: { address: addr } };
  });

  // DELETE /api/account/addresses/:id
  fastify.delete('/addresses/:id', async (request) => {
    const user = await User.findById(request.user.sub);
    user.addresses = user.addresses.filter(a => a._id.toString() !== request.params.id);
    await user.save();
    return { success: true, data: { message: 'Address deleted' } };
  });
}
