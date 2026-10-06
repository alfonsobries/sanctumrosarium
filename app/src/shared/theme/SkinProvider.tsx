import { createContext, use, useEffect, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';

import { useSettings } from '@/domains/settings/use-settings';

import { skins, skinVariables, type Palette, type Skin } from './skins';

type SkinContextValue = {
  skin: Skin;
  scheme: 'light' | 'dark';
  /** Resolved hex colors, for native props that cannot take a class (tab bars, SVG). */
  colors: Palette;
};

const SkinContext = createContext<SkinContextValue | null>(null);

type SkinProviderProperties = { children: ReactNode };

export function SkinProvider({ children }: SkinProviderProperties) {
  const skinId = useSettings((state) => state.skin);
  const appearance = useSettings((state) => state.appearance);
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(appearance);
  }, [appearance, setColorScheme]);

  const scheme: 'light' | 'dark' = colorScheme === 'light' ? 'light' : 'dark';
  const skin = skins[skinId];

  const value = useMemo(
    () => ({ skin, scheme, colors: skin[scheme] }),
    [skin, scheme],
  );
  const style = useMemo(() => vars(skinVariables(skin, scheme)), [skin, scheme]);

  return (
    <SkinContext value={value}>
      <View style={[{ flex: 1 }, style]} className="bg-background">
        {children}
      </View>
    </SkinContext>
  );
}

export function useSkin(): SkinContextValue {
  const context = use(SkinContext);
  if (context === null) {
    throw new Error('useSkin must be used inside SkinProvider');
  }
  return context;
}
