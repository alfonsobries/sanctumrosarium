import { localDateOf } from '@/features/rosary/session-store';

import type { Journal } from './db';
import type { RuleId } from './rule';

/**
 * Faithfulness as a calendar that fills, never a streak that breaks
 * (docs/gamificacion.md, 2). Faithful days, not consecutive days: a gap is a gap,
 * not a loss. Paused days leave no gap and ask no explanation.
 */
export type DayFidelity = 'faithful' | 'empty' | 'paused' | 'future';

export type MonthFidelity = {
  readonly year: number;
  /** 0-based month, as Date uses it. */
  readonly month: number;
  /** For daily rules, one entry per day of the month. */
  readonly days: readonly DayFidelity[];
  /** For the weekly rule, one entry per week touching the month. */
  readonly weeks: readonly DayFidelity[];
  /** Days (or weeks) faithful so far, and the size of the month in that unit. */
  readonly done: number;
  readonly total: number;
  readonly unit: 'days' | 'weeks';
};

const dailyTargets: Partial<Record<RuleId, number>> = {
  'daily-decade': 1,
  'daily-rosary': 5,
  'full-rosary': 20,
};

function dateString(year: number, month: number, day: number): string {
  return localDateOf(new Date(year, month, day));
}

function mondayOf(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

export function monthFidelity(
  rule: RuleId,
  journal: Journal,
  isPaused: (localDate: string) => boolean,
  now: Date,
  year = now.getFullYear(),
  month = now.getMonth(),
): MonthFidelity | undefined {
  if (rule === 'none') {
    return undefined;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = localDateOf(now);
  const first = dateString(year, month, 1);
  const last = dateString(year, month, daysInMonth);
  const entries = journal.between(first, last);
  const decadesByDate = new Map<string, number>();
  for (const entry of entries) {
    decadesByDate.set(
      entry.localDate,
      (decadesByDate.get(entry.localDate) ?? 0) + entry.decades,
    );
  }

  if (rule === 'weekly-fifteen') {
    // The unit of the view follows the unit of the Rule: weeks, Monday to Sunday.
    const weeks: DayFidelity[] = [];
    let cursor = mondayOf(new Date(year, month, 1));
    const end = new Date(year, month, daysInMonth);
    while (cursor <= end) {
      const weekDates = Array.from({ length: 7 }, (_, index) =>
        localDateOf(
          new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + index),
        ),
      );
      if (weekDates[0] > today) {
        weeks.push('future');
      } else {
        const decades = weekDates.reduce(
          (total, date) => total + (decadesByDate.get(date) ?? 0),
          0,
        );
        const allPaused = weekDates.every((date) => date > today || isPaused(date));
        weeks.push(decades >= 15 ? 'faithful' : allPaused ? 'paused' : 'empty');
      }
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
    }
    return {
      year,
      month,
      days: [],
      weeks,
      done: weeks.filter((week) => week === 'faithful').length,
      total: weeks.length,
      unit: 'weeks',
    };
  }

  const target = dailyTargets[rule] ?? 1;
  const days: DayFidelity[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = dateString(year, month, day);
    if (date > today) {
      days.push('future');
    } else if ((decadesByDate.get(date) ?? 0) >= target) {
      days.push('faithful');
    } else if (isPaused(date)) {
      days.push('paused');
    } else {
      days.push('empty');
    }
  }
  return {
    year,
    month,
    days,
    weeks: [],
    done: days.filter((day) => day === 'faithful').length,
    total: daysInMonth,
    unit: 'days',
  };
}
