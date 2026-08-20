import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SwitchRow } from '@/components/SwitchRow';
import { appJournal } from '@/features/journal/app-journal';
import { monthFidelity, type MonthFidelity } from '@/features/journal/fidelity';
import { MonthGrid } from '@/features/journal/MonthGrid';
import { localDateOf } from '@/features/rosary/session-store';
import { useSettings } from '@/settings/settings-context';
import { monthTitle } from '@/shared/format';
import { spacing } from '@/theme/tokens';

/** Previous months are history, not debt: shown, never added up or compared. */
function pastMonths(
  rule: Parameters<typeof monthFidelity>[0],
  now: Date,
): readonly MonthFidelity[] {
  const first = appJournal.firstDate();
  if (first === undefined) {
    return [];
  }
  const months: MonthFidelity[] = [];
  let year = now.getFullYear();
  let month = now.getMonth() - 1;
  for (let count = 0; count < 12; count += 1) {
    if (month < 0) {
      month += 12;
      year -= 1;
    }
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (key < first.slice(0, 7)) {
      break;
    }
    const fidelity = monthFidelity(
      rule,
      appJournal,
      (date) => appJournal.isPaused(date),
      now,
      year,
      month,
    );
    if (fidelity !== undefined) {
      months.push(fidelity);
    }
    month -= 1;
  }
  return months;
}

export default function FidelityScreen() {
  const { t } = useTranslation();
  const { settings, interfaceLanguage } = useSettings();

  const [state, setState] = useState(() => ({
    current: monthFidelity(
      settings.rule,
      appJournal,
      (date) => appJournal.isPaused(date),
      new Date(),
    ),
    paused: appJournal.pauseActive(),
    past: pastMonths(settings.rule, new Date()),
  }));

  const refresh = useCallback(() => {
    setState({
      current: monthFidelity(
        settings.rule,
        appJournal,
        (date) => appJournal.isPaused(date),
        new Date(),
      ),
      paused: appJournal.pauseActive(),
      past: pastMonths(settings.rule, new Date()),
    });
  }, [settings.rule]);

  useFocusEffect(refresh);

  const handlePause = (value: boolean) => {
    if (value) {
      appJournal.startPause(localDateOf(new Date()));
    } else {
      appJournal.endPause(localDateOf(new Date()));
    }
    refresh();
  };

  const line = (month: MonthFidelity) =>
    t(month.unit === 'weeks' ? 'fidelity.weeksLine' : 'fidelity.daysLine', {
      done: month.done,
      total: month.total,
    });

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      {state.current === undefined ? (
        <AppText variant="body" color="muted" style={styles.block}>
          {t('fidelity.noRule')}
        </AppText>
      ) : (
        <View style={styles.block} accessibilityLabel={line(state.current)} accessible>
          <AppText variant="heading">
            {monthTitle(state.current.year, state.current.month, interfaceLanguage)}
          </AppText>
          <MonthGrid month={state.current} size="wide" />
          <AppText variant="caption" color="muted">
            {line(state.current)}
          </AppText>
        </View>
      )}

      <Card style={styles.block}>
        <SwitchRow
          label={t('fidelity.pause')}
          description={t('fidelity.pauseHint')}
          value={state.paused}
          divider={false}
          onValueChange={handlePause}
        />
      </Card>

      {state.past.map((month) => (
        <View
          key={`${month.year}-${month.month}`}
          style={styles.past}
          accessibilityLabel={`${monthTitle(month.year, month.month, interfaceLanguage)}. ${line(month)}`}
          accessible
        >
          <AppText variant="caption" color="secondary">
            {monthTitle(month.year, month.month, interfaceLanguage)}
          </AppText>
          <MonthGrid month={month} />
          <AppText variant="caption" color="muted">
            {line(month)}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.lg, gap: spacing.sm },
  past: { marginTop: spacing.lg, gap: spacing.xs },
});
