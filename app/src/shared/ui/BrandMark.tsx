import { SvgXml } from 'react-native-svg';

import { brandLogo } from './brand-logo.gen';

type BrandMarkProperties = {
  size: number;
  color: string;
};

/** The SanctaMaria medallion: the rosary ring around Our Lady, in the skin's colour. */
export function BrandMark({ size, color }: BrandMarkProperties) {
  return <SvgXml xml={brandLogo} width={size} height={size} color={color} accessible={false} />;
}
