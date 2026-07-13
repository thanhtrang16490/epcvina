import { AdminShell } from "@/components/AdminShell";
import { ComboItemPicker } from "@/components/ComboItemPicker";
import { SectionTitle } from "@/components/SectionTitle";
import {
  comboItemGroups,
  getProductGroup,
  parseBatteryKwh,
  parsePowerWp,
} from "@/lib/combo-builder";
import { getComboCategoryLabel } from "@/lib/combo-groups";
import { getLaborCostByKw } from "@/lib/combo-labor";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCombo, normalizeComboItem, normalizeProduct } from "@/lib/supabase/normalize";
import { slugify } from "@/lib/slug";
import { parseImageUrls, uploadMediaFiles } from "@/lib/storage-media";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

type ComboFormData = ReturnType<typeof normalizeCombo>;
type ProductMediaRow = ReturnType<typeof normalizeProduct> & { cover_image_url?: string; image_urls?: string[] };
type ComboItemEditRow = ReturnType<typeof normalizeComboItem>;

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatMoney(value: number) {
  return currency.format(Number(value ?? 0));
}

function parseMoney(value: FormDataEntryValue | null) {
  return Number(String(value ?? "").replace(/[.,\s]/g, "")) || 0;
}

function readGroupRows(formData: FormData, groupId: string) {
  const raw = String(formData.get(`${groupId}_items_json`) ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getItemGroupId(item: ComboItemEditRow) {
  const text = `${item.category ?? ""} ${item.item_name ?? ""}`.toLowerCase();
  if (
    text.includes("nhan cong") ||
    text.includes("nhân công") ||
    text.includes("thi cong") ||
    text.includes("thi công") ||
    text.includes("lao dong") ||
    text.includes("lao động")
  ) {
    return "labor";
  }
  if (text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("biến tần")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "mounting";
  if (text.includes("dây") || text.includes("cáp") || text.includes("wire") || text.includes("mc4")) return "wiring";
  if (text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  if (text.includes("tiếp địa") || text.includes("ground")) return "grounding";
  return "wiring";
}

async function saveCombo(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  const batteryKwhRaw = String(formData.get("battery_kwh") ?? "").trim();
  const batteryTypeRaw = String(formData.get("battery_type") ?? "").trim();
  const comboCategoryId = String(formData.get("combo_category_id") ?? "").trim() || null;
  const phase = Number(formData.get("phase") ?? 1);
  const status = String(formData.get("status") ?? "draft");
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const imageUrls = parseImageUrls(formData.get("image_urls"));
  const comboCategoryRow = comboCategoryId ? (await supabase.from("combo_categories").select("name").eq("id", comboCategoryId).single()).data : null;
  const uploadedUrls = await uploadMediaFiles(
    supabase,
    "combos",
    comboCategoryRow?.name ?? String(formData.get("combo_category") ?? "uncategorized"),
    String(formData.get("name") ?? "").trim() || code,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );

  await supabase.from("combo_items").delete().eq("combo_id", id);
  const productsResult = await supabase.from("products").select("*").order("sort_order", { ascending: true });
  const products = (productsResult.data ?? []).map(
    (product) => normalizeProduct(product) as ReturnType<typeof normalizeProduct> & { cover_image_url?: string; image_urls?: string[] },
  );
  const selectedPanelRows = readGroupRows(formData, "panel");
  const selectedBatteryRows = readGroupRows(formData, "battery");
  const derivedSolarKw = selectedPanelRows.reduce((sum, row) => {
    const product = products.find((item) => item.id === String(row?.product_id ?? ""));
    const qty = Number(row?.quantity ?? 0);
    const watt = product ? parsePowerWp(product) || 620 : 0;
    if (!product || qty <= 0) return sum;
    return sum + (qty * watt) / 1000;
  }, 0);
  const derivedBatteryKwh = selectedBatteryRows.reduce((sum, row) => {
    const product = products.find((item) => item.id === String(row?.product_id ?? ""));
    const qty = Number(row?.quantity ?? 0);
    const capacity = product ? parseBatteryKwh(product) || 5.12 : 0;
    if (!product || qty <= 0) return sum;
    return sum + qty * capacity;
  }, 0);
  const pricingSettings = await getPricingSettings(supabase);
  const laborCost = getLaborCostByKw({
    solar_kw: derivedSolarKw,
    battery_kwh: derivedBatteryKwh || null,
    code,
    combo_type: String(formData.get("combo_type") ?? "standard"),
  }, pricingSettings);
  const resolvedCategoryLabel = getComboCategoryLabel({ code, phase, battery_kwh: derivedBatteryKwh || null, battery_type: batteryTypeRaw || null });
  const resolvedComboCategoryId =
    comboCategoryId ||
    (resolvedCategoryLabel === "Khác"
      ? null
      : (await supabase.from("combo_categories").select("id").eq("name", resolvedCategoryLabel).maybeSingle()).data?.id ?? null);
  await supabase.from("combos").update({
    code,
    name: String(formData.get("name") ?? "").trim(),
    slug: slugify(String(formData.get("name") ?? "").trim() || code),
    phase: Number(formData.get("phase") ?? 1),
    solar_kw: derivedSolarKw,
    battery_kwh: derivedBatteryKwh || (batteryKwhRaw ? Number(batteryKwhRaw) : null),
    battery_type: batteryTypeRaw || null,
    combo_category_id: resolvedComboCategoryId,
    cost_price: parseMoney(formData.get("cost_price")),
    target_min_price: parseMoney(formData.get("target_min_price")),
    reference_price: parseMoney(formData.get("reference_price")),
    margin: Number(String(formData.get("margin") ?? "0").replace(/,/g, "")) || 0,
    description: String(formData.get("description") ?? ""),
    cover_image_url: coverImageUrl || uploadedUrls[0] || null,
    image_urls: [...new Set([...imageUrls, ...uploadedUrls])],
    status,
    is_active: status === "active",
    combo_type: String(formData.get("combo_type") ?? "standard"),
  }).eq("id", id);
  const items: any[] = comboItemGroups.flatMap((group) => {
    const rows = readGroupRows(formData, group.id);
    return rows.flatMap((row, index) => {
      const product = products.find((item) => item.id === String(row?.product_id ?? ""));
      const quantity = Number(row?.quantity ?? 0);
      if (!product || quantity <= 0) return [];
      return [{
        combo_id: id,
        product_id: product.id,
        item_name: product.name,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        quantity,
        unit_price_vat: Number(product.sale_price_vat || 0),
        total_price_vat: Number(product.sale_price_vat || 0) * quantity,
        cost_price: Number(product.cost_price || 0),
        total_cost_price: Number(product.cost_price || 0) * quantity,
        warranty: product.warranty,
        notes: "",
        sort_order: (index + 1) * 10,
      }];
    });
  });
  if (laborCost > 0) {
    items.push({
      combo_id: id,
      product_id: null,
      item_name: "Chi phí nhân công",
      category: "Chi phí nhân công",
      brand: "EPCVINA",
      unit: "Gói",
      quantity: 1,
      unit_price_vat: laborCost,
      total_price_vat: laborCost,
      cost_price: laborCost,
      total_cost_price: laborCost,
      warranty: "",
      notes: "",
      sort_order: 9999,
    });
  }
  if (items.length) {
    await supabase.from("combo_items").insert(items);
  }

  revalidatePath("/combos");
  revalidatePath(`/combos/${id}`);
  redirect("/combos");
}

export default async function ComboEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const pricingSettings = await getPricingSettings(supabase);
  const data = supabase
    ? (normalizeCombo((await supabase.from("combos").select("*").eq("id", id).single()).data ?? {}) as ComboFormData)
    : null;
  if (!data) notFound();
  const combo = data as ComboFormData;
  const products: ProductMediaRow[] = supabase
    ? ((await supabase.from("products").select("*").order("sort_order", { ascending: true })).data ?? []).map(
        (product) => normalizeProduct(product) as ProductMediaRow,
      )
    : [];
  const comboCategories = supabase ? ((await supabase.from("combo_categories").select("*").order("sort_order", { ascending: true })).data ?? []) : [];
  const comboItems = supabase
    ? ((await supabase.from("combo_items").select("*").eq("combo_id", combo.id).order("sort_order", { ascending: true })).data ?? []).map(normalizeComboItem)
    : [];
  const initialRows = comboItemGroups.reduce<Record<string, { product_id: string; quantity: number }[]>>((acc, group) => {
    const rows = comboItems
      .filter((item) => {
        return getItemGroupId(item) === group.id;
      })
      .map((item) => ({
        product_id: String(item.product_id ?? ""),
        quantity: Number(item.quantity ?? 1),
      }));
    acc[group.id] = rows.length ? rows : [{ product_id: "", quantity: 1 }];
    return acc;
  }, {});

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Chỉnh sửa" title={combo.name} description="Sửa combo trên trang riêng, BOM thêm sản phẩm bằng modal." />
          <Link href="/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>
        <form action={saveCombo} encType="multipart/form-data" className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <input type="hidden" name="id" value={combo.id} />
          <div className="grid gap-3 md:grid-cols-2">
            <input name="code" defaultValue={combo.code} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="name" defaultValue={combo.name} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2" />
            <select name="combo_category_id" defaultValue={combo.combo_category_id ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2">
              <option value="">Chọn danh mục combo</option>
              {comboCategories.map((category: { id: string; name: string }) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="phase" type="number" defaultValue={combo.phase} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="battery_type" defaultValue={combo.battery_type ?? ""} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <select name="combo_type" defaultValue={combo.combo_type ?? "standard"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="standard">Combo chuẩn</option>
              <option value="custom">Combo tuỳ biến</option>
            </select>
            <select name="status" defaultValue={combo.status ?? (combo.is_active ? "active" : "inactive")} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
              Công suất hiện tại: <span className="text-white">{Number(combo.solar_kw).toFixed(2)} kWp</span>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
              Dung lượng hiện tại: <span className="text-white">{Number(combo.battery_kwh ?? 0).toFixed(2)} kWh</span>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
              Giá vốn hiện tại: <span className="text-white">{formatMoney(combo.cost_price)} đ</span>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)]">
              Giá bán hiện tại: <span className="text-white">{formatMoney(combo.reference_price)} đ</span>
            </div>
            <input name="cost_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.cost_price)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="target_min_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.target_min_price)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="reference_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.reference_price)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="margin" type="text" inputMode="decimal" defaultValue={String(combo.margin)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="cover_image_url" defaultValue={(combo as typeof combo & { cover_image_url?: string }).cover_image_url ?? ""} placeholder="Cover image URL" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2" />
            <textarea name="image_urls" defaultValue={((combo as typeof combo & { image_urls?: string[] }).image_urls ?? []).join("\n")} rows={3} placeholder="Các URL ảnh khác" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2" />
            <input name="images" type="file" multiple accept="image/*" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-slate-950" />
            <textarea name="description" defaultValue={combo.description} rows={5} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] md:col-span-2" />
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--muted)] md:col-span-2">
              Phí nhân công: <span className="text-white">{formatMoney(getLaborCostByKw({ solar_kw: Number(combo.solar_kw ?? 0), battery_kwh: Number(combo.battery_kwh ?? 0) || null, code: combo.code, combo_type: combo.combo_type ?? "standard" }, pricingSettings))} đ</span>
              <div className="mt-1 text-xs text-[color:var(--muted)]">
                Rule: {formatMoney(pricingSettings.labor_ongrid_per_kwp)} đ/kWp cho on-grid, {formatMoney(pricingSettings.labor_hybrid_per_kwp)} đ/kWp cho hybrid.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <ComboItemPicker
              products={products}
              initialRows={initialRows}
              title="Chọn thiết bị theo nhóm"
              description="Mỗi nhóm có thể thêm nhiều dòng, chọn đúng sản phẩm và số lượng."
            />
          </div>

          <button type="submit" className="mt-4 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Lưu
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
