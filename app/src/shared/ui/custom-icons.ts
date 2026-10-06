import type { IconSvgElement } from '@hugeicons/react-native';

/**
 * Icons specific to the Rosary, drawn on Hugeicons' grid (24 px, 1.5 stroke, round caps
 * and joins) so they sit next to the library's icons without standing out.
 */

const stroke = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: '1.5',
} as const;

const bead = (cx: number, cy: number, key: string, r = 1) =>
  ['circle', { cx, cy, r, ...stroke, key }] as const;

export const LatinCrossIcon: IconSvgElement = [
  [
    'path',
    {
      d: 'M10 3.5C10 2.67 10.67 2 11.5 2H12.5C13.33 2 14 2.67 14 3.5V6H17.5C18.33 6 19 6.67 19 7.5V8.5C19 9.33 18.33 10 17.5 10H14V20.5C14 21.33 13.33 22 12.5 22H11.5C10.67 22 10 21.33 10 20.5V10H6.5C5.67 10 5 9.33 5 8.5V7.5C5 6.67 5.67 6 6.5 6H10V3.5Z',
      ...stroke,
      key: '0',
    },
  ],
];

export const RosaryIcon: IconSvgElement = [
  bead(12, 2.5, '0', 1.5),
  bead(17.2, 5.2, '1', 1.5),
  bead(17.2, 10.8, '2', 1.5),
  bead(6.8, 10.8, '3', 1.5),
  bead(6.8, 5.2, '4', 1.5),
  ['path', { d: 'M12 13V22M9.75 16.5H14.25', ...stroke, key: '5' }],
];

/** One decade: the Our Father bead set apart, then the Hail Marys. */
export const DecadeIcon: IconSvgElement = [
  ['circle', { cx: 4.5, cy: 12, r: 2.25, ...stroke, key: '0' }],
  ['path', { d: 'M6.75 12H7.75', ...stroke, key: '1' }],
  bead(9.75, 12, '2', 1.5),
  bead(14.5, 12, '3', 1.5),
  bead(19.25, 12, '4', 1.5),
];
