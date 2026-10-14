const { z } = require('zod');

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(400),
  content: z.string().min(30, 'Content must be at least 30 characters'),
  coverImage: z.string().optional().default(''),
  author: z.string().optional().default('Anant Metal Finishers Technical Desk'),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  readingTime: z.string().optional().default('4 min read'),
  seoTitle: z.string().max(120).optional().default(''),
  seoDescription: z.string().max(200).optional().default(''),
  isPublished: z.boolean().optional().default(false),
  publicationDate: z.string().or(z.date()).optional()
});

const blogUpdateSchema = blogSchema.partial();

module.exports = {
  blogSchema,
  blogUpdateSchema
};
