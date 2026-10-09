import { Image } from 'expo-image';
import { View, type ViewStyle } from 'react-native';

import type { Artwork } from './artworks';

/** The widest a frame grows, so a square picture stays in proportion on a tablet. */
export const artworkMaxWidth = 560;

type ArtworkFrameProperties = {
  artwork: Artwork;
  style?: ViewStyle;
  className?: string;
};

/**
 * A square frame for a mystery's image. Square artwork fills it edge to edge; a work of any
 * other shape is shown whole, never cropped, over a soft blur of the same picture.
 */
export function ArtworkFrame({ artwork, style, className }: ArtworkFrameProperties) {
  const contained = artwork.fill === 'contain';
  return (
    <View
      className={`overflow-hidden rounded-card ${className ?? ''}`}
      style={[{ aspectRatio: 1, backgroundColor: artwork.color, borderCurve: 'continuous' }, style]}
    >
      {contained && (
        <Image
          source={artwork.source}
          placeholder={{ thumbhash: artwork.thumbhash }}
          contentFit="cover"
          blurRadius={40}
          style={{ position: 'absolute', inset: -20, opacity: 0.85 }}
          accessible={false}
        />
      )}
      <Image
        source={artwork.source}
        placeholder={{ thumbhash: artwork.thumbhash }}
        contentFit={artwork.fill}
        transition={200}
        accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
        style={{ flex: 1 }}
      />
    </View>
  );
}
