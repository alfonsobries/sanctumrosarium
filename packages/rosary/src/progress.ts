import type { Step } from './types';

/** Decades whose Glory Be has been reached by `position` (the index of the current step). */
export function decadesCompleted(steps: readonly Step[], position: number): number {
  let completed = 0;
  steps.forEach((step, index) => {
    if (
      index < position &&
      step.kind === 'prayer' &&
      step.prayer === 'glory-be' &&
      step.section === 'decade'
    ) {
      completed++;
    }
  });
  return completed;
}

/** First step of the next decade after `position`, or null when in the last one. */
export function nextDecadeStart(steps: readonly Step[], position: number): number | null {
  const index = steps.findIndex((step, i) => i > position && step.kind === 'announce');
  return index === -1 ? null : index;
}

/** First step of the decade containing `position`, or of the previous one when already there. */
export function previousDecadeStart(steps: readonly Step[], position: number): number | null {
  for (let i = position - 1; i >= 0; i--) {
    if (steps[i]?.kind === 'announce') {
      return i;
    }
  }
  return null;
}

export function fractionDone(steps: readonly Step[], position: number): number {
  if (steps.length <= 1) {
    return 1;
  }
  return Math.min(1, Math.max(0, position / (steps.length - 1)));
}
