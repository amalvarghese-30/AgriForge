import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  discountAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: { type: Number, default: 0 },
  currentUsage: { type: Number, default: 0 },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  redemptions: [redemptionSchema],
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
