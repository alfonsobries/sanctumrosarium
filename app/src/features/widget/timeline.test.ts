import { describe, expect, it } from 'vitest';

import type { PrayedEntry } from '@/features/journal/db';

import { mysteryWidgetTimeline, WIDGET_DAYS_AHEAD, widgetTodayNote } from './timeline';

const setName = (set: string): string => set;

function entry(overrides: Partial<PrayedEntry> = {}): PrayedEntry {
  return {
    startedAt: '2026-12-25T08:00:00',
    finishedAt: '2026-12-25T08:20:00',
    decades: 5,
    localDate: '2026-12-25',
    ...overrides,
  };
}

describe('mysteryWidgetTimeline', () => {
  it('schedules one entry per local day, today first', () => {
    const now = new Date(2026, 7, 20, 15, 30, 0);
    const entries = mysteryWidgetTimeline({
      now,
      language: 'es',
      setName,
    });
    expect(entries).toHaveLength(WIDGET_DAYS_AHEAD);
    expect(entries[0]?.date).toEqual(now);
    expect(entries[1]?.date).toEqual(new Date(2026, 7, 21, 0, 0, 0));
  });

  it('uses the same calendar as the prayer, including liturgical exceptions', () => {
    const now = new Date(2026, 11, 24, 20, 0, 0);
    const entries = mysteryWidgetTimeline({
      now,
      language: 'es',
      setName,
    });
    expect(entries[0]?.props.setName).toBe('luminosa');
    expect(entries[1]?.props.setName).toBe('gaudiosa');
    expect(entries[1]?.props.titles).toContain('La Encarnación del Hijo de Dios');
  });

  it('freezes titles in the prayer language, including Latin', () => {
    const now = new Date(2026, 7, 20, 9, 0, 0);
    const [today] = mysteryWidgetTimeline({
      now,
      language: 'la',
      setName,
    });
    expect(today?.props.setName).toBe('luminosa');
    expect(today?.props.titles[0]).toBe('Baptismus in Iordane');
  });

  it('puts the prayed-today note only on the current day', () => {
    const now = new Date(2026, 7, 20, 9, 0, 0);
    const entries = mysteryWidgetTimeline({
      now,
      language: 'es',
      setName,
      todayNote: 'Hoy ya rezaste.',
    });
    expect(entries[0]?.props.note).toBe('Hoy ya rezaste.');
    expect(entries[1]?.props.note).toBe('');
  });

  it('never carries a count or a streak', () => {
    const [today] = mysteryWidgetTimeline({
      now: new Date(2026, 7, 20, 9, 0, 0),
      language: 'es',
      setName,
      todayNote: 'Hoy ya rezaste.',
    });
    expect(JSON.stringify(today?.props)).not.toMatch(/\d/);
  });
});

describe('widgetTodayNote', () => {
  it('stays silent when there is no Rule', () => {
    expect(
      widgetTodayNote(
        'none',
        { between: () => [entry()] },
        new Date(2026, 11, 25),
        'Hoy ya rezaste.',
      ),
    ).toBeUndefined();
  });

  it('stays silent when today has not been prayed', () => {
    expect(
      widgetTodayNote(
        'daily-rosary',
        { between: () => [] },
        new Date(2026, 11, 25),
        'Hoy ya rezaste.',
      ),
    ).toBeUndefined();
  });

  it('stays silent when today only has a litany', () => {
    expect(
      widgetTodayNote(
        'daily-rosary',
        { between: () => [entry({ kind: 'litany', decades: 0 })] },
        new Date(2026, 11, 25),
        'Hoy ya rezaste.',
      ),
    ).toBeUndefined();
  });

  it('names the fact when a Rule is on and a Rosary was counted today', () => {
    expect(
      widgetTodayNote(
        'daily-decade',
        { between: () => [entry({ decades: 1 })] },
        new Date(2026, 11, 25),
        'Hoy ya rezaste.',
      ),
    ).toBe('Hoy ya rezaste.');
  });
});
