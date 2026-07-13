import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ComboItemPicker } from "@/components/ComboItemPicker";
import { SectionTitle } from "@/components/SectionTitle";
import { getComboCategoryLabel, getComboGroupId } from "@/lib/combo-groups";
import { comboItemGroups, parseBatteryKwh, parsePowerWp } from "@/lib/combo-builder";
import { getLaborCostByKw } from "@/lib/combo-labor";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeProduct } from "@/lib/supabase/normalize";
import { slugify } from "@/lib/slug";
import { parseImageUrls, uploadMediaFiles } from "@/lib/storage-media";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function readGroupRows(formData: FormData, groupId: string) {
  const raw = String(formData.get(`${groupId}_items_json`) ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function resolveComboCategoryId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, combo: { code: string; phase: number; battery_kwh: number | null; battery_type: string | null }, requestedCategoryId: string | null) {
  if (!supabase) return null;
  if (requestedCategoryId) return requestedCategoryId;
  const label = getComboCategoryLabel(combo);
  if (label === "Khác") return null;
  const row = (await supabase.from("combo_categories").select("id").eq("name", label).maybeSingle()).data;
  return row?.id ?? null;
}

async function createCombo(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phase = Number(formData.get("phase") ?? 1);
  const batteryTypeRaw = String(formData.get("battery_type") ?? "").trim();
  const comboCategoryId = String(formData.get("combo_category_id") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "inactive");
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const imageUrls = parseImageUrls(formData.get("image_urls"));
  const comboCategoryRow = comboCategoryId ? (await supabase.from("combo_categories").select("name").eq("id", comboCategoryId).single()).data : null;

  const products = ((await supabase.from("products").select("*").order("sort_order", { ascending: true })).data ?? []).map(normalizeProduct);
  const panelRows = readGroupRows(formData, "panel");
  const batteryRows = readGroupRows(formData, "battery");
  const solarKw = panelRows.reduce((sum, row) => {
    const product = products.find((item) => item.id === String(row?.product_id ?? ""));
    const qty = Number(row?.quantity ?? 0);
    const watt = product ? parsePowerWp(product) || 620 : 0;
    return product && qty > 0 ? sum + (qty * watt) / 1000 : sum;
  }, 0);
  const batteryKwh = batteryRows.reduce((sum, row) => {
    const product = products.find((item) => item.id === String(row?.product_id ?? ""));
    const qty = Number(row?.quantity ?? 0);
    const capacity = product ? parseBatteryKwh(product) || 5.12 : 0;
    return product && qty > 0 ? sum + qty * capacity : sum;
  }, 0);
  const pricingSettings = await getPricingSettings(supabase);
  const laborCost = getLaborCostByKw(
    { solar_kw: solarKw, battery_kwh: batteryKwh || null, code, combo_type: String(formData.get("combo_type") ?? "standard") },
    pricingSettings,
  );
  const resolvedComboCategoryId = await resolveComboCategoryId(
    supabase,
    { code, phase, battery_kwh: batteryKwh || null, battery_type: batteryTypeRaw || null },
    comboCategoryId,
  );
  const uploadedUrls = await uploadMediaFiles(
    supabase,
    "combos",
    comboCategoryRow?.name ?? String(formData.get("combo_category") ?? "uncategorized"),
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );

  const comboResult = await supabase.from("combos").insert({
    code,
    name,
    slug: slugify(name || code),
    phase,
    solar_kw: solarKw,
    battery_kwh: batteryKwh || null,
    battery_type: batteryTypeRaw || null,
    combo_category_id: resolvedComboCategoryId,
    cost_price: Number(formData.get("cost_price") ?? 0),
    target_min_price: Number(formData.get("target_min_price") ?? 0),
    reference_price: Number(formData.get("reference_price") ?? 0),
    margin: Number(formData.get("margin") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    cover_image_url: coverImageUrl || uploadedUrls[0] || null,
    image_urls: [...new Set([...imageUrls, ...uploadedUrls])],
    highlights: [],
    sort_order: Number(formData.get("sort_order") ?? 0),
    status,
    is_active: status === "active",
    combo_type: String(formData.get("combo_type") ?? "standard"),
    source_kind: String(formData.get("source_kind") ?? "manual") || "manual",
  }).select("id").single();

  const comboId = comboResult.data?.id;
  if (comboId) {
    const items = [];
    for (const group of comboItemGroups) {
      const rows = readGroupRows(formData, group.id);
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const product = products.find((item) => item.id === String(row?.product_id ?? ""));
        const quantity = Number(row?.quantity ?? 0);
        if (!product || quantity <= 0) continue;
        items.push({
          combo_id: comboId,
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
          sort_order: (group.id === "panel" || group.id === "battery" ? 1 : 2) * 1000 + (index + 1) * 10,
        });
      }
    }
    if (laborCost > 0) {
      items.push({
        combo_id: comboId,
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
    if (items.length) await supabase.from("combo_items").insert(items);
  }

  revalidatePath("/combos");
  redirect("/combos");
}

export default async function ComboNewPage() {
  const supabase = await createSupabaseServerClient();
  const products = supabase
    ? ((await supabase.from("products").select("*").order("sort_order", { ascending: true })).data ?? []).map(normalizeProduct)
    : [];
  const comboCategories = supabase ? ((await supabase.from("combo_categories").select("*").order("sort_order", { ascending: true })).data ?? []) : [];

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Combo" title="Thêm combo mới" description="Tạo combo trên trang riêng, BOM thêm sản phẩm bằng modal." />
          <Link href="/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>

        <form action={createCombo} encType="multipart/form-data" className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <input name="code" placeholder="Code" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="name" placeholder="Tên combo" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <select name="combo_category_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2">
              <option value="">Chọn danh mục combo</option>
              {comboCategories.map((category: { id: string; name: string }) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="phase" type="number" defaultValue={1} min={1} max={3} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="battery_type" placeholder="LV/HV" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <select name="combo_type" defaultValue="standard" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <option value="standard">Combo chuẩn</option>
              <option value="custom">Combo tuỳ biến</option>
            </select>
            <input name="cost_price" type="number" step="0.01" placeholder="Giá vốn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="target_min_price" type="number" step="0.01" placeholder="Giá tối thiểu" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="reference_price" type="number" step="0.01" placeholder="Giá tham chiếu" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="margin" type="number" step="0.01" placeholder="Biên %" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="cover_image_url" placeholder="Cover image URL (Supabase public URL)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
            <textarea name="image_urls" rows={3} placeholder="Các URL ảnh khác, ngăn cách bằng xuống dòng hoặc dấu phẩy" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
            <input name="images" type="file" multiple accept="image/*" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-slate-950 md:col-span-2" />
            <select name="status" defaultValue="inactive" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input name="sort_order" type="number" placeholder="Sort order" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <textarea name="description" rows={4} placeholder="Mô tả" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
          </div>
          <div className="mt-6">
            <ComboItemPicker products={products} title="Chọn thiết bị theo nhóm" description="Thêm sản phẩm vào combo bằng modal theo từng nhóm vật tư." />
          </div>
          <button type="submit" className="mt-4 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Tạo combo
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
