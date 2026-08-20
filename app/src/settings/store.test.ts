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
      version: 1,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
    });
    expect(loadSettings(driver)).toEqual({
      version: 1,
      appearance: 'dark',
      interfaceLanguage: 'es',
      prayerLocale: 'la',
    });
  });

  it('migrates data written before settings were versioned', () => {
    const driver = createMemoryDriver({
      settings: JSON.stringify({ appearance: 'light', prayerLocale: 'es-MX' }),
    });
    expect(loadSettings(driver)).toEqual({
      version: 1,
      appearance: 'light',
      interfaceLanguage: 'system',
      prayerLocale: 'es-MX',
    });
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
