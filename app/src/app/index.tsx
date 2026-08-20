import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { monthFidelity, type MonthFidelity } from '@/features/journal/fidelity';
import { MonthGrid } from '@/features/journal/MonthGrid';
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
  const [progress, setProgress] = useState<{
    today: ReturnType<typeof ruleProgress>;
    month: MonthFidelity | undefined;
  }>(() => ({
    today: ruleProgress(settings.rule, appJournal, new Date()),
    month: monthFidelity(
      settings.rule,
      appJournal,
      (date) => appJournal.isPaused(date),
      new Date(),
    ),
  }));
  useFocusEffect(
    useCallback(() => {
      setProgress({
        today: ruleProgress(settings.rule, appJournal, new Date()),
        month: monthFidelity(
          settings.rule,
          appJournal,
          (date) => appJournal.isPaused(date),
          new Date(),
        ),
      });
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

      {progress.month === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('fidelity.title')}
          onPress={() => router.push('/fidelity')}
          style={({ pressed }) => [styles.ruleLine, pressed && styles.pressed]}
        >
          <MonthGrid month={progress.month} />
          <AppText variant="caption" color="muted">
            {progress.today === undefined || progress.today.decades === 0
              ? t(`rule.names.${settings.rule}`)
              : t(
                  progress.today.period === 'day'
                    ? 'rule.progressDay'
                    : 'rule.progressWeek',
                  { done: progress.today.decades, target: progress.today.target },
                )}
          </AppText>
        </Pressable>
      )}

      <Button label={t('home.start')} onPress={() => router.push('/pray')} />
      <View style={styles.litanyLink}>
        <Button
          label={t('litany.title')}
          variant="ghost"
          onPress={() => router.push('/litany')}
        />
      </View>
      {settings.caminoEnabled ? (
        <View style={styles.litanyLink}>
          <Button
            label={t('camino.title')}
            variant="ghost"
            onPress={() => router.push('/camino')}
          />
        </View>
      ) : null}

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
  litanyLink: { marginTop: spacing.xs },
  ruleLine: {
    marginBottom: spacing.md,
    minHeight: touchTarget / 2,
    justifyContent: 'center',
  },
});
