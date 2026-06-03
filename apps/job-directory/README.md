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
- `shortlist` — one row per shortlisted job, keyed by `job_id` with `ON DELETE CASCADE` from `jobs`.
- `feedback` — one row per job (1:1), `body` text. Captures the curator's free-form notes on each posting for the upstream agent to consume as training signal.
- `outreach` — one row per job (1:1), `body` markdown. The drafted outreach message for the posting. Read paths return rendered HTML alongside the raw body.
- `job_status` — one row per job (1:1), `status` enum (`new`, `not_considered`, `selected`, `applied`, `rejected`, `further_steps`). Absence of a row is the implicit `new` state. Captures where the posting sits in the application funnel.

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
| `GET /api/shortlist` | List shortlisted jobs (auth required). |
| `POST /api/shortlist` | Add a job to the shortlist. |
| `DELETE /api/shortlist/<job_id>` | Remove a job from the shortlist. |
| `GET /api/feedback/<job_id>` | Get the feedback for a job (404 if none). |
| `PUT /api/feedback/<job_id>` | Create or replace feedback for a job. |
| `DELETE /api/feedback/<job_id>` | Clear feedback for a job. |
| `GET /api/outreach/<job_id>` | Get the outreach draft for a job (404 if none). |
| `PUT /api/outreach/<job_id>` | Create or replace the outreach draft. |
| `DELETE /api/outreach/<job_id>` | Clear the outreach draft. |
| `GET /api/status/<job_id>` | Get the status for a job (returns `new` if none set). |
| `PUT /api/status/<job_id>` | Set the status. Body: `{ "status": "applied" }`. |
| `DELETE /api/status/<job_id>` | Reset to implicit `new`. |

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

### Shortlist

`GET /api/shortlist` returns `{ shortlist: ShortlistEntry[] }`, where each entry is a full job view plus an `added_at` timestamp, ordered newest-first.

`POST /api/shortlist` adds a job. Body: `{ "job_id": "<slug>" }`. Returns:

- `201` with `{ status: "added", entry }` on a new add.
- `200` with `{ status: "already_shortlisted", entry }` if the job was already on the list.
- `404` with `{ error: "job_not_found" }` if the slug doesn't exist in `jobs`.
- `422` on a malformed body.

`DELETE /api/shortlist/<job_id>` removes a job. Always `200`; the body reports `{ status: "removed" | "not_shortlisted", job_id }` so the call is idempotent.

```bash
curl -X POST http://localhost:3000/api/shortlist \
  -H "Authorization: Bearer $JOB_DIRECTORY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"job_id": "acme-staff-platform-engineer"}'

curl -X DELETE http://localhost:3000/api/shortlist/acme-staff-platform-engineer \
  -H "Authorization: Bearer $JOB_DIRECTORY_API_TOKEN"
```

### Internal access

Server functions in `src/server/content.ts` (`fetchShortlist`, `shortlistJob`, `unshortlistJob`, `fetchFeedback`, `saveFeedback`, `removeFeedback`) wrap the same business logic for use inside route loaders and the in-app form. Both the HTTP API and the server functions delegate to the matching `src/server/{shortlist,feedback}.ts` module.

### Feedback

`GET /api/feedback/<job_id>` returns `{ feedback }` or `404` if there's no row yet.

`PUT /api/feedback/<job_id>` upserts. Body: `{ "body": "..." }`.

- `201` with `{ status: "created", feedback }` on first save.
- `200` with `{ status: "updated", feedback }` on subsequent saves.
- `404` if the job slug doesn't exist.
- `422` on a malformed body.

`DELETE /api/feedback/<job_id>` clears it. Always `200`; reports `{ status: "removed" | "not_found", job_id }`.

The job detail page at `/jobs/<slug>/` also surfaces a TanStack Form + shadcn textarea bound to the same data — saves go through the `saveFeedback` server function, empty saves call `removeFeedback`.

### Outreach

Same shape as feedback, with markdown rendering on read.

`GET /api/outreach/<job_id>` returns `{ outreach }` where `outreach = { job_id, body, html, created_at, updated_at }`. `404` if no row.

`PUT /api/outreach/<job_id>` upserts. Body: `{ "body": "markdown..." }`. Same 201/200/404/422 shape as feedback. Response includes the rendered `html` so callers don't need their own markdown renderer.

`DELETE /api/outreach/<job_id>` clears it. Idempotent — always `200`.

Server functions: `fetchOutreach`, `saveOutreach`, `removeOutreach` (same signatures as the feedback trio).

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
