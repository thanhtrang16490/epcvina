import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('EPC Solar'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const productsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    brand: z.string(),
    category: z.string(),
    model: z.string(),
    description: z.string(),
    price: z.number().optional(),
    specifications: z.record(z.string(), z.string()).optional(),
    features: z.array(z.string()).optional(),
    warranty: z.string().optional(),
    main_image: z.string(),
    is_available: z.boolean().default(true),
  }),
});

export const collections = {
  blog: blogCollection,
  products: productsCollection,
};
