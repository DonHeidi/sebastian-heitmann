/**
 * Per-job outreach business logic.
 *
 * The "outreach" is the markdown text the curator (or agent) drafts as the
 * actual message to send for a posting. One row per job (1:1, keyed by
 * job_id). Read returns both raw body and rendered HTML.
 *
 * Used by both the HTTP API (`routes/api/outreach.$job_id.ts`) and internal
 * server functions (`server/content.ts`).
 */

import { marked } from 'marked';
import { getDb } from '../db/connection';

type OutreachRow = {
  job_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type Outreach = OutreachRow & { html: string };

function rowToOutreach(row: OutreachRow): Outreach {
  return {
    ...row,
    html: marked.parse(row.body, { async: false }) as string,
  };
}

export function getOutreach(jobId: string): Outreach | null {
  const row = getDb()
    .prepare('SELECT * FROM outreach WHERE job_id = ?')
    .get(jobId) as OutreachRow | undefined;
  return row ? rowToOutreach(row) : null;
}

export type SaveResult =
  | { ok: true; created: boolean; outreach: Outreach }
  | { ok: false; reason: 'job_not_found' };

export function setOutreach(jobId: string, body: string): SaveResult {
  const db = getDb();
  const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
  if (!job) return { ok: false, reason: 'job_not_found' };

  const existing = getOutreach(jobId);
  db.prepare(
    `INSERT INTO outreach (job_id, body, created_at, updated_at)
     VALUES (?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(job_id) DO UPDATE SET
       body = excluded.body,
       updated_at = datetime('now')`,
  ).run(jobId, body);

  const o = getOutreach(jobId);
  if (!o) return { ok: false, reason: 'job_not_found' };
  return { ok: true, created: !existing, outreach: o };
}

export type ClearResult = { ok: true; removed: boolean };

export function clearOutreach(jobId: string): ClearResult {
  const info = getDb()
    .prepare('DELETE FROM outreach WHERE job_id = ?')
    .run(jobId);
  return { ok: true, removed: info.changes > 0 };
}
