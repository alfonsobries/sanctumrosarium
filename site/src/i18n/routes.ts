import type { MysterySet } from '@sanctamaria/rosary';

export type Language = 'es' | 'en';

export const languages: readonly Language[] = ['es', 'en'];

/** Every page of the site, by name, in both languages. */
export const routes = {
  home: { es: '/', en: '/en/' },
  how: { es: '/como-rezar-el-rosario/', en: '/en/how-to-pray-the-rosary/' },
  mysteries: { es: '/misterios-del-rosario/', en: '/en/mysteries-of-the-rosary/' },
  today: { es: '/misterios-de-hoy/', en: '/en/todays-mysteries/' },
  prayers: { es: '/oraciones-del-rosario/', en: '/en/rosary-prayers/' },
  promises: { es: '/promesas-del-rosario/', en: '/en/rosary-promises/' },
  help: { es: '/ayudar/', en: '/en/help/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
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
  return { es: routes[name].es, en: routes[name].en };
}

export const stores = {
  appStore: 'https://apps.apple.com/app/id6803640796',
  appStoreId: '6803640796',
  playStore: 'https://play.google.com/store/apps/details?id=app.sanctamaria',
} as const;

export const repository = 'https://github.com/alfonsobries/sanctumrosarium';
