export type SitePage = 'home' | 'help' | 'support' | 'privacy' | 'terms';
export type SiteLanguage = 'es' | 'en';

const site = 'https://sanctumrosarium.app';

const paths: Record<SitePage, Record<SiteLanguage, string>> = {
  home: { es: '/', en: '/en/' },
  help: { es: '/ayudar/', en: '/en/help/' },
  support: { es: '/soporte/', en: '/en/support/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  terms: { es: '/terminos/', en: '/en/terms/' },
};

export function siteUrl(page: SitePage, language: SiteLanguage): string {
  return `${site}${paths[page][language]}`;
}

export function siteLanguageOf(locale: string): SiteLanguage {
  return locale.startsWith('es') ? 'es' : 'en';
}
