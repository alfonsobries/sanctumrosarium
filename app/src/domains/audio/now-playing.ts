import type { Step } from '@sanctamaria/rosary';

/**
 * The mystery whose image is the cover in Now Playing for each step: its decade's, the
 * first decade's before it begins and the last one's after it ends. Null without decades.
 */
export function coverMysteries(steps: readonly Step[]): (string | null)[] {
  const byDecade = new Map<number, string>();
  for (const step of steps) {
    if (step.kind === 'announce') {
      byDecade.set(step.decade, step.mystery.id);
    }
  }
  const decades = [...byDecade.keys()].sort((a, b) => a - b);
  const first = decades[0];
  const last = decades[decades.length - 1];
  let begun = false;
  return steps.map((step) => {
    if (step.decade !== null) {
      begun = true;
      return byDecade.get(step.decade) ?? null;
    }
    const decade = begun ? last : first;
    return decade === undefined ? null : (byDecade.get(decade) ?? null);
  });
}
