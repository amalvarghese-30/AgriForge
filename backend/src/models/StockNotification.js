import mongoose from 'mongoose';

const stockNotificationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  variantSku: String,
  notified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

stockNotificationSchema.index({ productId: 1, notified: 1 });

const StockNotification = mongoose.model('StockNotification', stockNotificationSchema);
export default StockNotification;
