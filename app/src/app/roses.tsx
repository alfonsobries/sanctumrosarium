import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { appJournal } from '@/features/journal/app-journal';
import { RoseCrown } from '@/features/journal/RoseCrown';
import { localDateOf } from '@/features/rosary/session-store';
import { useSettings } from '@/settings/settings-context';
import { monthTitle } from '@/shared/format';
import { spacing } from '@/theme/tokens';

type MonthRoses = {
  readonly year: number;
  readonly month: number;
  readonly count: number;
};

function rosesOf(year: number, month: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const from = localDateOf(new Date(year, month, 1));
  const to = localDateOf(new Date(year, month, daysInMonth));
  return appJournal.between(from, to).length;
}

/** Each month on its own: no grand total, no ordering by amount. */
function monthsWithRoses(now: Date): readonly MonthRoses[] {
  const first = appJournal.firstDate();
  const months: MonthRoses[] = [
    {
      year: now.getFullYear(),
      month: now.getMonth(),
      count: rosesOf(now.getFullYear(), now.getMonth()),
    },
  ];
  if (first === undefined) {
    return months;
  }
  let year = now.getFullYear();
  let month = now.getMonth() - 1;
  for (let count = 0; count < 12; count += 1) {
    if (month < 0) {
      month += 12;
      year -= 1;
    }
    if (`${year}-${String(month + 1).padStart(2, '0')}` < first.slice(0, 7)) {
      break;
    }
    months.push({ year, month, count: rosesOf(year, month) });
    month -= 1;
  }
  return months;
}

export default function RosesScreen() {
  const { t } = useTranslation();
  const { interfaceLanguage } = useSettings();
  const [months, setMonths] = useState<readonly MonthRoses[]>(() =>
    monthsWithRoses(new Date()),
  );

  useFocusEffect(
    useCallback(() => {
      setMonths(monthsWithRoses(new Date()));
    }, []),
  );

  const [current, ...past] = months;

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <View
        style={styles.block}
        accessible
        accessibilityLabel={`${monthTitle(current.year, current.month, interfaceLanguage)}. ${t('roses.count', { count: current.count })}`}
      >
        <AppText variant="heading" style={styles.center}>
          {monthTitle(current.year, current.month, interfaceLanguage)}
        </AppText>
        {current.count === 0 ? (
          <AppText variant="body" color="muted" style={styles.center}>
            {t('roses.empty')}
          </AppText>
        ) : (
          <RoseCrown count={current.count} />
        )}
        <AppText variant="caption" color="muted" style={styles.center}>
          {t('roses.count', { count: current.count })}
        </AppText>
      </View>

      {past
        .filter((month) => month.count > 0)
        .map((month) => (
          <View
            key={`${month.year}-${month.month}`}
            style={styles.past}
            accessible
            accessibilityLabel={`${monthTitle(month.year, month.month, interfaceLanguage)}. ${t('roses.count', { count: month.count })}`}
          >
            <AppText variant="caption" color="secondary" style={styles.center}>
              {monthTitle(month.year, month.month, interfaceLanguage)}
            </AppText>
            <RoseCrown count={month.count} size={140} />
            <AppText variant="caption" color="muted" style={styles.center}>
              {t('roses.count', { count: month.count })}
            </AppText>
          </View>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.lg, gap: spacing.md },
  past: { marginTop: spacing.xl, gap: spacing.sm },
  center: { textAlign: 'center' },
});
