import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';

/**
 * The month's Rosaries as a crown of roses - the Rosary's own metaphor. Visual
 * inventory, never accumulated power: every rose is equal, nothing unlocks, nothing is
 * lost. Decorative for the screen reader; the caption next to it carries the count.
 */
type RoseCrownProperties = {
  count: number;
  size?: number;
};

export function RoseCrown({ count, size = 220 }: RoseCrownProperties) {
  const roses = Math.min(count, 62);
  const rings: number[][] = [];
  let remaining = roses;
  // A small month draws a small crown: the wreath grows with the roses.
  let radius = roses <= 6 ? 34 + roses * 4 : size / 2 - 16;
  while (remaining > 0 && radius > 20) {
    const capacity = Math.max(6, Math.floor((2 * Math.PI * radius) / 26));
    const inRing = Math.min(remaining, capacity);
    rings.push(
      Array.from({ length: inRing }, (_, index) => (index / inRing) * 2 * Math.PI),
    );
    remaining -= inRing;
    radius -= 30;
  }

  const ringRadius = roses <= 6 ? 34 + roses * 4 : size / 2 - 16;
  return (
    <View
      style={[styles.crown, { width: size, height: size }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {rings.map((angles, ringIndex) => {
        const currentRadius = ringRadius - ringIndex * 30;
        return angles.map((angle, index) => (
          <AppText
            key={`${ringIndex}-${index}`}
            variant="body"
            color="accent"
            style={[
              styles.rose,
              {
                transform: [
                  { translateX: Math.cos(angle - Math.PI / 2) * currentRadius },
                  { translateY: Math.sin(angle - Math.PI / 2) * currentRadius },
                ],
              },
            ]}
          >
            ✿
          </AppText>
        ));
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  crown: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rose: {
    position: 'absolute',
    fontSize: 18,
    lineHeight: 22,
  },
});
