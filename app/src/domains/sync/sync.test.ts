import { beforeEach, describe, expect, it } from 'vitest';

import { Journal } from '@/domains/journal/journal';
import { memoryDatabase } from '@/domains/journal/node-sql';

import { ApiClient, ApiError } from './client';
import { syncJournal, type CursorStore } from './sync';

type Call = { url: string; method: string; body: { cursor: string | null; prayers: { id: string }[] } };

let calls: Call[];
let journal: Journal;
let cursor: string | null;
const cursors: CursorStore = { get: async () => cursor, set: async (value) => void (cursor = value) };

function client(reply: (call: Call) => Response): ApiClient {
  return new ApiClient({
    baseUrl: 'https://api.test',
    token: async () => 'secret',
    fetch: (async (url: string, init: RequestInit) => {
      const call = { url, method: init.method ?? 'GET', body: JSON.parse(String(init.body ?? '{}')) };
      calls.push(call);
      return reply(call);
    }) as typeof fetch,
  });
}

const ok = (prayers: unknown[] = []): Response =>
  new Response(JSON.stringify({ prayers, cursor: '2026-10-07T00:00:00Z' }), { status: 200 });

beforeEach(async () => {
  calls = [];
  cursor = null;
  journal = new Journal(memoryDatabase(), () => new Date('2026-10-06T22:00:00Z'));
  await journal.migrate();
});

const save = (id: string) =>
  journal.save({
    id,
    kind: 'rosary',
    mysterySet: 'joyful',
    locale: 'es-MX',
    prayedOn: '2026-10-06',
    startedAt: '2026-10-06T21:00:00.000Z',
    completedAt: null,
    decades: 5,
    durationSeconds: 900,
    readings: null,
  });

describe('syncJournal', () => {
  it('pushes dirty entries to the generated sync route and stores the cursor', async () => {
    await save('a');
    await syncJournal(
      client(() => ok()),
      journal,
      cursors,
    );

    expect(calls[0]).toMatchObject({ url: 'https://api.test/api/sync', method: 'POST' });
    expect(calls[0]?.body.prayers.map((p) => p.id)).toEqual(['a']);
    expect(await journal.dirty()).toHaveLength(0);
    expect(cursor).toBe('2026-10-07T00:00:00Z');
  });

  it('pulls entries prayed on another device', async () => {
    await syncJournal(
      client(() =>
        ok([
          {
            id: 'remote',
            kind: 'decade',
            mysterySet: 'glorious',
            locale: 'la',
            prayedOn: '2026-10-05',
            startedAt: '2026-10-05T10:00:00Z',
            completedAt: '2026-10-05T10:05:00Z',
            decades: 1,
            durationSeconds: 300,
            readings: null,
            clientUpdatedAt: '2026-10-05T10:05:00Z',
            deletedAt: null,
          },
        ]),
      ),
      journal,
      cursors,
    );

    expect(await journal.find('remote')).toMatchObject({ locale: 'la', decades: 1 });
  });

  it('keeps entries dirty when the server fails', async () => {
    await save('a');

    await expect(
      syncJournal(
        client(() => new Response('down', { status: 503 })),
        journal,
        cursors,
      ),
    ).rejects.toBeInstanceOf(ApiError);
    expect(await journal.dirty()).toHaveLength(1);
    expect(cursor).toBeNull();
  });

  it('sends the bearer token', async () => {
    let auth: string | null = null;
    const api = new ApiClient({
      baseUrl: 'https://api.test',
      token: async () => 'secret',
      fetch: (async (_url: string, init: RequestInit) => {
        auth = new Headers(init.headers).get('Authorization');
        return ok();
      }) as typeof fetch,
    });
    await syncJournal(api, journal, cursors);

    expect(auth).toBe('Bearer secret');
  });
});
