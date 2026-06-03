/**
 * Per-job status business logic.
 *
 * Status values are an enum. Absence of a row is the implicit "new" state;
 * the read paths surface that as a status of "new" so callers don't have to
 * special-case null. `clearStatus` deletes the row (back to implicit new).
 */

import { getDb } from '../db/connection';
import {
  JOB_STATUS_VALUES,
  type JobStatusValue,
} from '../lib/job-status';

export { JOB_STATUS_VALUES, JOB_STATUS_LABELS, type JobStatusValue } from '../lib/job-status';

export type JobStatus = {
  job_id: string;
  status: JobStatusValue;
  updated_at: string | null;
};

type Row = { job_id: string; status: JobStatusValue; updated_at: string };

export function getStatus(jobId: string): JobStatus {
  const row = getDb()
    .prepare('SELECT * FROM job_status WHERE job_id = ?')
    .get(jobId) as Row | undefined;
  return row
    ? row
    : { job_id: jobId, status: 'new', updated_at: null };
}

export function listAllStatuses(): Record<string, JobStatusValue> {
  const rows = getDb()
    .prepare('SELECT job_id, status FROM job_status')
    .all() as Array<{ job_id: string; status: JobStatusValue }>;
  const map: Record<string, JobStatusValue> = {};
  for (const row of rows) map[row.job_id] = row.status;
  return map;
}

export type SaveResult =
  | { ok: true; status: JobStatus }
  | { ok: false; reason: 'job_not_found' };

export function setStatus(
  jobId: string,
  status: JobStatusValue,
): SaveResult {
  const db = getDb();
  const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
  if (!job) return { ok: false, reason: 'job_not_found' };

  db.prepare(
    `INSERT INTO job_status (job_id, status, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(job_id) DO UPDATE SET
       status = excluded.status,
       updated_at = datetime('now')`,
  ).run(jobId, status);

  return { ok: true, status: getStatus(jobId) };
}

export type ClearResult = { ok: true; removed: boolean };

export function clearStatus(jobId: string): ClearResult {
  const info = getDb()
    .prepare('DELETE FROM job_status WHERE job_id = ?')
    .run(jobId);
  return { ok: true, removed: info.changes > 0 };
}
