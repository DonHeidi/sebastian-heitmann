/**
 * Per-job feedback business logic.
 *
 * One row per job (1:1, keyed by job_id). Used by both the HTTP API
 * (`routes/api/feedback.$job_id.ts`) and internal server functions
 * (`server/content.ts`). Empty body via `setFeedback` deletes the row.
 */

import { getDb } from '../db/connection';

export type Feedback = {
  job_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export function getFeedback(jobId: string): Feedback | null {
  return (
    (getDb()
      .prepare('SELECT * FROM feedback WHERE job_id = ?')
      .get(jobId) as Feedback | undefined) ?? null
  );
}

export type SaveResult =
  | { ok: true; created: boolean; feedback: Feedback }
  | { ok: false; reason: 'job_not_found' };

export function setFeedback(jobId: string, body: string): SaveResult {
  const db = getDb();
  const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
  if (!job) return { ok: false, reason: 'job_not_found' };

  const existing = getFeedback(jobId);
  db.prepare(
    `INSERT INTO feedback (job_id, body, created_at, updated_at)
     VALUES (?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(job_id) DO UPDATE SET
       body = excluded.body,
       updated_at = datetime('now')`,
  ).run(jobId, body);

  const fb = getFeedback(jobId);
  if (!fb) return { ok: false, reason: 'job_not_found' };
  return { ok: true, created: !existing, feedback: fb };
}

export type ClearResult = { ok: true; removed: boolean };

export function clearFeedback(jobId: string): ClearResult {
  const info = getDb()
    .prepare('DELETE FROM feedback WHERE job_id = ?')
    .run(jobId);
  return { ok: true, removed: info.changes > 0 };
}
