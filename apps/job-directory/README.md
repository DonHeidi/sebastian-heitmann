# Job Directory

TanStack Start site that surfaces curated job postings and freelance briefs. Entries live in a SQLite database (`data/jobs.db`) and are prerendered to static HTML at build time. New entries are POSTed via the HTTP API by an external agent.

## Commands

```bash
bun run dev       # local dev server (http://localhost:3000)
bun run build     # production build to dist/
bun run preview   # preview the production build
```

## Storage

All content lives in `apps/job-directory/data/jobs.db` (better-sqlite3). The schema lives in `src/db/connection.ts` and is created on first connection. The seed migration in `scripts/seed-job-directory-db.mjs` (project root) ingests markdown files if present.

Tables:

- `jobs` — one row per posting, keyed by slug.
- `briefings` — one row per scan run, keyed by `YYYY-MM-DD` date.

The site prerenders the DB at `bun run build` time, so the DB file must exist before a build. For now the DB is checked into git as binary; this trade-off can change when a deploy story emerges.

## Routing

| Route | Purpose |
| ----- | ------- |
| `/` | Home — renders the latest briefing with links to both overviews. |
| `/briefings/` | Overview of every briefing by date. |
| `/briefings/<YYYY-MM-DD>/` | A single briefing's body. |
| `/jobs/` | Overview of every job posting, newest first. |
| `/jobs/<slug>/` | A single job posting. |
| `POST /api/jobs` | Create or update a job (see below). |
| `GET /api/jobs` | List all jobs (auth required). |
| `POST /api/briefings` | Create or update a briefing. |
| `GET /api/briefings` | List all briefings (auth required). |

## API

All API endpoints require `Authorization: Bearer <token>` matching the `JOB_DIRECTORY_API_TOKEN` environment variable. Responses are JSON.

### `POST /api/jobs`

Upserts a job by `id`. Body is JSON validated against the schema below.

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `id` | string (kebab-case) | yes | Stable slug; `<company>-<role>` is a good default. Becomes the route segment `/jobs/<id>/`. |
| `title` | string | yes | Job title as posted. |
| `company` | string | yes | Hiring company. |
| `url` | URL | yes | Canonical link to the original posting. |
| `location` | string\|null | no | Free-form (e.g. `Berlin, DE`, `EU remote`). |
| `posted_at` | ISO-8601 date | no | Used to sort the index newest-first. |
| `tags` | string[] | no | Defaults to `[]`. Rendered as chips on the index and detail pages. |
| `remote` | boolean\|null | no | If true, shows a "Remote" badge. |
| `fit` | `top` \| `borderline` \| `skip` \| null | no | Drives color-grading on the listing. |
| `body` | string (Markdown) | no | Free-form body. Rendered on the detail page. |

Returns `201` on create, `200` on update, `401` if auth fails, `422` with Zod issues if validation fails.

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer $JOB_DIRECTORY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "acme-staff-platform-engineer",
    "title": "Staff Platform Engineer",
    "company": "Acme",
    "url": "https://acme.example/careers/staff-platform-engineer",
    "location": "Berlin, DE",
    "posted_at": "2026-05-25",
    "tags": ["platform", "golang", "kubernetes"],
    "remote": true,
    "fit": "top",
    "body": "Acme is rebuilding its multi-tenant platform...\n\n**Why it scored well:** ..."
  }'
```

### `POST /api/briefings`

Upserts a briefing by `id`. `id` must be a `YYYY-MM-DD` string.

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `id` | `YYYY-MM-DD` | yes | The scan run date. Re-posting the same id overwrites. |
| `date` | ISO-8601 date | yes | Used for sorting and as the briefing heading. |
| `body` | string (Markdown) | no | Free-form. Typical sections: top serious candidates, borderline / quick glance, suppressed/noisy patterns, recommended next actions. Do not include a top-level `# ...` heading — the page provides the date heading. |

```bash
curl -X POST http://localhost:3000/api/briefings \
  -H "Authorization: Bearer $JOB_DIRECTORY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "2026-05-26",
    "date": "2026-05-26",
    "body": "## Top serious candidates\n\n..."
  }'
```

## Seed script

A one-shot migration ingests legacy markdown files at `apps/job-directory/src/content/{jobs,briefings}/*.md`:

```bash
node scripts/seed-job-directory-db.mjs
```

Run from the project root. Requires Node (better-sqlite3 is not yet supported under Bun). Idempotent — safe to re-run; each row is upserted by id.

## Environment variables

| Variable | Used by | Notes |
| -------- | ------- | ----- |
| `JOB_DIRECTORY_API_TOKEN` | API routes | Required. Bearer token clients must present. If unset, every API call returns 503. |
| `JOB_DIRECTORY_DB` | DB connection | Optional. Override the default DB path (`data/jobs.db` relative to `process.cwd()`). |
