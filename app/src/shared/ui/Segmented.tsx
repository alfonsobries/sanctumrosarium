import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

import { Text } from './Text';

type SegmentedProperties<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
};

export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedProperties<T>) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      className="flex-row rounded-full bg-surface p-1"
      style={{ borderCurve: 'continuous' }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) {
                void Haptics.selectionAsync();
                onChange(option.value);
              }
            }}
            className={`min-h-[40px] flex-1 items-center justify-center rounded-full px-2 ${selected ? 'bg-surface-raised' : ''}`}
          >
            <Text variant="footnote" numberOfLines={1} className={selected ? 'font-semibold text-foreground' : 'text-muted'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
