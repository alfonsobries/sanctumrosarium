import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { Journal } from './journal';
import type { SqlDatabase } from './sql';

function adapt(db: SQLiteDatabase): SqlDatabase {
  return {
    execAsync: (source) => db.execAsync(source),
    runAsync: (source, params) => db.runAsync(source, params),
    getAllAsync: (source, params) => db.getAllAsync(source, params),
    getFirstAsync: (source, params) => db.getFirstAsync(source, params),
    withTransactionAsync: (task) => db.withExclusiveTransactionAsync(async () => task()),
  };
}

let instance: Promise<Journal> | null = null;

/** The device journal, opened and migrated once. */
export function appJournal(): Promise<Journal> {
  instance ??= (async () => {
    const journal = new Journal(adapt(await openDatabaseAsync('journal.db')));
    await journal.migrate();
    return journal;
  })();
  return instance;
}
