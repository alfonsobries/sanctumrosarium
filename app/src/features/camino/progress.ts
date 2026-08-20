import { stageState, type CaminoStage, type CaminoStageState } from '@rosario/engine';

import type { Journal } from '@/features/journal/db';

export type StageProgress = {
  readonly times: number;
  readonly state: CaminoStageState;
};

/** What a stage's count is made of, so the interface never shows a bare fraction. */
export function stageUnit(stage: CaminoStage): 'rosaries' | 'days' {
  return stage.id === 'twenty' || !stage.detectable ? 'days' : 'rosaries';
}

/**
 * How far a stage has been walked, counted in acts from the journal: sessions prayed
 * that way, days of the four sets, or the person's own word for what the app cannot
 * detect. Nothing else moves it.
 */
export function stageProgress(journal: Journal, stage: CaminoStage): StageProgress {
  const times =
    stage.id === 'twenty'
      ? journal.twentyCount()
      : stage.detectable
        ? journal.wayCount(stage.id)
        : journal.markCount(stage.id);
  return { times, state: stageState(stage, times) };
}
