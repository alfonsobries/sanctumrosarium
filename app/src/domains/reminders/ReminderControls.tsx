import { useTranslation } from 'react-i18next';

import { SwitchRow } from '@/shared/ui/SwitchRow';

import { PermissionNotice } from './PermissionNotice';
import { TimeField } from './TimeField';
import { askPermission, useNotificationPermission } from './use-reminders';

type ReminderControlsProperties = {
  enabled: boolean;
  minutes: number;
  onEnabledChange: (enabled: boolean) => void;
  onMinutesChange: (minutes: number) => void;
};

/**
 * A daily reminder's switch and time. Turning it on is when the system is asked for
 * permission; a refusal leaves it on with the way to Settings in view.
 */
export function ReminderControls({
  enabled,
  minutes,
  onEnabledChange,
  onMinutesChange,
}: ReminderControlsProperties) {
  const { t } = useTranslation();
  const permission = useNotificationPermission();

  function handleEnabledChange(value: boolean) {
    onEnabledChange(value);
    if (value) {
      void askPermission();
    }
  }

  return (
    <>
      <SwitchRow icon="bell" title={t('reminders.daily')} value={enabled} onChange={handleEnabledChange} />
      {enabled && <TimeField label={t('reminders.time')} minutes={minutes} onChange={onMinutesChange} />}
      {enabled && permission === 'denied' && <PermissionNotice />}
    </>
  );
}
