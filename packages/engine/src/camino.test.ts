import { describe, expect, it } from 'vitest';

import { caminoStages, stageState, waysOfSession } from './camino';

describe('caminoStages', () => {
  it('has the eight stages of the design, in the suggested order', () => {
    expect(caminoStages.map((stage) => stage.id)).toEqual([
      'structure',
      'meditate',
      'clauses',
      'respond',
      'latin',
      'sung',
      'family',
      'twenty',
    ]);
  });

  it('carries no points, levels or badges, only a times-to-walk guideline', () => {
    for (const stage of caminoStages) {
      expect(Object.keys(stage).sort()).toEqual(['detectable', 'id', 'timesToWalk']);
      expect(stage.timesToWalk).toBeGreaterThan(0);
    }
  });
});

describe('stageState', () => {
  const stage = caminoStages[0]!;

  it('starts not started and never advances on its own', () => {
    expect(stageState(stage, 0)).toBe('not-started');
    expect(stageState(stage, -1)).toBe('not-started');
  });

  it('walks by use and completes at the guideline', () => {
    expect(stageState(stage, 1)).toBe('walking');
    expect(stageState(stage, stage.timesToWalk - 1)).toBe('walking');
    expect(stageState(stage, stage.timesToWalk)).toBe('walked');
    expect(stageState(stage, stage.timesToWalk + 10)).toBe('walked');
  });

  it('depends only on that stage: any stage can be walked in any order', () => {
    const latin = caminoStages.find((candidate) => candidate.id === 'latin');
    expect(stageState(latin!, latin!.timesToWalk)).toBe('walked');
    expect(stageState(caminoStages[0]!, 0)).toBe('not-started');
  });
});

describe('waysOfSession', () => {
  it('every finished Rosary walks the structure', () => {
    expect(
      waysOfSession({
        language: 'es',
        withClauses: false,
        meditativePause: false,
        answeredAloud: false,
      }),
    ).toEqual(['structure']);
  });

  it('reads each way from how the session was prayed', () => {
    expect(
      waysOfSession({
        language: 'la',
        withClauses: true,
        meditativePause: true,
        answeredAloud: true,
      }),
    ).toEqual(['structure', 'meditate', 'clauses', 'respond', 'latin']);
  });

  it('never guesses singing or family: those only the person can say', () => {
    const ways = waysOfSession({
      language: 'la',
      withClauses: true,
      meditativePause: true,
      answeredAloud: true,
    });
    expect(ways).not.toContain('sung');
    expect(ways).not.toContain('family');
  });
});
