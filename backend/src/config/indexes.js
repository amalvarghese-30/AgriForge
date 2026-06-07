// MongoDB index creation for performance
// Run once at startup to ensure indexes exist

import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';

export async function ensureIndexes() {
  // Additional compound indexes not covered by Mongoose schema definitions

  await Product.collection.createIndexes([
    { key: { categoryId: 1, createdAt: -1 }, name: 'product_category_date' },
    { key: { basePrice: 1 }, name: 'product_price' },
    { key: { featured: 1, inStock: 1 }, name: 'product_featured_stock' },
  ]).catch(() => {});

  await Order.collection.createIndexes([
    { key: { status: 1 }, name: 'order_status' },
  ]).catch(() => {});

  await Review.collection.createIndexes([
    { key: { productId: 1, createdAt: -1 }, name: 'review_product_date' },
  ]).catch(() => {});

  await Coupon.collection.createIndexes([
    { key: { isActive: 1, expiresAt: 1 }, name: 'coupon_active_expiry' },
  ]).catch(() => {});

  console.log('Database indexes ensured');
}
