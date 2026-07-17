import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ComboExcelSheetEditor, type ComboExcelSheetRow } from "@/components/ComboExcelSheetEditor";
import { getLaborCostByKw } from "@/lib/combo-labor";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo, normalizeComboItem } from "@/lib/supabase/normalize";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function parseSheetRows(formData: FormData) {
  const raw = String(formData.get("excel_rows_json") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function inferSheetGroup(row: {
  category?: string;
  specification?: string;
}) {
  const text = `${row.category ?? ""} ${row.specification ?? ""}`.toLowerCase();
  if (text.includes("nhan cong") || text.includes("nhân công") || text.includes("thi cong") || text.includes("thi công")) return "labor";
  if (text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("biến tần")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "mounting";
  if (text.includes("dây") || text.includes("cáp") || text.includes("wire") || text.includes("mc4")) return "wiring";
  if (text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  if (text.includes("tiếp địa") || text.includes("ground")) return "grounding";
  return "wiring";
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

function applyReferenceDefaults(
  row: {
    reference_product_id: string | null;
    category: string;
    specification: string;
    brand_name: string;
    unit: string;
    unit_price_vat: number;
    cost_price: number;
    warranty: string;
  },
  productsById: Map<string, RefProduct>,
) {
  const ref = row.reference_product_id ? productsById.get(row.reference_product_id) : undefined;
  if (!ref) return row;
  return {
    ...row,
    category: ref.category || row.category,
    specification: ref.name || row.specification,
    brand_name: ref.brand || row.brand_name,
    unit: ref.unit || row.unit,
    unit_price_vat: ref.sale_price_vat || row.unit_price_vat,
    cost_price: ref.cost_price || row.cost_price,
    warranty: ref.warranty || row.warranty,
  };
}

async function saveComboExcelSheet(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const rows = parseSheetRows(formData);
  const products = supabase
    ? ((await supabase.from("products").select("id, slug, name, category, brand, unit, cost_price, sale_price_vat, warranty, cover_image_url, image_urls, is_active, sort_order").order("sort_order", { ascending: true })).data ?? []).map((product: any) => ({
        id: String(product.id),
        name: String(product.name ?? ""),
        category: String(product.category ?? ""),
        brand: String(product.brand ?? ""),
        unit: String(product.unit ?? ""),
        cost_price: Number(product.cost_price ?? 0),
        sale_price_vat: Number(product.sale_price_vat ?? 0),
        warranty: String(product.warranty ?? ""),
      }))
    : [];
  const productsById = new Map<string, RefProduct>(products.map((product) => [product.id, product]));

  const normalizedRows = rows
    .map((row: any, index: number) => {
      const base = {
      no: index + 1,
      product_id: String(row.product_id ?? "").trim() || null,
      reference_product_id: String(row.reference_product_id ?? row.product_id ?? "").trim() || null,
      sheet_group: inferSheetGroup(row),
      category: String(row.category ?? "").trim(),
      specification: String(row.specification ?? "").trim(),
      brand_name: String(row.brand_name ?? "").trim(),
      unit: String(row.unit ?? "").trim(),
      quantity: Math.max(1, Number(row.quantity ?? 1)),
      unit_price_vat: Math.max(0, Number(row.unit_price_vat ?? 0)),
      warranty: String(row.warranty ?? "").trim(),
      cost_price: Math.max(0, Number(row.cost_price ?? 0)),
      gross_margin: Math.max(0, Number(row.gross_margin ?? 0)),
      notes: String(row.notes ?? "").trim(),
      };
      return applyReferenceDefaults(base, productsById);
    })
    .filter((row) => row.specification || row.category || row.unit_price_vat > 0 || row.cost_price > 0);

  const pricingSettings = await getPricingSettings(supabase);
  const laborCost = getLaborCostByKw(
    {
      solar_kw: Number(formData.get("solar_kw") ?? 0),
      battery_kwh: Number(formData.get("battery_kwh") ?? 0) || null,
      code: String(formData.get("code") ?? ""),
      combo_type: String(formData.get("combo_type") ?? "standard"),
    },
    pricingSettings,
  );

  if (laborCost > 0) {
    normalizedRows.push({
      no: normalizedRows.length + 1,
      product_id: null,
      reference_product_id: null,
      sheet_group: "labor",
      category: "PHÍ NHÂN CÔNG LẮP ĐẶT",
      specification: "Phí nhân công lắp đặt",
      brand_name: "EPCVINA",
      unit: "Gói",
      quantity: 1,
      unit_price_vat: laborCost,
      warranty: "",
      cost_price: laborCost,
      gross_margin: 0,
      notes: "Tính theo rule pricing settings",
    } as any);
  }

  await supabase.from("combo_items").delete().eq("combo_id", id);
  const items = normalizedRows.map((row: any) => ({
    combo_id: id,
    product_id: row.product_id,
    reference_product_id: row.reference_product_id,
    item_name: row.specification || row.category || `Dòng ${row.no}`,
    category: row.category || "BOM Excel",
    brand: row.brand_name || "EPCVINA",
    unit: row.unit || "Cái",
    quantity: row.quantity,
    unit_price_vat: row.unit_price_vat,
    total_price_vat: row.unit_price_vat * row.quantity,
    cost_price: row.cost_price,
    total_cost_price: row.cost_price * row.quantity,
    gross_margin:
      row.gross_margin > 0
        ? row.gross_margin
        : row.unit_price_vat > 0
          ? Math.max(0, ((row.unit_price_vat * row.quantity - row.cost_price * row.quantity) / (row.unit_price_vat * row.quantity)) * 100)
          : 0,
    warranty: row.warranty,
    notes: row.notes,
    sheet_group: row.sheet_group,
    sort_order: row.no * 10,
  }));

  const laborRow = normalizedRows.find((row: any) => row.sheet_group === "labor");
  if (!laborRow || laborCost <= 0) {
    const laborItem = laborCost > 0
      ? {
          combo_id: id,
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
          gross_margin: 0,
          warranty: "",
          notes: "Tính theo rule pricing settings",
          sheet_group: "labor",
          sort_order: 9999,
        }
      : null;
    if (laborItem) {
      items.push(laborItem);
    }
  }
  if (items.length) {
    await supabase.from("combo_items").insert(items);
  }

  const totalSale = items.reduce((sum, item) => sum + Number(item.total_price_vat ?? 0), 0);
  const totalCost = items.reduce((sum, item) => sum + Number(item.total_cost_price ?? 0), 0);
  const marginPct = totalSale > 0 ? ((totalSale - totalCost) / totalSale) * 100 : 0;

  await supabase
    .from("combos")
    .update({
      cost_price: totalCost,
      reference_price: totalSale,
      target_min_price: totalSale,
      margin: marginPct,
    })
    .eq("id", id);

  revalidatePath("/combos");
  revalidatePath(`/combos/${id}`);
  redirect(`/combos/${id}/excel`);
}

export default async function ComboExcelPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const combo = supabase
    ? (normalizeCombo((await supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls").eq("id", id).single()).data ?? {}) as ReturnType<typeof normalizeCombo>)
    : null;
  if (!combo) notFound();

  const comboItems = supabase
    ? ((await supabase.from("combo_items").select("id, combo_id, product_id, reference_product_id, category, item_name, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, gross_margin, notes, sheet_group, sort_order").eq("combo_id", combo.id).order("sort_order", { ascending: true })).data ?? []).map(normalizeComboItem)
    : [];

  const hasLabor = comboItems.some((item) => String(item.sheet_group ?? "") === "labor");
  const laborRow: ComboExcelSheetRow[] = hasLabor
    ? []
    : [
        {
          no: comboItems.length + 1,
          product_id: "",
          category: "PHÍ NHÂN CÔNG LẮP ĐẶT",
          specification: "Phí nhân công lắp đặt",
          brand_name: "EPCVINA",
          unit: "Gói",
          quantity: 1,
          unit_price_vat: 0,
          warranty: "",
          cost_price: 0,
          gross_margin: 0,
          notes: "Tính theo rule pricing settings",
        },
      ];

  const sheetItems = [
    ...comboItems.map((item) => ({
      product_id: String(item.reference_product_id ?? item.product_id ?? ""),
      reference_product_id: String(item.reference_product_id ?? item.product_id ?? ""),
      category: item.category,
      specification: item.item_name,
      brand_name: item.brand,
      unit: item.unit,
      quantity: Number(item.quantity ?? 1),
      unit_price_vat: Number(item.unit_price_vat ?? 0),
      warranty: item.warranty,
      cost_price: Number(item.cost_price ?? 0),
      gross_margin: Number(item.gross_margin ?? 0),
      notes: item.notes,
    })),
    ...laborRow,
  ];

  const initialRows: ComboExcelSheetRow[] = sheetItems.map((item, index) => ({
    no: index + 1,
    product_id: String(item.reference_product_id ?? item.product_id ?? ""),
    reference_product_id: String(item.reference_product_id ?? item.product_id ?? ""),
    category: item.category,
    specification: item.specification,
    brand_name: item.brand_name,
    unit: item.unit,
    quantity: Number(item.quantity ?? 1),
    unit_price_vat: Number(item.unit_price_vat ?? 0),
    warranty: item.warranty,
    cost_price: Number(item.cost_price ?? 0),
    gross_margin: Number(item.gross_margin ?? 0),
    notes: item.notes,
  }));

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1800px] px-4 py-3 md:px-0">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle eyebrow="Excel BOM" title={combo.name} description="Trang bảng rộng để chỉnh BOM theo đúng cấu trúc file sheet." />
          <div className="flex flex-wrap gap-2">
            <a href={`/api/combos/${combo.id}/excel`} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]">
              Tải Excel
            </a>
            <a href={`/combos/${combo.id}/edit`} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]">
              Quay lại combo
            </a>
            <a href="/combos" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]">
              Danh sách combo
            </a>
          </div>
        </div>

        <ComboExcelSheetEditor
          comboId={combo.id}
          title="Edit Excel"
          description="Bảng này mô phỏng dữ liệu sheet: rộng, nhiều cột, chia nhóm rõ ràng và lưu trực tiếp về combo_items."
          initialRows={initialRows}
          onSaveAction={saveComboExcelSheet}
        />
      </main>
    </AdminShell>
  );
}
