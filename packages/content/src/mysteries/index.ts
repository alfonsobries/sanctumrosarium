import type { Mystery } from '../types';

/**
 * The source of the mysteries themselves: the four sets and their sense come from RVM 19-23.
 *
 * It does NOT cover the `intro` lines, which are the editor's, nor the clauses, which follow the
 * pattern of the official German ones without being a quotation of any of them.
 */
const rvm = {
  name: 'Rosarium Virginis Mariae 19-23 (Juan Pablo II, 2002)',
  url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
} as const;

/**
 * The twenty mysteries.
 *
 * Fruits are catechetical tradition, not defined doctrine, and they vary by country: these are the
 * ones the USCCB publishes. Clauses follow the pattern the German form makes mandatory and DPPL 201
 * recommends everywhere. Scripture text is not stored yet: its licence is decision 10.
 */
export const mysteries: readonly Mystery[] = [
  {
    id: 'gaudiosa-1',
    set: 'gaudiosa',
    order: 1,
    scriptureRef: 'Lc 1,26-38',
    text: {
      es: {
        title: 'La Encarnación del Hijo de Dios',
        fruit: 'Humildad',
        intro:
          'Toda la historia converge en el fiat de María: "Hágase en mí según tu palabra".',
        clause: 'a quien concebiste por obra del Espíritu Santo',
      },
      en: {
        title: 'The Annunciation',
        fruit: 'Humility',
        clause: 'whom you conceived by the Holy Spirit',
      },
      la: {
        title: 'Annuntiatio',
        fruit: 'Humilitas',
        clause: 'quem de Spiritu Sancto concepisti',
      },
    },
    source: rvm,
  },
  {
    id: 'gaudiosa-2',
    set: 'gaudiosa',
    order: 2,
    scriptureRef: 'Lc 1,39-56',
    text: {
      es: {
        title: 'La Visitación de María a su prima Isabel',
        fruit: 'Amor al prójimo',
        intro:
          'María lleva a Jesús y se pone a servir. El Magnificat nace de ese camino.',
        clause: 'a quien llevaste a Isabel',
      },
      en: {
        title: 'The Visitation',
        fruit: 'Love of neighbour',
        clause: 'whom you carried to Elizabeth',
      },
      la: { title: 'Visitatio', fruit: 'Caritas', clause: 'quem ad Elisabeth portasti' },
    },
    source: rvm,
  },
  {
    id: 'gaudiosa-3',
    set: 'gaudiosa',
    order: 3,
    scriptureRef: 'Lc 2,1-20',
    text: {
      es: {
        title: 'El Nacimiento del Hijo de Dios en Belén',
        fruit: 'Pobreza de espíritu',
        intro: 'Dios se hace niño y no hay sitio para él en la posada.',
        clause: 'a quien diste a luz en Belén',
      },
      en: {
        title: 'The Nativity',
        fruit: 'Poverty of spirit',
        clause: 'whom you brought forth in Bethlehem',
      },
      la: {
        title: 'Nativitas',
        fruit: 'Paupertas',
        clause: 'quem in Bethlehem genuisti',
      },
    },
    source: rvm,
  },
  {
    id: 'gaudiosa-4',
    set: 'gaudiosa',
    order: 4,
    scriptureRef: 'Lc 2,22-38',
    text: {
      es: {
        title: 'La Presentación de Jesús en el templo',
        fruit: 'Pureza de corazón',
        intro: 'Simeón lo llama luz de las naciones y anuncia a María la espada.',
        clause: 'a quien presentaste en el templo',
      },
      en: {
        title: 'The Presentation',
        fruit: 'Purity of heart',
        clause: 'whom you presented in the temple',
      },
      la: {
        title: 'Praesentatio',
        fruit: 'Puritas',
        clause: 'quem in templo praesentasti',
      },
    },
    source: rvm,
  },
  {
    id: 'gaudiosa-5',
    set: 'gaudiosa',
    order: 5,
    scriptureRef: 'Lc 2,41-52',
    text: {
      es: {
        title: 'El Niño Jesús perdido y hallado en el templo',
        fruit: 'Buscar a Jesús',
        intro: '"¿No sabíais que debo ocuparme de las cosas de mi Padre?"',
        clause: 'a quien hallaste en el templo',
      },
      en: {
        title: 'The Finding in the Temple',
        fruit: 'Seeking Jesus',
        clause: 'whom you found in the temple',
      },
      la: {
        title: 'Inventio in templo',
        fruit: 'Devotio',
        clause: 'quem in templo invenisti',
      },
    },
    source: rvm,
  },
  {
    id: 'luminosa-1',
    set: 'luminosa',
    order: 1,
    scriptureRef: 'Mt 3,13-17',
    text: {
      es: {
        title: 'El Bautismo de Jesús en el Jordán',
        fruit: 'Apertura al Espíritu Santo',
        intro: '"Este es mi Hijo amado, en quien me complazco".',
        clause: 'que fue bautizado en el Jordán',
      },
      en: {
        title: 'The Baptism in the Jordan',
        fruit: 'Openness to the Holy Spirit',
        clause: 'who was baptized in the Jordan',
      },
      la: {
        title: 'Baptismus in Iordane',
        fruit: 'Docilitas',
        clause: 'qui in Iordane baptizatus est',
      },
    },
    source: rvm,
  },
  {
    id: 'luminosa-2',
    set: 'luminosa',
    order: 2,
    scriptureRef: 'Jn 2,1-12',
    text: {
      es: {
        title: 'La autorrevelación de Jesús en las bodas de Caná',
        fruit: 'A Jesús por María',
        intro: '"Haced lo que él os diga": la última palabra de María en el Evangelio.',
        clause: 'que se manifestó en Caná',
      },
      en: {
        title: 'The Wedding at Cana',
        fruit: 'To Jesus through Mary',
        clause: 'who revealed himself at Cana',
      },
      la: {
        title: 'Nuptiae in Cana',
        fruit: 'Fiducia',
        clause: 'qui se in Cana manifestavit',
      },
    },
    source: rvm,
  },
  {
    id: 'luminosa-3',
    set: 'luminosa',
    order: 3,
    scriptureRef: 'Mc 1,14-15',
    text: {
      es: {
        title: 'El anuncio del Reino de Dios invitando a la conversión',
        fruit: 'Conversión',
        intro: '"Convertíos y creed en el Evangelio".',
        clause: 'que anunció el Reino de Dios',
      },
      en: {
        title: 'The Proclamation of the Kingdom',
        fruit: 'Conversion',
        clause: 'who proclaimed the Kingdom of God',
      },
      la: {
        title: 'Regni Dei proclamatio',
        fruit: 'Conversio',
        clause: 'qui Regnum Dei annuntiavit',
      },
    },
    source: rvm,
  },
  {
    id: 'luminosa-4',
    set: 'luminosa',
    order: 4,
    scriptureRef: 'Mt 17,1-9',
    text: {
      es: {
        title: 'La Transfiguración del Señor',
        fruit: 'Deseo de santidad',
        intro: '"Bueno es estarnos aquí": la gloria se asoma antes de la cruz.',
        clause: 'que se transfiguró en el monte',
      },
      en: {
        title: 'The Transfiguration',
        fruit: 'Desire for holiness',
        clause: 'who was transfigured on the mountain',
      },
      la: {
        title: 'Transfiguratio',
        fruit: 'Sanctitatis desiderium',
        clause: 'qui in monte transfiguratus est',
      },
    },
    source: rvm,
  },
  {
    id: 'luminosa-5',
    set: 'luminosa',
    order: 5,
    scriptureRef: 'Mt 26,26-29',
    text: {
      es: {
        title: 'La institución de la Eucaristía',
        fruit: 'Adoración',
        intro:
          'Se queda para siempre: la Eucaristía es el misterio pascual hecho sacramento.',
        clause: 'que nos dio la Eucaristía',
      },
      en: {
        title: 'The Institution of the Eucharist',
        fruit: 'Adoration',
        clause: 'who gave us the Eucharist',
      },
      la: {
        title: 'Eucharistiae institutio',
        fruit: 'Adoratio',
        clause: 'qui nobis Eucharistiam dedit',
      },
    },
    source: rvm,
  },
  {
    id: 'dolorosa-1',
    set: 'dolorosa',
    order: 1,
    scriptureRef: 'Mt 26,36-46',
    text: {
      es: {
        title: 'La oración de Jesús en el huerto',
        fruit: 'Dolor de los pecados',
        intro: '"No se haga mi voluntad, sino la tuya": aquí se deshace el no del Edén.',
        clause: 'que sudó sangre por nosotros',
      },
      en: {
        title: 'The Agony in the Garden',
        fruit: 'Sorrow for sin',
        clause: 'who sweated blood for us',
      },
      la: {
        title: 'Agonia in horto',
        fruit: 'Contritio',
        clause: 'qui pro nobis sanguinem sudavit',
      },
    },
    source: rvm,
  },
  {
    id: 'dolorosa-2',
    set: 'dolorosa',
    order: 2,
    scriptureRef: 'Jn 19,1',
    text: {
      es: {
        title: 'La flagelación del Señor',
        fruit: 'Mortificación',
        intro: 'Cargó con nuestros dolores y por sus llagas fuimos curados (Is 53,4-5).',
        clause: 'que fue azotado por nosotros',
      },
      en: {
        title: 'The Scourging at the Pillar',
        fruit: 'Mortification',
        clause: 'who was scourged for us',
      },
      la: {
        title: 'Flagellatio',
        fruit: 'Mortificatio',
        clause: 'qui pro nobis flagellatus est',
      },
    },
    source: rvm,
  },
  {
    id: 'dolorosa-3',
    set: 'dolorosa',
    order: 3,
    scriptureRef: 'Mt 27,27-31',
    text: {
      es: {
        title: 'La coronación de espinas',
        fruit: 'Fortaleza',
        intro: 'Ecce homo: el Rey coronado de burla.',
        clause: 'que fue coronado de espinas',
      },
      en: {
        title: 'The Crowning with Thorns',
        fruit: 'Courage',
        clause: 'who was crowned with thorns',
      },
      la: {
        title: 'Coronatio spinis',
        fruit: 'Fortitudo',
        clause: 'qui pro nobis spinis coronatus est',
      },
    },
    source: rvm,
  },
  {
    id: 'dolorosa-4',
    set: 'dolorosa',
    order: 4,
    scriptureRef: 'Lc 23,26-32',
    text: {
      es: {
        title: 'Jesús con la cruz a cuestas camino del Calvario',
        fruit: 'Paciencia',
        intro: 'Simón de Cirene carga con la cruz y las mujeres de Jerusalén lloran.',
        clause: 'que llevó la cruz por nosotros',
      },
      en: {
        title: 'The Carrying of the Cross',
        fruit: 'Patience',
        clause: 'who carried the cross for us',
      },
      la: {
        title: 'Baiulatio crucis',
        fruit: 'Patientia',
        clause: 'qui pro nobis crucem baiulavit',
      },
    },
    source: rvm,
  },
  {
    id: 'dolorosa-5',
    set: 'dolorosa',
    order: 5,
    scriptureRef: 'Jn 19,25-30',
    text: {
      es: {
        title: 'La crucifixión y muerte de Jesús',
        fruit: 'Perseverancia final',
        intro: '"Mujer, ahí tienes a tu hijo": desde la cruz nos entrega a su Madre.',
        clause: 'que fue crucificado por nosotros',
      },
      en: {
        title: 'The Crucifixion',
        fruit: 'Final perseverance',
        clause: 'who was crucified for us',
      },
      la: {
        title: 'Crucifixio',
        fruit: 'Perseverantia',
        clause: 'qui pro nobis crucifixus est',
      },
    },
    source: rvm,
  },
  {
    id: 'gloriosa-1',
    set: 'gloriosa',
    order: 1,
    scriptureRef: 'Lc 24,1-12',
    text: {
      es: {
        title: 'La Resurrección del Señor',
        fruit: 'Fe',
        intro: 'El Resucitado: todo el Rosario mira hacia aquí.',
        clause: 'que resucitó de entre los muertos',
      },
      en: { title: 'The Resurrection', fruit: 'Faith', clause: 'who rose from the dead' },
      la: { title: 'Resurrectio', fruit: 'Fides', clause: 'qui a mortuis resurrexit' },
    },
    source: rvm,
  },
  {
    id: 'gloriosa-2',
    set: 'gloriosa',
    order: 2,
    scriptureRef: 'Hch 1,6-11',
    text: {
      es: {
        title: 'La Ascensión del Señor',
        fruit: 'Esperanza',
        intro: 'Sube al Padre y nos deja esperando lo mismo.',
        clause: 'que subió a los cielos',
      },
      en: { title: 'The Ascension', fruit: 'Hope', clause: 'who ascended into heaven' },
      la: { title: 'Ascensio', fruit: 'Spes', clause: 'qui in caelum ascendit' },
    },
    source: rvm,
  },
  {
    id: 'gloriosa-3',
    set: 'gloriosa',
    order: 3,
    scriptureRef: 'Hch 2,1-13',
    text: {
      es: {
        title: 'La venida del Espíritu Santo sobre los Apóstoles',
        fruit: 'Amor de Dios',
        intro: 'María está en medio de ellos, en oración.',
        clause: 'que nos envió el Espíritu Santo',
      },
      en: {
        title: 'The Descent of the Holy Spirit',
        fruit: 'Love of God',
        clause: 'who sent us the Holy Spirit',
      },
      la: {
        title: 'Descensus Spiritus Sancti',
        fruit: 'Caritas Dei',
        clause: 'qui Spiritum Sanctum misit',
      },
    },
    source: rvm,
  },
  {
    id: 'gloriosa-4',
    set: 'gloriosa',
    order: 4,
    scriptureRef: 'Lc 1,48-49',
    text: {
      es: {
        title: 'La Asunción de María a los cielos',
        fruit: 'Buena muerte',
        intro: 'En ella se anticipa lo que se nos promete a todos.',
        clause: 'que te llevó al cielo',
      },
      en: {
        title: 'The Assumption',
        fruit: 'A holy death',
        clause: 'who assumed you into heaven',
      },
      la: {
        title: 'Assumptio',
        fruit: 'Bona mors',
        clause: 'qui te in caelum assumpsit',
      },
    },
    source: rvm,
  },
  {
    id: 'gloriosa-5',
    set: 'gloriosa',
    order: 5,
    scriptureRef: 'Ap 12,1',
    text: {
      es: {
        title: 'La coronación de María como Reina de cielo y tierra',
        fruit: 'Confianza en María',
        intro:
          'Reina de los ángeles y de los santos, y madre nuestra: el final al que mira todo el Rosario.',
        clause: 'que te coronó en el cielo',
      },
      en: {
        title: 'The Coronation of Mary',
        fruit: 'Trust in Mary',
        clause: 'who crowned you in heaven',
      },
      la: {
        title: 'Coronatio',
        fruit: 'Fiducia in Maria',
        clause: 'qui te in caelo coronavit',
      },
    },
    source: rvm,
  },
] as const;
