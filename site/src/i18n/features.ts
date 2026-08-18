import type { UiLanguage } from './ui';

export type FeatureItem = {
  title: string;
  body: string;
};

export type FeatureGroup = {
  id: string;
  title: string;
  lead: string;
  items: readonly FeatureItem[];
};

export const catalog: Record<UiLanguage, readonly FeatureGroup[]> = {
  es: [
    {
      id: 'rezar',
      title: 'Rezar',
      lead: 'El Rosario entero en el teléfono, sin cuenta y sin red.',
      items: [
        {
          title: 'La secuencia completa',
          body: 'Lo que abre, cinco misterios, lo que cierra. Se puede dejar a medias y seguir después donde ibas.',
        },
        {
          title: 'El misterio del día',
          body: 'Según el día de la semana y el tiempo litúrgico. Si hoy quieres otro ciclo, lo eliges.',
        },
        {
          title: 'La forma de tu región',
          body: 'Español de México, español de España, inglés de Estados Unidos. Cada una con las oraciones que abren y cierran ahí.',
        },
        {
          title: 'Los veinte misterios',
          body: 'Título, cita bíblica, fruto, una nota breve y una imagen. El fruto es tradición catequética, y la app lo dice.',
        },
        {
          title: 'Audio guía',
          body: 'La voz dice la primera mitad y espera tu respuesta. La velocidad se ajusta.',
        },
        {
          title: 'Texto resaltado',
          body: 'El texto avanza con el audio, línea a línea, y se queda en la pantalla.',
        },
        {
          title: 'Avance por tacto',
          body: 'Un toque en cualquier parte de la pantalla, un desliz, o que corra solo con el audio.',
        },
        {
          title: 'Pantalla apagada',
          body: 'El audio y la háptica siguen a oscuras y con el teléfono en el bolsillo.',
        },
        {
          title: 'Sin conexión',
          body: 'Textos y audio viven en el aparato. Rezar nunca pide red.',
        },
        {
          title: 'Oraciones opcionales',
          body: 'La oración de Fátima, la Salve, las letanías, san Miguel, el ofrecimiento, la intención. Cada una se enciende o se apaga.',
        },
      ],
    },
    {
      id: 'reloj',
      title: 'En el reloj',
      lead: 'Correr, caminar, manejar. El Apple Watch basta.',
      items: [
        {
          title: 'El Rosario completo',
          body: 'La app del reloj reza el Rosario entero, con su propia pantalla, sin el teléfono cerca.',
        },
        {
          title: 'Audio en el reloj',
          body: 'La voz suena en los auriculares conectados al reloj.',
        },
        {
          title: 'Háptica por cuenta',
          body: 'Un toque distinto en la muñeca para el Ave, el Padrenuestro y el Gloria. Se sabe dónde vas sin mirar.',
        },
        {
          title: 'La corona',
          body: 'Las cuentas se pasan girando la Digital Crown, con un detente en cada una.',
        },
        {
          title: 'Al hacer ejercicio',
          body: 'Una sesión de ejercicio mantiene el reloj despierto mientras rezas.',
        },
        {
          title: 'Complicación',
          body: 'El misterio del día en la esfera. Empezar es un toque.',
        },
        {
          title: 'Controles del sistema',
          body: 'Pausar y avanzar desde los auriculares, la pantalla de bloqueo y el coche.',
        },
        {
          title: 'Widget',
          body: 'El misterio del día en la pantalla de inicio del iPhone.',
        },
      ],
    },
    {
      id: 'latin',
      title: 'Latín',
      lead: 'Rezarlo, y aprenderlo si todavía no se sabe.',
      items: [
        {
          title: 'Todos los textos',
          body: 'Todas las oraciones del Rosario en latín, incluidas las letanías lauretanas.',
        },
        {
          title: 'Audio',
          body: 'Pronunciación eclesiástica, rezada con calma.',
        },
        {
          title: 'Bilingüe',
          body: 'Latín y tu idioma alineados línea a línea, para seguirlo sin perderse.',
        },
        {
          title: 'Aprender',
          body: 'Primero escuchas. Después respondes leyendo. Después respondes de memoria, y el texto se apaga.',
        },
        {
          title: 'Canto',
          body: 'La Salve Regina y las letanías, también cantadas.',
        },
        {
          title: 'Mezcla',
          body: 'Unas oraciones en latín y otras en tu lengua, como prefieras.',
        },
      ],
    },
    {
      id: 'constancia',
      title: 'Constancia',
      lead: 'Que la costumbre se sostenga, sin culpa.',
      items: [
        {
          title: 'La Regla',
          body: 'Una norma tuya: una decena, cinco, el Rosario completo o quince decenas a la semana. Se edita cuando quieras y no obliga bajo pecado.',
        },
        {
          title: 'El calendario del mes',
          body: 'Los días fieles a tu Regla, y los meses anteriores. Los huecos quedan en blanco.',
        },
        {
          title: 'Pausa',
          body: 'Enfermedad, viaje, luto. El mes se pausa sin pedir explicaciones.',
        },
        {
          title: 'Recordatorio',
          body: 'Uno al día, a la hora que elijas. O a las horas del Ángelus.',
        },
        {
          title: 'Intenciones',
          body: 'Por quién ofreces cada Rosario, y el historial de intenciones.',
        },
        {
          title: 'Rosas del mes',
          body: 'Una corona visual de lo rezado en el mes. Se puede apagar.',
        },
        {
          title: 'Por partes',
          body: 'Una decena ahora y el resto después, con la nota sobre lo que la indulgencia pide.',
        },
      ],
    },
    {
      id: 'camino',
      title: 'El Camino',
      lead: 'Una formación por etapas para rezarlo mejor.',
      items: [
        {
          title: 'Etapas',
          body: 'La estructura, meditar, las cláusulas, responder, el latín, cantar, en familia, el Rosario completo.',
        },
        {
          title: 'Lecturas breves',
          body: 'Qué es cada parte y por qué se reza así, con su fuente.',
        },
        {
          title: 'Cláusulas',
          body: 'La frase del misterio que se añade tras el nombre de Jesús en cada Ave. Fijas y bíblicas.',
        },
        {
          title: 'La Palabra',
          body: 'El pasaje del misterio antes de cada decena, y un silencio que tú mides.',
        },
        {
          title: 'Escuela del Rosario',
          body: 'Historia, magisterio, las quince promesas y su estatus, las indulgencias y sus condiciones.',
        },
      ],
    },
    {
      id: 'recogimiento',
      title: 'Recogimiento',
      lead: 'Ayudas para la atención, que es lo que cuesta.',
      items: [
        {
          title: 'Ritmo',
          body: 'El tiempo de cada Ave, las pausas dentro de la oración y el silencio entre decenas.',
        },
        {
          title: 'Imagen del misterio',
          body: 'Arte sacro a pantalla completa mientras rezas. Cada obra con su ficha.',
        },
        {
          title: 'Señales',
          body: 'La app puede anotar interrupciones y salidas. Es privado, opcional y sin puntaje.',
        },
        {
          title: 'Corazón',
          body: 'Desde el reloj, con permiso, la sesión se guarda en Salud como una sesión de atención.',
        },
        {
          title: 'Antes de empezar',
          body: 'Tres respiraciones, la señal de la cruz, la intención.',
        },
      ],
    },
    {
      id: 'familia',
      title: 'En familia',
      lead: 'En voz alta, con niños, en la misma casa.',
      items: [
        {
          title: 'A dos coros',
          body: 'La app hace de guía o de respuesta, según quién lleve la voz en casa.',
        },
        {
          title: 'Niños',
          body: 'Menos texto, imágenes grandes, una decena suelta.',
        },
        {
          title: 'Varios aparatos',
          body: 'Rezar a la vez en la misma casa con uno o varios teléfonos.',
        },
        {
          title: 'Intenciones de la casa',
          body: 'Intenciones que se comparten en familia, sin perfiles.',
        },
      ],
    },
    {
      id: 'idiomas',
      title: 'Idiomas',
      lead: 'Cada lengua trae su forma real de rezar.',
      items: [
        {
          title: 'Ahora',
          body: 'Español de México, español de España, inglés de Estados Unidos y latín.',
        },
        {
          title: 'Después',
          body: 'Italiano, portugués, francés, polaco y alemán, cada uno con su forma: el alemán mete el misterio dentro del Ave y el polaco reza siempre la oración de Fátima.',
        },
      ],
    },
    {
      id: 'devociones',
      title: 'Devociones hermanas',
      lead: 'Cada una con su nombre y su contador, aparte del Rosario.',
      items: [
        {
          title: 'Letanías',
          body: 'Las letanías lauretanas completas, rezadas o cantadas.',
        },
        {
          title: 'Novena de 54 días',
          body: 'Tres Rosarios diarios: veintisiete días de petición y veintisiete de acción de gracias.',
        },
        {
          title: 'Coronilla de la Divina Misericordia',
          body: 'Con sus propias cuentas y su propio audio.',
        },
        {
          title: 'Siete Dolores',
          body: 'La corona de los dolores de María, con sus siete meditaciones.',
        },
        {
          title: 'Rosario perpetuo',
          body: 'Tu hora en la cadena, con recordatorio.',
        },
        {
          title: 'Cofradía del Rosario',
          body: 'Enlace a la inscripción con los dominicos y una Regla de quince decenas a la semana, que no obliga bajo pecado.',
        },
      ],
    },
    {
      id: 'a-la-vez',
      title: 'A la vez',
      lead: 'Saber que otros rezan ahora, y nada más.',
      items: [
        {
          title: 'Cuántos ahora',
          body: 'Un número, sin nombres.',
        },
        {
          title: 'La misma hora',
          body: 'Rezar cuando otros también lo hacen.',
        },
        {
          title: 'Sin red social',
          body: 'Sin chat, sin perfiles, sin comparación entre personas.',
        },
      ],
    },
  ],
  en: [
    {
      id: 'pray',
      title: 'Praying',
      lead: 'The whole Rosary on the phone, with no account and no network.',
      items: [
        {
          title: 'The full sequence',
          body: 'What opens, five mysteries, what closes. Stop halfway and pick it up later where you were.',
        },
        {
          title: 'The mystery of the day',
          body: 'By weekday and liturgical season. If you want another set today, you choose it.',
        },
        {
          title: 'The form of your region',
          body: 'Mexican Spanish, Spanish of Spain, American English. Each with the prayers that open and close it there.',
        },
        {
          title: 'The twenty mysteries',
          body: 'Title, scripture reference, fruit, a short note and an image. The fruit is catechetical tradition, and the app says so.',
        },
        {
          title: 'Guided audio',
          body: 'The voice says the first half and waits for your answer. Speed is adjustable.',
        },
        {
          title: 'Highlighted text',
          body: 'The words move with the audio, line by line, and stay on the screen.',
        },
        {
          title: 'Advance by touch',
          body: 'A tap anywhere on the screen, a swipe, or let it run with the audio.',
        },
        {
          title: 'Screen off',
          body: 'Audio and haptics keep going in the dark and with the phone in your pocket.',
        },
        {
          title: 'Offline',
          body: 'Words and audio live on the device. Praying never asks for a network.',
        },
        {
          title: 'Optional prayers',
          body: 'The Fatima prayer, the Hail Holy Queen, the litany, St. Michael, the offering, the intention. Each one turns on or off.',
        },
      ],
    },
    {
      id: 'watch',
      title: 'On the watch',
      lead: 'Running, walking, driving. The Apple Watch is enough.',
      items: [
        {
          title: 'The whole Rosary',
          body: 'The watch app prays the full Rosary, with its own screen, without the phone nearby.',
        },
        {
          title: 'Audio on the watch',
          body: 'The voice plays through headphones connected to the watch.',
        },
        {
          title: 'Haptics per bead',
          body: 'A different tap on the wrist for the Hail Mary, the Our Father and the Glory Be. You know where you are without looking.',
        },
        {
          title: 'The crown',
          body: 'Beads move by turning the Digital Crown, with a detent on each one.',
        },
        {
          title: 'While exercising',
          body: 'A workout session keeps the watch awake while you pray.',
        },
        {
          title: 'Complication',
          body: 'The mystery of the day on the watch face. Starting is one tap.',
        },
        {
          title: 'System controls',
          body: 'Pause and advance from headphones, the lock screen and the car.',
        },
        {
          title: 'Widget',
          body: 'The mystery of the day on the iPhone home screen.',
        },
      ],
    },
    {
      id: 'latin',
      title: 'Latin',
      lead: 'Pray it, and learn it if you do not know it yet.',
      items: [
        {
          title: 'All the texts',
          body: 'Every prayer of the Rosary in Latin, including the Litany of Loreto.',
        },
        {
          title: 'Audio',
          body: 'Ecclesiastical pronunciation, prayed at a calm pace.',
        },
        {
          title: 'Bilingual',
          body: 'Latin and your language lined up line by line, so you can follow without getting lost.',
        },
        {
          title: 'Learning',
          body: 'First you listen. Then you answer while reading. Then you answer from memory, and the words fade.',
        },
        {
          title: 'Chant',
          body: 'The Salve Regina and the litany, sung as well.',
        },
        {
          title: 'A mix',
          body: 'Some prayers in Latin and some in your own tongue, as you prefer.',
        },
      ],
    },
    {
      id: 'keeping',
      title: 'Keeping it',
      lead: 'A habit that holds, without blame.',
      items: [
        {
          title: 'The Rule',
          body: 'Your own norm: one decade, five, the full Rosary, or fifteen decades a week. Edit it whenever you like; it does not bind under sin.',
        },
        {
          title: 'The month',
          body: 'The days you kept your Rule, and the months before. Gaps stay blank.',
        },
        {
          title: 'A pause',
          body: 'Illness, travel, mourning. The month pauses without asking why.',
        },
        {
          title: 'A reminder',
          body: 'One a day, at the hour you choose. Or at the hours of the Angelus.',
        },
        {
          title: 'Intentions',
          body: 'For whom you offer each Rosary, and the history of intentions.',
        },
        {
          title: 'Roses of the month',
          body: 'A visual crown of what was prayed this month. It can be turned off.',
        },
        {
          title: 'In parts',
          body: 'One decade now and the rest later, with a note on what the indulgence asks for.',
        },
      ],
    },
    {
      id: 'way',
      title: 'The Way',
      lead: 'Formation in stages, to pray it better.',
      items: [
        {
          title: 'Stages',
          body: 'The shape, meditating, the clauses, answering, Latin, chant, family, the whole Rosary.',
        },
        {
          title: 'Short readings',
          body: 'What each part is and why it is prayed that way, with its source.',
        },
        {
          title: 'Clauses',
          body: 'The phrase of the mystery added after the name of Jesus in each Hail Mary. Fixed, and biblical.',
        },
        {
          title: 'The Word',
          body: 'The passage of the mystery before each decade, and a silence you set.',
        },
        {
          title: 'School of the Rosary',
          body: 'History, magisterium, the fifteen promises and their status, the indulgences and their conditions.',
        },
      ],
    },
    {
      id: 'recollection',
      title: 'Recollection',
      lead: 'Help for attention, which is the hard part.',
      items: [
        {
          title: 'Pace',
          body: 'The time of each Hail Mary, the pauses inside the prayer and the silence between decades.',
        },
        {
          title: 'Image of the mystery',
          body: 'Sacred art, full screen, while you pray. Every work with its credit.',
        },
        {
          title: 'Signals',
          body: 'The app can note interruptions and exits. Private, optional, and never a score.',
        },
        {
          title: 'Heart',
          body: 'From the watch, with permission, the session is saved to Health as a mindfulness session.',
        },
        {
          title: 'Before you begin',
          body: 'Three breaths, the Sign of the Cross, the intention.',
        },
      ],
    },
    {
      id: 'family',
      title: 'As a family',
      lead: 'Out loud, with children, in the same house.',
      items: [
        {
          title: 'Two choirs',
          body: 'The app leads or answers, depending on who carries the voice at home.',
        },
        {
          title: 'Children',
          body: 'Less text, large images, a single decade.',
        },
        {
          title: 'Several devices',
          body: 'Pray together in the same house with one phone or several.',
        },
        {
          title: 'Household intentions',
          body: 'Intentions shared within the family, without profiles.',
        },
      ],
    },
    {
      id: 'languages',
      title: 'Languages',
      lead: 'Each language brings its real way of praying.',
      items: [
        {
          title: 'Now',
          body: 'Mexican Spanish, Spanish of Spain, American English and Latin.',
        },
        {
          title: 'Later',
          body: 'Italian, Portuguese, French, Polish and German, each with its own form: German places the mystery inside the Hail Mary, and Polish always prays the Fatima prayer.',
        },
      ],
    },
    {
      id: 'devotions',
      title: 'Sister devotions',
      lead: 'Each with its own name and its own count, apart from the Rosary.',
      items: [
        {
          title: 'Litany',
          body: 'The full Litany of Loreto, prayed or sung.',
        },
        {
          title: '54-day novena',
          body: 'Three Rosaries a day: twenty-seven days of petition and twenty-seven of thanksgiving.',
        },
        {
          title: 'Divine Mercy Chaplet',
          body: 'With its own beads and its own audio.',
        },
        {
          title: 'Seven Sorrows',
          body: 'The chaplet of the sorrows of Mary, with its seven meditations.',
        },
        {
          title: 'Perpetual Rosary',
          body: 'Your hour in the chain, with a reminder.',
        },
        {
          title: 'Rosary Confraternity',
          body: 'A link to enrol with the Dominicans and a Rule of fifteen decades a week, which does not bind under sin.',
        },
      ],
    },
    {
      id: 'together',
      title: 'At the same time',
      lead: 'Knowing that others are praying now, and nothing more.',
      items: [
        {
          title: 'How many now',
          body: 'A number, without names.',
        },
        {
          title: 'The same hour',
          body: 'Pray when others are praying too.',
        },
        {
          title: 'No social network',
          body: 'No chat, no profiles, no comparison between people.',
        },
      ],
    },
  ],
};
