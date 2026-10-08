import type { Locale } from '@sanctamaria/content';
import type { MysterySet } from '@sanctamaria/rosary';

import type { SqlDatabase } from './sql';

export type PrayerKind = 'rosary' | 'decade';

/** One Rosary or one decade prayed, as the journal keeps it. */
export type JournalEntry = {
  id: string;
  kind: PrayerKind;
  mysterySet: MysterySet;
  locale: Locale;
  prayedOn: string;
  startedAt: string;
  completedAt: string | null;
  decades: number;
  durationSeconds: number;
  readings: Record<string, string> | null;
  clientUpdatedAt: string;
  deletedAt: string | null;
};

type Row = {
  id: string;
  kind: PrayerKind;
  mystery_set: MysterySet;
  locale: Locale;
  prayed_on: string;
  started_at: string;
  completed_at: string | null;
  decades: number;
  duration_seconds: number;
  readings: string | null;
  client_updated_at: string;
  deleted_at: string | null;
};

const migrations: string[] = [
  `CREATE TABLE prayers (
    id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL,
    mystery_set TEXT NOT NULL,
    locale TEXT NOT NULL,
    prayed_on TEXT NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    decades INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    readings TEXT,
    client_updated_at TEXT NOT NULL,
    deleted_at TEXT,
    dirty INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX prayers_prayed_on ON prayers (prayed_on);
  CREATE INDEX prayers_dirty ON prayers (dirty);`,
];

function toEntry(row: Row): JournalEntry {
  return {
    id: row.id,
    kind: row.kind,
    mysterySet: row.mystery_set,
    locale: row.locale,
    prayedOn: row.prayed_on,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    decades: row.decades,
    durationSeconds: row.duration_seconds,
    readings: row.readings === null ? null : (JSON.parse(row.readings) as Record<string, string>),
    clientUpdatedAt: row.client_updated_at,
    deletedAt: row.deleted_at,
  };
}

function params(entry: JournalEntry): (string | number | null)[] {
  return [
    entry.id,
    entry.kind,
    entry.mysterySet,
    entry.locale,
    entry.prayedOn,
    entry.startedAt,
    entry.completedAt,
    entry.decades,
    entry.durationSeconds,
    entry.readings === null ? null : JSON.stringify(entry.readings),
    entry.clientUpdatedAt,
    entry.deletedAt,
  ];
}

const upsert = `INSERT INTO prayers
  (id, kind, mystery_set, locale, prayed_on, started_at, completed_at, decades,
   duration_seconds, readings, client_updated_at, deleted_at, dirty)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    kind = excluded.kind, mystery_set = excluded.mystery_set, locale = excluded.locale,
    prayed_on = excluded.prayed_on, started_at = excluded.started_at,
    completed_at = excluded.completed_at, decades = excluded.decades,
    duration_seconds = excluded.duration_seconds, readings = excluded.readings,
    client_updated_at = excluded.client_updated_at, deleted_at = excluded.deleted_at,
    dirty = excluded.dirty`;

export type DaySummary = { prayedOn: string; decades: number; sets: MysterySet[] };

/** The record of what was prayed. It lives only on this device; nothing leaves it. */
export class Journal {
  constructor(
    private readonly db: SqlDatabase,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async migrate(): Promise<void> {
    const row = await this.db.getFirstAsync<{ user_version: number }>('PRAGMA user_version', []);
    const version = row?.user_version ?? 0;
    for (let index = version; index < migrations.length; index++) {
      const migration = migrations[index];
      if (migration === undefined) {
        continue;
      }
      await this.db.withTransactionAsync(async () => {
        await this.db.execAsync(migration);
        await this.db.execAsync(`PRAGMA user_version = ${index + 1}`);
      });
    }
  }

  async save(entry: Omit<JournalEntry, 'clientUpdatedAt' | 'deletedAt'>): Promise<JournalEntry> {
    const saved: JournalEntry = {
      ...entry,
      clientUpdatedAt: this.now().toISOString(),
      deletedAt: null,
    };
    await this.db.runAsync(upsert, [...params(saved), 1]);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const stamp = this.now().toISOString();
    await this.db.runAsync(
      'UPDATE prayers SET deleted_at = ?, client_updated_at = ?, dirty = 1 WHERE id = ?',
      [stamp, stamp, id],
    );
  }

  async find(id: string): Promise<JournalEntry | null> {
    const row = await this.db.getFirstAsync<Row>('SELECT * FROM prayers WHERE id = ?', [id]);
    return row === null ? null : toEntry(row);
  }

  /** Entries prayed between two local dates, inclusive, newest first. */
  async between(from: string, to: string): Promise<JournalEntry[]> {
    const rows = await this.db.getAllAsync<Row>(
      `SELECT * FROM prayers WHERE deleted_at IS NULL AND prayed_on BETWEEN ? AND ?
       ORDER BY started_at DESC`,
      [from, to],
    );
    return rows.map(toEntry);
  }

  async days(from: string, to: string): Promise<DaySummary[]> {
    const entries = await this.between(from, to);
    const byDay = new Map<string, DaySummary>();
    for (const entry of entries) {
      const day = byDay.get(entry.prayedOn) ?? { prayedOn: entry.prayedOn, decades: 0, sets: [] };
      day.decades += entry.decades;
      if (!day.sets.includes(entry.mysterySet)) {
        day.sets.push(entry.mysterySet);
      }
      byDay.set(entry.prayedOn, day);
    }
    return [...byDay.values()].sort((a, b) => a.prayedOn.localeCompare(b.prayedOn));
  }

  async totals(): Promise<{ rosaries: number; decades: number; days: number }> {
    const row = await this.db.getFirstAsync<{ rosaries: number; decades: number; days: number }>(
      `SELECT
         COALESCE(SUM(CASE WHEN decades = 5 THEN 1 ELSE 0 END), 0) AS rosaries,
         COALESCE(SUM(decades), 0) AS decades,
         COUNT(DISTINCT prayed_on) AS days
       FROM prayers WHERE deleted_at IS NULL AND decades > 0`,
      [],
    );
    return row ?? { rosaries: 0, decades: 0, days: 0 };
  }

  /** How many times each mystery has had a reading, to rotate the Gospels. */
  async readingCounts(): Promise<Record<string, number>> {
    const rows = await this.db.getAllAsync<{ readings: string }>(
      'SELECT readings FROM prayers WHERE deleted_at IS NULL AND readings IS NOT NULL',
      [],
    );
    const counts: Record<string, number> = {};
    for (const row of rows) {
      for (const mystery of Object.keys(JSON.parse(row.readings) as Record<string, string>)) {
        counts[mystery] = (counts[mystery] ?? 0) + 1;
      }
    }
    return counts;
  }

}
