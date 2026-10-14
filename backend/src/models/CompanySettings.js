const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Anant Metal Finishers',
      trim: true
    },
    brandAbbreviation: {
      type: String,
      default: 'AMF',
      trim: true
    },
    logoUrl: {
      type: String,
      default: '',
      trim: true
    },
    tagline: {
      type: String,
      default: 'Industrial Metal Finishing & Electroplating',
      trim: true
    },
    heroDescription: {
      type: String,
      default: 'An industrial finishing company based in MIDC Ambad, Nashik, focused on metal finishing and electroplating capabilities.',
      trim: true
    },
    businessCategory: {
      type: String,
      default: 'Industrial metal finishing and electroplating job work',
      trim: true
    },
    locationAddress: {
      street: { type: String, default: 'G-8, MIDC Ambad' },
      city: { type: String, default: 'Nashik' },
      state: { type: String, default: 'Maharashtra' },
      country: { type: String, default: 'India' },
      postalCode: { type: String, default: '422010' }
    },
    phone: {
      type: String,
      default: '', // Editable placeholder, not invented
      trim: true
    },
    whatsappNumber: {
      type: String,
      default: '',
      trim: true
    },
    email: {
      type: String,
      default: '', // Editable placeholder, not invented
      trim: true
    },
    contactNotificationEmail: {
      type: String,
      default: '',
      trim: true
    },
    workingHours: {
      type: String,
      default: '', // Editable placeholder, not invented
      trim: true
    },
    gstNumber: {
      type: String,
      default: '', // Editable placeholder, not invented
      trim: true
    },
    aboutStory: {
      type: String,
      default: 'Anant Metal Finishers (AMF) operates an industrial metal finishing and electroplating job-work facility in MIDC Ambad, Nashik, Maharashtra. We deliver dependable job-work solutions for industrial engineering manufacturers, machinery component suppliers, and precision jobbing shops.',
      trim: true
    },
    mission: {
      type: String,
      default: 'To provide reliable, specification-conscious electroplating and metal finishing job work that strengthens Nashik’s manufacturing supply chain.',
      trim: true
    },
    values: {
      type: String,
      default: 'Strict technical accuracy, consistent surface finishing quality, transparent communication, and dependable industrial turnaround.',
      trim: true
    },
    verifiedCapabilities: {
      type: [String],
      default: ['Electroplating Job Work', 'Metal Finishing']
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010',
      trim: true
    },
    companySignboardUrl: {
      type: String,
      default: '',
      trim: true
    },
    companyExteriorUrl: {
      type: String,
      default: '',
      trim: true
    },
    companyFacilityUrl: {
      type: String,
      default: '',
      trim: true
    },
    leadership: [
      {
        name: { type: String, trim: true, default: '' },
        designation: { type: String, trim: true, default: '' },
        bio: { type: String, trim: true, default: '' },
        photoUrl: { type: String, trim: true, default: '' },
        isVerified: { type: Boolean, default: false }
      }
    ],
    socialLinks: {
      linkedin: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true }
    },
    seoDefaults: {
      metaTitle: {
        type: String,
        default: 'Anant Metal Finishers (AMF) | Electroplating Job Work | MIDC Ambad, Nashik',
        trim: true
      },
      metaDescription: {
        type: String,
        default: 'Anant Metal Finishers (AMF) provides industrial electroplating and metal finishing job work in MIDC Ambad, Nashik, Maharashtra. Discuss your finishing specifications and request a quote.',
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);

module.exports = CompanySettings;
