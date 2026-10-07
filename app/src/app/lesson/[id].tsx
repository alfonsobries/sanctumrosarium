import { localDateOf, mysterySetFor, mysterySets } from '@sanctamaria/rosary';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { lesson, type Figure } from '@/domains/learn/lessons';
import { BeadRow } from '@/domains/prayer/BeadRow';
import { startSession } from '@/domains/prayer/start';
import { useSettings } from '@/domains/settings/use-settings';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { SafeScreen } from '@/shared/ui/SafeScreen';
import { Text } from '@/shared/ui/Text';

function LessonFigure({ figure }: { figure: Figure }) {
  const { t } = useTranslation();
  const { colors } = useSkin();
  switch (figure) {
    case 'cross':
      return <Icon name="cross" size={72} color={colors.accent} />;
    case 'opening':
      return <BeadRow scale={2.4} state={{ kind: 'opening', prayed: 4, current: null }} />;
    case 'decade':
      return <BeadRow scale={2} state={{ kind: 'decade', ourFather: 'done', prayed: 10, current: null }} />;
    case 'sets':
      return (
        <View className="w-full gap-2">
          {mysterySets.map((set) => (
            <View
              key={set}
              className="flex-row items-center gap-3 rounded-card bg-surface px-4 py-3"
              style={{ borderCurve: 'continuous' }}
            >
              <View className="h-2 w-2 rounded-full bg-accent" />
              <Text variant="callout">{t(`sets.${set}`)}</Text>
            </View>
          ))}
        </View>
      );
  }
}

export default function LessonScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();
  const { id } = useLocalSearchParams<{ id: string }>();
  const update = useSettings((state) => state.update);
  const [index, setIndex] = useState(0);
  const content = lesson(id ?? '', i18n.language === 'en' ? 'en' : 'es');

  if (content === null) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
        <Text variant="callout">{t('common.error')}</Text>
        <Button label={t('common.close')} variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const page = content.pages[index];
  const lastPage = index === content.pages.length - 1;
  if (page === undefined) {
    return null;
  }

  async function handlePray() {
    update({ guided: true });
    await startSession(mysterySetFor(localDateOf(new Date())), { kind: 'full' });
    router.dismiss();
    router.push('/pray');
  }

  return (
    <SafeScreen>
      <View className="flex-row items-center gap-4 px-5 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={() => router.back()}
          hitSlop={10}
          className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
        >
          <Icon name="close" color={colors.muted} />
        </Pressable>
        <View
          className="flex-1 flex-row gap-1.5"
          accessible
          accessibilityLabel={t('learn.lessonOf', { index: index + 1, total: content.pages.length })}
        >
          {content.pages.map((_, i) => (
            <View key={i} className={`h-[3px] flex-1 rounded-full ${i <= index ? 'bg-accent' : 'bg-bead'}`} />
          ))}
        </View>
        <View className="w-11" />
      </View>

      <ScrollView contentContainerClassName="flex-grow gap-8 px-6 pb-6 pt-10">
        <Animated.View key={index} entering={FadeIn.duration(250)} className="flex-1 gap-8">
          <View className="gap-3">
            <Text variant="eyebrow">{content.title}</Text>
            <Text variant="display">{page.title}</Text>
          </View>
          {page.figure !== undefined && (
            <View className="items-center">
              <LessonFigure figure={page.figure} />
            </View>
          )}
          <Text variant="body" className="text-[19px] leading-[28px]">
            {page.body}
          </Text>
          {page.quote !== undefined && (
            <View className="gap-2 border-l-2 border-accent pl-4">
              <Text className="font-prayer-italic text-[19px] leading-[27px] text-foreground" selectable>
                {page.quote.text}
              </Text>
              <Text variant="footnote">{page.quote.cite}</Text>
            </View>
          )}
          {lastPage && (
            <Text variant="caption" selectable>
              {t('learn.source')}: {content.source.title}
            </Text>
          )}
        </Animated.View>
      </ScrollView>

      <View className="gap-3 px-6 pb-2">
        {lastPage ? (
          <>
            <Button label={t('learn.prayNow')} onPress={() => void handlePray()} />
            <Button label={t('learn.finish')} variant="plain" onPress={() => router.back()} />
          </>
        ) : (
          <Button label={t('learn.next')} onPress={() => setIndex(index + 1)} />
        )}
      </View>
    </SafeScreen>
  );
}
