/**
 * Every app icon, splash and favicon, generated from the brand logo
 * (app/assets/brand/sanctumrosarium-logo.svg) and written next to it under app/assets:
 *
 * - iOS: an Icon Composer bundle (app.icon) with two layers over the night fill: the
 *   rosary ring at the back, Our Lady and her stars in front. The system renders the
 *   Liquid Glass, dark, clear and tinted appearances from those layers.
 * - icon.png: the flat icon, for the watch (masked to a circle) and as the fallback.
 * - Android adaptive: foreground and monochrome inside the 66 of 108 dp safe zone, so
 *   every launcher mask shows the whole medallion; a solid night background.
 * - Splash: the medallion alone; expo-splash-screen paints the light and dark backdrops.
 * - The app's own copy of the medallion (brand-logo.gen.ts), drawn in the skin's colour.
 *
 * Run `pnpm icons:generate` after changing the logo or the palette, then rebuild.
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'app/assets');
const source = readFileSync(join(assets, 'brand/sanctumrosarium-logo.svg'), 'utf8');

const palette = {
  night: '#0F1420',
  copper: '#C98F78',
  /** Darker copper for the light splash, where the logo's own tone is too faint. */
  copperOnLight: '#9A5F49',
  ivory: '#F3EEE6',
};

const size = 1024;
const viewBox = source.match(/viewBox="([^"]+)"/)?.[1];
if (viewBox === undefined) {
  throw new Error('The logo has no viewBox');
}
const logoSize = Number(viewBox.split(' ')[2]);

/** One block of the logo by its opening tag, through its matching close. */
function block(open: RegExp, close: string): string {
  const start = source.search(open);
  if (start === -1) {
    throw new Error(`Logo block not found: ${open}`);
  }
  let depth = 0;
  const tag = close.slice(2, -1);
  const pattern = new RegExp(`<${tag}[^>]*/>|</${tag}>|<${tag}[\\s>]`, 'g');
  pattern.lastIndex = start;
  for (let match = pattern.exec(source); match !== null; match = pattern.exec(source)) {
    if (match[0].endsWith('/>')) {
      if (depth === 0) {
        return source.slice(start, match.index + match[0].length);
      }
    } else if (match[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, match.index + match[0].length);
      }
    } else {
      depth += 1;
    }
  }
  throw new Error(`Unclosed logo block: ${open}`);
}

const rings = block(/<g fill="none" stroke="currentColor"/, '</g>');
const beads = block(/<g id="beads"/, '</g>');
const cross = block(/<path id="cross"/, '</path>');
const stars = block(/<g id="stars"/, '</g>');
const clip = block(/<clipPath id="inside"/, '</clipPath>');
const virgin = block(/<g id="virgin"/, '</g>');

function svg(body: string, color: string, canvas = logoSize): string {
  const offset = (canvas - logoSize) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-offset} ${-offset} ${canvas} ${canvas}" width="${canvas}" height="${canvas}">
  ${body.replaceAll('currentColor', color)}
</svg>
`;
}

const whole = `${rings}${beads}${cross}${stars}${clip}${virgin}`;

async function png(svgText: string, width: number, file: string, background?: string): Promise<void> {
  let image = sharp(Buffer.from(svgText), { density: (72 * width) / Number(svgText.match(/width="([\d.]+)"/)?.[1]) })
    .resize(width, width);
  if (background !== undefined) {
    image = image.flatten({ background });
  }
  await image.png().toFile(join(assets, file));
  console.log(`  ${file}`);
}

/** The logo centred on a square canvas, covering `share` of its side. */
const framed = (color: string, share: number): string => svg(whole, color, logoSize / share);

// iOS: Icon Composer bundle. The layers keep the logo's own coordinates; at 850 pt on
// the 1024 pt canvas the medallion sits clear of the rounded corners.
const bundle = join(assets, 'app.icon');
rmSync(bundle, { recursive: true, force: true });
mkdirSync(join(bundle, 'Assets'), { recursive: true });
writeFileSync(join(bundle, 'Assets/ring.svg'), svg(`${rings}${beads}${cross}`, palette.copper));
writeFileSync(join(bundle, 'Assets/our-lady.svg'), svg(`${stars}${clip}${virgin}`, palette.copper));
const toExtended = (hex: string): string =>
  [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(5)).join(',');
writeFileSync(
  join(bundle, 'icon.json'),
  `${JSON.stringify(
    {
      fill: { 'automatic-gradient': `extended-srgb:${toExtended(palette.night)},1.00000` },
      groups: [
        {
          layers: [{ 'image-name': 'our-lady.svg', name: 'our-lady', glass: true }],
          shadow: { kind: 'neutral', opacity: 0.5 },
          translucency: { enabled: true, value: 0.3 },
        },
        {
          layers: [{ 'image-name': 'ring.svg', name: 'ring', glass: true }],
          shadow: { kind: 'neutral', opacity: 0.5 },
          translucency: { enabled: true, value: 0.3 },
        },
      ],
      'supported-platforms': { squares: 'shared' },
    },
    null,
    2,
  )}\n`,
);
console.log('  app.icon');

// Flat icon: the watch masks it to a circle, so the medallion fills most of it.
await png(framed(palette.copper, 0.86), size, 'images/icon.png', palette.night);

// Android adaptive: the launcher mask shows the central 66 of 108 dp.
await png(framed(palette.copper, 0.58), size, 'images/android-icon-foreground.png');
await png(framed('#FFFFFF', 0.58), size, 'images/android-icon-monochrome.png');
await sharp({ create: { width: size, height: size, channels: 3, background: palette.night } })
  .png()
  .toFile(join(assets, 'images/android-icon-background.png'));
console.log('  images/android-icon-background.png');

// Splash: the medallion alone, light and dark.
await png(svg(whole, palette.copperOnLight), 600, 'images/splash-icon.png');
await png(svg(whole, palette.copper), 600, 'images/splash-icon-dark.png');

// Web.
await png(framed(palette.copper, 0.9), 64, 'images/favicon.png', palette.night);

// The website. Favicons use a simpler mark: at 16 to 48 px the rings and stars blur into
// a disc, while the beads, the cross and her mantle stay legible.
const sitePublic = join(root, 'site/public');
const virginOnly = virgin.replace(/<g id="sun">[\s\S]*?<\/g>/, '');
const small = [
  beads.replaceAll('r="36.068"', 'r="58"'),
  cross.replace('stroke-width="10.524"', 'stroke-width="40"'),
  clip,
  virginOnly.replace('stroke-width="13.777"', 'stroke-width="34"'),
].join('');
const tileCanvas = logoSize * 1.1;
const tileOrigin = -(tileCanvas - logoSize) / 2;
const tile = (fill: string, mark: string): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${tileOrigin} ${tileOrigin} ${tileCanvas} ${tileCanvas}" width="${tileCanvas}" height="${tileCanvas}">
  <rect x="${tileOrigin}" y="${tileOrigin}" width="${tileCanvas}" height="${tileCanvas}" rx="${tileCanvas * 0.22}" fill="${fill}"/>
  ${small.replaceAll('currentColor', mark)}
</svg>
`;

// The SVG favicon follows the system theme: ivory tile in light mode, night tile in dark.
writeFileSync(
  join(sitePublic, 'icon.svg'),
  tile('var(--tile)', 'var(--mark)').replace(
    '<rect',
    `<style>svg{--tile:${palette.ivory};--mark:${palette.copperOnLight}}@media (prefers-color-scheme:dark){svg{--tile:${palette.night};--mark:${palette.copper}}}</style>\n  <rect`,
  ),
);

// favicon.ico for browsers and crawlers that skip the SVG: 16, 32 and 48 px PNG entries.
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((width) =>
    sharp(Buffer.from(tile(palette.night, palette.copper)), { density: 300 }).resize(width, width).png().toBuffer(),
  ),
);
const icoHeader = Buffer.alloc(6 + 16 * icoSizes.length);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoSizes.length, 4);
let icoOffset = icoHeader.length;
icoSizes.forEach((width, index) => {
  const entry = 6 + 16 * index;
  icoHeader.writeUInt8(width, entry);
  icoHeader.writeUInt8(width, entry + 1);
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(icoImages[index].length, entry + 8);
  icoHeader.writeUInt32LE(icoOffset, entry + 12);
  icoOffset += icoImages[index].length;
});
writeFileSync(join(sitePublic, 'favicon.ico'), Buffer.concat([icoHeader, ...icoImages]));

// Home screen and install icons show the whole medallion; iOS and Android round the corners.
const fullBleed = async (share: number, width: number, file: string): Promise<void> => {
  await sharp(Buffer.from(framed(palette.copper, share)), { density: 300 })
    .resize(width, width)
    .flatten({ background: palette.night })
    .png()
    .toFile(join(sitePublic, file));
};
await fullBleed(0.8, 180, 'apple-touch-icon.png');
await fullBleed(0.8, 192, 'icon-192.png');
await fullBleed(0.8, 512, 'icon.png');
// Maskable: launchers may crop to a circle of 80%, so the medallion stays inside it.
await fullBleed(0.62, 512, 'icon-maskable.png');
rmSync(join(sitePublic, 'favicon.svg'), { force: true });
console.log('  site/public icons');

// In the app: the medallion as markup, painted with each skin's accent through currentColor.
const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${whole}</svg>`;
writeFileSync(
  join(root, 'app/src/shared/ui/brand-logo.gen.ts'),
  `// Generated by scripts/generate-icons.mts. Do not edit.\nexport const brandLogo = ${JSON.stringify(markup)};\n`,
);
console.log('  src/shared/ui/brand-logo.gen.ts');

console.log(`Icons written to app/assets. Splash backdrops: ${palette.ivory} light, ${palette.night} dark.`);
