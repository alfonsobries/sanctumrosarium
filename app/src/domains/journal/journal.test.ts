import { beforeEach, describe, expect, it } from 'vitest';

import { Journal, type JournalEntry } from './journal';
import { memoryDatabase } from './node-sql';

let clock = new Date('2026-10-06T22:00:00Z');
let journal: Journal;

const entry = (
  overrides: Partial<JournalEntry> = {},
): Omit<JournalEntry, 'clientUpdatedAt' | 'deletedAt'> => ({
  id: 'a',
  kind: 'rosary',
  mysterySet: 'sorrowful',
  locale: 'es-MX',
  prayedOn: '2026-10-06',
  startedAt: '2026-10-07T04:30:00.000Z',
  completedAt: '2026-10-07T04:52:00.000Z',
  decades: 5,
  durationSeconds: 1320,
  readings: { 'agony-in-the-garden': 'Lk 22:39-46' },
  ...overrides,
});

beforeEach(async () => {
  clock = new Date('2026-10-06T22:00:00Z');
  journal = new Journal(memoryDatabase(), () => clock);
  await journal.migrate();
});

describe('Journal', () => {
  it('migrates idempotently', async () => {
    await journal.migrate();
    await journal.save(entry());
    expect(await journal.find('a')).toMatchObject({ decades: 5 });
  });

  it('summarises days by local date, not by UTC', async () => {
    await journal.save(entry());
    await journal.save(entry({ id: 'b', decades: 1, mysterySet: 'joyful' }));

    expect(await journal.days('2026-10-01', '2026-10-31')).toEqual([
      { prayedOn: '2026-10-06', decades: 6, sets: expect.arrayContaining(['sorrowful', 'joyful']) },
    ]);
  });

  it('counts rosaries, decades and days', async () => {
    await journal.save(entry());
    await journal.save(entry({ id: 'b', decades: 2, prayedOn: '2026-10-07' }));
    await journal.save(entry({ id: 'c', decades: 0, prayedOn: '2026-10-08' }));

    expect(await journal.totals()).toEqual({ rosaries: 1, decades: 7, days: 2 });
  });

  it('keeps deletions as dirty tombstones until synced', async () => {
    await journal.save(entry());
    await journal.markSynced(await journal.dirty());
    clock = new Date('2026-10-07T10:00:00Z');
    await journal.remove('a');

    expect(await journal.between('2026-10-01', '2026-10-31')).toHaveLength(0);
    expect(await journal.dirty()).toMatchObject([{ id: 'a', deletedAt: '2026-10-07T10:00:00.000Z' }]);
  });

  it('does not lose an edit made while a push was in flight', async () => {
    await journal.save(entry());
    const pushed = await journal.dirty();
    clock = new Date('2026-10-06T22:05:00Z');
    await journal.save(entry({ decades: 3 }));
    await journal.markSynced(pushed);

    expect(await journal.dirty()).toHaveLength(1);
  });

  it('applies newer remote entries and ignores stale ones', async () => {
    await journal.save(entry({ decades: 4 }));
    const local = await journal.find('a');

    await journal.applyRemote([{ ...local!, decades: 1, clientUpdatedAt: '2026-10-01T00:00:00.000Z' }]);
    expect((await journal.find('a'))?.decades).toBe(4);

    await journal.applyRemote([{ ...local!, decades: 5, clientUpdatedAt: '2026-10-09T00:00:00.000Z' }]);
    expect((await journal.find('a'))?.decades).toBe(5);
    expect(await journal.dirty()).toHaveLength(0);
  });

  it('counts readings per mystery for the Gospel rotation', async () => {
    await journal.save(entry());
    await journal.save(entry({ id: 'b' }));

    expect(await journal.readingCounts()).toEqual({ 'agony-in-the-garden': 2 });
  });
});
