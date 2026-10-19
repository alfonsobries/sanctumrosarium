import type { MysterySet } from '@sanctamaria/rosary';

export type Language = 'en' | 'es';

/** English is the default and lives at the root; Spanish lives under /es/. */
export const defaultLanguage: Language = 'en';

export const languages: readonly Language[] = ['en', 'es'];

/** Every page of the site, by name, in both languages. */
export const routes = {
  home: { en: '/', es: '/es/' },
  how: { en: '/how-to-pray-the-rosary/', es: '/es/como-rezar-el-rosario/' },
  mysteries: { en: '/mysteries-of-the-rosary/', es: '/es/misterios-del-rosario/' },
  today: { en: '/todays-mysteries/', es: '/es/misterios-de-hoy/' },
  prayers: { en: '/rosary-prayers/', es: '/es/oraciones-del-rosario/' },
  promises: { en: '/rosary-promises/', es: '/es/promesas-del-rosario/' },
  help: { en: '/help/', es: '/es/ayudar/' },
  privacy: { en: '/privacy/', es: '/es/privacidad/' },
  terms: { en: '/terms/', es: '/es/terminos/' },
  support: { en: '/support/', es: '/es/soporte/' },
} as const;

export type RouteName = keyof typeof routes;

export const setSlugs: Record<MysterySet, Record<Language, string>> = {
  joyful: { es: 'gozosos', en: 'joyful' },
  luminous: { es: 'luminosos', en: 'luminous' },
  sorrowful: { es: 'dolorosos', en: 'sorrowful' },
  glorious: { es: 'gloriosos', en: 'glorious' },
};

/** The prayers of the Rosary that get a page, in the order they are prayed. */
export const prayerSlugs = {
  'sign-of-the-cross': { es: 'senal-de-la-cruz', en: 'sign-of-the-cross' },
  'apostles-creed': { es: 'credo', en: 'apostles-creed' },
  'our-father': { es: 'padre-nuestro', en: 'our-father' },
  'hail-mary': { es: 'ave-maria', en: 'hail-mary' },
  'glory-be': { es: 'gloria', en: 'glory-be' },
  'fatima-prayer': { es: 'oracion-de-fatima', en: 'fatima-prayer' },
  'hail-holy-queen': { es: 'salve', en: 'hail-holy-queen' },
  'rosary-closing-prayer': { es: 'oracion-final', en: 'closing-prayer' },
  'litany-of-loreto': { es: 'letania-lauretana', en: 'litany-of-loreto' },
} as const;

export type PrayerPageId = keyof typeof prayerSlugs;

export const prayerPageIds = Object.keys(prayerSlugs) as PrayerPageId[];

export function route(name: RouteName, language: Language): string {
  return routes[name][language];
}

export function setRoute(set: MysterySet, language: Language): string {
  return `${routes.mysteries[language]}${setSlugs[set][language]}/`;
}

export function prayerRoute(id: PrayerPageId, language: Language): string {
  return `${routes.prayers[language]}${prayerSlugs[id][language]}/`;
}

/** The same page in the other language, for hreflang and the language switch. */
export type Alternates = Record<Language, string>;

export function alternatesOf(name: RouteName): Alternates {
  return { en: routes[name].en, es: routes[name].es };
}

export const stores = {
  appStore: 'https://apps.apple.com/app/id6803640796',
  appStoreId: '6803640796',
  playStore: 'https://play.google.com/store/apps/details?id=app.sanctamaria',
} as const;

export const repository = 'https://github.com/alfonsobries/sanctumrosarium';
export const donations = 'https://sanctum-rosarium.dona.me/';
