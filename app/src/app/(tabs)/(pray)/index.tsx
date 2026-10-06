import { mysteriesOf, mysteryRefsOf, mysteryTitle } from '@sanctamaria/content';
import {
  formatLocalDate,
  localDateOf,
  mysterySetFor,
  mysterySets,
  type MysterySet,
} from '@sanctamaria/rosary';
import { Image } from 'expo-image';
import { Link, Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { artworks } from '@/domains/artwork/artworks';
import { hasAudio } from '@/domains/audio/use-rosary-audio';
import { weekOf } from '@/domains/calendar/dates';
import { useJournalDays } from '@/domains/journal/queries';
import { stepsFor } from '@/domains/prayer/session';
import { isResumable, startSession } from '@/domains/prayer/start';
import { useSession } from '@/domains/prayer/use-session';
import { useSettings } from '@/domains/settings/use-settings';
import { useContentLocale } from '@/shared/i18n/use-content-locale';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';

function WeekDay({ label, prayed, today }: { label: string; prayed: boolean; today: boolean }) {
  return (
    <View className="flex-1 items-center gap-1.5">
      <Text variant="caption" className={today ? 'text-foreground' : undefined}>
        {label}
      </Text>
      <View
        className={`h-2.5 w-2.5 rounded-full ${prayed ? 'bg-accent' : today ? 'border border-accent' : 'bg-bead'}`}
      />
    </View>
  );
}

function SetChip({ set, onPress, active }: { set: MysterySet; onPress: () => void; active: boolean }) {
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={`min-h-[44px] items-center justify-center rounded-full border px-4 active:opacity-70 ${active ? 'border-accent bg-surface-raised' : 'border-border'}`}
    >
      <Text variant="callout" className={active ? 'text-accent' : 'text-muted'}>
        {t(`setShort.${set}`)}
      </Text>
    </Pressable>
  );
}

export default function TodayScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useSkin();
  const locale = useContentLocale();
  const { width } = useWindowDimensions();
  const mode = useSettings((state) => state.mode);
  const prayerLocale = useSettings((state) => state.prayerLocale);
  const listens = mode === 'listen' && hasAudio(prayerLocale);
  const plan = useSession((state) => state.plan);
  const position = useSession((state) => state.position);

  const now = new Date();
  const today = localDateOf(now);
  const todaySet = mysterySetFor(today);
  const mysteries = mysteriesOf(todaySet);
  const lead = mysteries[0];
  const artwork = lead === undefined ? undefined : artworks[lead.id];

  const week = useMemo(() => weekOf(today), [today.year, today.month, today.day]);
  const first = week[0];
  const last = week[6];
  const days = useJournalDays(
    first === undefined ? '' : formatLocalDate(first),
    last === undefined ? '' : formatLocalDate(last),
  );
  const prayedDays = new Set(days.data?.map((day) => day.prayedOn));
  const weekdayFormat = new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' });
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const resumable = plan !== null && isResumable(plan.startedAt) ? plan : null;
  const resumeDecade =
    resumable === null ? 1 : (stepsFor(resumable, mysteryRefsOf(resumable.set))[position]?.decade ?? 1);

  async function handleStart(set: MysterySet, scope: 'full' | 'decade') {
    await startSession(set, scope === 'full' ? { kind: 'full' } : { kind: 'decade', decade: 1 });
    router.push('/pray');
  }

  return (
    <>
      <Stack.Screen options={{ title: t('tabs.pray'), headerLargeTitle: false, headerShown: false }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-8 px-5 pb-16">
        <View className="flex-row items-center justify-between pt-3">
          <Text variant="footnote" className="capitalize">
            {dateFormat.format(now)}
          </Text>
          <Link href="/settings" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('settings.title')}
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-surface"
            >
              <Icon name="settings" color={colors.muted} />
            </Pressable>
          </Link>
        </View>

        <View className="gap-5">
          <View className="gap-1">
            <Text variant="eyebrow">{t('home.today')}</Text>
            <Text variant="display">{t(`sets.${todaySet}`)}</Text>
          </View>

          {artwork !== undefined && (
            <Card style={{ height: Math.min(width - 40, 420) * 0.8, backgroundColor: artwork.color }}>
              <Image
                source={artwork.source}
                placeholder={{ thumbhash: artwork.thumbhash }}
                contentFit="cover"
                contentPosition="center"
                transition={200}
                accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
                style={{ flex: 1 }}
              />
            </Card>
          )}

          <View className="gap-2.5">
            {mysteries.map((mystery, index) => (
              <View key={mystery.id} className="flex-row items-baseline gap-3">
                <Text variant="footnote" className="w-4 text-faint" style={{ fontVariant: ['tabular-nums'] }}>
                  {index + 1}
                </Text>
                <Text variant="callout" className="flex-1 font-prayer text-[18px] leading-[24px]">
                  {mysteryTitle(mystery.id, locale)}
                </Text>
              </View>
            ))}
          </View>

          <View className="gap-3">
            <Button label={t('home.pray')} onPress={() => void handleStart(todaySet, 'full')} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/begin', params: { set: todaySet } })}
              className="min-h-[44px] flex-row items-center justify-center gap-2 active:opacity-60"
            >
              <Icon name={listens ? 'listen' : 'tap'} size={18} color={colors.muted} />
              <Text variant="footnote">
                {listens ? t('home.summaryListen') : t('home.summaryTap')} · {t(`locales.${prayerLocale}`)}
              </Text>
              <Icon name="chevron" size={14} color={colors.faint} />
            </Pressable>
          </View>
        </View>

        {resumable !== null && (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/pray')}
            className="flex-row items-center gap-4 rounded-card bg-surface p-4 active:opacity-80"
            style={{ borderCurve: 'continuous' }}
          >
            <Icon name="rosary" color={colors.accent} />
            <View className="flex-1 gap-0.5">
              <Text variant="headline">{t('home.resume')}</Text>
              <Text variant="footnote">
                {t('home.resumeDetail', {
                  decade: resumeDecade,
                  set: t(`setShort.${resumable.set}`),
                })}
              </Text>
            </View>
            <Icon name="chevron" size={18} color={colors.faint} />
          </Pressable>
        )}

        <View className="gap-3">
          <Text variant="eyebrow">{t('home.week')}</Text>
          <View className="flex-row">
            {week.map((day) => {
              const key = formatLocalDate(day);
              return (
                <WeekDay
                  key={key}
                  label={weekdayFormat.format(new Date(day.year, day.month - 1, day.day))}
                  prayed={prayedDays.has(key)}
                  today={key === formatLocalDate(today)}
                />
              );
            })}
          </View>
        </View>

        <View className="gap-3">
          <Text variant="eyebrow">{t('home.otherSets')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {mysterySets.map((set) => (
              <SetChip
                key={set}
                set={set}
                active={set === todaySet}
                onPress={() => router.push({ pathname: '/begin', params: { set } })}
              />
            ))}
          </View>
          <Button
            label={t('home.decade')}
            variant="plain"
            onPress={() => void handleStart(todaySet, 'decade')}
          />
        </View>

        <Link href="/lesson/how-to-pray" asChild>
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center gap-4 rounded-card border border-border p-4 active:bg-surface"
            style={{ borderCurve: 'continuous' }}
          >
            <Icon name="learn" color={colors.accent} />
            <View className="flex-1 gap-0.5">
              <Text variant="headline">{t('home.learnTitle')}</Text>
              <Text variant="footnote">{t('home.learnDetail')}</Text>
            </View>
            <Icon name="chevron" size={18} color={colors.faint} />
          </Pressable>
        </Link>
      </ScrollView>
    </>
  );
}
