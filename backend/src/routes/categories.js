import Category from '../models/Category.js';

export async function categoryRoutes(fastify) {
  fastify.get('/', async () => {
    const categories = await Category.find();
    return { success: true, data: categories };
  });

  fastify.get('/:slug', async (request, reply) => {
    const cat = await Category.findOne({ slug: request.params.slug });
    if (!cat) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
    return { success: true, data: cat };
  });
}
