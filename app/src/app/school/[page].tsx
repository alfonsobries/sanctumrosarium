import { findSchoolPage, type SchoolBlock } from '@rosario/content';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/settings/settings-context';
import { spacing } from '@/theme/tokens';

/**
 * One page of the school. Every statement shows its source, and magisterium, liturgy
 * and pious tradition are labeled apart: the reader always knows who is speaking.
 */
export default function SchoolPageScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ page: string }>();
  const { interfaceLanguage } = useSettings();
  const page = findSchoolPage(params.page ?? '');

  if (page === undefined) {
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        <AppText variant="body" style={styles.lead}>
          {t('error.screen')}
        </AppText>
      </Screen>
    );
  }

  const text = page.text[interfaceLanguage];

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: text.title }} />
      <AppText variant="bodySerif" color="secondary" style={styles.lead}>
        {text.lead}
      </AppText>
      {text.blocks.map((block, index) => (
        <SchoolBlockView key={index} block={block} />
      ))}
      <AppText variant="caption" color="muted" style={styles.source}>
        {t('school.source', { name: page.source[interfaceLanguage].name })}
      </AppText>
    </Screen>
  );
}

function SchoolBlockView({ block }: { block: SchoolBlock }) {
  const { t } = useTranslation();
  const kind = block.kind ?? 'note';
  const cite =
    block.cite === undefined
      ? undefined
      : kind === 'note'
        ? block.cite
        : `${t(`school.kind.${kind}`)} · ${block.cite}`;
  return (
    <View style={styles.block}>
      <AppText variant="bodySerif">{block.text}</AppText>
      {cite === undefined ? null : (
        <AppText variant="caption" color="muted" style={styles.cite}>
          {cite}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: spacing.md },
  block: { marginTop: spacing.lg },
  cite: { marginTop: spacing.xs },
  source: { marginTop: spacing.xl },
});
