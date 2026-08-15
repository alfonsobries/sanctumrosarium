import type { PrayerText } from '../types';

const spanish = {
  name: 'Forma española del Santo Rosario (Orden de Predicadores, dominicos.org)',
  url: 'https://www.dominicos.org/',
} as const;

/** Pieces that only the Spanish form uses. The common Spanish prayers live in es-common.ts. */
export const spanishOnlyPrayers: readonly PrayerText[] = [
  {
    id: 'per-signum-crucis',
    locale: 'es-ES',
    title: 'Por la señal',
    lines: [
      'Por la señal de la Santa Cruz,',
      'de nuestros enemigos líbranos, Señor, Dios nuestro.',
      'En el nombre del Padre, y del Hijo, y del Espíritu Santo.',
      'Amén.',
    ],
    source: spanish,
  },
  {
    id: 'domine-labia',
    locale: 'es-ES',
    title: 'Señor, abre mis labios',
    lines: [
      'Señor, abre mis labios.',
      'Y mi boca proclamará tu alabanza.',
      'Dios mío, ven en mi auxilio.',
      'Señor, date prisa en socorrerme.',
    ],
    responseFrom: 1,
    source: spanish,
  },
  {
    id: 'oblatio',
    locale: 'es-ES',
    title: 'Ofrecimiento',
    lines: [
      'Señor Dios nuestro, dirigid y guiad todos nuestros pensamientos,',
      'palabras y obras a mayor honra y gloria vuestra.',
      'Y vos, Virgen Santísima, alcanzadnos de vuestro divino Hijo',
      'que con toda atención y devoción podamos rezar vuestro santísimo Rosario,',
      'el cual os ofrecemos por la exaltación de la santa fe católica,',
      'por nuestras necesidades espirituales y temporales,',
      'y por el bien y sufragio de vivos y difuntos.',
    ],
    source: spanish,
  },
  {
    id: 'ave-maria-purissima',
    locale: 'es-ES',
    title: 'Ave María Purísima',
    lines: ['Ave María Purísima.', 'Sin pecado concebida.'],
    responseFrom: 1,
    source: spanish,
  },
  {
    id: 'sancte-michael',
    locale: 'es-ES',
    title: 'Oración a san Miguel Arcángel',
    lines: [
      'San Miguel Arcángel, defiéndenos en la batalla;',
      'sé nuestro amparo contra la perversidad y asechanzas del demonio.',
      'Reprímale Dios, pedimos suplicantes,',
      'y tú, Príncipe de la milicia celestial,',
      'arroja al infierno con el divino poder',
      'a Satanás y a los otros espíritus malignos',
      'que andan dispersos por el mundo para la perdición de las almas.',
      'Amén.',
    ],
    source: spanish,
  },
] as const;
