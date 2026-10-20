import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle, labelsHidden } from '@expo/ui/swift-ui/modifiers';
import { View } from 'react-native';

import { useSkin } from '@/shared/theme/SkinProvider';
import { Icon } from '@/shared/ui/Icon';
import { Text } from '@/shared/ui/Text';

import { dateAt, minutesOf } from './reminders';

type TimeFieldProperties = {
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
};

/** A time of day chosen with the system's compact picker. */
export function TimeField({ label, minutes, onChange }: TimeFieldProperties) {
  const { colors, scheme } = useSkin();
  return (
    <View className="min-h-[52px] flex-row items-center gap-3 px-4 py-2">
      <Icon name="time" size={20} color={colors.accent} />
      <Text variant="callout" className="flex-1">
        {label}
      </Text>
      <Host matchContents colorScheme={scheme} seedColor={colors.accent}>
        <DatePicker
          title={label}
          selection={dateAt(minutes)}
          displayedComponents={['hourAndMinute']}
          onDateChange={(date) => onChange(minutesOf(date))}
          modifiers={[datePickerStyle('compact'), labelsHidden()]}
        />
      </Host>
    </View>
  );
}
