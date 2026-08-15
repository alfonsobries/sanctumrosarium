import type { MysterySetId } from '@rosario/content';

export type LiturgicalSeason = 'advent' | 'christmas' | 'lent' | 'easter' | 'ordinary';

export type DayOfMysteries = {
  readonly set: MysterySetId;
  /**
   * Why this set. `weekday` is the ordinary rule of RVM 38; `season` means the liturgical time
   * overrides it, and the app says so instead of switching in silence (DPPL 200).
   */
  readonly reason: 'weekday' | 'season';
  readonly season: LiturgicalSeason;
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

/**
 * The liturgical season of a day, in the Ordinary Form.
 *
 * Advent starts on the fourth Sunday before Christmas; Christmas time runs to the Baptism of the
 * Lord; Lent from Ash Wednesday to Holy Thursday; Easter to Pentecost.
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

  // Christmas time reaches into January: the Baptism of the Lord, the Sunday after Epiphany.
  const epiphany = new Date(Date.UTC(year, 0, 6));
  const daysToSunday = (7 - epiphany.getUTCDay()) % 7;
  const baptism = addDays(epiphany, daysToSunday === 0 ? 7 : daysToSunday);
  if (day >= new Date(Date.UTC(year, 11, 25)) || day <= baptism) {
    return 'christmas';
  }

  const easter = easterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const holyThursday = addDays(easter, -3);
  if (day >= ashWednesday && day < holyThursday) {
    return 'lent';
  }

  const pentecost = addDays(easter, 49);
  if (day >= holyThursday && day <= pentecost) {
    return 'easter';
  }

  return 'ordinary';
}

/**
 * Which mysteries today.
 *
 * The weekly rule is RVM 38. The season overrides it on Sundays, following the custom the USCCB
 * publishes and the caution of DPPL 200 against applying the weekday rule rigidly.
 */
export function mysteriesOfDay(
  date: Date,
  options: { readonly withLuminous?: boolean } = {},
): DayOfMysteries {
  const withLuminous = options.withLuminous ?? true;
  const season = liturgicalSeason(date);
  const weekday = date.getDay();

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
