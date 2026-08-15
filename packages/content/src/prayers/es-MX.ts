import type { PrayerText } from '../types';

const mexican = {
  name: 'Forma mexicana del Santo Rosario (Arquidiócesis de México, Desde la Fe)',
  url: 'https://desdelafe.mx/',
} as const;

/** Pieces that only the Mexican form uses. The common Spanish prayers live in es-common.ts. */
export const mexicanOnlyPrayers: readonly PrayerText[] = [
  {
    id: 'per-signum-crucis',
    locale: 'es-MX',
    title: 'Por la señal',
    lines: [
      'Por la señal de la Santa Cruz,',
      'de nuestros enemigos líbranos, Señor, Dios nuestro.',
      'En el nombre del Padre, y del Hijo, y del Espíritu Santo.',
      'Amén.',
    ],
    source: mexican,
  },
  {
    id: 'iaculatoria-mariae',
    locale: 'es-MX',
    title: 'María, Madre de gracia',
    lines: [
      'María, Madre de gracia, Madre de misericordia,',
      'en la vida y en la muerte ampáranos, gran Señora.',
    ],
    source: mexican,
  },
  {
    id: 'salve-hija-de-dios-padre',
    locale: 'es-MX',
    title: 'Dios te salve, María Santísima, Hija de Dios Padre',
    lines: [
      'Dios te salve, María Santísima, Hija de Dios Padre,',
      'Virgen purísima antes del parto;',
      'en tus manos ponemos nuestra fe para que la ilumines.',
      'Dios te salve, María, llena eres de gracia...',
    ],
    source: mexican,
  },
  {
    id: 'salve-madre-de-dios-hijo',
    locale: 'es-MX',
    title: 'Dios te salve, María Santísima, Madre de Dios Hijo',
    lines: [
      'Dios te salve, María Santísima, Madre de Dios Hijo,',
      'Virgen purísima en el parto;',
      'en tus manos ponemos nuestra esperanza para que la alientes.',
      'Dios te salve, María, llena eres de gracia...',
    ],
    source: mexican,
  },
  {
    id: 'salve-esposa-del-espiritu-santo',
    locale: 'es-MX',
    title: 'Dios te salve, María Santísima, Esposa de Dios Espíritu Santo',
    lines: [
      'Dios te salve, María Santísima, Esposa de Dios Espíritu Santo,',
      'Virgen purísima después del parto;',
      'en tus manos ponemos nuestra caridad para que la inflames.',
      'Dios te salve, María, llena eres de gracia...',
    ],
    source: mexican,
  },
  {
    id: 'templo-y-sagrario',
    locale: 'es-MX',
    title: 'Templo y Sagrario',
    lines: [
      'Dios te salve, María Santísima,',
      'Templo y Sagrario de la Santísima Trinidad,',
      'Virgen concebida sin la culpa del pecado original.',
    ],
    source: mexican,
  },
  {
    id: 'sancte-michael',
    locale: 'es-MX',
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
    source: mexican,
  },
] as const;
