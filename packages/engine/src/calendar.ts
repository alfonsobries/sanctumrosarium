import type { MysterySetId } from '@rosario/content';

export type LiturgicalSeason =
  'advent' | 'christmas' | 'lent' | 'triduum' | 'easter' | 'ordinary';

export type DayOfMysteries = {
  readonly set: MysterySetId;
  /**
   * Why this set. `weekday` is the ordinary rule of RVM 38; `season` and `solemnity` mean the
   * liturgical day overrides it, and the app says so instead of switching in silence.
   */
  readonly reason: 'weekday' | 'season' | 'solemnity';
  readonly season: LiturgicalSeason;
  /** Name of the feast when the reason is `solemnity`, so the app can explain itself. */
  readonly feast?: string;
};

/** Easter Sunday, anonymous Gregorian algorithm. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function sameDay(a: Date, month: number, day: number): boolean {
  return a.getUTCMonth() === month - 1 && a.getUTCDate() === day;
}

/**
 * The liturgical season of a day, in the Ordinary Form.
 *
 * Advent starts on the fourth Sunday before Christmas; Christmas time runs to the Baptism of the
 * Lord; Lent from Ash Wednesday to the Mass of the Lord's Supper; the Triduum is its own thing,
 * because Easter time starts at the Vigil, not on Holy Thursday.
 */
export function liturgicalSeason(date: Date): LiturgicalSeason {
  const day = utcDay(date);
  const year = day.getUTCFullYear();

  const christmas = new Date(Date.UTC(year, 11, 25));
  const adventStart = addDays(
    christmas,
    -(christmas.getUTCDay() === 0 ? 7 : christmas.getUTCDay()) - 21,
  );
  if (day >= adventStart && day < christmas) {
    return 'advent';
  }

  // Christmas time reaches into January: it ends with the Baptism of the Lord, the Sunday after
  // Epiphany. Where Epiphany moves to the Sunday between 2 and 8 January and lands on the 7th or
  // 8th, the Baptism is the following Monday.
  const epiphany = new Date(Date.UTC(year, 0, 6));
  const daysToSunday = (7 - epiphany.getUTCDay()) % 7;
  const baptism = addDays(epiphany, daysToSunday === 0 ? 7 : daysToSunday);
  if (day >= christmas || day <= baptism) {
    return 'christmas';
  }

  const easter = easterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const holyThursday = addDays(easter, -3);
  if (day >= ashWednesday && day < holyThursday) {
    return 'lent';
  }

  if (day >= holyThursday && day < easter) {
    return 'triduum';
  }

  const pentecost = addDays(easter, 49);
  if (day >= easter && day <= pentecost) {
    return 'easter';
  }

  return 'ordinary';
}

/**
 * Feasts whose mysteries the custom fixes whatever the day of the week.
 *
 * DPPL 200 warns against applying the weekly rule rigidly, and gives the exact case: praying the
 * sorrowful mysteries on Christmas Day because it falls on a Friday. "The liturgical character of
 * a given day must take precedence over its place in the week."
 */
function solemnityOf(
  date: Date,
  easter: Date,
): { set: MysterySetId; feast: string } | undefined {
  const day = utcDay(date);

  if (sameDay(day, 12, 25)) {
    return { set: 'gaudiosa', feast: 'Navidad' };
  }
  if (sameDay(day, 1, 1)) {
    return { set: 'gaudiosa', feast: 'Santa María, Madre de Dios' };
  }
  if (sameDay(day, 1, 6)) {
    return { set: 'gaudiosa', feast: 'Epifanía' };
  }
  if (sameDay(day, 3, 25)) {
    return { set: 'gaudiosa', feast: 'Anunciación del Señor' };
  }
  if (sameDay(day, 8, 15)) {
    return { set: 'gloriosa', feast: 'Asunción de la Virgen' };
  }

  const goodFriday = addDays(easter, -2);
  const holySaturday = addDays(easter, -1);
  if (day.getTime() === goodFriday.getTime()) {
    return { set: 'dolorosa', feast: 'Viernes Santo' };
  }
  if (day.getTime() === holySaturday.getTime()) {
    return { set: 'dolorosa', feast: 'Sábado Santo' };
  }
  if (day.getTime() === addDays(easter, -3).getTime()) {
    return { set: 'dolorosa', feast: 'Jueves Santo' };
  }
  if (day.getTime() === easter.getTime()) {
    return { set: 'gloriosa', feast: 'Domingo de Pascua' };
  }
  if (day.getTime() === addDays(easter, 39).getTime()) {
    return { set: 'gloriosa', feast: 'Ascensión del Señor' };
  }
  if (day.getTime() === addDays(easter, 49).getTime()) {
    return { set: 'gloriosa', feast: 'Pentecostés' };
  }

  return undefined;
}

/**
 * Which mysteries today.
 *
 * Three layers, in order: the liturgical day (DPPL 200), the season on Sundays, and the weekly
 * rule of RVM 38. Whatever wins, the reason travels with the answer so the app can explain it
 * instead of switching in silence.
 */
export function mysteriesOfDay(
  date: Date,
  options: { readonly withLuminous?: boolean } = {},
): DayOfMysteries {
  const withLuminous = options.withLuminous ?? true;
  const season = liturgicalSeason(date);
  const weekday = date.getDay();

  const solemnity = solemnityOf(date, easterSunday(date.getFullYear()));
  if (solemnity !== undefined) {
    return { set: solemnity.set, reason: 'solemnity', season, feast: solemnity.feast };
  }

  if (weekday === 0) {
    if (season === 'advent' || season === 'christmas') {
      return { set: 'gaudiosa', reason: 'season', season };
    }
    if (season === 'lent') {
      return { set: 'dolorosa', reason: 'season', season };
    }
    return { set: 'gloriosa', reason: 'weekday', season };
  }

  const modern: readonly MysterySetId[] = [
    'gloriosa', // Sunday, handled above
    'gaudiosa', // Monday
    'dolorosa', // Tuesday
    'gloriosa', // Wednesday
    'luminosa', // Thursday
    'dolorosa', // Friday
    'gaudiosa', // Saturday
  ];

  // Before 2002 there were no luminous mysteries: joyful on Monday and Thursday, glorious on Saturday.
  const traditional: readonly MysterySetId[] = [
    'gloriosa',
    'gaudiosa',
    'dolorosa',
    'gloriosa',
    'gaudiosa',
    'dolorosa',
    'gloriosa',
  ];

  const table = withLuminous ? modern : traditional;
  const set = table[weekday] ?? 'gloriosa';
  return { set, reason: 'weekday', season };
}
