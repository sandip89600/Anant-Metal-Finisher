const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Factory', 'Exterior', 'Machinery', 'Components', 'Finished Work', 'Company', 'Other'],
      default: 'Finished Work'
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isWorkItem: {
      type: Boolean,
      default: true // Whether displayed on /our-work portfolio in addition to /gallery
    },
    order: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
    capturedDate: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

gallerySchema.index({ category: 1, isFeatured: 1, order: 1 });
gallerySchema.index({ isWorkItem: 1, order: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
