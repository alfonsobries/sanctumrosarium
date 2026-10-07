import type { Step } from '@sanctamaria/rosary';

import type { BeadState } from './bead-places';

/** What the bead ring shows while `steps[position]` is being prayed. */
export function beadState(steps: readonly Step[], position: number): BeadState {
  const step = steps[position];
  if (step === undefined) {
    return { kind: 'decade', ourFather: 'done', prayed: 10, current: null };
  }

  if (step.section === 'opening' || (step.decade === null && step.section !== 'closing')) {
    const bead = step.bead;
    if (bead?.kind === 'opening-large') {
      return { kind: 'opening', prayed: 0, current: 1 };
    }
    if (bead?.kind === 'opening-small') {
      return { kind: 'opening', prayed: bead.index, current: bead.index + 1 };
    }
    if (step.kind === 'prayer' && step.prayer === 'glory-be') {
      return { kind: 'opening', prayed: 4, current: null };
    }
    return { kind: 'opening', prayed: 0, current: 0 };
  }

  if (step.section === 'closing' || step.decade === null) {
    return { kind: 'decade', ourFather: 'done', prayed: 10, current: null };
  }

  const bead = step.bead;
  if (step.kind !== 'prayer') {
    return { kind: 'decade', ourFather: 'pending', prayed: 0, current: null };
  }
  if (bead?.kind === 'decade-large') {
    return { kind: 'decade', ourFather: 'current', prayed: 0, current: null };
  }
  if (bead?.kind === 'decade-small') {
    return { kind: 'decade', ourFather: 'done', prayed: bead.index - 1, current: bead.index };
  }
  return { kind: 'decade', ourFather: 'done', prayed: 10, current: null };
}

/** How far through each of the five decades the person is. */
export function decadeFills(steps: readonly Step[], position: number): number[] {
  const fills = [0, 0, 0, 0, 0];
  const totals = [0, 0, 0, 0, 0];
  steps.forEach((step, index) => {
    if (step.decade === null || step.section !== 'decade') {
      return;
    }
    const slot = step.decade - 1;
    totals[slot] = (totals[slot] ?? 0) + 1;
    if (index < position) {
      fills[slot] = (fills[slot] ?? 0) + 1;
    }
  });
  return fills.map((done, slot) => {
    const total = totals[slot] ?? 0;
    return total === 0 ? 0 : done / total;
  });
}
