import type { MysterySet } from '@sanctamaria/rosary';

import type { Language } from '../i18n/routes';

export function setTitle(set: MysterySet, language: Language): string {
  const titles: Record<MysterySet, Record<Language, string>> = {
    joyful: { es: 'Misterios gozosos', en: 'The Joyful Mysteries' },
    luminous: { es: 'Misterios luminosos', en: 'The Luminous Mysteries' },
    sorrowful: { es: 'Misterios dolorosos', en: 'The Sorrowful Mysteries' },
    glorious: { es: 'Misterios gloriosos', en: 'The Glorious Mysteries' },
  };
  return titles[set][language];
}

/** Weekdays of each set, Sunday first, from Rosarium Virginis Mariae 38. */
export const weekdaysOf: Record<MysterySet, readonly number[]> = {
  joyful: [1, 6],
  luminous: [4],
  sorrowful: [2, 5],
  glorious: [0, 3],
};
