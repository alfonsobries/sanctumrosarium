/**
 * The journal: what was prayed, when, by whom it was offered. Local by decision 14 -
 * it never leaves the device. Real tables (not the kv store) because the diary is the
 * one dataset that must survive every future migration.
 */
export interface SqlDb {
  exec(sql: string): void;
  run(sql: string, params: readonly (string | number)[]): void;
  all<T>(sql: string, params?: readonly (string | number)[]): T[];
}

export type PrayedEntry = {
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly decades: number;
  /** The local calendar day of the person praying: an 11pm Rosary belongs to that day. */
  readonly localDate: string;
};

/**
 * One statement list per version, applied in order. The journal of someone's prayer
 * never breaks because a table changed: data written by version N always has a path to
 * N+1.
 */
const migrations: readonly (readonly string[])[] = [
  [
    `create table prayed (
      id integer primary key autoincrement,
      started_at text not null unique,
      finished_at text not null,
      decades integer not null,
      local_date text not null
    )`,
    `create index prayed_local_date on prayed (local_date)`,
  ],
];

export function migrateJournal(db: SqlDb): void {
  db.exec('create table if not exists journal_version (version integer not null)');
  const rows = db.all<{ version: number }>('select version from journal_version');
  let version = rows[0]?.version ?? 0;
  while (version < migrations.length) {
    for (const statement of migrations[version]) {
      db.exec(statement);
    }
    version += 1;
  }
  db.exec('delete from journal_version');
  db.run('insert into journal_version (version) values (?)', [version]);
}

export type Journal = {
  readonly add: (entry: PrayedEntry) => void;
  readonly between: (fromDate: string, toDate: string) => readonly PrayedEntry[];
  readonly all: () => readonly PrayedEntry[];
};

export function openJournal(db: SqlDb): Journal {
  migrateJournal(db);
  const rowToEntry = (row: {
    started_at: string;
    finished_at: string;
    decades: number;
    local_date: string;
  }): PrayedEntry => ({
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    decades: row.decades,
    localDate: row.local_date,
  });
  return {
    add: (entry) => {
      // The same session recorded twice (a re-render, a resumed finish) stays one act.
      db.run(
        'insert or ignore into prayed (started_at, finished_at, decades, local_date) values (?, ?, ?, ?)',
        [entry.startedAt, entry.finishedAt, entry.decades, entry.localDate],
      );
    },
    between: (fromDate, toDate) =>
      db
        .all<{
          started_at: string;
          finished_at: string;
          decades: number;
          local_date: string;
        }>(
          'select started_at, finished_at, decades, local_date from prayed where local_date >= ? and local_date <= ? order by local_date',
          [fromDate, toDate],
        )
        .map(rowToEntry),
    all: () =>
      db
        .all<{
          started_at: string;
          finished_at: string;
          decades: number;
          local_date: string;
        }>(
          'select started_at, finished_at, decades, local_date from prayed order by local_date',
        )
        .map(rowToEntry),
  };
}
