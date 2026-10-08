import type { TextureId } from './skins';

export const textures: Record<TextureId, Record<'light' | 'dark', number>> = {
  parchment: {
    light: require('@/assets/textures/parchment-light.jpg') as number,
    dark: require('@/assets/textures/parchment-dark.jpg') as number,
  },
};
