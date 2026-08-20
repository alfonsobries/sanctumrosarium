import { startSession, advance, buildRosary } from '@rosario/engine';
import { describe, expect, it } from 'vitest';

import { createMemoryDriver } from '@/storage/kv';

import {
  clearSession,
  isFromToday,
  loadSession,
  localDateOf,
  saveSession,
  type SavedSession,
} from './session-store';

const options = { form: 'es-MX', locale: 'es-MX', set: 'gloriosa' } as const;

function sessionAt(now: Date): SavedSession {
  return {
    version: 1,
    state: startSession(now),
    options,
    localDate: localDateOf(now),
  };
}

describe('localDateOf', () => {
  it('uses the local calendar day, never UTC', () => {
    // 11pm local on the 3rd: still the 3rd, whatever UTC says.
    const night = new Date(2026, 7, 3, 23, 30);
    expect(localDateOf(night)).toBe('2026-08-03');
  });
});

describe('session store', () => {
  it('round-trips a session in progress', () => {
    const driver = createMemoryDriver();
    const now = new Date(2026, 7, 3, 22, 0);
    const saved = sessionAt(now);
    saveSession(driver, saved);
    expect(loadSession(driver)).toEqual(saved);
  });

  it('returns nothing on first use or after clearing', () => {
    const driver = createMemoryDriver();
    expect(loadSession(driver)).toBeUndefined();
    saveSession(driver, sessionAt(new Date(2026, 7, 3)));
    clearSession(driver);
    expect(loadSession(driver)).toBeUndefined();
  });

  it('ignores corrupt data instead of crashing the screen', () => {
    const driver = createMemoryDriver({ session: '{broken' });
    expect(loadSession(driver)).toBeUndefined();
  });

  it('does not offer to resume a finished session', () => {
    const driver = createMemoryDriver();
    const now = new Date(2026, 7, 3, 22, 0);
    const steps = buildRosary(options);
    let state = startSession(now);
    state = { ...state, stepIndex: steps.length - 1 };
    state = advance(state, steps, now);
    expect(state.finishedAt).toBeDefined();
    saveSession(driver, { version: 1, state, options, localDate: localDateOf(now) });
    expect(loadSession(driver)).toBeUndefined();
  });

  it('tells a session from today apart from one of another day', () => {
    const saved = sessionAt(new Date(2026, 7, 3, 22, 0));
    expect(isFromToday(saved, new Date(2026, 7, 3, 23, 59))).toBe(true);
    expect(isFromToday(saved, new Date(2026, 7, 4, 0, 5))).toBe(false);
  });
});
