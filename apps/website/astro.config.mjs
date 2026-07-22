import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import { sitemapLastmod } from './sitemap-lastmod.mjs';

export default defineConfig({
    site: 'https://www.sebastian-heitmann.dev',
    integrations: [sitemap({ serialize: sitemapLastmod }), react()],
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