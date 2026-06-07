import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: String,
  approved: { type: Boolean, default: false },
  adminResponse: String,
}, {
  timestamps: true,
});

reviewSchema.index({ productId: 1, approved: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Update product ratings after save
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const stats = await this.constructor.aggregate([
    { $match: { productId: this.productId, approved: true } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(this.productId, {
    'ratings.average': Math.round((stats[0]?.average || 0) * 10) / 10,
    'ratings.count': stats[0]?.count || 0,
  });
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
