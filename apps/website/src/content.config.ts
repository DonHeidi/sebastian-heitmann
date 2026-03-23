import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    excerpt: z.string(),
    image: image(),
    order: z.number(),
  }),
});

export const collections = { cases };
