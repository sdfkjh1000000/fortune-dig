import sharp from '../sdfkjh/node_modules/sharp/lib/index.js';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, 'cookie-clean.png');

// Source is 906x834 with cookie body lower-left, cigar+ember lower-center,
// smoke trail up-right. Crop a square from the bottom that frames cookie + cigar
// + ember tight, dropping most of the smoke for legibility at favicon size.
const CROP = { left: 110, top: 200, width: 620, height: 620 };

const base = sharp(src).extract(CROP);

const sizes = [
  { out: 'favicon-16.png', size: 16 },
  { out: 'favicon-32.png', size: 32 },
  { out: 'favicon-48.png', size: 48 },
  { out: 'apple-touch-icon.png', size: 180 },
];

for (const { out, size } of sizes) {
  await base
    .clone()
    .resize(size, size, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(resolve(here, out));
  console.log(`wrote ${out}  (${size}x${size})`);
}
