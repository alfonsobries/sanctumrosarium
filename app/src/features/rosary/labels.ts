import type { MysterySetId } from '@rosario/content';
import type { DayOfMysteries, LiturgicalSeason } from '@rosario/engine';

export const setNames: Record<MysterySetId, string> = {
  gaudiosa: 'Misterios gozosos',
  luminosa: 'Misterios luminosos',
  dolorosa: 'Misterios dolorosos',
  gloriosa: 'Misterios gloriosos',
};

const seasonNames: Record<LiturgicalSeason, string> = {
  advent: 'Adviento',
  christmas: 'Tiempo de Navidad',
  lent: 'Cuaresma',
  triduum: 'Triduo pascual',
  easter: 'Pascua',
  ordinary: 'tiempo ordinario',
};

/** Why these mysteries today. Plain, no exclamation, no instruction. */
export function reasonFor(today: DayOfMysteries): string {
  if (today.reason === 'solemnity') {
    return `${today.feast}: la costumbre reza estos misterios.`;
  }
  if (today.reason === 'season') {
    return `${seasonNames[today.season]}: la costumbre reza estos misterios.`;
  }
  return 'Los que corresponden a este día de la semana.';
}
