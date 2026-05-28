#!/usr/bin/env node
// One-shot migration: read markdown under apps/job-directory/src/content/
// and upsert into apps/job-directory/data/jobs.db. Safe to re-run.
//
// Run with: node scripts/seed-job-directory-db.mjs
// (must be Node, not Bun — better-sqlite3 is unsupported under Bun)

import Database from 'better-sqlite3';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..', 'apps', 'job-directory');
const DB_PATH = join(APP, 'data', 'jobs.db');

await mkdir(dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma('journal_mode = DELETE');
db.exec(`
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
`);

const upsertJob = db.prepare(`
INSERT INTO jobs (id, title, company, location, url, posted_at, tags, remote, fit, body, created_at, updated_at)
VALUES (@id, @title, @company, @location, @url, @posted_at, @tags, @remote, @fit, @body, datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  title=excluded.title, company=excluded.company, location=excluded.location,
  url=excluded.url, posted_at=excluded.posted_at, tags=excluded.tags,
  remote=excluded.remote, fit=excluded.fit, body=excluded.body,
  updated_at=datetime('now')
`);

const upsertBriefing = db.prepare(`
INSERT INTO briefings (id, date, body, created_at, updated_at)
VALUES (@id, @date, @body, datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  date=excluded.date, body=excluded.body, updated_at=datetime('now')
`);

async function listMd(dir) {
  try {
    const entries = await readdir(dir);
    return entries
      .filter((n) => n.endsWith('.md') && !n.startsWith('_'))
      .map((n) => join(dir, n));
  } catch {
    return [];
  }
}

function toISO(v) {
  if (!v) return null;
  return (v instanceof Date ? v : new Date(v)).toISOString();
}

let jobCount = 0;
for (const path of await listMd(join(APP, 'src/content/jobs'))) {
  const id = path.split('/').pop().replace(/\.md$/, '');
  const { data, content } = matter(await readFile(path, 'utf8'));
  upsertJob.run({
    id,
    title: data.title,
    company: data.company,
    location: data.location ?? null,
    url: data.url,
    posted_at: toISO(data.posted_at),
    tags: JSON.stringify(data.tags ?? []),
    remote: data.remote == null ? null : data.remote ? 1 : 0,
    fit: data.fit ?? null,
    body: content,
  });
  jobCount++;
}
console.log(`Seeded ${jobCount} jobs.`);

let briefingCount = 0;
for (const path of await listMd(join(APP, 'src/content/briefings'))) {
  const id = path.split('/').pop().replace(/\.md$/, '');
  const { data, content } = matter(await readFile(path, 'utf8'));
  upsertBriefing.run({
    id,
    date: toISO(data.date),
    body: content,
  });
  briefingCount++;
}
console.log(`Seeded ${briefingCount} briefings.`);
