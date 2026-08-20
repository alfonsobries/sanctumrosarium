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
      version: 3,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
      prayerForm: 'dominican',
      includedPrayers: ['oratio-fatimae'],
      haptics: 'strong',
    });
    expect(loadSettings(driver)).toEqual({
      version: 3,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
      prayerForm: 'dominican',
      includedPrayers: ['oratio-fatimae'],
      haptics: 'strong',
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
      version: 3,
      appearance: 'dark',
      interfaceLanguage: 'en',
      prayerLocale: 'en-US',
      prayerForm: 'auto',
      includedPrayers: [],
      haptics: 'gentle',
    });
  });

  it('drops unknown prayers from the included list', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({
        version: 3,
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
