import type { KvDriver } from './kv';
import { createSqliteDriver } from './sqlite-driver';

/** The one storage the app reads and writes. Tests build their own memory driver. */
export const appKv: KvDriver = createSqliteDriver();
