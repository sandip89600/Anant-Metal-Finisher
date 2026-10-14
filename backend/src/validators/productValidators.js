const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  slug: z.string().optional(),
  itemType: z.enum(['service', 'product']).default('service'),
  category: z.string().min(2, 'Category is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(300),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  mainImage: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  technicalSpecs: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1)
    })
  ).optional().default([]),
  availabilityNotes: z.string().optional().default(''),
  seoTitle: z.string().max(120).optional().default(''),
  seoDescription: z.string().max(200).optional().default(''),
  isVerified: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0)
});

const productUpdateSchema = productSchema.partial();

module.exports = {
  productSchema,
  productUpdateSchema
};
