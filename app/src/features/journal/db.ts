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
  /** Who this Rosary was offered for. The most intimate thing the app stores: local only. */
  readonly intention?: string;
  /** A litany is its own act of worship (DPPL 203), never added up as a Rosary. */
  readonly kind?: 'rosary' | 'litany';
  /** How it was prayed, for the Way. Acts, never graces. */
  readonly ways?: readonly string[];
  /** Which set of mysteries was prayed, for the twenty-mysteries stage. */
  readonly mysterySet?: string;
};

export type IntentionCount = {
  readonly intention: string;
  readonly times: number;
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
  [
    `create table pauses (
      id integer primary key autoincrement,
      started_date text not null,
      ended_date text
    )`,
  ],
  [
    `alter table prayed add column intention text`,
    `create table intentions (
      id integer primary key autoincrement,
      text text not null unique
    )`,
  ],
  [`alter table prayed add column kind text not null default 'rosary'`],
  [
    // Comma-delimited ways this session was prayed (',structure,latin,'), for the Way.
    `alter table prayed add column ways text not null default ''`,
    `create table camino_marks (
      id integer primary key autoincrement,
      stage text not null,
      local_date text not null,
      unique (stage, local_date)
    )`,
  ],
  [`alter table prayed add column mystery_set text`],
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
  /** Pause mode: illness, travel, grief. Paused days leave no gap. */
  readonly startPause: (localDate: string) => void;
  readonly endPause: (localDate: string) => void;
  readonly pauseActive: () => boolean;
  readonly isPaused: (localDate: string) => boolean;
  /** The local date of the first thing ever recorded, for the history view. */
  readonly firstDate: () => string | undefined;
  /** Saved intentions for quick reuse. Deleting one never touches the journal. */
  readonly saveIntention: (text: string) => void;
  readonly savedIntentions: () => readonly string[];
  readonly deleteIntention: (text: string) => void;
  /** For whom this person has prayed, and how many times. Never whether it was answered. */
  readonly intentionHistory: () => readonly IntentionCount[];
  /** Rosaries prayed a given way. Counts acts (gamificacion.md): use walks the Way. */
  readonly wayCount: (way: string) => number;
  /** Days that prayed all four sets of mysteries. Each such day is one act. */
  readonly twentyCount: () => number;
  /** The person says they prayed a non-detectable way today (singing, family). */
  readonly markWay: (stage: string, localDate: string) => void;
  /** A wrong mark weighs on a scrupulous conscience: today's can always be taken back. */
  readonly unmarkWay: (stage: string, localDate: string) => void;
  readonly markedWay: (stage: string, localDate: string) => boolean;
  readonly markCount: (stage: string) => number;
};

export function openJournal(db: SqlDb): Journal {
  migrateJournal(db);
  const rowToEntry = (row: {
    started_at: string;
    finished_at: string;
    decades: number;
    local_date: string;
    intention?: string | null;
  }): PrayedEntry => ({
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    decades: row.decades,
    localDate: row.local_date,
    ...(row.intention == null ? {} : { intention: row.intention }),
  });
  return {
    add: (entry) => {
      // The same session recorded twice (a re-render, a resumed finish) stays one act.
      db.run(
        'insert or ignore into prayed (started_at, finished_at, decades, local_date, intention, kind, ways, mystery_set) values (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          entry.startedAt,
          entry.finishedAt,
          entry.decades,
          entry.localDate,
          entry.intention ?? null,
          entry.kind ?? 'rosary',
          entry.ways === undefined || entry.ways.length === 0
            ? ''
            : `,${entry.ways.join(',')},`,
          entry.mysterySet ?? null,
        ] as (string | number)[],
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
          "select started_at, finished_at, decades, local_date, intention from prayed where kind = 'rosary' and local_date >= ? and local_date <= ? order by local_date",
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
          "select started_at, finished_at, decades, local_date, intention from prayed where kind = 'rosary' order by local_date",
        )
        .map(rowToEntry),
    startPause: (localDate) => {
      const open = db.all<{ id: number }>(
        'select id from pauses where ended_date is null',
      );
      if (open.length === 0) {
        db.run('insert into pauses (started_date) values (?)', [localDate]);
      }
    },
    endPause: (localDate) => {
      db.run('update pauses set ended_date = ? where ended_date is null', [localDate]);
    },
    pauseActive: () =>
      db.all<{ id: number }>('select id from pauses where ended_date is null').length > 0,
    isPaused: (localDate) =>
      db.all<{ id: number }>(
        'select id from pauses where started_date <= ? and (ended_date is null or ended_date >= ?)',
        [localDate, localDate],
      ).length > 0,
    firstDate: () =>
      db.all<{ local_date: string }>(
        'select local_date from prayed order by local_date limit 1',
      )[0]?.local_date,
    saveIntention: (text) => {
      db.run('insert or ignore into intentions (text) values (?)', [text]);
    },
    savedIntentions: () =>
      db
        .all<{ text: string }>('select text from intentions order by id desc')
        .map((row) => row.text),
    deleteIntention: (text) => {
      db.run('delete from intentions where text = ?', [text]);
    },
    intentionHistory: () =>
      db.all<{ intention: string; times: number }>(
        'select intention, count(*) as times from prayed where intention is not null group by intention order by times desc, intention',
      ),
    wayCount: (way) =>
      db.all<{ times: number }>(
        "select count(*) as times from prayed where kind = 'rosary' and ways like ?",
        [`%,${way},%`],
      )[0]?.times ?? 0,
    twentyCount: () =>
      db.all<{ times: number }>(
        "select count(*) as times from (select local_date from prayed where kind = 'rosary' and mystery_set is not null group by local_date having count(distinct mystery_set) >= 4)",
      )[0]?.times ?? 0,
    markWay: (stage, localDate) => {
      db.run('insert or ignore into camino_marks (stage, local_date) values (?, ?)', [
        stage,
        localDate,
      ]);
    },
    unmarkWay: (stage, localDate) => {
      db.run('delete from camino_marks where stage = ? and local_date = ?', [
        stage,
        localDate,
      ]);
    },
    markedWay: (stage, localDate) =>
      db.all<{ id: number }>(
        'select id from camino_marks where stage = ? and local_date = ?',
        [stage, localDate],
      ).length > 0,
    markCount: (stage) =>
      db.all<{ times: number }>(
        'select count(*) as times from camino_marks where stage = ?',
        [stage],
      )[0]?.times ?? 0,
  };
}
