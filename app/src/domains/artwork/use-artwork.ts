import { useSkin } from '@/shared/theme/SkinProvider';

import { artworks as classic, type Artwork } from './artworks';
import { illustrated } from './illustrated';

/** The image a mystery shows in the current skin, or null when the skin keeps to text. */
export function useArtwork(mysteryId: string): Artwork | null {
  const { skin } = useSkin();
  switch (skin.artwork) {
    case 'none':
      return null;
    case 'classic':
      return classic[mysteryId] ?? null;
    default:
      return illustrated[skin.artwork][mysteryId] ?? classic[mysteryId] ?? null;
  }
}
