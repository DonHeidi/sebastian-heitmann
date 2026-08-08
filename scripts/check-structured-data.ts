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

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

const errors: string[] = [];
let checked = 0;

for (const file of htmlFiles(dist)) {
  const rel = file.slice(dist.length + 1);
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(SCRIPT_RE)];

  // 404 has no entity to describe and is excluded from indexing anyway.
  if (rel === '404.html') {
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
}

if (errors.length > 0) {
  console.error(`structured data invalid in ${dist} — refusing to deploy.`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(`structured data OK (${checked} pages checked in ${dist})`);
