const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [400, 'Summary cannot exceed 400 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    coverImage: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: 'Anant Metal Finishers Technical Desk',
      trim: true
    },
    category: {
      type: String,
      default: 'Industrial Finishing Guides',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    readingTime: {
      type: String,
      default: '4 min read'
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
    isPublished: {
      type: Boolean,
      default: false
    },
    publicationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

blogSchema.index({ isPublished: 1, publicationDate: -1 });
blogSchema.index({ title: 'text', summary: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
