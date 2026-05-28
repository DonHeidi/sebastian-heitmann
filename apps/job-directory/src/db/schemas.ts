import { z } from 'zod';

export const jobInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      'id must be lowercase kebab-case (a-z, 0-9, hyphens)',
    ),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().nullable(),
  url: z.string().url(),
  posted_at: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  remote: z.boolean().optional().nullable(),
  fit: z.enum(['top', 'borderline', 'skip']).optional().nullable(),
  body: z.string().default(''),
});
export type JobInput = z.infer<typeof jobInputSchema>;

export const briefingInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'id must be a YYYY-MM-DD date string'),
  date: z.coerce.date(),
  body: z.string().default(''),
});
export type BriefingInput = z.infer<typeof briefingInputSchema>;

export type JobRow = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  url: string;
  posted_at: string | null;
  tags: string;
  remote: number | null;
  fit: 'top' | 'borderline' | 'skip' | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export type BriefingRow = {
  id: string;
  date: string;
  body: string;
  created_at: string;
  updated_at: string;
};
