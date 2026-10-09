import type { PrayerId, Step } from '@sanctamaria/rosary';

/** A place in the Rosary someone can jump to: the opening, a mystery or a closing prayer. */
export type Section =
  | { kind: 'opening'; start: number; end: number }
  | { kind: 'decade'; decade: number; mysteryId: string; start: number; end: number }
  | { kind: 'pope'; start: number; end: number }
  | { kind: 'closing'; prayer: PrayerId; start: number; end: number };

function keyOf(step: Step): string {
  if (step.section === 'opening') {
    return 'opening';
  }
  if (step.section === 'decade') {
    return `decade-${step.decade}`;
  }
  if (step.kind === 'prayer' && step.intention === 'pope') {
    return 'pope';
  }
  return step.id;
}

/**
 * The sections of a sequence in order, each with the first and last step it covers. The
 * closing sign of the cross belongs to the prayer before it.
 */
export function sectionsOf(steps: readonly Step[]): Section[] {
  const sections: Section[] = [];
  let previous: string | null = null;

  steps.forEach((step, index) => {
    const key = keyOf(step);
    const current = sections.at(-1);
    const closingCross =
      step.section === 'closing' && step.kind === 'prayer' && step.prayer === 'sign-of-the-cross';
    if (current !== undefined && (key === previous || closingCross)) {
      current.end = index;
      return;
    }
    previous = key;
    if (step.section === 'opening') {
      sections.push({ kind: 'opening', start: index, end: index });
    } else if (step.section === 'decade' && step.decade !== null) {
      const announce = steps.find((s) => s.kind === 'announce' && s.decade === step.decade);
      sections.push({
        kind: 'decade',
        decade: step.decade,
        mysteryId: announce?.kind === 'announce' ? announce.mystery.id : '',
        start: index,
        end: index,
      });
    } else if (key === 'pope') {
      sections.push({ kind: 'pope', start: index, end: index });
    } else if (step.kind === 'prayer') {
      sections.push({ kind: 'closing', prayer: step.prayer, start: index, end: index });
    }
  });

  return sections;
}
