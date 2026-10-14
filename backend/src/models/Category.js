const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['product', 'blog'],
      default: 'product'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters']
    }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ slug: 1, type: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
