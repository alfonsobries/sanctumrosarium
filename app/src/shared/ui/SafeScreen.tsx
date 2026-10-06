import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SafeScreenProperties = ViewProps & {
  /** Extra space beyond the safe area, top and bottom. */
  extraTop?: number;
  extraBottom?: number;
};

/** Full-screen surface (modals without a navigation bar) padded clear of the island and home indicator. */
export function SafeScreen({ extraTop = 0, extraBottom = 0, className, style, ...rest }: SafeScreenProperties) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={`flex-1 bg-background ${className ?? ''}`}
      style={[{ paddingTop: insets.top + extraTop, paddingBottom: Math.max(insets.bottom, 12) + extraBottom }, style]}
      {...rest}
    />
  );
}
