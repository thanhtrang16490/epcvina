import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getLaborCostByKw } from "@/lib/combo-labor";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo, normalizeComboItem } from "@/lib/supabase/normalize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toNumber(value: unknown) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function asPercent(value: number) {
  return value / 100;
}

type RefProduct = {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  cost_price: number;
  sale_price_vat: number;
  warranty: string;
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable" }, { status: 500 });
  }

  const combo = normalizeCombo(
    (await supabase
      .from("combos")
      .select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls")
      .eq("id", id)
      .single()).data ?? {},
  );
  const items = ((await supabase.from("combo_items").select("id, combo_id, product_id, category, item_name, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, notes, sheet_group, reference_product_id").eq("combo_id", id).order("sort_order", { ascending: true })).data ?? []).map(normalizeComboItem);
  const products = ((await supabase.from("products").select("id, slug, name, category, brand, unit, cost_price, sale_price_vat, warranty, cover_image_url, image_urls, is_active, sort_order").order("sort_order", { ascending: true })).data ?? []).map((product: any) => ({
    id: String(product.id),
    name: String(product.name ?? ""),
    category: String(product.category ?? ""),
    brand: String(product.brand ?? ""),
    unit: String(product.unit ?? ""),
    cost_price: Number(product.cost_price ?? 0),
    sale_price_vat: Number(product.sale_price_vat ?? 0),
    warranty: String(product.warranty ?? ""),
  }));
  const productsById = new Map<string, RefProduct>(products.map((product) => [product.id, product]));
  const pricingSettings = await getPricingSettings(supabase);
  const laborCost = getLaborCostByKw(
    {
      solar_kw: Number(combo.solar_kw ?? 0),
      battery_kwh: Number(combo.battery_kwh ?? 0) || null,
      code: combo.code,
      combo_type: combo.combo_type ?? "standard",
    },
    pricingSettings,
  );
  const hasLabor = items.some((item) => String(item.sheet_group ?? "") === "labor");
  const exportItems = hasLabor || laborCost <= 0
    ? items
    : [
        ...items,
        {
          id: "labor",
          combo_id: combo.id,
          product_id: null,
          reference_product_id: null,
          item_name: "Phí nhân công lắp đặt",
          category: "PHÍ NHÂN CÔNG LẮP ĐẶT",
          brand: "EPCVINA",
          unit: "Gói",
          quantity: 1,
          unit_price_vat: laborCost,
          total_price_vat: laborCost,
          cost_price: laborCost,
          total_cost_price: laborCost,
          sheet_group: "labor",
          gross_margin: 0,
          warranty: "",
          notes: "Tính theo rule pricing settings",
          sort_order: 9999,
        },
      ];
  const resolvedItems = exportItems.map((item: any) => {
    const ref = item.reference_product_id ? productsById.get(String(item.reference_product_id)) : undefined;
    return {
      ...item,
      category: ref?.category || item.category || "",
      item_name: ref?.name || item.item_name || "",
      brand: ref?.brand || item.brand || "",
      unit: ref?.unit || item.unit || "",
      unit_price_vat: Number(ref?.sale_price_vat ?? 0) > 0 ? Number(ref?.sale_price_vat ?? 0) : Number(item.unit_price_vat ?? 0),
      cost_price: Number(ref?.cost_price ?? 0) > 0 ? Number(ref?.cost_price ?? 0) : Number(item.cost_price ?? 0),
      warranty: ref?.warranty || item.warranty || "",
    };
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EPCVINA Admin";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const sheet = workbook.addWorksheet("Total", {
    views: [{ state: "frozen", ySplit: 2 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  const headers = [
    "No.",
    "Category",
    "Specification",
    "Brand Name",
    "Unit",
    "Quatity",
    "Unit Price\n(Including VAT)",
    "Total Price\n(Including VAT)",
    "Warranty",
    "",
    "COST\n(excluding VAT)",
    "TOTAL COST\n(excluding VAT)",
    "Gross Margin for Small EPC",
    "Unit Price\n(excluding VAT)",
    "Total Price\n(excluding VAT)",
    "Unit Price - checked\n(Including VAT)",
  ];

  sheet.mergeCells("A1:P1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = "COST AND PRICE FOR RESIDENTIAL SOLAR ROOFTOP IN VIET NAM - DECEMBER 2024";
  titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  sheet.getRow(1).height = 28;

  sheet.mergeCells("A2:P2");
  const subtitleCell = sheet.getCell("A2");
  subtitleCell.value = `Combo: ${combo.code || combo.name || combo.id}`;
  subtitleCell.font = { italic: true, size: 11, color: { argb: "FF475569" } };
  subtitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
  subtitleCell.alignment = { horizontal: "left", vertical: "middle" };
  sheet.getRow(2).height = 22;

  const headerRow = sheet.getRow(3);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: "FF0F172A" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  });
  headerRow.height = 34;

  const startRow = 4;
  resolvedItems.forEach((item, index) => {
    const rowNumber = startRow + index;
    const quantity = toNumber(item.quantity);
    const unitPrice = toNumber(item.unit_price_vat);
    const totalPrice = toNumber(item.total_price_vat) || unitPrice * quantity;
    const costPrice = toNumber(item.cost_price);
    const totalCost = toNumber(item.total_cost_price) || costPrice * quantity;
    const grossMarginPct = toNumber(item.gross_margin) || (totalPrice > 0 ? ((totalPrice - totalCost) / totalPrice) * 100 : 0);
    const grossMargin = grossMarginPct / 100;
    const checkedUnitPrice = costPrice > 0 && grossMargin < 1 ? costPrice / (1 - grossMargin) : 0;
    const checkedTotalPrice = checkedUnitPrice * quantity;
    const checkedVatPrice = checkedUnitPrice * 1.1;

    const isLabor = String(item.sheet_group ?? "") === "labor";
    const row = sheet.getRow(rowNumber);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.category;
    row.getCell(3).value = item.item_name;
    row.getCell(4).value = item.brand;
    row.getCell(5).value = item.unit;
    row.getCell(6).value = quantity;
    row.getCell(7).value = unitPrice;
    row.getCell(8).value = { formula: `F${rowNumber}*G${rowNumber}`, result: totalPrice };
    row.getCell(9).value = item.warranty;
    row.getCell(10).value = "";
    row.getCell(11).value = costPrice;
    row.getCell(12).value = { formula: `F${rowNumber}*K${rowNumber}`, result: totalCost };
    row.getCell(13).value = asPercent(grossMarginPct);
    row.getCell(14).value = {
      formula: `IF(M${rowNumber}>=1,0,K${rowNumber}/(1-M${rowNumber}))`,
      result: checkedUnitPrice,
    };
    row.getCell(15).value = {
      formula: `N${rowNumber}*F${rowNumber}`,
      result: checkedTotalPrice,
    };
    row.getCell(16).value = {
      formula: `N${rowNumber}*1.1`,
      result: checkedVatPrice,
    };

    if (isLabor) {
      row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7ED" } };
      row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7ED" } };
      row.getCell(11).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7ED" } };
      row.getCell(12).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7ED" } };
    }

    row.eachCell((cell, colNumber) => {
      cell.font = { size: 10, color: { argb: "FF0F172A" } };
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      if ([6, 7, 8, 11, 12, 13, 14, 15, 16].includes(colNumber)) {
        cell.numFmt = colNumber === 13 ? "0.0%" : "#,##0";
        cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
      }
    });
    row.height = 42;
  });

  sheet.columns = [
    { width: 6 },
    { width: 24 },
    { width: 52 },
    { width: 16 },
    { width: 10 },
    { width: 10 },
    { width: 16 },
    { width: 16 },
    { width: 14 },
    { width: 4 },
    { width: 16 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 20 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `${combo.code || combo.name || "combo"}-bom.xlsx`;

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
