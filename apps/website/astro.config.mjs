import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';
import { sitemapLastmod } from './sitemap-lastmod.mjs';

// /de-de/articles/<slug>/ pages for untranslated slugs serve the English text
// and canonicalize to the English URL — keep them out of the sitemap (a sitemap
// should only list canonical URLs).
const mdSlugs = (dir) =>
    readdirSync(fileURLToPath(new URL(dir, import.meta.url)))
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''));
const deSlugs = new Set(mdSlugs('./src/content/articles/de-de'));
const fallbackPaths = mdSlugs('./src/content/articles')
    .filter((slug) => !deSlugs.has(slug))
    .map((slug) => `/de-de/articles/${slug}/`);

export default defineConfig({
    site: 'https://www.sebastian-heitmann.dev',
    integrations: [
        sitemap({
            serialize: sitemapLastmod,
            filter: (page) => !fallbackPaths.some((path) => page.endsWith(path)),
        }),
        react(),
    ],
    i18n: {
        locales: ['en-us', 'de-de'],
        defaultLocale: 'en-us',
        routing: {
            prefixDefaultLocale: false,
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
});