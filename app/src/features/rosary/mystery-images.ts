import type { MysteryId } from '@rosario/content';
import type { ImageSourcePropType } from 'react-native';

/**
 * Static requires so Metro bundles the twenty works. Paths point at the content
 * package, which is the single copy of each file.
 */
export const mysteryImages: Readonly<Record<MysteryId, ImageSourcePropType>> = {
  'gaudiosa-1': require('../../../../packages/content/art/gaudiosa-1.jpg'),
  'gaudiosa-2': require('../../../../packages/content/art/gaudiosa-2.jpg'),
  'gaudiosa-3': require('../../../../packages/content/art/gaudiosa-3.jpg'),
  'gaudiosa-4': require('../../../../packages/content/art/gaudiosa-4.jpg'),
  'gaudiosa-5': require('../../../../packages/content/art/gaudiosa-5.jpg'),
  'luminosa-1': require('../../../../packages/content/art/luminosa-1.jpg'),
  'luminosa-2': require('../../../../packages/content/art/luminosa-2.jpg'),
  'luminosa-3': require('../../../../packages/content/art/luminosa-3.jpg'),
  'luminosa-4': require('../../../../packages/content/art/luminosa-4.jpg'),
  'luminosa-5': require('../../../../packages/content/art/luminosa-5.jpg'),
  'dolorosa-1': require('../../../../packages/content/art/dolorosa-1.jpg'),
  'dolorosa-2': require('../../../../packages/content/art/dolorosa-2.jpg'),
  'dolorosa-3': require('../../../../packages/content/art/dolorosa-3.jpg'),
  'dolorosa-4': require('../../../../packages/content/art/dolorosa-4.jpg'),
  'dolorosa-5': require('../../../../packages/content/art/dolorosa-5.jpg'),
  'gloriosa-1': require('../../../../packages/content/art/gloriosa-1.jpg'),
  'gloriosa-2': require('../../../../packages/content/art/gloriosa-2.jpg'),
  'gloriosa-3': require('../../../../packages/content/art/gloriosa-3.jpg'),
  'gloriosa-4': require('../../../../packages/content/art/gloriosa-4.jpg'),
  'gloriosa-5': require('../../../../packages/content/art/gloriosa-5.jpg'),
};
