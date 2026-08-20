import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { SectionHeader } from '@/components/SectionHeader';
import { useSettings } from '@/settings/settings-context';
import type { ReminderMode } from '@/settings/store';
import { radius, spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { applyReminder, type ReminderStatus } from './apply';

/** Monday first, the week of the Rule. */
const dayOrder = [1, 2, 3, 4, 5, 6, 0];

function dayLetter(day: number, language: string): string {
  // Any week works: January 4th, 2026 was a Sunday.
  return new Intl.DateTimeFormat(language, { weekday: 'narrow' }).format(
    new Date(2026, 0, 4 + day),
  );
}

export function ReminderSection() {
  const { t, i18n } = useTranslation();
  const colors = useTheme();
  const { settings, setReminder } = useSettings();
  const [status, setStatus] = useState<ReminderStatus | undefined>(undefined);

  const apply = (
    partial: Parameters<typeof setReminder>[0],
    requestPermission: boolean,
  ) => {
    setReminder(partial);
    void applyReminder({ ...settings, ...partial }, t('reminder.body'), {
      requestPermission,
    }).then(setStatus);
  };

  const modes: readonly ReminderMode[] = ['off', 'hour', 'angelus'];
  const time = new Date();
  time.setHours(settings.reminderHour, settings.reminderMinute, 0, 0);

  return (
    <>
      <SectionHeader title={t('reminder.title')} />
      <Card>
        {modes.map((mode, index) => (
          <ListRow
            key={mode}
            label={t(`reminder.${mode}`)}
            selected={settings.reminderMode === mode}
            divider={index < modes.length - 1 || settings.reminderMode !== 'off'}
            onPress={() => apply({ reminderMode: mode }, mode !== 'off')}
          />
        ))}
        {settings.reminderMode === 'hour' ? (
          <View style={styles.timeRow}>
            <DateTimePicker
              value={time}
              mode="time"
              onChange={(_event, selected) => {
                if (selected !== undefined) {
                  apply(
                    {
                      reminderHour: selected.getHours(),
                      reminderMinute: selected.getMinutes(),
                    },
                    false,
                  );
                }
              }}
            />
          </View>
        ) : null}
        {settings.reminderMode !== 'off' ? (
          <View style={styles.daysRow}>
            {dayOrder.map((day) => {
              const active = settings.reminderDays.includes(day);
              return (
                <Pressable
                  key={day}
                  accessibilityRole="switch"
                  accessibilityLabel={dayLetter(day, i18n.language)}
                  accessibilityState={{ checked: active }}
                  onPress={() =>
                    apply(
                      {
                        reminderDays: active
                          ? settings.reminderDays.filter((other) => other !== day)
                          : [...settings.reminderDays, day],
                      },
                      false,
                    )
                  }
                  style={[
                    styles.day,
                    active
                      ? { backgroundColor: colors.accentSoft }
                      : { borderWidth: 1, borderColor: colors.borderStrong },
                  ]}
                >
                  <AppText variant="caption" color={active ? 'text' : 'muted'}>
                    {dayLetter(day, i18n.language)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </Card>
      {status === 'denied' ? (
        <View style={styles.denied}>
          <AppText variant="caption" color="muted">
            {t('reminder.denied')}
          </AppText>
          <Button
            label={t('reminder.open')}
            variant="secondary"
            onPress={() => void Linking.openSettings()}
          />
        </View>
      ) : (
        <AppText variant="caption" color="muted" style={styles.hint}>
          {t('reminder.hint')}
        </AppText>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  timeRow: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  daysRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  day: {
    width: touchTarget - 8,
    height: touchTarget - 8,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denied: { marginTop: spacing.sm, gap: spacing.sm, paddingHorizontal: spacing.xs },
  hint: { marginTop: spacing.sm, paddingHorizontal: spacing.xs },
});
