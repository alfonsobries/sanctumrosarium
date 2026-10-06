import {
  buildSequence,
  chooseReading,
  decadesCompleted,
  type MysteryRef,
  type MysterySet,
  type Reading,
  type ReadingPreference,
  type Scope,
  type Step,
} from '@sanctamaria/rosary';

import type { Locale } from '@/domains/sync/api.gen';

/** Everything needed to rebuild the same steps after the app restarts. */
export type SessionPlan = {
  id: string;
  set: MysterySet;
  scope: Scope;
  locale: Locale;
  fatimaPrayer: boolean;
  litany: boolean;
  /** Reading chosen per mystery when the session began; absent when readings are off. */
  readings: Record<string, Reading> | null;
  startedAt: string;
  /** Local calendar date the session belongs to. */
  prayedOn: string;
};

export type PlanInput = {
  id: string;
  set: MysterySet;
  scope: Scope;
  locale: Locale;
  fatimaPrayer: boolean;
  litany: boolean;
  reading: boolean;
  gospel: ReadingPreference;
  readingCounts: Record<string, number>;
  mysteries: readonly MysteryRef[];
  now: Date;
  prayedOn: string;
};

export function planSession(input: PlanInput): SessionPlan {
  let readings: Record<string, Reading> | null = null;
  if (input.reading) {
    readings = {};
    for (const mystery of input.mysteries) {
      const reading = chooseReading(mystery, input.gospel, input.readingCounts[mystery.id] ?? 0);
      if (reading !== null) {
        readings[mystery.id] = reading;
      }
    }
  }
  return {
    id: input.id,
    set: input.set,
    scope: input.scope,
    locale: input.locale,
    fatimaPrayer: input.fatimaPrayer,
    litany: input.litany,
    readings,
    startedAt: input.now.toISOString(),
    prayedOn: input.prayedOn,
  };
}

export function stepsFor(plan: SessionPlan, mysteries: readonly MysteryRef[]): Step[] {
  const readings = plan.readings;
  return buildSequence({
    set: plan.set,
    mysteries,
    scope: plan.scope,
    opening: true,
    readingFor: readings === null ? null : (mystery) => readings[mystery.id] ?? null,
    fatimaPrayer: plan.fatimaPrayer,
    hailHolyQueen: true,
    litany: plan.litany,
    closingPrayer: true,
  });
}

/** What goes into the journal when a session ends, or null if nothing was prayed. */
export function journalEntryFor(
  plan: SessionPlan,
  steps: readonly Step[],
  position: number,
  now: Date,
  activeSeconds: number,
) {
  const finished = position >= steps.length - 1;
  const decades = finished ? decadesCompleted(steps, steps.length) : decadesCompleted(steps, position);
  if (decades === 0) {
    return null;
  }
  const readingsHeard: Record<string, string> = {};
  for (const step of steps.slice(0, position + 1)) {
    if (step.kind === 'reading') {
      readingsHeard[step.mystery.id] = step.reading.ref;
    }
  }
  return {
    id: plan.id,
    kind: plan.scope.kind === 'full' ? ('rosary' as const) : ('decade' as const),
    mysterySet: plan.set,
    locale: plan.locale,
    prayedOn: plan.prayedOn,
    startedAt: plan.startedAt,
    completedAt: finished ? now.toISOString() : null,
    decades,
    durationSeconds: Math.max(0, Math.round(activeSeconds)),
    readings: Object.keys(readingsHeard).length === 0 ? null : readingsHeard,
  };
}
