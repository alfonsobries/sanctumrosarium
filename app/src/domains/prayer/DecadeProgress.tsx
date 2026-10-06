import { View } from 'react-native';

type DecadeProgressProperties = {
  /** 0..1 for each of the five decades. */
  fills: readonly number[];
  label: string;
};

export function DecadeProgress({ fills, label }: DecadeProgressProperties) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} className="flex-row gap-1.5">
      {fills.map((fill, index) => (
        <View key={index} className="h-[3px] flex-1 overflow-hidden rounded-full bg-bead">
          <View className="h-full rounded-full bg-accent" style={{ width: `${Math.round(fill * 100)}%` }} />
        </View>
      ))}
    </View>
  );
}
