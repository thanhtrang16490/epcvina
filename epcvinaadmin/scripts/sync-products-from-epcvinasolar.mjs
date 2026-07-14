import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const SOURCE_ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinasolar";
const PRODUCTS_DIR = path.join(SOURCE_ROOT, "src/content/products");
const envPath = path.join(ROOT, ".env.local");

function loadEnvFile(text) {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseScalar(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const body = match[1];
  const lines = body.split("\n");
  const data = {};
  let currentKey = null;
  let currentType = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;

    if (/^\s*-\s+/.test(line) && currentKey && currentType === "array") {
      data[currentKey].push(parseScalar(line.replace(/^\s*-\s+/, "")));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_ -]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const key = keyMatch[1].trim();
    const rest = keyMatch[2];
    currentKey = key;
    currentType = null;

    if (!rest) {
      const next = lines[i + 1] ?? "";
      if (/^\s*-/.test(next)) {
        data[key] = [];
        currentType = "array";
      } else {
        data[key] = {};
        currentType = "object";
      }
      continue;
    }

    if (rest === "|") {
      const block = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
        i += 1;
        block.push(lines[i].replace(/^\s{2}/, ""));
      }
      data[key] = block.join("\n");
      continue;
    }

    if (rest === ">") {
      const block = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
        i += 1;
        block.push(lines[i].trim());
      }
      data[key] = block.join(" ");
      continue;
    }

    data[key] = parseScalar(rest);
  }

  return data;
}

function findValueByKeys(fm, keys) {
  for (const key of keys) {
    if (fm[key] !== undefined && fm[key] !== null && String(fm[key]).trim() !== "") {
      return fm[key];
    }
  }
  return null;
}

function normalizePrice(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function buildTechnicalSpecs(fm, filePath) {
  const specs = fm.specifications && typeof fm.specifications === "object" ? fm.specifications : {};
  return {
    source: "epcvinasolar",
    source_path: filePath,
    product_type: findValueByKeys(fm, ["product_type"]),
    source_url: findValueByKeys(fm, ["source_url"]),
    is_available: findValueByKeys(fm, ["is_available"]),
    show_on_homepage: findValueByKeys(fm, ["show_on_homepage"]),
    specifications: specs,
    features: Array.isArray(fm.features) ? fm.features : [],
  };
}

async function collectProducts() {
  const rows = [];
  const categories = await fs.readdir(PRODUCTS_DIR, { withFileTypes: true });

  for (const categoryEntry of categories) {
    if (!categoryEntry.isDirectory()) continue;
    const categoryDir = path.join(PRODUCTS_DIR, categoryEntry.name);
    const files = await fs.readdir(categoryDir, { withFileTypes: true });

    for (const fileEntry of files) {
      if (!fileEntry.isFile() || !/\.(md|mdx)$/i.test(fileEntry.name)) continue;
      const filePath = path.join(categoryDir, fileEntry.name);
      const raw = await fs.readFile(filePath, "utf8");
      const fm = parseFrontmatter(raw);
      const slug = path.basename(fileEntry.name, path.extname(fileEntry.name));
      const name = String(fm.name ?? slug).trim();
      const brand = String(fm.brand ?? "").trim();
      const category = String(fm.category ?? categoryEntry.name).trim();
      const price = normalizePrice(findValueByKeys(fm, ["price", "unit_price"]));
      const mainImage = String(fm.main_image ?? "").trim();

      rows.push({
        slug,
        name,
        brand,
        category,
        model: String(fm.model ?? "").trim(),
        description: String(fm.description ?? "").trim(),
        warranty: String(fm.warranty ?? "").trim(),
        price,
        mainImage,
        technical_specs: buildTechnicalSpecs(fm, filePath),
        is_active: Boolean(fm.is_available ?? true),
        sort_order: Number.parseInt(path.basename(fileEntry.name, path.extname(fileEntry.name)).match(/(\d+)(?!.*\d)/)?.[1] ?? "0", 10) || 0,
      });
    }
  }

  return rows;
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const envText = await fs.readFile(envPath, "utf8");
    loadEnvFile(envText);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) throw new Error("Missing Supabase env");

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
  const sourceProducts = await collectProducts();
  const slugs = sourceProducts.map((item) => item.slug);

  const { data: existingRows, error: existingError } = await supabase
    .from("products")
    .select("id, slug, name")
    .in("slug", slugs.length ? slugs : ["__none__"]);
  if (existingError) throw existingError;

  const existingBySlug = new Map((existingRows ?? []).map((row) => [String(row.slug), row]));
  let inserted = 0;
  let updated = 0;

  for (const product of sourceProducts) {
      const payload = {
        slug: product.slug,
        name: product.name,
        category: product.category,
        brand: product.brand || null,
        description: product.description || null,
        warranty: product.warranty || "",
        sale_price_vat: product.price ?? 0,
        cost_price: product.price ?? 0,
      technical_specs: product.technical_specs,
      cover_image_url: product.mainImage || null,
      image_urls: product.mainImage ? [product.mainImage] : [],
      is_active: product.is_active,
      sort_order: product.sort_order,
    };

    const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
    if (error) throw error;

    if (existingBySlug.has(product.slug)) {
      updated += 1;
    } else {
      inserted += 1;
    }
  }

  console.log(JSON.stringify({
    scanned: sourceProducts.length,
    inserted,
    updated,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
