import type { UiLanguage } from './ui';

export type FeatureItem = {
  title: string;
  body: string;
};

export type FeatureGroup = {
  title: string;
  lead: string;
  items: readonly FeatureItem[];
};

export const catalog: Record<UiLanguage, readonly FeatureGroup[]> = {
  es: [
    {
      title: 'Rezar bien',
      lead: 'El Rosario entero, en el teléfono, sin cuenta y sin red.',
      items: [
        {
          title: 'Motor del Rosario',
          body: 'La secuencia completa: lo que abre, cinco misterios, lo que cierra. Se puede dejar a medias y seguir.',
        },
        {
          title: 'Misterio del día',
          body: 'Según el día y el tiempo litúrgico. Si hoy quieres otro, lo eliges.',
        },
        {
          title: 'Textos por región',
          body: 'Español de México, español de España, inglés. Cada uno con su forma real, no una traducción.',
        },
        {
          title: 'Los veinte misterios',
          body: 'Título, cita, fruto, meditación breve e imagen. El fruto es tradición catequética: se dice.',
        },
        {
          title: 'Audio guía',
          body: 'La voz dice la primera mitad y espera. La velocidad se ajusta.',
        },
        {
          title: 'Resaltado',
          body: 'El texto avanza con el audio, línea a línea.',
        },
        {
          title: 'Avance por tacto',
          body: 'Un toque en cualquier parte, un desliz, o que corra solo.',
        },
        {
          title: 'Pantalla apagada',
          body: 'Audio y háptica a oscuras.',
        },
        {
          title: 'Offline',
          body: 'Textos y audio van en el aparato. Nada pide red para rezar.',
        },
        {
          title: 'Oraciones opcionales',
          body: 'Fátima, Salve, letanías, san Miguel, ofrecimiento, intención. Cada una es un ajuste.',
        },
      ],
    },
    {
      title: 'En movimiento',
      lead: 'Correr, caminar, manejar. El reloj basta.',
      items: [
        {
          title: 'Apple Watch',
          body: 'El Rosario completo en el reloj, con su propia pantalla.',
        },
        {
          title: 'Audio en el reloj',
          body: 'Suena en los auriculares sin el teléfono cerca.',
        },
        {
          title: 'Háptica por cuenta',
          body: 'Un toque distinto para el Ave, el Padrenuestro y el Gloria.',
        },
        {
          title: 'Corona',
          body: 'Las cuentas se pasan girando la Digital Crown.',
        },
        {
          title: 'Al correr',
          body: 'Una sesión de ejercicio mantiene el reloj despierto.',
        },
        {
          title: 'Complicación',
          body: 'El misterio del día en la esfera. Empezar en un toque.',
        },
        {
          title: 'Pantalla de bloqueo',
          body: 'Pausar y avanzar desde los auriculares, el bloqueo y el coche.',
        },
        {
          title: 'Widget',
          body: 'Misterio del día en la pantalla de inicio del iPhone.',
        },
      ],
    },
    {
      title: 'Latín',
      lead: 'Rezarlo de verdad, y aprenderlo si no se sabe.',
      items: [
        {
          title: 'Textos',
          body: 'Todas las oraciones, incluidas las letanías lauretanas.',
        },
        {
          title: 'Audio',
          body: 'Pronunciación eclesiástica, rezada, no recitada de prisa.',
        },
        {
          title: 'Bilingüe',
          body: 'Latín y tu idioma, alineados línea a línea.',
        },
        {
          title: 'Aprender',
          body: 'De escuchar, a responder leyendo, a responder de memoria. El texto se apaga.',
        },
        {
          title: 'Canto',
          body: 'Salve Regina y letanías cantadas.',
        },
        {
          title: 'Mezcla',
          body: 'Unas oraciones en latín y otras en tu lengua.',
        },
      ],
    },
    {
      title: 'Constancia',
      lead: 'Que la costumbre se sostenga, sin culpa.',
      items: [
        {
          title: 'La Regla',
          body: 'Una norma tuya, editable, que no obliga bajo pecado.',
        },
        {
          title: 'Calendario del mes',
          body: 'Días fieles. Los huecos no se dramatizan. Se pueden ver los meses anteriores.',
        },
        {
          title: 'Pausa',
          body: 'Enfermedad, viaje, luto. El mes no se llena de huecos ni pide explicación.',
        },
        {
          title: 'Recordatorio',
          body: 'Uno, a tu hora. O el modelo del Ángelus.',
        },
        {
          title: 'Intenciones',
          body: 'Por quién ofreces. Historial de intenciones, no de respuestas.',
        },
        {
          title: 'Rosas del mes',
          body: 'Una corona visual de lo rezado. Se puede apagar.',
        },
        {
          title: 'Por partes',
          body: 'Una decena ahora, el resto después. Con la nota sobre la indulgencia.',
        },
      ],
    },
    {
      title: 'El Camino',
      lead: 'Enseñar a rezarlo mejor, no premiar por rezar más.',
      items: [
        {
          title: 'Etapas',
          body: 'Estructura, meditar, cláusulas, responder, latín, cantar, familia, completo.',
        },
        {
          title: 'Lecturas breves',
          body: 'Qué es cada parte y por qué, con fuente.',
        },
        {
          title: 'Cláusulas',
          body: 'La frase del misterio tras el nombre de Jesús. Fijas y bíblicas.',
        },
        {
          title: 'La Palabra',
          body: 'El pasaje antes de cada decena, con un silencio que tú mides.',
        },
        {
          title: 'Escuela del Rosario',
          body: 'Historia, magisterio, las promesas y su estatus, las indulgencias y sus condiciones.',
        },
      ],
    },
    {
      title: 'Recogimiento',
      lead: 'Ayudar a la atención. Es lo que cuesta.',
      items: [
        {
          title: 'Ritmo',
          body: 'Tiempo por Ave, pausas dentro de la oración, silencio entre decenas.',
        },
        {
          title: 'Imagen del misterio',
          body: 'Arte sacro a pantalla completa mientras rezas. Cada obra con su ficha.',
        },
        {
          title: 'Señales',
          body: 'Interrupciones y salidas de la app: privadas, opcionales, sin puntaje.',
        },
        {
          title: 'Corazón',
          body: 'Desde el reloj, con permiso. Se escribe como una sesión de atención. No es un examen.',
        },
        {
          title: 'Antes de empezar',
          body: 'Tres respiraciones, la señal de la cruz, la intención.',
        },
      ],
    },
    {
      title: 'En familia',
      lead: 'En voz alta, con niños, en la misma casa.',
      items: [
        {
          title: 'A dos coros',
          body: 'La app hace de guía o de respuesta.',
        },
        {
          title: 'Niños',
          body: 'Menos texto, imágenes grandes, una decena suelta.',
        },
        {
          title: 'Varios a la vez',
          body: 'Un aparato o varios, en la misma casa.',
        },
        {
          title: 'Por la familia',
          body: 'Intenciones que se comparten en casa, sin perfiles.',
        },
      ],
    },
    {
      title: 'Idiomas',
      lead: 'Cada lengua trae su forma real de rezar.',
      items: [
        {
          title: 'Ahora',
          body: 'Español de México, español de España, inglés de Estados Unidos, latín.',
        },
        {
          title: 'Después',
          body: 'Italiano, portugués, francés, polaco, alemán. El alemán mete el misterio dentro del Ave. El polaco reza siempre Fátima.',
        },
      ],
    },
    {
      title: 'Devociones hermanas',
      lead: 'Cada una con su nombre y su contador. Nunca mezcladas con el Rosario.',
      items: [
        {
          title: 'Letanías',
          body: 'Lauretanas completas, también cantadas.',
        },
        {
          title: 'Novena de 54 días',
          body: 'Tres Rosarios diarios, veintisiete de petición y veintisiete de acción de gracias.',
        },
        {
          title: 'Coronilla',
          body: 'La de la Divina Misericordia, aparte.',
        },
        {
          title: 'Siete Dolores',
          body: 'La corona de los dolores de María, aparte.',
        },
        {
          title: 'Rosario perpetuo',
          body: 'Una hora en la cadena, sin ranking.',
        },
        {
          title: 'Cofradía',
          body: 'Enlace a la inscripción de los dominicos. Quince decenas a la semana. No obliga bajo pecado. La app no dice que ya eres cofrade.',
        },
      ],
    },
    {
      title: 'A la vez',
      lead: 'Saber que otros rezan ahora. Nada más.',
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
          body: 'Sin chat, sin perfiles, sin comparación.',
        },
      ],
    },
  ],
  en: [
    {
      title: 'Pray it well',
      lead: 'The whole Rosary on the phone. No account. No network.',
      items: [
        {
          title: 'The sequence',
          body: 'What opens, five mysteries, what closes. You can stop halfway and come back.',
        },
        {
          title: 'Mystery of the day',
          body: 'By weekday and liturgical season. Another set if you want it.',
        },
        {
          title: 'By region',
          body: 'Mexican Spanish, Spanish of Spain, English. Real forms, not a translation.',
        },
        {
          title: 'The twenty mysteries',
          body: 'Title, verse, fruit, a short meditation, an image. The fruit is catechetical tradition, and it says so.',
        },
        {
          title: 'Guided audio',
          body: 'The voice speaks the first half and waits. Speed is yours.',
        },
        {
          title: 'Highlight',
          body: 'The line moves with the voice.',
        },
        {
          title: 'Advance by touch',
          body: 'A tap anywhere, a swipe, or let it run.',
        },
        {
          title: 'Screen off',
          body: 'Audio and haptics in the dark.',
        },
        {
          title: 'Offline',
          body: 'Text and audio live on the device. Nothing needs a network in order to pray.',
        },
        {
          title: 'Optional prayers',
          body: 'Fatima, Hail Holy Queen, litany, St. Michael, offering, intention. Each one is a setting.',
        },
      ],
    },
    {
      title: 'On the move',
      lead: 'Running, walking, driving. The watch is enough.',
      items: [
        {
          title: 'Apple Watch',
          body: 'A full Rosary on the watch, with its own screen.',
        },
        {
          title: 'Watch audio',
          body: 'It plays to your headphones with the phone elsewhere.',
        },
        {
          title: 'A tap per bead',
          body: 'A different haptic for the Hail Mary, the Our Father, and the Glory Be.',
        },
        {
          title: 'Digital Crown',
          body: 'Advance the beads by turning it.',
        },
        {
          title: 'While you run',
          body: 'A workout session keeps the watch awake.',
        },
        {
          title: 'Complication',
          body: "Today's mystery on the watch face. Start with one tap.",
        },
        {
          title: 'Lock screen',
          body: 'Pause and skip from headphones, the lock screen, and the car.',
        },
        {
          title: 'Widget',
          body: "Today's mystery on the iPhone Home Screen.",
        },
      ],
    },
    {
      title: 'Latin',
      lead: 'Pray it in truth, and learn it if you do not know it.',
      items: [
        {
          title: 'The texts',
          body: 'Every prayer, including the Litany of Loreto.',
        },
        {
          title: 'The audio',
          body: 'Ecclesiastical Latin, prayed, not rushed.',
        },
        {
          title: 'Side by side',
          body: 'Latin and your language, line by line.',
        },
        {
          title: 'Learning',
          body: 'Listen, then answer while reading, then answer from memory. The words fade.',
        },
        {
          title: 'Chant',
          body: 'Salve Regina and the litany sung.',
        },
        {
          title: 'A mix',
          body: 'Some prayers in Latin, some in your own tongue.',
        },
      ],
    },
    {
      title: 'Keeping it',
      lead: 'A habit that holds, without blame.',
      items: [
        {
          title: 'The Rule',
          body: 'Your own norm. You can edit it. It does not bind under sin.',
        },
        {
          title: 'The month',
          body: 'Faithful days. Gaps are not a drama. Past months stay visible.',
        },
        {
          title: 'A pause',
          body: 'Illness, travel, mourning. The month does not fill with holes, and it does not ask why.',
        },
        {
          title: 'A reminder',
          body: 'One, at your hour. Or the Angelus hours.',
        },
        {
          title: 'Intentions',
          body: 'For whom you offer it. A history of intentions, not of answers.',
        },
        {
          title: 'Roses of the month',
          body: 'A visual crown of what was prayed. It can be turned off.',
        },
        {
          title: 'In parts',
          body: 'One decade now, the rest later. With the note on the indulgence.',
        },
      ],
    },
    {
      title: 'The Way',
      lead: 'Learn to pray it better. Not a prize for praying more.',
      items: [
        {
          title: 'Stages',
          body: 'The shape, meditation, clauses, answering, Latin, chant, family, the whole.',
        },
        {
          title: 'Short readings',
          body: 'What each part is, and why, with a source.',
        },
        {
          title: 'Clauses',
          body: 'The phrase of the mystery after the name of Jesus. Fixed, and biblical.',
        },
        {
          title: 'The Word',
          body: 'The passage before each decade, and a silence you set.',
        },
        {
          title: 'A school of the Rosary',
          body: 'History, the magisterium, the promises and their standing, indulgences and their conditions.',
        },
      ],
    },
    {
      title: 'Recollection',
      lead: 'Help for attention. That is the hard part.',
      items: [
        {
          title: 'Pace',
          body: 'Time for each Hail Mary, pauses inside the prayer, silence between decades.',
        },
        {
          title: 'The image',
          body: 'Sacred art full screen while you pray. Each work named.',
        },
        {
          title: 'Signals',
          body: 'Interruptions and leaving the app: private, optional, never a score.',
        },
        {
          title: 'The heart',
          body: 'From the watch, with permission. Written as a session of attention. Not an exam.',
        },
        {
          title: 'Before you start',
          body: 'Three breaths, the Sign of the Cross, the intention.',
        },
      ],
    },
    {
      title: 'With others',
      lead: 'Aloud, with children, in one house.',
      items: [
        {
          title: 'Two choirs',
          body: 'The app takes the lead or the response.',
        },
        {
          title: 'Children',
          body: 'Less text, larger images, a single decade.',
        },
        {
          title: 'More than one',
          body: 'One device or several, in the same house.',
        },
        {
          title: 'For the family',
          body: 'Intentions shared at home, with no profiles.',
        },
      ],
    },
    {
      title: 'Languages',
      lead: 'Each language brings its real form.',
      items: [
        {
          title: 'Now',
          body: 'Mexican Spanish, Spanish of Spain, American English, Latin.',
        },
        {
          title: 'Later',
          body: 'Italian, Portuguese, French, Polish, German. German places the mystery inside the Hail Mary. Polish always says the Fatima prayer.',
        },
      ],
    },
    {
      title: 'Kindred devotions',
      lead: 'Each one named, each one counted apart. Never mixed into the Rosary.',
      items: [
        {
          title: 'Litany',
          body: 'The Litany of Loreto in full, also sung.',
        },
        {
          title: 'The 54-day novena',
          body: 'Three Rosaries a day, twenty-seven of petition and twenty-seven of thanksgiving.',
        },
        {
          title: 'Chaplet',
          body: 'The Divine Mercy chaplet, on its own.',
        },
        {
          title: 'Seven Sorrows',
          body: 'The crown of the Sorrows of Mary, on its own.',
        },
        {
          title: 'Perpetual Rosary',
          body: 'An hour in the chain, with no ranking.',
        },
        {
          title: 'Confraternity',
          body: "A link to the Dominicans' enrolment. Fifteen decades a week. It does not bind under sin. The app never says you are already a member.",
        },
      ],
    },
    {
      title: 'At the same time',
      lead: 'To know that others are praying now. Nothing else.',
      items: [
        {
          title: 'How many now',
          body: 'A number. No names.',
        },
        {
          title: 'The same hour',
          body: 'Pray when others are praying too.',
        },
        {
          title: 'No social layer',
          body: 'No chat, no profiles, no comparison.',
        },
      ],
    },
  ],
};
