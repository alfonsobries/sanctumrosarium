export const languages = { es: 'Español', en: 'English' } as const;

export type UiLanguage = keyof typeof languages;

/**
 * Site copy. Each language is written, not translated: same intent, its own words.
 * The prayers and mysteries never live here; they come from @rosario/content.
 */
export const ui = {
  es: {
    'site.title': 'SanctaMaria',
    'site.tagline': 'Para rezar el Rosario',
    'site.description':
      'App para rezar el Santo Rosario. La app dice la primera mitad de cada oración y tú respondes. Texto y audio a la vez, en español, inglés y latín. En iPhone, Android y Apple Watch. Gratis, sin cuenta y sin anuncios.',
    'nav.app': 'La app',
    'nav.features': 'Qué hace',
    'nav.how': 'Cómo se reza',
    'nav.school': 'Escuela',
    'school.title': 'Escuela del Rosario',
    'school.lead':
      'Qué es el Rosario, de dónde viene, qué dice la Iglesia y qué no es. Cada afirmación lleva su fuente, y el magisterio, la liturgia y la tradición piadosa se distinguen siempre.',
    'school.source': 'Fuente principal:',
    'school.kind.magisterium': 'Magisterio',
    'school.kind.liturgy': 'Liturgia',
    'school.kind.tradition': 'Tradición piadosa',
    'nav.prayers': 'Las oraciones',
    'nav.mysteries': 'Los misterios',
    'nav.questions': 'Preguntas',
    'nav.about': 'Cómo está hecha',
    'nav.support': 'Apoya',
    'nav.privacy': 'Privacidad',
    'nav.menu': 'Menú',
    'nav.language': 'English',
    'theme.toLight': 'Cambiar a modo claro',
    'theme.toDark': 'Cambiar a modo oscuro',
    skip: 'Ir al contenido',

    'hero.title': 'Rezar el Rosario, todos los días.',
    'hero.lead':
      'SanctaMaria dice la primera mitad de cada oración y espera tu respuesta. Texto y audio a la vez, en español, inglés y latín. En el teléfono y en el Apple Watch. Gratis, sin cuenta y sin anuncios.',
    'hero.stores': 'Descargar la app',
    'cta.appstore': 'Consíguelo en el App Store',
    'cta.play': 'Disponible en Google Play',

    'corona.label':
      'La corona del Rosario: la cruz, las cuentas de la entrada, la medalla y cinco decenas de diez cuentas.',
    'corona.caption': 'Cada cuenta, una oración. Cinco decenas, un misterio en cada una.',
    'corona.cta': 'Cómo se reza',
    'corona.legend.cross': 'La cruz: la señal de la cruz y el Credo',
    'corona.legend.large': 'Cuenta grande: Padrenuestro',
    'corona.legend.small': 'Cuenta pequeña: Avemaría',
    'corona.legend.chain': 'Entre cuentas: Gloria',
    'corona.legend.medal': 'La medalla: se anuncia el misterio; al final, la Salve',
    'corona.decade': 'Decena',
    'corona.opening': 'Entrada',

    'voices.kicker': 'A dos voces',
    'voices.title': 'La app dice la primera mitad. Tú respondes.',
    'voices.body':
      'El texto se resalta con la voz y se queda en la pantalla mientras suena. Si rezas en silencio, avanzas con un toque. Si apagas la pantalla, siguen el audio y la háptica.',
    'voices.guide': 'La app',
    'voices.you': 'Tú',
    'voices.language': 'Idioma del rezo',
    'voices.lang.es': 'Español',
    'voices.lang.en': 'English',
    'voices.lang.la': 'Latín',

    'pillar.watch.kicker': 'Apple Watch',
    'pillar.watch.title': 'El Rosario entero en la muñeca.',
    'pillar.watch.body':
      'Audio a los auriculares sin el teléfono cerca. Un toque distinto en la muñeca para el Padrenuestro, el Ave y el Gloria. Las cuentas se pasan con la corona. El misterio del día, en la esfera.',
    'pillar.latin.kicker': 'Latín',
    'pillar.latin.title': 'Rezarlo en latín, y aprenderlo.',
    'pillar.latin.body':
      'Todas las oraciones en latín eclesiástico, con audio, alineadas línea a línea con tu idioma. Primero escuchas. Después respondes leyendo. Cuando ya lo sabes, el texto se apaga.',
    'pillar.rule.kicker': 'La Regla',
    'pillar.rule.title': 'Tú fijas cuánto rezas.',
    'pillar.rule.body':
      'Una decena, cinco, el Rosario completo o quince decenas a la semana. El calendario del mes muestra los días fieles a tu Regla. Se puede bajar cuando haga falta, y si un mes se rompe, se retoma.',
    'pillar.source.kicker': 'Con su fuente',
    'pillar.source.title': 'Cada texto dice de dónde viene.',
    'pillar.source.body':
      'Magisterio, liturgia o tradición piadosa: se distingue en cada oración, misterio y explicación. Las quince promesas se muestran con su origen. Las indulgencias se explican con sus condiciones.',

    'today.kicker': 'Hoy',
    'today.season': 'Hoy cambia por el tiempo litúrgico.',
    'today.feast': 'Hoy cambia por la fiesta:',
    'today.cta': 'Los veinte misterios',

    'more.title': 'Todo lo que hace',
    'more.body':
      'Formas de rezar por región, cláusulas, letanías, la Novena de 54 días, la Cofradía, rezar en familia. Está en una sola página.',
    'more.cta': 'Ver qué hace',

    'strip.title': 'Gratis, y completa.',
    'strip.body':
      'Sin anuncios y sin nada de pago dentro del Rosario. Si te sirve, puedes apoyar el desarrollo con un donativo.',
    'strip.cta': 'Apoyar el desarrollo',

    'features.title': 'Qué hace',
    'features.lead':
      'El Rosario completo, en el teléfono y en el reloj. Lo demás ayuda a rezarlo mejor, y se puede apagar.',
    'features.index': 'En esta página',

    'how.title': 'Cómo se reza el Rosario',
    'how.lead':
      'Cinco decenas, un misterio en cada una. Lo que abre y lo que cierra cambia según el país.',
    'how.p1':
      'Un Rosario son cinco decenas de un ciclo de misterios: gozosos, luminosos, dolorosos o gloriosos. En cada decena se anuncia el misterio, se reza un Padrenuestro, diez Avemarías y un Gloria. Juan Pablo II lo describe como contemplar a Cristo con María, y advierte que sin esa atención es «un cuerpo sin alma».',
    'how.p2':
      'En la app eliges la forma de tu región y el idioma del rezo, que puede ser distinto del idioma de la interfaz. Las oraciones opcionales se encienden o se apagan una por una.',
    'how.corona.title': 'La corona',
    'how.order.title': 'El orden',
    'how.order.lead':
      'La secuencia completa, tal como la sigue la app. Elige la forma de tu región.',
    'how.order.form': 'Forma',
    'how.order.opening': 'Al empezar',
    'how.order.decade': 'En cada decena',
    'how.order.decadeNote': 'Cinco veces, una por misterio.',
    'how.order.closing': 'Al terminar',
    'how.order.announce': 'Se anuncia el misterio',
    'how.order.reading': 'Se lee el pasaje del misterio',
    'how.order.litany': 'Letanías lauretanas',
    'how.order.optional': 'opcional',
    'how.order.times': 'veces',
    'how.days.title': 'Qué misterios tocan',
    'how.days.lead':
      'El uso habitual, según Rosarium Virginis Mariae 38. En Adviento y Navidad el domingo suele ser gozoso; en Cuaresma, doloroso.',
    'how.source':
      'Estructura y días: Rosarium Virginis Mariae 12, 19, 37-38; USCCB, How to Pray the Rosary; Directorio sobre la piedad popular 197-202.',
    'how.prayers.cta': 'El texto de cada oración',

    'form.roman': 'Romana',
    'form.es-MX': 'México',
    'form.es-ES': 'España',
    'form.dominican': 'Dominicana',

    'prayers.title': 'Las oraciones',
    'prayers.lead':
      'El texto de cada oración del Rosario, con su fuente. En español y en latín.',
    'prayers.latin': 'En latín',
    'prayers.source': 'Fuente',
    'prayers.twoVoices':
      'A dos voces: la app dice las líneas en gris; tú respondes las demás.',

    'mysteries.title': 'Los veinte misterios',
    'mysteries.lead':
      'Cuatro ciclos de cinco. Cada misterio con su pasaje, el fruto que se pide y la cláusula que se añade al nombre de Jesús en cada Ave.',
    'mysteries.fruit': 'Fruto',
    'mysteries.clause': 'Cláusula',
    'mysteries.source':
      'Los cuatro ciclos y su sentido: Rosarium Virginis Mariae 19-23. Los frutos son tradición catequética y varían por país. Las cláusulas siguen la recomendación del Directorio sobre la piedad popular 201.',

    'sets.gaudiosa': 'Gozosos',
    'sets.luminosa': 'Luminosos',
    'sets.dolorosa': 'Dolorosos',
    'sets.gloriosa': 'Gloriosos',
    'setsLong.gaudiosa': 'Misterios gozosos',
    'setsLong.luminosa': 'Misterios luminosos',
    'setsLong.dolorosa': 'Misterios dolorosos',
    'setsLong.gloriosa': 'Misterios gloriosos',
    'days.gaudiosa': 'Lunes y sábado',
    'days.luminosa': 'Jueves',
    'days.dolorosa': 'Martes y viernes',
    'days.gloriosa': 'Miércoles y domingo',

    'about.title': 'Cómo está hecha',
    'about.lead': 'Las reglas con las que está construida, en una página.',
    'about.1.title': 'Cristo en el centro',
    'about.1.body':
      'El misterio siempre está a la vista, junto al contador. El Rosario es contemplación y la pantalla la acompaña: la imagen, el pasaje y la cláusula están ahí mientras rezas.',
    'about.2.title': 'La app deja el espacio para tu voz',
    'about.2.body':
      'El audio dice la primera mitad de cada oración y espera. Tú respondes la segunda. Se puede rezar con la pantalla apagada, en silencio con el tacto, o en el reloj sin el teléfono.',
    'about.3.title': 'Se cuentan actos',
    'about.3.body':
      'Rosarios, decenas, días. La app registra lo que rezaste y por quién, y nada más. Las indulgencias se explican con sus condiciones, tal como la Iglesia las concede; la app no las otorga ni las cuenta.',
    'about.4.title': 'Constancia sin culpa',
    'about.4.body':
      'La Regla la fijas tú y la puedes bajar. El calendario muestra los días fieles; los que faltan quedan en blanco, sin aviso y sin reproche. Si un mes se rompe, se retoma.',
    'about.5.title': 'La atención se ayuda',
    'about.5.body':
      'Ritmo, pausas, silencio, la imagen del misterio. Lo que la app registra sobre tu recogimiento es opcional, se queda en el teléfono y se puede apagar.',
    'about.6.title': 'Cada texto con su fuente',
    'about.6.body':
      'Magisterio, liturgia y tradición piadosa se distinguen siempre. Las quince promesas se muestran con su origen: tradición piadosa atribuida al beato Alano de la Roche, en el siglo XV.',
    'about.7.title': 'Funciona sin nada',
    'about.7.body':
      'Sin señal, sin cuenta, con la pantalla apagada, y en el reloj sin el teléfono. Los textos y el audio viven en el aparato.',
    'about.8.title': 'Gratis',
    'about.8.body':
      'Sin anuncios y sin nada de pago dentro del Rosario: todos los misterios, todos los idiomas, todo el audio. Quien quiera puede apoyar el desarrollo.',
    'about.9.title': 'Lo que no tiene',
    'about.9.body':
      'Tablas de posiciones, comparaciones entre personas, rachas que se pierden, chat, perfiles, ni meditaciones generadas por máquina.',

    'privacy.title': 'Privacidad',
    'privacy.lead': 'Lo que rezas no sale de tu dispositivo.',
    'privacy.p1':
      'SanctaMaria no pide cuenta. El registro de lo rezado se guarda en el teléfono, con la fecha local de ese día. El respaldo, si lo hay, es el del sistema: iCloud o el equivalente en Android.',
    'privacy.p2':
      'La app no lleva analítica de comportamiento. Si algo se rompe, se puede enviar un reporte de error, sin el contenido de lo que rezabas.',
    'privacy.p3':
      'El micrófono, Salud y las notificaciones se piden en el momento en que se usan, y la app dice para qué. El rezo a dos voces funciona solo con el tacto, sin micrófono.',
    'privacy.p4':
      'Este sitio no usa cookies de seguimiento. El tema claro u oscuro se guarda en este navegador, nada más.',

    'support.title': 'Apoya el desarrollo',
    'support.lead': 'La app es gratis. Si te sirve, puedes dejar un donativo.',
    'support.p1':
      'SanctaMaria no cobra por rezar: sin anuncios, sin suscripción, con el audio y los idiomas incluidos. El donativo paga el desarrollo, las voces grabadas y el mantenimiento. No compra nada dentro de la app.',
    'support.p2':
      'Dentro de la app, donde las tiendas lo permiten, el botón se llama «Apoya el desarrollo». Aquí, en el sitio, el donativo va directo.',
    'support.soon': 'El donativo desde el sitio todavía se está preparando.',

    'notfound.title': 'No está',
    'notfound.lead': 'Esa página no existe.',
    'notfound.cta': 'Ir al inicio',

    'footer.mark': 'SanctaMaria. Para rezar el Rosario.',
    'footer.legal':
      'Apple, el logotipo de Apple, App Store, Apple Watch e iPhone son marcas de Apple Inc., registradas en EE. UU. y otros países. Google Play y el logotipo de Google Play son marcas de Google LLC.',
  },
  en: {
    'site.title': 'SanctaMaria',
    'site.tagline': 'For praying the Rosary',
    'site.description':
      'An app to pray the Holy Rosary. The app says the first half of each prayer and you answer. Words and audio together, in English, Spanish and Latin. On iPhone, Android and Apple Watch. Free, no account, no ads.',
    'nav.app': 'The app',
    'nav.features': 'What it does',
    'nav.how': 'How to pray',
    'nav.school': 'School',
    'school.title': 'School of the Rosary',
    'school.lead':
      'What the Rosary is, where it comes from, what the Church says, and what it is not. Every statement carries its source, and magisterium, liturgy and pious tradition are always kept apart.',
    'school.source': 'Main source:',
    'school.kind.magisterium': 'Magisterium',
    'school.kind.liturgy': 'Liturgy',
    'school.kind.tradition': 'Pious tradition',
    'nav.prayers': 'The prayers',
    'nav.mysteries': 'The mysteries',
    'nav.questions': 'Questions',
    'nav.about': 'How it is made',
    'nav.support': 'Support',
    'nav.privacy': 'Privacy',
    'nav.menu': 'Menu',
    'nav.language': 'Español',
    'theme.toLight': 'Switch to light mode',
    'theme.toDark': 'Switch to dark mode',
    skip: 'Skip to content',

    'hero.title': 'The Rosary, every day.',
    'hero.lead':
      'SanctaMaria says the first half of each prayer and waits for your answer. Words and audio together, in English, Spanish and Latin. On the phone and on the Apple Watch. Free, no account, no ads.',
    'hero.stores': 'Get the app',
    'cta.appstore': 'Download on the App Store',
    'cta.play': 'Get it on Google Play',

    'corona.label':
      'The rosary beads: the cross, the opening beads, the medal and five decades of ten beads.',
    'corona.caption': 'Every bead is a prayer. Five decades, one mystery in each.',
    'corona.cta': 'How to pray',
    'corona.legend.cross': 'The cross: the Sign of the Cross and the Creed',
    'corona.legend.large': 'Large bead: Our Father',
    'corona.legend.small': 'Small bead: Hail Mary',
    'corona.legend.chain': 'On the chain: Glory Be',
    'corona.legend.medal':
      'The medal: the mystery is announced; at the end, the Hail Holy Queen',
    'corona.decade': 'Decade',
    'corona.opening': 'Opening',

    'voices.kicker': 'Two voices',
    'voices.title': 'The app says the first half. You answer.',
    'voices.body':
      'The words are highlighted with the voice and stay on the screen while it plays. Praying in silence, you advance with a tap. With the screen off, audio and haptics keep going.',
    'voices.guide': 'The app',
    'voices.you': 'You',
    'voices.language': 'Language of the prayer',
    'voices.lang.es': 'Español',
    'voices.lang.en': 'English',
    'voices.lang.la': 'Latin',

    'pillar.watch.kicker': 'Apple Watch',
    'pillar.watch.title': 'The whole Rosary on your wrist.',
    'pillar.watch.body':
      "Audio to your headphones with the phone left at home. A different tap on the wrist for the Our Father, the Hail Mary and the Glory Be. Beads move with the Digital Crown. Today's mystery on the watch face.",
    'pillar.latin.kicker': 'Latin',
    'pillar.latin.title': 'Pray it in Latin, and learn it.',
    'pillar.latin.body':
      'Every prayer in ecclesiastical Latin, with audio, lined up with your own language line by line. First you listen. Then you answer while reading. Once you know it, the words fade out.',
    'pillar.rule.kicker': 'The Rule',
    'pillar.rule.title': 'You set how much you pray.',
    'pillar.rule.body':
      "One decade, five, the full Rosary, or fifteen decades a week. The month's calendar shows the days you kept your Rule. Lower it whenever you need to, and if a month breaks, pick it up again.",
    'pillar.source.kicker': 'With its source',
    'pillar.source.title': 'Every text says where it comes from.',
    'pillar.source.body':
      'Magisterium, liturgy or pious tradition: named in every prayer, mystery and explanation. The fifteen promises are shown with their origin. Indulgences are explained with their conditions.',

    'today.kicker': 'Today',
    'today.season': 'Today changes with the liturgical season.',
    'today.feast': 'Today changes for the feast:',
    'today.cta': 'The twenty mysteries',

    'more.title': 'Everything it does',
    'more.body':
      'Regional forms, clauses, the litany, the 54-day novena, the Confraternity, praying as a family. All on one page.',
    'more.cta': 'See what it does',

    'strip.title': 'Free, and complete.',
    'strip.body':
      'No ads and nothing to buy inside the Rosary. If it serves you, you can support the work with a gift.',
    'strip.cta': 'Support the work',

    'features.title': 'What it does',
    'features.lead':
      'The whole Rosary, on the phone and on the watch. The rest helps you pray it better, and can be turned off.',
    'features.index': 'On this page',

    'how.title': 'How to pray the Rosary',
    'how.lead':
      'Five decades, one mystery in each. What opens and closes the prayer changes with the country.',
    'how.p1':
      'A Rosary is five decades of one set of mysteries: Joyful, Luminous, Sorrowful or Glorious. In each decade the mystery is announced, then an Our Father, ten Hail Marys and a Glory Be. John Paul II describes it as contemplating Christ with Mary, and warns that without that attention it is "a body without a soul".',
    'how.p2':
      'In the app you pick the form of your region and the language of the prayer, which can differ from the language of the interface. Optional prayers are turned on or off one by one.',
    'how.corona.title': 'The beads',
    'how.order.title': 'The order',
    'how.order.lead':
      'The full sequence, as the app follows it. Pick the form of your region.',
    'how.order.form': 'Form',
    'how.order.opening': 'To begin',
    'how.order.decade': 'In each decade',
    'how.order.decadeNote': 'Five times, once per mystery.',
    'how.order.closing': 'To finish',
    'how.order.announce': 'The mystery is announced',
    'how.order.reading': 'The passage of the mystery is read',
    'how.order.litany': 'Litany of Loreto',
    'how.order.optional': 'optional',
    'how.order.times': 'times',
    'how.days.title': 'Which mysteries today',
    'how.days.lead':
      'The usual custom, from Rosarium Virginis Mariae 38. In Advent and Christmas the Sunday is often Joyful; in Lent, Sorrowful.',
    'how.source':
      'Shape and days: Rosarium Virginis Mariae 12, 19, 37-38; USCCB, How to Pray the Rosary; Directory on Popular Piety 197-202.',
    'how.prayers.cta': 'The words of each prayer',

    'form.roman': 'Roman',
    'form.es-MX': 'Mexico',
    'form.es-ES': 'Spain',
    'form.dominican': 'Dominican',

    'prayers.title': 'The prayers',
    'prayers.lead':
      'The words of each prayer of the Rosary, with its source. In English and in Latin.',
    'prayers.latin': 'In Latin',
    'prayers.source': 'Source',
    'prayers.twoVoices':
      'Two voices: the app says the lines in grey; you answer with the rest.',

    'mysteries.title': 'The twenty mysteries',
    'mysteries.lead':
      'Four sets of five. Each mystery with its passage, the fruit asked for, and the clause added to the name of Jesus in each Hail Mary.',
    'mysteries.fruit': 'Fruit',
    'mysteries.clause': 'Clause',
    'mysteries.source':
      'The four sets and their meaning: Rosarium Virginis Mariae 19-23. Fruits are catechetical tradition and vary by country. Clauses follow the recommendation of the Directory on Popular Piety 201.',

    'sets.gaudiosa': 'Joyful',
    'sets.luminosa': 'Luminous',
    'sets.dolorosa': 'Sorrowful',
    'sets.gloriosa': 'Glorious',
    'setsLong.gaudiosa': 'Joyful mysteries',
    'setsLong.luminosa': 'Luminous mysteries',
    'setsLong.dolorosa': 'Sorrowful mysteries',
    'setsLong.gloriosa': 'Glorious mysteries',
    'days.gaudiosa': 'Monday and Saturday',
    'days.luminosa': 'Thursday',
    'days.dolorosa': 'Tuesday and Friday',
    'days.gloriosa': 'Wednesday and Sunday',

    'about.title': 'How it is made',
    'about.lead': 'The rules it is built by, on one page.',
    'about.1.title': 'Christ at the center',
    'about.1.body':
      'The mystery is always in view, next to the count. The Rosary is contemplation and the screen keeps it company: the image, the passage and the clause stay there while you pray.',
    'about.2.title': 'The app leaves room for your voice',
    'about.2.body':
      'The audio says the first half of each prayer and waits. You answer the second. You can pray with the screen off, in silence by touch, or on the watch without the phone.',
    'about.3.title': 'Acts are counted',
    'about.3.body':
      'Rosaries, decades, days. The app records what you prayed and for whom, and nothing else. Indulgences are explained with their conditions, as the Church grants them; the app neither grants nor counts them.',
    'about.4.title': 'Constancy without blame',
    'about.4.body':
      'You set the Rule and you can lower it. The calendar shows the days you kept it; the others stay blank, with no notice and no reproach. If a month breaks, you pick it up again.',
    'about.5.title': 'Attention is helped',
    'about.5.body':
      'Pace, pauses, silence, the image of the mystery. Whatever the app records about your recollection is optional, stays on the phone, and can be turned off.',
    'about.6.title': 'Every text with its source',
    'about.6.body':
      'Magisterium, liturgy and pious tradition are always told apart. The fifteen promises are shown with their origin: pious tradition attributed to Blessed Alan de la Roche, in the fifteenth century.',
    'about.7.title': 'It works with nothing',
    'about.7.body':
      'No signal, no account, screen off, and on the watch without the phone. The words and the audio live on the device.',
    'about.8.title': 'Free',
    'about.8.body':
      'No ads and nothing to buy inside the Rosary: every mystery, every language, all the audio. Anyone who wants to can support the work.',
    'about.9.title': 'What it does not have',
    'about.9.body':
      'Leaderboards, comparisons between people, streaks that break, chat, profiles, or machine-generated meditations.',

    'privacy.title': 'Privacy',
    'privacy.lead': 'What you pray does not leave your device.',
    'privacy.p1':
      "SanctaMaria does not ask for an account. The record of what was prayed stays on the phone, under that day's local date. Any backup is the system's: iCloud, or the Android equivalent.",
    'privacy.p2':
      'The app carries no behavioural analytics. If something crashes, a crash report can be sent, without the words you were praying.',
    'privacy.p3':
      'The microphone, Health and notifications are asked for at the moment they are used, and the app says why. Two-voice prayer works by touch alone, with no microphone.',
    'privacy.p4':
      'This site uses no tracking cookies. The light or dark appearance stays in this browser, and nowhere else.',

    'support.title': 'Support the work',
    'support.lead': 'The app is free. If it serves you, you can leave a gift.',
    'support.p1':
      'SanctaMaria does not charge you to pray: no ads, no subscription, audio and languages included. A gift pays for the development, the recorded voices and the upkeep. It buys nothing inside the app.',
    'support.p2':
      'Inside the app, where the stores allow it, the button is called "Support the work". Here on the site, a gift goes directly.',
    'support.soon': 'Giving from the site is still being set up.',

    'notfound.title': 'Not here',
    'notfound.lead': 'That page does not exist.',
    'notfound.cta': 'Go to the start',

    'footer.mark': 'SanctaMaria. For praying the Rosary.',
    'footer.legal':
      'Apple, the Apple logo, App Store, Apple Watch and iPhone are trademarks of Apple Inc., registered in the U.S. and other countries. Google Play and the Google Play logo are trademarks of Google LLC.',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function t(language: UiLanguage): (key: UiKey) => string {
  return (key) => ui[language][key];
}
