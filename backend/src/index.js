import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import mongoose from 'mongoose';
import * as Sentry from '@sentry/node';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { ensureIndexes } from './config/indexes.js';
import { errorHandler } from './utils/errors.js';
import { authRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { categoryRoutes } from './routes/categories.js';
import { brandRoutes } from './routes/brands.js';
import { cartRoutes } from './routes/cart.js';
import { wishlistRoutes } from './routes/wishlist.js';
import { orderRoutes } from './routes/orders.js';
import { reviewRoutes } from './routes/reviews.js';
import { couponRoutes } from './routes/coupons.js';
import { accountRoutes } from './routes/account.js';
import { miscRoutes } from './routes/misc.js';
import { adminRoutes } from './routes/admin/index.js';
import { uploadRoutes } from './routes/upload.js';
import { paymentRoutes } from './routes/payments.js';

const fastify = Fastify({
  logger: env.NODE_ENV === 'development'
    ? { level: 'info' }
    : true,
});

// Sentry
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.3 : 1.0,
  });
}

await fastify.register(helmet, { contentSecurityPolicy: false });
await fastify.register(cors, {
  origin: env.CLIENT_URL,
  credentials: true,
});

await fastify.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 },
});

await fastify.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: '1 minute',
  allowList: [],
});

fastify.setErrorHandler(errorHandler);

// Auth
await fastify.register(authRoutes, { prefix: '/api/auth' });

// Products (public)
await fastify.register(productRoutes, { prefix: '/api/products' });

// Categories & Brands (public)
await fastify.register(categoryRoutes, { prefix: '/api/categories' });
await fastify.register(brandRoutes, { prefix: '/api/brands' });

// Cart (authenticated)
await fastify.register(cartRoutes, { prefix: '/api/cart' });

// Wishlist (authenticated)
await fastify.register(wishlistRoutes, { prefix: '/api/wishlist' });

// Orders
await fastify.register(orderRoutes, { prefix: '/api/orders' });
await fastify.register(orderRoutes, { prefix: '/api' });

// Reviews
await fastify.register(reviewRoutes, { prefix: '/api/products' });
await fastify.register(reviewRoutes, { prefix: '/api' });

// Coupons (public validate)
await fastify.register(couponRoutes, { prefix: '/api/coupons' });

// Account (authenticated)
await fastify.register(accountRoutes, { prefix: '/api/account' });

// Misc (contact, newsletter, stock)
await fastify.register(miscRoutes, { prefix: '/api' });

// Admin
await fastify.register(adminRoutes, { prefix: '/api/admin' });

// Upload (admin-protected)
await fastify.register(uploadRoutes, { prefix: '/api' });

// Payments
await fastify.register(paymentRoutes, { prefix: '/api' });

// Sitemap (best-effort, for SEO)
fastify.get('/sitemap.xml', async (request, reply) => {
  const Product = mongoose.model('Product');
  const Category = mongoose.model('Category');
  const Brand = mongoose.model('Brand');
  const baseUrl = env.CLIENT_URL || 'https://agriforge.com';

  let products = [], categories = [], brands = [];
  try {
    [products, categories, brands] = await Promise.all([
      Product.find({}, { slug: 1, updatedAt: 1 }).limit(1000).lean(),
      Category.find({}, { slug: 1 }).lean(),
      Brand.find({}, { slug: 1 }).lean(),
    ]);
  } catch {}

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/search', priority: '0.6', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.4', changefreq: 'monthly' },
    { loc: '/track', priority: '0.5', changefreq: 'monthly' },
  ];

  const urls = [
    ...staticPages.map(p => `<url><loc>${baseUrl}${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`),
    ...products.map(p => `<url><loc>${baseUrl}/shop/${p.slug}</loc><lastmod>${p.updatedAt?.toISOString().split('T')[0] || ''}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
    ...categories.map(c => `<url><loc>${baseUrl}/shop?category=${c.slug}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`),
    ...brands.map(b => `<url><loc>${baseUrl}/shop?brand=${b.slug}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`),
  ];

  return reply.header('Content-Type', 'application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
});

// Health check
fastify.get('/api/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'pending',
  uptime: process.uptime(),
}));

await connectDB();
await ensureIndexes();

try {
  await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(`Server running at http://localhost:${env.PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

export default fastify;
