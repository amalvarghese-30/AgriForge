import Brand from '../models/Brand.js';

export async function brandRoutes(fastify) {
  fastify.get('/', async () => {
    const brands = await Brand.find();
    return { success: true, data: brands };
  });

  fastify.get('/:slug', async (request, reply) => {
    const brand = await Brand.findOne({ slug: request.params.slug });
    if (!brand) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Brand not found' } });
    return { success: true, data: brand };
  });
}
