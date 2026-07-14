import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
    site: 'https://www.sebastian-heitmann.dev',
    integrations: [sitemap(), react()],
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