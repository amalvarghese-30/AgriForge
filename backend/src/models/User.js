import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: String,
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: true });

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  fullName: { type: String, required: true },
  avatarUrl: String,
  phone: String,
  roles: {
    type: [String],
    enum: ['super_admin', 'admin', 'dealer', 'vendor', 'customer'],
    default: ['customer'],
  },
  authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
  googleId: { type: String, unique: true, sparse: true },
  addresses: [addressSchema],
  cart: [cartItemSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  refreshTokens: [refreshTokenSchema],
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') && this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.hasRole = function (...roles) {
  return roles.some((role) => this.roles.includes(role));
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

userSchema.index({ roles: 1 });
userSchema.index({ 'cart.productId': 1 });
userSchema.index({ wishlist: 1 });
userSchema.index({ 'refreshTokens.token': 1 });

const User = mongoose.model('User', userSchema);
export default User;
