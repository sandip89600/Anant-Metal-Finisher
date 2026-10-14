const { z } = require('zod');

const gallerySchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z.string().max(1000).optional().default(''),
  category: z.enum([
    'Factory',
    'Exterior',
    'Machinery',
    'Components',
    'Finished Work',
    'Company',
    'Other'
  ], {
    required_error: 'Valid category is required'
  }),
  imageUrl: z
    .string({ required_error: 'Image URL is required' })
    .min(1, 'Image URL cannot be empty'),
  thumbnailUrl: z.string().optional().default(''),
  isFeatured: z.boolean().optional().default(false),
  isWorkItem: z.boolean().optional().default(true),
  order: z.coerce.number().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  capturedDate: z.string().optional().default('')
});

const galleryUpdateSchema = gallerySchema.partial();

module.exports = {
  gallerySchema,
  galleryUpdateSchema
};
