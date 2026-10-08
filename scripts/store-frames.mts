/**
 * The App Store screenshots: each frame is an HTML page composed from the raw captures
 * in store/raw/<lang>/ (taken from a release build in the simulator), photographed by a
 * headless browser at the 6.9" size and flattened to JPEG with no alpha.
 *
 * Run: pnpm store:frames            → store/apple/{es-MX,en-US}/NN-name.jpg
 *      pnpm store:frames --preview  → a contact sheet per language in store/preview/
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium } from 'playwright';
import sharp from 'sharp';

const root = join(import.meta.dirname, '..');
const W = 1320;
const H = 2868;

type Lang = 'es' | 'en';
const folders: Record<Lang, string> = { es: 'es-MX', en: 'en-US' };

const file = (path: string) => pathToFileURL(join(root, path)).href;
const raw = (lang: Lang, name: string) => file(`store/raw/${lang}/${name}.png`);
const art = (name: string) => file(`app/assets/mysteries/${name}.jpg`);
const fonts = {
  serif: file('site/node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2'),
  serifItalic: file('site/node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2'),
  sans: file('site/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
};
const medallion = readFileSync(join(root, 'app/assets/brand/sanctumrosarium-logo.svg'), 'utf8')
  .replace(/<title>.*?<\/title>/, '')
  .replace(/ color="[^"]*"/, '');

/** A phone drawn in CSS: generic, no vendor marks, sized by width. */
const phone = (src: string, width: number, style = '') =>
  `<div class="phone" style="width:${width}px;${style}"><img src="${src}" /></div>`;

/** The main phone: the same size and place on every frame, so the set reads as one strip. */
const hero = (src: string, style = '') => phone(src, 900, `position:relative;margin-top:110px;${style}`);

/** An Apple Watch case drawn in CSS, crown included. */
const watch = (src: string, width: number, style = '', band = false) =>
  `<div class="watch" style="width:${width}px;${style}">${band ? '<span class="band top"></span><span class="band bottom"></span>' : ''}<div class="case"><img src="${src}" /></div><span class="crown"></span><span class="button"></span></div>`;

type Frame = {
  name: string;
  /** Background: a night, ivory or copper ground, optionally over a blurred painting. */
  ground: 'night' | 'ivory' | 'copper' | 'deep';
  painting?: string;
  kicker: Record<Lang, string>;
  title: Record<Lang, string>;
  body: (lang: Lang) => string;
};

const frames: Frame[] = [
  {
    name: 'pray',
    ground: 'night',
    painting: 'annunciation',
    // App Review guideline 2.3.7: no price references, "free" included.
    kicker: { es: 'Sin cuentas · Sin anuncios', en: 'No account · No ads' },
    title: { es: 'Reza el Rosario <em>cada día</em>', en: 'Pray the Rosary <em>every day</em>' },
    body: (lang) => hero(raw(lang, 'pray-dark')),
  },
  {
    name: 'watch',
    ground: 'deep',
    kicker: { es: 'Apple Watch', en: 'Apple Watch' },
    title: { es: 'El Rosario completo, <em>en tu muñeca</em>', en: 'The whole Rosary, <em>on your wrist</em>' },
    // The watch alone, as large as the frame allows, its band running off both edges.
    body: (lang) => `<div class="solo">${watch(raw(lang, 'watch-beads'), 1000, '', true)}</div>`,
  },
  {
    name: 'voice',
    ground: 'copper',
    kicker: { es: 'Con voz o a tu ritmo', en: 'With a voice or at your pace' },
    title: { es: 'Dos voces rezan <em>contigo</em>', en: 'Two voices pray <em>with you</em>' },
    body: (lang) => hero(raw(lang, 'pray-light')),
  },
  {
    name: 'gospel',
    ground: 'night',
    painting: 'baptism',
    kicker: { es: 'Antes de cada decena', en: 'Before each decade' },
    title: { es: 'El Evangelio de <em>cada misterio</em>', en: 'The Gospel of <em>each mystery</em>' },
    body: (lang) => hero(raw(lang, 'gospel')),
  },
  {
    name: 'styles',
    ground: 'ivory',
    kicker: { es: 'Claro y oscuro en cada uno', en: 'Light and dark in each' },
    title: { es: 'Ocho estilos, de sencillo <em>a iluminado</em>', en: 'Eight styles, plain <em>to illuminated</em>' },
    body: (lang) =>
      phone(raw(lang, 'announce-glass'), 760, 'position:absolute;top:230px;left:50%;transform:translateX(-112%);opacity:.95') +
      phone(raw(lang, 'pray-dark'), 760, 'position:absolute;top:230px;left:50%;transform:translateX(12%);opacity:.95') +
      hero(raw(lang, 'announce'), 'z-index:2'),
  },
  {
    name: 'learn',
    ground: 'night',
    painting: 'finding-in-the-temple',
    kicker: { es: 'Para quien empieza', en: 'For those beginning' },
    title: { es: 'Aprende a <em>rezarlo</em>', en: 'Learn to <em>pray it</em>' },
    body: (lang) => hero(raw(lang, 'learn')),
  },
  {
    name: 'journal',
    ground: 'deep',
    kicker: { es: 'Sin cuentas ni servidor', en: 'No account, no server' },
    title: { es: 'Lo que rezas <em>se queda contigo</em>', en: 'What you pray <em>stays with you</em>' },
    body: (lang) => hero(raw(lang, 'journal')),
  },
];

const grounds = {
  night: { bg: '#0f1420', ink: '#efe8dc', accent: '#d6a48f', mute: '#b4ad9f' },
  deep: { bg: '#0a0e17', ink: '#efe8dc', accent: '#d9b45a', mute: '#b4ad9f' },
  copper: { bg: '#8a4f39', ink: '#fffaf2', accent: '#f3d9c9', mute: '#f3e3d8' },
  ivory: { bg: '#f6f1e8', ink: '#1d1a16', accent: '#8a4f39', mute: '#5b544a' },
};

function page(frame: Frame, lang: Lang, index: number): string {
  const g = grounds[frame.ground];
  const painting = frame.painting === undefined ? '' : `<div class="painting" style="background-image:url('${art(frame.painting)}')"></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: Garamond; src: url('${fonts.serif}') format('woff2'); font-weight: 400 800; }
    @font-face { font-family: Garamond; src: url('${fonts.serifItalic}') format('woff2'); font-style: italic; font-weight: 400 800; }
    @font-face { font-family: Inter; src: url('${fonts.sans}') format('woff2'); font-weight: 100 900; }
    * { box-sizing: border-box; margin: 0; }
    html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
    body { position: relative; background: ${g.bg}; color: ${g.ink}; font-family: Inter, sans-serif;
      display: flex; flex-direction: column; align-items: center; padding-top: 120px; }
    .painting { position: absolute; inset: -80px; background-size: cover; background-position: center top;
      filter: blur(10px) saturate(1.05); opacity: .78; transform: scale(1.06); }
    .painting::after { content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, ${g.bg}e6 0%, ${g.bg}8c 30%, ${g.bg}40 55%, ${g.bg}f2 100%); }
    .glow { position: absolute; width: 1600px; height: 1600px; left: 50%; top: 900px; transform: translateX(-50%);
      background: radial-gradient(circle, ${g.accent}33, transparent 62%); }
    .mark { position: absolute; right: -260px; top: 1320px; width: 1200px; height: 1200px; color: ${g.accent}; opacity: .07; }
    .mark svg { width: 100%; height: 100%; }
    .hero-mark { width: 170px; height: 170px; margin: -40px auto 0; color: ${g.accent}; }
    .hero-mark svg { width: 100%; height: 100%; }
    header { position: relative; z-index: 3; text-align: center; padding: 0 110px; display: grid; gap: 36px; align-content: end; height: 520px; }
    .kicker { font-size: 38px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: ${g.accent}; }
    h1 { font-family: Garamond, serif; font-weight: 500; font-size: 132px; line-height: 1.02; letter-spacing: -.01em; text-wrap: balance; }
    h1 em { font-style: italic; color: ${g.accent}; }
    .stage { position: relative; z-index: 2; flex: 1; width: 100%; display: flex; flex-direction: column; align-items: center; }
    .phone { position: relative; aspect-ratio: 1206 / 2622; padding: 2.4%; border-radius: 13% / 6%;
      background: linear-gradient(145deg, #2f3440, #0b0d12 60%);
      box-shadow: 0 0 0 2px rgb(255 255 255 / .08) inset, 0 60px 140px -30px rgb(0 0 0 / .65); }
    .phone img { width: 100%; height: 100%; object-fit: cover; border-radius: 11% / 5.1%; display: block; }
    .duo { position: relative; width: 100%; flex: 1; }
    .fan { position: relative; width: 100%; display: flex; justify-content: center; margin-top: 110px; }
    .fan .phone { position: absolute; top: 0; }
    .fan .phone:last-child { position: relative; }
    .watch { position: relative; z-index: 3; }
    .watch .case { aspect-ratio: 416 / 496; padding: 7%; border-radius: 30% / 25%;
      background: linear-gradient(145deg, #3a3f4c, #0b0d12 60%);
      box-shadow: 0 0 0 2px rgb(255 255 255 / .1) inset, 0 60px 140px -20px rgb(0 0 0 / .75); }
    .watch img { width: 100%; height: 100%; object-fit: cover; border-radius: 24% / 20%; display: block; background: #000; }
    .watch .crown { position: absolute; right: -3.5%; top: 24%; width: 5%; height: 15%; border-radius: 8px;
      background: linear-gradient(90deg, #1c1f27, #4a505e); }
    .solo { width: 100%; flex: 1; display: flex; justify-content: center; align-items: center; padding-bottom: 120px; }
    .watch .band { position: absolute; left: 13%; width: 74%; height: 1400px; z-index: -1;
      background: linear-gradient(90deg, #15181f, #2a2f3a 20%, #343a47 50%, #2a2f3a 80%, #15181f);
      box-shadow: inset 0 0 0 2px rgb(255 255 255 / .04); }
    .watch .band::after { content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(0deg, transparent 0 22px, rgb(255 255 255 / .025) 22px 24px); }
    .watch .band.top { bottom: 92%; border-radius: 40px 40px 0 0; }
    .watch .band.bottom { top: 92%; border-radius: 0 0 40px 40px; }
    .watch .button { position: absolute; right: -2%; top: 46%; width: 3%; height: 20%; border-radius: 8px; background: #1c1f27; }
    .note { position: relative; z-index: 3; margin-top: auto; margin-bottom: 150px; font-size: 44px; color: ${g.mute}; text-align: center; padding: 0 140px; text-wrap: balance; }
  </style></head><body>
    ${painting}
    <div class="glow"></div>
    ${index === 0 ? '' : `<div class="mark">${medallion}</div>`}
    <header>
      ${index === 0 ? `<div class="hero-mark">${medallion}</div>` : ''}
      <div class="kicker">${frame.kicker[lang]}</div>
      <h1>${frame.title[lang]}</h1>
    </header>
    <div class="stage">${frame.body(lang)}</div>
  </body></html>`;
}

const preview = process.argv.includes('--preview');
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const temp = join(root, 'store/.render');
mkdirSync(temp, { recursive: true });

for (const lang of ['es', 'en'] as const) {
  const out = join(root, 'store/apple', folders[lang]);
  mkdirSync(out, { recursive: true });
  const shots: string[] = [];
  for (const [index, frame] of frames.entries()) {
    const html = join(temp, `${lang}-${frame.name}.html`);
    writeFileSync(html, page(frame, lang, index));
    await tab.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    const png = await tab.screenshot({ type: 'png' });
    const target = join(out, `${String(index + 1).padStart(2, '0')}-${frame.name}.jpg`);
    await sharp(png).flatten({ background: '#000' }).toColorspace('srgb').jpeg({ quality: 92, mozjpeg: true }).toFile(target);
    shots.push(target);
    console.log(`  ${folders[lang]}/${String(index + 1).padStart(2, '0')}-${frame.name}.jpg`);
  }
  if (preview) {
    mkdirSync(join(root, 'store/preview'), { recursive: true });
    const tiles = await Promise.all(shots.map((shot) => sharp(shot).resize({ width: 330 }).toBuffer()));
    await sharp({ create: { width: tiles.length * 340, height: 718, channels: 3, background: '#777' } })
      .composite(tiles.map((input, i) => ({ input, left: i * 340, top: 0 })))
      .png()
      .toFile(join(root, `store/preview/${folders[lang]}.png`));
  }
}
await browser.close();
