import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export async function wishlistRoutes(fastify) {
  fastify.addHook('preHandler', authMiddleware);

  // GET /api/wishlist
  fastify.get('/', async (request) => {
    const user = await User.findById(request.user.sub);
    const products = await Product.find({ _id: { $in: user.wishlist } })
      .select('title slug basePrice salePrice thumbnail inStock');

    return { success: true, data: { products } };
  });

  // POST /api/wishlist/:productId — toggle
  fastify.post('/:productId', async (request) => {
    const user = await User.findById(request.user.sub);
    const pid = request.params.productId;

    const idx = user.wishlist.findIndex(id => id.toString() === pid);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return { success: true, data: { inWishlist: false, wishlistCount: user.wishlist.length } };
    }

    user.wishlist.push(pid);
    await user.save();
    return { success: true, data: { inWishlist: true, wishlistCount: user.wishlist.length } };
  });
}
