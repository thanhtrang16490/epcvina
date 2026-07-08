import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const API_BASE = 'https://japangreenpower.com.vn/wp-json/wp/v2';
const OUT_CONTENT = path.join(ROOT, 'epcvinasolar/src/content/products');
const OUT_IMAGES = path.join(ROOT, 'epcvinasolar/public/images/products');

const SOURCE_CATEGORIES = [
  { id: 80, target: 'on-grid-inverter', productType: 'inverter' },
  { id: 81, target: 'hybrid-inverter', productType: 'inverter' },
  { id: 82, target: 'hybrid-inverter', productType: 'inverter' },
  { id: 83, target: 'battery', productType: 'battery' },
  { id: 84, target: 'accessories', productType: 'accessories' },
];

function decodeHtml(value = '') {
  return String(value)
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;|&#8209;|‑/g, '-')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&nbsp;|\u00a0/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(html = '') {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/h[1-6]>|<\/li>|<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function yamlQuote(value = '') {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function yamlBlock(value = '') {
  const text = String(value).replace(/\r\n/g, '\n').trim();
  if (!text.includes('\n')) return yamlQuote(text);
  return `|-\n${text.split('\n').map((line) => `  ${line}`).join('\n')}`;
}

function normalizeName(value = '') {
  return stripHtml(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/đ/g, 'd')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‑–—]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(\d+)\s+(\d)k\b/g, '$1.$2k')
    .trim();
}

function compact(value = '') {
  return normalizeName(value).replace(/[^a-z0-9]/g, '');
}

function slugify(value = '') {
  return normalizeName(value).replace(/\s+/g, '-');
}

function candidateSlugs(product, target) {
  const title = stripHtml(product.title?.rendered || '');
  const base = product.slug || title;
  return [
    slugify(title),
    slugify(base),
    slugify(title.replace(/^inverter\s+/i, 'bien tan ')),
    slugify(title.replace(/^pin\s+/i, 'pin luu tru ')),
    slugify(`${target} ${base}`),
  ].filter(Boolean);
}

function brandFromTitle(title = '') {
  const upper = stripHtml(title).toUpperCase();
  if (upper.includes('SUNGROW')) return 'Sungrow';
  if (upper.includes('GROWATT')) return 'Growatt';
  if (upper.includes('DEYE')) return 'Deye';
  if (upper.includes('PYLONTECH')) return 'Pylontech';
  if (upper.includes('GENIX')) return 'GENIXGREEN';
  if (upper.includes('HITHIUM')) return 'Hithium';
  if (upper.includes('CFE')) return 'CFE';
  if (upper.includes('SAJ')) return 'SAJ';
  if (upper.includes('LEADER')) return 'Leader';
  return 'Japan Green Power';
}

function modelFromTitle(title = '', brand = '') {
  const brandPattern = brand === 'CFE'
    ? /\bCFE\b(?!-)/i
    : new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return stripHtml(title)
    .replace(/^\[[^\]]+\]\s*/i, '')
    .replace(/^(inverter|biến tần|bien tan)\s*/i, '')
    .replace(/^(hybrid|hòa lưới|hoa luoi|off-grid|off grid)\s*/i, '')
    .replace(/^pin\s+(lưu trữ|luu tru|lithium|lithium-ion)?\s*/i, '')
    .replace(/^(điện|dien)\s*/i, '')
    .replace(/\b(lưu trữ|luu tru|điện|dien|lithium-ion|lithium)\b/gi, ' ')
    .replace(brandPattern, ' ')
    .replace(/[ /]+/g, ' ')
    .trim();
}

function modelCodes(value = '') {
  const upper = stripHtml(value)
    .normalize('NFD')
    .replace(/đ/gi, 'd')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  const specialCodes = [...upper.matchAll(/\bCFE[- ]XH\s*\d+\b/g)].map((match) => compact(match[0]));
  const normalCodes = [...upper.matchAll(/\b[A-Z]{2,}[A-Z0-9.-]*\d[A-Z0-9.-]*\b/g)]
    .map((match) => compact(match[0]))
    .filter((key) => key.length >= 4);
  return [...new Set([...specialCodes, ...normalCodes])];
}

function specPairFromText(text = '') {
  const match = text.match(/^([^:：]{2,90})[:：]\s*(.+)$/);
  if (!match) return null;
  return [match[1].trim(), match[2].trim()];
}

function excerptDescription(product) {
  const excerpt = stripHtml(product.excerpt?.rendered || '');
  const lines = excerpt
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^Mã sản phẩm:/i.test(line) && !/^StartFragment|EndFragment$/i.test(line));
  return lines.join(' ').trim() || stripHtml(product.content?.rendered || '').split('\n').find(Boolean) || stripHtml(product.title?.rendered || '');
}

function extractSpecs(contentHtml = '') {
  const specs = {};
  const skipLabels = /^(hạng mục|mục|thông số|thông số kỹ thuật|giá trị|nội dung|model)$/i;
  const tables = [...contentHtml.matchAll(/<table[\s\S]*?<\/table>/gi)];
  for (const tableMatch of tables) {
    const rows = [...tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)];
    for (const row of rows) {
      const cells = [...row[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripHtml(cell[1]));
      if (cells.length >= 4 && cells.length % 2 === 0) {
        for (let index = 0; index < cells.length; index += 2) {
          const label = cells[index];
          const value = cells[index + 1];
          if (label && value && !skipLabels.test(label)) specs[label] = value;
        }
      } else if (cells.length === 2 && specPairFromText(cells[0]) && specPairFromText(cells[1])) {
        for (const cell of cells) {
          const [label, value] = specPairFromText(cell);
          if (label && value && !skipLabels.test(label)) specs[label] = value;
        }
      } else if (cells.length >= 2 && cells[0] && cells[1] && !skipLabels.test(cells[0])) {
        specs[cells[0]] = cells.slice(1).join(' | ');
      }
    }
  }

  const text = stripHtml(contentHtml);
  const patterns = [
    ['Công suất định mức', /(?:Công suất|Công suất định mức|Công suất đầu ra).*?:\s*([0-9.,]+\s*k?W)/i],
    ['Hiệu suất tối đa', /Hiệu suất(?: tối đa)?.*?:\s*([0-9.,]+\s*%)/i],
    ['Điện áp danh định', /Điện áp danh định.*?:\s*([0-9.,]+\s*V)/i],
    ['Dung lượng định mức', /Dung lượng định mức.*?:\s*([0-9.,]+\s*Ah)/i],
    ['Năng lượng định mức', /Năng lượng định mức.*?:\s*([0-9.,]+\s*kWh)/i],
    ['Kích thước', /Kích thước.*?:\s*([0-9.,]+\s*[×x*]\s*[0-9.,]+\s*[×x*]\s*[0-9.,]+\s*mm)/i],
    ['Trọng lượng', /Trọng lượng.*?:\s*([0-9.,]+\s*kg[^.\n]*)/i],
    ['Bảo hành', /Bảo hành.*?:\s*([0-9]+\s*năm)/i],
  ];
  for (const [label, pattern] of patterns) {
    const match = text.match(pattern);
    if (match && !specs[label]) specs[label] = match[1].trim();
  }
  return specs;
}

function extractFeatures(contentHtml = '') {
  const features = [];
  const skipText = /Hotline|Email|Website|Facebook|Trụ sở|Văn phòng|Tổng kho|Thông tin liên hệ|Liên Hệ|Công ty TNHH|Liên hệ ngay/i;
  const listItems = [...contentHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter((item) => item.length > 20 && !skipText.test(item));
  for (const item of listItems) {
    if (!features.includes(item)) features.push(item);
    if (features.length >= 8) break;
  }
  return features;
}

function inferBatteryTarget(title = '') {
  const upper = stripHtml(title).toUpperCase();
  if (/ÁP CAO|AP CAO|FORCE H|POWERCUBE|ACE|CFE-XH|250H|PV-STS/.test(upper)) return 'hv-battery';
  return 'lv-battery';
}

function inferAccessoryTarget(title = '') {
  const text = normalizeName(title);
  if (text.includes('tiep dia')) return 'grounding';
  return 'mounting';
}

function inferTarget(source, product) {
  if (source.id === 83) return inferBatteryTarget(product.title?.rendered || '');
  if (source.id === 84) return inferAccessoryTarget(product.title?.rendered || '');
  return source.target;
}

function productTypeForTarget(target, fallback) {
  if (target === 'on-grid-inverter' || target === 'hybrid-inverter') return 'inverter';
  return target || fallback;
}

async function collectExisting(target) {
  const dir = path.join(OUT_CONTENT, target);
  const bySlug = new Map();
  const byName = new Map();
  const byModel = new Map();
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const filePath = path.join(dir, entry.name);
    const content = await fs.readFile(filePath, 'utf8');
    const name = content.match(/^name:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
    const model = content.match(/^model:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
    const brand = content.match(/^brand:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
    bySlug.set(path.basename(entry.name, '.md'), filePath);
    if (name) byName.set(normalizeName(name), filePath);
    for (const key of [model, `${brand} ${model}`, name, ...modelCodes(model), ...modelCodes(name)]) {
      const compactKey = compact(key);
      if (compactKey.length >= 4 && !byModel.has(compactKey)) byModel.set(compactKey, filePath);
    }
  }
  return { bySlug, byName, byModel };
}

function findExistingPath(existing, product, target) {
  const title = stripHtml(product.title?.rendered || '');
  const brand = brandFromTitle(title);
  const model = modelFromTitle(title, brand);
  for (const candidate of candidateSlugs(product, target)) {
    if (existing.bySlug.has(candidate)) return existing.bySlug.get(candidate);
  }
  if (existing.byName.has(normalizeName(title))) return existing.byName.get(normalizeName(title));
  for (const key of [model, `${brand} ${model}`, title, ...modelCodes(model), ...modelCodes(title)]) {
    const compactKey = compact(key);
    if (compactKey.length >= 4 && existing.byModel.has(compactKey)) return existing.byModel.get(compactKey);
  }
  return path.join(OUT_CONTENT, target, `${candidateSlugs(product, target)[0]}.md`);
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

async function downloadImage(productSlug, imageUrl) {
  const { outDir, outPath, imagePath } = productImageTarget(productSlug, imageUrl);
  await fs.mkdir(outDir, { recursive: true });
  try {
    await fs.access(outPath);
  } catch {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`skip-image: ${response.status} ${response.statusText}: ${imageUrl}`);
      return '';
    }
    await fs.writeFile(outPath, Buffer.from(await response.arrayBuffer()));
  }
  return imagePath;
}

async function readExistingImage(filePath) {
  const content = await fs.readFile(filePath, 'utf8').catch(() => '');
  return content.match(/^main_image:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
}

async function fetchCategoryProducts(categoryId) {
  const products = [];
  for (let page = 1; ; page++) {
    const url = `${API_BASE}/product?product_cat=${categoryId}&per_page=100&page=${page}&_embed=wp:featuredmedia`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    const batch = await response.json();
    products.push(...batch);
    if (batch.length < 100) break;
  }
  return products;
}

function bodyMarkdown(product, specs, features) {
  const title = stripHtml(product.title?.rendered || '');
  const description = excerptDescription(product);
  const sections = [`# ${title}`, `## Mô tả\n\n${description}`];
  if (Object.keys(specs).length) {
    sections.push(`## Thông số kỹ thuật\n\n${Object.entries(specs).map(([key, value]) => `- **${key}:** ${value}`).join('\n')}`);
  }
  if (features.length) {
    sections.push(`## Tính năng nổi bật\n\n${features.map((item) => `- ${item}`).join('\n')}`);
  }
  sections.push(`Nguồn tham khảo: ${product.link}`);
  return `${sections.join('\n\n')}\n`;
}

function toMarkdown(product, imagePath, target, productType) {
  const title = stripHtml(product.title?.rendered || '');
  const brand = brandFromTitle(title);
  const model = modelFromTitle(title, brand);
  const specs = extractSpecs(product.content?.rendered || '');
  const features = extractFeatures(product.content?.rendered || '');
  const warranty = specs['Bảo hành'] || specs['Bảo hành sản phẩm'] || specs['Bảo hành(năm)'];
  const warrantyYears = warranty ? Number.parseInt(warranty, 10) : undefined;

  const lines = [
    '---',
    `name: ${yamlQuote(title)}`,
    `brand: ${yamlQuote(brand)}`,
    `category: ${yamlQuote(target)}`,
    `model: ${yamlQuote(model)}`,
    `description: ${yamlBlock(excerptDescription(product))}`,
    `main_image: ${yamlQuote(imagePath)}`,
    'is_available: true',
    'show_on_homepage: false',
    `product_type: ${yamlQuote(productType)}`,
    `source_url: ${yamlQuote(product.link)}`,
  ];
  if (warrantyYears) lines.push(`warranty_years: ${warrantyYears}`);
  if (warranty) lines.push(`warranty: ${yamlQuote(warranty)}`);
  if (Object.keys(specs).length) {
    lines.push('specifications:');
    for (const [key, value] of Object.entries(specs)) lines.push(`  ${yamlQuote(key)}: ${yamlQuote(value)}`);
  }
  if (features.length) {
    lines.push('features:');
    for (const feature of features) lines.push(`  - ${yamlQuote(feature)}`);
  }
  lines.push('---', '', bodyMarkdown(product, specs, features));
  return lines.join('\n');
}

async function main() {
  const existingByTarget = new Map();
  const touched = new Set();
  const summary = [];

  for (const source of SOURCE_CATEGORIES) {
    const products = await fetchCategoryProducts(source.id);
    for (const product of products) {
      const target = inferTarget(source, product);
      const productType = productTypeForTarget(target, source.productType);
      if (!existingByTarget.has(target)) existingByTarget.set(target, await collectExisting(target));
      const existing = existingByTarget.get(target);
      const filePath = findExistingPath(existing, product, target);
      if (touched.has(filePath)) {
        summary.push({ action: 'skipped-duplicate', file: path.relative(ROOT, filePath), title: stripHtml(product.title?.rendered || '') });
        continue;
      }
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      const productSlug = path.basename(filePath, '.md');
      const imageUrl = product._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      const imagePath = imageUrl ? await downloadImage(productSlug, imageUrl) : '';
      const existed = await fs.access(filePath).then(() => true).catch(() => false);
      const finalImagePath = imagePath || (existed ? await readExistingImage(filePath) : '');
      await fs.writeFile(filePath, toMarkdown(product, finalImagePath, target, productType));
      const title = stripHtml(product.title?.rendered || '');
      const brand = brandFromTitle(title);
      const model = modelFromTitle(title, brand);
      existing.byName.set(normalizeName(title), filePath);
      existing.bySlug.set(path.basename(filePath, '.md'), filePath);
      for (const key of [model, `${brand} ${model}`, title, ...modelCodes(model), ...modelCodes(title)]) {
        const compactKey = compact(key);
        if (compactKey.length >= 4) existing.byModel.set(compactKey, filePath);
      }
      touched.add(filePath);
      summary.push({ action: existed ? 'updated' : 'created', file: path.relative(ROOT, filePath), title });
    }
  }

  const counts = summary.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] || 0) + 1;
    return acc;
  }, {});
  console.log(`Synced ${summary.length} Japan Green Power non-panel products.`);
  console.log(JSON.stringify(counts, null, 2));
  for (const item of summary) console.log(`${item.action}: ${item.file} | ${item.title}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
