import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourceDirs = [path.join(root, 'src')];
const threshold = 1024 * 1024;
const rasterPattern = /\.(png|jpe?g)$/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.astro' || entry.name === 'dist') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
}

async function main() {
  const publicFiles = await walk(publicDir);
  const candidates = [];
  for (const file of publicFiles) {
    if (!rasterPattern.test(file)) continue;
    const stat = await fs.stat(file);
    if (stat.size >= threshold) candidates.push(file);
  }

  const replacements = new Map();
  const dimensions = new Map();
  for (const file of candidates) {
    const webp = file.replace(rasterPattern, '.webp');
    await sharp(file).webp({ quality: 82, effort: 5 }).toFile(webp);
    const publicReference = `/${path.relative(publicDir, file).split(path.sep).join('/')}`;
    const webpReference = publicReference.replace(rasterPattern, '.webp');
    replacements.set(publicReference, webpReference);
    const metadata = await sharp(file).metadata();
    if (metadata.width && metadata.height) dimensions.set(webpReference, { width: metadata.width, height: metadata.height });
  }

  let updatedFiles = 0;
  for (const dir of sourceDirs) {
    for (const file of await walk(dir)) {
      if (!/\.(astro|tsx?|jsx?|md|css|json)$/i.test(file)) continue;
      const original = await fs.readFile(file, 'utf8');
      let next = original;
      for (const [from, to] of replacements) next = next.split(from).join(to);
      for (const [reference, size] of dimensions) {
        const escaped = reference.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const imagePattern = new RegExp(`<img\\b([^>]*\\bsrc=(['"])${escaped}\\2[^>]*)>`, 'g');
        next = next.replace(imagePattern, (tag, attributes) => {
          if (/\\bwidth=|\\bheight=/.test(attributes)) return tag;
          return `<img${attributes} width="${size.width}" height="${size.height}">`;
        });
      }
      if (next !== original) {
        await fs.writeFile(file, next);
        updatedFiles += 1;
      }
    }
  }

  console.log(JSON.stringify({ converted: candidates.length, updatedFiles, thresholdBytes: threshold }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
