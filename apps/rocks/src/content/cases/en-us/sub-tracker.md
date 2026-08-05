---
title: 'Sub-Tracker — subscription tracker prototype'
summary: 'A subscription-tracker prototype in a Bun monorepo: TanStack Start over SQLite and Drizzle, with per-user envelope encryption and a transactional-mail adapter with typed failure semantics.'
kind: 'project'
role: 'Design and development'
stack: ['TypeScript', 'Bun', 'TanStack Start', 'SQLite', 'Drizzle', 'better-auth']
cover: ../../../assets/cover-art-masked-duo.png
startDate: 2026-05-12
links: []
featured: false
draft: false
---

## The setup

Sub-Tracker is a prototype subscription tracker in a Bun-workspaces monorepo: a TanStack Start (React 19) web app, a devtools CLI, and a shared database package on SQLite via Drizzle, styled with Tailwind v4 and shadcn/ui.

## What makes it interesting

User data is envelope-encrypted per user: each account gets its own data-encryption key, wrapped by a master key, so records stay unreadable without both. Transactional mail goes through a single env-selected adapter (console, SMTP against a local Mailpit, or Scaleway) whose failures are typed as permanent or transient, so each flow decides for itself whether a failed send aborts the operation or gets logged and ignored.

## Setlist: stack highlights

- TanStack Start (React 19), SSR-first, Tailwind v4, shadcn/ui
- Per-user envelope encryption over SQLite and Drizzle, auth via better-auth
- Mail adapter with console, SMTP, and Scaleway transports and typed failures

## Status

Prototype stage, private.
