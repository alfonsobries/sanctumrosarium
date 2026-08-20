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
  /** Centers short content vertically while still scrolling when it grows. */
  center?: boolean;
  edges?: readonly Edge[];
};

export function Screen({
  children,
  scroll = true,
  center = false,
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
        center && styles.center,
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
  center: { flexGrow: 1, justifyContent: 'center' },
});
