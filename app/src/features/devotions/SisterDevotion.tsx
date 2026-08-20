import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { localDateOf } from '@/features/rosary/session-store';
import { spacing } from '@/theme/tokens';

export type SisterDevotionKind = 'chaplet' | 'seven-sorrows';

type SisterDevotionProperties = {
  readonly kind: SisterDevotionKind;
};

/**
 * A devotion that is not the Rosary: its own name, its own mark, never a decade of
 * the Rule or a rose of the month (task 045; DPPL 202).
 */
export function SisterDevotion({ kind }: SisterDevotionProperties) {
  const { t } = useTranslation();
  const [marked, setMarked] = useState(false);

  const refresh = useCallback(() => {
    setMarked(appJournal.hasKindOn(kind, localDateOf(new Date())));
  }, [kind]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleMark = () => {
    const now = new Date();
    appJournal.add({
      startedAt: now.toISOString(),
      finishedAt: now.toISOString(),
      decades: 0,
      localDate: localDateOf(now),
      kind,
    });
    refresh();
  };

  const handleUnmark = () => {
    appJournal.unmarkKindOn(kind, localDateOf(new Date()));
    refresh();
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="bodySerif" color="secondary" style={styles.lead}>
        {t(`${kind}.lead`)}
      </AppText>
      <AppText variant="bodySerif" style={styles.block}>
        {t(`${kind}.structure`)}
      </AppText>
      <AppText variant="bodySerif" style={styles.block}>
        {t(`${kind}.texts`)}
      </AppText>
      <AppText variant="bodySerif" style={styles.block}>
        {t(`${kind}.notRosary`)}
      </AppText>
      <View style={styles.mark}>
        {marked ? (
          <>
            <AppText variant="caption" color="muted">
              {t(`${kind}.markedToday`)}
            </AppText>
            <Button label={t(`${kind}.unmark`)} variant="ghost" onPress={handleUnmark} />
          </>
        ) : (
          <Button label={t(`${kind}.mark`)} onPress={handleMark} />
        )}
      </View>
      <AppText variant="caption" color="muted" style={styles.source}>
        {t(`${kind}.source`)}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { marginTop: spacing.md },
  block: { marginTop: spacing.lg },
  mark: { marginTop: spacing.xl, gap: spacing.sm },
  source: { marginTop: spacing.xl },
});
