import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'epcvinasolar/src/content/products');
const DATA_PRODUCTS = path.join(ROOT, 'epcvinasolar/src/data/products.ts');
const IMAGE_DIR = path.join(ROOT, 'epcvinasolar/public/images/products');
const IMAGE_PREFIX = '/images/products/';

function decodeValue(value = '') {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function quote(value = '') {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/đ/g, 'd')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function isImageReference(value = '') {
  return value.startsWith(IMAGE_PREFIX) && !value.includes('"') && !value.includes('\\');
}

async function collectContentEntries() {
  const files = (await walk(CONTENT_DIR)).filter((file) => file.endsWith('.md'));
  const entries = [];
  const skipped = [];
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const imageMatch = content.match(/^main_image:\s*(.+?)\s*$/m);
    if (!imageMatch) continue;
    const image = decodeValue(imageMatch[1]);
    if (!image) continue;
    if (!isImageReference(image)) {
      skipped.push({ reason: 'invalid-main-image', file, image });
      continue;
    }
    const sourcePath = path.join(IMAGE_DIR, image.slice(IMAGE_PREFIX.length));
    try {
      await fs.access(sourcePath);
    } catch {
      skipped.push({ reason: 'missing-source-image', file, image });
      continue;
    }
    const slug = path.basename(file, '.md');
    entries.push({ type: 'content', file, image, sourcePath, slug });
  }
  return { entries, skipped };
}

async function collectDataEntries() {
  const content = await fs.readFile(DATA_PRODUCTS, 'utf8').catch(() => '');
  const entries = [];
  if (!content) return entries;
  const objectPattern = /\{[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?main_image:\s*"([^"]*)"[\s\S]*?\}/g;
  for (const match of content.matchAll(objectPattern)) {
    const slug = slugify(match[1]);
    const image = match[2];
    if (!isImageReference(image)) continue;
    const sourcePath = path.join(IMAGE_DIR, image.slice(IMAGE_PREFIX.length));
    try {
      await fs.access(sourcePath);
    } catch {
      continue;
    }
    entries.push({ type: 'data', file: DATA_PRODUCTS, image, sourcePath, slug });
  }
  return entries;
}

async function sameFile(a, b) {
  try {
    const [ra, rb] = await Promise.all([fs.realpath(a), fs.realpath(b)]);
    return ra === rb;
  } catch {
    return false;
  }
}

function targetFor(entry, sourceToTargets) {
  const ext = path.extname(entry.sourcePath).toLowerCase() || '.png';
  const targetDir = path.join(IMAGE_DIR, entry.slug);
  const targetPath = path.join(targetDir, `${entry.slug}${ext}`);
  const targetImage = `${IMAGE_PREFIX}${entry.slug}/${entry.slug}${ext}`;
  const key = entry.sourcePath;
  if (!sourceToTargets.has(key)) sourceToTargets.set(key, new Set());
  sourceToTargets.get(key).add(targetPath);
  return { targetDir, targetPath, targetImage };
}

async function moveOrCopy(entries) {
  const sourceUseCount = new Map();
  for (const entry of entries) sourceUseCount.set(entry.sourcePath, (sourceUseCount.get(entry.sourcePath) || 0) + 1);

  const sourceToTargets = new Map();
  const updates = new Map();
  const operations = [];

  for (const entry of entries) {
    const { targetDir, targetPath, targetImage } = targetFor(entry, sourceToTargets);
    updates.set(`${entry.file}\u0000${entry.image}\u0000${entry.slug}`, targetImage);
    if (await sameFile(entry.sourcePath, targetPath)) continue;

    await fs.mkdir(targetDir, { recursive: true });
    const targetExists = await fs.access(targetPath).then(() => true).catch(() => false);
    if (targetExists) {
      operations.push({ action: 'reuse-existing', from: entry.sourcePath, to: targetPath });
      continue;
    }

    const hasMultipleConsumers = (sourceUseCount.get(entry.sourcePath) || 0) > 1 || sourceToTargets.get(entry.sourcePath)?.size > 1;
    if (hasMultipleConsumers) {
      await fs.copyFile(entry.sourcePath, targetPath);
      operations.push({ action: 'copied', from: entry.sourcePath, to: targetPath });
    } else {
      await fs.rename(entry.sourcePath, targetPath);
      operations.push({ action: 'moved', from: entry.sourcePath, to: targetPath });
      entry.sourcePath = targetPath;
    }
  }

  return { updates, operations };
}

async function updateContent(entries, updates) {
  const files = [...new Set(entries.filter((entry) => entry.type === 'content').map((entry) => entry.file))];
  let changed = 0;
  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    const before = content;
    for (const entry of entries.filter((item) => item.type === 'content' && item.file === file)) {
      const nextImage = updates.get(`${entry.file}\u0000${entry.image}\u0000${entry.slug}`);
      if (!nextImage || nextImage === entry.image) continue;
      content = content.replace(/^main_image:\s*(.+?)\s*$/m, `main_image: ${quote(nextImage)}`);
    }
    if (content !== before) {
      await fs.writeFile(file, content);
      changed += 1;
    }
  }
  return changed;
}

async function updateData(entries, updates) {
  let content = await fs.readFile(DATA_PRODUCTS, 'utf8').catch(() => '');
  if (!content) return false;
  const before = content;
  for (const entry of entries.filter((item) => item.type === 'data')) {
    const nextImage = updates.get(`${entry.file}\u0000${entry.image}\u0000${entry.slug}`);
    if (!nextImage || nextImage === entry.image) continue;
    const pattern = new RegExp(`main_image:\\s*"${entry.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    content = content.replace(pattern, `main_image: "${nextImage}"`);
  }
  if (content !== before) {
    await fs.writeFile(DATA_PRODUCTS, content);
    return true;
  }
  return false;
}

async function main() {
  const { entries: contentEntries, skipped } = await collectContentEntries();
  const dataEntries = await collectDataEntries();
  const entries = [...contentEntries, ...dataEntries];
  const { updates, operations } = await moveOrCopy(entries);
  const changedContentFiles = await updateContent(entries, updates);
  const changedDataFile = await updateData(entries, updates);

  const counts = operations.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] || 0) + 1;
    return acc;
  }, {});
  console.log(`Organized ${entries.length} product image references into product folders.`);
  console.log(JSON.stringify({ ...counts, changedContentFiles, changedDataFile, skipped: skipped.length }, null, 2));
  for (const item of operations) {
    console.log(`${item.action}: ${path.relative(IMAGE_DIR, item.from)} -> ${path.relative(IMAGE_DIR, item.to)}`);
  }
  for (const item of skipped) {
    console.log(`${item.reason}: ${path.relative(ROOT, item.file)} | ${item.image}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
