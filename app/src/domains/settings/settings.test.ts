import { describe, expect, it } from 'vitest';

import { defaultSettings, normalizeSettings } from './settings';

describe('normalizeSettings', () => {
  it('fills missing keys with defaults', () => {
    expect(normalizeSettings({ skin: 'manuscript' })).toEqual({ ...defaultSettings, skin: 'manuscript' });
  });

  it('ignores values of the wrong type and unknown keys', () => {
    expect(normalizeSettings({ pauseSeconds: 'long', legacy: true })).toEqual(defaultSettings);
  });

  it('keeps a known opening form and drops an unknown one', () => {
    expect(normalizeSettings({ openingForm: 'three-virtues' }).openingForm).toBe('three-virtues');
    expect(normalizeSettings({ openingForm: 'five-virtues' }).openingForm).toBe('standard');
  });

  it('keeps a reminder time within the day and drops any other', () => {
    expect(normalizeSettings({ rosaryReminderAt: 7 * 60 + 30 }).rosaryReminderAt).toBe(450);
    expect(normalizeSettings({ rosaryReminderAt: 24 * 60 }).rosaryReminderAt).toBe(
      defaultSettings.rosaryReminderAt,
    );
    expect(normalizeSettings({ auxiliumReminderAt: 12.5 }).auxiliumReminderAt).toBe(
      defaultSettings.auxiliumReminderAt,
    );
  });

  it('keeps the reminders and Auxilium off until chosen', () => {
    expect(defaultSettings.rosaryReminder).toBe(false);
    expect(defaultSettings.auxilium).toBe(false);
    expect(defaultSettings.auxiliumReminder).toBe(false);
  });

  it('survives garbage', () => {
    expect(normalizeSettings(null)).toEqual(defaultSettings);
  });
});

import { nextRate } from './settings';

describe('nextRate', () => {
  it('cycles through the speeds and wraps around', () => {
    expect(nextRate(1)).toBe(1.2);
    expect(nextRate(2)).toBe(0.8);
  });

  it('starts over from an unknown speed', () => {
    expect(nextRate(1.15)).toBe(0.8);
  });
});
