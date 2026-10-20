import { useTranslation } from 'react-i18next';

import { ReminderControls } from '@/domains/reminders/ReminderControls';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { useSettings } from '@/domains/settings/use-settings';
import { Card } from '@/shared/ui/Card';

export default function ReminderSettingsScreen() {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <SettingsPage title={t('settings.reminder')}>
      <SettingsSection footer={t('reminders.hint')}>
        <Card>
          <ReminderControls
            enabled={settings.rosaryReminder}
            minutes={settings.rosaryReminderAt}
            onEnabledChange={(value) => settings.update({ rosaryReminder: value })}
            onMinutesChange={(value) => settings.update({ rosaryReminderAt: value })}
          />
        </Card>
      </SettingsSection>
    </SettingsPage>
  );
}
