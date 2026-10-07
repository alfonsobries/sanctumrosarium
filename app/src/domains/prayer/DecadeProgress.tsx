import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

type DecadeProgressProperties = {
  /** 0..1 for each of the five decades. */
  fills: readonly number[];
  label: string;
  /** Jump to the start of a decade (1-5). */
  onSelect: (decade: number) => void;
  decadeLabel: (decade: number) => string;
};

export function DecadeProgress({ fills, label, onSelect, decadeLabel }: DecadeProgressProperties) {
  return (
    <View accessible={false} accessibilityLabel={label} className="flex-row gap-1.5">
      {fills.map((fill, index) => (
        <Pressable
          key={index}
          accessibilityRole="button"
          accessibilityLabel={decadeLabel(index + 1)}
          hitSlop={{ top: 14, bottom: 14 }}
          onPress={() => {
            void Haptics.selectionAsync();
            onSelect(index + 1);
          }}
          className="flex-1 py-2"
        >
          <View className="h-[3px] overflow-hidden rounded-full bg-bead">
            <View className="h-full rounded-full bg-accent" style={{ width: `${Math.round(fill * 100)}%` }} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
