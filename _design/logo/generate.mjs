// Every measure derives from R (the outer ring): the stroke is R / phi^6 and the rest
// steps from it by powers of phi.
import { writeFileSync } from 'node:fs';

const PHI = (1 + Math.sqrt(5)) / 2;
const rad = (deg) => (deg * Math.PI) / 180;

const R = 400;
const stroke = R / PHI ** 6;
const clearance = stroke / PHI;
const beadR = stroke * PHI;
const band = 2 * beadR + 2 * clearance + stroke;
const ringR = R - band;
const beadsR = (R + ringR) / 2;

const crossT = stroke;
const top = (2 * beadR) / PHI ** 2;
const foot = (2 * beadR) / PHI;
const arm = beadR;

const starStep = Number(process.env.STAR_STEP ?? 20);
const starInnerPower = Number(process.env.STAR_INNER ?? 1);
const starPoints = Number(process.env.STAR_POINTS ?? 8);
const starFit = (r) => 2 * r * Math.sin(rad(starStep / 2)) * (1 - 1 / PHI ** 3) / 2;
const starLimit = ringR - stroke / 2 - clearance;
const starsR = starLimit / (1 + starFit(1));
const starOuter = starFit(starsR);
const starRound = starOuter / PHI ** 5;
const starTip = starOuter - starRound / 2;
const starInner = starTip / PHI ** starInnerPower;

const half = R + stroke / 2 + clearance;
const size = 2 * half;
const c = half;

const f = (n) => Number(n.toFixed(3));
const polar = (r, deg) => [c + r * Math.sin(rad(deg)), c - r * Math.cos(rad(deg))];

const slot = 360 / 11;
const beadAngles = Array.from({ length: 10 }, (_, i) => 180 + slot * (i + 1));
const starAngles = Array.from({ length: 12 }, (_, i) => (-11 * starStep) / 2 + starStep * i);

const star = (deg) => {
    const [cx, cy] = polar(starsR, deg);
    const points = Array.from({ length: starPoints * 2 }, (_, i) => {
        const r = i % 2 === 0 ? starTip : starInner;
        const a = rad(deg + (i * 180) / starPoints);
        return `${f(cx + r * Math.sin(a))},${f(cy - r * Math.cos(a))}`;
    });
    return `<polygon points="${points.join(' ')}"/>`;
};

const bead = (deg) => {
    const [x, y] = polar(beadsR, deg);
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(beadR)}"/>`;
};

const [crossX, beadY] = polar(beadsR, 180);
const crossY = beadY - beadR + top;
const crossRound = crossT / PHI ** 3;
const h = crossT / 2 - crossRound;
const crossPath = [
    `M${f(crossX - h)},${f(crossY - top + crossRound)}`,
    `H${f(crossX + h)}`,
    `V${f(crossY - h)}`,
    `H${f(crossX + arm - crossRound)}`,
    `V${f(crossY + h)}`,
    `H${f(crossX + h)}`,
    `V${f(crossY + foot - crossRound)}`,
    `H${f(crossX - h)}`,
    `V${f(crossY + h)}`,
    `H${f(crossX - arm + crossRound)}`,
    `V${f(crossY - h)}`,
    `H${f(crossX - h)}`,
    'Z',
].join('');

const color = '#C98F78';

const mark = `
  <g fill="none" stroke="currentColor" stroke-width="${f(stroke)}">
    <circle id="outer-ring" cx="${f(c)}" cy="${f(c)}" r="${f(R)}"/>
    <circle id="inner-ring" cx="${f(c)}" cy="${f(c)}" r="${f(ringR)}"/>
  </g>
  <g id="beads" fill="currentColor">
    ${beadAngles.map(bead).join('\n    ')}
  </g>
  <path id="cross" fill="currentColor" stroke="currentColor" stroke-width="${f(2 * crossRound)}" stroke-linejoin="round" d="${crossPath}"/>
  <g id="stars" fill="currentColor" stroke="currentColor" stroke-width="${f(starRound)}" stroke-linejoin="round">
    ${starAngles.map(star).join('\n    ')}
  </g>`;

const svg = (body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(size)} ${f(size)}" width="${f(size)}" height="${f(size)}" color="${color}">
  <title>${title}</title>${body}
</svg>
`;

writeFileSync(process.env.OUT ?? new URL('./sanctamaria-mark.svg', import.meta.url), svg(mark, 'SanctaMaria'));

const mandorlaR = starsR;
const headR = starsR / PHI ** 2;
const headTop = starsR - starOuter * PHI;
const construction = `
  <g fill="none" stroke="#3B82F6" stroke-width="1.5" opacity="0.55">
    <circle cx="${f(c)}" cy="${f(c)}" r="${f(beadsR)}" stroke-dasharray="4 6"/>
    <circle cx="${f(c)}" cy="${f(c)}" r="${f(starsR)}" stroke-dasharray="4 6"/>
    <circle cx="${f(c - mandorlaR / 2)}" cy="${f(c)}" r="${f(mandorlaR)}" stroke-dasharray="2 4"/>
    <circle cx="${f(c + mandorlaR / 2)}" cy="${f(c)}" r="${f(mandorlaR)}" stroke-dasharray="2 4"/>
    ${Array.from({ length: 11 }, (_, i) => {
        const [x, y] = polar(R, 180 + i * slot);
        return `<line x1="${f(c)}" y1="${f(c)}" x2="${f(x)}" y2="${f(y)}" opacity="0.4"/>`;
    }).join('\n    ')}
  </g>
  <g fill="none" stroke="#E11D48" stroke-width="2" stroke-dasharray="8 6">
    <circle id="head" cx="${f(c)}" cy="${f(c - headTop + headR)}" r="${f(headR)}"/>
    <circle cx="${f(c)}" cy="${f(c)}" r="${f(starLimit)}"/>
  </g>`;

writeFileSync(
    new URL('./sanctamaria-mark-construction.svg', import.meta.url),
    svg(`${construction}${mark}`, 'SanctaMaria - construction'),
);

console.log({ size: f(size), R, ringR: f(ringR), band: f(band), beadR: f(beadR), stroke: f(stroke), clearance: f(clearance), starsR: f(starsR), starOuter: f(starOuter), crossT: f(crossT) });

const P = (x, y) => `${f(c + x)},${f(c + y)}`;
const mirror = (points) => points.map(([x, y]) => [-x, y]);

const hoodR = headR;
const hoodY = -headTop + hoodR;
const faceRx = hoodR / PHI;
const faceRy = faceRx * Math.sqrt(PHI);
const faceY = -headTop + hoodR / PHI ** 2 + faceRy;
const chinY = faceY + faceRy;
const lineW = stroke / PHI;

const veilSide = [
    [hoodR, hoodY],
    [hoodR, hoodY + hoodR * 1.1],
    [hoodR * 1.9, chinY + hoodR * 0.2],
    [hoodR * 2.1, ringR],
];
const veil = `M${P(...mirror(veilSide)[3])}
      C${P(...mirror(veilSide)[2])} ${P(...mirror(veilSide)[1])} ${P(...mirror(veilSide)[0])}
      A${f(hoodR)},${f(hoodR)} 0 0 1 ${P(...veilSide[0])}
      C${P(...veilSide[1])} ${P(...veilSide[2])} ${P(...veilSide[3])}`;

const mantleEdge = [
    [faceRx * 0.75, chinY - faceRy * 0.25],
    [faceRx * 0.9, chinY + hoodR * 0.6],
    [faceRx * 1.2, ringR * 0.6],
    [faceRx * 1.3, ringR],
];
const mantle = (pts) => `M${P(...pts[0])} C${P(...pts[1])} ${P(...pts[2])} ${P(...pts[3])}`;

const handsTop = chinY + hoodR / PHI;
const handsH = hoodR;
const handsW = faceRx / PHI;
const hands = `M${P(0, handsTop)}
      C${P(handsW * 0.9, handsTop + handsH * 0.3)} ${P(handsW, handsTop + handsH * 0.7)} ${P(handsW, handsTop + handsH)}
      Q${P(handsW * 1.15, handsTop + handsH * 1.2)} ${P(handsW * 1.8, handsTop + handsH * 1.4)}
      M${P(0, handsTop)}
      C${P(-handsW * 0.9, handsTop + handsH * 0.3)} ${P(-handsW, handsTop + handsH * 0.7)} ${P(-handsW, handsTop + handsH)}
      Q${P(-handsW * 1.15, handsTop + handsH * 1.2)} ${P(-handsW * 1.8, handsTop + handsH * 1.4)}
      M${P(0, handsTop + lineW)} L${P(0, handsTop + handsH)}`;

const sleevesEnd = handsTop + handsH * 1.2;
const sunOuter = handsH / 2;
const sunY = sleevesEnd + clearance + sunOuter + lineW / 2;
const sunDisc = sunOuter / PHI ** 2 + lineW / 2;
const sunRayStart = sunOuter / PHI;
const sun = `
    <g id="sun">
      <circle cx="${f(c)}" cy="${f(c + sunY)}" r="${f(sunDisc)}" fill="currentColor" stroke="none"/>
      ${Array.from({ length: 8 }, (_, i) => {
          const a = rad(i * 45);
          const p1 = P(sunRayStart * Math.sin(a), sunY - sunRayStart * Math.cos(a));
          const p2 = P(sunOuter * Math.sin(a), sunY - sunOuter * Math.cos(a));
          return `<path d="M${p1} L${p2}"/>`;
      }).join('\n      ')}
    </g>`;

const neckline = `M${P(-faceRx * 0.75, chinY + hoodR * 0.15)} Q${P(0, chinY + hoodR * 0.55)} ${P(faceRx * 0.75, chinY + hoodR * 0.15)}`;

const virgin = `
  <clipPath id="inside"><circle cx="${f(c)}" cy="${f(c)}" r="${f(ringR)}"/></clipPath>
  <g id="virgin" clip-path="url(#inside)" fill="none" stroke="currentColor" stroke-width="${f(lineW)}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${veil}"/>
    <ellipse cx="${f(c)}" cy="${f(c + faceY)}" rx="${f(faceRx)}" ry="${f(faceRy)}"/>
    <path d="${mantle(mantleEdge)}"/>
    <path d="${mantle(mantleEdge.map(([x, y]) => [-x, y]))}"/>
    <path d="${neckline}"/>
    <path d="${hands}"/>${sun}
  </g>`;

writeFileSync(
    new URL('./sanctamaria-logo.svg', import.meta.url),
    svg(`${mark}${virgin}`, 'SanctaMaria'),
);
