import { Image } from 'expo-image';
import { useColorScheme, vars } from 'nativewind';
import { createContext, use, useEffect, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';

import { useSettings } from '@/domains/settings/use-settings';

import { skins, skinVariables, type Palette, type Skin } from './skins';
import { textures } from './textures';

type SkinContextValue = {
  skin: Skin;
  scheme: 'light' | 'dark';
  /** Resolved hex colors, for native props that cannot take a class (tab bars, SVG). */
  colors: Palette;
  /** The skin's material (parchment) for this scheme, if it has one. */
  texture: number | undefined;
  /** Background for navigator screens: transparent when a texture shows through. */
  screenBackground: string;
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
  const skin = skins[skinId] ?? skins.simple;

  const value = useMemo(() => {
    const texture = skin.texture === undefined ? undefined : textures[skin.texture][scheme];
    return {
      skin,
      scheme,
      colors: skin[scheme],
      texture,
      screenBackground: texture === undefined ? skin[scheme].background : 'transparent',
    };
  }, [skin, scheme]);
  const style = useMemo(() => vars(skinVariables(skin, scheme)), [skin, scheme]);

  return (
    <SkinContext value={value}>
      <View style={[{ flex: 1 }, style]} className="bg-background">
        <ScreenTextureImage texture={value.texture} />
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

function ScreenTextureImage({ texture }: { texture: number | undefined }) {
  if (texture === undefined) {
    return null;
  }
  return (
    <Image
      source={texture}
      contentFit="cover"
      style={{ position: 'absolute', inset: 0 }}
      accessibilityIgnoresInvertColors
    />
  );
}

/** The skin's material behind a screen presented outside the main stack (full-screen modals). */
export function ScreenTexture() {
  const { texture } = useSkin();
  return <ScreenTextureImage texture={texture} />;
}
