import { describe, expect, it } from 'vitest';

import { defaultSettings, normalizeSettings } from './settings';

describe('normalizeSettings', () => {
  it('fills missing keys with defaults', () => {
    expect(normalizeSettings({ skin: 'manuscript' })).toEqual({ ...defaultSettings, skin: 'manuscript' });
  });

  it('ignores values of the wrong type and unknown keys', () => {
    expect(normalizeSettings({ pauseSeconds: 'long', legacy: true })).toEqual(defaultSettings);
  });

  it('survives garbage', () => {
    expect(normalizeSettings(null)).toEqual(defaultSettings);
  });
});
