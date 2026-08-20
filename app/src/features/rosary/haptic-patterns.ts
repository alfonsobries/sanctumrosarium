import type { Step } from '@rosario/engine';

/**
 * The fingers' count without beads: every step ticks, and the Our Father, the Glory Be
 * and the new mystery each feel different, so the decade can be followed blind.
 * Never continuous.
 */
export type HapticPattern = 'bead' | 'pater' | 'gloria' | 'announce' | 'none';

export function hapticForStep(step: Step | undefined): HapticPattern {
  if (step === undefined) {
    return 'none';
  }
  if (step.kind === 'announce') {
    return 'announce';
  }
  if (step.kind !== 'prayer') {
    return 'none';
  }
  if (step.prayer.id === 'pater-noster') {
    return 'pater';
  }
  if (step.prayer.id === 'gloria-patri') {
    return 'gloria';
  }
  return 'bead';
}
