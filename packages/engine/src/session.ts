import type { Step } from './sequence';

export type SessionState = {
  /** Version of the saved shape. A session in progress must survive an app update. */
  readonly version: 1;
  readonly stepIndex: number;
  readonly startedAt: string;
  readonly finishedAt?: string;
  /** Free text: who this Rosary is offered for. Stays on the device. */
  readonly intention?: string;
};

export type Progress = {
  readonly stepIndex: number;
  readonly totalSteps: number;
  /** Zero based index of the decade being prayed, or undefined outside the decades. */
  readonly decade?: number;
  /** Which of the ten Hail Marys, one based. */
  readonly beadInDecade?: number;
  readonly hailMarysPrayed: number;
  readonly hailMarysTotal: number;
  readonly finished: boolean;
};

export function startSession(now: Date, intention?: string): SessionState {
  return {
    version: 1,
    stepIndex: 0,
    startedAt: now.toISOString(),
    ...(intention === undefined ? {} : { intention }),
  };
}

export function advance(
  state: SessionState,
  steps: readonly Step[],
  now: Date,
): SessionState {
  const next = state.stepIndex + 1;
  if (next >= steps.length) {
    return { ...state, stepIndex: steps.length, finishedAt: now.toISOString() };
  }
  return { ...state, stepIndex: next };
}

export function goBack(state: SessionState): SessionState {
  const { finishedAt: _finishedAt, ...rest } = state;
  return { ...rest, stepIndex: Math.max(0, state.stepIndex - 1) };
}

/** Jump to the first step of a decade, zero based. Used by the crown and by "next decade". */
export function goToDecade(
  state: SessionState,
  steps: readonly Step[],
  decade: number,
): SessionState {
  const index = steps.findIndex((step) => 'decade' in step && step.decade === decade);
  if (index < 0) {
    return state;
  }
  const { finishedAt: _finishedAt, ...rest } = state;
  return { ...rest, stepIndex: index };
}

export function progressOf(state: SessionState, steps: readonly Step[]): Progress {
  const index = Math.min(state.stepIndex, steps.length);
  const current = steps[index];
  const hailMarysTotal = steps.filter(
    (step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria',
  ).length;
  const hailMarysPrayed = steps
    .slice(0, index)
    .filter((step) => step.kind === 'prayer' && step.prayer.id === 'ave-maria').length;

  const decade =
    current !== undefined && 'decade' in current ? current.decade : undefined;
  const bead =
    current !== undefined && current.kind === 'prayer' ? current.beadInDecade : undefined;

  return {
    stepIndex: index,
    totalSteps: steps.length,
    ...(decade === undefined ? {} : { decade }),
    ...(bead === undefined ? {} : { beadInDecade: bead }),
    hailMarysPrayed,
    hailMarysTotal,
    finished: index >= steps.length,
  };
}

/** What goes in the diary once the Rosary is over. Acts, never graces. */
export type PrayedRecord = {
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly decades: number;
  readonly intention?: string;
};

export function recordOf(
  state: SessionState,
  steps: readonly Step[],
): PrayedRecord | undefined {
  if (state.finishedAt === undefined) {
    return undefined;
  }
  const decades = new Set(
    steps.flatMap((step) =>
      'decade' in step && step.decade !== undefined ? [step.decade] : [],
    ),
  ).size;
  return {
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    decades,
    ...(state.intention === undefined ? {} : { intention: state.intention }),
  };
}
