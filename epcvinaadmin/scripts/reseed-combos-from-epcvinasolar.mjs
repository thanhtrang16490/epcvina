import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com";
const SOURCE_ROOT = path.join(ROOT, "epcvinasolar");
const COMBOS_DIR = path.join(SOURCE_ROOT, "src/content/combos");
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

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
  return trimmed;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    data[key] = parseValue(value);
  }
  return data;
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  if (!(buckets ?? []).some((bucket) => bucket.name === BUCKET_NAME)) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true, fileSizeLimit: 20 * 1024 * 1024 });
    if (error) throw error;
  }
}

function comboGroupFromPath(relPath) {
  if (relPath.includes("/on-grid/")) return "on-grid";
  if (relPath.includes("/hybrid/")) return "hybrid";
  return "other";
}

function batteryTypeFromCombo(fm) {
  const title = String(fm.title ?? "").toLowerCase();
  if (title.includes("at") || title.includes("ap thap")) return "LV";
  if (title.includes("ac") || title.includes("ap cao")) return "HV";
  return null;
}

function phaseFromCombo(fm) {
  const phase = String(fm.phase ?? "");
  return phase.includes("3") ? 3 : 1;
}

async function pickProducts() {
  const rows = (await supabase.from("products").select("*")).data ?? [];
  const groups = {
    panel: rows.filter((row) => String(row.category ?? "").toLowerCase().includes("pin") || String(row.name ?? "").toLowerCase().includes("tấm pin")),
    inverter: rows.filter((row) => String(row.category ?? "").toLowerCase().includes("inverter") || String(row.name ?? "").toLowerCase().includes("biến tần")),
    battery: rows.filter((row) => String(row.category ?? "").toLowerCase().includes("pin lưu trữ") || String(row.name ?? "").toLowerCase().includes("pin lưu trữ")),
    mounting: rows.filter((row) => /mount|khung|rail|clip|kẹp/i.test(`${row.category ?? ""} ${row.name ?? ""}`)),
    wiring: rows.filter((row) => /dây|cáp|mc4|solar dc/i.test(`${row.category ?? ""} ${row.name ?? ""}`)),
    cabinet: rows.filter((row) => /tủ điện|cabinet/i.test(`${row.category ?? ""} ${row.name ?? ""}`)),
    grounding: rows.filter((row) => /tiếp địa|ground/i.test(`${row.category ?? ""} ${row.name ?? ""}`)),
  };
  return groups;
}

function panelWatt(product) {
  const text = `${product.name ?? ""} ${product.description ?? ""}`;
  const match = text.match(/(\d+(?:\.\d+)?)\s*w/i);
  return match ? Number(match[1]) : 620;
}

function batteryKwh(product) {
  const text = `${product.name ?? ""} ${product.description ?? ""}`;
  const match = text.match(/(\d+(?:\.\d+)?)\s*kwh/i);
  return match ? Number(match[1]) : 5.12;
}

function firstOrFallback(list, fallback) {
  return list[0] ?? fallback;
}

function calcSuggestedPrice(costPrice, targetMargin = 0.2) {
  return costPrice > 0 ? costPrice / (1 - targetMargin) : 0;
}

function calcGrossMargin(costPrice, referencePrice) {
  return referencePrice > 0 ? ((referencePrice - costPrice) / referencePrice) * 100 : 0;
}

function calcMonthlyProduction(solarKw, psh = 4, pr = 0.8) {
  return solarKw * psh * 30 * pr;
}

function calcMonthlyBenefit(monthlyProduction, selfUseRatio = 0.8, selfUsePrice = 3200, exportPrice = 1700) {
  const selfUse = monthlyProduction * selfUseRatio;
  const exportKwh = Math.max(0, monthlyProduction - selfUse);
  return selfUse * selfUsePrice + exportKwh * exportPrice;
}

async function uploadComboImage(relativeImagePath, comboSlug, comboName, index = 1) {
  const sourceFilePath = path.join(SOURCE_PUBLIC_DIR, relativeImagePath.replace(/^\//, ""));
  const buffer = await fs.readFile(sourceFilePath);
  const ext = path.extname(sourceFilePath) || ".png";
  const base = path.basename(sourceFilePath, ext);
  const storagePath = `combos/${slugify(comboName)}/${slugify(comboSlug)}/${String(index).padStart(2, "0")}-${slugify(base) || "image"}${ext}`;
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, buffer, { upsert: true, contentType: contentTypeFor(sourceFilePath) });
  if (error) throw error;
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  await ensureBucket();
  const comboFiles = await fs.readdir(COMBOS_DIR, { withFileTypes: true });
  const productsByGroup = await pickProducts();
  const existingProjects = (await supabase.from("projects").select("id, slug, name")).data ?? [];
  const projectsBySlug = new Map(existingProjects.map((row) => [String(row.slug), row]));

  const parsedCombos = [];
  for (const folder of comboFiles) {
    if (!folder.isDirectory()) continue;
    const dir = path.join(COMBOS_DIR, folder.name);
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".md")) continue;
      const filePath = path.join(dir, file.name);
      const raw = await fs.readFile(filePath, "utf8");
      const fm = parseFrontmatter(raw);
      parsedCombos.push({
        source_file: path.relative(COMBOS_DIR, filePath),
        title: String(fm.title ?? ""),
        slug: String(fm.slug ?? path.basename(file.name, ".md")),
        system_type: String(fm.system_type ?? folder.name),
        phase: phaseFromCombo(fm),
        voltage: fm.voltage === null ? null : String(fm.voltage ?? ""),
        power_kw: Number(fm.power_kw ?? 0),
        battery_kwh: fm.battery_kwh === null ? null : Number(fm.battery_kwh ?? 0),
        investment_million_vnd: Number(fm.investment_million_vnd ?? 0),
        production_min_kwh: Number(fm.production_min_kwh ?? 0),
        production_max_kwh: Number(fm.production_max_kwh ?? 0),
        payback_years: Number(fm.payback_years ?? 0),
        payback_label: String(fm.payback_label ?? ""),
        roof_area_m2: Number(fm.roof_area_m2 ?? 0),
        is_active: Boolean(fm.is_active ?? true),
        display_order: Number(fm.display_order ?? 0),
        combo_group: comboGroupFromPath(filePath),
        battery_type: batteryTypeFromCombo(fm),
      });
    }
  }

  parsedCombos.sort((a, b) => a.display_order - b.display_order || a.slug.localeCompare(b.slug));

  const reinserted = [];
  for (const combo of parsedCombos) {
    const insert = await supabase.from("combos").insert({
      slug: combo.slug,
      code: combo.slug.toUpperCase(),
      name: combo.title,
      title: combo.title,
      phase: combo.phase,
      phase_text: combo.phase === 3 ? "3 pha" : "1 pha",
      system_type: combo.system_type,
      voltage: combo.voltage,
      power_kw: combo.power_kw,
      solar_kw: combo.power_kw,
      battery_kwh: combo.battery_kwh,
      battery_type: combo.battery_type,
      investment_million_vnd: combo.investment_million_vnd,
      production_min_kwh: combo.production_min_kwh,
      production_max_kwh: combo.production_max_kwh,
      payback_years: combo.payback_years || Number((((Number(combo.investment_million_vnd ?? 0) * 1_000_000)) / (calcMonthlyBenefit(calcMonthlyProduction(combo.power_kw)) * 12)).toFixed(2)),
      payback_label: combo.payback_label,
      roof_area_m2: combo.roof_area_m2,
      combo_group: combo.combo_group,
      source_file: combo.source_file,
      source_kind: "epcvinasolar",
      status: combo.is_active ? "public" : "archive",
      is_active: combo.is_active,
      sort_order: combo.display_order,
      margin: 20,
      target_min_price: Number(combo.investment_million_vnd ?? 0) * 0.8,
      reference_price: Number(combo.investment_million_vnd ?? 0),
      description: combo.title,
      cover_image_url: null,
      image_urls: [],
      highlights: [],
    }).select("*").single();
    if (insert.error) throw insert.error;
    reinserted.push(insert.data);
  }

  const rowsBySlug = new Map(reinserted.map((row) => [String(row.slug), row]));
  const comboItems = [];
  for (const combo of parsedCombos) {
    const row = rowsBySlug.get(combo.slug);
    if (!row) continue;
    const panels = productsByGroup.panel;
    const inverters = productsByGroup.inverter;
    const batteries = productsByGroup.battery;
    const mounting = productsByGroup.mounting;
    const wiring = productsByGroup.wiring;
    const cabinet = productsByGroup.cabinet;
    const grounding = productsByGroup.grounding;
    const panel = firstOrFallback(panels, null);
    const inverter = firstOrFallback(inverters, null);
    const battery = combo.battery_kwh ? firstOrFallback(batteries, null) : null;

    const panelQty = panel ? Math.max(1, Math.ceil((combo.power_kw * 1000) / panelWatt(panel))) : 0;
    if (panel) comboItems.push({
      combo_id: row.id,
      product_id: panel.id,
      item_name: panel.name,
      category: panel.category,
      brand: panel.brand,
      unit: panel.unit,
      quantity: panelQty,
      unit_price_vat: Number(panel.salePriceVat ?? panel.sale_price_vat ?? 0),
      total_price_vat: Number(panel.salePriceVat ?? panel.sale_price_vat ?? 0) * panelQty,
      cost_price: Number(panel.costPrice ?? panel.cost_price ?? 0),
      total_cost_price: Number(panel.costPrice ?? panel.cost_price ?? 0) * panelQty,
      warranty: panel.warranty,
      notes: "panel",
      sort_order: 10,
    });
    if (inverter) comboItems.push({
      combo_id: row.id,
      product_id: inverter.id,
      item_name: inverter.name,
      category: inverter.category,
      brand: inverter.brand,
      unit: inverter.unit,
      quantity: 1,
      unit_price_vat: Number(inverter.salePriceVat ?? inverter.sale_price_vat ?? 0),
      total_price_vat: Number(inverter.salePriceVat ?? inverter.sale_price_vat ?? 0),
      cost_price: Number(inverter.costPrice ?? inverter.cost_price ?? 0),
      total_cost_price: Number(inverter.costPrice ?? inverter.cost_price ?? 0),
      warranty: inverter.warranty,
      notes: "inverter",
      sort_order: 20,
    });
    if (battery) comboItems.push({
      combo_id: row.id,
      product_id: battery.id,
      item_name: battery.name,
      category: battery.category,
      brand: battery.brand,
      unit: battery.unit,
      quantity: Math.max(1, Math.ceil((combo.battery_kwh ?? 0) / batteryKwh(battery))),
      unit_price_vat: Number(battery.salePriceVat ?? battery.sale_price_vat ?? 0),
      total_price_vat: Number(battery.salePriceVat ?? battery.sale_price_vat ?? 0),
      cost_price: Number(battery.costPrice ?? battery.cost_price ?? 0),
      total_cost_price: Number(battery.costPrice ?? battery.cost_price ?? 0),
      warranty: battery.warranty,
      notes: "battery",
      sort_order: 30,
    });
    for (const [idx, item] of [mounting[0], wiring[0], cabinet[0], grounding[0]].filter(Boolean).entries()) {
      comboItems.push({
        combo_id: row.id,
        product_id: item.id,
        item_name: item.name,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        quantity: 1,
        unit_price_vat: Number(item.salePriceVat ?? item.sale_price_vat ?? 0),
        total_price_vat: Number(item.salePriceVat ?? item.sale_price_vat ?? 0),
        cost_price: Number(item.costPrice ?? item.cost_price ?? 0),
        total_cost_price: Number(item.costPrice ?? item.cost_price ?? 0),
        warranty: item.warranty,
        notes: "accessory",
        sort_order: 40 + idx * 10,
      });
    }
  }

  if (comboItems.length) {
    const { error } = await supabase.from("combo_items").insert(comboItems);
    if (error) throw error;
  }

  const projectRows = (await supabase.from("projects").select("id, slug, name, note")).data ?? [];
  const projectUpdates = [];
  for (const project of projectRows) {
    const matchedCombo = reinserted.find((combo) => {
      const projectText = `${project.name ?? ""} ${project.slug ?? ""}`.toLowerCase();
      const comboKey = String(combo.slug ?? "").split("-").slice(0, 3).join("-");
      return projectText.includes(comboKey) || projectText.includes(String(combo.slug ?? "").toLowerCase());
    });
    if (matchedCombo) {
      projectUpdates.push(supabase.from("projects").update({ source_url: matchedCombo.slug }).eq("id", project.id));
    }
  }
  await Promise.all(projectUpdates);

  console.log(`Rebuilt ${reinserted.length} combos and ${comboItems.length} combo items.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
