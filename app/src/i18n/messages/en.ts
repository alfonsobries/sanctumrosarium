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
    reading: 'Reading',
    readingNote: 'Read the passage and listen.',
    silenceLabel: 'Silence',
    beadCount: '{{bead}} of 10',
    decadeCount: 'Decade {{decade}} of {{total}}',
    fruit: 'Fruit: {{fruit}}',
    advanceHint: 'Tap the screen to move to the next prayer.',
    backHint: 'Returns to the previous prayer.',
    next: 'Next',
    leave: 'Leave',
    leaveHint: 'Keeps your place and returns home.',
    listen: 'Listen',
    pause: 'Pause',
    listenHint: 'The guide says its part and leaves the silence for your answer.',
    resumeInDecade: 'You were in decade {{decade}}.',
    resumeStarted: 'A Rosary is already begun.',
    resumeOtherDay: 'It was left unfinished another day.',
    resume: 'Resume',
    startOver: 'Start over',
    partsNote:
      'The plenary indulgence asks for five decades in one go, with the usual conditions. Praying in parts is prayer all the same, and it counts for your Rule.',
    partsNoteLink: 'The full explanation, at sanctamaria.app/questions',
    doneDecades: 'Five decades.',
    duration_one: '{{count}} minute',
    duration_many: '{{count}} minutes',
    duration_other: '{{count}} minutes',
    dark: 'In the dark',
    darkEnterHint: 'Dims the screen down to the minimum.',
    darkExitHint: 'Press and hold to leave.',
    finish: 'Finish',
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    appLanguage: 'App language',
    prayerLanguage: 'Prayer language',
    prayerLanguageHint:
      'It can differ from the app language: the app in English, the prayers in Latin.',
    prayerForm: 'Form of the Rosary',
    prayerFormHint:
      'Choosing a form arranges the optional prayers at once; each one can be adjusted afterwards. What is essential never changes: mystery, Our Father, ten Hail Marys, Glory Be.',
    optionalPrayers: 'Optional prayers',
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
  forms: {
    auto: 'Follow the prayer language',
    roman: 'Roman form',
    'es-MX': 'Mexican form',
    'es-ES': 'Spanish form',
    dominican: 'Dominican form',
  },
  optional: {
    'oratio-fatimae':
      'After each decade; it comes from the 1917 Fátima apparitions and is not an essential part.',
    'ave-maria-purissima': 'Hispanic custom greeting closing the decade.',
    'actus-contritionis': 'Act of contrition at the start, as preparation.',
    oblatio: 'Offering of the Rosary at the start.',
    'oratio-litaniarum': 'The prayer that follows the litany.',
    'oratio-pro-papa':
      "For the Pope's intentions; one of the conditions of the plenary indulgence.",
    'sub-tuum': 'Ancient Marian antiphon; Leo XIII added it at the end in October.',
  },
  settingsHaptics: {
    title: 'Haptics',
    off: 'Off',
    gentle: 'Gentle',
    strong: 'Strong',
    hint: 'One touch per bead; the Our Father and the Glory Be feel different.',
  },
  settingsLatin: {
    mixTitle: 'In your language, prayer by prayer',
    mixHint:
      'Turn on the ones you want to pray in your language while you learn; the rest stays in Latin.',
    title: 'Latin prayer text',
    both: 'Latin and your language',
    la: 'Latin only',
    own: 'Your language only',
    hint: 'The two languages run line by line; nothing is translated: the official texts are simply paired.',
  },
  rule: {
    title: 'Rule',
    names: {
      none: 'No rule',
      'daily-decade': 'One decade a day',
      'daily-rosary': 'Five decades a day',
      'weekly-fifteen': 'Fifteen decades a week',
      'full-rosary': 'The twenty mysteries',
    },
    lines: {
      none: 'Pray whenever you pray. The app keeps no count.',
      'daily-decade': 'One decade, every day.',
      'daily-rosary': 'The daily Rosary.',
      'weekly-fifteen': 'The way the Confraternity of the Rosary does it.',
      'full-rosary': 'Joyful, luminous, sorrowful and glorious, every day.',
    },
    confraternity:
      'The Confraternity of the Most Holy Rosary (Order of Preachers) asks its members to strive to pray the fifteen decades each week. In its own words, it does not bind under sin. Choosing it here does not enroll you.',
    footer: 'The Rule is yours: lower it or remove it right here, whenever you want.',
    progressDay: '{{done}} of {{target}} decades today.',
    progressWeek: '{{done}} of {{target}} decades this week.',
  },
  fidelity: {
    title: 'Faithfulness',
    pause: 'Paused',
    pauseHint: 'Illness, travel, grief: paused days leave no gap and ask no explanation.',
    daysLine: '{{done}} of {{total}} days',
    weeksLine: '{{done}} of {{total}} weeks',
    noRule: 'Faithfulness goes with a Rule; choose one if you want to see it here.',
  },
  reminder: {
    title: 'Reminder',
    off: 'Off',
    hour: 'At an hour',
    angelus: 'Angelus (6, 12 and 18)',
    body: 'It is the hour of the Rosary.',
    hint: 'One notice a day, with the plainest possible text. Nothing else.',
    denied:
      'The app has no notification permission; it is granted in the system settings.',
    open: 'Open system settings',
  },
  intentions: {
    question: 'For whom do you offer this Rosary?',
    placeholder: 'An intention',
    during: 'For {{who}}',
    offeredFor: 'Offered for {{who}}.',
    title: 'Intentions',
    saved: 'Saved',
    history: 'For whom you have prayed',
    times_one: '{{count}} rosary',
    times_many: '{{count}} rosaries',
    times_other: '{{count}} rosaries',
    delete: 'Delete',
    empty: 'Nothing yet. The intention is written when the Rosary begins.',
  },
  roses: {
    title: 'Roses of the month',
    count_one: '{{count}} rosary',
    count_many: '{{count}} rosaries',
    count_other: '{{count}} rosaries',
    empty: 'Each rosary of the month sets a rose.',
    toggle:
      'At the close of the prayer, shows facts of the device: how long it took and how many times the app went to the background. They are not kept and never leave the phone; the conclusions are yours.',
  },
  litany: {
    title: 'Litany of Loreto',
    note: 'An act of worship by itself; it can also close the Rosary from Settings.',
    settingHint: 'Closes the Rosary; an act of worship by itself.',
  },
  clauses: {
    title: 'Mystery clauses',
    hint: "After the name of Jesus, the phrase of the mystery in each Hail Mary (DPPL 201). Our own wording over the German pattern and Montfort's list.",
  },
  pace: {
    title: 'Pace',
    rate: {
      normal: 'Voice at a normal pace',
      calm: 'Voice more unhurried',
    },
    silence: {
      normal: 'Response silence, natural',
      long: 'Response silence, longer',
    },
    announce: {
      short: 'Brief pause on the mystery',
      medium: 'Medium pause on the mystery',
      long: 'Long pause on the mystery',
    },
    hint: 'The tranquil pace is the normal mode; there is no fast mode.',
  },
  choir: {
    title: 'Two choirs',
    guide: 'The voice leads, you answer',
    respond: 'You lead, the voice answers',
    hint: 'For praying aloud, with the phone at the center of the table. The part that is yours stays silent.',
  },
  camino: {
    title: 'The Way',
    intro:
      'Eight manners of praying the same Rosary. They are walked by praying, starting wherever you want.',
    anyOrder: 'The order suggests; every stage opens whenever you choose.',
    toggle:
      'At the close of the prayer, shows facts of the device: how long it took and how many times the app went to the background. They are not kept and never leave the phone; the conclusions are yours.',
    timesRosaries: '{{done}} of {{target}} Rosaries',
    timesDays: '{{done}} of {{target}} days',
    state: {
      notStarted: 'Not started',
      walked: 'Walked',
    },
    mark: 'I prayed this way today',
    marked: 'Counted for today.',
    unmark: "Take back today's mark",
    markHint: 'Only you can say this; it counts one day at a time.',
    stages: {
      structure: {
        title: 'The structure',
        teach:
          'What the Rosary is: its parts, the mysteries, and the day each set belongs to.',
        how: 'Pray one Rosary with the app, beginning to end.',
        walked:
          'You now know how to pray the whole Rosary and which mysteries belong to today.',
      },
      meditate: {
        title: 'Meditating',
        teach:
          'Announcing the mystery, listening to it, and keeping a moment of silence before the decade (RVM 29-31).',
        how: 'In Settings, lengthen the mystery pause and hold it before each decade.',
        walked: 'You now know how to pause on the mystery before praying it.',
      },
      clauses: {
        title: 'The clauses',
        teach:
          'Adding to the name of Jesus the phrase of the mystery in each Hail Mary (DPPL 201).',
        how: 'Turn on the mystery clauses in Settings and pray a full set.',
        walked: 'You now know how to pray the Hail Mary with the mystery inside it.',
      },
      respond: {
        title: 'Answering',
        teach:
          'Praying in two voices: one says the first half and the other answers the second.',
        how: 'In Settings, under Two choirs, choose to lead; pray aloud with the guide.',
        walked: 'You now know how to lead and be answered.',
      },
      latin: {
        title: 'Latin',
        teach:
          'The same prayers in the language of the Church, from hearing them to answering them.',
        how: 'Switch the prayer language to Latin; the text can carry your own language under it.',
        walked: 'You now know how to pray the Rosary in Latin.',
      },
      sung: {
        title: 'Singing',
        teach: 'The Salve and the litany are also sung.',
        how: 'When you sing the Salve or the litany at the close of the Rosary, mark it here.',
        walked: 'You now know how to close the Rosary singing.',
      },
      family: {
        title: 'With your household',
        teach: 'Two choirs, aloud, with the people at home.',
        how: 'Pray with someone else, the phone at the center of the table, and mark it here.',
        walked: 'You now know how to pray the Rosary in company.',
      },
      twenty: {
        title: 'The twenty mysteries',
        teach: 'The four sets of mysteries in a single day: the complete Rosary.',
        how: 'Pray the four sets of mysteries in one day, in as many sessions as you need.',
        walked: 'You now know how to pray the Rosary of the twenty mysteries.',
      },
    },
  },
  recollection: {
    title: 'At the close',
    toggle:
      'At the close of the prayer, shows facts of the device: how long it took and how many times the app went to the background. They are not kept and never leave the phone; the conclusions are yours.',
    noInterruptions: 'No interruptions.',
    exits_one: 'The app went to the background 1 time.',
    exits_other: 'The app went to the background {{count}} times.',
  },
  latinLearn: {
    title: 'Learning the Latin',
    settingsHint: 'From hearing it to answering from memory, prayer by prayer.',
    intro: 'Three modes per prayer. You choose; the app never raises them on its own.',
    hint: 'Changing modes never loses your place in the prayer.',
    provisional:
      'The Latin voice is provisional, synthesized while a human recording arrives: the pronunciation is not yet guaranteed.',
    modes: {
      listen: 'Hear both halves',
      read: 'Answer reading',
      memory: 'Answer from memory',
    },
    revealHint: 'A tap shows the text for this step.',
    yourTurn: 'Your turn.',
  },
  meditation: {
    title: 'Meditating',
    reading: 'Reading the Word',
    readingHint:
      'Before each decade, the reference of the passage of the mystery (RVM 30).',
    silence: {
      0: 'No silence',
      10: 'Ten seconds of silence',
      30: 'Half a minute of silence',
      60: 'One minute of silence',
    },
    hint: 'Announce the mystery, hear the Word, and keep a moment of quiet; a tap always moves on.',
  },
  school: {
    title: 'School of the Rosary',
    intro:
      'What the Rosary is, where it comes from, what the Church says, and what it is not. Every statement carries its source.',
    source: 'Main source: {{name}}.',
    kind: {
      magisterium: 'Magisterium',
      liturgy: 'Liturgy',
      tradition: 'Pious tradition',
    },
  },
  confraternity: {
    title: 'The Rosary Confraternity',
    lead: 'More than five hundred years of praying the Rosary together, with a commitment the Confraternity itself says does not bind under sin.',
    blocks: {
      what: 'The Confraternity of the Most Holy Rosary is an association of the Order of Preachers. The commitment of each member: striving to pray the fifteen mysteries of the Rosary each week, spread out as they wish. No dues and no meetings; and in its own words, this commitment does not bind under sin.',
      luminous:
        'The Confraternity encourages adding the luminous mysteries as one more weekly Rosary, though it has received no official statement incorporating them into the commitment.',
      benefits:
        'The benefits are described by the Confraternity itself: a share in the prayers, Masses and works of the whole Order and of its members, living and dead, and the indulgences the Church grants the Confraternity on its feasts, under the usual conditions.',
      enrollment:
        'Enrollment is personal: it takes enough age to understand the commitment, the dead are not enrolled, and a non-Catholic may be admitted (reply of the Promoter General of the Rosary, 2019). It is done with the Dominicans, online or at any priory. The app enrolls no one.',
      rule: 'If you choose the Rule "The way the Confraternity does it", the app counts your fifteen decades of the week. Missing some days expels you from nothing.',
    },
    enroll: 'Enroll with the Dominicans',
    enrollNote: 'Also at dominicos.org (Spain) and dominicos.mx (Mexico).',
    source: 'Source: rosarycenter.org, Confraternity of the Most Holy Rosary.',
  },
  error: {
    screen: 'Something failed while opening this screen.',
  },
} as const;
