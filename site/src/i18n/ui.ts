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
      'App para rezar el Santo Rosario. Texto y audio a la vez, en español, inglés y latín. En iPhone, Android y Apple Watch. Gratis, sin cuenta y sin anuncios.',
    'nav.app': 'La app',
    'nav.features': 'Qué hace',
    'nav.how': 'Cómo se reza',
    'nav.mysteries': 'Los misterios',
    'nav.about': 'Cómo está hecha',
    'nav.support': 'Apoya',
    'nav.privacy': 'Privacidad',
    'nav.menu': 'Menú',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.label': 'Apariencia',
    skip: 'Ir al contenido',
    'hero.lead': 'La app dice la primera mitad. Tú respondes. El texto va con la voz.',
    'hero.sub': 'En iPhone, Android y Apple Watch. Sin cuenta. Sin anuncios. Offline.',
    'cta.appstore': 'Consíguelo en el App Store',
    'cta.play': 'Disponible en Google Play',
    'mock.ave': 'Ave 4 de 10',
    'mock.watchBead': '4',
    'promise.1.title': 'Texto y audio a la vez',
    'promise.1.body':
      'Lees mientras suena. El texto se resalta al ritmo. La voz deja el hueco para que respondas.',
    'promise.2.title': 'El reloj reza solo',
    'promise.2.body':
      'Audio propio, háptica por cuenta y la corona. No es un control remoto del teléfono.',
    'promise.3.title': 'Cada texto con su fuente',
    'promise.3.body':
      'Magisterio, liturgia o tradición piadosa. Se distingue. Nada se escribe de memoria.',
    'band.audio.kicker': 'Cómo se reza',
    'band.audio.title': 'No es un podcast.',
    'band.audio.body':
      'La guía dice la primera mitad del Ave. Tú dices la segunda. Si vas en silencio, el tacto avanza. Si apagas la pantalla, siguen el audio y la háptica.',
    'band.watch.kicker': 'En movimiento',
    'band.watch.title': 'Sin sacar el teléfono.',
    'band.watch.body':
      'SanctaMaria para Apple Watch lleva el Rosario entero: audio a los auriculares, un toque distinto para el Padrenuestro, el Ave y el Gloria, y el misterio del día en la esfera.',
    'band.latin.kicker': 'Latín',
    'band.latin.title': 'Rezarlo, y aprenderlo.',
    'band.latin.body':
      'Textos en latín eclesiástico, línea a línea con tu idioma. Primero escuchas. Después respondes leyendo. Al final, el texto se apaga.',
    'band.rule.kicker': 'Constancia',
    'band.rule.title': 'Una regla, no una racha.',
    'band.rule.body':
      'Tú fijas a qué te comprometes. Se puede bajar. Si un mes se rompe, el calendario se llena de otro modo. No hay pantallas rojas.',
    'home.today': 'Hoy toca',
    'home.more': 'Todo lo que hace',
    'home.more.body':
      'Formas regionales, cláusulas, letanías, la Cofradía, rezar en familia. El detalle está en una sola página.',
    'home.more.cta': 'Ver qué hace',
    'features.title': 'Qué hace',
    'features.lead':
      'El Rosario completo, en el teléfono y en el reloj. Lo demás está para rezarlo mejor, o se puede apagar.',
    'how.title': 'Cómo se reza',
    'how.lead': 'Cinco decenas. Un misterio en cada una. El resto cambia según el país.',
    'how.p1':
      'Un Rosario son cinco decenas de un ciclo de misterios: gozosos, luminosos, dolorosos o gloriosos. Lo esencial no cambia: se anuncia el misterio, se reza un Padrenuestro, diez Avemarías y un Gloria. Juan Pablo II lo llama contemplación de Cristo con María. Sin esa atención, dice, es un cuerpo sin alma.',
    'how.p2':
      'Los días siguen el uso habitual: lunes y sábado, gozosos; jueves, luminosos; martes y viernes, dolorosos; miércoles y domingo, gloriosos. En Adviento y Navidad el domingo suele ser gozoso; en Cuaresma, doloroso.',
    'how.p3':
      'Lo que abre y lo que cierra depende de dónde se reza. En México se empieza por la señal de la cruz y a menudo el acto de contrición. En España es frecuente el «Señor, abre mis labios». En la forma romana, el Credo y las tres Aves de fe, esperanza y caridad. La oración de Fátima, la Salve, las letanías y san Miguel son marco: cada uno se enciende o se apaga.',
    'how.p4':
      'En la app eliges la forma de tu región y el idioma del rezo, que no tiene que ser el de la interfaz. Puedes rezar en latín y leer la app en español. El audio dice la primera mitad y espera. El texto no desaparece mientras suena.',
    'how.source':
      'Estructura y días: Rosarium Virginis Mariae 12, 19, 37-38; USCCB, How to Pray the Rosary; Directorio sobre la piedad popular 197-202.',
    'mysteries.title': 'Los veinte misterios',
    'mysteries.lead':
      'Cuatro ciclos. Cada misterio con su pasaje, el fruto que se pide y la frase que se añade al nombre de Jesús.',
    'mysteries.fruit': 'Fruto',
    'mysteries.clause': 'Cláusula',
    'sets.gaudiosa': 'Gozosos',
    'sets.luminosa': 'Luminosos',
    'sets.dolorosa': 'Dolorosos',
    'sets.gloriosa': 'Gloriosos',
    'about.title': 'Cómo está hecha',
    'about.lead': 'Una app para rezar. No para coleccionar minutos.',
    'about.p1':
      'SanctaMaria existe para que alguien que se propone rezar el Rosario todos los días lo consiga, y lo rece con más atención. No es una plataforma de contenido. No hay podcasts, ni un año de Biblia, ni una tienda de meditaciones.',
    'about.h1': 'Cristo en el centro',
    'about.p2':
      'Nunca hay un contador sin su misterio a la vista. El Rosario es contemplación. Si la pantalla enseña solo el número de cuentas, está mal hecha.',
    'about.h2': 'Rezar, no escuchar',
    'about.p3':
      'El audio guía deja el espacio para tu voz. Nunca corre como un programa que se oye mientras miras otra cosa.',
    'about.h3': 'Se cuentan actos, nunca gracias',
    'about.p4':
      'Rosarios, decenas, días. Jamás puntos de gracia, niveles espirituales ni barras de protección. La Iglesia dejó de numerar las indulgencias en 1967 porque el número confundía. Las indulgencias se describen, con sus condiciones. La app no las otorga.',
    'about.h4': 'Constancia sin culpa',
    'about.p5':
      'La Regla la fijas tú. No obliga bajo pecado. Si se rompe, se retoma. No hay racha que se pierda con drama, ni avisos de que María te espera.',
    'about.h5': 'La atención se ayuda, no se califica',
    'about.p6':
      'Si algún día la app nota que saliste a mitad de un Ave, eso se queda en el teléfono, es opcional y no se convierte en un puntaje.',
    'about.h6': 'Cada texto con su fuente',
    'about.p7':
      'Magisterio, liturgia y tradición piadosa se distinguen. Las quince promesas se muestran con su origen, nunca como garantía.',
    'about.h7': 'Funciona sin nada',
    'about.p8':
      'Sin señal, sin cuenta, sin mirar la pantalla, y en el reloj sin el teléfono. Si algo necesita red, funciona sin ella o no existe.',
    'about.h8': 'Gratis',
    'about.p9':
      'Sin anuncios. Sin paywall en el Rosario. Sin funciones espirituales de pago. Quien quiera puede apoyar el desarrollo. Nadie compra un misterio.',
    'about.h9': 'Lo que no entra',
    'about.p10':
      'Tablas de posiciones, comparar minutos, chat, perfiles, meditaciones generadas y presentadas como texto espiritual, misterios inventados. Si no sirve para rezar mejor, no está.',
    'privacy.title': 'Privacidad',
    'privacy.lead': 'Lo que rezas no sale de tu dispositivo.',
    'privacy.p1':
      'SanctaMaria no pide cuenta. No hay servidor con tu diario. El registro de lo rezado se guarda en el teléfono, con la fecha local de ese día. El respaldo, si lo hay, es el del sistema: iCloud o el equivalente en Android.',
    'privacy.p2':
      'No hay analítica de comportamiento. Si algo se rompe, se puede enviar un reporte de error, sin el contenido de lo que rezabas.',
    'privacy.p3':
      'El micrófono, Salud y las notificaciones se piden en el momento en que se usan, y se dice para qué. El rezo a dos voces puede hacerse solo con el tacto, sin micrófono.',
    'privacy.p4':
      'El sitio no usa cookies de seguimiento. El idioma y el tema claro u oscuro se guardan en este navegador, nada más.',
    'support.title': 'Apoya el desarrollo',
    'support.lead': 'La app es gratis. El trabajo no lo es.',
    'support.p1':
      'SanctaMaria no cobra por rezar. No hay anuncios ni suscripción para oír el audio. Si te sirve, puedes dejar un donativo. No compra indulgencias ni adelanta misterios.',
    'support.p2':
      'En la app, donde las tiendas lo permiten, el botón se llama «Apoya el desarrollo». Aquí, en el sitio, el donativo va directo.',
    'support.cta': 'Hacer un donativo',
    'footer.legal':
      'Apple, el logotipo de Apple, App Store, Apple Watch e iPhone son marcas de Apple Inc., registradas en EE. UU. y otros países. Google Play y el logotipo de Google Play son marcas de Google LLC.',
    'footer.mark': 'SanctaMaria. Para rezar el Rosario.',
  },
  en: {
    'site.title': 'SanctaMaria',
    'site.description':
      'An app to pray the Holy Rosary. Words and audio together, in English, Spanish and Latin. On iPhone, Android, and Apple Watch. Free, no account, no ads.',
    'nav.app': 'The app',
    'nav.features': 'What it does',
    'nav.how': 'How to pray',
    'nav.mysteries': 'The mysteries',
    'nav.about': 'How it is made',
    'nav.support': 'Support',
    'nav.privacy': 'Privacy',
    'nav.menu': 'Menu',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.label': 'Appearance',
    skip: 'Skip to content',
    'hero.lead':
      'The app speaks the first half. You answer. The words move with the voice.',
    'hero.sub': 'On iPhone, Android, and Apple Watch. No account. No ads. Works offline.',
    'cta.appstore': 'Download on the App Store',
    'cta.play': 'Get it on Google Play',
    'mock.ave': 'Hail Mary 4 of 10',
    'mock.watchBead': '4',
    'promise.1.title': 'Read while it plays',
    'promise.1.body':
      'The line is highlighted with the voice. The guide leaves a space for your answer.',
    'promise.2.title': 'The watch prays on its own',
    'promise.2.body':
      'Its own audio, a distinct tap for each prayer, and the Digital Crown. Not a remote for the phone.',
    'promise.3.title': 'Every text has a source',
    'promise.3.body':
      'Magisterium, liturgy, or pious tradition. Named as such. Nothing is written from memory.',
    'band.audio.kicker': 'How you pray',
    'band.audio.title': 'Not a podcast.',
    'band.audio.body':
      'The guide says the first half of the Hail Mary. You say the second. In silence, a tap advances. With the screen off, audio and haptics keep going.',
    'band.watch.kicker': 'On the move',
    'band.watch.title': 'Leave the phone in your pocket.',
    'band.watch.body':
      "SanctaMaria for Apple Watch is a full Rosary: audio to your headphones, a different tap for the Our Father, the Hail Mary and the Glory Be, and today's mystery on the watch face.",
    'band.latin.kicker': 'Latin',
    'band.latin.title': 'Pray it, then learn it.',
    'band.latin.body':
      'Ecclesiastical Latin, lined up with your own language. First you listen. Then you answer while reading. Later the words fade.',
    'band.rule.kicker': 'Keeping it',
    'band.rule.title': 'A rule, not a streak.',
    'band.rule.body':
      'You set what you mean to keep. You can lower it. If a month breaks, the calendar just fills differently. No red screens.',
    'home.today': 'Today',
    'home.more': 'Everything it does',
    'home.more.body':
      'Regional forms, clauses, the litany, the Confraternity, praying with others. One page for the rest.',
    'home.more.cta': 'See what it does',
    'features.title': 'What it does',
    'features.lead':
      'The whole Rosary, on the phone and on the watch. Everything else is there to pray it better, or it can be turned off.',
    'how.title': 'How to pray it',
    'how.lead': 'Five decades. A mystery in each. The frame changes with the country.',
    'how.p1':
      'A Rosary is five decades of one set of mysteries: Joyful, Luminous, Sorrowful, or Glorious. The core does not change: the mystery is announced, then an Our Father, ten Hail Marys, and a Glory Be. John Paul II calls it contemplation of Christ with Mary. Without that attention, he writes, it is a body without a soul.',
    'how.p2':
      'The usual days: Monday and Saturday, Joyful; Thursday, Luminous; Tuesday and Friday, Sorrowful; Wednesday and Sunday, Glorious. In Advent and Christmas the Sunday is often Joyful; in Lent, Sorrowful.',
    'how.p3':
      'What opens and closes the prayer depends on where you are. The Roman form begins with the Creed and three Hail Marys for faith, hope, and charity. Mexico often starts with the Sign of the Cross and an act of contrition. Spain often uses "Lord, open my lips." The Fatima prayer, the Hail Holy Queen, the litany, and St. Michael are a frame. Each one can be on or off.',
    'how.p4':
      'In the app you pick the form of your region and the language of the prayer. They do not have to match the language of the interface. You can pray in Latin and keep the menus in English. The audio speaks the first half and waits. The text stays on the screen while it plays.',
    'how.source':
      'Shape and days: Rosarium Virginis Mariae 12, 19, 37-38; USCCB, How to Pray the Rosary; Directory on Popular Piety 197-202.',
    'mysteries.title': 'The twenty mysteries',
    'mysteries.lead':
      'Four sets. Each mystery with its passage, the fruit asked for, and the clause added to the name of Jesus.',
    'mysteries.fruit': 'Fruit',
    'mysteries.clause': 'Clause',
    'sets.gaudiosa': 'Joyful',
    'sets.luminosa': 'Luminous',
    'sets.dolorosa': 'Sorrowful',
    'sets.gloriosa': 'Glorious',
    'about.title': 'How it is made',
    'about.lead': 'An app for praying. Not for collecting minutes.',
    'about.p1':
      'SanctaMaria is for someone who means to pray the Rosary every day, and to pray it with more attention. It is not a content platform. There are no podcasts, no Bible-in-a-year, no store of meditations.',
    'about.h1': 'Christ at the center',
    'about.p2':
      'A counter never appears without its mystery. The Rosary is contemplation. If the screen shows only a bead count, it is built wrong.',
    'about.h2': 'Pray, do not listen',
    'about.p3':
      'The guide leaves room for your voice. It never runs like a program you half-hear while looking at something else.',
    'about.h3': 'Acts are counted, never graces',
    'about.p4':
      'Rosaries, decades, days. Never grace points, spiritual levels, or bars of protection. The Church stopped numbering indulgences in 1967 because the number confused people. Indulgences are described, with their conditions. The app does not grant them.',
    'about.h4': 'Constancy without blame',
    'about.p5':
      'You set the Rule. It does not bind under sin. If it breaks, you pick it up. There is no streak that dies in public, and no notice that Mary is waiting.',
    'about.h5': 'Attention is helped, not graded',
    'about.p6':
      'If the app ever notices you left in the middle of a Hail Mary, that stays on the phone, it is optional, and it never becomes a score.',
    'about.h6': 'Every text has a source',
    'about.p7':
      'Magisterium, liturgy, and pious tradition are kept apart. The fifteen promises are shown with their origin, never as a guarantee.',
    'about.h7': 'It works with nothing',
    'about.p8':
      'No signal, no account, no need to look at the screen, and on the watch no need for the phone. If something needs a network, it works without one or it is not there.',
    'about.h8': 'Free',
    'about.p9':
      'No ads. No paywall on the Rosary. No spiritual features for sale. Anyone who wants to can support the work. No one buys a mystery.',
    'about.h9': 'What is left out',
    'about.p10':
      'Leaderboards, comparing minutes, chat, profiles, generated meditations offered as spiritual text, invented mysteries. If it does not help you pray better, it is not here.',
    'privacy.title': 'Privacy',
    'privacy.lead': 'What you pray does not leave your device.',
    'privacy.p1':
      "SanctaMaria does not ask for an account. There is no server holding your journal. A record of what was prayed stays on the phone, under that day's local date. Any backup is the system's: iCloud, or the Android equivalent.",
    'privacy.p2':
      'There is no behavioural analytics. If something crashes, a crash report can be sent, without the words you were praying.',
    'privacy.p3':
      'The microphone, Health, and notifications are asked for at the moment they are used, and the app says why. Two-voice prayer can be done by touch alone, with no microphone.',
    'privacy.p4':
      'This site does not use tracking cookies. Language and light or dark appearance stay in this browser, and nowhere else.',
    'support.title': 'Support the work',
    'support.lead': 'The app is free. The work is not.',
    'support.p1':
      'SanctaMaria does not charge you to pray. There are no ads, and no subscription to hear the audio. If it serves you, you can leave a gift. It does not buy indulgences or unlock mysteries.',
    'support.p2':
      'In the app, where the stores allow it, the button is called "Support the work." Here on the site, a gift goes directly.',
    'support.cta': 'Give a gift',
    'footer.legal':
      'Apple, the Apple logo, App Store, Apple Watch, and iPhone are trademarks of Apple Inc., registered in the U.S. and other countries. Google Play and the Google Play logo are trademarks of Google LLC.',
    'footer.mark': 'SanctaMaria. For praying the Rosary.',
  },
} as const;

export function t(language: UiLanguage) {
  return (key: keyof (typeof ui)['es']): string => ui[language][key];
}
