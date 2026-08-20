import { ScrollView, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type ScreenProperties = {
  children: React.ReactNode;
  /** Scrolls by default: every screen has to survive the maximum system font size. */
  scroll?: boolean;
  edges?: readonly Edge[];
};

export function Screen({
  children,
  scroll = true,
  edges = ['top', 'bottom', 'left', 'right'],
}: ScreenProperties) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={[styles.flex, { backgroundColor: colors.background }]}
      >
        <View style={[styles.flex, styles.content]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: edges.includes('top') ? insets.top + spacing.md : spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg },
});
