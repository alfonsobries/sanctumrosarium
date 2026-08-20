import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type BeadTrackProperties = {
  /** One-based Hail Mary being prayed, or undefined outside the ten beads. */
  bead?: number;
};

const BEADS = Array.from({ length: 10 }, (_, index) => index + 1);

/**
 * The ten beads of the decade, drawn small: the metaphor everyone knows, without
 * stealing room from the text. Decorative — the caption next to it carries the count.
 */
export function BeadTrack({ bead }: BeadTrackProperties) {
  const colors = useTheme();
  const prayed = bead === undefined ? 0 : bead - 1;

  return (
    <View
      style={styles.row}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {BEADS.map((position) => {
        const isCurrent = bead === position;
        const isPrayed = position <= prayed;
        return (
          <View
            key={position}
            style={[
              styles.bead,
              isCurrent && styles.current,
              {
                backgroundColor: isCurrent
                  ? colors.accent
                  : isPrayed
                    ? colors.accentSoft
                    : 'transparent',
                borderColor: isCurrent || isPrayed ? 'transparent' : colors.borderStrong,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bead: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  current: {
    width: 14,
    height: 14,
  },
});
