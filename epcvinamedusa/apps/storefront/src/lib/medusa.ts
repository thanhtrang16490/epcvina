import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export type MedusaProduct = {
  id: string;
  title: string;
  handle?: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  images?: Array<{ url?: string }>;
  variants?: Array<{ title?: string; prices?: Array<{ amount?: number; currency_code?: string }> }>;
  metadata?: {
    category?: string;
    category_name?: string;
    brand_handle?: string;
    brand_name?: string;
  };
};

export type MedusaCategory = {
  id: string;
  name: string;
  handle?: string;
  description?: string;
  rank?: number;
  metadata?: { image?: string };
};

export type MedusaBrand = {
  id: string;
  handle: string;
  name: string;
  description?: string | null;
  image?: string | null;
  rank?: number;
};

const BACKEND_URL = process.env.PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const SOURCE_SITE_URL = process.env.PUBLIC_EPCVINA_SOURCE_URL || 'http://localhost:3002';
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Medusa publishable key. Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.');
}

const EPCVINA_ROOT = resolve('/Users/thanhtrang/Documents/epcvina.com/epcvinasolar');
const PRODUCTS_DIR = resolve(EPCVINA_ROOT, 'src/content/products');
const CATEGORY_PREFIXES = [
  'on-grid-inverter',
  'hybrid-inverter',
  'hv-battery',
  'lv-battery',
  'solar-panel',
  'panel',
  'mounting',
  'cabinet',
  'grounding',
  'wiring',
];

function toHandle(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('Missing frontmatter block');

  const lines = match[1].split('\n');
  const data: Record<string, string | number | boolean | string[] | Record<string, string>> = {};
  let currentKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    const listMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      (data[currentKey] as string[]).push(String(parseScalar(listMatch[2])));
      continue;
    }
    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValueMatch) continue;
    const [, key, rawValue] = keyValueMatch;
    currentKey = key;
    data[key] = rawValue === '' ? '' : parseScalar(rawValue);
  }

  return data;
}

function collectMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdownFiles(fullPath));
    if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')))
      files.push(fullPath);
  }
  return files;
}

function loadLocalSourceProducts() {
  return collectMarkdownFiles(PRODUCTS_DIR)
    .map((filePath) => {
      const fm = parseFrontmatter(readFileSync(filePath, 'utf8'));
      const slug =
        toHandle(filePath.replace(PRODUCTS_DIR, '').replace(/\.(md|mdx)$/, '')) ||
        toHandle(String(fm.name ?? ''));
      return {
        name: String(fm.name ?? ''),
        slug,
        brand: String(fm.brand ?? ''),
        category: String(fm.category ?? ''),
        description: String(fm.description ?? ''),
        unit_price: Number(fm.unit_price ?? fm.price ?? 0) || 0,
        main_image: String(fm.main_image ?? ''),
      };
    })
    .filter((p) => p.name && p.slug && p.category);
}

function loadLocalBrandMap() {
  const map = new Map<string, string>();

  for (const product of loadLocalSourceProducts()) {
    if (!map.has(product.slug)) {
      map.set(product.slug, product.brand);
    }
  }

  return map;
}

function buildProduct(p: ReturnType<typeof loadLocalSourceProducts>[number]): MedusaProduct {
  return {
    id: p.slug,
    title: p.name,
    handle: p.slug,
    subtitle: p.brand,
    description: p.description,
    thumbnail: p.main_image || undefined,
    images: p.main_image ? [{ url: p.main_image }] : [],
    variants: [
      {
        title: 'Default',
        prices: p.unit_price ? [{ amount: p.unit_price, currency_code: 'VND' }] : [],
      },
    ],
    metadata: { category: p.category },
  };
}

function buildCategories() {
  const map = new Map<string, MedusaCategory>();
  for (const product of loadLocalSourceProducts()) {
    const handle = deriveCategoryHandle(product);
    if (!map.has(handle)) {
      map.set(handle, {
        id: handle,
        name: product.category,
        handle,
        description: product.category,
        metadata: product.main_image ? { image: product.main_image } : undefined,
      });
    }
  }
  return [...map.values()];
}

export function deriveCategoryHandle(
  product: Pick<ReturnType<typeof loadLocalSourceProducts>[number], 'category' | 'slug'>
) {
  const slug = product.slug.toLowerCase();
  const matchedPrefix = CATEGORY_PREFIXES.find(
    (prefix) => slug.startsWith(`${prefix}-`) || slug === prefix
  );
  if (matchedPrefix) return matchedPrefix === 'solar-panel' ? 'panel' : matchedPrefix;

  const normalizedCategory = toHandle(product.category);
  if (normalizedCategory === 'solar-panel') return 'panel';
  return normalizedCategory;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Medusa API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function fetchMedusaProductsPage(limit: number, offset: number) {
  return fetchJson<{ products?: MedusaProduct[]; count?: number }>(
    `${BACKEND_URL}/store/products?limit=${limit}&offset=${offset}`
  );
}

async function fetchMedusaCategoriesPage(limit: number, offset: number) {
  return fetchJson<{ product_categories?: MedusaCategory[]; count?: number }>(
    `${BACKEND_URL}/store/product-categories?limit=${limit}&offset=${offset}`
  );
}

async function fetchMedusaBrandsPage(limit: number, offset: number) {
  return fetchJson<{ brands?: MedusaBrand[] }>(
    `${BACKEND_URL}/store/brands?limit=${limit}&offset=${offset}`
  );
}

export function normalizeMediaUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/images/')) return `${SOURCE_SITE_URL}${url}`;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return url;
}

export async function getProducts() {
  try {
    const pageSize = 100;
    const products: MedusaProduct[] = [];
    let offset = 0;
    let total = Number.POSITIVE_INFINITY;

    while (offset < total) {
      const data = await fetchMedusaProductsPage(pageSize, offset);
      const batch = Array.isArray(data.products) ? data.products : [];
      const count = typeof data.count === 'number' ? data.count : batch.length;

      products.push(...batch);
      total = count;

      if (batch.length === 0) break;
      offset += batch.length;
    }

    if (products.length > 0) return products;
  } catch {
    // Fall back to local content when Medusa store API is unavailable.
  }
  return loadLocalSourceProducts().map(buildProduct);
}

export async function getProductByHandle(handle: string) {
  const products = await getProducts();
  return products.find((product) => product.handle === handle);
}

export function getProductBrand(product: MedusaProduct) {
  const subtitle = product.subtitle?.trim();
  if (subtitle) return subtitle;

  const brandMap = loadLocalBrandMap();
  const handle = product.handle || product.id;
  return brandMap.get(handle) || '';
}

export async function getCategories() {
  try {
    const pageSize = 100;
    const categories: MedusaCategory[] = [];
    let offset = 0;
    let total = Number.POSITIVE_INFINITY;

    while (offset < total) {
      const data = await fetchMedusaCategoriesPage(pageSize, offset);
      const batch = Array.isArray(data.product_categories) ? data.product_categories : [];
      const count = typeof data.count === 'number' ? data.count : batch.length;

      categories.push(...batch);
      total = count;

      if (batch.length === 0) break;
      offset += batch.length;
    }

    if (categories.length > 0) {
      return categories.sort((a, b) => {
        const rankA = typeof a.rank === 'number' ? a.rank : Number.POSITIVE_INFINITY;
        const rankB = typeof b.rank === 'number' ? b.rank : Number.POSITIVE_INFINITY;
        if (rankA !== rankB) return rankA - rankB;
        return (a.handle || a.id).localeCompare(b.handle || b.id);
      });
    }
  } catch {
    // Fall back to local content when Medusa store API is unavailable.
  }
  return buildCategories();
}

export async function getBrands() {
  try {
    const brands: MedusaBrand[] = [];
    let offset = 0;
    const pageSize = 100;

    while (true) {
      const data = await fetchMedusaBrandsPage(pageSize, offset);
      const batch = Array.isArray(data.brands) ? data.brands : [];
      brands.push(...batch);
      if (batch.length < pageSize) break;
      offset += batch.length;
    }

    if (brands.length > 0) {
      return brands.sort((a, b) => {
        const rankA = typeof a.rank === 'number' ? a.rank : Number.POSITIVE_INFINITY;
        const rankB = typeof b.rank === 'number' ? b.rank : Number.POSITIVE_INFINITY;
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
    }
  } catch {
    // Fall back to local brand extraction from source products.
  }

  const localBrandMap = new Map<string, MedusaBrand>();
  for (const product of loadLocalSourceProducts()) {
    const name = product.brand || product.product_type || product.category;
    const handle = toHandle(name);
    if (!handle || localBrandMap.has(handle)) continue;
    localBrandMap.set(handle, {
      id: handle,
      handle,
      name,
      description: name,
      image: product.main_image || undefined,
      rank: localBrandMap.size + 1,
    });
  }

  return [...localBrandMap.values()];
}

export async function getBrandByHandle(handle: string) {
  const brands = await getBrands();
  return brands.find((brand) => brand.handle === handle);
}

export function getProductBrandHandle(product: MedusaProduct) {
  const brandHandle = product.metadata?.brand_handle?.trim();
  if (brandHandle) return brandHandle;

  const subtitle = product.subtitle?.trim();
  if (subtitle) {
    return subtitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  return '';
}

export function getProductBrandName(product: MedusaProduct) {
  return product.metadata?.brand_name?.trim() || product.subtitle?.trim() || '';
}

export async function getProductsByCategory(categoryHandle: string) {
  const products = await getProducts();
  return products.filter((product) => {
    if (product.metadata?.category === categoryHandle) return true;
    const productHandle = (product.handle || product.id || '').toLowerCase();
    if (categoryHandle === 'panel') {
      return productHandle.startsWith('panel-') || productHandle.startsWith('solar-panel-');
    }
    return productHandle.startsWith(`${categoryHandle}-`);
  });
}

export function getProductImage(product: MedusaProduct) {
  return normalizeMediaUrl(product.thumbnail || product.images?.[0]?.url);
}
