import { formatLocalDate, localDateOf, type LocalDate, type MysterySet } from '@sanctamaria/rosary';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { monthGrid, monthRange } from '@/domains/calendar/dates';
import { appJournal } from '@/domains/journal/app-journal';
import {
  useInvalidateJournal,
  useJournalDays,
  useJournalEntries,
  useJournalTotals,
} from '@/domains/journal/queries';
import { capitalizeFirst } from '@/shared/format';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';
import { useWideLayout } from '@/shared/ui/use-wide-layout';

function DayCell({
  date,
  prayed,
  selected,
  today,
  onPress,
}: {
  date: LocalDate;
  prayed: boolean;
  selected: boolean;
  today: boolean;
  onPress: () => void;
}) {
  const { colors } = useSkin();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="aspect-square w-[14.28%] items-center justify-center p-0.5"
    >
      <View
        className={`h-full w-full items-center justify-center gap-0.5 rounded-full ${selected ? 'bg-surface-raised' : ''} ${today ? 'border border-accent' : ''}`}
      >
        <Text
          variant="callout"
          className={prayed ? 'text-foreground' : 'text-faint'}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {date.day}
        </Text>
        <View
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: prayed ? colors.accent : 'transparent' }}
        />
      </View>
    </Pressable>
  );
}

export default function JournalScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useSkin();
  const today = localDateOf(new Date());
  const [month, setMonth] = useState({ year: today.year, month: today.month });
  const [selected, setSelected] = useState<string>(formatLocalDate(today));
  const range = monthRange(month.year, month.month);
  const days = useJournalDays(range.from, range.to);
  const entries = useJournalEntries(selected, selected);
  const totals = useJournalTotals();
  const invalidate = useInvalidateJournal();
  const prayed = new Set(days.data?.map((day) => day.prayedOn));
  const monthName = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(
    new Date(month.year, month.month - 1, 1),
  );
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' }).format(new Date(2026, 9, 5 + i)),
  );
  const isCurrentMonth = month.year === today.year && month.month === today.month;
  const wide = useWideLayout();

  function shift(delta: number) {
    const next = new Date(month.year, month.month - 1 + delta, 1);
    setMonth({ year: next.getFullYear(), month: next.getMonth() + 1 });
  }

  function handleDelete(id: string) {
    Alert.alert(t('journal.deleteTitle'), undefined, [
      { text: t('journal.cancel'), style: 'cancel' },
      {
        text: t('journal.delete'),
        style: 'destructive',
        onPress: () =>
          void (async () => {
            await (await appJournal()).remove(id);
            await invalidate();
          })(),
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: t('journal.title') }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-6 px-5 pb-16 pt-2 ${wide ? '' : readableWidth}`}
      >
        <View className={wide ? 'flex-row items-start gap-10' : 'gap-6'}>
          <View className={`gap-3 ${wide ? 'max-w-[520px] flex-1' : ''}`}>
            <View className="flex-row items-center justify-between">
              <Text variant="headline">{capitalizeFirst(monthName)}</Text>
              <View className="flex-row gap-1">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="‹"
                  onPress={() => shift(-1)}
                  hitSlop={6}
                  className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
                >
                  <View style={{ transform: [{ scaleX: -1 }] }}>
                    <Icon name="chevron" size={20} color={colors.accent} />
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="›"
                  disabled={isCurrentMonth}
                  onPress={() => shift(1)}
                  hitSlop={6}
                  className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
                  style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
                >
                  <Icon name="chevron" size={20} color={colors.accent} />
                </Pressable>
              </View>
            </View>
            <View className="flex-row">
              {weekdays.map((day, i) => (
                <Text key={i} variant="caption" className="w-[14.28%] text-center uppercase">
                  {day}
                </Text>
              ))}
            </View>
            <View className="flex-row flex-wrap">
              {monthGrid(month.year, month.month).map((date, i) =>
                date === null ? (
                  <View key={`pad-${i}`} className="aspect-square w-[14.28%]" />
                ) : (
                  <DayCell
                    key={formatLocalDate(date)}
                    date={date}
                    prayed={prayed.has(formatLocalDate(date))}
                    selected={selected === formatLocalDate(date)}
                    today={formatLocalDate(date) === formatLocalDate(today)}
                    onPress={() => setSelected(formatLocalDate(date))}
                  />
                ),
              )}
            </View>
            <Text variant="footnote">
              {prayed.size === 0 && isCurrentMonth
                ? t('journal.empty')
                : t('journal.monthDays', { count: prayed.size })}
            </Text>
          </View>

          <View className={`gap-2 ${wide ? 'flex-1 pt-14' : ''}`}>
            <Text variant="eyebrow">
              {new Intl.DateTimeFormat(i18n.language, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }).format(new Date(`${selected}T12:00:00`))}
            </Text>
            {entries.data !== undefined && entries.data.length === 0 ? (
              <Text variant="footnote">{t('journal.nothing')}</Text>
            ) : (
              <Card>
                {entries.data?.map((entry) => (
                  <Pressable
                    key={entry.id}
                    onLongPress={() => handleDelete(entry.id)}
                    accessibilityHint={t('journal.delete')}
                    className="flex-row items-center gap-3 px-4 py-3"
                  >
                    <Icon name={entry.decades === 5 ? 'rosary' : 'decade'} color={colors.accent} />
                    <View className="flex-1 gap-0.5">
                      <Text variant="callout">
                        {entry.decades === 5
                          ? t('journal.entryRosary')
                          : t('journal.entryDecades', { count: entry.decades })}
                      </Text>
                      <Text variant="footnote">
                        {t(`sets.${entry.mysterySet as MysterySet}`)} · {t(`locales.${entry.locale}`)}
                      </Text>
                    </View>
                    <Text variant="footnote" style={{ fontVariant: ['tabular-nums'] }}>
                      {Math.max(1, Math.round(entry.durationSeconds / 60))} min
                    </Text>
                  </Pressable>
                ))}
              </Card>
            )}
          </View>
        </View>

        {totals.data !== undefined && totals.data.days > 0 && (
          <View className="flex-row gap-3">
            {[
              t('journal.rosaries', { count: totals.data.rosaries }),
              t('journal.decades', { count: totals.data.decades }),
              t('journal.days', { count: totals.data.days }),
            ].map((label) => (
              <View
                key={label}
                className="flex-1 items-center rounded-card bg-surface px-2 py-3"
                style={{ borderCurve: 'continuous' }}
              >
                <Text variant="footnote" className="text-center text-foreground">
                  {label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
