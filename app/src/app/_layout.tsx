import '@/global.css';
import '@/shared/i18n';

import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_600SemiBold,
} from '@expo-google-fonts/eb-garamond';
import {
  IMFellEnglish_400Regular,
  IMFellEnglish_400Regular_Italic,
} from '@expo-google-fonts/im-fell-english';
import { UnifrakturMaguntia_400Regular } from '@expo-google-fonts/unifrakturmaguntia';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';

import { journalKeys } from '@/domains/journal/queries';
import { useSettings, useSettingsHydrated } from '@/domains/settings/use-settings';
import { syncNow } from '@/domains/sync/account';
import { SkinProvider, useSkin } from '@/shared/theme/SkinProvider';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, retry: false } },
});

function useJournalSync(): void {
  useEffect(() => {
    const run = async () => {
      await syncNow();
      await queryClient.invalidateQueries({ queryKey: journalKeys.all });
    };
    void run();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void run();
      }
    });
    return () => subscription.remove();
  }, []);
}

function Navigation() {
  useJournalSync();
  const { t } = useTranslation();
  const { colors, scheme } = useSkin();
  const onboarded = useSettings((state) => state.onboarded);

  const theme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.background,
        text: colors.foreground,
        border: colors.border,
      },
    };
  }, [colors, scheme]);

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="pray"
            options={{ presentation: 'fullScreenModal', gestureEnabled: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="begin"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              sheetGrabberVisible: true,
              sheetCornerRadius: 24,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.accent,
              headerTitleStyle: { color: colors.foreground },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="lesson/[id]" options={{ presentation: 'fullScreenModal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="welcome" options={{ animation: 'fade', title: t('onboarding.title') }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
    EBGaramond_600SemiBold,
    IMFellEnglish_400Regular,
    IMFellEnglish_400Regular_Italic,
    UnifrakturMaguntia_400Regular,
  });
  const hydrated = useSettingsHydrated();
  const ready = (fontsLoaded || fontError !== null) && hydrated;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SkinProvider>
        <Navigation />
      </SkinProvider>
    </QueryClientProvider>
  );
}
