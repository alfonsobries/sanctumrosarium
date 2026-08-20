import '@/i18n/polyfills';

import {
  Alegreya_500Medium,
  Alegreya_500Medium_Italic,
  Alegreya_600SemiBold,
  useFonts,
} from '@expo-google-fonts/alegreya';
import { getLocales } from 'expo-localization';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorScreen } from '@/components/ErrorScreen';
import { initI18n } from '@/i18n';
import { resolveInterfaceLanguage } from '@/settings/resolve-locale';
import { SettingsProvider } from '@/settings/settings-context';
import { loadSettings } from '@/settings/store';
import { createSqliteDriver } from '@/storage/sqlite-driver';
import { navigationTheme } from '@/theme/navigation-theme';
import { useAppTheme } from '@/theme/use-theme';

// Settings load synchronously before the first frame: the theme and the language are
// right from the very first render, with no flash.
const driver = createSqliteDriver();
const initialSettings = loadSettings(driver);
initI18n(
  resolveInterfaceLanguage(
    initialSettings.interfaceLanguage,
    getLocales().map((locale) => ({
      languageCode: locale.languageCode,
      regionCode: locale.regionCode,
    })),
  ),
);

void SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ retry }: { retry: () => Promise<void> }) {
  return <ErrorScreen onRetry={() => void retry()} />;
}

function RootNavigator() {
  const { scheme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="pray" options={{ gestureEnabled: true }} />
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, title: t('settings.title') }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Alegreya_500Medium,
    Alegreya_500Medium_Italic,
    Alegreya_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SettingsProvider driver={driver} initialSettings={initialSettings}>
      <RootNavigator />
    </SettingsProvider>
  );
}
