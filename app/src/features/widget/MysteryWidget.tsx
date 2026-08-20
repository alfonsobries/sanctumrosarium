import { Text, VStack } from '@expo/ui/swift-ui';
import { font, widgetURL } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import { WIDGET_URL, type MysteryWidgetProperties } from './timeline';

/**
 * The passive reminder (task 019): the mystery of the day on the Home Screen and Lock
 * Screen, never a streak, never a number. Tapping opens the prayer, ready to begin.
 */
const MysteryOfDay = (props: MysteryWidgetProperties, environment: WidgetEnvironment) => {
  'widget';
  const url = widgetURL(WIDGET_URL);
  const titleFont = font({
    design: 'serif',
    textStyle: 'headline',
    weight: 'semibold',
  });
  const bodyFont = font({ design: 'serif', textStyle: 'caption' });
  const noteFont = font({ textStyle: 'caption2' });
  const note =
    props.note === '' ? null : <Text modifiers={[noteFont]}>{props.note}</Text>;

  if (environment.widgetFamily === 'accessoryInline') {
    return <Text modifiers={[url]}>{props.setName}</Text>;
  }

  if (environment.widgetFamily === 'systemMedium') {
    return (
      <VStack spacing={4} alignment="leading" modifiers={[url]}>
        <Text modifiers={[titleFont]}>{props.setName}</Text>
        {props.titles.map((title) => (
          <Text key={title} modifiers={[bodyFont]}>
            {title}
          </Text>
        ))}
        {note}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} alignment="leading" modifiers={[url]}>
      <Text modifiers={[titleFont]}>{props.setName}</Text>
      {note}
    </VStack>
  );
};

export const mysteryWidget = createWidget('MysteryOfDay', MysteryOfDay);
