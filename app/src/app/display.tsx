import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { hasAudio } from '@/domains/audio/use-rosary-audio';
import { rates } from '@/domains/settings/settings';
import { useSettings } from '@/domains/settings/use-settings';
import { useSession } from '@/domains/prayer/use-session';
import { Segmented } from '@/shared/ui/Segmented';
import { Text } from '@/shared/ui/Text';

/** Quick adjustments while praying: how to advance, voice speed, theme and text size. */
export default function DisplaySheet() {
  const { t } = useTranslation();
  const settings = useSettings();
  const update = settings.update;
  const locale = useSession((state) => state.plan?.locale) ?? settings.prayerLocale;
  const audio = hasAudio(locale);

  return (
    <ScrollView contentContainerClassName="gap-6 px-5 pb-10 pt-7">
      <Text variant="title">{t('display.title')}</Text>

      {audio && (
        <View className="gap-2">
          <Text variant="eyebrow">{t('options.mode')}</Text>
          <Segmented
            accessibilityLabel={t('options.mode')}
            value={settings.mode}
            onChange={(value) => update({ mode: value })}
            options={[
              { value: 'listen', label: t('options.listen') },
              { value: 'tap', label: t('options.tap') },
            ]}
          />
        </View>
      )}

      {audio && settings.mode === 'listen' && (
        <View className="gap-2">
          <Text variant="eyebrow">{t('settings.rate')}</Text>
          <Segmented
            accessibilityLabel={t('settings.rate')}
            value={String(settings.rate)}
            onChange={(value) => update({ rate: Number(value) })}
            options={rates.map((value) => ({ value: String(value), label: `${value}×` }))}
          />
        </View>
      )}

      <View className="gap-2">
        <Text variant="eyebrow">{t('settings.theme')}</Text>
        <Segmented
          accessibilityLabel={t('settings.theme')}
          value={settings.appearance}
          onChange={(value) => update({ appearance: value })}
          options={(['system', 'light', 'dark'] as const).map((value) => ({
            value,
            label: t(`settings.themes.${value}`),
          }))}
        />
      </View>

      <View className="gap-2">
        <Text variant="eyebrow">{t('settings.textSize')}</Text>
        <Segmented
          accessibilityLabel={t('settings.textSize')}
          value={settings.textSize}
          onChange={(value) => update({ textSize: value })}
          options={(['regular', 'large', 'larger'] as const).map((value) => ({
            value,
            label: t(`settings.textSizes.${value}`),
          }))}
        />
      </View>
    </ScrollView>
  );
}
