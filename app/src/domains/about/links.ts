export type SitePage = 'home' | 'help' | 'support' | 'privacy' | 'terms';
export type SiteLanguage = 'en' | 'es';

const site = 'https://sanctumrosarium.app';

const paths: Record<SitePage, Record<SiteLanguage, string>> = {
  home: { en: '/', es: '/es/' },
  help: { en: '/help/', es: '/es/ayudar/' },
  support: { en: '/support/', es: '/es/soporte/' },
  privacy: { en: '/privacy/', es: '/es/privacidad/' },
  terms: { en: '/terms/', es: '/es/terminos/' },
};

export function siteUrl(page: SitePage, language: SiteLanguage): string {
  return `${site}${paths[page][language]}`;
}

export function siteLanguageOf(locale: string): SiteLanguage {
  return locale.startsWith('es') ? 'es' : 'en';
}
