import { StyleSheet } from 'react-native';

import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type SectionHeaderProperties = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProperties) {
  return (
    <AppText
      variant="overline"
      color="muted"
      accessibilityRole="header"
      style={styles.base}
    >
      {title.toUpperCase()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  base: { marginTop: spacing.xl, marginBottom: spacing.xs },
});
