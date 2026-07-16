# Incremental Website Deploys via rclone + Sitemap lastmod — Design

**Date:** 2026-07-16
**Status:** Approved design, pending implementation plan

## Purpose

Two related delivery improvements:

1. `scripts/deploy-website.sh` currently uploads every file in `dist/` on every deploy
   (`aws s3 cp --recursive`) and never deletes anything from the bucket. Replace the
   upload step with checksum-exact incremental sync so that deploys are faster and
   cheaper, and stale objects (old hashed chunks, removed pages) are removed from the
   bucket.
2. The generated sitemap is a bare URL list (`sitemap()` with no options — zero
   `<lastmod>` entries), so search engines get no signal when existing content
   changes. Emit accurate per-URL `<lastmod>` values so crawlers can prioritize
   changed pages.

Note on the CDN: Edge Services caches independently, in front of the bucket, per its
own TTL rules — upload behavior neither purges nor warms it. The only cache-adjacent
benefit is incidental: unchanged objects keep their `Last-Modified`, so CDN origin
revalidations can still answer 304 instead of a full re-fetch.

## Decisions

| Decision | Choice |
|---|---|
| Mechanism | **rclone** (`sync --checksum`), not hand-rolled bash manifests — checksum sync is exact (MD5 vs S3 ETag, multipart handled by rclone's own metadata) and battle-tested; this repo just shipped a bug in hand-rolled deploy logic |
| Tooling | Pin `rclone` in `mise.toml` (latest), alongside the existing aws/scw/terraform pins |
| Configuration | No rclone config file — env-var remote (`RCLONE_CONFIG_SCW_*`) populated from the same varlock/Proton Pass credentials the script already uses; endpoint `https://s3.nl-ams.scw.cloud` |
| Upload ordering | Two-phase: **(1)** `rclone copy` of assets (`_astro/`, `fonts/`, images — everything except `*.html`) first, **(2)** `rclone sync --checksum` of the full tree second (uploads remaining HTML, performs deletions). A visitor mid-deploy never receives HTML referencing a not-yet-uploaded asset |
| Deletion | Plain `sync` deletion, **no `--backup-dir`** — bucket content is fully regenerable from git + `bun run build`. Residual risk: HTML still cached at the CDN may reference a deleted chunk; whether that chunk still resolves depends on the CDN's own independent cache state, and the possible 404 window is accepted (low traffic, regenerable content) |
| Object ACL | `--s3-acl public-read` on both phases (Scaleway objects are private by default; preserves current behavior) |
| Content-Type | rclone's extension-based MIME inference (equivalent to current `aws s3 cp` behavior) |
| Kept from current script | The image-orphan prune and the island-chunk-graph assertion run unchanged, BEFORE any upload (this work builds on the fixed script from PR #9) |
| aws CLI | No longer needed by this script; stays in `mise.toml` for now (other tooling may use it) — removal is out of scope |
| Sitemap lastmod | Per-URL via `@astrojs/sitemap`'s `serialize` hook — never the global `lastmod` option (it stamps every URL with build time; Google ignores lastmod once it's demonstrably inaccurate). `changefreq`/`priority` are not emitted (ignored by Google) |
| lastmod source: articles | Frontmatter `updatedDate ?? pubDate` — the same values the article pages already surface as JSON-LD `dateModified`, so sitemap and structured data agree |
| lastmod source: other pages | Last git commit date of the page's source file (`git log -1 --format=%cI -- <file>`), resolved at build time in the serialize hook. A page's lastmod moves only when its source actually changed. Fallback when git metadata is unavailable (e.g. shallow/exported build env): omit lastmod for that URL rather than emit a wrong date |
| lastmod mapping | The serialize hook maps sitemap URL → source file (page route or article content file, both locales). Component-only refactors that change rendered output without touching the page file are accepted as NOT bumping lastmod — copy lives in page files / i18n files / content collections, and i18n or shared-component edits can be included in the mapping if desired at implementation |

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
  Note this requires the sitemap itself to be byte-stable across identical builds —
  verified as part of the lastmod work (git dates are deterministic; no build
  timestamps may leak into the sitemap).
- A single-file copy edit re-uploads only that HTML + sitemap.
- Stale-object deletion observed once (e.g. old hashed chunk disappears from bucket).
- Site renders after deploy (spot-check via CDN URL), correct Content-Type on
  HTML/CSS/JS/woff2, objects publicly readable.
- Sitemap: every article URL carries `<lastmod>` matching its frontmatter date; a page
  edited in git gets a bumped lastmod on next build while all other URLs keep theirs;
  sitemap validates (well-formed XML, W3C datetime format).

## Out of scope

- Removing the aws CLI from `mise.toml`.
- CDN cache purging / Edge Services API integration.
- Any change to build, prune, or chunk-assertion logic.
- **IndexNow ping** (Bing/Yandex push notification of changed URLs, derivable from
  rclone's upload log) — natural follow-up once incremental deploy exists; not now.

## Branch/PR strategy

Implemented on a branch off `feat/v8-asterisk-migration` (it depends on that branch's
fixed deploy script), PR based against the migration branch (stacked); GitHub retargets
to `main` when PR #9 merges.
