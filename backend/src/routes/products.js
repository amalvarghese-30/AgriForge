import { z } from 'zod';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import { paginate, paginatedResponse } from '../utils/pagination.js';

export async function productRoutes(fastify) {
  // GET /api/products — listing with filters
  fastify.get('/', async (request, reply) => {
    const { page, limit, skip } = paginate(request.query);
    const { sort, category, brand, minPrice, maxPrice, featured, inStock } = request.query;

    const filter = {};
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.categoryId = cat._id;
      else return reply.send(paginatedResponse([], 0, page, limit));
    }
    if (brand) {
      const b = await Brand.findOne({ slug: brand });
      if (b) filter.brandId = b._id;
      else return reply.send(paginatedResponse([], 0, page, limit));
    }
    if (minPrice || maxPrice) {
      filter.salePrice = {};
      if (minPrice) filter.salePrice.$gte = Number(minPrice);
      if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
    }
    if (featured === 'true') filter.featured = true;
    if (inStock === 'true') filter.inStock = true;

    const sortObj = {};
    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.slice(1) : sort;
      sortObj[field] = isDesc ? -1 : 1;
    } else {
      sortObj.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name slug')
        .populate('brandId', 'name slug')
        .select('-description -specs -variants -images'),
      Product.countDocuments(filter),
    ]);

    return reply.send(paginatedResponse(products, total, page, limit));
  });

  // GET /api/products/search
  fastify.get('/search', async (request, reply) => {
    const { page, limit, skip } = paginate(request.query);
    const q = request.query.q;
    if (!q || q.length < 2) return reply.send(paginatedResponse([], 0, page, limit));

    const [products, total] = await Promise.all([
      Product.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name slug')
        .populate('brandId', 'name slug')
        .select('-description -specs -variants -images'),
      Product.countDocuments({ $text: { $search: q } }),
    ]);

    return reply.send(paginatedResponse(products, total, page, limit));
  });

  // GET /api/products/best-sellers
  fastify.get('/best-sellers', async () => {
    const products = await Product.find({ featured: true, inStock: true })
      .sort({ 'ratings.count': -1, createdAt: -1 })
      .limit(8)
      .populate('categoryId', 'name slug')
      .populate('brandId', 'name slug')
      .select('-description -specs -variants');
    return { success: true, data: { products } };
  });

  // GET /api/products/:slug
  fastify.get('/:slug', async (request, reply) => {
    const product = await Product.findOne({ slug: request.params.slug })
      .populate('categoryId', 'name slug')
      .populate('brandId', 'name slug');

    if (!product) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    return reply.send({ success: true, data: product });
  });

  // GET /api/products/:slug/related
  fastify.get('/:slug/related', async (request, reply) => {
    const product = await Product.findOne({ slug: request.params.slug });
    if (!product) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    const related = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      inStock: true,
    })
      .limit(8)
      .populate('categoryId', 'name slug')
      .populate('brandId', 'name slug')
      .select('-description -specs -variants');

    return reply.send({ success: true, data: { products: related } });
  });

  // POST /api/products/batch — get products by IDs
  fastify.post('/batch', async (request) => {
    const { ids } = request.body || {};
    if (!ids?.length) return { success: true, data: [] };
    const products = await Product.find({ _id: { $in: ids } })
      .select('-description -specs');
    return { success: true, data: products };
  });
}
