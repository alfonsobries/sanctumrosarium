import type { FormId, Locale, MysterySetId, PrayerId } from '@rosario/content';
import type { SessionState } from '@rosario/engine';

import type { KvDriver } from '@/storage/kv';

/**
 * A session in progress, saved on every step. Leaving the screen never loses the bead:
 * coming back offers to resume exactly where it was.
 */
export type SavedSession = {
  readonly version: 1;
  readonly state: SessionState;
  /** What the steps were built with. Resuming must rebuild the exact same sequence. */
  readonly options: {
    readonly form: FormId;
    readonly locale: Locale;
    readonly set: MysterySetId;
    readonly include?: readonly PrayerId[];
    readonly withLitany?: boolean;
    readonly withClauses?: boolean;
    readonly decadeCount?: number;
    readonly localeOverrides?: Readonly<Partial<Record<PrayerId, Locale>>>;
  };
  /** Local date of the person praying (conventions: a Rosary at 11pm belongs to that day). */
  readonly localDate: string;
};

const SESSION_KEY = 'session';

/** The person's own calendar day, never UTC. */
export function localDateOf(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function saveSession(driver: KvDriver, session: SavedSession): void {
  driver.set(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(driver: KvDriver): void {
  driver.remove(SESSION_KEY);
}

export function loadSession(driver: KvDriver): SavedSession | undefined {
  const raw = driver.get(SESSION_KEY);
  if (raw === null) {
    return undefined;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return undefined;
  }
  const candidate = parsed as SavedSession;
  const valid =
    candidate.version === 1 &&
    typeof candidate.localDate === 'string' &&
    typeof candidate.state === 'object' &&
    candidate.state !== null &&
    typeof candidate.state.stepIndex === 'number' &&
    typeof candidate.options === 'object' &&
    candidate.options !== null;
  if (!valid) {
    return undefined;
  }
  // A finished session has nothing to resume.
  if (candidate.state.finishedAt !== undefined) {
    return undefined;
  }
  return candidate;
}

/** Whether the unfinished session belongs to the person's current day. */
export function isFromToday(session: SavedSession, now: Date): boolean {
  return session.localDate === localDateOf(now);
}
