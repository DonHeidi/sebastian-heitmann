// Resolves per-URL <lastmod> for @astrojs/sitemap's serialize hook.
// Articles: frontmatter updatedAt ?? publishedAt (matches JSON-LD dateModified/datePublished
// in src/pages/articles/[slug].astro and src/pages/de-de/articles/[slug].astro).
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
    // Content collection schema (src/content.config.ts) uses `publishedAt` / `updatedAt`.
    const date = pick('updatedAt') ?? pick('publishedAt');
    if (!date) return undefined;
    const parsed = new Date(date);
    return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
  } catch {
    return undefined;
  }
}

// Articles collection (src/content.config.ts) is a single glob over
// src/content/articles/**/*.md — English entries live at the collection root
// (id === slug, e.g. `control-isnt-free`), German entries live under a `de-de/`
// subdirectory (id === `de-de/<slug>`). Only `.md` is used (no `.mdx`).
const ARTICLES_ROOT = 'src/content/articles';

// en route (src/pages/articles/[slug].astro) always serves the root-level file.
// de-de route (src/pages/de-de/articles/[slug].astro) prefers a de-de/<slug>.md
// override and falls back to the English file when no translation exists
// (see that file's getStaticPaths: deArticles ∪ enArticles not shadowed by a
// de slug) — so the same fallback lookup order resolves every de-de URL.
function articleFile(locale, slug) {
  if (locale === 'de-de') {
    const localized = `${ARTICLES_ROOT}/de-de/${slug}.md`;
    if (existsSync(join(HERE, localized))) return localized;
  }
  const rel = `${ARTICLES_ROOT}/${slug}.md`;
  return existsSync(join(HERE, rel)) ? rel : undefined;
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
