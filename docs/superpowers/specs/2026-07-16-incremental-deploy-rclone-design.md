# Incremental Website Deploys via rclone — Design

**Date:** 2026-07-16
**Status:** Approved design, pending implementation plan

## Purpose

`scripts/deploy-website.sh` currently uploads every file in `dist/` on every deploy
(`aws s3 cp --recursive`) and never deletes anything from the bucket. Replace the
upload step with checksum-exact incremental sync so that deploys are faster, cheaper,
CDN cache entries for unchanged objects stay warm, and stale objects (old hashed
chunks, removed pages) are removed from the bucket.

## Decisions

| Decision | Choice |
|---|---|
| Mechanism | **rclone** (`sync --checksum`), not hand-rolled bash manifests — checksum sync is exact (MD5 vs S3 ETag, multipart handled by rclone's own metadata) and battle-tested; this repo just shipped a bug in hand-rolled deploy logic |
| Tooling | Pin `rclone` in `mise.toml` (latest), alongside the existing aws/scw/terraform pins |
| Configuration | No rclone config file — env-var remote (`RCLONE_CONFIG_SCW_*`) populated from the same varlock/Proton Pass credentials the script already uses; endpoint `https://s3.nl-ams.scw.cloud` |
| Upload ordering | Two-phase: **(1)** `rclone copy` of assets (`_astro/`, `fonts/`, images — everything except `*.html`) first, **(2)** `rclone sync --checksum` of the full tree second (uploads remaining HTML, performs deletions). A visitor mid-deploy never receives HTML referencing a not-yet-uploaded asset |
| Deletion | Plain `sync` deletion, **no `--backup-dir`** — bucket content is fully regenerable from git + `bun run build`; the brief window where stale-cached HTML can 404 on a deleted chunk is accepted (low traffic, short Edge TTLs) |
| Object ACL | `--s3-acl public-read` on both phases (Scaleway objects are private by default; preserves current behavior) |
| Content-Type | rclone's extension-based MIME inference (equivalent to current `aws s3 cp` behavior) |
| Kept from current script | The image-orphan prune and the island-chunk-graph assertion run unchanged, BEFORE any upload (this work builds on the fixed script from PR #9) |
| aws CLI | No longer needed by this script; stays in `mise.toml` for now (other tooling may use it) — removal is out of scope |

## Sketch

```bash
export RCLONE_CONFIG_SCW_TYPE=s3
export RCLONE_CONFIG_SCW_PROVIDER=Scaleway
export RCLONE_CONFIG_SCW_ACCESS_KEY_ID="$SCW_ACCESS_KEY"
export RCLONE_CONFIG_SCW_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
export RCLONE_CONFIG_SCW_ENDPOINT="https://s3.nl-ams.scw.cloud"

# Phase 1: assets first (everything except HTML), checksum-exact, no deletions
rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --exclude '*.html' --s3-acl public-read

# Phase 2: full tree — uploads HTML, deletes stale objects
rclone sync dist/ scw:sebastian-heitmann-website \
  --checksum --s3-acl public-read
```

(Exact flags — transfers, verbosity, `--fast-list` — decided at implementation.)

## Verification

- `rclone check dist/ scw:… --checksum` after deploy reports zero differences.
- Second consecutive deploy with no source changes uploads **zero** files (idempotence).
- A single-file copy edit re-uploads only that HTML + sitemap.
- Stale-object deletion observed once (e.g. old hashed chunk disappears from bucket).
- Site renders after deploy (spot-check via CDN URL), correct Content-Type on HTML/CSS/JS/woff2, objects publicly readable.

## Out of scope

- Removing the aws CLI from `mise.toml`.
- CDN cache purging / Edge Services API integration.
- Any change to build, prune, or chunk-assertion logic.

## Branch/PR strategy

Implemented on a branch off `feat/v8-asterisk-migration` (it depends on that branch's
fixed deploy script), PR based against the migration branch (stacked); GitHub retargets
to `main` when PR #9 merges.
