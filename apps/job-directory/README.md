# Job Directory

Astro site that surfaces curated job postings and freelance briefs. Entries are written as Markdown files under `src/content/jobs/` by an external agent and rendered at build time via Astro content collections.

## Commands

```bash
bun run dev       # local dev server
bun run build     # production build to dist/
bun run preview   # preview the production build
```

## Content model

Each job posting is a single Markdown file in `src/content/jobs/`. The frontmatter schema is enforced by `src/content.config.ts`; unknown keys or missing required fields fail the build. Files whose name starts with `_` are ignored by the loader (use this for templates or drafts).

### Filename and slug

- One file per posting. The filename without `.md` becomes both the collection ID and the route segment (`/jobs/<slug>/`).
- Pick a stable, deterministic slug — `<company-kebab>-<role-kebab>` is a good default (e.g. `acme-staff-platform-engineer.md`). When the same posting reappears in a later run, reuse the same slug so the file is overwritten rather than duplicated.
- Remove a posting by deleting its file.

### Frontmatter schema

| Field       | Type       | Required | Notes |
| ----------- | ---------- | -------- | ----- |
| `title`     | string     | yes      | Job title as posted. |
| `company`   | string     | yes      | Hiring company. |
| `url`       | URL string | yes      | Canonical link to the original posting. |
| `location`  | string     | no       | Free-form (e.g. `Berlin, DE`, `EU remote`). |
| `posted_at` | date       | no       | ISO-8601 string (or any value `z.coerce.date()` accepts). Used to sort the index newest-first. |
| `tags`      | string[]   | no       | Defaults to `[]`. Rendered as chips on the index and detail pages. |
| `remote`    | boolean    | no       | If true, shows a "Remote" badge. |

### Body

The Markdown body is rendered on `/jobs/<slug>/`. Use it for the freeform write-up: responsibilities, stack notes, comp band, contact info, and any agent commentary worth keeping (why it scored well, caveats, etc.).

### Example

```markdown
---
title: Staff Platform Engineer
company: Acme
location: Berlin, DE
url: https://acme.example/careers/staff-platform-engineer
posted_at: 2026-05-25
tags: [platform, golang, kubernetes]
remote: true
---

Acme is rebuilding its multi-tenant platform on managed Kubernetes. Looking
for deep infra experience with a track record of taking systems from prototype
to production-grade.

**Why it scored well:** matches the "infra leadership with code" search; comp
band is competitive for the region; team lead has a strong public track record.
```

## Pipeline for the upstream agent

1. Run scan / curation out of repo.
2. For each posting kept, write `apps/job-directory/src/content/jobs/<slug>.md` with the frontmatter above. Reuse the slug if the posting was seen before.
3. Commit using the repo's conventional-commit style:
   - `feat(job-directory): add <slug>` for new entries
   - `chore(job-directory): refresh <slug>` for updates to an existing entry
   - `chore(job-directory): drop <slug>` for removals
4. Push to the branch the site builds from.

The site is statically rebuilt from `src/content/jobs/` — there is no runtime database, queue, or webhook. A `git push` is the entire deploy trigger.
