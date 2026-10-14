const mongoose = require('mongoose');

const internalNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      default: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const enquirySchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
      default: ''
    },
    enquiryType: {
      type: String,
      enum: ['contact', 'quote', 'general'],
      default: 'contact'
    },
    relatedProductOrService: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      required: [true, 'Message or requirements text is required'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters']
    },
    requirements: {
      componentName: { type: String, default: '' },
      estimatedQuantity: { type: String, default: '' },
      material: { type: String, default: '' },
      requiredFinish: { type: String, default: '' },
      targetDate: { type: String, default: '' },
      additionalNotes: { type: String, default: '' },
      attachmentUrl: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'spam'],
      default: 'new'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    internalNotes: {
      type: [internalNoteSchema],
      default: []
    },
    consentGiven: {
      type: Boolean,
      required: [true, 'Consent to privacy policy is required'],
      default: false
    },
    ipAddress: {
      type: String,
      default: ''
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailError: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
