import {
  bookOf,
  hasPrayerText,
  litany,
  mysteryTitle,
  passage,
  prayerText,
  prayerTitle,
  type Locale,
} from '@sanctamaria/content';
import { evangelistOf, type Step } from '@sanctamaria/rosary';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { artworks } from '@/domains/artwork/artworks';
import type { Settings } from '@/domains/settings/settings';
import { useSkin } from '@/shared/theme/SkinProvider';
import { Text } from '@/shared/ui/Text';

const sizes: Record<Settings['textSize'], { size: number; line: number }> = {
  regular: { size: 22, line: 32 },
  large: { size: 26, line: 37 },
  larger: { size: 31, line: 43 },
};

type StepContentProperties = {
  step: Step;
  locale: Locale;
  textSize: Settings['textSize'];
};

function PrayerLines({ id, locale, textSize }: { id: string; locale: Locale; textSize: Settings['textSize'] }) {
  const { skin } = useSkin();
  const text = prayerText(id, locale);
  const { size, line } = sizes[textSize];
  const response = text.responseFrom ?? text.lines.length;
  const first = text.lines[0];
  const firstLetter = first?.charAt(0) ?? '';

  return (
    <View className="gap-1">
      {text.lines.map((value, index) => {
        const isResponse = index >= response;
        const dropCap = skin.dropCap && index === 0 && firstLetter !== '';
        return (
          <Text
            key={index}
            className={`${isResponse ? 'font-prayer-italic text-muted' : 'font-prayer text-foreground'}`}
            style={{ fontSize: size, lineHeight: line }}
          >
            {dropCap ? (
              <>
                <Text className="font-display text-rubric" style={{ fontSize: size * 1.6, lineHeight: line }}>
                  {firstLetter}
                </Text>
                {value.slice(1)}
              </>
            ) : (
              value
            )}
          </Text>
        );
      })}
    </View>
  );
}

/** The body of the current step: the prayer's words, the mystery, the reading or the litany. */
export function StepContent({ step, locale, textSize }: StepContentProperties) {
  const { t } = useTranslation();
  const { size, line } = sizes[textSize];

  if (step.kind === 'announce') {
    const artwork = artworks[step.mystery.id];
    return (
      <View className="items-center gap-6">
        {artwork !== undefined && (
          <View
            className="overflow-hidden rounded-card"
            style={{ width: 168, height: 210, backgroundColor: artwork.color, borderCurve: 'continuous' }}
          >
            <Image
              source={artwork.source}
              placeholder={{ thumbhash: artwork.thumbhash }}
              contentFit="cover"
              contentPosition="top"
              transition={200}
              accessibilityLabel={`${artwork.title}, ${artwork.artist}`}
              style={{ flex: 1 }}
            />
          </View>
        )}
        <Text
          className="text-center font-prayer text-foreground"
          style={{ fontSize: size + 4, lineHeight: line + 4 }}
        >
          {mysteryTitle(step.mystery.id, locale)}
        </Text>
      </View>
    );
  }

  if (step.kind === 'reading') {
    const text = passage(step.reading.ref, locale);
    const evangelist = evangelistOf(step.reading);
    return (
      <View className="gap-4">
        <Text variant="eyebrow" className="text-rubric">
          {evangelist === null
            ? (text?.displayRef ?? step.reading.ref)
            : `${t('pray.readingFrom', { evangelist: t(`evangelists.${evangelist}`) })} · ${text?.displayRef ?? step.reading.ref}`}
        </Text>
        <Text className="font-prayer text-foreground" style={{ fontSize: size - 2, lineHeight: line - 2 }}>
          {text?.text ?? bookOf(step.reading.ref)}
        </Text>
      </View>
    );
  }

  if (step.prayer === 'litany-of-loreto') {
    const { pairs } = litany(locale);
    return (
      <View className="gap-2">
        {pairs.map((pair, index) => (
          <Text key={index} className="font-prayer text-foreground" style={{ fontSize: size - 3, lineHeight: line - 4 }}>
            {pair.call} <Text className="font-prayer-italic text-muted">{pair.response}</Text>
          </Text>
        ))}
      </View>
    );
  }

  if (!hasPrayerText(step.prayer, locale)) {
    return null;
  }

  return <PrayerLines id={step.prayer} locale={locale} textSize={textSize} />;
}

/** Heading over the step: which prayer, and the count for the Hail Marys. */
export function stepHeading(step: Step, locale: Locale, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (step.kind === 'announce') {
    return t('pray.mystery', {
      ordinal: t(`ordinal.${step.mystery.order - 1}`),
      set: t(`setAdjective.${step.mystery.set}`),
    });
  }
  if (step.kind === 'reading') {
    return t('pray.reading');
  }
  const title = prayerTitle(step.prayer, locale);
  return step.count === null ? title : `${title} · ${t('pray.hailMaryCount', step.count)}`;
}

export function StepScroll({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="flex-grow justify-center px-6 py-4"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
