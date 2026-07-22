# Incremental rclone Deploy + Sitemap lastmod Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website deploy's full-tree `aws s3 cp --recursive` with checksum-exact two-phase `rclone` sync (with deletions), and emit accurate per-URL `<lastmod>` in the sitemap.

**Architecture:** rclone pinned via mise, configured entirely through `RCLONE_CONFIG_SCW_*` env vars derived from the script's existing Scaleway credentials; phase 1 `copy --checksum` uploads everything except HTML, phase 2 `sync --checksum` uploads HTML and deletes stale objects. Sitemap lastmod comes from `@astrojs/sitemap`'s `serialize` hook: articles from frontmatter (`updatedDate ?? pubDate`), other pages from the last git commit date of their source file, omitted when unresolvable.

**Tech Stack:** Bun, rclone (latest, via mise), @astrojs/sitemap serialize hook, bash.

**Spec:** `docs/superpowers/specs/2026-07-16-incremental-deploy-rclone-design.md`

## Global Constraints

- All npm dependencies via `bun add` / `bun add -d`, never hand-edited; toolchain additions via `mise use` (writes `mise.toml`).
- Work happens on branch `feat/incremental-deploy`, created FROM `feat/v8-asterisk-migration` (commit `f29346d` or later) in the existing worktree `/home/donheidi/code/sebastian-heitmann-v8` — this work depends on that branch's fixed deploy script.
- **NEVER run a real deploy** — the migration branch is unmerged; a real upload would publish the redesign prematurely. All bucket-facing verification uses `--dry-run`, and full behavioral verification uses a LOCAL rclone destination (plain directory), which exercises identical sync logic.
- The existing prune + island-chunk-graph assertion in `scripts/deploy-website.sh` stay byte-identical and run before any upload phase.
- Scaleway S3 gotcha (AGENTS.md): the S3 access key must be suffixed `@<project-id>` to target the non-default project — replicate exactly whatever credential wiring the current script does for the aws CLI.
- Sitemap must be byte-stable across two identical builds (no build timestamps).
- lastmod values: W3C datetime (ISO 8601). Never emit a guessed/wrong date — omit instead.
- Commits: conventional (`feat(website): …` / `feat(deploy): …` / `cicd(deploy): …`), trailer:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- Do NOT push and do NOT open the PR until the final task says so.

---

### Task 1: Branch + rclone toolchain

**Files:**
- Modify: `mise.toml` (repo root, via `mise use`)

**Interfaces:**
- Produces: branch `feat/incremental-deploy` checked out in `/home/donheidi/code/sebastian-heitmann-v8`; `rclone` on PATH for later tasks.

- [ ] **Step 1: Create the branch**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8
git switch -c feat/incremental-deploy
git log --oneline -1   # expect: f29346d or later (fix(website): use dark-band token pattern…)
```

- [ ] **Step 2: Pin rclone via mise**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8
mise use rclone@latest
mise install
rclone version | head -1
```
Expected: `mise.toml` gains an `rclone = "latest"` (or pinned-version) line; `rclone version` prints. If `mise use` pins an exact version instead of `latest`, keep what mise writes — consistent with the file's existing style (inspect `mise.toml` and match how other tools are pinned).

- [ ] **Step 3: Commit**

```bash
git add mise.toml
git commit -m "cicd(deploy): pin rclone in toolchain

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 2: Sitemap per-URL lastmod

**Files:**
- Modify: `apps/website/astro.config.mjs`
- Create: `apps/website/sitemap-lastmod.mjs` (helper module colocated with the config; NOT under `src/` — it runs in the config's Node context)

**Interfaces:**
- Consumes: `@astrojs/sitemap`'s `serialize(item)` hook — `item.url` is the absolute URL.
- Produces: `sitemapLastmod(item)` exported from `sitemap-lastmod.mjs`, returning the item with `lastmod` added when resolvable.

- [ ] **Step 1: Survey the real routes and content layout (read-only)**

Read `apps/website/src/pages/` (both locale trees) and `apps/website/src/content/` to record: the articles collection directory layout (per-locale subdirs and file extensions), the exact article URL shapes for en (`/articles/<slug>/`) and de (`/de-de/articles/<slug>/` — CONFIRM against the actual `[slug].astro` locations and `getStaticPaths`), and every static-page route → `src/pages/**.astro` file mapping. Adjust Step 2's mapping tables to what you find — the code below encodes the expected layout but the tree is the authority.

- [ ] **Step 2: Write `apps/website/sitemap-lastmod.mjs`**

```js
// Resolves per-URL <lastmod> for @astrojs/sitemap's serialize hook.
// Articles: frontmatter updatedDate ?? pubDate (matches JSON-LD dateModified).
// Other pages: last git commit date of the page's source file.
// Unresolvable: return the item unchanged (omitting lastmod beats lying).
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

function gitLastmod(relPath) {
  try {
    const out = execFileSync(
      'git', ['log', '-1', '--format=%cI', '--', relPath],
      { cwd: HERE, encoding: 'utf8' },
    ).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function frontmatterDate(relPath) {
  try {
    const raw = readFileSync(join(HERE, relPath), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const pick = (key) => fm.match(new RegExp(`^${key}:\\s*['"]?([0-9]{4}-[0-9]{2}-[0-9]{2}[^'"\\n]*)`, 'm'))?.[1];
    const date = pick('updatedDate') ?? pick('pubDate');
    if (!date) return undefined;
    const parsed = new Date(date);
    return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
  } catch {
    return undefined;
  }
}

// Adjust these to the surveyed tree (Step 1).
const ARTICLE_DIRS = { 'en-us': 'src/content/articles/en-us', 'de-de': 'src/content/articles/de-de' };
const ARTICLE_EXTS = ['.md', '.mdx'];

function articleFile(locale, slug) {
  for (const ext of ARTICLE_EXTS) {
    const rel = `${ARTICLE_DIRS[locale]}/${slug}${ext}`;
    if (existsSync(join(HERE, rel))) return rel;
  }
  return undefined;
}

function pageFile(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/';
  const candidates = clean === '/'
    ? ['src/pages/index.astro']
    : [`src/pages${clean}.astro`, `src/pages${clean}/index.astro`];
  return candidates.find((rel) => existsSync(join(HERE, rel)));
}

export function sitemapLastmod(item) {
  const { pathname } = new URL(item.url);
  const article =
    pathname.match(/^\/articles\/([^/]+)\/?$/) ? { locale: 'en-us', slug: RegExp.$1 } :
    pathname.match(/^\/de-de\/articles\/([^/]+)\/?$/) ? { locale: 'de-de', slug: RegExp.$1 } :
    undefined;

  let lastmod;
  if (article) {
    const rel = articleFile(article.locale, article.slug);
    lastmod = rel ? frontmatterDate(rel) : undefined;
  } else {
    const rel = pageFile(pathname);
    lastmod = rel ? gitLastmod(rel) : undefined;
  }
  return lastmod ? { ...item, lastmod } : item;
}
```
Adapt the regexes/dirs to the surveyed reality (e.g. if de article routes differ). Every sitemap URL must resolve through exactly one of the two paths or fall through unchanged.

- [ ] **Step 3: Wire into `astro.config.mjs`**

```js
import { sitemapLastmod } from './sitemap-lastmod.mjs';
// in integrations:
sitemap({ serialize: sitemapLastmod }),
```

- [ ] **Step 4: Build and verify**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8/apps/website
bun run build
# every article URL has a lastmod:
grep -o '<url><loc>[^<]*articles/[^<]*</loc><lastmod>[^<]*</lastmod>' dist/sitemap-0.xml | wc -l
# compare against total article URLs:
grep -o '<loc>[^<]*articles/[^<]*</loc>' dist/sitemap-0.xml | wc -l
# spot-check one article's lastmod against its frontmatter, and /cv/ against:
git log -1 --format=%cI -- src/pages/cv.astro
# determinism: build twice, sitemap must be byte-identical
cp dist/sitemap-0.xml /tmp1.xml 2>/dev/null || cp dist/sitemap-0.xml .screenshots/sitemap-a.xml
bun run build
diff .screenshots/sitemap-a.xml dist/sitemap-0.xml && echo DETERMINISTIC
```
Expected: article counts match (index pages aside), spot-checks agree, DETERMINISTIC prints. (Keep scratch files under `apps/website/.screenshots/`, gitignored.)

- [ ] **Step 5: Commit**

```bash
git add apps/website/astro.config.mjs apps/website/sitemap-lastmod.mjs
git commit -m "feat(website): emit accurate per-URL sitemap lastmod

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 3: rclone two-phase deploy

**Files:**
- Modify: `scripts/deploy-website.sh` (the upload block only — prune + assertion stay byte-identical)

**Interfaces:**
- Consumes: the script's existing Scaleway credential variables (READ THE SCRIPT FIRST — mirror exactly what it exports for the aws CLI today, including the `ACCESS_KEY@PROJECT_ID` suffix pattern).
- Produces: `deploy-website.sh` uploading via rclone; `aws s3 cp` block removed.

- [ ] **Step 1: Read the current script end-to-end** — record how credentials/endpoint reach the aws CLI (env names, any `@project-id` suffixing) and replicate for rclone.

- [ ] **Step 2: Replace the `aws s3 cp` block**

```bash
# Incremental upload via rclone (checksum-exact, MD5 vs S3 ETag).
# Phase 1: assets first so no live HTML ever references a missing file.
# Phase 2: HTML + deletions of stale objects (bucket is fully regenerable from git).
export RCLONE_CONFIG_SCW_TYPE=s3
export RCLONE_CONFIG_SCW_PROVIDER=Scaleway
export RCLONE_CONFIG_SCW_ACCESS_KEY_ID="<same value the aws CLI received>"
export RCLONE_CONFIG_SCW_SECRET_ACCESS_KEY="<same secret the aws CLI received>"
export RCLONE_CONFIG_SCW_ENDPOINT="https://s3.nl-ams.scw.cloud"
export RCLONE_CONFIG_SCW_ACL=public-read

rclone copy dist/ scw:sebastian-heitmann-website \
  --checksum --exclude '*.html' --fast-list --transfers 8 -v

rclone sync dist/ scw:sebastian-heitmann-website \
  --checksum --fast-list --transfers 8 -v

rclone check dist/ scw:sebastian-heitmann-website --checksum --fast-list
```
Use the object-level `RCLONE_CONFIG_SCW_ACL` env (equivalent to `--s3-acl`) so both phases inherit it; keep `-v` so the deploy log names every transferred/deleted file (the future IndexNow hook reads this). The trailing `rclone check` makes the script fail loudly if the bucket somehow diverges.

- [ ] **Step 3: Behavioral verification against a LOCAL destination** (never the real bucket)

```bash
cd /home/donheidi/code/sebastian-heitmann-v8/apps/website
rm -rf .screenshots/bucket-sim && mkdir -p .screenshots/bucket-sim
# initial "deploy"
rclone copy dist/ .screenshots/bucket-sim --checksum --exclude '*.html' -v 2>&1 | tail -2
rclone sync dist/ .screenshots/bucket-sim --checksum -v 2>&1 | tail -2
# idempotence: re-run both; expect zero transfers
rclone sync dist/ .screenshots/bucket-sim --checksum -v 2>&1 | grep -E 'Transferred:.*0 B|There was nothing to transfer'
# deletion: plant a stale file, re-sync, confirm it's gone
touch .screenshots/bucket-sim/_astro/stale-chunk.js
rclone sync dist/ .screenshots/bucket-sim --checksum -v 2>&1 | grep -i 'stale-chunk.js.*Deleted'
test ! -f .screenshots/bucket-sim/_astro/stale-chunk.js && echo DELETION-OK
# changed-file-only: append a comment to one built HTML file, re-sync, expect exactly 1 transfer
echo '<!-- x -->' >> dist/cv/index.html
rclone sync dist/ .screenshots/bucket-sim --checksum -v 2>&1 | grep -c 'Copied'
bun run build   # restore pristine dist afterwards
rm -rf .screenshots/bucket-sim
```
Expected: idempotent second sync (0 bytes), DELETION-OK, exactly 1 copied file for the single-file edit.

- [ ] **Step 4: Real-bucket DRY-RUN (only if credentials resolve; skip cleanly otherwise)**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8
# source creds the same way the script does (varlock), then:
rclone sync apps/website/dist scw:sebastian-heitmann-website --checksum --dry-run --fast-list 2>&1 | tail -5
```
Expected: a plausible transfer/deletion plan, no errors, NOTHING uploaded (`--dry-run`). If `pass-cli`/varlock auth is unavailable in this environment, note that and rely on Step 3.

- [ ] **Step 5: Commit**

```bash
git add scripts/deploy-website.sh
git commit -m "feat(deploy): incremental checksum deploys via two-phase rclone sync

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

### Task 4: Push + stacked PR

- [ ] **Step 1:** `bun run build` green and `git status` clean in the worktree.
- [ ] **Step 2:**

```bash
cd /home/donheidi/code/sebastian-heitmann-v8
git push -u origin feat/incremental-deploy
gh pr create --base feat/v8-asterisk-migration \
  --title "feat(deploy): incremental rclone deploys + sitemap lastmod" \
  --body "<summary per repo convention; note stacked on #9, retargets to main when it merges; include the local-destination verification evidence and the never-deployed caveat>

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
Expected: PR opens against the migration branch (GitHub retargets to `main` automatically when PR #9 merges).

## Self-review notes

- Spec coverage: rclone/mise (T1), lastmod serialize with both sources + omission fallback + determinism check (T2), two-phase upload/ACL/deletions/credential mirroring + kept prune/assertion (T3), stacked PR (T4). Out-of-scope items (IndexNow, aws removal, CDN purge) have no tasks — correct.
- The lastmod helper code is complete but Step 1 of T2 makes the real tree authoritative — route shapes (especially de-de article URLs) must be confirmed, not assumed.
- No real deploy anywhere; bucket interactions are dry-run-only and clearly gated.
