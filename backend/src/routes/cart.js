import { z } from 'zod';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errors.js';

const addItemSchema = z.object({
  productId: z.string(),
  variantSku: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1).default(1),
});

const mergeSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantSku: z.string().optional().nullable(),
    quantity: z.number().int().min(1),
  })),
});

export async function cartRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware);

  // GET /api/cart
  fastify.get('/', async (request) => {
    const user = await User.findById(request.user.sub).populate('cart.productId', 'title slug basePrice salePrice thumbnail inStock');

    const items = (user.cart || []).map(item => ({
      _id: item._id,
      productId: item.productId,
      variantSku: item.variantSku,
      quantity: item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => {
      const price = item.productId?.salePrice || item.productId?.basePrice || 0;
      return sum + price * item.quantity;
    }, 0);

    return {
      success: true,
      data: {
        items,
        summary: { itemCount: items.reduce((s, i) => s + i.quantity, 0), subtotal },
      },
    };
  });

  // POST /api/cart
  fastify.post('/', { preHandler: validate(addItemSchema) }, async (request) => {
    const { productId, variantSku, quantity } = request.validated;
    const user = await User.findById(request.user.sub);

    const existing = user.cart.find(c =>
      c.productId.toString() === productId && c.variantSku === (variantSku || null)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, variantSku: variantSku || null, quantity });
    }

    await user.save();

    const updated = await User.findById(request.user.sub).populate('cart.productId', 'title slug basePrice salePrice thumbnail inStock');
    const items = updated.cart.map(item => ({
      _id: item._id,
      productId: item.productId,
      variantSku: item.variantSku,
      quantity: item.quantity,
    }));

    return { success: true, data: { cart: { items, summary: getSummary(items) } } };
  });

  // PUT /api/cart/:itemId
  fastify.put('/:itemId', async (request) => {
    const { quantity } = request.body || {};
    const qty = Number(quantity);
    if (!qty || qty < 1) throw new AppError('Quantity must be at least 1', 400, 'VALIDATION_ERROR');

    const user = await User.findById(request.user.sub);
    const item = user.cart.id(request.params.itemId);
    if (!item) throw new AppError('Item not found in cart', 404, 'NOT_FOUND');

    item.quantity = qty;
    await user.save();

    const updated = await User.findById(request.user.sub).populate('cart.productId', 'title slug basePrice salePrice thumbnail inStock');
    return { success: true, data: { cart: { items: updated.cart, summary: getSummary(updated.cart) } } };
  });

  // DELETE /api/cart/:itemId
  fastify.delete('/:itemId', async (request) => {
    const user = await User.findById(request.user.sub);
    user.cart = user.cart.filter(c => c._id.toString() !== request.params.itemId);
    await user.save();

    const updated = await User.findById(request.user.sub).populate('cart.productId', 'title slug basePrice salePrice thumbnail inStock');
    return { success: true, data: { cart: { items: updated.cart, summary: getSummary(updated.cart) } } };
  });

  // DELETE /api/cart
  fastify.delete('/', async (request) => {
    await User.findByIdAndUpdate(request.user.sub, { $set: { cart: [] } });
    return { success: true, data: { cart: { items: [], summary: { itemCount: 0, subtotal: 0 } } } };
  });

  // POST /api/cart/merge
  fastify.post('/merge', { preHandler: validate(mergeSchema) }, async (request) => {
    const user = await User.findById(request.user.sub);

    for (const guestItem of request.validated.items) {
      const existing = user.cart.find(c =>
        c.productId.toString() === guestItem.productId && c.variantSku === (guestItem.variantSku || null)
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        user.cart.push({
          productId: guestItem.productId,
          variantSku: guestItem.variantSku || null,
          quantity: guestItem.quantity,
        });
      }
    }

    await user.save();

    const updated = await User.findById(request.user.sub).populate('cart.productId', 'title slug basePrice salePrice thumbnail inStock');
    return { success: true, data: { cart: { items: updated.cart, summary: getSummary(updated.cart) } } };
  });
}

function getSummary(items) {
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.salePrice || item.productId?.basePrice || 0;
    return sum + price * item.quantity;
  }, 0);
  return { itemCount: count, subtotal };
}
