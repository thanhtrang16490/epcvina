import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'epcvinasolar/src/content/products');
const DATA_PRODUCTS = path.join(ROOT, 'epcvinasolar/src/data/products.ts');
const IMAGE_DIR = path.join(ROOT, 'epcvinasolar/public/images/products');
const IMAGE_PREFIX = '/images/products/';

function decodeYamlValue(value = '') {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function yamlQuote(value = '') {
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
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(fullPath));
    else if (entry.isFile()) out.push(fullPath);
  }
  return out;
}

function isValidProductImage(value = '') {
  return value.startsWith(IMAGE_PREFIX) && !value.includes('"') && !value.includes('\\');
}

async function collectContentEntries() {
  const files = (await walk(CONTENT_DIR)).filter((file) => file.endsWith('.md'));
  const entries = [];
  const invalid = [];
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const nameMatch = content.match(/^name:\s*(.+?)\s*$/m);
    const imageMatch = content.match(/^main_image:\s*(.+?)\s*$/m);
    if (!nameMatch || !imageMatch) continue;
    const name = decodeYamlValue(nameMatch[1]);
    const image = decodeYamlValue(imageMatch[1]);
    if (!image || !isValidProductImage(image)) {
      if (image) invalid.push({ file, image });
      continue;
    }
    const imageName = image.slice(IMAGE_PREFIX.length);
    const sourcePath = path.join(IMAGE_DIR, imageName);
    try {
      await fs.access(sourcePath);
    } catch {
      invalid.push({ file, image });
      continue;
    }
    entries.push({ type: 'content', file, name, image, sourcePath, slug: path.basename(file, '.md') });
  }
  return { entries, invalid };
}

async function collectDataEntries() {
  const content = await fs.readFile(DATA_PRODUCTS, 'utf8').catch(() => '');
  const entries = [];
  const objectPattern = /\{[\s\S]*?name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?main_image:\s*"([^"]*)"[\s\S]*?\}/g;
  for (const match of content.matchAll(objectPattern)) {
    const name = match[1];
    const slug = slugify(match[2]);
    const image = match[3];
    if (!isValidProductImage(image)) continue;
    const imageName = image.slice(IMAGE_PREFIX.length);
    const sourcePath = path.join(IMAGE_DIR, imageName);
    try {
      await fs.access(sourcePath);
    } catch {
      continue;
    }
    entries.push({ type: 'data', file: DATA_PRODUCTS, name, image, sourcePath, slug });
  }
  return entries;
}

function desiredImageTarget(entry, usedTargets) {
  const ext = path.extname(entry.sourcePath).toLowerCase() || '.png';
  const base = entry.slug || `epcvinasolar-${slugify(entry.name)}`;
  let candidate = path.join(base, `${base}${ext}`);
  let index = 2;
  while (usedTargets.has(candidate) && usedTargets.get(candidate) !== entry.sourcePath) {
    candidate = path.join(base, `${base}-${index}${ext}`);
    index += 1;
  }
  usedTargets.set(candidate, entry.sourcePath);
  return {
    targetPath: path.join(IMAGE_DIR, candidate),
    targetImage: `${IMAGE_PREFIX}${candidate.split(path.sep).join('/')}`,
  };
}

async function sameFile(a, b) {
  try {
    const [ra, rb] = await Promise.all([fs.realpath(a), fs.realpath(b)]);
    return ra === rb;
  } catch {
    return false;
  }
}

async function moveOrCopyImages(entries) {
  const sourceCounts = new Map();
  for (const entry of entries) {
    sourceCounts.set(entry.sourcePath, (sourceCounts.get(entry.sourcePath) || 0) + 1);
  }

  const usedTargets = new Map();
  const updates = new Map();
  const operations = [];

  for (const entry of entries) {
    const { targetPath, targetImage } = desiredImageTarget(entry, usedTargets);
    updates.set(`${entry.file}\u0000${entry.image}\u0000${entry.name}`, targetImage);
    if (await sameFile(entry.sourcePath, targetPath)) continue;

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    const targetExists = await fs.access(targetPath).then(() => true).catch(() => false);
    if (targetExists) {
      operations.push({ action: 'reuse-existing', from: entry.sourcePath, to: targetPath });
      continue;
    }

    if ((sourceCounts.get(entry.sourcePath) || 0) > 1) {
      await fs.copyFile(entry.sourcePath, targetPath);
      operations.push({ action: 'copied', from: entry.sourcePath, to: targetPath });
    } else {
      await fs.rename(entry.sourcePath, targetPath);
      operations.push({ action: 'renamed', from: entry.sourcePath, to: targetPath });
    }
  }

  return { updates, operations };
}

async function updateContentFiles(entries, updates, invalid) {
  const files = new Set([...entries.filter((entry) => entry.type === 'content').map((entry) => entry.file), ...invalid.map((entry) => entry.file)]);
  let changed = 0;
  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    const before = content;
    const fileEntries = entries.filter((entry) => entry.type === 'content' && entry.file === file);
    for (const entry of fileEntries) {
      const nextImage = updates.get(`${entry.file}\u0000${entry.image}\u0000${entry.name}`);
      if (!nextImage || nextImage === entry.image) continue;
      const oldLine = new RegExp(`^main_image:\\s*${yamlQuote(entry.image).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm');
      content = content.replace(oldLine, `main_image: ${yamlQuote(nextImage)}`);
    }
    content = content.replace(/^main_image:\s*"\\""\s*$/gm, 'main_image: ""');
    if (content !== before) {
      await fs.writeFile(file, content);
      changed += 1;
    }
  }
  return changed;
}

async function updateDataFile(entries, updates) {
  let content = await fs.readFile(DATA_PRODUCTS, 'utf8').catch(() => '');
  if (!content) return false;
  const before = content;
  const dataEntries = entries.filter((entry) => entry.type === 'data');
  for (const entry of dataEntries) {
    const nextImage = updates.get(`${entry.file}\u0000${entry.image}\u0000${entry.name}`);
    if (!nextImage || nextImage === entry.image) continue;
    const imagePattern = new RegExp(`main_image:\\s*"${entry.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    content = content.replace(imagePattern, `main_image: "${nextImage}"`);
  }
  if (content !== before) {
    await fs.writeFile(DATA_PRODUCTS, content);
    return true;
  }
  return false;
}

async function main() {
  const { entries: contentEntries, invalid } = await collectContentEntries();
  const dataEntries = await collectDataEntries();
  const entries = [...contentEntries, ...dataEntries];
  const { updates, operations } = await moveOrCopyImages(entries);
  const changedContentFiles = await updateContentFiles(entries, updates, invalid);
  const changedDataFile = await updateDataFile(entries, updates);

  const counts = operations.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] || 0) + 1;
    return acc;
  }, {});
  console.log(`SEO renamed product images for ${entries.length} product image references.`);
  console.log(JSON.stringify({ ...counts, changedContentFiles, changedDataFile, invalidImageReferences: invalid.length }, null, 2));
  for (const item of operations) {
    console.log(`${item.action}: ${path.basename(item.from)} -> ${path.basename(item.to)}`);
  }
  for (const item of invalid) {
    console.log(`invalid-main-image: ${path.relative(ROOT, item.file)} | ${item.image}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
