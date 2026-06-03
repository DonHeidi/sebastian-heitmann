/**
 * Shortlist business logic.
 *
 * Used by both the HTTP API (`routes/api/shortlist*.ts`) and internal server
 * functions (`server/content.ts`). Operates directly on the SQLite DB and
 * returns rich `JobView` rows so callers don't need to know about row shape.
 */

import { getDb } from '../db/connection';
import type { JobRow } from '../db/schemas';
import { rowToJob, type JobView } from './views';

export type ShortlistEntry = JobView & { added_at: string };

const LIST_QUERY = `
SELECT j.*, s.added_at AS shortlist_added_at
FROM shortlist s
INNER JOIN jobs j ON j.id = s.job_id
ORDER BY s.added_at DESC
`;

type JoinedRow = JobRow & { shortlist_added_at: string };

export function listShortlist(): ShortlistEntry[] {
  const rows = getDb().prepare(LIST_QUERY).all() as JoinedRow[];
  return rows.map((row) => ({
    ...rowToJob(row),
    added_at: row.shortlist_added_at,
  }));
}

export function isShortlisted(jobId: string): boolean {
  const row = getDb()
    .prepare('SELECT 1 FROM shortlist WHERE job_id = ?')
    .get(jobId);
  return row !== undefined;
}

export type AddResult =
  | { ok: true; alreadyShortlisted: boolean; entry: ShortlistEntry }
  | { ok: false; reason: 'job_not_found' };

export function addToShortlist(jobId: string): AddResult {
  const db = getDb();
  const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
  if (!job) return { ok: false, reason: 'job_not_found' };

  const before = isShortlisted(jobId);
  db.prepare('INSERT OR IGNORE INTO shortlist (job_id) VALUES (?)').run(jobId);

  const entry = listShortlist().find((e) => e.id === jobId);
  if (!entry) {
    // Should never happen since we just inserted (or row already existed).
    return { ok: false, reason: 'job_not_found' };
  }
  return { ok: true, alreadyShortlisted: before, entry };
}

export type RemoveResult = { ok: true; removed: boolean };

export function removeFromShortlist(jobId: string): RemoveResult {
  const info = getDb()
    .prepare('DELETE FROM shortlist WHERE job_id = ?')
    .run(jobId);
  return { ok: true, removed: info.changes > 0 };
}
