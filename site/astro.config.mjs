// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sanctumrosarium.app',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      // The social card templates are photographed at build time and never ship.
      filter: (page) => !page.includes('/404') && !page.includes('/og-card/'),
    }),
  ],
  image: { responsiveStyles: true },
  // The whole stylesheet is a few KB: inlined, the first paint waits on nothing.
  build: { inlineStylesheets: 'always' },
});
