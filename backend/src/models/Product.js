import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['color', 'size', 'spec'], default: 'spec' },
  price: { type: Number },
  stockQuantity: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  basePrice: { type: Number, required: true },
  salePrice: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  images: [{
    url: String,
    alt: String,
  }],
  thumbnail: String,
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  specs: { type: mongoose.Schema.Types.Mixed },
  featured: { type: Boolean, default: false },
  variants: [variantSchema],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ categoryId: 1, featured: -1 });
productSchema.index({ brandId: 1 });
productSchema.index({ 'variants.sku': 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ salePrice: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
