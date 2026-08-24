import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const productsDir = path.join(root, 'public', 'images', 'products');
const contentDir = path.join(root, 'src', 'content', 'products');

function walk(dir, predicate, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, acc);
    } else if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

async function ensureConverted(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const base = sourcePath.slice(0, -ext.length);
  const webpPath = `${base}.webp`;

  if (!fs.existsSync(webpPath)) {
    await sharp(sourcePath)
      .webp({ quality: 82 })
      .toFile(webpPath);
  }

  return { webpPath };
}

async function main() {
  const imageFiles = walk(productsDir, (file) => /\.(png|jpe?g)$/i.test(file));
  let converted = 0;

  for (const file of imageFiles) {
    const result = await ensureConverted(file);
    if (result) converted += 1;
    if (converted % 10 === 0) {
      console.log(`converted ${converted}/${imageFiles.length}`);
    }
  }

  const contentFiles = walk(contentDir, (file) => file.endsWith('.md'));
  let updatedFiles = 0;

  for (const file of contentFiles) {
    const original = fs.readFileSync(file, 'utf8');
    let next = original.replace(/\/images\/products\/([^"' )\n]+?)\.(png|jpe?g)\b/gi, (match, stem) => {
      const basePath = path.join(productsDir, `${stem}`);
      const webp = `${basePath}.webp`;
      if (fs.existsSync(webp)) return `/images/products/${stem}.webp`;
      return match;
    });

    if (next !== original) {
      fs.writeFileSync(file, next);
      updatedFiles += 1;
    }
  }

  console.log(JSON.stringify({ converted, updatedFiles }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
