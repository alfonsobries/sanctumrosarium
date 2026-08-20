import type { UiLanguage } from './ui';

export const paths = {
  es: {
    home: '/',
    features: '/funciones/',
    how: '/como-se-reza/',
    school: '/escuela/',
    prayers: '/oraciones/',
    mysteries: '/misterios/',
    questions: '/preguntas/',
    about: '/como-esta-hecha/',
    privacy: '/privacidad/',
    support: '/apoya/',
    chaplet: '/coronilla/',
    sorrows: '/siete-dolores/',
  },
  en: {
    home: '/en/',
    features: '/en/features/',
    how: '/en/how-to-pray/',
    school: '/en/school/',
    prayers: '/en/prayers/',
    mysteries: '/en/mysteries/',
    questions: '/en/questions/',
    about: '/en/how-it-is-made/',
    privacy: '/en/privacy/',
    support: '/en/support/',
    chaplet: '/en/chaplet/',
    sorrows: '/en/seven-sorrows/',
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
