import type { InterfaceLanguage } from '@/shared/i18n';

export type Figure = 'cross' | 'opening' | 'decade' | 'sets';

export type LessonPage = {
  title: string;
  body: string;
  /** A sentence quoted word for word, with the paragraph it comes from. */
  quote?: { text: string; cite: string };
  figure?: Figure;
};

export type Lesson = { id: string; title: string; pages: LessonPage[]; source: { title: string; url: string } };

const rvm = {
  es: {
    title: 'Juan Pablo II, Rosarium Virginis Mariae (2002)',
    url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
  },
  en: {
    title: 'John Paul II, Rosarium Virginis Mariae (2002)',
    url: 'https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
  },
};

const howToPray: Record<InterfaceLanguage, Lesson> = {
  es: {
    id: 'how-to-pray',
    title: 'Cómo se reza el Rosario',
    source: rvm.es,
    pages: [
      {
        title: 'Qué es',
        body: 'El Rosario es una oración a la Virgen que recorre la vida de Jesús. Mientras se repiten oraciones sencillas, se piensa en una escena del Evangelio.',
        quote: { text: 'Recitar el Rosario, en efecto, es en realidad contemplar con María el rostro de Cristo.', cite: 'RVM 3' },
        figure: 'cross',
      },
      {
        title: 'Cómo empieza',
        body: 'Se empieza en el crucifijo con la señal de la cruz y el Credo. Después, en la primera cuenta grande, un Padrenuestro; en las tres pequeñas, tres Avemarías; y un Gloria.',
        quote: {
          text: 'El rosario está centrado en el Crucifijo, que abre y cierra el proceso mismo de la oración.',
          cite: 'RVM 36',
        },
        figure: 'opening',
      },
      {
        title: 'Cada decena',
        body: 'Se anuncia un misterio y se guarda un momento de silencio. Luego un Padrenuestro en la cuenta grande, diez Avemarías, una por cuenta, y un Gloria. Así cinco veces.',
        quote: {
          text: 'Es conveniente que, después de enunciar el misterio y proclamar la Palabra, esperemos unos momentos antes de iniciar la oración vocal, para fijar la atención sobre el misterio meditado.',
          cite: 'RVM 31',
        },
        figure: 'decade',
      },
      {
        title: 'Los misterios',
        body: 'Hay veinte misterios en cuatro grupos: gozosos, luminosos, dolorosos y gloriosos. Cada día se reza un grupo. La app te propone el de hoy.',
        quote: {
          text: 'Esta distribución semanal da a los días de la semana un cierto «color» espiritual, análogamente a lo que hace la Liturgia con las diversas fases del año litúrgico.',
          cite: 'RVM 38',
        },
        figure: 'sets',
      },
      {
        title: 'Sin prisa',
        body: 'Lo importante no es terminar rápido. Ve despacio, piensa en la escena y deja que las palabras acompañen. Si te pierdes, la cuenta en la pantalla te dice dónde vas.',
        quote: {
          text: 'Por su naturaleza el rezo del Rosario exige un ritmo tranquilo y un reflexivo remanso.',
          cite: 'Pablo VI, citado en RVM 12',
        },
      },
    ],
  },
  en: {
    id: 'how-to-pray',
    title: 'How to pray the Rosary',
    source: rvm.en,
    pages: [
      {
        title: 'What it is',
        body: 'The Rosary is a prayer to Our Lady that walks through the life of Jesus. While simple prayers are repeated, you think about a scene from the Gospel.',
        quote: { text: 'To recite the Rosary is nothing other than to contemplate with Mary the face of Christ.', cite: 'RVM 3' },
        figure: 'cross',
      },
      {
        title: 'How it begins',
        body: 'You begin at the crucifix with the Sign of the Cross and the Creed. Then an Our Father on the first large bead, three Hail Marys on the three small ones, and a Glory Be.',
        quote: {
          text: 'The first thing to note is the way the beads converge upon the Crucifix, which both opens and closes the unfolding sequence of prayer.',
          cite: 'RVM 36',
        },
        figure: 'opening',
      },
      {
        title: 'Each decade',
        body: 'A mystery is announced and you keep a moment of silence. Then an Our Father on the large bead, ten Hail Marys, one per bead, and a Glory Be. Five times.',
        quote: {
          text: "After the announcement of the mystery and the proclamation of the word, it is fitting to pause and focus one's attention for a suitable period of time on the mystery concerned, before moving into vocal prayer.",
          cite: 'RVM 31',
        },
        figure: 'decade',
      },
      {
        title: 'The mysteries',
        body: "There are twenty mysteries in four sets: joyful, luminous, sorrowful and glorious. Each day has its set. The app suggests today's.",
        quote: {
          text: 'This weekly distribution has the effect of giving the different days of the week a certain spiritual "colour".',
          cite: 'RVM 38',
        },
        figure: 'sets',
      },
      {
        title: 'Take your time',
        body: 'What matters is not finishing quickly. Go slowly, picture the scene and let the words keep you company. If you lose your place, the beads on screen show where you are.',
        quote: {
          text: 'By its nature the recitation of the Rosary calls for a quiet rhythm and a lingering pace.',
          cite: 'Paul VI, quoted in RVM 12',
        },
      },
    ],
  },
};

export function lesson(id: string, language: InterfaceLanguage): Lesson | null {
  return id === 'how-to-pray' ? howToPray[language] : null;
}
