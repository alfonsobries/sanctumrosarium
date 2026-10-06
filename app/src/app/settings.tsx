import type { Evangelist } from '@sanctamaria/rosary';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import type { Settings } from '@/domains/settings/settings';
import { AccountSection } from '@/domains/sync/AccountSection';
import { useSettings } from '@/domains/settings/use-settings';
import { skinIds, skins, type SkinId } from '@/shared/theme/skins';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { Text } from '@/shared/ui/Text';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="eyebrow" className="px-1">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View className="gap-2 px-4 py-3">
      <Text variant="callout">{label}</Text>
      {children}
      {hint !== undefined && <Text variant="footnote">{hint}</Text>}
    </View>
  );
}

function SkinPreview({ id, selected, onPress }: { id: SkinId; selected: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const { scheme } = useSkin();
  const skin = skins[id];
  const palette = skin[scheme];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={t(`settings.skins.${id}`)}
      onPress={onPress}
      className="flex-1 gap-2"
    >
      <View
        className="h-36 justify-center gap-2 overflow-hidden px-4"
        style={{
          backgroundColor: palette.background,
          borderRadius: skin.radius + 4,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? palette.accent : palette.border,
          borderCurve: 'continuous',
        }}
      >
        <Text style={{ fontFamily: skin.fonts.display, color: palette.foreground, fontSize: 20 }}>
          {t('sets.joyful')}
        </Text>
        <Text
          style={{ fontFamily: skin.fonts.prayer, color: palette.foreground, fontSize: 15, lineHeight: 20 }}
        >
          <Text
            style={{
              fontFamily: skin.dropCap ? skin.fonts.display : skin.fonts.prayer,
              color: skin.dropCap ? palette.rubric : palette.foreground,
              fontSize: skin.dropCap ? 24 : 15,
            }}
          >
            A
          </Text>
          ve Maria, gratia plena
        </Text>
        <View className="flex-row gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: i < 2 ? palette['bead-done'] : palette.bead }}
            />
          ))}
        </View>
      </View>
      <Text variant="footnote" className={`text-center ${selected ? 'text-foreground' : ''}`}>
        {t(`settings.skins.${id}`)}
      </Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const settings = useSettings();
  const update = settings.update;

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerRight: () => (
            <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={10}>
              <Text variant="headline" className="text-accent">
                {t('settings.done')}
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-7 px-5 pb-16 pt-4"
      >
        <Section title={t('settings.prayer')}>
          <Card>
            <Field label={t('settings.language')}>
              <Segmented
                accessibilityLabel={t('settings.language')}
                value={settings.prayerLocale}
                onChange={(value) => update({ prayerLocale: value })}
                options={(['es-MX', 'es-ES', 'en-US', 'la'] as const).map((value) => ({
                  value,
                  label:
                    value === 'es-MX' ? 'MX' : value === 'es-ES' ? 'ES' : value === 'en-US' ? 'EN' : 'LA',
                }))}
              />
              <Text variant="footnote">{t(`locales.${settings.prayerLocale}`)}</Text>
            </Field>
            <Field label={t('settings.mode')}>
              <Segmented
                accessibilityLabel={t('settings.mode')}
                value={settings.mode}
                onChange={(value) => update({ mode: value })}
                options={[
                  { value: 'listen', label: t('options.listen') },
                  { value: 'tap', label: t('options.tap') },
                ]}
              />
            </Field>
            <Field label={t('settings.pause')}>
              <Segmented
                accessibilityLabel={t('settings.pause')}
                value={String(settings.pauseSeconds)}
                onChange={(value) => update({ pauseSeconds: Number(value) })}
                options={['0', '1', '3', '5', '10'].map((value) => ({
                  value,
                  label: value === '0' ? t('settings.none') : `${value} s`,
                }))}
              />
            </Field>
            <Field label={t('settings.rate')}>
              <Segmented
                accessibilityLabel={t('settings.rate')}
                value={String(settings.rate)}
                onChange={(value) => update({ rate: Number(value) })}
                options={['0.85', '1', '1.15', '1.3'].map((value) => ({ value, label: `${value}×` }))}
              />
            </Field>
            <Field label={t('settings.gospel')} hint={t('settings.gospelHint')}>
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
            </Field>
            <SwitchRow
              title={t('options.reading')}
              value={settings.reading}
              onChange={(value) => update({ reading: value })}
            />
            <SwitchRow
              title={t('options.guided')}
              detail={t('options.guidedDetail')}
              value={settings.guided}
              onChange={(value) => update({ guided: value })}
            />
            <SwitchRow
              title={t('settings.fatima')}
              value={settings.fatimaPrayer}
              onChange={(value) => update({ fatimaPrayer: value })}
            />
            <SwitchRow
              title={t('settings.pope')}
              value={settings.prayerForThePope}
              onChange={(value) => update({ prayerForThePope: value })}
            />
            <SwitchRow
              title={t('settings.litany')}
              value={settings.litany}
              onChange={(value) => update({ litany: value })}
            />
          </Card>
        </Section>

        <Section title={t('settings.appearance')}>
          <View className="flex-row gap-3">
            {skinIds.map((id) => (
              <SkinPreview
                key={id}
                id={id}
                selected={settings.skin === id}
                onPress={() => update({ skin: id })}
              />
            ))}
          </View>
          <Card>
            <Field label={t('settings.theme')}>
              <Segmented
                accessibilityLabel={t('settings.theme')}
                value={settings.appearance}
                onChange={(value) => update({ appearance: value })}
                options={(['system', 'light', 'dark'] as const).map((value) => ({
                  value,
                  label: t(`settings.themes.${value}`),
                }))}
              />
            </Field>
            <Field label={t('settings.textSize')}>
              <Segmented
                accessibilityLabel={t('settings.textSize')}
                value={settings.textSize}
                onChange={(value) => update({ textSize: value })}
                options={(['regular', 'large', 'larger'] as const).map((value) => ({
                  value,
                  label: t(`settings.textSizes.${value}`),
                }))}
              />
            </Field>
          </Card>
        </Section>

        <AccountSection />
      </ScrollView>
    </>
  );
}
