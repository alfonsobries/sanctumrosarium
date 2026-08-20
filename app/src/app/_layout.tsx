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
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorScreen } from '@/components/ErrorScreen';
import { initI18n } from '@/i18n';
import { resolveInterfaceLanguage } from '@/settings/resolve-locale';
import { applyReminder } from '@/features/reminder/apply';
import { SettingsProvider, useSettings } from '@/settings/settings-context';
import { loadSettings } from '@/settings/store';
import { appKv } from '@/storage/app-kv';
import { navigationTheme } from '@/theme/navigation-theme';
import { useAppTheme } from '@/theme/use-theme';

// Settings load synchronously before the first frame: the theme and the language are
// right from the very first render, with no flash.
const driver = appKv;
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
  const { settings } = useSettings();

  // Keeps the scheduled notices in step with the settings and the language, without
  // ever asking for permission on its own: that only happens when the person enables
  // the reminder.
  useEffect(() => {
    void applyReminder(settings, t('reminder.body'), { requestPermission: false });
  }, [settings, t]);

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="pray" options={{ gestureEnabled: true }} />
        <Stack.Screen
          name="litany"
          options={{
            headerShown: true,
            title: t('litany.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="roses"
          options={{
            headerShown: true,
            title: t('roses.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="intentions"
          options={{
            headerShown: true,
            title: t('intentions.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="fidelity"
          options={{
            headerShown: true,
            title: t('fidelity.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="rule"
          options={{
            headerShown: true,
            title: t('rule.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: t('settings.title'),
            headerBackButtonDisplayMode: 'minimal',
          }}
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
    <GestureHandlerRootView style={styles.root}>
      <SettingsProvider driver={driver} initialSettings={initialSettings}>
        <RootNavigator />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
