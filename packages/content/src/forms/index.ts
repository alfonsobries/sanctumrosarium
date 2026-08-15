import type { RosaryForm } from '../types';

/**
 * How the Rosary is framed in each region.
 *
 * What is essential (mystery, Our Father, ten Hail Marys, Glory Be) is not here: the engine always
 * produces it. These forms only describe the frame around it, which does change by region
 * (RVM 37: "son usos igualmente legítimos").
 */

const roman: RosaryForm = {
  id: 'roman',
  name: 'Forma romana',
  locales: ['en-US', 'es-MX', 'es-ES', 'la'],
  opening: [
    { kind: 'prayer', prayer: 'signum-crucis' },
    { kind: 'prayer', prayer: 'credo' },
    { kind: 'prayer', prayer: 'pater-noster' },
    { kind: 'prayer-times', prayer: 'ave-maria', times: 3 },
    { kind: 'prayer', prayer: 'gloria-patri' },
    { kind: 'decades' },
  ],
  decade: {
    announce: true,
    reading: false,
    opening: [],
    closing: [{ kind: 'prayer', prayer: 'oratio-fatimae', optional: true }],
  },
  closing: [
    { kind: 'prayer', prayer: 'salve-regina' },
    { kind: 'prayer', prayer: 'versiculum-salve' },
    { kind: 'litany', optional: true },
    { kind: 'prayer', prayer: 'oratio-litaniarum', optional: true },
    { kind: 'prayer', prayer: 'oratio-finalis' },
    { kind: 'prayer', prayer: 'signum-crucis' },
  ],
  source: {
    name: 'USCCB, How to Pray the Rosary',
    url: 'https://www.usccb.org/how-to-pray-the-rosary',
  },
};

const mexican: RosaryForm = {
  id: 'es-MX',
  name: 'Forma mexicana',
  locales: ['es-MX'],
  opening: [
    { kind: 'prayer', prayer: 'ave-maria-purissima', optional: true },
    { kind: 'prayer', prayer: 'per-signum-crucis' },
    { kind: 'prayer', prayer: 'actus-contritionis', optional: true },
    { kind: 'prayer', prayer: 'oblatio', optional: true },
    { kind: 'prayer', prayer: 'credo' },
    { kind: 'prayer', prayer: 'pater-noster' },
    { kind: 'prayer-times', prayer: 'ave-maria', times: 3 },
    { kind: 'prayer', prayer: 'gloria-patri' },
    { kind: 'decades' },
  ],
  decade: {
    announce: true,
    reading: false,
    opening: [],
    closing: [
      { kind: 'prayer', prayer: 'iaculatoria-mariae' },
      { kind: 'prayer', prayer: 'oratio-fatimae', optional: true },
    ],
  },
  closing: [
    { kind: 'prayer', prayer: 'salve-hija-de-dios-padre' },
    { kind: 'prayer', prayer: 'salve-madre-de-dios-hijo' },
    { kind: 'prayer', prayer: 'salve-esposa-del-espiritu-santo' },
    { kind: 'prayer', prayer: 'templo-y-sagrario' },
    { kind: 'prayer', prayer: 'salve-regina' },
    { kind: 'prayer', prayer: 'versiculum-salve' },
    { kind: 'litany', optional: true },
    { kind: 'prayer', prayer: 'oratio-litaniarum', optional: true },
    { kind: 'prayer', prayer: 'oratio-finalis' },
    { kind: 'prayer', prayer: 'sub-tuum', optional: true },
    { kind: 'prayer', prayer: 'per-signum-crucis' },
  ],
  source: {
    name: 'Forma mexicana del Santo Rosario (Arquidiócesis de México)',
    url: 'https://desdelafe.mx/',
  },
};

const spanish: RosaryForm = {
  id: 'es-ES',
  name: 'Forma española',
  locales: ['es-ES'],
  opening: [
    { kind: 'prayer', prayer: 'per-signum-crucis' },
    { kind: 'prayer', prayer: 'domine-labia' },
    { kind: 'prayer', prayer: 'gloria-patri' },
    { kind: 'prayer', prayer: 'actus-contritionis', optional: true },
    { kind: 'prayer', prayer: 'oblatio', optional: true },
    { kind: 'decades' },
  ],
  decade: {
    announce: true,
    reading: false,
    opening: [],
    closing: [
      { kind: 'prayer', prayer: 'oratio-fatimae', optional: true },
      { kind: 'prayer', prayer: 'ave-maria-purissima', optional: true },
    ],
  },
  closing: [
    { kind: 'prayer', prayer: 'salve-hija-de-dios-padre' },
    { kind: 'prayer', prayer: 'salve-madre-de-dios-hijo' },
    { kind: 'prayer', prayer: 'salve-esposa-del-espiritu-santo' },
    { kind: 'prayer', prayer: 'templo-y-sagrario' },
    { kind: 'prayer', prayer: 'salve-regina' },
    { kind: 'prayer', prayer: 'versiculum-salve' },
    { kind: 'litany', optional: true },
    { kind: 'prayer', prayer: 'oratio-litaniarum', optional: true },
    { kind: 'prayer', prayer: 'oratio-finalis' },
    { kind: 'prayer', prayer: 'oratio-pro-papa', optional: true },
    { kind: 'prayer', prayer: 'per-signum-crucis' },
  ],
  source: {
    name: 'Forma española del Santo Rosario (Orden de Predicadores)',
    url: 'https://www.dominicos.org/',
  },
};

const dominican: RosaryForm = {
  id: 'dominican',
  name: 'Forma dominicana',
  locales: ['la', 'en-US', 'es-ES', 'es-MX'],
  opening: [
    { kind: 'prayer', prayer: 'signum-crucis' },
    { kind: 'prayer', prayer: 'deus-in-adiutorium' },
    { kind: 'prayer', prayer: 'gloria-patri' },
    { kind: 'decades' },
  ],
  decade: {
    announce: true,
    reading: false,
    opening: [],
    closing: [{ kind: 'prayer', prayer: 'oratio-fatimae', optional: true }],
  },
  closing: [
    { kind: 'prayer', prayer: 'salve-regina' },
    { kind: 'prayer', prayer: 'versiculum-salve' },
    { kind: 'litany', optional: true },
    { kind: 'prayer', prayer: 'oratio-litaniarum', optional: true },
    { kind: 'prayer', prayer: 'oratio-finalis' },
    { kind: 'prayer', prayer: 'signum-crucis' },
  ],
  source: {
    name: 'Rosarium Virginis Mariae 37 (inicio dominicano con el Salmo 69)',
    url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
  },
};

export const forms = { roman, 'es-MX': mexican, 'es-ES': spanish, dominican } as const;

export const allForms: readonly RosaryForm[] = [roman, mexican, spanish, dominican];
