import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com";
const SOURCE_ROOT = path.join(ROOT, "epcvinasolar");
const SOURCE_PUBLIC_DIR = path.join(SOURCE_ROOT, "public");
const FALLBACK_IMAGE = path.join(SOURCE_PUBLIC_DIR, "sample-combo.jpg");
const BUCKET_NAME = "catalog-media";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function loadEnvIfNeeded() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const envPath = path.join(ROOT, "epcvinaadmin", ".env.local");
  const text = await fs.readFile(envPath, "utf8");
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

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

async function ensureBucket(supabase) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if (!(buckets ?? []).some((bucket) => bucket.name === BUCKET_NAME)) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true, fileSizeLimit: 20 * 1024 * 1024 });
    if (error) throw error;
  }
}

async function uploadFallbackImage(supabase) {
  const buffer = await fs.readFile(FALLBACK_IMAGE);
  const storagePath = "combos/fallback/sample-combo.jpg";
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
    upsert: true,
    contentType: contentTypeFor(FALLBACK_IMAGE),
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  await loadEnvIfNeeded();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
  await ensureBucket(supabase);
  const fallbackUrl = await uploadFallbackImage(supabase);
  const [combosRes, comboItemsRes, productsRes] = await Promise.all([
    supabase.from("combos").select("id, slug, name, system_type, battery_kwh, cover_image_url, image_urls"),
    supabase.from("combo_items").select("combo_id, product_id, sort_order, product:products(id, cover_image_url, image_urls, name)"),
    supabase.from("products").select("id, cover_image_url, image_urls, name"),
  ]);

  if (combosRes.error) throw combosRes.error;
  if (comboItemsRes.error) throw comboItemsRes.error;
  if (productsRes.error) throw productsRes.error;

  const productMap = new Map((productsRes.data ?? []).map((row) => [String(row.id), row]));
  const itemsByCombo = new Map();
  for (const item of comboItemsRes.data ?? []) {
    const comboId = String(item.combo_id);
    const list = itemsByCombo.get(comboId) ?? [];
    list.push({
      sort_order: Number(item.sort_order ?? 0),
      product: item.product_id ? productMap.get(String(item.product_id)) ?? item.product : item.product,
    });
    itemsByCombo.set(comboId, list);
  }

  let updated = 0;
  for (const combo of combosRes.data ?? []) {
    const items = (itemsByCombo.get(String(combo.id)) ?? []).sort((a, b) => a.sort_order - b.sort_order);
    const imageUrls = [];
    for (const item of items) {
      const image = item.product?.cover_image_url || item.product?.image_urls?.[0];
      if (image && !imageUrls.includes(image)) imageUrls.push(image);
      if (imageUrls.length >= 6) break;
    }
    const cover = imageUrls[0] || combo.cover_image_url || fallbackUrl;
    const merged = Array.from(new Set([cover, ...imageUrls, ...(combo.image_urls ?? []).map(String).filter(Boolean)]));

    const { error } = await supabase.from("combos").update({
      cover_image_url: cover,
      image_urls: merged,
      source_kind: "epcvinasolar",
      source_file: combo.source_file ?? null,
    }).eq("id", combo.id);
    if (error) throw error;
    updated += 1;
  }

  console.log(`Done. Updated ${updated} combos with images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
