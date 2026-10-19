import { useTranslation } from 'react-i18next';

import { rates } from '@/domains/settings/settings';
import { SettingsField } from '@/domains/settings/SettingsField';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { useSettings } from '@/domains/settings/use-settings';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';

export default function VoiceSettingsScreen() {
  const { t } = useTranslation();
  const settings = useSettings();
  const update = settings.update;

  return (
    <SettingsPage title={t('settings.voice')}>
      <SettingsSection>
        <Card>
          <SettingsField icon="listen" label={t('settings.mode')}>
            <Segmented
              accessibilityLabel={t('settings.mode')}
              value={settings.mode}
              onChange={(value) => update({ mode: value })}
              options={[
                { value: 'listen', label: t('options.listen') },
                { value: 'tap', label: t('options.tap') },
              ]}
            />
          </SettingsField>
          <SettingsField icon="silence" label={t('settings.pause')}>
            <Segmented
              accessibilityLabel={t('settings.pause')}
              value={String(settings.pauseSeconds)}
              onChange={(value) => update({ pauseSeconds: Number(value) })}
              options={['0', '1', '3', '5', '10'].map((value) => ({
                value,
                label: value === '0' ? t('settings.none') : `${value} s`,
              }))}
            />
          </SettingsField>
          <SettingsField icon="speed" label={t('settings.rate')}>
            <Segmented
              accessibilityLabel={t('settings.rate')}
              value={String(settings.rate)}
              onChange={(value) => update({ rate: Number(value) })}
              options={rates.map((value) => ({ value: String(value), label: `${value}×` }))}
            />
          </SettingsField>
        </Card>
      </SettingsSection>
    </SettingsPage>
  );
}
