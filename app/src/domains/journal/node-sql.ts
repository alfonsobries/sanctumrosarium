import { DatabaseSync } from 'node:sqlite';

import type { SqlDatabase, SqlValue } from './sql';

/** In-memory SQLite for tests, shaped like expo-sqlite. */
export function memoryDatabase(): SqlDatabase {
  const db = new DatabaseSync(':memory:');
  return {
    execAsync: async (source) => {
      db.exec(source);
    },
    runAsync: async (source, params: SqlValue[]) => db.prepare(source).run(...params),
    getAllAsync: async <T,>(source: string, params: SqlValue[]) =>
      db.prepare(source).all(...params) as T[],
    getFirstAsync: async <T,>(source: string, params: SqlValue[]) =>
      (db.prepare(source).get(...params) as T | undefined) ?? null,
    withTransactionAsync: async (task) => {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  };
}
