/**
 * Generate public/favicon.ico from public/logo-favicon.svg
 * ICO container with embedded PNGs (16, 32, 48 px)
 * Usage: node scripts/generate-favicon-ico.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgPath = path.join(root, 'public', 'logo-favicon.svg');
const icoPath = path.join(root, 'public', 'favicon.ico');

const sizes = [16, 32, 48];
const svg = await readFile(svgPath);

const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 300 }).resize(size, size).png().toBuffer()
  )
);

// Build ICO: ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes each) + PNG data
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4); // image count

const entries = [];
let offset = 6 + 16 * sizes.length;
pngs.forEach((png, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); // width
  entry.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // data size
  entry.writeUInt32LE(offset, 12); // data offset
  entries.push(entry);
  offset += png.length;
});

await writeFile(icoPath, Buffer.concat([header, ...entries, ...pngs]));
console.log(`✔ Generated ${icoPath} (${sizes.join(', ')}px)`);
