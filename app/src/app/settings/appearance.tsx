import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { SettingsField } from '@/domains/settings/SettingsField';
import { SettingsPage } from '@/domains/settings/SettingsPage';
import { SettingsSection } from '@/domains/settings/SettingsSection';
import { SkinPreview } from '@/domains/settings/SkinPreview';
import { useSettings } from '@/domains/settings/use-settings';
import { skinIds } from '@/shared/theme/skins';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';

export default function AppearanceSettingsScreen() {
  const { t } = useTranslation();
  const settings = useSettings();
  const update = settings.update;

  return (
    <SettingsPage title={t('settings.appearance')}>
      <SettingsSection title={t('settings.skin')}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 px-1">
          {skinIds.map((id) => (
            <SkinPreview
              key={id}
              id={id}
              selected={settings.skin === id}
              onPress={() => update({ skin: id })}
            />
          ))}
        </ScrollView>
      </SettingsSection>
      <SettingsSection>
        <Card>
          <SettingsField icon="theme" label={t('settings.theme')}>
            <Segmented
              accessibilityLabel={t('settings.theme')}
              value={settings.appearance}
              onChange={(value) => update({ appearance: value })}
              options={(['system', 'light', 'dark'] as const).map((value) => ({
                value,
                label: t(`settings.themes.${value}`),
              }))}
            />
          </SettingsField>
          <SettingsField icon="text" label={t('settings.textSize')}>
            <Segmented
              accessibilityLabel={t('settings.textSize')}
              value={settings.textSize}
              onChange={(value) => update({ textSize: value })}
              options={(['regular', 'large', 'larger'] as const).map((value) => ({
                value,
                label: t(`settings.textSizes.${value}`),
              }))}
            />
          </SettingsField>
        </Card>
      </SettingsSection>
    </SettingsPage>
  );
}
