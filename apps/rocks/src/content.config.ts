import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['case-study', 'project']).default('case-study'),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    cover: image().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
