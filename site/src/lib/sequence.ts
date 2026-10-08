import { mysteryRefsOf } from '@sanctamaria/content';
import { buildSequence, type MysterySet, type Step } from '@sanctamaria/rosary';

/** The whole Rosary as the app prays it by default, from the engine itself. */
export function rosarySteps(set: MysterySet = 'joyful'): Step[] {
  return buildSequence({
    set,
    mysteries: mysteryRefsOf(set),
    scope: { kind: 'full' },
    opening: true,
    readingFor: (mystery) => mystery.readings[0] ?? null,
    fatimaPrayer: true,
    prayerForThePope: true,
    hailHolyQueen: true,
    litany: false,
    closingPrayer: true,
  });
}

export type Outline = {
  opening: Step[];
  /** One decade, the same five times. */
  decade: Step[];
  closing: Step[];
};

/** The Rosary folded into its three parts, for the step-by-step guide. */
export function outline(): Outline {
  const steps = rosarySteps();
  return {
    opening: steps.filter((step) => step.section === 'opening'),
    decade: steps.filter((step) => step.section === 'decade' && step.decade === 1),
    closing: steps.filter((step) => step.section === 'closing'),
  };
}

export type BeadPlace = { kind: 'cross' | 'large' | 'small' | 'medal'; step: Step };

/** Every bead of the physical rosary, in prayer order, each with the step prayed on it. */
export function beads(): BeadPlace[] {
  const places: BeadPlace[] = [];
  const seen = new Set<string>();
  for (const step of rosarySteps()) {
    const bead = step.bead;
    if (bead === null) {
      continue;
    }
    const key =
      bead.kind === 'decade-small' ? `${bead.kind}-${bead.decade}-${bead.index}`
      : bead.kind === 'decade-large' ? `${bead.kind}-${bead.decade}`
      : bead.kind === 'opening-small' ? `${bead.kind}-${bead.index}`
      : bead.kind;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const kind =
      bead.kind === 'crucifix' ? 'cross'
      : bead.kind === 'centerpiece' ? 'medal'
      : bead.kind === 'opening-large' || bead.kind === 'decade-large' ? 'large'
      : 'small';
    places.push({ kind, step });
  }
  return places;
}
