import fs from "node:fs/promises";
import path from "node:path";
import xlsx from "xlsx";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const WORKBOOK_PATH = path.join(ROOT, "data", "COMBO GIÁ BÁN WEB 7.2026.xlsx");
const OUTPUT_PATH = "/tmp/combos_workbook.json";

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function roundToThousand(value) {
  return Math.round(Number(value ?? 0) / 1000) * 1000;
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
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

function inferSheetGroup(category, specification) {
  const text = normalize(`${category} ${specification}`);
  if (text.includes("tiep dia") || text.includes("ground")) return "grounding";
  if (text.includes("nhan cong") || text.includes("thi cong")) return "labor";
  if (text.includes("pin luu tru") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tam pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("bien tan")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount") || text.includes("kep")) return "mounting";
  if (text.includes("day") || text.includes("cap") || text.includes("mc4") || text.includes("wire")) return "wiring";
  if (text.includes("tu dien") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  return "wiring";
}

function calcRowTotalPreVat(raw, quantity, totalPriceVat) {
  const explicitTotal = Number(raw[12] ?? 0) || 0;
  if (explicitTotal > 0) return explicitTotal;
  const unitPreVat = Number(raw[11] ?? 0) || 0;
  if (unitPreVat > 0) return unitPreVat * Math.max(1, Number(quantity ?? 0) || 1);
  const vatFactor = Number(raw[10] ?? 0) || 1.1;
  if (vatFactor > 0) return Number(totalPriceVat ?? 0) / vatFactor;
  return Number(totalPriceVat ?? 0);
}

function getSheetM25(sheet) {
  const cell = sheet?.M25;
  const value = Number(cell?.v ?? 0) || 0;
  return value > 0 ? value : null;
}

function inferComboMeta(sheetName, rows, sheet) {
  const name = String(sheetName ?? "").trim();
  const code = name;
  const phase = /3p|3pha|3 pha/i.test(name) ? 3 : 1;
  const isHybrid = /^hy/i.test(name) || rows.some((row) => normalize(`${row.category} ${row.specification}`).includes("pin luu tru"));
  const batteryRow = rows.find((row) => inferSheetGroup(row.category, row.specification) === "battery");
  const batteryKwh = batteryRow ? Number(String(batteryRow.specification).match(/(\d+(?:\.\d+)?)\s*kwh/i)?.[1] ?? 0) || 16 : 0;
  const batteryType = /hv/i.test(name) ? "HV" : batteryKwh > 0 ? "LV" : null;
  const panelRow = rows.find((row) => inferSheetGroup(row.category, row.specification) === "panel");
  const solarKw = Number(String(name).match(/(\d+(?:\.\d+)?)\s*kw/i)?.[1] ?? 0) || Number(String(panelRow?.specification ?? "").match(/(\d+(?:\.\d+)?)\s*wp/i)?.[1] ?? 0) / 1000 || 0;
  const totalPreVat = rows.reduce((sum, row) => sum + Number(row.total_price_pre_vat ?? 0), 0);
  const m25 = getSheetM25(sheet);
  const roundedTotalPreVat = roundToThousand(m25 ?? totalPreVat);

  return {
    code,
    name,
    slug: slugify(name),
    phase,
    solar_kw: solarKw,
    battery_kwh: batteryKwh || null,
    battery_type: batteryType,
    cost_price: 0,
    target_min_price: roundedTotalPreVat,
    reference_price: roundedTotalPreVat,
    margin: 0,
    description: "",
    sort_order: 0,
    is_active: true,
    status: "active",
    combo_type: isHybrid ? "standard" : "standard",
    source_kind: "workbook_2026",
    sheet: name,
  };
}

function parseSheet(sheetName, sheet) {
  const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const rows = [];
  let lastCategory = "";
  for (const raw of matrix.slice(1)) {
    const cell0 = cleanText(raw[0]);
    const isTotalRow = /^tổng cộng/i.test(cell0);
    if (isTotalRow) break;
    const category = cleanText(raw[1]) || lastCategory;
    const specification = cleanText(raw[2]);
    if (!category && !specification) continue;
    if (cleanText(raw[1])) lastCategory = cleanText(raw[1]);

    const quantity = Number(raw[5] ?? 0) || 0;
    const unitPriceVat = Number(raw[6] ?? 0) || 0;
    const totalPriceVat = Number(raw[7] ?? 0) || unitPriceVat * quantity;
    const totalPricePreVat = calcRowTotalPreVat(raw, quantity, totalPriceVat);
    const costPrice = 0;
    const totalCostPrice = 0;
    const brand = cleanText(raw[3]);
    const unit = cleanText(raw[4]);
    const warranty = cleanText(raw[8]);
    const notes = raw[9] !== "" ? cleanText(raw[9]) : "";

    rows.push({
      no: rows.length + 1,
      category,
      specification,
      brand,
      unit,
      quantity: quantity || 1,
      unit_price_vat: unitPriceVat,
      total_price_vat: totalPriceVat,
      cost_price: costPrice,
      total_cost_price: totalCostPrice,
      total_price_pre_vat: totalPricePreVat,
      warranty,
      notes,
      sheet_group: inferSheetGroup(category, specification),
    });
  }
  return rows;
}

async function main() {
  const workbook = xlsx.readFile(WORKBOOK_PATH, { cellStyles: true });
  const combos = workbook.SheetNames.map((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = parseSheet(sheetName, sheet);
    const meta = inferComboMeta(sheetName, rows, sheet);
    return {
      ...meta,
      sort_order: index + 1,
      rows: rows.map((row) => ({
        category: row.category,
        specification: row.specification,
        brand: row.brand,
        unit: row.unit,
        quantity: row.quantity,
        unit_price_vat: row.unit_price_vat,
        total_price_vat: row.total_price_vat,
        cost_price: row.cost_price,
        total_cost_price: row.total_cost_price,
        warranty: row.warranty,
        notes: row.notes,
        sheet_group: row.sheet_group,
      })),
    };
  });

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(combos, null, 2), "utf8");
  console.log(JSON.stringify({ workbook: WORKBOOK_PATH, output: OUTPUT_PATH, combos: combos.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
