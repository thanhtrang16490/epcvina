import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const API_URL = 'https://gpgsolar.vn/api/product';
const SOURCE_BASE = 'https://gpgsolar.vn/san-pham';
const OUT_CONTENT = path.join(ROOT, 'epcvinasolar/src/content/products');
const OUT_IMAGES = path.join(ROOT, 'epcvinasolar/public/images/products');

const categoryMap = {
  PIN: 'panel',
  INVERTER: 'hybrid-inverter',
  BATTERY: 'lv-battery',
  ACCESSORIES: 'wiring',
};

function yamlQuote(value = '') {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function yamlBlock(value = '') {
  const text = String(value).replace(/\r\n/g, '\n').trim();
  if (!text.includes('\n')) return yamlQuote(text);
  return `|-\n${text.split('\n').map((line) => `  ${line}`).join('\n')}`;
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function priceToNumber(label = '') {
  const digits = String(label).replace(/[^\d]/g, '');
  return digits ? Number(digits) : undefined;
}

function normalizeName(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/đ/g, 'd')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value = '') {
  return normalizeName(value).replace(/\s+/g, '-');
}

function hasLikelySharedIdentity(sourceName = '', existingName = '') {
  const source = normalizeName(sourceName).split(' ').filter(Boolean);
  const existing = new Set(normalizeName(existingName).split(' ').filter(Boolean));
  const important = source.filter((token) => token.length >= 3 && !['pha', 'luu', 'tru', 'mat', 'troi', 'bien', 'tan', 'hybrid', 'hoa', 'luoi'].includes(token));
  return important.some((token) => existing.has(token));
}

async function collectExistingProducts() {
  const byName = new Map();
  const byId = new Map();
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf8');
        const match = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
        if (match) byName.set(normalizeName(match[1]), fullPath);
        const idMatch = entry.name.match(/-(\d+)\.md$/);
        if (idMatch && match && !byId.has(idMatch[1])) byId.set(idMatch[1], { path: fullPath, name: match[1] });
      }
    }
  }
  await walk(OUT_CONTENT);
  return { byName, byId };
}

function brandFrom(product, detail) {
  const bullet = detail?.featureBullets?.find((item) => /^Thương hiệu:/i.test(item));
  if (bullet) return bullet.replace(/^Thương hiệu:\s*/i, '').trim();
  const known = ['HiTHIUM', 'GENIXGREEN', 'LEADER', 'AIKO', 'GPG SOLAR', 'SAJ', 'HOPETREK'];
  return known.find((brand) => product.name.toUpperCase().includes(brand)) || 'GPG Solar';
}

function modelFrom(product, detail) {
  const bullet = detail?.featureBullets?.find((item) => /^Mã sản phẩm:/i.test(item));
  if (bullet) return bullet.replace(/^Mã sản phẩm:\s*/i, '').trim();
  return product.name
    .replace(/^Tấm pin mặt trời\s*/i, '')
    .replace(/^Biến tần\s*/i, '')
    .replace(/^Pin lưu trữ\s*/i, '')
    .replace(/^Cáp Solar DC\s*/i, '')
    .replace(/^Đầu MC4\s*/i, '')
    .trim();
}

function targetCategory(product) {
  if (product.categoryCode === 'INVERTER') {
    return /hòa lưới|on.?grid/i.test(product.name) ? 'on-grid-inverter' : 'hybrid-inverter';
  }
  if (product.categoryCode === 'BATTERY' && /áp cao|high voltage|hv/i.test(product.name)) {
    return 'hv-battery';
  }
  if (product.categoryCode === 'ACCESSORIES' && /tủ điện/i.test(product.name)) {
    return 'cabinet';
  }
  return categoryMap[product.categoryCode] || 'accessories';
}

function productImageTarget(productSlug, imageUrl) {
  const url = new URL(imageUrl);
  const ext = path.extname(url.pathname) || '.png';
  const folder = productSlug;
  const fileName = `${productSlug}${ext}`.replace(/[^a-zA-Z0-9._-]/g, '-');
  return {
    outDir: path.join(OUT_IMAGES, folder),
    outPath: path.join(OUT_IMAGES, folder, fileName),
    imagePath: `/images/products/${folder}/${fileName}`,
  };
}

function specRecord(detail) {
  const specs = {};
  for (const table of detail?.specTables || []) {
    for (const row of table.rows || []) {
      if (row.label && row.value) specs[row.label.replace(/\*$/, '').trim()] = String(row.value).trim();
    }
  }
  for (const bullet of detail?.featureBullets || []) {
    const [label, ...rest] = bullet.split(':');
    if (label && rest.length && !/^Thương hiệu|Mã sản phẩm$/i.test(label.trim())) {
      specs[label.trim()] = rest.join(':').trim();
    }
  }
  return specs;
}

function featureList(detail) {
  const standout = (detail?.standout || []).map((item) => `${item.label || ''} ${item.value || ''}`.trim());
  const bullets = (detail?.featureBullets || []).filter((item) => !/^Mã sản phẩm:|^Thương hiệu:/i.test(item));
  return [...standout, ...bullets].filter(Boolean);
}

function bodyMarkdown(detail, product) {
  const sections = [];
  const detailDescription = stripHtml(detail?.description || '');
  const description = detailDescription.startsWith('$') ? product.description : (detailDescription || product.description);
  if (description) sections.push(`## Mô tả\n\n${description}`);
  if (detail?.specTables?.length) {
    const specSections = detail.specTables.map((table) => {
      const rows = (table.rows || []).map((row) => `- **${row.label.replace(/\*$/, '').trim()}:** ${row.value}`).join('\n');
      return `### ${table.title}\n${rows}`;
    });
    sections.push(`## Thông số kỹ thuật\n\n${specSections.join('\n\n')}`);
  }
  if (detail?.docs?.length) {
    const docs = detail.docs.map((doc) => `- [${doc.title}](${doc.filePath}) - ${doc.fileMeta || 'Tài liệu'}`).join('\n');
    sections.push(`## Tài liệu\n\n${docs}`);
  }
  return `# ${product.name}\n\n${sections.join('\n\n')}\n`;
}

function toMarkdown(product, detail, mainImagePath) {
  const specs = specRecord(detail);
  const features = featureList(detail);
  const price = priceToNumber(product.priceLabel || detail?.price);
  const warranty = specs['Bảo hành(năm)'] || specs['Bảo hành'] || specs['Bảo hành sản phẩm'];
  const warrantyYears = warranty ? Number.parseInt(warranty, 10) : undefined;
  const category = targetCategory(product);
  const brand = brandFrom(product, detail);
  const model = modelFrom(product, detail);

  const lines = [
    '---',
    `name: ${yamlQuote(product.name)}`,
    `brand: ${yamlQuote(brand)}`,
    `category: ${yamlQuote(category)}`,
    `model: ${yamlQuote(model)}`,
    `description: ${yamlBlock(product.description || stripHtml(detail?.description || ''))}`,
  ];
  if (price !== undefined) lines.push(`price: ${price}`, `unit_price: ${price}`);
  lines.push(
    `main_image: ${yamlQuote(mainImagePath)}`,
    'is_available: true',
    'show_on_homepage: false',
    `product_type: ${yamlQuote(category.includes('inverter') ? 'inverter' : category)}`,
  );
  if (warrantyYears) lines.push(`warranty_years: ${warrantyYears}`);
  if (warranty) lines.push(`warranty: ${yamlQuote(warranty)}`);
  lines.push(`source_url: ${yamlQuote(`${SOURCE_BASE}/${product.slug}`)}`);

  if (Object.keys(specs).length) {
    lines.push('specifications:');
    for (const [key, value] of Object.entries(specs)) lines.push(`  ${yamlQuote(key)}: ${yamlQuote(value)}`);
  }
  if (features.length) {
    lines.push('features:');
    for (const feature of features) lines.push(`  - ${yamlQuote(feature)}`);
  }
  lines.push('---', '', bodyMarkdown(detail, product));
  return lines.join('\n');
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function fetchProducts() {
  return fetchJson(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: 1, size: 200, category: null, maxPrice: 200, idBrand: [], fieldSearch: [] }),
  });
}

function decodeNextFlight(html) {
  let payload = '';
  const matches = html.matchAll(/<script>self\.__next_f\.push\(([\s\S]*?)\)<\/script>/g);
  for (const match of matches) {
    const chunk = Function(`"use strict"; return (${match[1]});`)();
    if (chunk[0] === 1 && typeof chunk[1] === 'string') payload += chunk[1];
  }
  return payload;
}

function extractJsonObject(text, objectStart) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = objectStart; i < text.length; i++) {
    const char = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') inString = !inString;
    if (inString) continue;
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) return text.slice(objectStart, i + 1);
    }
  }
  return null;
}

function extractDetail(html, product) {
  const payload = decodeNextFlight(html);
  const dataNeedle = `"data":{"id":${product.id},`;
  const dataStart = payload.indexOf(dataNeedle);
  if (dataStart === -1) throw new Error(`Cannot find data payload for ${product.slug}`);
  const objectStart = dataStart + '"data":'.length;
  const jsonText = extractJsonObject(payload, objectStart);
  if (!jsonText) throw new Error(`Unclosed payload for ${product.slug}`);
  return JSON.parse(jsonText);
}

async function fetchDetail(product) {
  const response = await fetch(`${SOURCE_BASE}/${product.slug}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${product.slug}`);
  const html = await response.text();
  return extractDetail(html, product);
}

async function downloadImage(productSlug, imageUrl) {
  const { outDir, outPath, imagePath } = productImageTarget(productSlug, imageUrl);
  await fs.mkdir(outDir, { recursive: true });
  try {
    await fs.access(outPath);
  } catch {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${imageUrl}`);
    await fs.writeFile(outPath, Buffer.from(await response.arrayBuffer()));
  }
  return imagePath;
}

async function main() {
  const response = await fetchProducts();
  if (response.status !== 200) throw new Error(response.message || 'Cannot fetch products');

  const existing = await collectExistingProducts();
  const summary = [];
  for (const product of response.data) {
    const detailProduct = await fetchDetail(product);
    const detail = detailProduct.detail || {};
    const category = targetCategory(product);
    const dir = path.join(OUT_CONTENT, category);
    const idCandidate = existing.byId.get(String(product.id));
    const filePath = existing.byName.get(normalizeName(product.name)) ||
      (idCandidate && hasLikelySharedIdentity(product.name, idCandidate.name) ? idCandidate.path : undefined) ||
      path.join(dir, `${product.slug}.md`);
    const productSlug = path.basename(filePath, '.md');
    const imageUrl = detail.gallery?.main?.src || product.imageSrc;
    const mainImagePath = imageUrl ? await downloadImage(productSlug, imageUrl) : '';
    const existed = await fs.access(filePath).then(() => true).catch(() => false);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, toMarkdown(product, detail, mainImagePath));
    existing.byName.set(normalizeName(product.name), filePath);
    existing.byId.set(String(product.id), { path: filePath, name: product.name });
    summary.push({ action: existed ? 'updated' : 'created', file: path.relative(ROOT, filePath) });
  }

  const created = summary.filter((item) => item.action === 'created').length;
  const updated = summary.length - created;
  console.log(`Synced ${summary.length} GPG products: ${created} created, ${updated} updated.`);
  for (const item of summary) console.log(`${item.action}: ${item.file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
