import { formatLocalDate, type LocalDate } from '@sanctamaria/rosary';

export function addDays(date: LocalDate, days: number): LocalDate {
  const value = new Date(date.year, date.month - 1, date.day + days);
  return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
}

/** Monday-first week containing `date`. */
export function weekOf(date: LocalDate): LocalDate[] {
  const weekday = new Date(date.year, date.month - 1, date.day).getDay();
  const monday = addDays(date, -((weekday + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function monthRange(year: number, month: number): { from: string; to: string; days: number } {
  const days = new Date(year, month, 0).getDate();
  return {
    from: formatLocalDate({ year, month, day: 1 }),
    to: formatLocalDate({ year, month, day: days }),
    days,
  };
}

/** Grid cells for a Monday-first month calendar; null pads the first week. */
export function monthGrid(year: number, month: number): (LocalDate | null)[] {
  const first = new Date(year, month - 1, 1).getDay();
  const padding = (first + 6) % 7;
  const { days } = monthRange(year, month);
  return [
    ...Array.from({ length: padding }, () => null),
    ...Array.from({ length: days }, (_, index) => ({ year, month, day: index + 1 })),
  ];
}
