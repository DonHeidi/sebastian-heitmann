import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function dbPath(): string {
  return process.env.JOB_DIRECTORY_DB ?? resolve(process.cwd(), 'data/jobs.db');
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS jobs (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT,
  url         TEXT NOT NULL,
  posted_at   TEXT,
  tags        TEXT NOT NULL DEFAULT '[]',
  remote      INTEGER,
  fit         TEXT CHECK (fit IN ('top', 'borderline', 'skip')),
  body        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS briefings (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shortlist (
  job_id      TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  added_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS feedback (
  job_id      TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS outreach (
  job_id      TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS job_status (
  job_id      TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  status      TEXT NOT NULL CHECK (status IN (
    'new', 'not_considered', 'selected', 'applied', 'rejected', 'further_steps'
  )),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

let cached: Database.Database | undefined;

export function getDb(): Database.Database {
  if (cached) return cached;
  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma('journal_mode = DELETE');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  cached = db;
  return db;
}
