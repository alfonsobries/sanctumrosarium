import type { MysteryRef, RosaryOptions, Step } from './types';

export class InvalidRosaryOptions extends Error {}

function decadeSteps(decade: number, mystery: MysteryRef, options: RosaryOptions): Step[] {
  const steps: Step[] = [
    {
      id: `d${decade}-announce`,
      kind: 'announce',
      section: 'decade',
      decade,
      mystery,
      bead: { kind: 'decade-large', decade },
    },
  ];

  const reading = options.readingFor?.(mystery) ?? null;
  if (reading !== null) {
    steps.push({
      id: `d${decade}-reading`,
      kind: 'reading',
      section: 'decade',
      decade,
      mystery,
      reading,
      bead: { kind: 'decade-large', decade },
    });
  }

  steps.push({
    id: `d${decade}-our-father`,
    kind: 'prayer',
    prayer: 'our-father',
    section: 'decade',
    decade,
    count: null,
    bead: { kind: 'decade-large', decade },
  });

  for (let index = 1; index <= 10; index++) {
    steps.push({
      id: `d${decade}-hail-mary-${index}`,
      kind: 'prayer',
      prayer: 'hail-mary',
      section: 'decade',
      decade,
      count: { index, total: 10 },
      bead: { kind: 'decade-small', decade, index },
    });
  }

  steps.push({
    id: `d${decade}-glory-be`,
    kind: 'prayer',
    prayer: 'glory-be',
    section: 'decade',
    decade,
    count: null,
    bead: null,
  });

  if (options.fatimaPrayer) {
    steps.push({
      id: `d${decade}-fatima`,
      kind: 'prayer',
      prayer: 'fatima-prayer',
      section: 'decade',
      decade,
      count: null,
      bead: null,
    });
  }

  return steps;
}

function openingSteps(): Step[] {
  const steps: Step[] = [
    {
      id: 'opening-creed',
      kind: 'prayer',
      prayer: 'apostles-creed',
      section: 'opening',
      decade: null,
      count: null,
      bead: { kind: 'crucifix' },
    },
    {
      id: 'opening-our-father',
      kind: 'prayer',
      prayer: 'our-father',
      section: 'opening',
      decade: null,
      count: null,
      bead: { kind: 'opening-large' },
    },
  ];

  for (let index = 1; index <= 3; index++) {
    steps.push({
      id: `opening-hail-mary-${index}`,
      kind: 'prayer',
      prayer: 'hail-mary',
      section: 'opening',
      decade: null,
      count: { index, total: 3 },
      bead: { kind: 'opening-small', index },
    });
  }

  steps.push({
    id: 'opening-glory-be',
    kind: 'prayer',
    prayer: 'glory-be',
    section: 'opening',
    decade: null,
    count: null,
    bead: null,
  });

  return steps;
}

function closingSteps(options: RosaryOptions): Step[] {
  const steps: Step[] = [];
  const add = (prayer: 'hail-holy-queen' | 'litany-of-loreto' | 'rosary-closing-prayer'): void => {
    steps.push({
      id: `closing-${prayer}`,
      kind: 'prayer',
      prayer,
      section: 'closing',
      decade: null,
      count: null,
      bead: { kind: 'centerpiece' },
    });
  };

  if (options.hailHolyQueen) {
    add('hail-holy-queen');
  }
  if (options.litany) {
    add('litany-of-loreto');
  }
  if (options.closingPrayer) {
    add('rosary-closing-prayer');
  }

  return steps;
}

/**
 * Builds the ordered steps of one Rosary (or one decade). The essential core - each
 * mystery announced, Our Father, ten Hail Marys and Glory Be - is always present; only
 * the frame around it is optional.
 */
export function buildSequence(options: RosaryOptions): Step[] {
  if (options.mysteries.length !== 5) {
    throw new InvalidRosaryOptions(`Expected 5 mysteries, got ${options.mysteries.length}`);
  }
  if (options.mysteries.some((mystery) => mystery.set !== options.set)) {
    throw new InvalidRosaryOptions(`Every mystery must belong to the ${options.set} set`);
  }

  const ordered = [...options.mysteries].sort((a, b) => a.order - b.order);
  const decades =
    options.scope.kind === 'full'
      ? [1, 2, 3, 4, 5]
      : [options.scope.decade].filter((decade) => decade >= 1 && decade <= 5);

  if (decades.length === 0) {
    throw new InvalidRosaryOptions('Decade must be between 1 and 5');
  }

  const steps: Step[] = [
    {
      id: 'sign-of-the-cross',
      kind: 'prayer',
      prayer: 'sign-of-the-cross',
      section: 'opening',
      decade: null,
      count: null,
      bead: { kind: 'crucifix' },
    },
  ];

  if (options.opening && options.scope.kind === 'full') {
    steps.push(...openingSteps());
  }

  for (const decade of decades) {
    const mystery = ordered[decade - 1];
    if (mystery === undefined) {
      throw new InvalidRosaryOptions(`Missing mystery for decade ${decade}`);
    }
    steps.push(...decadeSteps(decade, mystery, options));
  }

  if (options.scope.kind === 'full') {
    steps.push(...closingSteps(options));
  }

  steps.push({
    id: 'closing-sign-of-the-cross',
    kind: 'prayer',
    prayer: 'sign-of-the-cross',
    section: 'closing',
    decade: null,
    count: null,
    bead: { kind: 'crucifix' },
  });

  return steps;
}
