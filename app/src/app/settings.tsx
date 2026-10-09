import type { Evangelist } from '@sanctamaria/rosary';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { Text as NativeText, Pressable, ScrollView, View } from 'react-native';

import { siteLanguageOf, siteUrl, type SitePage } from '@/domains/about/links';
import { rates, type Settings } from '@/domains/settings/settings';
import { useSettings } from '@/domains/settings/use-settings';
import { artworks, type Artwork } from '@/domains/artwork/artworks';
import { illustrated } from '@/domains/artwork/illustrated';
import { skinIds, skins, type ArtworkStyle, type SkinId } from '@/shared/theme/skins';
import { textures } from '@/shared/theme/textures';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Card } from '@/shared/ui/Card';
import { Segmented } from '@/shared/ui/Segmented';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { Icon, type IconName } from '@/shared/ui/Icon';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';

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

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon: IconName;
  hint?: string;
  children: React.ReactNode;
}) {
  const { colors } = useSkin();
  return (
    <View className="gap-2 px-4 py-3">
      <View className="flex-row items-center gap-3">
        <Icon name={icon} size={20} color={colors.accent} />
        <Text variant="callout">{label}</Text>
      </View>
      {children}
      {hint !== undefined && <Text variant="footnote">{hint}</Text>}
    </View>
  );
}

const previewArt: Record<ArtworkStyle, Artwork | undefined> = {
  none: undefined,
  classic: artworks['joyful-1-annunciation'],
  glass: illustrated.glass['joyful-1-annunciation'],
  guadalupana: illustrated.guadalupana['joyful-1-annunciation'],
  trazo: illustrated.trazo['joyful-1-annunciation'],
  kids: illustrated.kids['joyful-1-annunciation'],
  maestros: illustrated.maestros['joyful-1-annunciation'],
};

function SkinPreview({ id, selected, onPress }: { id: SkinId; selected: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const { scheme } = useSkin();
  const skin = skins[id];
  const palette = skin[scheme];
  const art = previewArt[skin.artwork];
  const texture = skin.texture === undefined ? undefined : textures[skin.texture][scheme];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={t(`settings.skins.${id}`)}
      onPress={onPress}
      className="w-[132px] gap-2"
    >
      <View
        className="h-[220px] gap-2 overflow-hidden p-3"
        style={{
          backgroundColor: palette.background,
          borderRadius: Math.min(skin.radius, 20) + 4,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? palette.accent : palette.border,
          borderCurve: 'continuous',
        }}
      >
        {texture !== undefined && (
          <Image source={texture} contentFit="cover" style={{ position: 'absolute', inset: 0 }} />
        )}
        {/* Each preview shows its own skin's type, never the scale of the skin in use. */}
        <NativeText
          style={{ fontFamily: skin.fonts.display, color: palette.foreground, fontSize: 17, lineHeight: 21 }}
          numberOfLines={2}
        >
          {t('sets.joyful')}
        </NativeText>
        {art !== undefined ? (
          <View
            className="flex-1 overflow-hidden"
            style={{ borderRadius: Math.min(skin.radius, 14), backgroundColor: art.color }}
          >
            <Image
              source={art.source}
              placeholder={{ thumbhash: art.thumbhash }}
              contentFit="cover"
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <NativeText
            style={{
              flex: 1,
              fontFamily: skin.fonts.prayer,
              color: palette.foreground,
              fontSize: 14,
              lineHeight: 19,
            }}
          >
            Ave Maria, gratia plena, Dominus tecum.
          </NativeText>
        )}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: i < 2 ? palette['bead-done'] : palette.bead }}
              />
            ))}
          </View>
          <View className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.accent }} />
        </View>
      </View>
      <Text variant="footnote" className={`text-center ${selected ? 'font-semibold text-foreground' : ''}`}>
        {t(`settings.skins.${id}`)}
      </Text>
    </Pressable>
  );
}

function AboutSection() {
  const { t, i18n } = useTranslation();
  const language = siteLanguageOf(i18n.language);
  const version = Constants.expoConfig?.version;

  function handleOpen(page: SitePage) {
    void WebBrowser.openBrowserAsync(siteUrl(page, language));
  }

  return (
    <Section title={t('settings.about')}>
      <Card>
        <Row
          icon="website"
          title={t('settings.aboutWebsite')}
          detail={t('settings.aboutWebsiteDetail')}
          onPress={() => handleOpen('home')}
        />
        <Row
          icon="help"
          title={t('settings.aboutHelp')}
          detail={t('settings.aboutHelpDetail')}
          onPress={() => handleOpen('help')}
        />
        <Row icon="support" title={t('settings.aboutSupport')} onPress={() => handleOpen('support')} />
        <Row icon="privacy" title={t('settings.aboutPrivacy')} onPress={() => handleOpen('privacy')} />
        <Row icon="terms" title={t('settings.aboutTerms')} onPress={() => handleOpen('terms')} />
      </Card>
      {version !== undefined && (
        <Text variant="footnote" className="px-1 text-center">
          {t('settings.aboutVersion', { version })}
        </Text>
      )}
    </Section>
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
          // A sheet on iOS closes with Done; Android has its back arrow and gesture.
          headerRight:
            process.env.EXPO_OS === 'ios'
              ? () => (
                  <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={10}>
                    <Text variant="headline" className="text-accent">
                      {t('settings.done')}
                    </Text>
                  </Pressable>
                )
              : undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-7 px-5 pb-16 pt-4 ${readableWidth}`}
      >
        <Section title={t('settings.prayer')}>
          <Card>
            <Field icon="language" label={t('settings.language')}>
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
            <Field icon="listen" label={t('settings.mode')}>
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
            <Field icon="silence" label={t('settings.pause')}>
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
            <Field icon="speed" label={t('settings.rate')}>
              <Segmented
                accessibilityLabel={t('settings.rate')}
                value={String(settings.rate)}
                onChange={(value) => update({ rate: Number(value) })}
                options={rates.map((value) => ({ value: String(value), label: `${value}×` }))}
              />
            </Field>
            <Field icon="gospel" label={t('settings.gospel')} hint={t('settings.gospelHint')}>
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
              icon="gospel"
              title={t('options.reading')}
              value={settings.reading}
              onChange={(value) => update({ reading: value })}
            />
            <SwitchRow
              icon="guided"
              title={t('options.guided')}
              detail={t('options.guidedDetail')}
              value={settings.guided}
              onChange={(value) => update({ guided: value })}
            />
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
        </Section>

        <Section title={t('settings.appearance')}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 px-1"
          >
            {skinIds.map((id) => (
              <SkinPreview
                key={id}
                id={id}
                selected={settings.skin === id}
                onPress={() => update({ skin: id })}
              />
            ))}
          </ScrollView>
          <Card>
            <Field icon="theme" label={t('settings.theme')}>
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
            <Field icon="text" label={t('settings.textSize')}>
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
        <AboutSection />
      </ScrollView>
    </>
  );
}
