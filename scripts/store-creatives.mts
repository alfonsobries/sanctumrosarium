/**
 * App Store creative assets: the product page header (21:9, 3840x1646) and the search
 * results asset (3:2, 3840x2560), one per locale. Apple crops both around the centre, so
 * everything that carries meaning sits inside its safe area (header 1646x661, search
 * 2168x1030, centred) and the rest is bleed.
 *
 * Run: pnpm store:creatives  → store/apple/{es-MX,en-US}/{header,search}/01-*.png
 *      pnpm store:creatives --guides  → the same with the safe areas outlined, in store/preview/
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium } from 'playwright';
import sharp from 'sharp';

const root = join(import.meta.dirname, '..');
const guides = process.argv.includes('--guides');

type Lang = 'es' | 'en';
const folders: Record<Lang, string> = { es: 'es-MX', en: 'en-US' };

const file = (path: string) => pathToFileURL(join(root, path)).href;
const raw = (lang: Lang, name: string) => file(`store/raw/${lang}/${name}.png`);
const painting = (name: string) => file(`app/assets/mysteries/original/${name}.jpg`);
const fonts = {
  serif: file('site/node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2'),
  serifItalic: file('site/node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2'),
  sans: file('site/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
};
const medallion = readFileSync(join(root, 'app/assets/brand/sanctumrosarium-logo.svg'), 'utf8')
  .replace(/<title>.*?<\/title>/, '')
  .replace(/ color="[^"]*"/, '');

const copy = {
  header: { es: 'Reza el Rosario <em>cada día</em>', en: 'Pray the Rosary <em>every day</em>' },
  searchKicker: { es: 'iPhone · iPad · Apple Watch', en: 'iPhone · iPad · Apple Watch' },
  searchTitle: {
    es: 'El Santo Rosario, <em>con voz</em>',
    en: 'The Holy Rosary, <em>with a voice</em>',
  },
  searchBody: {
    es: 'El misterio del día, el Evangelio y las cuentas a la vista. Sin cuentas de usuario ni anuncios.',
    en: "The day's mystery, its Gospel and the beads in view. No account, no ads.",
  },
};

type Creative = { name: 'header' | 'search'; width: number; height: number; safe: [number, number] };
const creatives: Creative[] = [
  { name: 'header', width: 3840, height: 1646, safe: [1646, 661] },
  { name: 'search', width: 3840, height: 2560, safe: [2168, 1030] },
];

const base = (c: Creative) => `
  @font-face { font-family: Garamond; src: url('${fonts.serif}') format('woff2'); font-weight: 400 800; }
  @font-face { font-family: Garamond; src: url('${fonts.serifItalic}') format('woff2'); font-style: italic; font-weight: 400 800; }
  @font-face { font-family: Inter; src: url('${fonts.sans}') format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${c.width}px; height: ${c.height}px; overflow: hidden; }
  body { position: relative; background: #0f1420; color: #efe8dc; font-family: Inter, sans-serif; }
  em { font-style: italic; color: #d6a48f; }
  .art { position: absolute; top: 0; bottom: 0; width: 46%; background-size: cover; background-position: center 30%; opacity: .5; filter: brightness(.7) saturate(.9); }
  .art.left { left: 0; -webkit-mask-image: linear-gradient(90deg, #000 30%, transparent); }
  .art.right { right: 0; -webkit-mask-image: linear-gradient(270deg, #000 30%, transparent); }
  .glow { position: absolute; left: 50%; top: 50%; width: 2600px; height: 2600px; transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgb(214 164 143 / .2), transparent 60%); }
  .safe { position: absolute; left: 50%; top: 50%; width: ${c.safe[0]}px; height: ${c.safe[1]}px; transform: translate(-50%, -50%); }
  .guide { outline: 6px dashed #3cf; }
  .phone { position: relative; aspect-ratio: 1206 / 2622; padding: 2.4%; border-radius: 13% / 6%;
    background: linear-gradient(145deg, #2f3440, #0b0d12 60%);
    box-shadow: 0 0 0 3px rgb(255 255 255 / .08) inset, 0 80px 160px -30px rgb(0 0 0 / .7); }
  .phone img { width: 100%; height: 100%; object-fit: cover; border-radius: 11% / 5.1%; display: block; }
  .watch { position: relative; }
  .watch .case { aspect-ratio: 416 / 496; padding: 7%; border-radius: 30% / 25%;
    background: linear-gradient(145deg, #3a3f4c, #0b0d12 60%);
    box-shadow: 0 0 0 3px rgb(255 255 255 / .1) inset, 0 80px 160px -20px rgb(0 0 0 / .8); }
  .watch img { width: 100%; height: 100%; object-fit: cover; border-radius: 24% / 20%; display: block; background: #000; }
  .watch .crown { position: absolute; right: -3.5%; top: 24%; width: 5%; height: 15%; border-radius: 10px; background: linear-gradient(90deg, #1c1f27, #4a505e); }
`;

function header(c: Creative, lang: Lang): string {
  return `<style>${base(c)}
    .safe { display: flex; align-items: center; justify-content: center; gap: 90px; }
    .mark { width: 440px; height: 440px; color: #d6a48f; flex: none; }
    .mark svg { width: 100%; height: 100%; }
    h1 { font-family: Garamond, serif; font-weight: 500; font-size: 150px; line-height: 1.02; width: 1060px; }
  </style>
  <div class="art left" style="background-image:url('${painting('annunciation')}')"></div>
  <div class="art right" style="background-image:url('${painting('resurrection')}')"></div>
  <div class="glow"></div>
  <div class="safe ${guides ? 'guide' : ''}">
    <div class="mark">${medallion}</div>
    <h1>${copy.header[lang]}</h1>
  </div>`;
}

function search(c: Creative, lang: Lang): string {
  return `<style>${base(c)}
    .safe { display: flex; align-items: center; gap: 110px; }
    .words { flex: 1; display: grid; gap: 40px; }
    .kicker { font-size: 56px; font-weight: 600; letter-spacing: .04em; color: #d6a48f; }
    .art { opacity: .32; }
    h1 { font-family: Garamond, serif; font-weight: 500; font-size: 150px; line-height: 1.02; }
    p { font-size: 54px; line-height: 1.35; color: #b4ad9f; }
    .devices { position: relative; width: 820px; height: 100%; flex: none; }
    .devices .phone { position: absolute; width: 640px; left: 0; top: 50%; transform: translateY(-50%); }
    .devices .watch { position: absolute; width: 380px; right: -60px; bottom: -120px; z-index: 2; }
  </style>
  <div class="art left" style="background-image:url('${painting('baptism')}')"></div>
  <div class="art right" style="background-image:url('${painting('nativity')}')"></div>
  <div class="glow"></div>
  <div class="safe ${guides ? 'guide' : ''}">
    <div class="words">
      <div class="kicker">${copy.searchKicker[lang]}</div>
      <h1>${copy.searchTitle[lang]}</h1>
      <p>${copy.searchBody[lang]}</p>
    </div>
    <div class="devices">
      <div class="phone"><img src="${raw(lang, 'pray-dark')}" /></div>
      <div class="watch"><div class="case"><img src="${raw(lang, 'watch-beads')}" /></div><span class="crown"></span></div>
    </div>
  </div>`;
}

const browser = await chromium.launch();
const temp = join(root, 'store/.render');
mkdirSync(temp, { recursive: true });
for (const c of creatives) {
  const tab = await browser.newPage({ viewport: { width: c.width, height: c.height }, deviceScaleFactor: 1 });
  for (const lang of ['es', 'en'] as const) {
    const html = join(temp, `${c.name}-${lang}.html`);
    writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"></head><body>${(c.name === 'header' ? header : search)(c, lang)}</body></html>`);
    await tab.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    const png = await tab.screenshot({ type: 'png' });
    const dir = guides ? join(root, 'store/preview') : join(root, 'store/apple', folders[lang], c.name);
    mkdirSync(dir, { recursive: true });
    const target = join(dir, guides ? `${c.name}-${folders[lang]}.png` : `01-${c.name}.png`);
    // App Store creative assets must not carry an alpha channel.
    await sharp(png).flatten({ background: '#0f1420' }).removeAlpha().toColorspace('srgb').png().toFile(target);
    console.log(`  ${target.replace(`${root}/`, '')}`);
  }
  await tab.close();
}
await browser.close();
