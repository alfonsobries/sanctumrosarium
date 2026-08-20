import { schoolPages } from '@rosario/content';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/settings/settings-context';
import { spacing } from '@/theme/tokens';

/**
 * The school of the Rosary: pages to read, from the content package. The same pages the
 * site serves; nothing is written twice (task 034).
 */
export default function SchoolScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { interfaceLanguage } = useSettings();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="caption" color="muted" style={styles.intro}>
        {t('school.intro')}
      </AppText>
      <Card>
        {schoolPages.map((page, index) => (
          <ListRow
            key={page.id}
            label={page.text[interfaceLanguage].title}
            divider={index < schoolPages.length - 1}
            onPress={() => router.push(`/school/${page.id}`)}
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: spacing.md, marginBottom: spacing.md },
});
