import { localDateOf } from '@/features/rosary/session-store';

import type { Journal } from './db';

/**
 * The Rule: what each person commits to, chosen by them, lowered or removed whenever
 * they want, and never raised by the app (docs/gamificacion.md, 1). Acts are counted -
 * decades and days - never graces.
 */
export type RuleId =
  | 'none'
  | 'daily-decade'
  | 'daily-rosary'
  | 'weekly-fifteen'
  | 'full-rosary';

export type RuleProgress = {
  readonly decades: number;
  readonly target: number;
  readonly period: 'day' | 'week';
};

const targets: Record<Exclude<RuleId, 'none'>, { target: number; period: 'day' | 'week' }> =
  {
    'daily-decade': { target: 1, period: 'day' },
    'daily-rosary': { target: 5, period: 'day' },
    'weekly-fifteen': { target: 15, period: 'week' },
    'full-rosary': { target: 20, period: 'day' },
  };

/** Monday of the week of a date, as a local date string. The Confraternity week. */
function mondayOf(now: Date): Date {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const offset = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - offset);
  return monday;
}

function sundayOf(now: Date): Date {
  const sunday = mondayOf(now);
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
}

export function ruleProgress(
  rule: RuleId,
  journal: Journal,
  now: Date,
): RuleProgress | undefined {
  if (rule === 'none') {
    return undefined;
  }
  const { target, period } = targets[rule];
  const from = period === 'day' ? localDateOf(now) : localDateOf(mondayOf(now));
  const to = period === 'day' ? localDateOf(now) : localDateOf(sundayOf(now));
  const decades = journal
    .between(from, to)
    .reduce((total, entry) => total + entry.decades, 0);
  return { decades, target, period };
}
