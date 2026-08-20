/**
 * The Way: eight stages of learning to pray the Rosary better (gamificacion.md, 3).
 * Progress is walking, never accumulating: a stage advances by praying that way, any
 * order, and turning the Way off removes nothing from the Rosary itself.
 */

export type CaminoStageId =
  | 'structure'
  | 'meditate'
  | 'clauses'
  | 'respond'
  | 'latin'
  | 'sung'
  | 'family'
  | 'twenty';

export type CaminoStage = {
  readonly id: CaminoStageId;
  /** Acts praying this way after which the stage counts as walked. A guideline, never an exam. */
  readonly timesToWalk: number;
  /**
   * True when the act can be read from the session itself (its settings, its length).
   * The rest - singing, praying with others - only the person can say, so they do.
   */
  readonly detectable: boolean;
};

/** In the suggested order. The order suggests; it never gates: any stage can be opened. */
export const caminoStages: readonly CaminoStage[] = [
  { id: 'structure', timesToWalk: 3, detectable: true },
  { id: 'meditate', timesToWalk: 3, detectable: true },
  { id: 'clauses', timesToWalk: 3, detectable: true },
  { id: 'respond', timesToWalk: 3, detectable: true },
  { id: 'latin', timesToWalk: 3, detectable: true },
  { id: 'sung', timesToWalk: 3, detectable: false },
  { id: 'family', timesToWalk: 3, detectable: false },
  { id: 'twenty', timesToWalk: 3, detectable: true },
];

export type CaminoStageState = 'not-started' | 'walking' | 'walked';

export function stageState(stage: CaminoStage, times: number): CaminoStageState {
  if (times <= 0) {
    return 'not-started';
  }
  return times >= stage.timesToWalk ? 'walked' : 'walking';
}

/** Ways a single session can be prayed, as recorded in the journal. */
export type CaminoWay = Exclude<CaminoStageId, 'twenty'>;

export type SessionShape = {
  readonly language: string;
  readonly withClauses: boolean;
  /** The announcement pause held long enough to meditate the mystery (RVM 29-31). */
  readonly meditativePause: boolean;
  /** The person led aloud and the guide answered (two choirs, Rosa 46). */
  readonly answeredAloud: boolean;
};

/**
 * What this session teaches, read from how it was prayed. Every finished Rosary walks
 * the structure; the rest only when that way was actually used. Nothing here guesses:
 * singing and family are not detectable and never returned.
 */
export function waysOfSession(shape: SessionShape): readonly CaminoWay[] {
  const ways: CaminoWay[] = ['structure'];
  if (shape.meditativePause) {
    ways.push('meditate');
  }
  if (shape.withClauses) {
    ways.push('clauses');
  }
  if (shape.answeredAloud) {
    ways.push('respond');
  }
  if (shape.language === 'la') {
    ways.push('latin');
  }
  return ways;
}
