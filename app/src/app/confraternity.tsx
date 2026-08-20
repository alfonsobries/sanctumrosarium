import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/tokens';

const ENROLL_URL = 'https://rosarycenter.org/enroll-in-the-rosary-confraternity';

/**
 * The Rosary Confraternity, in its own words: what it asks, what it gives, and where
 * the Dominicans enroll. The app never enrolls anyone and never calls anyone a member
 * (task 046, decision 11).
 */
export default function ConfraternityScreen() {
  const { t } = useTranslation();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="bodySerif" color="secondary" style={styles.lead}>
        {t('confraternity.lead')}
      </AppText>
      {(['what', 'luminous', 'benefits', 'enrollment', 'rule'] as const).map((block) => (
        <AppText key={block} variant="bodySerif" style={styles.block}>
          {t(`confraternity.blocks.${block}`)}
        </AppText>
      ))}
      <View style={styles.enroll}>
        <Button
          label={t('confraternity.enroll')}
          variant="secondary"
          onPress={() => void Linking.openURL(ENROLL_URL)}
        />
        <AppText variant="caption" color="muted" style={styles.enrollNote}>
          {t('confraternity.enrollNote')}
        </AppText>
      </View>
      <AppText variant="caption" color="muted" style={styles.source}>
        {t('confraternity.source')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: spacing.md },
  block: { marginTop: spacing.lg },
  enroll: { marginTop: spacing.xl },
  enrollNote: { marginTop: spacing.sm },
  source: { marginTop: spacing.xl },
});
