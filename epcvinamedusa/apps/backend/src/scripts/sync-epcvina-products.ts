import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { Client } from "pg";
import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, ProductStatus } from "@medusajs/framework/utils";
import { createRequire } from "module";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

type SourceProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categoryHandle: string;
  model: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  warranty_years: number;
  unit_price: number;
  main_image: string;
  is_available: boolean;
  show_on_homepage: boolean;
  product_type: string;
  phase?: "1-phase" | "3-phase" | null;
  voltage?: "low" | "high" | null;
  source_url?: string;
};

type BrandRecord = {
  handle: string;
  name: string;
  description: string | null;
  image: string | null;
  rank: number;
};

type SourceBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  country?: string;
};

const EPCVINA_SOLAR_ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinasolar";
const PRODUCTS_DIR = resolve(EPCVINA_SOLAR_ROOT, "src/content/products");
const CATEGORY_PREFIXES = [
  "on-grid-inverter",
  "hybrid-inverter",
  "hv-battery",
  "lv-battery",
  "solar-panel",
  "panel",
  "mounting",
  "cabinet",
  "grounding",
  "wiring",
];
const CATEGORY_CONFIG = [
  { handle: "panel", name: "Tấm quang năng", rank: 1 },
  { handle: "mounting", name: "Hệ khung nhôm", rank: 2 },
  { handle: "wiring", name: "Hệ dây điện", rank: 3 },
  { handle: "cabinet", name: "Tủ điện", rank: 4 },
  { handle: "grounding", name: "Hệ tiếp địa", rank: 5 },
  { handle: "on-grid-inverter", name: "Biến tần On-Grid", rank: 6 },
  { handle: "hybrid-inverter", name: "Biến tần Hybrid", rank: 7 },
  { handle: "lv-battery", name: "Pin lưu trữ áp thấp", rank: 8 },
  { handle: "hv-battery", name: "Pin lưu trữ áp cao", rank: 9 },
  { handle: "solar-panel", name: "Tấm quang năng", rank: 10 },
] as const;

function deriveBrandHandle(brand: string) {
  return toHandle(brand);
}

function loadSourceBrands(): SourceBrand[] {
  const require = createRequire(import.meta.url);
  const jiti = require("jiti")(import.meta.url);
  const { localBrands } = jiti("/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/data/brands.ts");
  return Array.isArray(localBrands) ? (localBrands as SourceBrand[]) : [];
}

function toHandle(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function deriveCategoryHandle(category: string, slug: string) {
  const normalizedSlug = slug.toLowerCase();
  const matchedPrefix = CATEGORY_PREFIXES.find(
    (prefix) => normalizedSlug === prefix || normalizedSlug.startsWith(`${prefix}-`)
  );
  if (matchedPrefix) return matchedPrefix === "solar-panel" ? "panel" : matchedPrefix;

  const normalizedCategory = toHandle(category);
  return normalizedCategory === "solar-panel" ? "panel" : normalizedCategory;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error("Missing frontmatter block.");
  }

  const lines = match[1].split("\n");
  const data: Record<string, any> = {};
  let currentKey: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const listMatch = line.match(/^(\s*)-\s+(.*)$/);
    if (listMatch && currentKey) {
      const value = listMatch[2];
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(parseScalar(value));
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValueMatch) {
      continue;
    }

    const [, key, rawValue] = keyValueMatch;
    currentKey = key;

    if (rawValue === "") {
      const nextLine = lines[index + 1] ?? "";
      if (nextLine.trim().startsWith("- ")) {
        data[key] = [];
        continue;
      }

      const objectLines: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const candidate = lines[cursor];
        if (!candidate.trim()) {
          cursor += 1;
          continue;
        }

        if (/^[A-Za-z0-9_]+:\s*/.test(candidate)) break;
        if (!/^\s+/.test(candidate)) break;
        objectLines.push(candidate.replace(/^\s+/, ""));
        cursor += 1;
      }

      if (objectLines.length > 0 && objectLines.some((entry) => entry.includes(":"))) {
        const obj: Record<string, string> = {};
        for (const entry of objectLines) {
          const idx = entry.indexOf(":");
          if (idx === -1) continue;
          const objKey = entry.slice(0, idx).trim();
          const objValue = entry.slice(idx + 1).trim();
          obj[objKey] = String(parseScalar(objValue));
        }
        data[key] = obj;
        index = cursor - 1;
        continue;
      }

      data[key] = "";
      continue;
    }

    data[key] = parseScalar(rawValue);
  }

  return data;
}

function readMarkdownFrontmatter(filePath: string) {
  const content = readFileSync(filePath, "utf8");
  return parseFrontmatter(content);
}

function collectMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadSourceProducts(): Promise<SourceProduct[]> {
  const files = collectMarkdownFiles(PRODUCTS_DIR);
  return files
    .map((filePath) => {
      const frontmatter = readMarkdownFrontmatter(filePath);
      const slugSource = filePath
        .replace(PRODUCTS_DIR, "")
        .replace(/\.(md|mdx)$/, "");
      const slug = toHandle(slugSource) || toHandle(String(frontmatter.name ?? ""));
      return {
        id: slug,
        name: String(frontmatter.name ?? ""),
        slug,
        brand: String(frontmatter.brand ?? ""),
        category: String(frontmatter.category ?? ""),
        categoryHandle: deriveCategoryHandle(
          String(frontmatter.category ?? ""),
          slug
        ),
        model: String(frontmatter.model ?? ""),
        description: String(frontmatter.description ?? ""),
        specifications: (frontmatter.specifications ?? {}) as Record<string, string>,
        features: Array.isArray(frontmatter.features) ? frontmatter.features.map(String) : [],
        warranty_years: Number.parseInt(String(frontmatter.warranty_years ?? 0), 10) || 0,
        unit_price: Number(frontmatter.unit_price ?? frontmatter.price ?? 0) || 0,
        main_image: String(frontmatter.main_image ?? ""),
        is_available: Boolean(frontmatter.is_available ?? true),
        show_on_homepage: Boolean(frontmatter.show_on_homepage ?? false),
        product_type: String(frontmatter.product_type ?? frontmatter.category ?? ""),
        phase: frontmatter.phase ?? null,
        voltage: frontmatter.voltage ?? null,
        source_url: frontmatter.source_url ? String(frontmatter.source_url) : undefined,
      } satisfies SourceProduct;
    })
    .filter((product) => product.name && product.slug && product.category);
}

function buildCategoryImageMap(localProducts: SourceProduct[]) {
  const map = new Map<string, string>();

  for (const product of localProducts) {
    if (!map.has(product.categoryHandle) && product.main_image) {
      map.set(product.categoryHandle, product.main_image);
    }
  }

  return map;
}

async function deleteSampleProducts(client: Client) {
  const sampleHandles = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];
  await client.query(`delete from product where handle = any($1::text[])`, [sampleHandles]);
}

async function deleteEpcvinaProducts(client: Client, localProducts: SourceProduct[]) {
  const handles = localProducts.map((product) => product.slug);
  await client.query(`delete from product where handle = any($1::text[])`, [handles]);
}

async function deleteInventoryItems(client: Client, localProducts: SourceProduct[]) {
  const skus = localProducts.map((product) => product.id.toUpperCase());
  await client.query(`delete from inventory_item where sku = any($1::text[])`, [skus]);
}

async function deleteEmptyProductCategories(client: Client) {
  await client.query(`
    delete from product_category c
    where not exists (
      select 1
      from product_category_product pcp
      where pcp.product_category_id = c.id
    )
    and c.handle <> 'panel'
    and c.handle <> 'mounting'
    and c.handle <> 'wiring'
    and c.handle <> 'cabinet'
    and c.handle <> 'grounding'
    and c.handle <> 'on-grid-inverter'
    and c.handle <> 'hybrid-inverter'
    and c.handle <> 'hv-battery'
    and c.handle <> 'lv-battery'
    and c.handle <> 'solar-panel'
  `);
}

async function deleteSampleProductCategories(client: Client) {
  await client.query(`
    delete from product_category_product
    where product_category_id in (
      select id from product_category
      where handle = any($1::text[])
    )
  `, [["merch", "pants", "shirts", "sweatshirts"]]);

  await client.query(`
    delete from product_category
    where handle = any($1::text[])
  `, [["merch", "pants", "shirts", "sweatshirts"]]);
}

async function updateCategoryConfig(client: Client) {
  for (const category of CATEGORY_CONFIG) {
    await client.query(
      `update product_category
       set name = $1,
           description = coalesce(description, $1),
           rank = $2,
           updated_at = now()
       where handle = $3`,
      [category.name, category.rank, category.handle]
    );
  }
}

function buildBrandRecords(localProducts: SourceProduct[]): BrandRecord[] {
  const sourceBrands = loadSourceBrands();
  const brandLogoMap = new Map<string, string | undefined>();
  const brandDescriptionMap = new Map<string, string | undefined>();

  for (const brand of sourceBrands) {
    const handle = deriveBrandHandle(brand.slug || brand.name);
    if (!handle) continue;
    brandLogoMap.set(handle, brand.logo_url || undefined);
    brandDescriptionMap.set(handle, brand.description);
  }

  const seen = new Map<string, BrandRecord>();

  for (const product of localProducts) {
    const brandName = product.brand || product.product_type || product.category;
    const handle = deriveBrandHandle(brandName);
    if (!handle) continue;
    if (!seen.has(handle)) {
      seen.set(handle, {
        handle,
        name: brandName,
        description: brandDescriptionMap.get(handle) || brandName,
        image: brandLogoMap.get(handle) || null,
        rank: seen.size + 1,
      });
      continue;
    }

    const existing = seen.get(handle)!;
    if (!existing.image && brandLogoMap.get(handle)) {
      existing.image = brandLogoMap.get(handle) || null;
    }
    if (!existing.image && product.main_image) {
      existing.image = product.main_image;
    }
    if (!existing.description && brandDescriptionMap.get(handle)) {
      existing.description = brandDescriptionMap.get(handle) || null;
    }
  }

  return [...seen.values()].sort((a, b) => a.rank - b.rank);
}

async function syncBrands(client: Client, localProducts: SourceProduct[]) {
  const brands = buildBrandRecords(localProducts);
  for (const brand of brands) {
    const existing = await client.query(
      `select id from brand where handle = $1 limit 1`,
      [brand.handle]
    );

    if (existing.rowCount > 0) {
      await client.query(
        `update brand
         set name = $1,
             description = $2,
             image = coalesce($3, image),
             rank = $4,
             updated_at = now()
         where handle = $5`,
        [brand.name, brand.description, brand.image, brand.rank, brand.handle]
      );
      continue;
    }

    await client.query(
      `insert into brand (id, handle, name, description, image, rank, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, now(), now())`,
      [brand.handle, brand.handle, brand.name, brand.description, brand.image, brand.rank]
    );
  }
}

export default async function syncEpcvinaProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const localProducts = await loadSourceProducts();
  if (localProducts.length === 0) {
    throw new Error("No source products found in epcvinasolar.");
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    logger.info("Removing Medusa sample products...");
    await deleteSampleProducts(client);
    logger.info("Removing existing EPCVINA products...");
    await deleteEpcvinaProducts(client, localProducts);
    logger.info("Removing EPCVINA inventory items...");
    await deleteInventoryItems(client, localProducts);

    logger.info("Loading existing product categories...");
    const existingCategories = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle"],
    });

    const categoryMap = new Map<string, string>();
    const categoryNames = Array.from(
      new Set(localProducts.map((product) => product.categoryHandle))
    );
    const missingCategoryNames = categoryNames.filter(
      (handle) =>
        !existingCategories.data.some(
          (category: any) => category.handle === handle || category.name === handle
        )
    );

    if (missingCategoryNames.length > 0) {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: missingCategoryNames.map((name, index) => ({
            name,
            is_active: true,
            description: name,
            handle: name || `category-${index + 1}`,
          })),
        },
      });

      result.forEach((category: any) => {
        categoryMap.set(category.name, category.id);
      });
    }

    existingCategories.data.forEach((category: any) => {
      categoryMap.set(category.handle || category.name, category.id);
    });

    const categoryImageMap = buildCategoryImageMap(localProducts);
    for (const [categoryName, categoryId] of categoryMap.entries()) {
      const image = categoryImageMap.get(categoryName);
      if (!image) continue;
      await client.query(
        `update product_category
         set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('image', $1::text)
         where id = $2`,
        [image, categoryId]
      );
    }

    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "name"],
    });
    const shippingProfile = shippingProfiles[0];
    if (!shippingProfile) {
      throw new Error("No shipping profile found. Run db:setup first.");
    }

    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"],
    });
    const defaultSalesChannel = salesChannels[0];
    if (!defaultSalesChannel) {
      throw new Error("No sales channel found. Run db:setup first.");
    }

    const productsToCreate = localProducts.map((product) => ({
      title: product.name,
      subtitle: product.brand || product.product_type || product.category,
      description: product.description,
      handle: product.slug,
      status: ProductStatus.PUBLISHED,
      discountable: true,
      shipping_profile_id: shippingProfile.id,
      categories: categoryMap.has(product.categoryHandle)
        ? [{ id: categoryMap.get(product.categoryHandle)! }]
        : [],
      thumbnail: product.main_image || undefined,
      images: product.main_image ? [{ url: product.main_image }] : [],
      options: [
        {
          title: "Default option",
          values: ["Default option value"],
        },
      ],
      variants: [
        {
          title: "Default variant",
          sku: product.id.toUpperCase(),
          options: {
            "Default option": "Default option value",
          },
          prices: [
            {
              amount: product.unit_price || 0,
              currency_code: "usd",
            },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        brand_handle: deriveBrandHandle(product.brand || product.product_type || product.category),
        brand_name: product.brand,
        category: product.categoryHandle,
        category_name: product.category,
        model: product.model,
        specifications: product.specifications,
        features: product.features,
        warranty_years: product.warranty_years,
        product_type: product.product_type,
        phase: product.phase,
        voltage: product.voltage,
        show_on_homepage: product.show_on_homepage,
        source_url: product.source_url,
        source: "epcvina-sync",
      },
    }));

    logger.info(`Importing ${productsToCreate.length} EPCVINA products into Medusa...`);
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate,
      },
    });

    await client.query(
      `update product as p
       set subtitle = v.subtitle,
           metadata = coalesce(p.metadata, '{}'::jsonb) || jsonb_build_object(
             'brand_handle', v.brand_handle,
             'brand_name', v.brand_name
           ),
           updated_at = now()
       from unnest($1::text[], $2::text[], $3::text[], $4::text[]) as v(handle, subtitle, brand_handle, brand_name)
       where p.handle = v.handle
         and (
           p.subtitle is distinct from v.subtitle
           or p.subtitle is null
           or coalesce(p.metadata->>'brand_handle', '') is distinct from v.brand_handle
         )`,
      [
        localProducts.map((product) => product.slug),
        localProducts.map((product) => product.brand || product.product_type || product.category),
        localProducts.map((product) => deriveBrandHandle(product.brand || product.product_type || product.category)),
        localProducts.map((product) => product.brand || product.product_type || product.category),
      ]
    );

    logger.info("Removing empty product categories...");
    await deleteEmptyProductCategories(client);

    logger.info("Removing sample product categories...");
    await deleteSampleProductCategories(client);

    logger.info("Updating category config...");
    await updateCategoryConfig(client);

    logger.info("Syncing brands...");
    await syncBrands(client, localProducts);

    logger.info("EPCVINA product sync completed successfully.");
  } finally {
    await client.end();
  }
}
