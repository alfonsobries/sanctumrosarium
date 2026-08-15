import type { LiturgicalSeason } from '@rosario/engine';
import type { MysterySetId } from '@rosario/content';

export const setNames: Record<MysterySetId, string> = {
  gaudiosa: 'Misterios gozosos',
  luminosa: 'Misterios luminosos',
  dolorosa: 'Misterios dolorosos',
  gloriosa: 'Misterios gloriosos',
};

const seasonNames: Record<LiturgicalSeason, string> = {
  advent: 'Adviento',
  christmas: 'Navidad',
  lent: 'Cuaresma',
  easter: 'Pascua',
  ordinary: 'tiempo ordinario',
};

/** Why these mysteries today. Plain, no exclamation, no instruction. */
export function reasonFor(
  reason: 'weekday' | 'season',
  season: LiturgicalSeason,
): string {
  if (reason === 'season') {
    return `Domingo de ${seasonNames[season]}: la costumbre reza estos misterios.`;
  }
  return 'Los que corresponden a este día de la semana.';
}
