import fs from "node:fs/promises";
import path from "node:path";
import xlsx from "xlsx";
import { createClient } from "@supabase/supabase-js";

const ROOT = "/Users/thanhtrang/Documents/epcvina.com/epcvinaadmin";
const WORKBOOK_PATH = path.join(ROOT, "data", "COMBO GIÁ BÁN WEB 7.2026.xlsx");
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

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function roundToThousand(value) {
  return Math.round(Number(value ?? 0) / 1000) * 1000;
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

function getSheetTotals(sheet) {
  const matrix = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  let lineTotal = 0;
  let lineCost = 0;
  for (const raw of matrix.slice(1)) {
    const cell0 = cleanText(raw[0]);
    if (/^tổng cộng/i.test(cell0)) break;
    const qty = Number(raw[5] ?? 0) || 0;
    const unitPriceVat = Number(raw[6] ?? 0) || 0;
    const totalPriceVat = Number(raw[7] ?? 0) || unitPriceVat * qty;
    const totalPreVat = calcRowTotalPreVat(raw, qty, totalPriceVat);
    const totalCost = Number(raw[13] ?? 0) || 0;
    lineTotal += totalPreVat;
    lineCost += totalCost;
  }
  const m25 = Number(sheet?.M25?.v ?? 0) || 0;
  return {
    m25: m25 > 0 ? m25 : null,
    m25Rounded: m25 > 0 ? roundToThousand(m25) : null,
    lineTotal,
    lineTotalRounded: roundToThousand(lineTotal),
    lineCost,
    lineCostRounded: roundToThousand(lineCost),
  };
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const envText = await fs.readFile(envPath, "utf8");
    loadEnvFile(envText);
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const wb = xlsx.readFile(WORKBOOK_PATH, { cellStyles: true });
  const { data: combos, error } = await supabase.from("combos").select("code, reference_price, target_min_price, cost_price").order("sort_order", { ascending: true });
  if (error) throw error;
  const byCode = new Map((combos ?? []).map((combo) => [combo.code, combo]));

  const report = wb.SheetNames.map((sheetName) => {
    const sheet = wb.Sheets[sheetName];
    const totals = getSheetTotals(sheet);
    const combo = byCode.get(sheetName) ?? null;
    return {
      sheet: sheetName,
      m25: totals.m25,
      m25Rounded: totals.m25Rounded,
      lineTotalRounded: totals.lineTotalRounded,
      lineCostRounded: totals.lineCostRounded,
      dbReference: combo ? Number(combo.reference_price ?? 0) : null,
      dbTarget: combo ? Number(combo.target_min_price ?? 0) : null,
      dbCost: combo ? Number(combo.cost_price ?? 0) : null,
      diffRefVsM25: combo && totals.m25Rounded != null ? Number(combo.reference_price ?? 0) - totals.m25Rounded : null,
      diffTargetVsM25: combo && totals.m25Rounded != null ? Number(combo.target_min_price ?? 0) - totals.m25Rounded : null,
      diffCostVsLine: combo ? Number(combo.cost_price ?? 0) - totals.lineCostRounded : null,
    };
  });

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
