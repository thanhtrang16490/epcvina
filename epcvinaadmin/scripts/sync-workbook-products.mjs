import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const WORKBOOK_JSON = "/tmp/combos_workbook_costs.json";
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

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function shortName(spec, category) {
  const firstLine = cleanText(spec).split(" ").slice(0, 8).join(" ");
  return `${category} - ${firstLine}`.slice(0, 160);
}

function technicalSpecs(item, sheet) {
  return {
    source_sheet: sheet,
    workbook_category: item.category,
    workbook_brand: item.brand,
    workbook_unit: item.unit,
    workbook_quantity: item.quantity,
    workbook_unit_price_vat: item.unit_price_vat,
    workbook_total_price_vat: item.total_price_vat,
    workbook_cost_price: item.cost_price,
    workbook_total_cost_price: item.total_cost_price,
    workbook_specification: item.specification,
  };
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
  const raw = JSON.parse(await fs.readFile(WORKBOOK_JSON, "utf8"));

  const existing = await supabase
    .from("products")
    .select("id, slug, name, category, brand, sale_price_vat, cost_price, technical_specs");
  if (existing.error) throw existing.error;
  const bySlug = new Map((existing.data ?? []).map((row) => [String(row.slug), row]));

  let touched = 0;
  for (const combo of raw) {
    for (const item of combo.rows) {
      const name = shortName(item.specification, item.category);
      const slug = slugify(`${item.category} ${item.brand} ${item.specification}`.slice(0, 120));
      const payload = {
        slug,
        name,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        quantity: item.quantity,
        sale_price_vat: Number(item.unit_price_vat ?? 0),
        cost_price: Number(item.cost_price ?? 0),
        warranty: "",
        description: item.specification,
        technical_specs: technicalSpecs(item, combo.sheet),
        is_active: true,
      };
      const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
      if (error) throw error;
      touched += 1;
      bySlug.set(slug, payload);
    }
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, slug, name, category, brand");
  if (productsError) throw productsError;
  const productIndex = new Map((products ?? []).map((row) => [String(row.slug), row]));

  const comboItems = await supabase
    .from("combo_items")
    .select("id, item_name, category, brand");
  if (comboItems.error) throw comboItems.error;

  let linked = 0;
  for (const row of comboItems.data ?? []) {
    const slug = slugify(`${row.category ?? ""} ${row.brand ?? ""} ${row.item_name ?? ""}`.slice(0, 120));
    const fallbackSlug = slugify(`${row.category ?? ""} ${row.item_name ?? ""}`.slice(0, 120));
    const product = productIndex.get(slug) || productIndex.get(fallbackSlug);
    const { error } = await supabase.from("combo_items").update({
      product_id: product?.id ?? null,
    }).eq("id", row.id);
    if (error) throw error;
    linked += 1;
  }

  console.log(JSON.stringify({ touched, linked }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
