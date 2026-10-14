const { z } = require('zod');

const contactEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  companyName: z.string().max(150).optional().default(''),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(30).optional().default(''),
  enquiryType: z.enum(['contact', 'quote', 'general']).default('contact'),
  relatedProductOrService: z.string().max(150).optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to the privacy notice to submit your enquiry' })
  })
});

const quoteEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  companyName: z.string().max(150).optional().default(''),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a contact phone number for quote discussion').max(30),
  enquiryType: z.literal('quote').default('quote'),
  relatedProductOrService: z.string().max(150).optional().default('Electroplating Job Work'),
  message: z.string().optional().default(''),
  requirements: z.object({
    componentName: z.string().min(2, 'Component or service name is required').max(150),
    estimatedQuantity: z.string().max(100).optional().default(''),
    material: z.string().max(100).optional().default(''),
    requiredFinish: z.string().max(100).optional().default(''),
    targetDate: z.string().max(100).optional().default(''),
    additionalNotes: z.string().max(2000).optional().default('')
  }),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to the privacy notice to submit your quote request' })
  })
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'completed', 'spam'])
});

const addNoteSchema = z.object({
  note: z.string().min(2, 'Note cannot be empty').max(1000)
});

module.exports = {
  contactEnquirySchema,
  quoteEnquirySchema,
  updateStatusSchema,
  addNoteSchema
};
