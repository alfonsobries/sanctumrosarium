import {
  advance,
  buildRosary,
  goBack,
  mysteriesOfDay,
  progressOf,
  startSession,
} from '@rosario/engine';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/settings/settings-context';
import { spacing, touchTarget } from '@/theme/tokens';

export default function PrayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { prayerLocale, prayerLanguage, prayerForm } = useSettings();

  const steps = useMemo(() => {
    const today = mysteriesOfDay(new Date());
    return buildRosary({ form: prayerForm, locale: prayerLocale, set: today.set });
  }, [prayerForm, prayerLocale]);

  const [session, setSession] = useState(() => startSession(new Date()));
  const progress = progressOf(session, steps);
  const step = steps[progress.stepIndex];

  if (step === undefined) {
    const set = mysteriesOfDay(new Date()).set;
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <AppText variant="display" accessibilityRole="header">
            {t(`sets.${set}`)}
          </AppText>
          <AppText variant="bodySerif" color="secondary">
            {t('pray.doneDecades')}
          </AppText>
          <Button label={t('pray.finish')} onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  // The mystery is on every step of a decade: the bead count never shows without it.
  const mystery = 'mystery' in step ? step.mystery : undefined;

  return (
    <Screen scroll={false}>
      <Pressable
        accessibilityHint={t('pray.advanceHint')}
        style={styles.flex}
        onPress={() => setSession(advance(session, steps, new Date()))}
      >
        <View style={styles.center}>
          {mystery === undefined ? null : (
            <AppText variant="overline" color="muted">
              {mystery.text[prayerLanguage].title.toUpperCase()}
            </AppText>
          )}

          {step.kind === 'prayer' ? (
            <View style={styles.lines}>
              {step.prayer.lines.map((line) => (
                <AppText key={line} variant="prayer">
                  {line}
                </AppText>
              ))}
            </View>
          ) : null}

          {step.kind === 'announce' ? (
            <AppText variant="title" accessibilityRole="header">
              {step.mystery.text[prayerLanguage].title}
            </AppText>
          ) : null}

          {progress.beadInDecade === undefined ? null : (
            <AppText variant="caption" color="muted">
              {t('pray.beadCount', {
                bead: progress.beadInDecade,
                decade: (progress.decade ?? 0) + 1,
              })}
            </AppText>
          )}
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        accessibilityHint={t('pray.backHint')}
        hitSlop={16}
        onPress={() => setSession(goBack(session))}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <AppText variant="label" color="muted">
          {t('common.back')}
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', gap: spacing.md },
  lines: { gap: spacing.xs },
  back: {
    minHeight: touchTarget,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: { opacity: 0.6 },
});
