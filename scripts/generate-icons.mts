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

// The website: favicons and the touch icon in the same night and copper.
const sitePublic = join(root, 'site/public');
writeFileSync(join(sitePublic, 'favicon.svg'), framed(palette.copper, 0.9).replace('<svg ', `<svg style="background:${palette.night}" `));
await sharp(Buffer.from(framed(palette.copper, 0.9)), { density: 300 }).resize(32, 32).flatten({ background: palette.night }).png().toFile(join(sitePublic, 'favicon.ico'));
await sharp(Buffer.from(framed(palette.copper, 0.8)), { density: 300 }).resize(180, 180).flatten({ background: palette.night }).png().toFile(join(sitePublic, 'apple-touch-icon.png'));
await sharp(Buffer.from(framed(palette.copper, 0.8)), { density: 300 }).resize(512, 512).flatten({ background: palette.night }).png().toFile(join(sitePublic, 'icon.png'));
console.log('  site/public icons');

// In the app: the medallion as markup, painted with each skin's accent through currentColor.
const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${whole}</svg>`;
writeFileSync(
  join(root, 'app/src/shared/ui/brand-logo.gen.ts'),
  `// Generated by scripts/generate-icons.mts. Do not edit.\nexport const brandLogo = ${JSON.stringify(markup)};\n`,
);
console.log('  src/shared/ui/brand-logo.gen.ts');

console.log(`Icons written to app/assets. Splash backdrops: ${palette.ivory} light, ${palette.night} dark.`);
