import { openingFormsFor } from '@sanctamaria/content';
import type { Evangelist, OpeningForm } from '@sanctamaria/rosary';
import { useTranslation } from 'react-i18next';

import type { Settings } from '@/domains/settings/settings';
import { SettingsField } from '@/domains/settings/SettingsField';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { useSettings } from '@/domains/settings/use-settings';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { Text } from '@/shared/ui/Text';

export default function RosarySettingsScreen() {
  const { t } = useTranslation();
  const settings = useSettings();
  const update = settings.update;
  const forms = openingFormsFor(settings.prayerLocale);
  const openingForm = forms.includes(settings.openingForm) ? settings.openingForm : 'standard';

  return (
    <SettingsPage title={t('settings.rosaryOptions')}>
      <SettingsSection title={t('settings.readings')}>
        <Card>
          <SwitchRow
            icon="gospel"
            title={t('options.reading')}
            detail={t('options.readingDetail')}
            value={settings.reading}
            onChange={(value) => update({ reading: value })}
          />
          <SettingsField icon="gospel" label={t('settings.gospel')} hint={t('settings.gospelHint')}>
            <Segmented<Settings['gospel']>
              accessibilityLabel={t('settings.gospel')}
              value={settings.gospel}
              onChange={(value) => update({ gospel: value })}
              options={[
                { value: 'rotate', label: t('settings.rotateShort') },
                ...(['matthew', 'mark', 'luke', 'john'] as Evangelist[]).map((value) => ({
                  value,
                  label: t(`evangelistShort.${value}`),
                })),
              ]}
            />
            <Text variant="footnote">
              {settings.gospel === 'rotate'
                ? t('settings.gospelRotate')
                : t('settings.gospelFixed', { evangelist: t(`evangelists.${settings.gospel}`) })}
            </Text>
          </SettingsField>
        </Card>
      </SettingsSection>

      <SettingsSection title={t('settings.calendar')}>
        <Card>
          <SwitchRow
            icon="calendar"
            title={t('settings.luminous')}
            detail={settings.luminous ? t('settings.luminousOn') : t('settings.luminousOff')}
            value={settings.luminous}
            onChange={(value) => update({ luminous: value })}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('settings.optional')}>
        <Card>
          {forms.length > 1 && (
            <SettingsField
              icon="rosary"
              label={t('settings.openingForm')}
              hint={t(`settings.openingFormHints.${openingForm}`)}
            >
              <Segmented<OpeningForm>
                accessibilityLabel={t('settings.openingForm')}
                value={openingForm}
                onChange={(value) => update({ openingForm: value })}
                options={forms.map((value) => ({ value, label: t(`settings.openingForms.${value}`) }))}
              />
            </SettingsField>
          )}
          <SwitchRow
            icon="prayer"
            title={t('settings.fatima')}
            value={settings.fatimaPrayer}
            onChange={(value) => update({ fatimaPrayer: value })}
          />
          <SwitchRow
            icon="pope"
            title={t('settings.pope')}
            value={settings.prayerForThePope}
            onChange={(value) => update({ prayerForThePope: value })}
          />
          <SwitchRow
            icon="litany"
            title={t('settings.litany')}
            value={settings.litany}
            onChange={(value) => update({ litany: value })}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title={t('settings.learning')}>
        <Card>
          <SwitchRow
            icon="guided"
            title={t('options.guided')}
            detail={t('options.guidedDetail')}
            value={settings.guided}
            onChange={(value) => update({ guided: value })}
          />
        </Card>
      </SettingsSection>
    </SettingsPage>
  );
}
