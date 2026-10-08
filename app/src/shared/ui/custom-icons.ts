import type { IconNode } from 'lucide-react-native';

type IconElement = IconNode[number];

/**
 * Icons specific to the Rosary, drawn on Lucide's grid (24 px, 2 px stroke, round caps,
 * radius-1 corners) so they sit next to the library's icons without standing out.
 */

export const LatinCrossIcon: IconNode = [
  [
    'path',
    {
      d: 'M11 2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-3a1 1 0 0 1-1-1V3a1 1 0 0 0-1-1z',
      key: 'latin-cross',
    },
  ],
];

const bead = (cx: number, cy: number, key: string, r = 1.5): IconElement => ['circle', { cx, cy, r, key }];

export const RosaryIcon: IconNode = [
  bead(12, 2.75, 'b0'),
  bead(17, 5.25, 'b1'),
  bead(17, 10.25, 'b2'),
  bead(7, 10.25, 'b3'),
  bead(7, 5.25, 'b4'),
  ['path', { d: 'M12 13v9M9.5 16.5h5', key: 'cross' }],
];

/** One decade: the Our Father bead set apart, then the Hail Marys. */
export const DecadeIcon: IconNode = [
  ['circle', { cx: 4.5, cy: 12, r: 2.5, key: 'of' }],
  bead(10.5, 12, 'h1'),
  bead(15, 12, 'h2'),
  bead(19.5, 12, 'h3'),
];
