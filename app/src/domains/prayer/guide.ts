import type { Step } from '@sanctamaria/rosary';

export type GuideKey =
  | 'signOfTheCross'
  | 'creed'
  | 'openingOurFather'
  | 'openingHailMary'
  | 'openingGlory'
  | 'announce'
  | 'reading'
  | 'ourFather'
  | 'hailMary'
  | 'glory'
  | 'fatima'
  | 'hailHolyQueen'
  | 'litany'
  | 'closingPrayer'
  | 'pope';

function keyOf(step: Step): GuideKey | null {
  if (step.kind === 'announce') {
    return 'announce';
  }
  if (step.kind === 'reading') {
    return 'reading';
  }
  const opening = step.section === 'opening';
  if (step.intention === 'pope') {
    return step.prayer === 'our-father' ? 'pope' : null;
  }
  switch (step.prayer) {
    case 'sign-of-the-cross':
      return step.section === 'closing' ? null : 'signOfTheCross';
    case 'apostles-creed':
      return 'creed';
    case 'our-father':
      return opening ? 'openingOurFather' : 'ourFather';
    case 'hail-mary':
      return step.count?.index === 1 ? (opening ? 'openingHailMary' : 'hailMary') : null;
    case 'glory-be':
      return opening ? 'openingGlory' : 'glory';
    case 'fatima-prayer':
      return 'fatima';
    case 'hail-holy-queen':
      return 'hailHolyQueen';
    case 'litany-of-loreto':
      return 'litany';
    case 'rosary-closing-prayer':
      return 'closingPrayer';
  }
}

/** The explanation shown with a step in guided mode: only the first time each part appears. */
export function guideFor(steps: readonly Step[], position: number): GuideKey | null {
  const step = steps[position];
  if (step === undefined) {
    return null;
  }
  const key = keyOf(step);
  if (key === null) {
    return null;
  }
  const seenBefore = steps.slice(0, position).some((earlier) => keyOf(earlier) === key);
  return seenBefore ? null : key;
}
