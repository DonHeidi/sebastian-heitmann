# Monorepo Conversion Design Spec

## Goal

Convert the single-project repository into a Bun workspaces monorepo with two apps: the existing Astro website and a new Scaleway serverless mail-service function.

## Structure

```
/
├── apps/
│   ├── website/              # Existing Astro site (moved from root)
│   │   ├── src/
│   │   ├── public/
│   │   ├── astro.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── mail-service/         # Scaleway serverless function (TypeScript/Node)
│       ├── src/
│       │   └── handler.ts    # Function entry point
│       ├── package.json
│       └── tsconfig.json
├── docs/                     # Shared project documentation (stays at root)
├── package.json              # Root workspace config
├── bun.lock                  # Shared lockfile
└── CLAUDE.md                 # Root project docs (updated for monorepo)
```

## Root package.json

```json
{
  "name": "sebastian-heitmann",
  "private": true,
  "workspaces": ["apps/*"]
}
```

No root dependencies. Each app manages its own.

## Website Migration

Move all website files into `apps/website/`:
- `src/`, `public/`, `dist/` → `apps/website/`
- `astro.config.mjs`, `tsconfig.json` → `apps/website/`
- `package.json` → `apps/website/package.json` (existing, as-is)

Files that stay at root:
- `docs/` — shared documentation
- `CLAUDE.md` — updated for monorepo structure
- `.gitignore` — updated for monorepo paths

Use `git mv` to preserve history.

## Mail Service

`apps/mail-service/` — minimal TypeScript project:

### Handler (`src/handler.ts`)
- Exports a handler function compatible with Scaleway serverless functions
- Receives POST request with JSON body: `{ name, email, context, message }`
- Validates required fields
- Calls Scaleway Transactional Email API to send the email
- Returns appropriate status codes (200 success, 400 validation error, 500 server error)

### Dependencies
- Scaleway SDK or direct HTTP calls to their API
- TypeScript, with its own `tsconfig.json`

### Configuration
- Scaleway API credentials via environment variables (`SCW_SECRET_KEY`, `SCW_PROJECT_ID`)
- Recipient email address via environment variable (`MAIL_RECIPIENT`)
- Sender address via environment variable (`MAIL_SENDER`)

## CLAUDE.md

Updated to describe the monorepo:
- Root structure with `apps/` directory
- Per-app commands (`cd apps/website && bun run dev`, etc.)
- Mail service configuration and deployment notes

## What Doesn't Change

- Website code, config, imports, and build process — identical, just nested deeper
- Git history — preserved via `git mv`
- `docs/` location — stays at root
