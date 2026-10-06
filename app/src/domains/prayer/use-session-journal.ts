import { decadesCompleted, type Step } from '@sanctamaria/rosary';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { appJournal } from '@/domains/journal/app-journal';
import { useInvalidateJournal } from '@/domains/journal/queries';
import { syncNow } from '@/domains/sync/account';

import { journalEntryFor, type SessionPlan } from './session';
import { useSession } from './use-session';

/**
 * Writes the session to the journal each time a decade is finished, so leaving at any
 * moment never loses what was prayed; also counts the time the screen is in use.
 */
export function useSessionJournal(plan: SessionPlan | null, steps: readonly Step[], position: number): void {
  const invalidate = useInvalidateJournal();
  const saved = useRef(-1);

  useEffect(() => {
    if (plan === null) {
      return;
    }
    const decades =
      position >= steps.length - 1
        ? decadesCompleted(steps, steps.length)
        : decadesCompleted(steps, position);
    if (decades === saved.current) {
      return;
    }
    saved.current = decades;
    const entry = journalEntryFor(plan, steps, position, new Date(), useSession.getState().activeSeconds);
    if (entry === null) {
      return;
    }
    void (async () => {
      await (await appJournal()).save(entry);
      await invalidate();
      await syncNow();
      await invalidate();
    })();
  }, [plan, steps, position, invalidate]);

  useEffect(() => {
    let last = Date.now();
    let active = AppState.currentState === 'active';
    const tick = setInterval(() => {
      const now = Date.now();
      if (active) {
        useSession.getState().addActiveSeconds((now - last) / 1000);
      }
      last = now;
    }, 5000);
    const subscription = AppState.addEventListener('change', (state) => {
      last = Date.now();
      active = state === 'active';
    });
    return () => {
      clearInterval(tick);
      subscription.remove();
    };
  }, []);
}
