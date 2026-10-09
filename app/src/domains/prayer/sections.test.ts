import { buildSequence, type MysteryRef, type RosaryOptions } from '@sanctamaria/rosary';
import { describe, expect, it } from 'vitest';

import { sectionsOf } from './sections';

const options: RosaryOptions = {
  set: 'joyful',
  mysteries: [1, 2, 3, 4, 5].map((order): MysteryRef => ({
    id: `j${order}`,
    set: 'joyful',
    order,
    readings: [],
  })),
  scope: { kind: 'full' },
  opening: true,
  openingForm: 'standard',
  readingFor: null,
  fatimaPrayer: true,
  prayerForThePope: true,
  hailHolyQueen: true,
  litany: true,
  closingPrayer: true,
};

describe('sectionsOf', () => {
  it('lists the opening, the five mysteries and each closing prayer', () => {
    const sections = sectionsOf(buildSequence(options));
    expect(sections.map((section) => (section.kind === 'closing' ? section.prayer : section.kind))).toEqual([
      'opening',
      'decade',
      'decade',
      'decade',
      'decade',
      'decade',
      'pope',
      'hail-holy-queen',
      'litany-of-loreto',
      'rosary-closing-prayer',
    ]);
  });

  it('starts each decade on its announcement and covers every step once', () => {
    const steps = buildSequence(options);
    const sections = sectionsOf(steps);
    const third = sections.find((section) => section.kind === 'decade' && section.decade === 3);
    expect(third).toMatchObject({ mysteryId: 'j3' });
    expect(steps[third?.start ?? -1]?.kind).toBe('announce');
    expect(sections[0]?.start).toBe(0);
    expect(sections.at(-1)?.end).toBe(steps.length - 1);
    sections.slice(1).forEach((section, index) => {
      expect(section.start).toBe((sections[index]?.end ?? 0) + 1);
    });
  });

  it('holds only the decade prayed when the scope is one decade', () => {
    const sections = sectionsOf(buildSequence({ ...options, scope: { kind: 'decade', decade: 2 } }));
    expect(sections.filter((section) => section.kind === 'decade')).toMatchObject([{ decade: 2 }]);
  });
});
