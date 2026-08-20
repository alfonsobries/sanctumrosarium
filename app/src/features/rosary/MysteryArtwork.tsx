import { artworks, type MysteryId } from '@rosario/content';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { mysteryImages } from './mystery-images';

type MysteryArtworkProperties = {
  readonly mysteryId: MysteryId;
  readonly mysteryTitle: string;
};

export function MysteryArtwork({ mysteryId, mysteryTitle }: MysteryArtworkProperties) {
  const { t } = useTranslation();
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const artwork = artworks[mysteryId];

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('artwork.alt', {
          title: artwork.title,
          artist: artwork.artist,
        })}
        accessibilityHint={t('artwork.hint')}
        onPress={() => setOpen((current) => !current)}
        style={[styles.frame, { backgroundColor: colors.surface }]}
      >
        <Image
          source={mysteryImages[mysteryId]}
          accessibilityIgnoresInvertColors
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.caption, { backgroundColor: colors.background }]}>
          <AppText variant="heading" accessibilityRole="header">
            {mysteryTitle}
          </AppText>
        </View>
      </Pressable>
      {open ? (
        <View style={styles.ficha} accessibilityRole="summary">
          <AppText variant="bodySerif">{artwork.title}</AppText>
          <AppText variant="caption" color="secondary">
            {artwork.artist}, {artwork.year}
          </AppText>
          <AppText variant="caption" color="muted">
            {artwork.museum}
          </AppText>
          <AppText variant="caption" color="muted">
            {t('artwork.license', { license: artwork.license })}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  frame: {
    borderRadius: radius.md,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
  },
  image: { width: '100%', height: '100%' },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    opacity: 0.92,
  },
  ficha: { gap: 2, paddingHorizontal: spacing.xs },
});
