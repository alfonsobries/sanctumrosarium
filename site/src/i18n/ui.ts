export const languages = { es: 'Español', en: 'English' } as const;

export type UiLanguage = keyof typeof languages;

/**
 * Site copy. Each language is written, not translated: same intent, not the same words.
 * The prayers themselves never live here; they come from @rosario/content.
 */
export const ui = {
  es: {
    'site.title': 'SanctaMaria',
    'site.description':
      'Cómo se reza el Santo Rosario, misterio por misterio, con los textos de cada región.',
    'nav.how': 'Cómo se reza',
    'nav.mysteries': 'Los misterios',
    'nav.donate': 'Donar',
    'home.lead':
      'Una guía del Santo Rosario y una app para rezarlo: en español, en inglés y en latín, con audio, sin anuncios y sin cuenta.',
    'home.today': 'Hoy toca',
    'mysteries.title': 'Los veinte misterios',
    'mysteries.lead':
      'Cuatro ciclos. Cada misterio con su pasaje, el fruto que se pide y la frase que se añade al nombre de Jesús.',
    'mysteries.fruit': 'Fruto',
    'mysteries.clause': 'Cláusula',
    'sets.gaudiosa': 'Gozosos',
    'sets.luminosa': 'Luminosos',
    'sets.dolorosa': 'Dolorosos',
    'sets.gloriosa': 'Gloriosos',
  },
  en: {
    'site.title': 'SanctaMaria',
    'site.description':
      'How the Holy Rosary is prayed, mystery by mystery, with the texts of each region.',
    'nav.how': 'How to pray it',
    'nav.mysteries': 'The mysteries',
    'nav.donate': 'Donate',
    'home.lead':
      'A guide to the Holy Rosary and an app to pray it: in Spanish, English and Latin, with audio, no ads and no account.',
    'home.today': 'Today',
    'mysteries.title': 'The twenty mysteries',
    'mysteries.lead':
      'Four sets. Each mystery with its passage, the fruit asked for, and the clause added to the name of Jesus.',
    'mysteries.fruit': 'Fruit',
    'mysteries.clause': 'Clause',
    'sets.gaudiosa': 'Joyful',
    'sets.luminosa': 'Luminous',
    'sets.dolorosa': 'Sorrowful',
    'sets.gloriosa': 'Glorious',
  },
} as const;

export function t(language: UiLanguage) {
  return (key: keyof (typeof ui)['es']): string => ui[language][key];
}
