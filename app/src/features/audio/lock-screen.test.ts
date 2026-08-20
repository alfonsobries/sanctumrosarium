import { buildRosary } from '@rosario/engine';
import { describe, expect, it } from 'vitest';

import { lockScreenOf } from './lock-screen';

const steps = buildRosary({ form: 'roman', locale: 'es-MX', set: 'gaudiosa' });

describe('lockScreenOf', () => {
  it('names the mystery and the prayer inside a decade', () => {
    const hail = steps.find(
      (step) =>
        step.kind === 'prayer' && step.prayer.id === 'ave-maria' && step.decade === 0,
    );
    const info = lockScreenOf(hail, 'gaudiosa', 'es', 'Misterios gozosos');
    expect(info.title).toBe('La Encarnación del Hijo de Dios');
    expect(info.artist).toBe('Dios te salve, María');
    expect(JSON.stringify(info)).not.toMatch(/\d/);
  });

  it('names the opening prayer before the decades', () => {
    const opening = steps.find(
      (step) => step.kind === 'prayer' && step.prayer.id === 'signum-crucis',
    );
    const info = lockScreenOf(opening, 'gaudiosa', 'es', 'Misterios gozosos');
    expect(info.title).toBe('Señal de la cruz');
    expect(info.artist).toBe('Misterios gozosos');
  });
});
