import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../utils/errors.js';

export async function uploadRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', requireRole('admin', 'super_admin'));

  fastify.post('/admin/upload', async (request, reply) => {
    const file = await request.file();
    if (!file) throw new AppError('No file provided', 400, 'MISSING_FILE');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError('Invalid file type. Allowed: jpeg, png, webp, gif', 400, 'INVALID_FILE_TYPE');
    }

    const buffer = await file.toBuffer();

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'agriforge/products', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });

    return reply.send({ success: true, data: { url: result.secure_url, public_id: result.public_id } });
  });
}
