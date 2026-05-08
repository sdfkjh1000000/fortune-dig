import sharp from '../sdfkjh/node_modules/sharp/lib/index.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const crateB64 = readFileSync(resolve(here, 'crate.png')).toString('base64');
const crateHref = `data:image/png;base64,${crateB64}`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- atmosphere -->
    <radialGradient id="warm-glow" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#d4713a" stop-opacity=".22"/>
      <stop offset="60%" stop-color="#d4713a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool-floor" cx="50%" cy="100%" r="70%">
      <stop offset="0%" stop-color="#4a2d6b" stop-opacity=".34"/>
      <stop offset="65%" stop-color="#4a2d6b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#0a0806"/>
      <stop offset="45%" stop-color="#15100a"/>
      <stop offset="100%" stop-color="#0a0a0d"/>
    </linearGradient>

    <!-- horizon glow strip -->
    <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#d4713a" stop-opacity="0"/>
      <stop offset="50%"  stop-color="#d4713a" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#d4713a" stop-opacity="0"/>
    </linearGradient>
    <filter id="horizon-bloom" x="-10%" y="-200%" width="120%" height="500%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>

    <!-- title glow filter -->
    <filter id="title-glow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="14" result="bloom"/>
      <feColorMatrix in="bloom" values="1 0 0 0 .82  0 1 0 0 .44  0 0 1 0 .22  0 0 0 .9 0" result="warm"/>
      <feMerge>
        <feMergeNode in="warm"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- crate drop shadow -->
    <filter id="crate-shadow" x="-15%" y="-10%" width="130%" height="135%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
      <feOffset dx="0" dy="20" result="off"/>
      <feComponentTransfer><feFuncA type="linear" slope=".7"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- title underline -->
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d4713a" stop-opacity="0"/>
      <stop offset="30%" stop-color="#d4713a"/>
      <stop offset="100%" stop-color="#4a2d6b"/>
    </linearGradient>

    <!-- JZZO lens gradients -->
    <linearGradient id="lens-l" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#6b4c2a" stop-opacity=".7"/>
      <stop offset="50%"  stop-color="#d4713a" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#4a2d6b" stop-opacity=".6"/>
    </linearGradient>
    <linearGradient id="lens-r" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#4a2d6b" stop-opacity=".6"/>
      <stop offset="50%"  stop-color="#d4713a" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#6b4c2a" stop-opacity=".7"/>
    </linearGradient>

    <!-- crate floor shadow puddle -->
    <radialGradient id="puddle" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#000" stop-opacity=".75"/>
      <stop offset="70%"  stop-color="#000" stop-opacity="0"/>
    </radialGradient>

    <!-- arc paths for JZZO logo text -->
    <path id="jzzo-arc-top" d="M 20,70 Q 100,5 180,70" fill="none"/>
    <path id="jzzo-arc-bot" d="M 30,78 Q 100,120 170,78" fill="none"/>
  </defs>

  <!-- background stack -->
  <rect width="1200" height="630" fill="url(#vignette)"/>
  <rect width="1200" height="630" fill="url(#warm-glow)"/>
  <rect width="1200" height="630" fill="url(#cool-floor)"/>

  <!-- floor zone darken -->
  <rect x="0" y="410" width="1200" height="220" fill="#000" opacity=".25"/>
  <!-- horizon line with bloom -->
  <rect x="0" y="410" width="1200" height="2" fill="url(#horizon)" filter="url(#horizon-bloom)"/>

  <!-- corner identifiers (low contrast brand markers) -->
  <g font-family="'Courier New', monospace" font-size="11" letter-spacing="3" fill="#d4713a" opacity=".42">
    <text x="32" y="38">LOS·ANGELES</text>
    <text x="1168" y="38" text-anchor="end">UNDERGROUND</text>
    <text x="32" y="595">VINYL·ONLY</text>
    <text x="1168" y="595" text-anchor="end">34°N · 118°W</text>
  </g>

  <!-- dust particles -->
  <g>
    <circle cx="96"   cy="113" r="2.5" fill="#d4713a" opacity=".55"/>
    <circle cx="456"  cy="50"  r="2.5" fill="#d4713a" opacity=".55"/>
    <circle cx="744"  cy="88"  r="2.5" fill="#b48cd2" opacity=".5"/>
    <circle cx="1056" cy="189" r="2.5" fill="#d4713a" opacity=".55"/>
    <circle cx="168"  cy="346" r="2.5" fill="#b48cd2" opacity=".4"/>
    <circle cx="1080" cy="390" r="2.5" fill="#d4713a" opacity=".55"/>
  </g>

  <!-- CRATE: shadow puddle + image, slight rotation -->
  <g transform="translate(290 420)">
    <ellipse cx="0" cy="120" rx="240" ry="18" fill="url(#puddle)"/>
  </g>
  <g transform="translate(60 100) rotate(-2 260 220)" filter="url(#crate-shadow)">
    <image href="${crateHref}" x="0" y="0" width="520" height="442" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <!-- RIGHT COLUMN -->
  <!-- kicker -->
  <g transform="translate(620 130)" font-family="'Courier New', monospace">
    <text fill="#d4713a" font-size="14" letter-spacing="6" opacity=".88">UNDERGROUND</text>
    <circle cx="170" cy="-4" r="3" fill="#d4713a"/>
    <text x="190" y="0" fill="#d4713a" font-size="14" letter-spacing="6" opacity=".88">HIP HOP</text>
    <circle cx="306" cy="-4" r="3" fill="#d4713a"/>
    <text x="326" y="0" fill="#d4713a" font-size="14" letter-spacing="6" opacity=".88">FORTUNES</text>
  </g>

  <!-- title FORTUNE DIG with glow -->
  <g transform="translate(620 240)" font-family="'Courier New', monospace" font-weight="900">
    <text fill="#f4d9a8" font-size="100" letter-spacing="-2" filter="url(#title-glow)">FORTUNE</text>
    <text y="98"  fill="#f4d9a8" font-size="100" letter-spacing="-2" filter="url(#title-glow)">DIG</text>
    <!-- underline -->
    <rect x="0" y="116" width="280" height="3" fill="url(#rule)"/>
  </g>

  <!-- tagline -->
  <g transform="translate(620 408)" font-family="'Courier New', monospace" font-size="18" letter-spacing="1.5" fill="#b89878">
    <text>Click the crate. Pull a record.</text>
    <text y="28">Get a <tspan fill="#d4713a">fortune</tspan> from the underground.</text>
  </g>

  <!-- JZZO block -->
  <g transform="translate(620 470)">
    <rect x="0" y="0" width="380" height="78" rx="10"
          fill="#140c06" fill-opacity=".55"
          stroke="#d4713a" stroke-opacity=".28" stroke-width="1"/>
    <!-- JZZO logo, scaled inside -->
    <g transform="translate(20 8) scale(.8)">
      <text font-family="'Courier New',monospace" font-size="11" font-weight="bold" fill="#a07248" letter-spacing="3">
        <textPath href="#jzzo-arc-top" startOffset="50%" text-anchor="middle">FORTUNE WAX</textPath>
      </text>
      <g transform="translate(100,52)">
        <path d="M -8,0 Q 0,-6 8,0" stroke="#e8d4b0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <rect x="-48" y="-10" width="38" height="22" rx="4" fill="url(#lens-l)" stroke="#e8d4b0" stroke-width="2"/>
        <rect x="10"  y="-10" width="38" height="22" rx="4" fill="url(#lens-r)" stroke="#e8d4b0" stroke-width="2"/>
        <line x1="-48" y1="-4" x2="-58" y2="-8" stroke="#e8d4b0" stroke-width="2" stroke-linecap="round"/>
        <line x1="48"  y1="-4" x2="58"  y2="-8" stroke="#e8d4b0" stroke-width="2" stroke-linecap="round"/>
        <text x="-29" y="5" font-family="'Courier New',monospace" font-size="12" font-weight="bold" fill="#f4d9a8" text-anchor="middle">JZ</text>
        <text x="29"  y="5" font-family="'Courier New',monospace" font-size="12" font-weight="bold" fill="#f4d9a8" text-anchor="middle">ZO</text>
      </g>
      <text font-family="'Courier New',monospace" font-size="9" fill="#a07248" letter-spacing="2" opacity=".7">
        <textPath href="#jzzo-arc-bot" startOffset="50%" text-anchor="middle">JUST ZIG ZAGGING</textPath>
      </text>
    </g>
    <!-- "A SITE BY JZZO" text -->
    <text x="200" y="34" font-family="'Courier New',monospace" font-size="11" letter-spacing="3" fill="#8a6f4a">A SITE BY</text>
    <text x="200" y="60" font-family="'Courier New',monospace" font-size="22" letter-spacing="4" font-weight="bold" fill="#e8d4b0">JZZO</text>
  </g>

  <!-- footer URL -->
  <text x="600" y="610" text-anchor="middle"
        font-family="'Courier New', monospace" font-size="14" letter-spacing="8"
        fill="#d4713a" opacity=".88">JZZO.SDFKJH.COM</text>
</svg>
`;

const svgPath = resolve(here, 'og.svg');
const pngPath = resolve(here, 'og.png');

writeFileSync(svgPath, svg);
console.log(`SVG  written -> ${svgPath} (${svg.length} bytes)`);

await sharp(Buffer.from(svg), { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(pngPath);

console.log(`PNG  written -> ${pngPath}`);
