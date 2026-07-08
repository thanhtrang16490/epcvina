import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const API_URL = 'https://japangreenpower.com.vn/wp-json/wp/v2/product?product_cat=105&per_page=100&_embed=wp:featuredmedia';
const OUT_CONTENT = path.join(ROOT, 'epcvinasolar/src/content/products/panel');
const OUT_IMAGES = path.join(ROOT, 'epcvinasolar/public/images/products');

function decodeHtml(value = '') {
  return String(value)
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, '-')
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‑–—]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(cs6)\s+(\d)/g, 'cs6$2')
    .replace(/\b(cs6)\s*2\b/g, 'cs62')
    .trim();
}

function slugify(value = '') {
  return normalizeName(value).replace(/\s+/g, '-');
}

function candidateSlugs(product) {
  const title = stripHtml(product.title?.rendered || '');
  const candidates = new Set();
  candidates.add(slugify(title));
  if (!/^tấm pin|^tam pin/i.test(title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
    candidates.add(slugify(`tam pin ${title}`));
  }
  candidates.add(slugify(`tam pin ${product.slug || title}`));
  candidates.add(slugify(product.slug || title));
  return [...candidates].filter(Boolean);
}

function brandFromTitle(title = '') {
  const upper = title.toUpperCase();
  if (upper.includes('AIKO')) return 'AIKO';
  if (upper.includes('JA SOLAR')) return 'JA Solar';
  if (upper.includes('CANADIAN')) return 'Canadian Solar';
  if (upper.includes('SHARP')) return 'Sharp';
  return 'Japan Green Power';
}

function modelFromTitle(title = '') {
  return stripHtml(title)
    .replace(/^Tấm pin\s*/i, '')
    .replace(/^TẤM PIN\s*/i, '')
    .replace(/^mặt trời\s*/i, '')
    .trim();
}

function specPairFromText(text = '') {
  const match = text.match(/^([^:：]{2,80})[:：]\s*(.+)$/);
  if (!match) return null;
  return [match[1].trim(), match[2].trim()];
}

function powerFromTitle(title = '') {
  const match = stripHtml(title).match(/(\d{3,4})\s*W(?:p)?\b/i);
  return match ? `${match[1]} W` : '';
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
  const skipLabels = /^(hạng mục|mục|thông số|thông số kỹ thuật|giá trị|nội dung)$/i;
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
    ['Công suất tấm pin Pmax', /(?:Pmax|Công suất cực đại).*?:\s*([0-9.,]+\s*W)/i],
    ['Hiệu suất', /Hiệu suất(?: Module)?.*?:\s*([0-9.,]+\s*%)/i],
    ['Điện áp hở mạch Voc', /Voc.*?:\s*([0-9.,]+\s*V)/i],
    ['Điện áp tại công suất tối đa Vmp', /Vmp.*?:\s*([0-9.,]+\s*V)/i],
    ['Dòng ngắn mạch Isc', /Isc.*?:\s*([0-9.,]+\s*A)/i],
    ['Dòng điện tại công suất tối đa Imp', /Imp.*?:\s*([0-9.,]+\s*A)/i],
    ['Kích thước', /Kích thước.*?:\s*([0-9.,]+\s*[×x]\s*[0-9.,]+\s*[×x]\s*[0-9.,]+\s*mm)/i],
    ['Trọng lượng', /Trọng lượng.*?:\s*([0-9.,]+\s*kg[^.\n]*)/i],
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

async function collectExistingPanels() {
  const byName = new Map();
  const bySlug = new Map();
  const entries = await fs.readdir(OUT_CONTENT, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const filePath = path.join(OUT_CONTENT, entry.name);
    const content = await fs.readFile(filePath, 'utf8');
    const match = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
    if (match) byName.set(normalizeName(match[1]), filePath);
    bySlug.set(path.basename(entry.name, '.md'), filePath);
  }
  return { byName, bySlug };
}

function findExistingPath(existing, product) {
  const title = stripHtml(product.title?.rendered || '');
  const titleKey = normalizeName(title);

  for (const candidate of candidateSlugs(product)) {
    if (existing.bySlug.has(candidate)) return existing.bySlug.get(candidate);
  }
  if (existing.byName.has(titleKey)) return existing.byName.get(titleKey);
  return path.join(OUT_CONTENT, `${candidateSlugs(product)[0]}.md`);
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
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${imageUrl}`);
    await fs.writeFile(outPath, Buffer.from(await response.arrayBuffer()));
  }
  return imagePath;
}

function toMarkdown(product, imagePath) {
  const title = stripHtml(product.title?.rendered || '');
  const specs = extractSpecs(product.content?.rendered || '');
  const features = extractFeatures(product.content?.rendered || '');
  const brand = brandFromTitle(title);
  const model = modelFromTitle(title);
  const titlePower = powerFromTitle(title);
  if (titlePower) {
    const pmaxKey = Object.keys(specs).find((key) => /pmax|công suất cực đại|công suất tấm pin/i.test(key));
    const canonicalPmaxKey = pmaxKey || 'Công suất tấm pin Pmax';
    for (const key of Object.keys(specs)) {
      if (key !== canonicalPmaxKey && /pmax|công suất cực đại|công suất tấm pin/i.test(key)) delete specs[key];
    }
    specs[canonicalPmaxKey] = titlePower;
  }
  const warranty = specs['Bảo hành sản phẩm'] || specs['Bảo hành hiệu suất'];
  const warrantyYears = warranty ? Number.parseInt(warranty, 10) : undefined;

  const lines = [
    '---',
    `name: ${yamlQuote(title)}`,
    `brand: ${yamlQuote(brand)}`,
    'category: "panel"',
    `model: ${yamlQuote(model)}`,
    `description: ${yamlBlock(excerptDescription(product))}`,
    `main_image: ${yamlQuote(imagePath)}`,
    'is_available: true',
    'show_on_homepage: false',
    'product_type: "panel"',
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
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${API_URL}`);
  const products = await response.json();
  const existing = await collectExistingPanels();
  const summary = [];

  for (const product of products) {
    const filePath = findExistingPath(existing, product);
    const productSlug = path.basename(filePath, '.md');
    const imageUrl = product._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const imagePath = imageUrl ? await downloadImage(productSlug, imageUrl) : '';
    const existed = await fs.access(filePath).then(() => true).catch(() => false);
    await fs.writeFile(filePath, toMarkdown(product, imagePath));
    existing.byName.set(normalizeName(product.title?.rendered || ''), filePath);
    existing.bySlug.set(path.basename(filePath, '.md'), filePath);
    summary.push({ action: existed ? 'updated' : 'created', file: path.relative(ROOT, filePath) });
  }

  const created = summary.filter((item) => item.action === 'created').length;
  console.log(`Synced ${summary.length} Japan Green Power panel products: ${created} created, ${summary.length - created} updated.`);
  for (const item of summary) console.log(`${item.action}: ${item.file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
