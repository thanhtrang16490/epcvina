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
    main_image: z.string().optional(),
    is_available: z.boolean().default(true),
    show_on_homepage: z.boolean().optional(),
    product_type: z.string().optional(),
    voltage: z.string().optional(),
    warranty_years: z.number().optional(),
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

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    customer: z.string(),
    capacity: z.string(),
    system_type: z.string(),
    location: z.string(),
    completion_date: z.string(),
    equipment: z.string(),
    equipment_items: z.array(z.object({
      label: z.string(),
      value: z.string(),
      product_slug: z.string().optional(),
    })).optional(),
    special_notes: z.string().optional(),
    description: z.string(),
    challenges: z.string().optional(),
    solution: z.string().optional(),
    results: z.string().optional(),
    // Performance & ROI data
    performance: z.object({
      annual_production_kwh: z.number().optional(),
      annual_savings_vnd: z.number().optional(),
      payback_years: z.number().optional(),
      co2_reduction_kg: z.number().optional(),
      self_sufficiency_percent: z.number().optional(),
    }).optional(),
    // FAQ section for rich snippets
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    testimonial: z.object({
      quote: z.string(),
      rating: z.number().min(1).max(5).default(5),
      aspect: z.string().optional(), // e.g., "Tiết kiệm chi phí", "Chất lượng dịch vụ"
    }).optional(),
    image: z.string(),
    gallery: z.array(z.string()).optional(),
    is_featured: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
  products: productsCollection,
  combos: combosCollection,
  projects: projectsCollection,
};
