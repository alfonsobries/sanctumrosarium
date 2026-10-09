import { useSkin } from '@/shared/theme/SkinProvider';
import type { ArtworkStyle } from '@/shared/theme/skins';

import { artworks as classic, type Artwork } from './artworks';
import { illustrated } from './illustrated';

/** The image a mystery has in an artwork style, or null for the style that keeps to text. */
export function artworkFor(style: ArtworkStyle, mysteryId: string): Artwork | null {
  switch (style) {
    case 'none':
      return null;
    case 'classic':
      return classic[mysteryId] ?? null;
    default:
      return illustrated[style][mysteryId] ?? classic[mysteryId] ?? null;
  }
}

/** The image a mystery shows in the current skin, or null when the skin keeps to text. */
export function useArtwork(mysteryId: string): Artwork | null {
  const { skin } = useSkin();
  return artworkFor(skin.artwork, mysteryId);
}
