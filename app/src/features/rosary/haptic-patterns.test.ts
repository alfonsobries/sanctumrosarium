import { buildRosary } from '@rosario/engine';
import { describe, expect, it } from 'vitest';

import { hapticForStep } from './haptic-patterns';

const steps = buildRosary({ form: 'roman', locale: 'es-MX', set: 'gaudiosa' });
const byPrayer = (id: string) =>
  steps.find((step) => step.kind === 'prayer' && step.prayer.id === id);

describe('hapticForStep', () => {
  it('gives each prayer of the decade its own touch', () => {
    expect(hapticForStep(byPrayer('ave-maria'))).toBe('bead');
    expect(hapticForStep(byPrayer('pater-noster'))).toBe('pater');
    expect(hapticForStep(byPrayer('gloria-patri'))).toBe('gloria');
  });

  it('marks the new mystery', () => {
    const announce = steps.find((step) => step.kind === 'announce');
    expect(hapticForStep(announce)).toBe('announce');
  });

  it('stays quiet past the end', () => {
    expect(hapticForStep(undefined)).toBe('none');
  });
});
