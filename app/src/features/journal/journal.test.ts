import { DatabaseSync } from 'node:sqlite';

import { describe, expect, it } from 'vitest';

import { migrateJournal, openJournal, type SqlDb } from './db';
import { ruleProgress } from './rule';

function testDb(): SqlDb {
  const db = new DatabaseSync(':memory:');
  return {
    exec: (sql) => db.exec(sql),
    run: (sql, params) => {
      db.prepare(sql).run(...params);
    },
    all: (sql, params = []) => db.prepare(sql).all(...params) as never,
  };
}

const entry = (localDate: string, decades: number, startedAt = `${localDate}T20:00:00`) => ({
  startedAt,
  finishedAt: `${localDate}T20:25:00`,
  decades,
  localDate,
});

describe('journal', () => {
  it('records what was prayed and reads it back', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 5));
    expect(journal.all()).toEqual([entry('2026-08-03', 5)]);
  });

  it('keeps one act when the same session is recorded twice', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 5));
    journal.add(entry('2026-08-03', 5));
    expect(journal.all()).toHaveLength(1);
  });

  it('migrates an empty database and is idempotent', () => {
    const db = testDb();
    migrateJournal(db);
    migrateJournal(db);
    const version = db.all<{ version: number }>('select version from journal_version');
    expect(version[0].version).toBeGreaterThanOrEqual(1);
  });
});

describe('ruleProgress', () => {
  it('has nothing to say without a rule', () => {
    const journal = openJournal(testDb());
    expect(ruleProgress('none', journal, new Date(2026, 7, 5))).toBeUndefined();
  });

  it('counts the decades of the day for a daily rule', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-05', 5));
    journal.add(entry('2026-08-04', 5, '2026-08-04T20:00:00'));
    expect(ruleProgress('daily-rosary', journal, new Date(2026, 7, 5))).toEqual({
      decades: 5,
      target: 5,
      period: 'day',
    });
  });

  it('counts decades across the Confraternity week, prayed on loose days', () => {
    const journal = openJournal(testDb());
    // Week of Monday 2026-08-03 to Sunday 2026-08-09.
    journal.add(entry('2026-08-03', 5));
    journal.add(entry('2026-08-06', 5, '2026-08-06T07:00:00'));
    journal.add(entry('2026-08-09', 5, '2026-08-09T22:00:00'));
    // The previous Sunday stays out.
    journal.add(entry('2026-08-02', 5, '2026-08-02T20:00:00'));
    expect(ruleProgress('weekly-fifteen', journal, new Date(2026, 7, 9))).toEqual({
      decades: 15,
      target: 15,
      period: 'week',
    });
  });

  it('changing the rule mid-week only changes the frame, never the acts', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-04', 5));
    const asWeekly = ruleProgress('weekly-fifteen', journal, new Date(2026, 7, 5));
    const asDaily = ruleProgress('daily-decade', journal, new Date(2026, 7, 5));
    expect(asWeekly?.decades).toBe(5);
    // The day itself has no entries: the daily frame shows zero, nothing is lost.
    expect(asDaily?.decades).toBe(0);
    expect(journal.all()).toHaveLength(1);
  });
});
