import { describe, expect, it } from 'vitest';

import { createMemoryDriver } from '@/storage/kv';

import { defaultSettings, loadSettings, saveSettings } from './store';

describe('loadSettings', () => {
  it('returns defaults on first launch', () => {
    expect(loadSettings(createMemoryDriver())).toEqual(defaultSettings);
  });

  it('round-trips what was saved', () => {
    const driver = createMemoryDriver();
    saveSettings(driver, {
      version: 15,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
      prayerForm: 'dominican',
      includedPrayers: ['oratio-fatimae'],
      haptics: 'strong',
      latinText: 'la',
      rule: 'weekly-fifteen',
      reminderMode: 'angelus',
      reminderHour: 8,
      reminderMinute: 0,
      reminderDays: [1, 2, 3],
      rosesEnabled: false,
      withLitany: true,
      latinMixOwn: ['ave-maria'],
      withClauses: true,
      audioPace: 'calm',
      responseSilence: 'long',
      announcePause: 'long',
      choirRole: 'respond',
      caminoEnabled: false,
      recollectionEnabled: true,
      latinLearn: { 'ave-maria': 'memory' },
    });
    expect(loadSettings(driver)).toEqual({
      version: 15,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
      prayerForm: 'dominican',
      includedPrayers: ['oratio-fatimae'],
      haptics: 'strong',
      latinText: 'la',
      rule: 'weekly-fifteen',
      reminderMode: 'angelus',
      reminderHour: 8,
      reminderMinute: 0,
      reminderDays: [1, 2, 3],
      rosesEnabled: false,
      withLitany: true,
      latinMixOwn: ['ave-maria'],
      withClauses: true,
      audioPace: 'calm',
      responseSilence: 'long',
      announcePause: 'long',
      choirRole: 'respond',
      caminoEnabled: false,
      recollectionEnabled: true,
      latinLearn: { 'ave-maria': 'memory' },
    });
  });

  it('migrates data written before settings were versioned', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({ appearance: 'light', prayerLocale: 'es-MX' }),
    });
    expect(loadSettings(driver)).toEqual({
      ...defaultSettings,
      appearance: 'light',
      prayerLocale: 'es-MX',
    });
  });

  it('migrates version 1 settings through every version with sober defaults', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({
        version: 1,
        appearance: 'dark',
        interfaceLanguage: 'en',
        prayerLocale: 'en-US',
      }),
    });
    expect(loadSettings(driver)).toEqual({
      version: 15,
      appearance: 'dark',
      interfaceLanguage: 'en',
      prayerLocale: 'en-US',
      prayerForm: 'auto',
      includedPrayers: [],
      haptics: 'gentle',
      latinText: 'both',
      rule: 'none',
      reminderMode: 'off',
      reminderHour: 8,
      reminderMinute: 0,
      reminderDays: [0, 1, 2, 3, 4, 5, 6],
      rosesEnabled: true,
      withLitany: false,
      latinMixOwn: [],
      withClauses: false,
      audioPace: 'normal',
      responseSilence: 'normal',
      announcePause: 'short',
      choirRole: 'guide',
      caminoEnabled: true,
      recollectionEnabled: false,
      latinLearn: {},
    });
  });

  it('a migration never touches the rule someone chose', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({ version: 4, rule: 'daily-decade' }),
    });
    expect(loadSettings(driver).rule).toBe('daily-decade');
  });

  it('drops unknown prayers from the included list', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({
        version: 15,
        includedPrayers: ['oratio-fatimae', 'not-a-prayer'],
      }),
    });
    expect(loadSettings(driver).includedPrayers).toEqual(['oratio-fatimae']);
  });

  it('falls back to defaults on corrupt JSON', () => {
    const driver = createMemoryDriver({ settings: '{not json' });
    expect(loadSettings(driver)).toEqual(defaultSettings);
  });

  it('drops only the corrupt field, not the whole settings', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({ version: 1, appearance: 'sepia', prayerLocale: 'la' }),
    });
    expect(loadSettings(driver)).toEqual({ ...defaultSettings, prayerLocale: 'la' });
  });

  it('keeps recognizable fields when the stored version is newer than the app', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({ version: 99, appearance: 'dark', future: true }),
    });
    expect(loadSettings(driver)).toEqual({ ...defaultSettings, appearance: 'dark' });
  });
});
