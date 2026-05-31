// Strip the baked-in checkerboard transparency pattern from a Nano Banana PNG.
// Nano Banana sometimes outputs "transparent" as a literal gray-checker pattern
// in pixel data instead of using the alpha channel. This walks every pixel and
// makes the gray-checker pixels actually transparent.

import sharp from '../sdfkjh/node_modules/sharp/lib/index.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const input  = resolve(__dirname, 'cookie.png');
const output = resolve(__dirname, 'cookie-clean.png');

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`input: ${width}x${height} channels=${channels}`);

let killed = 0;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];

  // Detect "grayness": all three channels close to each other
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;

  // The full checker range — including the anti-aliased blends between the two
  // checker grays — covers ~70..170 brightness. The cookie+cigar are heavily
  // saturated (spread > 90 everywhere), so treating ANY low-saturation pixel in
  // that band as transparent is safe.
  const meanGray = (r + g + b) / 3;
  const inBand = meanGray >= 70 && meanGray <= 170;

  if (inBand) {
    if (spread <= 4) {
      data[i + 3] = 0;
      killed++;
    } else if (spread <= 16) {
      // Soft feather for boundary pixels
      data[i + 3] = Math.round(((spread - 4) / 12) * 255);
      killed++;
    }
  }
}
console.log(`pixels killed: ${killed} (${((killed / (width * height)) * 100).toFixed(1)}%)`);

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(output);

console.log(`wrote ${output}`);
