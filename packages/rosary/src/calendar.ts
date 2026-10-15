import { mysterySets, type MysterySet } from './types';

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

/**
 * The order RVM 38 describes as the practice before the luminous mysteries: Monday and
 * Thursday joyful, Tuesday and Friday sorrowful, Wednesday, Saturday and Sunday glorious.
 */
const byWeekdayWithoutLuminous: readonly MysterySet[] = [
  'glorious', // Sunday
  'joyful',
  'sorrowful',
  'glorious',
  'joyful',
  'sorrowful',
  'glorious',
];

/** Whether the person prays the luminous mysteries, which changes the week's order. */
export type WeekOptions = { luminous: boolean };

const withLuminous: WeekOptions = { luminous: true };

export function weekdayOf(date: LocalDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

export function mysterySetFor(date: LocalDate, options: WeekOptions = withLuminous): MysterySet {
  const set = (options.luminous ? byWeekday : byWeekdayWithoutLuminous)[weekdayOf(date)];
  if (set === undefined) {
    throw new RangeError('Invalid date');
  }
  return set;
}

/** The sets offered to pray, in order. */
export function offeredSets(options: WeekOptions = withLuminous): readonly MysterySet[] {
  return options.luminous ? mysterySets : mysterySets.filter((set) => set !== 'luminous');
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
