import { Redirect, Stack } from 'expo-router';

/** Development-only gallery: tokens, typography, components and native controls. */
export default function DevLayout() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}
    />
  );
}
