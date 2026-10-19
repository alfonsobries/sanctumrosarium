import {
  auxiliumFor,
  prayerText,
  type AuxiliumBlock,
  type AuxiliumSection,
  type Locale,
} from '@sanctamaria/content';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuxiliumAudio } from '@/domains/auxilium/use-auxilium-audio';
import type { Settings } from '@/domains/settings/settings';
import { useSettings } from '@/domains/settings/use-settings';
import { capitalizeFirst } from '@/shared/format';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';
import { readableWidth } from '@/shared/ui/layout';

const sizes: Record<Settings['textSize'], { size: number; line: number }> = {
  regular: { size: 19, line: 28 },
  large: { size: 22, line: 32 },
  larger: { size: 26, line: 37 },
};

type Type = { fontSize: number; lineHeight: number };

function Versicle({ mark, children, style }: { mark: string; children: string; style: Type }) {
  return (
    <Text className="font-prayer text-foreground" style={style}>
      <Text className="font-prayer text-rubric" style={style}>
        {mark}{' '}
      </Text>
      {children}
    </Text>
  );
}

type BlockProperties = { block: AuxiliumBlock; locale: Locale; style: Type };

function Block({ block, locale, style }: BlockProperties) {
  if (block.kind === 'versicle') {
    return (
      <View className="gap-1">
        <Versicle mark="℣." style={style}>
          {block.call}
        </Versicle>
        <Versicle mark="℟." style={style}>
          {block.response}
        </Versicle>
      </View>
    );
  }
  if (block.kind === 'text') {
    if (block.lead === true) {
      return (
        <Text className="font-prayer-italic text-rubric" style={style}>
          {block.text}
        </Text>
      );
    }
    return (
      <View className="gap-1">
        <Text className="font-prayer text-foreground" style={style}>
          {block.text}
        </Text>
        {block.response !== undefined && (
          <Versicle mark="℟." style={style}>
            {block.response}
          </Versicle>
        )}
      </View>
    );
  }
  if (block.kind === 'litany') {
    return (
      <View className="gap-2">
        {block.items.map((item, index) => (
          <Text key={index} className="font-prayer text-foreground" style={style}>
            {item.call}
            {item.response !== undefined && (
              <Text className="font-prayer-italic text-muted" style={style}>
                {/[,;:—–-]$/.test(item.call) ? ' ' : ', '}
                {item.response}
              </Text>
            )}
          </Text>
        ))}
      </View>
    );
  }
  const text = prayerText(block.prayer, locale);
  const split = text.responseFrom ?? text.lines.length;
  return (
    <View className="gap-1">
      {text.lines.map((line, index) => (
        <Text
          key={index}
          className={index >= split ? 'font-prayer-italic text-muted' : 'font-prayer text-foreground'}
          style={style}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

type SectionViewProperties = {
  section: AuxiliumSection;
  title: string;
  locale: Locale;
  style: Type;
  current: boolean;
  onPressTitle: () => void;
  onLayout: (y: number) => void;
};

function SectionView({
  section,
  title,
  locale,
  style,
  current,
  onPressTitle,
  onLayout,
}: SectionViewProperties) {
  const { colors } = useSkin();
  return (
    <View
      className="gap-3 border-l-2 pl-3"
      style={{ borderColor: current ? colors.accent : 'transparent', marginLeft: -14 }}
      onLayout={(event) => onLayout(event.nativeEvent.layout.y)}
    >
      <Pressable accessibilityRole="button" onPress={onPressTitle} hitSlop={8}>
        <Text variant="eyebrow" className={current ? 'text-accent' : 'text-rubric'}>
          {title}
        </Text>
      </Pressable>
      {section.blocks.map((block, index) => (
        <Block key={index} block={block} locale={locale} style={style} />
      ))}
    </View>
  );
}

export default function AuxiliumScreen() {
  const { t, i18n } = useTranslation();
  const { colors, skin } = useSkin();
  const insets = useSafeAreaInsets();
  const locale = useSettings((state) => state.prayerLocale);
  const textSize = useSettings((state) => state.textSize);
  const pauseSeconds = useSettings((state) => state.pauseSeconds);
  const rate = useSettings((state) => state.rate);
  const scroll = useRef<ScrollView>(null);
  const offsets = useRef<number[]>([]);

  const now = new Date();
  const weekday = now.getDay();
  const dayName = new Intl.DateTimeFormat(i18n.language, { weekday: 'long' }).format(now);
  const sections = useMemo(() => auxiliumFor(locale, weekday), [locale, weekday]);
  const scale = skin.textScale ?? 1;
  const style = {
    fontSize: Math.round(sizes[textSize].size * scale),
    lineHeight: Math.round(sizes[textSize].line * scale),
  };

  function titleOf(section: AuxiliumSection): string {
    return section.day === undefined
      ? t(`auxilium.sections.${section.id}`)
      : capitalizeFirst(t('auxilium.dayTitle', { day: dayName }));
  }

  const audio = useAuxiliumAudio({
    sections,
    locale,
    pauseSeconds,
    rate,
    nowPlaying: { album: t('auxilium.today'), artist: t('auxilium.title'), titles: titleOf },
  });
  const playing = audio.status === 'playing';

  useEffect(() => {
    if (audio.index === null) {
      return;
    }
    const y = offsets.current[audio.index];
    if (y !== undefined) {
      // The header floats over the scroll on iOS; the section lands just under it.
      scroll.current?.scrollTo({ y: Math.max(0, y - 170), animated: true });
    }
  }, [audio.index]);

  function handleToggle() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    audio.toggle();
  }

  return (
    <>
      <Stack.Screen options={{ title: t('auxilium.title'), headerBackButtonDisplayMode: 'minimal' }} />
      <ScrollView
        ref={scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-9 px-6 pt-4 ${readableWidth}`}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View className="gap-1">
          <Text variant="eyebrow">{t('auxilium.today')}</Text>
          <Text variant="title">{capitalizeFirst(dayName)}</Text>
        </View>
        {sections.map((section, index) => (
          <SectionView
            key={section.id}
            section={section}
            title={titleOf(section)}
            locale={locale}
            style={style}
            current={audio.index === index}
            onPressTitle={() => audio.skipTo(index)}
            onLayout={(y) => {
              offsets.current[index] = y;
            }}
          />
        ))}
      </ScrollView>
      {audio.availability !== 'unavailable' && (
        <View
          pointerEvents="box-none"
          className="absolute inset-x-0 items-center"
          style={{ bottom: insets.bottom + 16 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={playing ? t('auxilium.pause') : t('auxilium.listen')}
            onPress={handleToggle}
            className="h-16 flex-row items-center gap-3 rounded-full bg-accent px-7 active:opacity-80"
            style={{ borderCurve: 'continuous' }}
          >
            {audio.availability === 'loading' ? (
              <ActivityIndicator color={colors['accent-foreground']} />
            ) : (
              <Icon
                name={playing ? 'pause' : 'play'}
                size={22}
                color={colors['accent-foreground']}
                fill={colors['accent-foreground']}
              />
            )}
            <Text variant="headline" className="text-accent-foreground">
              {playing ? t('auxilium.pause') : t('auxilium.listen')}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
