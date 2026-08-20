/** Interface copy in English. Written, not translated (docs/voz.md). */
export const en = {
  common: {
    back: 'Back',
    retry: 'Try again',
  },
  sets: {
    gaudiosa: 'Joyful mysteries',
    luminosa: 'Luminous mysteries',
    dolorosa: 'Sorrowful mysteries',
    gloriosa: 'Glorious mysteries',
  },
  seasons: {
    advent: 'Advent',
    christmas: 'Christmastide',
    lent: 'Lent',
    triduum: 'Paschal Triduum',
    easter: 'Eastertide',
    ordinary: 'Ordinary Time',
  },
  home: {
    todayReasonWeekday: 'The ones this day of the week calls for.',
    todayReasonSeason: '{{season}}: custom prays these mysteries.',
    todayReasonSolemnity: '{{feast}}: custom prays these mysteries.',
    start: 'Begin',
    settings: 'Settings',
  },
  pray: {
    beadCount: '{{bead}} of 10 · decade {{decade}}',
    advanceHint: 'Tap the screen to move to the next prayer.',
    backHint: 'Returns to the previous prayer.',
    doneDecades: 'Five decades.',
    finish: 'Finish',
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    appLanguage: 'App language',
    prayerLanguage: 'Prayer language',
    prayerLanguageHint:
      'It can differ from the app language: the app in English, the prayers in Latin.',
    system: 'Match the system',
    light: 'Light',
    dark: 'Dark',
    languageEs: 'Español',
    languageEn: 'English',
    prayerEsMX: 'Español (México)',
    prayerEsES: 'Español (España)',
    prayerEnUS: 'English',
    prayerLa: 'Latin',
  },
  error: {
    screen: 'Something failed while opening this screen.',
  },
} as const;
