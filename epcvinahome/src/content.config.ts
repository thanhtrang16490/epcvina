import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const aboutCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    section: z.string(),
    order: z.number(),
    content: z.string(),
  }),
});

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['mep', 'energy']),
    icon: z.string(),
    description: z.string(),
    features: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    location: z.string(),
    year: z.number(),
    description: z.string(),
    image: z.string(),
    highlights: z.array(z.string()).optional(),
  }),
});

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('EPCVINA'),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  about: aboutCollection,
  services: servicesCollection,
  projects: projectsCollection,
  news: newsCollection,
};
