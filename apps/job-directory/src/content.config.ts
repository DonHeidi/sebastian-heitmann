import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const jobs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    url: z.string().url(),
    posted_at: z.coerce.date().optional(),
    tags: z.array(z.string()).optional().default([]),
    remote: z.boolean().optional(),
  }),
});

export const collections = { jobs };
