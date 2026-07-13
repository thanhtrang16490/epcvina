import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com";
const SOURCE_ROOT = path.join(ROOT, "epcvinasolar");
const PRODUCTS_DIR = path.join(SOURCE_ROOT, "src/content/products");
const SOURCE_PUBLIC_DIR = path.join(SOURCE_ROOT, "public");
const BUCKET_NAME = "catalog-media";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    data[key] = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  return data;
}

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = (buckets ?? []).some((bucket) => bucket.name === BUCKET_NAME);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024,
    });
    if (error) throw error;
    console.log(`Created bucket ${BUCKET_NAME}`);
    return;
  }

  const { error } = await supabase.storage.updateBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 20 * 1024 * 1024,
  });
  if (error) throw error;
  console.log(`Updated bucket ${BUCKET_NAME}`);
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
      const mainImage = String(fm.main_image ?? "").trim();
      rows.push({
        slug,
        name: String(fm.name ?? slug),
        category: String(fm.category ?? categoryEntry.name),
        mainImage,
      });
    }
  }

  return rows;
}

async function uploadSourceImage(relativeImagePath, uploadCategory, productSlug, productName) {
  const sourceFilePath = path.join(SOURCE_PUBLIC_DIR, relativeImagePath.replace(/^\//, ""));
  const fileBuffer = await fs.readFile(sourceFilePath);
  const fileExt = path.extname(sourceFilePath) || ".png";
  const fileBase = path.basename(sourceFilePath, fileExt);
  const safeCategory = slugify(uploadCategory || "uncategorized");
  const safeTitle = slugify(productSlug || productName || fileBase);
  const safeName = slugify(fileBase) || "image";
  const storagePath = `products/${safeCategory}/${safeTitle}/01-${safeName}${fileExt}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: contentTypeFor(sourceFilePath),
  });
  if (uploadError) throw uploadError;

  return supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  await ensureBucket();

  const products = await collectProducts();
  const { data: dbProducts, error: queryError } = await supabase.from("products").select("id, slug, name, cover_image_url, image_urls, category");
  if (queryError) throw queryError;

  const dbBySlug = new Map((dbProducts ?? []).map((row) => [String(row.slug), row]));
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    if (!product.mainImage) {
      skipped += 1;
      continue;
    }

    const dbRow = dbBySlug.get(product.slug) || dbBySlug.get(slugify(product.name));
    if (!dbRow) {
      skipped += 1;
      continue;
    }

    let publicUrl;
    try {
      publicUrl = await uploadSourceImage(product.mainImage, product.category, dbRow.slug, dbRow.name);
    } catch (error) {
      if (error?.code === "ENOENT") {
        skipped += 1;
        console.log(`Missing source image for ${dbRow.slug}: ${product.mainImage}`);
        continue;
      }
      throw error;
    }
    const existingImages = Array.isArray(dbRow.image_urls) ? dbRow.image_urls.map(String) : [];
    const imageUrls = Array.from(new Set([publicUrl, ...existingImages]));

    const { error: updateError } = await supabase
      .from("products")
      .update({
        cover_image_url: publicUrl,
        image_urls: imageUrls,
      })
      .eq("id", dbRow.id);

    if (updateError) throw updateError;
    updated += 1;
    console.log(`Updated ${dbRow.slug} -> ${publicUrl}`);
  }

  console.log(`Done. Updated ${updated} products, skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
