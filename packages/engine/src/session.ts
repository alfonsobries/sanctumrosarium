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

function decadeOf(step: Step | undefined): number | undefined {
  return step !== undefined && 'decade' in step ? step.decade : undefined;
}

/**
 * Headphones and the lock screen skip by decade, not by bead: the audio already
 * advances the Hail Marys (task 020). Forward from the last decade lands on the
 * closing; backward from the first lands on the opening.
 */
export function skipDecade(
  state: SessionState,
  steps: readonly Step[],
  direction: 1 | -1,
): SessionState {
  const current = decadeOf(steps[state.stepIndex]);
  if (current === undefined) {
    if (direction === 1) {
      return goToDecade(state, steps, 0);
    }
    const { finishedAt: _finishedAt, ...rest } = state;
    return { ...rest, stepIndex: 0 };
  }
  const target = current + direction;
  if (target < 0) {
    const { finishedAt: _finishedAt, ...rest } = state;
    return { ...rest, stepIndex: 0 };
  }
  const jumped = goToDecade(state, steps, target);
  if (decadeOf(steps[jumped.stepIndex]) === target) {
    return jumped;
  }
  let lastDecadeIndex = -1;
  for (let index = 0; index < steps.length; index += 1) {
    if (decadeOf(steps[index]) !== undefined) {
      lastDecadeIndex = index;
    }
  }
  const { finishedAt: _finishedAt, ...rest } = state;
  return { ...rest, stepIndex: Math.min(lastDecadeIndex + 1, steps.length) };
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

/**
 * Decades fully prayed so far: every step of the decade is behind the cursor. Praying
 * in parts is traditional (Montfort recommends splitting the day); the loose decades
 * still count for the Rule, which measures faithfulness, not continuity.
 */
export function decadesCompleted(state: SessionState, steps: readonly Step[]): number {
  const lastIndexOfDecade = new Map<number, number>();
  for (const [index, step] of steps.entries()) {
    if ('decade' in step && step.decade !== undefined) {
      lastIndexOfDecade.set(step.decade, index);
    }
  }
  let completed = 0;
  for (const lastIndex of lastIndexOfDecade.values()) {
    if (lastIndex < state.stepIndex) {
      completed += 1;
    }
  }
  return completed;
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
