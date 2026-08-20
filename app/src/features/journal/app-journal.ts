import { openDatabaseSync } from 'expo-sqlite';

import { openJournal, type Journal, type SqlDb } from './db';

function sqliteDb(): SqlDb {
  const db = openDatabaseSync('journal.db');
  return {
    exec: (sql) => db.execSync(sql),
    run: (sql, params) => {
      db.runSync(sql, [...params]);
    },
    all: (sql, params = []) => db.getAllSync(sql, [...params]),
  };
}

/** The one journal the app writes. Local, always: what someone prays never leaves. */
export const appJournal: Journal = openJournal(sqliteDb());
