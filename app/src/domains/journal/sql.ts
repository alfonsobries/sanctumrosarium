/** The subset of expo-sqlite's async API the journal uses, so tests can run on node:sqlite. */
export type SqlValue = string | number | null;

export type SqlDatabase = {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, params: SqlValue[]): Promise<unknown>;
  getAllAsync<T>(source: string, params: SqlValue[]): Promise<T[]>;
  getFirstAsync<T>(source: string, params: SqlValue[]): Promise<T | null>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
};
