import { normalizeCombo, normalizeComboItem, normalizeProduct } from "@/lib/supabase/normalize";

type SupabaseClientLike = {
  from: (table: string) => {
    select: (columns: string) => any;
    eq: (column: string, value: string) => any;
    order: (column: string, options?: { ascending?: boolean }) => any;
    maybeSingle: () => Promise<{ data: any }>;
  };
};

function inferGroupIdFromText(text: string) {
  const value = text.toLowerCase();
  if (value.includes("nhan cong") || value.includes("nhân công") || value.includes("thi cong") || value.includes("thi công")) return "labor";
  if (value.includes("pin lưu trữ") || value.includes("battery") || value.includes("lithium")) return "battery";
  if (value.includes("tấm pin") || value.includes("panel") || value.includes("pv")) return "panel";
  if (value.includes("inverter") || value.includes("biến tần")) return "inverter";
  if (value.includes("khung") || value.includes("rail") || value.includes("mount")) return "mounting";
  if (value.includes("dây") || value.includes("cáp") || value.includes("wire") || value.includes("mc4")) return "wiring";
  if (value.includes("tủ điện") || value.includes("cabinet") || value.includes("meter")) return "cabinet";
  if (value.includes("tiếp địa") || value.includes("ground")) return "grounding";
  return "wiring";
}

export async function buildOrderItemSnapshot(
  supabase: SupabaseClientLike,
  input: {
    itemType: "combo" | "product";
    comboId?: string | null;
    productId?: string | null;
  },
) {
  if (input.itemType === "product" && input.productId) {
    const productRes = await supabase.from("products").select("*").eq("id", input.productId).maybeSingle();
    const product = productRes.data ? normalizeProduct(productRes.data) : null;
    return {
      item_type: "product",
      product: product,
      product_snapshot: product,
      combo: null,
      combo_snapshot: null,
      bom_rows: [],
    };
  }

  if (input.comboId) {
    const [comboRes, comboItemsRes] = await Promise.all([
      supabase.from("combos").select("*").eq("id", input.comboId).maybeSingle(),
      supabase.from("combo_items").select("*").eq("combo_id", input.comboId).order("sort_order", { ascending: true }),
    ]);
    const combo = comboRes.data ? normalizeCombo(comboRes.data) : null;
    const bomRows = (comboItemsRes.data ?? []).map((row: Record<string, unknown>) => normalizeComboItem(row));
    const groupedRows = bomRows.reduce<Record<string, typeof bomRows>>((acc, row) => {
      const groupId = row.sheet_group || inferGroupIdFromText(`${row.category} ${row.item_name}`);
      const next = acc[groupId] ?? [];
      next.push(row);
      acc[groupId] = next;
      return acc;
    }, {});
    return {
      item_type: "combo",
      combo,
      combo_snapshot: combo,
      product: null,
      product_snapshot: null,
      bom_rows: bomRows,
      bom_groups: groupedRows,
    };
  }

  return {
    item_type: input.itemType,
    combo: null,
    combo_snapshot: null,
    product: null,
    product_snapshot: null,
    bom_rows: [],
  };
}
