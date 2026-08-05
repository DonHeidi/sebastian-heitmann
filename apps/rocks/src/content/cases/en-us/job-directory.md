---
title: 'Job Directory — a job-search workspace'
summary: 'A personal job-search workspace: an external agent POSTs curated postings and briefings into a Postgres-backed TanStack Start app; shortlist, application pipeline, outreach drafts, and cover-letter review live in one place.'
kind: 'case-study'
role: 'Design and development'
stack: ['TypeScript', 'Bun', 'TanStack Start', 'PostgreSQL', 'Drizzle', 'better-auth']
cover: ../../../assets/cover-art-red-suits.png
startDate: 2026-06-06
links: []
featured: false
draft: false
---

## The setup

Job Directory is a personal job-search workspace in a Bun monorepo: a TanStack Start app over Postgres (Drizzle ORM on Bun's native SQL driver, server-rendered per request) that surfaces curated job postings, date-keyed briefings, a shortlist, and an application pipeline with table and kanban views.

## What makes it interesting

Curation is machine-to-machine: an external agent POSTs postings and briefings through an API-key-guarded HTTP API, documented as OpenAPI 3.1 with an interactive reference. The human works the other side: triaging jobs through a status funnel, drafting outreach, tailoring CVs and cover letters per posting, and leaving per-posting feedback that the upstream agent consumes as training signal. Access is double-gated: every page requires both a session and an active entitlement, so a fresh signup lands on billing, not in the app.

## Setlist: stack highlights

- TanStack Start on the Bun runtime, Postgres via Bun.sql and Drizzle migrations
- Agent-facing HTTP API with an OpenAPI 3.1 contract and API-key auth
- Application funnel with table and kanban views, plus a cover-letter review queue

## Status

Private and in active development: a tool built to run one job search well, with the curation loop shared between an agent and its user.
