// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sanctamaria.app',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-MX', en: 'en-US' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  image: { responsiveStyles: true },
  // The whole stylesheet is a few KB: inlined, the first paint waits on nothing.
  build: { inlineStylesheets: 'always' },
});
