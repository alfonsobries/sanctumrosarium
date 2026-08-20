import type { Language, PrayerId } from './types';

/**
 * Line pairing between the Latin text of a prayer and the same prayer in another
 * language, for the bilingual reading mode (task 023).
 *
 * Only prayers whose line cuts differ need an entry: everything else pairs one to one.
 * Each array maps the own-language line index to the Latin line index it answers to.
 * Indices never decrease, so the interleaved reading keeps the order of both texts.
 * A Latin line missing from the map (e.g. an Amen the other language does not print)
 * simply shows alone.
 */
export const latinLineMap: Partial<
  Record<PrayerId, Partial<Record<Exclude<Language, 'la'>, readonly number[]>>>
> = {
  'ave-maria': {
    es: [0, 0, 1, 2, 3, 4, 5, 6],
    en: [0, 0, 1, 2, 3, 4, 5, 6],
  },
  credo: {
    es: [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8, 9, 9, 10],
  },
  'salve-regina': {
    es: [0, 1, 2, 3, 4, 4, 5, 5, 6],
  },
  'oratio-fatimae': {
    en: [0, 1, 2, 3],
  },
  'oratio-litaniarum': {
    es: [0, 1, 2, 3, 3, 4, 5],
  },
  'oratio-finalis': {
    es: [0, 1, 2, 2, 3, 4, 5],
    en: [0, 1, 2, 2, 3, 4, 5],
  },
  'sancte-michael': {
    en: [0, 1, 2, 3, 4, 5, 7],
  },
};
