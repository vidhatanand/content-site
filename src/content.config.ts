import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CLUSTERS = [
  'ai-content-creation',
  'topical-authority-seo',
  'b2b-saas-content',
  'seo-content-production',
  'thought-leadership',
] as const;

const INTENTS = ['informational', 'commercial', 'navigational', 'transactional'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('team'),
    cluster: z.enum(CLUSTERS),
    intent: z.enum(INTENTS).default('informational'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    canonicalUrl: z.string().url().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }),
});

export const collections = { blog, authors };
