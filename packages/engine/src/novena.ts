/**
 * The 54-day Rosary novena of Pompeii: twenty-seven days in petition and twenty-seven
 * in thanksgiving, cycling joyful, sorrowful and glorious. The luminous mysteries are
 * not part of the original scheme: a fourth day would break 27 = 3 x 9 (task 044).
 */

export const NOVENA_DAYS = 54;

export type NovenaPhase = 'petition' | 'thanksgiving';
export type NovenaSet = 'gaudiosa' | 'dolorosa' | 'gloriosa';

export type NovenaDay = {
  /** 1 to 54. */
  readonly day: number;
  readonly phase: NovenaPhase;
  readonly set: NovenaSet;
};

const cycle: readonly NovenaSet[] = ['gaudiosa', 'dolorosa', 'gloriosa'];

export function novenaDay(day: number): NovenaDay {
  if (!Number.isInteger(day) || day < 1 || day > NOVENA_DAYS) {
    throw new RangeError(`novena day out of range: ${day}`);
  }
  return {
    day,
    phase: day <= 27 ? 'petition' : 'thanksgiving',
    set: cycle[(day - 1) % 3]!,
  };
}
