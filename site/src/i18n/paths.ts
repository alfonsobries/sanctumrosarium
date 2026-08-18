import type { UiLanguage } from './ui';

export const paths = {
  es: {
    home: '/',
    features: '/funciones/',
    how: '/como-se-reza/',
    mysteries: '/misterios/',
    about: '/filosofia/',
    privacy: '/privacidad/',
    support: '/apoya/',
  },
  en: {
    home: '/en/',
    features: '/en/features/',
    how: '/en/how/',
    mysteries: '/en/mysteries/',
    about: '/en/about/',
    privacy: '/en/privacy/',
    support: '/en/support/',
  },
} as const;

export type PathName = keyof (typeof paths)['es'];

export function pathFor(language: UiLanguage, name: PathName): string {
  return paths[language][name];
}

export const stores = {
  appStore: 'https://apps.apple.com/app/sanctamaria',
  playStore: 'https://play.google.com/store/apps/details?id=app.sanctamaria',
} as const;
