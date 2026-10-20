import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { readableWidth } from '@/shared/ui/layout';

type SettingsPageProperties = {
  title: string;
  children: React.ReactNode;
};

/** One page of the settings sheet: its title in the header and its sections in a scroll. */
export function SettingsPage({ title, children }: SettingsPageProperties) {
  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName={`gap-7 px-5 pb-16 pt-4 ${readableWidth}`}
      >
        {children}
      </ScrollView>
    </>
  );
}
