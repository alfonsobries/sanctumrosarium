import { describe, expect, it } from 'vitest';

import {
  formForPrayerLocale,
  resolveInterfaceLanguage,
  resolvePrayerLocale,
} from './resolve-locale';

const device = (languageCode: string | null, regionCode: string | null = null) => ({
  languageCode,
  regionCode,
});

describe('resolveInterfaceLanguage', () => {
  it('honours an explicit choice over the device', () => {
    expect(resolveInterfaceLanguage('es', [device('en')])).toBe('es');
  });

  it('follows the first device language the app ships', () => {
    expect(resolveInterfaceLanguage('system', [device('fr'), device('es')])).toBe('es');
  });

  it('falls back to English when no device language is shipped', () => {
    expect(resolveInterfaceLanguage('system', [device('fr')])).toBe('en');
    expect(resolveInterfaceLanguage('system', [])).toBe('en');
  });
});

describe('resolvePrayerLocale', () => {
  it('honours an explicit choice, including Latin', () => {
    expect(resolvePrayerLocale('la', [device('es', 'MX')])).toBe('la');
  });

  it('maps Spanish devices to their region', () => {
    expect(resolvePrayerLocale('system', [device('es', 'ES')])).toBe('es-ES');
    expect(resolvePrayerLocale('system', [device('es', 'MX')])).toBe('es-MX');
    expect(resolvePrayerLocale('system', [device('es', null)])).toBe('es-MX');
  });

  it('never lands on Latin by following the system', () => {
    expect(resolvePrayerLocale('system', [device('la')])).toBe('en-US');
  });
});

describe('formForPrayerLocale', () => {
  it('uses the regional form for Spanish and the roman form for English', () => {
    expect(formForPrayerLocale('es-MX')).toBe('es-MX');
    expect(formForPrayerLocale('es-ES')).toBe('es-ES');
    expect(formForPrayerLocale('en-US')).toBe('roman');
  });

  it('gives Latin the Dominican form, its historical home', () => {
    expect(formForPrayerLocale('la')).toBe('dominican');
  });
});
