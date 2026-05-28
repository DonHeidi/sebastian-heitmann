import { getDb } from './connection';
import type {
  BriefingInput,
  BriefingRow,
  JobInput,
  JobRow,
} from './schemas';

function toISO(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  return (date instanceof Date ? date : new Date(date)).toISOString();
}

const UPSERT_JOB = `
INSERT INTO jobs (id, title, company, location, url, posted_at, tags, remote, fit, body, created_at, updated_at)
VALUES (@id, @title, @company, @location, @url, @posted_at, @tags, @remote, @fit, @body, datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  title      = excluded.title,
  company    = excluded.company,
  location   = excluded.location,
  url        = excluded.url,
  posted_at  = excluded.posted_at,
  tags       = excluded.tags,
  remote     = excluded.remote,
  fit        = excluded.fit,
  body       = excluded.body,
  updated_at = datetime('now')
`;

const UPSERT_BRIEFING = `
INSERT INTO briefings (id, date, body, created_at, updated_at)
VALUES (@id, @date, @body, datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  date       = excluded.date,
  body       = excluded.body,
  updated_at = datetime('now')
`;

export function upsertJob(input: JobInput): void {
  getDb().prepare(UPSERT_JOB).run({
    id: input.id,
    title: input.title,
    company: input.company,
    location: input.location ?? null,
    url: input.url,
    posted_at: toISO(input.posted_at),
    tags: JSON.stringify(input.tags ?? []),
    remote: input.remote == null ? null : input.remote ? 1 : 0,
    fit: input.fit ?? null,
    body: input.body,
  });
}

export function upsertBriefing(input: BriefingInput): void {
  getDb().prepare(UPSERT_BRIEFING).run({
    id: input.id,
    date: toISO(input.date)!,
    body: input.body,
  });
}

export function listJobs(): JobRow[] {
  return getDb().prepare('SELECT * FROM jobs').all() as JobRow[];
}

export function getJobRow(id: string): JobRow | undefined {
  return getDb().prepare('SELECT * FROM jobs WHERE id = ?').get(id) as
    | JobRow
    | undefined;
}

export function listBriefings(): BriefingRow[] {
  return getDb()
    .prepare('SELECT * FROM briefings ORDER BY date DESC')
    .all() as BriefingRow[];
}

export function getBriefingRow(id: string): BriefingRow | undefined {
  return getDb()
    .prepare('SELECT * FROM briefings WHERE id = ?')
    .get(id) as BriefingRow | undefined;
}
