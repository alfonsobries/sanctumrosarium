import { describe, expect, it } from 'vitest';

import { defaultSettings } from '@/domains/settings/settings';

import { sameWatchSettings, watchEntryFrom, watchSettingsOf } from './watch-entry';

const payload = {
  id: '7c1d2c55-0b4f-4f43-9a55-0f3f5d1d9b1e',
  kind: 'rosary',
  mysterySet: 'joyful',
  locale: 'es-MX',
  prayedOn: '2026-10-05',
  startedAt: '2026-10-05T23:10:00.000Z',
  decades: 3,
  durationSeconds: 612.4,
};

describe('watchEntryFrom', () => {
  it('turns a partial session into a journal entry', () => {
    expect(watchEntryFrom(payload)).toEqual({
      ...payload,
      completedAt: null,
      durationSeconds: 612,
      readings: null,
    });
  });

  it('keeps the completion time of a finished rosary', () => {
    const entry = watchEntryFrom({ ...payload, decades: 5, completedAt: '2026-10-05T23:30:00.000Z' });
    expect(entry?.completedAt).toBe('2026-10-05T23:30:00.000Z');
  });

  it.each([
    ['no id', { ...payload, id: '' }],
    ['an unknown set', { ...payload, mysterySet: 'golden' }],
    ['an unknown locale', { ...payload, locale: 'fr-FR' }],
    ['a UTC timestamp as the day', { ...payload, prayedOn: '2026-10-05T23:10:00Z' }],
    ['nothing prayed', { ...payload, decades: 0 }],
    ['more than five decades', { ...payload, decades: 6 }],
    ['a negative duration', { ...payload, durationSeconds: -1 }],
    ['readings that are not refs', { ...payload, readings: { joyful: 3 } }],
  ])('drops a session with %s', (_, candidate) => {
    expect(watchEntryFrom(candidate)).toBeNull();
  });
});

describe('watch settings', () => {
  it('sends only what the watch prays with', () => {
    expect(watchSettingsOf(defaultSettings)).toEqual({
      prayerLocale: 'es-MX',
      fatimaPrayer: true,
      litany: false,
      pauseSeconds: 1,
      rate: 1,
      mode: 'listen',
    });
  });

  it('ignores changes the watch does not use', () => {
    expect(sameWatchSettings(defaultSettings, { ...defaultSettings, skin: 'manuscript' })).toBe(true);
    expect(sameWatchSettings(defaultSettings, { ...defaultSettings, litany: true })).toBe(false);
  });
});
