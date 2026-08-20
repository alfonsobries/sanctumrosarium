import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { ruleProgress } from '@/features/journal/rule';
import { useToday } from '@/features/rosary/use-today';
import { useSettings } from '@/settings/settings-context';
import { spacing, touchTarget } from '@/theme/tokens';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLanguage, settings } = useSettings();
  const today = useToday();
  // Recomputed on focus: coming back from praying shows the decades just prayed.
  const [progress, setProgress] = useState(() =>
    ruleProgress(settings.rule, appJournal, new Date()),
  );
  useFocusEffect(
    useCallback(() => {
      setProgress(ruleProgress(settings.rule, appJournal, new Date()));
    }, [settings.rule]),
  );

  const reason =
    today.reason === 'solemnity'
      ? t('home.todayReasonSolemnity', { feast: today.feast })
      : today.reason === 'season'
        ? t('home.todayReasonSeason', { season: t(`seasons.${today.season}`) })
        : t('home.todayReasonWeekday');

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          testID="open-settings"
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingsLink, pressed && styles.pressed]}
        >
          <AppText variant="label" color="accent">
            {t('home.settings')}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.today}>
        <AppText variant="display" accessibilityRole="header">
          {t(`sets.${today.set}`)}
        </AppText>
        <AppText variant="body" color="muted">
          {reason}
        </AppText>

        <View style={styles.mysteries}>
          {today.mysteries.map((mystery) => (
            <AppText key={mystery.id} variant="bodySerif" color="secondary">
              {mystery.text[prayerLanguage].title}
            </AppText>
          ))}
        </View>
      </View>

      {progress === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('rule.title')}
          onPress={() => router.push('/rule')}
          style={({ pressed }) => [styles.ruleLine, pressed && styles.pressed]}
        >
          <AppText variant="caption" color="muted">
            {progress.decades === 0
              ? t(`rule.names.${settings.rule}`)
              : t(progress.period === 'day' ? 'rule.progressDay' : 'rule.progressWeek', {
                  done: progress.decades,
                  target: progress.target,
                })}
          </AppText>
        </Pressable>
      )}

      <Button label={t('home.start')} onPress={() => router.push('/pray')} />

      {__DEV__ ? (
        <View style={styles.devLink}>
          <Button
            label="Galería de UI"
            variant="ghost"
            onPress={() => router.push('/dev')}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end' },
  settingsLink: { minHeight: touchTarget, justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  today: { gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xxl },
  mysteries: { gap: spacing.sm, marginTop: spacing.md },
  devLink: { marginTop: spacing.sm },
  ruleLine: {
    marginBottom: spacing.md,
    minHeight: touchTarget / 2,
    justifyContent: 'center',
  },
});
