#!/usr/bin/env bun
/* Post-build gate. Walks a dist/ tree, extracts the single JSON-LD block from
 * every page, and validates it. Wired into both deploy scripts, which are the
 * only enforcement point: this repo has no CI. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { validateGraph } from '@sh/structured-data';

const dist = process.argv[2];
if (!dist) {
  console.error('usage: check-structured-data.ts <dist-dir>');
  process.exit(2);
}

const SCRIPT_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const ROOT_HTML = 'index.html';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

// Finding 3: nothing else in this gate asserts a WebSite node exists at all.
// validateGraph checks per-page facts about whatever graph it is handed; it
// cannot see the rest of the tree, so it can never notice "no page anywhere
// defines a WebSite node" — a defect a future edit to website()'s root-only
// guard, or a layout that stops calling website(), could introduce silently.
// This wrapper walks the whole dist/ tree already, so it is the right place
// to check tree-wide facts. Recurses like validate.ts's own walk(), since a
// WebSite node is always top-level in practice but nothing enforces that.
function hasWebsiteNode(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasWebsiteNode);
  if (typeof value !== 'object' || value === null) return false;
  const node = value as Record<string, unknown>;
  if (node['@type'] === 'WebSite') return true;
  return Object.values(node).some(hasWebsiteNode);
}

const errors: string[] = [];
let checked = 0;
let rootSeen = false;
const websiteNodePages: string[] = [];

for (const file of htmlFiles(dist)) {
  const rel = file.slice(dist.length + 1);
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(SCRIPT_RE)];

  // 404 has no entity to describe and is excluded from indexing anyway.
  // Finding G: match the file name at any depth (e.g. `de-de/404.html`), not
  // just the literal root path — AGENTS.md documents `noStructuredData` as
  // the convention for "404 pages", plural, and both layouts already honor
  // it per-locale.
  if (rel === '404.html' || rel.endsWith('/404.html')) {
    if (blocks.length > 0) errors.push(`${rel}: expected no JSON-LD, found ${blocks.length}`);
    continue;
  }

  if (blocks.length !== 1) {
    errors.push(`${rel}: expected exactly one JSON-LD block, found ${blocks.length}`);
    continue;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(blocks[0]![1]!);
  } catch (cause) {
    errors.push(`${rel}: JSON-LD does not parse (${(cause as Error).message})`);
    continue;
  }

  errors.push(...validateGraph(parsed, { path: rel }));
  checked += 1;

  if (rel === ROOT_HTML) rootSeen = true;
  const g = (parsed as Record<string, unknown>)['@graph'];
  if (Array.isArray(g) && hasWebsiteNode(g)) websiteNodePages.push(rel);
}

// Finding 3: the tree's root page must define exactly one WebSite node, and
// no other page may define one. Google requires the node on "the domain or
// subdomain level root URI" and ignores copies elsewhere
// (https://developers.google.com/search/docs/appearance/site-names), and
// website() (packages/structured-data/src/site.ts) is written to match: it
// returns the node only for pathname === '/', null everywhere else. This
// check exists so a regression in that guard — or a layout that stops
// calling website() at all — fails the deploy instead of silently dropping
// the site-name feature.
if (!rootSeen) {
  errors.push(`${ROOT_HTML}: no root page found in ${dist} — cannot verify the WebSite node`);
} else if (!websiteNodePages.includes(ROOT_HTML)) {
  errors.push(`${ROOT_HTML}: missing WebSite node — Google requires it on the domain root`);
}
const strayWebsitePages = websiteNodePages.filter((page) => page !== ROOT_HTML);
if (strayWebsitePages.length > 0) {
  errors.push(`WebSite node defined outside ${ROOT_HTML}: ${strayWebsitePages.join(', ')} (expected only the root)`);
}

if (errors.length > 0) {
  console.error(`structured data invalid in ${dist} — refusing to deploy.`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(`structured data OK (${checked} pages checked in ${dist})`);
