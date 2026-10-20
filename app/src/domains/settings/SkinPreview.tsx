import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Text as NativeText, Pressable, View } from 'react-native';

import { artworks, type Artwork } from '@/domains/artwork/artworks';
import { illustrated } from '@/domains/artwork/illustrated';
import { skins, type ArtworkStyle, type SkinId } from '@/shared/theme/skins';
import { textures } from '@/shared/theme/textures';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Text } from '@/shared/ui/Text';

const previewArt: Record<ArtworkStyle, Artwork | undefined> = {
  none: undefined,
  classic: artworks['joyful-1-annunciation'],
  glass: illustrated.glass['joyful-1-annunciation'],
  guadalupana: illustrated.guadalupana['joyful-1-annunciation'],
  trazo: illustrated.trazo['joyful-1-annunciation'],
  kids: illustrated.kids['joyful-1-annunciation'],
  maestros: illustrated.maestros['joyful-1-annunciation'],
};

type SkinPreviewProperties = { id: SkinId; selected: boolean; onPress: () => void };

/** A small page of the prayer drawn in a skin, so each style is chosen by sight. */
export function SkinPreview({ id, selected, onPress }: SkinPreviewProperties) {
  const { t } = useTranslation();
  const { scheme } = useSkin();
  const skin = skins[id];
  const palette = skin[scheme];
  const art = previewArt[skin.artwork];
  const texture = skin.texture === undefined ? undefined : textures[skin.texture][scheme];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={t(`settings.skins.${id}`)}
      onPress={onPress}
      className="w-[132px] gap-2"
    >
      <View
        className="h-[220px] gap-2 overflow-hidden p-3"
        style={{
          backgroundColor: palette.background,
          borderRadius: Math.min(skin.radius, 20) + 4,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? palette.accent : palette.border,
          borderCurve: 'continuous',
        }}
      >
        {texture !== undefined && (
          <Image source={texture} contentFit="cover" style={{ position: 'absolute', inset: 0 }} />
        )}
        {/* Each preview shows its own skin's type, never the scale of the skin in use. */}
        <NativeText
          style={{ fontFamily: skin.fonts.display, color: palette.foreground, fontSize: 17, lineHeight: 21 }}
          numberOfLines={2}
        >
          {t('sets.joyful')}
        </NativeText>
        {art !== undefined ? (
          <View
            className="flex-1 overflow-hidden"
            style={{ borderRadius: Math.min(skin.radius, 14), backgroundColor: art.color }}
          >
            <Image
              source={art.source}
              placeholder={{ thumbhash: art.thumbhash }}
              contentFit="cover"
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <NativeText
            style={{
              flex: 1,
              fontFamily: skin.fonts.prayer,
              color: palette.foreground,
              fontSize: 14,
              lineHeight: 19,
            }}
          >
            Ave Maria, gratia plena, Dominus tecum.
          </NativeText>
        )}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: i < 2 ? palette['bead-done'] : palette.bead }}
              />
            ))}
          </View>
          <View className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.accent }} />
        </View>
      </View>
      <Text variant="footnote" className={`text-center ${selected ? 'font-semibold text-foreground' : ''}`}>
        {t(`settings.skins.${id}`)}
      </Text>
    </Pressable>
  );
}
