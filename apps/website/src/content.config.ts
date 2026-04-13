import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    description: z.string(),
    email: z.string().email().optional(),
    avatar: image(),
    socials: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional().default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.enum([
      'solopreneurship-career',
      'leadership-management',
      'technical-decisions',
      'shipping-with-ai',
      'mental-health',
    ]),
    subline: z.string().optional(),
    abstract: z.string(),
    type: z.enum(['article', 'case-study', 'blog-post', 'series-part']),
    tags: z.array(z.string()).optional().default([]),
    author: z.string(),
    headerImage: image().optional(),
    headerDetailImage: image().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    authorship: z.enum(['human', 'ai-assisted', 'agent-written']).optional().default('human'),
    aiTranslated: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    displayFrontpage: z.boolean().optional().default(false),
    order: z.number().optional(),
    series: z.object({
      name: z.string(),
      part: z.number(),
    }).optional(),
  }),
});

export const collections = { authors, articles };
