import { View, type ViewProps } from 'react-native';

export function Card({ className, style, ...rest }: ViewProps) {
  return (
    <View
      className={`overflow-hidden rounded-card bg-surface ${className ?? ''}`}
      style={[{ borderCurve: 'continuous' }, style]}
      {...rest}
    />
  );
}
