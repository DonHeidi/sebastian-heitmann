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
    /* Product screenshots for the detail page's device reel (task 28). Every
     * device is optional and any subset renders — the section is skipped
     * entirely when the group is absent or empty, so entries without
     * screenshots stay untouched. Source aspect ratios that crop cleanly:
     * desktop 16/10, tablet 3/4 (portrait), phone 9/19.5. Anything taller is
     * fine — the frames crop from the BOTTOM (`object-top`). */
    showcase: z
      .object({
        desktop: image().optional(),
        tablet: image().optional(),
        phone: image().optional(),
      })
      .optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
