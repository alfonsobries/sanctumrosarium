import { DatabaseSync } from 'node:sqlite';

import { describe, expect, it } from 'vitest';

import { migrateJournal, openJournal, type SqlDb } from './db';
import { monthFidelity } from './fidelity';
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

const entry = (
  localDate: string,
  decades: number,
  startedAt = `${localDate}T20:00:00`,
) => ({
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
    expect(version[0].version).toBeGreaterThanOrEqual(2);
  });

  it('migrates a version 1 journal without losing what was prayed', () => {
    const db = testDb();
    // Recreate the version 1 schema by hand, with one entry.
    db.exec(`create table prayed (
      id integer primary key autoincrement,
      started_at text not null unique,
      finished_at text not null,
      decades integer not null,
      local_date text not null
    )`);
    db.exec('create index prayed_local_date on prayed (local_date)');
    db.exec('create table journal_version (version integer not null)');
    db.run('insert into journal_version (version) values (?)', [1]);
    db.run(
      'insert into prayed (started_at, finished_at, decades, local_date) values (?, ?, ?, ?)',
      ['2026-08-03T20:00:00', '2026-08-03T20:25:00', 5, '2026-08-03'],
    );
    const journal = openJournal(db);
    expect(journal.all()).toHaveLength(1);
    expect(journal.pauseActive()).toBe(false);
  });

  it('keeps the intention with the act, and counts times without answers', () => {
    const journal = openJournal(testDb());
    journal.add({ ...entry('2026-08-03', 5), intention: 'tu madre' });
    journal.add({
      ...entry('2026-08-04', 5, '2026-08-04T20:00:00'),
      intention: 'tu madre',
    });
    journal.add(entry('2026-08-05', 5, '2026-08-05T20:00:00'));
    expect(journal.intentionHistory()).toEqual([{ intention: 'tu madre', times: 2 }]);
    expect(journal.all()[0].intention).toBe('tu madre');
  });

  it('saved intentions reuse and delete without touching the journal', () => {
    const journal = openJournal(testDb());
    journal.add({ ...entry('2026-08-03', 5), intention: 'los difuntos' });
    journal.saveIntention('los difuntos');
    journal.saveIntention('los difuntos');
    expect(journal.savedIntentions()).toEqual(['los difuntos']);
    journal.deleteIntention('los difuntos');
    expect(journal.savedIntentions()).toEqual([]);
    expect(journal.intentionHistory()).toEqual([{ intention: 'los difuntos', times: 1 }]);
  });

  it('pauses leave no gap and end without questions', () => {
    const journal = openJournal(testDb());
    expect(journal.pauseActive()).toBe(false);
    journal.startPause('2026-08-05');
    expect(journal.pauseActive()).toBe(true);
    expect(journal.isPaused('2026-08-06')).toBe(true);
    expect(journal.isPaused('2026-08-04')).toBe(false);
    journal.endPause('2026-08-08');
    expect(journal.pauseActive()).toBe(false);
    expect(journal.isPaused('2026-08-07')).toBe(true);
    expect(journal.isPaused('2026-08-09')).toBe(false);
  });
});

describe('litany as its own act', () => {
  it('never adds up as a Rosary', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 5));
    journal.add({
      ...entry('2026-08-03', 0, '2026-08-03T21:00:00'),
      kind: 'litany',
    });
    // The Rosary views only see rosaries.
    expect(journal.all()).toHaveLength(1);
    expect(journal.between('2026-08-01', '2026-08-31')).toHaveLength(1);
    const progress = ruleProgress('daily-rosary', journal, new Date(2026, 7, 3, 22));
    expect(progress?.decades).toBe(5);
  });
});

describe('monthFidelity', () => {
  const now = new Date(2026, 7, 10, 22, 0);

  it('marks faithful days for a daily rule and leaves plain gaps', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 5));
    journal.add(entry('2026-08-05', 5, '2026-08-05T07:00:00'));
    journal.add(entry('2026-08-05', 5, '2026-08-05T22:00:00'));
    const month = monthFidelity('daily-rosary', journal, () => false, now);
    expect(month?.unit).toBe('days');
    expect(month?.days[2]).toBe('faithful');
    expect(month?.days[3]).toBe('empty');
    expect(month?.days[4]).toBe('faithful');
    expect(month?.days[10]).toBe('future');
    expect(month?.done).toBe(2);
    expect(month?.total).toBe(31);
  });

  it('a day with less than the rule stays a gap, never a partial credit', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 1));
    const month = monthFidelity('daily-rosary', journal, () => false, now);
    expect(month?.days[2]).toBe('empty');
  });

  it('paused days show as paused, not as gaps', () => {
    const journal = openJournal(testDb());
    const month = monthFidelity(
      'daily-decade',
      journal,
      (date) => date === '2026-08-04',
      now,
    );
    expect(month?.days[3]).toBe('paused');
    expect(month?.days[4]).toBe('empty');
  });

  it('shows the weekly rule by weeks, following the unit of the Rule', () => {
    const journal = openJournal(testDb());
    journal.add(entry('2026-08-03', 5));
    journal.add(entry('2026-08-05', 5, '2026-08-05T07:00:00'));
    journal.add(entry('2026-08-08', 5, '2026-08-08T07:00:00'));
    const month = monthFidelity('weekly-fifteen', journal, () => false, now);
    expect(month?.unit).toBe('weeks');
    // Week of Aug 3-9 reaches fifteen decades on loose days.
    expect(month?.weeks[1]).toBe('faithful');
    expect(month?.done).toBe(1);
  });

  it('says nothing without a rule', () => {
    const journal = openJournal(testDb());
    expect(monthFidelity('none', journal, () => false, now)).toBeUndefined();
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

describe('the Way in the journal', () => {
  it('counts rosaries prayed a given way', () => {
    const journal = openJournal(testDb());
    journal.add({ ...entry('2026-08-03', 5), ways: ['structure', 'latin'] });
    journal.add({ ...entry('2026-08-04', 5), ways: ['structure'] });
    expect(journal.wayCount('structure')).toBe(2);
    expect(journal.wayCount('latin')).toBe(1);
    expect(journal.wayCount('clauses')).toBe(0);
  });

  it('a litany never walks the Way of the Rosary', () => {
    const journal = openJournal(testDb());
    journal.add({ ...entry('2026-08-03', 0), kind: 'litany', ways: ['structure'] });
    expect(journal.wayCount('structure')).toBe(0);
  });

  it('counts a day with all four sets of mysteries as one act', () => {
    const journal = openJournal(testDb());
    const sets = ['gozosa', 'luminosa', 'dolorosa', 'gloriosa'];
    sets.forEach((set, hour) => {
      journal.add({
        ...entry('2026-08-03', 5, `2026-08-03T1${hour}:00:00`),
        ways: ['structure'],
        mysterySet: set,
      });
    });
    // Four Rosaries of the same set are twenty decades, not the twenty mysteries.
    for (let hour = 0; hour < 4; hour += 1) {
      journal.add({
        ...entry('2026-08-04', 5, `2026-08-04T1${hour}:00:00`),
        ways: ['structure'],
        mysterySet: 'gozosa',
      });
    }
    expect(journal.twentyCount()).toBe(1);
  });

  it('a mark of today can be taken back', () => {
    const journal = openJournal(testDb());
    journal.markWay('sung', '2026-08-03');
    journal.unmarkWay('sung', '2026-08-03');
    expect(journal.markCount('sung')).toBe(0);
    expect(journal.markedWay('sung', '2026-08-03')).toBe(false);
  });

  it('a self-marked way counts once per day and never on its own', () => {
    const journal = openJournal(testDb());
    expect(journal.markCount('sung')).toBe(0);
    journal.markWay('sung', '2026-08-03');
    journal.markWay('sung', '2026-08-03');
    journal.markWay('sung', '2026-08-04');
    expect(journal.markCount('sung')).toBe(2);
    expect(journal.markCount('family')).toBe(0);
  });
});

describe('the 54-day novena in the journal', () => {
  it('walks box by box and a gap never resets it', () => {
    const journal = openJournal(testDb());
    expect(journal.activeNovena()).toBeUndefined();
    journal.startNovena('2026-08-01');
    const run = journal.activeNovena();
    expect(run).toBeDefined();
    journal.markNovenaDay(run!.id, 1, '2026-08-01');
    // Days pass without praying; the next mark simply fills the next box.
    journal.markNovenaDay(run!.id, 2, '2026-08-05');
    expect(journal.novenaDaysDone(run!.id)).toBe(2);
  });

  it('a mark can be taken back and a run can be left without drama', () => {
    const journal = openJournal(testDb());
    journal.startNovena('2026-08-01');
    const run = journal.activeNovena()!;
    journal.markNovenaDay(run.id, 1, '2026-08-01');
    journal.unmarkNovenaDay(run.id, 1);
    expect(journal.novenaDaysDone(run.id)).toBe(0);
    journal.endNovena(run.id, '2026-08-02');
    expect(journal.activeNovena()).toBeUndefined();
  });

  it('marking the same box twice keeps one', () => {
    const journal = openJournal(testDb());
    journal.startNovena('2026-08-01');
    const run = journal.activeNovena()!;
    journal.markNovenaDay(run.id, 3, '2026-08-03');
    journal.markNovenaDay(run.id, 3, '2026-08-04');
    expect(journal.novenaDaysDone(run.id)).toBe(1);
  });
});

describe('novena marks count days, not taps', () => {
  it('accepts one box per local day', () => {
    const journal = openJournal(testDb());
    journal.startNovena('2026-08-01');
    const run = journal.activeNovena()!;
    journal.markNovenaDay(run.id, 1, '2026-08-01');
    journal.markNovenaDay(run.id, 2, '2026-08-01');
    expect(journal.novenaDaysDone(run.id)).toBe(1);
    expect(journal.novenaMarkedOn(run.id, '2026-08-01')).toBe(true);
    journal.markNovenaDay(run.id, 2, '2026-08-02');
    expect(journal.novenaDaysDone(run.id)).toBe(2);
  });

  it('a left run stays history and can be picked up again', () => {
    const journal = openJournal(testDb());
    journal.startNovena('2026-08-01');
    const run = journal.activeNovena()!;
    journal.markNovenaDay(run.id, 1, '2026-08-01');
    journal.endNovena(run.id, '2026-08-02');
    const past = journal.lastEndedNovena();
    expect(past?.daysDone).toBe(1);
    journal.reopenNovena(past!.id);
    expect(journal.activeNovena()?.id).toBe(past!.id);
  });
});
