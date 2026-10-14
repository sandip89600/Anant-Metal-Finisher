const mongoose = require('mongoose');

const technicalSpecSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service or Product name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    itemType: {
      type: String,
      enum: ['service', 'product'],
      default: 'service' // Primary business is electroplating job work
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Metal Finishing'
    },
    summary: {
      type: String,
      required: [true, 'Short summary is required'],
      trim: true,
      maxlength: [300, 'Summary cannot exceed 300 characters']
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
      trim: true
    },
    mainImage: {
      type: String,
      default: ''
    },
    gallery: {
      type: [String],
      default: []
    },
    materials: {
      type: [String],
      default: []
    },
    technicalSpecs: {
      type: [technicalSpecSchema],
      default: []
    },
    availabilityNotes: {
      type: String,
      default: 'Job work subject to component inspection and specification review.'
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [120, 'SEO title cannot exceed 120 characters']
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'SEO description cannot exceed 200 characters']
    },
    isVerified: {
      type: Boolean,
      default: false // Strict factual accuracy rule: unverified until admin confirms
    },
    isPublished: {
      type: Boolean,
      default: false // Only verified & published items appear on the public website
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ isPublished: 1, isVerified: 1, sortOrder: 1 });
productSchema.index({ name: 'text', summary: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
