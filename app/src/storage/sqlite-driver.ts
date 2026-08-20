import Storage from 'expo-sqlite/kv-store';

import type { KvDriver } from './kv';

/** Synchronous on purpose: settings are read before the first frame, with no flash. */
export function createSqliteDriver(): KvDriver {
  return {
    get: (key) => Storage.getItemSync(key),
    set: (key, value) => {
      Storage.setItemSync(key, value);
    },
    remove: (key) => {
      Storage.removeItemSync(key);
    },
  };
}
