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

const combosCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/combos' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    system_type: z.enum(['on-grid', 'hybrid']),
    phase: z.enum(['1-phase', '3-phase']),
    voltage: z.enum(['low', 'high']).nullable(),
    power_kw: z.number(),
    battery_kwh: z.number().optional(),
    investment_million_vnd: z.number(),
    production_min_kwh: z.number(),
    production_max_kwh: z.number(),
    payback_years: z.number(),
    payback_label: z.string(),
    roof_area_m2: z.number().optional(),
    is_active: z.boolean().default(true),
    display_order: z.number(),
  }),
});

export const collections = {
  blog: blogCollection,
  products: productsCollection,
  combos: combosCollection,
};
