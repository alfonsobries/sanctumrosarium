import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import type { MonthFidelity } from './fidelity';

type MonthGridProperties = {
  month: MonthFidelity;
  /** Compact for the home screen, wide for the faithfulness screen. */
  size?: 'compact' | 'wide';
};

/**
 * The month as marks that fill in. Decorative for the screen reader: the line next to
 * the grid carries the count. A gap is just an outline - no red, no drama - and paused
 * days use a different shape, never only a different colour.
 */
export function MonthGrid({ month, size = 'compact' }: MonthGridProperties) {
  const colors = useTheme();
  const cell = size === 'compact' ? 10 : 16;
  const marks = month.unit === 'weeks' ? month.weeks : month.days;

  return (
    <View
      style={[styles.grid, { gap: size === 'compact' ? spacing.xs : spacing.sm }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {marks.map((mark, index) => (
        <View
          key={index}
          style={[
            { width: cell },
            styles.cell,
            mark === 'paused' ? { height: 3 } : { height: cell },
            mark === 'faithful' && { backgroundColor: colors.accentSoft },
            mark === 'empty' && {
              borderWidth: 1,
              borderColor: colors.borderStrong,
            },
            mark === 'paused' && { backgroundColor: colors.borderStrong },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    // Seven wide cells plus their gaps: the grid wraps weekly.
    maxWidth: 7 * 16 + 6 * spacing.sm + 6 * spacing.sm,
  },
  cell: {
    borderRadius: radius.full,
  },
});
