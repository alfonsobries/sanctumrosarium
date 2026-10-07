import { Image } from 'expo-image';
import { View, type ViewStyle } from 'react-native';

import type { Artwork } from './artworks';

type ArtworkFrameProperties = {
  artwork: Artwork;
  style?: ViewStyle;
  className?: string;
};

/**
 * Shows a work whole, never cropped: the picture is fitted inside the frame and the
 * space around it is filled with a soft blur of the same picture.
 */
export function ArtworkFrame({ artwork, style, className }: ArtworkFrameProperties) {
  return (
    <View
      className={`overflow-hidden rounded-card ${className ?? ''}`}
      style={[{ backgroundColor: artwork.color, borderCurve: 'continuous' }, style]}
    >
      <Image
        source={artwork.source}
        placeholder={{ thumbhash: artwork.thumbhash }}
        contentFit="cover"
        blurRadius={40}
        style={{ position: 'absolute', inset: -20, opacity: 0.85 }}
        accessible={false}
      />
      <Image
        source={artwork.source}
        placeholder={{ thumbhash: artwork.thumbhash }}
        contentFit="contain"
        transition={200}
        accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
        style={{ flex: 1 }}
      />
    </View>
  );
}
