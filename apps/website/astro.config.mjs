import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
    integrations: [
        icon(),
    ],
    i18n: {
        locales: ['en-us', 'de-de'],
        defaultLocale: 'en-us',
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
