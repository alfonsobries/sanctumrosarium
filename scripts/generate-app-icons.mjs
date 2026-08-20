#!/usr/bin/env node
/**
 * Generates every app icon and splash asset from the brand icon
 * (assets/icon.svg: night background, gold mark) into app/assets/icons/,
 * following the platform guidelines:
 *
 *   iOS (HIG): light = opaque full-bleed 1024; dark = opaque glyph on
 *   transparent background (the system supplies the dark backdrop);
 *   tinted = grayscale of the light icon (the system maps luminance to the tint).
 *
 *   Android (adaptive): 108dp layers with a 66dp safe zone - the mark stays at
 *   ~40% of the canvas so the circular mask shows it whole;
 *   monochrome = white mark on transparent.
 *
 *   Splash (expo-splash-screen): the mark alone, light + dark variants in the
 *   palette of each scheme.
 *
 * Run `pnpm icons:generate` after changing the mark or the palette, then
 * rebuild the native app.
 */

import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'app/assets/icons');

mkdirSync(outDir, { recursive: true });

const SIZE = 1024;
const source = readFileSync(join(root, 'assets/icon.svg'), 'utf8');

const night = '#0C0E12';
const gold = '#C4B089';
const splash = {
  light: { mark: '#96563F' },
  dark: { mark: gold },
};

/** The mark alone: same canvas, background dropped, recolored. */
function markOnly(color) {
  return source.replace(/<rect[^>]*\/>/, '').replaceAll(gold, color);
}

async function write(pipeline, file) {
  await pipeline.png().toFile(join(outDir, file));
  console.log(`  ${file}`);
}

/** Trims the transparent canvas down to the mark, then fits it in a box. */
async function renderMark(color, box) {
  const trimmed = await sharp(Buffer.from(markOnly(color)))
    .trim()
    .png()
    .toBuffer();
  return sharp(trimmed)
    .resize({ width: box, height: box, fit: 'inside' })
    .png()
    .toBuffer();
}

function transparentCanvas() {
  return sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
}

async function writeOnTransparent(mark, file) {
  await write(transparentCanvas().composite([{ input: mark, gravity: 'center' }]), file);
}

// iOS light (and universal fallback): the icon as designed, opaque full-bleed.
await write(sharp(Buffer.from(source)), 'ios-light.png');

// iOS dark: opaque glyph, transparent background (system adds the backdrop).
await writeOnTransparent(await renderMark(gold, 800), 'ios-dark.png');

// iOS tinted: grayscale of the light icon, opaque - the system maps luminance
// to the tint, so a transparent glyph would flatten to a solid square.
await write(sharp(join(outDir, 'ios-light.png')).grayscale(), 'ios-tinted.png');

// Android adaptive: the circular mask shows only the 66/108dp safe zone, so
// the mark stays at ~40% of the canvas to breathe inside the visible circle.
await writeOnTransparent(await renderMark(gold, 410), 'android-foreground.png');
await writeOnTransparent(await renderMark('#FFFFFF', 410), 'android-monochrome.png');
await write(
  sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: night } }),
  'android-background.png',
);

// Splash: the mark alone on transparency; the plugin paints each backdrop.
await writeOnTransparent(
  await renderMark(splash.light.mark, 820),
  'splash-icon-light.png',
);
await writeOnTransparent(await renderMark(splash.dark.mark, 820), 'splash-icon-dark.png');

// Web favicon.
await write(sharp(Buffer.from(source)).resize(64, 64), 'favicon.png');

console.log('App icons written to app/assets/icons.');
