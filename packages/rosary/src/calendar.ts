import type { MysterySet } from './types';

/** A calendar day as the person praying sees it, with no time zone attached. */
export type LocalDate = { year: number; month: number; day: number };

/**
 * Weekday distribution from Rosarium Virginis Mariae 38: Monday and Saturday joyful,
 * Tuesday and Friday sorrowful, Wednesday and Sunday glorious, Thursday luminous.
 */
const byWeekday: readonly MysterySet[] = [
  'glorious', // Sunday
  'joyful',
  'sorrowful',
  'glorious',
  'luminous',
  'sorrowful',
  'joyful',
];

export function weekdayOf(date: LocalDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

export function mysterySetFor(date: LocalDate): MysterySet {
  const set = byWeekday[weekdayOf(date)];
  if (set === undefined) {
    throw new RangeError('Invalid date');
  }
  return set;
}

export function localDateOf(instant: Date): LocalDate {
  return { year: instant.getFullYear(), month: instant.getMonth() + 1, day: instant.getDate() };
}

export function formatLocalDate(date: LocalDate): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

export function parseLocalDate(value: string): LocalDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) {
    throw new RangeError(`Not a local date: ${value}`);
  }
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}
