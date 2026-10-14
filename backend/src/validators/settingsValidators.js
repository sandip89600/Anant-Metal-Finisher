const { z } = require('zod');

const companySettingsSchema = z.object({
  companyName: z.string().min(2).max(100).optional(),
  brandAbbreviation: z.string().max(20).optional(),
  businessCategory: z.string().max(200).optional(),
  locationAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional()
  }).optional(),
  phone: z.string().max(40).optional(),
  whatsappNumber: z.string().max(40).optional(),
  email: z.string().email().or(z.literal('')).optional(),
  contactNotificationEmail: z.string().email().or(z.literal('')).optional(),
  workingHours: z.string().max(100).optional(),
  gstNumber: z.string().max(50).optional(),
  aboutStory: z.string().max(2000).optional(),
  mission: z.string().max(1000).optional(),
  values: z.string().max(1000).optional(),
  verifiedCapabilities: z.array(z.string()).optional(),
  googleMapsUrl: z.string().max(500).optional(),
  socialLinks: z.object({
    linkedin: z.string().max(200).optional(),
    facebook: z.string().max(200).optional(),
    instagram: z.string().max(200).optional(),
    twitter: z.string().max(200).optional()
  }).optional(),
  seoDefaults: z.object({
    metaTitle: z.string().max(150).optional(),
    metaDescription: z.string().max(300).optional()
  }).optional()
});

module.exports = {
  companySettingsSchema
};
