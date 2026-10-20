import { Host, TimePickerDialog } from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatTime } from '@/shared/format';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Row } from '@/shared/ui/Row';

import { dateAt, minutesOf } from './reminders';

type TimeFieldProperties = {
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
};

/** A time of day shown as a row that opens the Material time picker. */
export function TimeField({ label, minutes, onChange }: TimeFieldProperties) {
  const { t, i18n } = useTranslation();
  const { colors } = useSkin();
  const [open, setOpen] = useState(false);
  const date = dateAt(minutes);
  const is24Hour = !/[ap]\.?\s?m/i.test(formatTime(dateAt(13 * 60), i18n.language));

  return (
    <>
      <Row
        icon="time"
        title={label}
        value={formatTime(date, i18n.language)}
        chevron={false}
        onPress={() => setOpen(true)}
      />
      {open && (
        <Host matchContents>
          <TimePickerDialog
            initialDate={date.toISOString()}
            is24Hour={is24Hour}
            color={colors.accent}
            elementColors={{
              containerColor: colors['surface-raised'],
              clockDialColor: colors.surface,
              clockDialSelectedContentColor: colors['accent-foreground'],
              clockDialUnselectedContentColor: colors.foreground,
              selectorColor: colors.accent,
              periodSelectorBorderColor: colors.border,
              periodSelectorSelectedContainerColor: colors.accent,
              periodSelectorUnselectedContainerColor: colors['surface-raised'],
              periodSelectorSelectedContentColor: colors['accent-foreground'],
              periodSelectorUnselectedContentColor: colors.muted,
              timeSelectorSelectedContainerColor: colors.accent,
              timeSelectorUnselectedContainerColor: colors.surface,
              timeSelectorSelectedContentColor: colors['accent-foreground'],
              timeSelectorUnselectedContentColor: colors.foreground,
            }}
            confirmButtonLabel={t('settings.done')}
            dismissButtonLabel={t('common.cancel')}
            onDateSelected={(selected) => {
              setOpen(false);
              onChange(minutesOf(selected));
            }}
            onDismissRequest={() => setOpen(false)}
          />
        </Host>
      )}
    </>
  );
}
