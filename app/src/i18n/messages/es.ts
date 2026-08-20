/** Interface copy in Spanish. Written, not translated (docs/voz.md). */
export const es = {
  common: {
    back: 'Atrás',
    retry: 'Volver a intentar',
  },
  sets: {
    gaudiosa: 'Misterios gozosos',
    luminosa: 'Misterios luminosos',
    dolorosa: 'Misterios dolorosos',
    gloriosa: 'Misterios gloriosos',
  },
  seasons: {
    advent: 'Adviento',
    christmas: 'Tiempo de Navidad',
    lent: 'Cuaresma',
    triduum: 'Triduo pascual',
    easter: 'Pascua',
    ordinary: 'Tiempo ordinario',
  },
  home: {
    todayReasonWeekday: 'Los que corresponden a este día de la semana.',
    todayReasonSeason: '{{season}}: la costumbre reza estos misterios.',
    todayReasonSolemnity: '{{feast}}: la costumbre reza estos misterios.',
    start: 'Empezar',
    settings: 'Ajustes',
  },
  pray: {
    beadCount: '{{bead}} de 10 · decena {{decade}}',
    advanceHint: 'Toca la pantalla para pasar a la siguiente oración.',
    backHint: 'Vuelve a la oración anterior.',
    doneDecades: 'Cinco decenas.',
    finish: 'Terminar',
  },
  settings: {
    title: 'Ajustes',
    appearance: 'Apariencia',
    appLanguage: 'Idioma de la app',
    prayerLanguage: 'Idioma del rezo',
    prayerLanguageHint:
      'Puede ser distinto del idioma de la app: la app en español y el rezo en latín.',
    system: 'Como el sistema',
    light: 'Claro',
    dark: 'Oscuro',
    languageEs: 'Español',
    languageEn: 'English',
    prayerEsMX: 'Español (México)',
    prayerEsES: 'Español (España)',
    prayerEnUS: 'English',
    prayerLa: 'Latín',
  },
  error: {
    screen: 'Algo falló al abrir esta pantalla.',
  },
} as const;
