import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const WORKBOOK_JSON = path.join("/tmp", "combos_workbook.json");
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

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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

function matchProductId(product, category, specification) {
  const text = normalize(`${category} ${specification}`);
  const name = normalize(`${product.name ?? ""} ${product.category ?? ""} ${product.brand ?? ""}`);
  if (/pin|panel|tam pin/.test(text)) return /pin|panel|tam pin/.test(name);
  if (/inverter|bien tan|metter|meter/.test(text)) return /inverter|bien tan|metter|meter/.test(name);
  if (/pin luu tru|battery|lithium/.test(text)) return /pin luu tru|battery|lithium/.test(name);
  if (/day|cap|mc4|wire/.test(text)) return /day|cap|mc4|wire/.test(name);
  if (/khung|rail|kep|mount/.test(text)) return /khung|rail|kep|mount/.test(name);
  if (/tu dien|cabinet/.test(text)) return /tu dien|cabinet/.test(name);
  if (/tiep dia|ground/.test(text)) return /tiep dia|ground/.test(name);
  return false;
}

function isServiceItem(category, specification) {
  const text = normalize(`${category} ${specification}`);
  return text.includes("nhan cong lap dat") || normalize(category).includes("nhan cong lap dat");
}

function sheetGroupForItem(category, specification) {
  const text = normalize(`${category} ${specification}`);
  if (text.includes("nhan cong") || text.includes("thi cong")) return "labor";
  if (text.includes("pin luu tru") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tam pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("bien tan")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "mounting";
  if (text.includes("day") || text.includes("cap") || text.includes("mc4")) return "wiring";
  if (text.includes("tu dien") || text.includes("cabinet")) return "cabinet";
  if (text.includes("tiep dia") || text.includes("ground")) return "grounding";
  return "wiring";
}

function normalizeSheetGroup(row, previousGroup) {
  const explicit = normalize(row.sheet_group);
  if (explicit) return explicit;

  const category = normalize(row.category);
  const specification = normalize(row.specification);
  const text = `${category} ${specification}`.trim();
  if (!text) return previousGroup || "wiring";

  if (text.includes("nhan cong") || text.includes("thi cong")) return "labor";
  if (text.includes("pin luu tru") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tam pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("bien tan")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount") || text.includes("kep")) return "mounting";
  if (text.includes("day") || text.includes("cap") || text.includes("mc4") || text.includes("wire")) return "wiring";
  if (text.includes("tu dien") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  if (text.includes("tiep dia") || text.includes("ground")) return "grounding";
  return previousGroup || "wiring";
}

function serviceItemRow(sheet) {
  return sheet.rows.find((row) => isServiceItem(row.category, row.specification)) ?? null;
}

function laborRatePerKwp(combo) {
  const code = String(combo.code ?? "").toUpperCase();
  const comboType = String(combo.combo_type ?? "").toLowerCase();
  return code.startsWith("HY") || comboType === "custom" ? 900000 : 500000;
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

  const { data: products, error: productsError } = await supabase.from("products").select("id,name,category,brand,slug");
  if (productsError) throw productsError;
  const insertedCombos = [];
  for (const rec of raw) {
    const insertPayload = {
      code: rec.code,
      name: rec.name,
      slug: slugify(rec.slug),
      phase: rec.phase,
      solar_kw: rec.solar_kw,
      battery_kwh: rec.battery_kwh,
      battery_type: rec.battery_type,
      cost_price: rec.cost_price,
      target_min_price: rec.target_min_price,
      reference_price: rec.reference_price,
      margin: 0,
      description: rec.description,
      highlights: [],
      sort_order: rec.sort_order,
      is_active: rec.is_active,
      status: rec.status,
      combo_type: rec.combo_type,
      source_kind: rec.source_kind,
      title: rec.name,
      phase_text: rec.phase === 3 ? "3 pha" : "1 pha",
      system_type: rec.phase === 3 ? "3 pha" : "1 pha",
      voltage: rec.battery_type ? rec.battery_type : null,
      power_kw: rec.solar_kw,
      investment_million_vnd: Number(rec.reference_price ?? 0) / 1_000_000,
      production_min_kwh: 0,
      production_max_kwh: 0,
      payback_years: 0,
      payback_label: "",
      roof_area_m2: 0,
      combo_group: rec.code.startsWith("HY") ? "hybrid" : "on-grid",
      source_file: rec.sheet,
      cover_image_url: null,
      image_urls: [],
    };
    const { data, error } = await supabase.from("combos").upsert(insertPayload, { onConflict: "code" }).select("*").single();
    if (error) throw error;
    insertedCombos.push({ row: data, source: rec });
  }

  const comboIds = insertedCombos.map(({ row }) => row.id).filter(Boolean);
  if (comboIds.length) {
    const { error: deleteItemsError } = await supabase.from("combo_items").delete().in("combo_id", comboIds);
    if (deleteItemsError) throw deleteItemsError;
  }

  const comboItems = [];
  for (const { row, source } of insertedCombos) {
    const maxSortOrder = Math.max(0, ...source.rows.map((item, index) => Number(item.sort_order ?? index + 1) || index + 1));
    let lastSheetGroup = null;
    for (const [index, item] of source.rows.entries()) {
      const isService = isServiceItem(item.category, item.specification);
      const product = isService ? null : (products ?? []).find((candidate) => matchProductId(candidate, item.category, item.specification));
      const unitPrice = Number(item.unit_price_vat ?? 0);
      const totalPrice = Number(item.total_price_vat ?? unitPrice * Number(item.quantity ?? 0));
      const costPrice = Number(item.cost_price ?? 0);
      const totalCost = Number(item.total_cost_price ?? costPrice * Number(item.quantity ?? 0));
      comboItems.push({
        combo_id: row.id,
        product_id: isService ? null : product?.id ?? null,
        source_sheet: source.sheet,
        item_name: item.specification || item.category || "Item",
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        quantity: Number(item.quantity ?? 0),
        unit_price_vat: unitPrice,
        total_price_vat: totalPrice,
        cost_price: costPrice,
        total_cost_price: totalCost,
        warranty: String(item.warranty ?? ""),
        notes: String(item.notes ?? ""),
        gross_margin: Number(item.gross_margin ?? 0),
        sheet_group: normalizeSheetGroup(item, lastSheetGroup) || sheetGroupForItem(item.category, item.specification),
        sort_order: index + 1,
      });
      lastSheetGroup = comboItems[comboItems.length - 1].sheet_group;
    }

    const laborCost = Math.round(Number(source.solar_kw ?? 0) * laborRatePerKwp(source));
    if (laborCost > 0 && !source.rows.some((item) => isServiceItem(item.category, item.specification))) {
      comboItems.push({
        combo_id: row.id,
        product_id: null,
        source_sheet: source.sheet,
        item_name: "Phí nhân công lắp đặt",
        category: "PHÍ NHÂN CÔNG LẮP ĐẶT",
        brand: "EPCVINA",
        unit: "Gói",
        quantity: 1,
        unit_price_vat: laborCost,
        total_price_vat: laborCost,
        cost_price: laborCost,
        total_cost_price: laborCost,
        warranty: "",
        notes: "Backfill labor rule",
        gross_margin: 0,
        sheet_group: "labor",
        sort_order: maxSortOrder + 1000,
      });
    }
  }

  for (let i = 0; i < comboItems.length; i += 100) {
    const batch = comboItems.slice(i, i + 100);
    const { error } = await supabase.from("combo_items").insert(batch);
    if (error) throw error;
  }

  console.log(JSON.stringify({ insertedCombos: insertedCombos.length, comboItems: comboItems.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
