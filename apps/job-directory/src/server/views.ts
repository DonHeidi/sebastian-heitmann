import { marked } from 'marked';
import type { BriefingRow, JobRow } from '../db/schemas';

export type JobView = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  url: string;
  posted_at: string | null;
  tags: string[];
  remote: boolean | null;
  fit: 'top' | 'borderline' | 'skip' | null;
  body: string;
  html: string;
};

export type BriefingView = {
  id: string;
  date: string;
  body: string;
  html: string;
};

export function rowToJob(row: JobRow): JobView {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    url: row.url,
    posted_at: row.posted_at,
    tags: JSON.parse(row.tags) as string[],
    remote: row.remote == null ? null : Boolean(row.remote),
    fit: row.fit,
    body: row.body,
    html: marked.parse(row.body, { async: false }) as string,
  };
}

export function rowToBriefing(row: BriefingRow): BriefingView {
  return {
    id: row.id,
    date: row.date,
    body: row.body,
    html: marked.parse(row.body, { async: false }) as string,
  };
}
