import { mysterySets, type MysterySet } from '@sanctamaria/rosary';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { startSession } from '@/domains/prayer/start';
import { useSettings } from '@/domains/settings/use-settings';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { Text } from '@/shared/ui/Text';

function isSet(value: unknown): value is MysterySet {
  return typeof value === 'string' && (mysterySets as readonly string[]).includes(value);
}

export default function BeginSheet() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ set?: string }>();
  const [set, setSet] = useState<MysterySet>(isSet(params.set) ? params.set : 'joyful');
  const mode = useSettings((state) => state.mode);
  const guided = useSettings((state) => state.guided);
  const reading = useSettings((state) => state.reading);
  const prayerLocale = useSettings((state) => state.prayerLocale);
  const appearance = useSettings((state) => state.appearance);
  const update = useSettings((state) => state.update);

  async function handleStart() {
    await startSession(set, { kind: 'full' });
    router.dismiss();
    router.push('/pray');
  }

  return (
    <ScrollView contentContainerClassName="gap-6 px-5 pb-10 pt-7">
      <Text variant="title">{t('options.title')}</Text>

      <View className="gap-2">
        <Text variant="eyebrow">{t('options.mysteries')}</Text>
        <Segmented
          accessibilityLabel={t('options.mysteries')}
          value={set}
          onChange={setSet}
          options={mysterySets.map((value) => ({ value, label: t(`setShort.${value}`) }))}
        />
      </View>

      <View className="gap-2">
        <Text variant="eyebrow">{t('options.mode')}</Text>
        <Segmented
          accessibilityLabel={t('options.mode')}
          value={mode}
          onChange={(value) => update({ mode: value })}
          options={[
            { value: 'listen', label: t('options.listen') },
            { value: 'tap', label: t('options.tap') },
          ]}
        />
      </View>

      <View className="gap-2">
        <Text variant="eyebrow">{t('options.language')}</Text>
        <Segmented
          accessibilityLabel={t('options.language')}
          value={prayerLocale === 'es-ES' ? 'es-MX' : prayerLocale}
          onChange={(value) =>
            update({ prayerLocale: value === 'es-MX' && prayerLocale === 'es-ES' ? 'es-ES' : value })
          }
          options={(['es-MX', 'en-US', 'la'] as const).map((value) => ({
            value,
            label: value === 'es-MX' ? 'Español' : value === 'en-US' ? 'English' : 'Latina',
          }))}
        />
      </View>

      <View className="gap-2">
        <Text variant="eyebrow">{t('settings.theme')}</Text>
        <Segmented
          accessibilityLabel={t('settings.theme')}
          value={appearance}
          onChange={(value) => update({ appearance: value })}
          options={(['system', 'light', 'dark'] as const).map((value) => ({
            value,
            label: t(`settings.themes.${value}`),
          }))}
        />
      </View>

      <Card>
        <SwitchRow
          title={t('options.guided')}
          detail={t('options.guidedDetail')}
          value={guided}
          onChange={(value) => update({ guided: value })}
        />
        <View className="mx-4 h-px bg-border" />
        <SwitchRow
          title={t('options.reading')}
          detail={t('options.readingDetail')}
          value={reading}
          onChange={(value) => update({ reading: value })}
        />
      </Card>

      <Button label={t('options.start')} onPress={() => void handleStart()} />
    </ScrollView>
  );
}
