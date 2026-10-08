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
import { Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import {
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { UnifrakturMaguntia_400Regular } from '@expo-google-fonts/unifrakturmaguntia';
import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_400Regular_Italic,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import { prepareAudio } from '@/domains/audio/use-rosary-audio';
import { journalKeys } from '@/domains/journal/queries';
import { useSettings, useSettingsHydrated } from '@/domains/settings/use-settings';
import { syncNow } from '@/domains/sync/account';
import { useWatchSync } from '@/domains/watch/use-watch-sync';
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
  const prayerLocale = useSettings((state) => state.prayerLocale);
  useEffect(() => {
    // Resolve the voice files in the background so pressing Pray starts at once.
    void prepareAudio(prayerLocale);
  }, [prayerLocale]);
  useWatchSync(() => queryClient.invalidateQueries({ queryKey: journalKeys.all }));
  const { t } = useTranslation();
  const { colors, scheme, screenBackground } = useSkin();
  const onboarded = useSettings((state) => state.onboarded);

  const theme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: screenBackground,
        card: colors.background,
        text: colors.foreground,
        border: colors.border,
      },
    };
  }, [colors, scheme]);

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: screenBackground } }}>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="pray"
            options={{
              presentation: 'fullScreenModal',
              gestureEnabled: false,
              animation: 'fade',
              headerShown: true,
              headerTransparent: process.env.EXPO_OS === 'ios',
              headerShadowVisible: false,
              headerStyle: process.env.EXPO_OS === 'ios' ? undefined : { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
              headerTitle: '',
              scrollEdgeEffects: { top: 'soft', bottom: 'soft', left: 'hidden', right: 'hidden' },
            }}
          />
          <Stack.Screen
            name="begin"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              sheetGrabberVisible: true,
              sheetCornerRadius: 24,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'modal',
              contentStyle: { backgroundColor: colors.background },
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
    Cinzel_600SemiBold,
    Nunito_600SemiBold,
    Nunito_600SemiBold_Italic,
    Nunito_800ExtraBold,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_400Regular_Italic,
    AtkinsonHyperlegible_700Bold,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_700Bold,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SkinProvider>
          <Navigation />
        </SkinProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
