/**
 * Key-value storage behind a driver so the logic on top of it is testable without a
 * device. The real driver is SQLite (expo-sqlite/kv-store); tests use memory.
 */
export interface KvDriver {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export function createMemoryDriver(initial: Record<string, string> = {}): KvDriver {
  const store = new Map(Object.entries(initial));
  return {
    get: (key) => store.get(key) ?? null,
    set: (key, value) => {
      store.set(key, value);
    },
    remove: (key) => {
      store.delete(key);
    },
  };
}
