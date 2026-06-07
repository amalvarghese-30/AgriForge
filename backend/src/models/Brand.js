import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  logo: String,
  productCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
