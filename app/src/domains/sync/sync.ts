import type { Journal } from '@/domains/journal/journal';

import type { ApiClient } from './client';

export type CursorStore = {
  get(): Promise<string | null>;
  set(cursor: string): Promise<void>;
};

const batchSize = 500;

/**
 * One round of journal sync: push what is dirty in batches, then pull everything the
 * server changed since the last cursor. Safe to call at any time and to repeat.
 */
export async function syncJournal(api: ApiClient, journal: Journal, cursors: CursorStore): Promise<void> {
  const dirty = await journal.dirty();
  let cursor = await cursors.get();
  const batches = Math.max(1, Math.ceil(dirty.length / batchSize));

  for (let index = 0; index < batches; index++) {
    const batch = dirty.slice(index * batchSize, (index + 1) * batchSize);
    const result = await api.sync({ cursor, prayers: batch });
    await journal.applyRemote(result.prayers);
    await journal.markSynced(batch);
    cursor = result.cursor;
    await cursors.set(cursor);
  }
}
