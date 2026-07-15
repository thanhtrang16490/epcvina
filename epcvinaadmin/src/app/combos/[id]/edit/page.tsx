import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { SectionTitle } from "@/components/SectionTitle";
import { getLaborCostByKw } from "@/lib/combo-labor";
import { getPricingSettings } from "@/lib/pricing-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseLocaleNumber } from "@/lib/number-format";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { getCachedComboCategories } from "@/lib/reference-data";
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

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatMoney(value: number) {
  return currency.format(Number(value ?? 0));
}

function parseMoney(value: FormDataEntryValue | null) {
  return parseLocaleNumber(value, 0);
}

async function saveCombo(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const code = String(formData.get("code") ?? "").trim();
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

  await supabase.from("combos").update({
    code,
    name: String(formData.get("name") ?? "").trim(),
    slug: slugify(String(formData.get("name") ?? "").trim() || code),
    phase: Number(formData.get("phase") ?? 1),
    solar_kw: Number(formData.get("solar_kw") ?? 0),
    battery_kwh: Number(formData.get("battery_kwh") ?? 0) || null,
    battery_type: batteryTypeRaw || null,
    combo_category_id: comboCategoryId,
    cost_price: parseMoney(formData.get("cost_price")),
    target_min_price: parseMoney(formData.get("target_min_price")),
    reference_price: parseMoney(formData.get("reference_price")),
    margin: parseLocaleNumber(formData.get("margin"), 0),
    description: String(formData.get("description") ?? ""),
    cover_image_url: coverImageUrl || uploadedUrls[0] || null,
    image_urls: [...new Set([...imageUrls, ...uploadedUrls])],
    status,
    is_active: status === "active",
    combo_type: String(formData.get("combo_type") ?? "standard"),
  }).eq("id", id);

  revalidatePath("/combos");
  revalidatePath(`/combos/${id}`);
  redirect(`/combos/${id}/excel`);
}

export default async function ComboEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const pricingSettings = await getPricingSettings(supabase);
  const data = supabase
    ? (normalizeCombo((await supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id, cover_image_url, image_urls").eq("id", id).single()).data ?? {}) as ComboFormData)
    : null;
  if (!data) notFound();
  const combo = data as ComboFormData;
  const products = supabase
    ? ((await supabase.from("products").select("id, slug, name, category, brand, unit, quantity, cost_price, sale_price_vat, warranty, description, cover_image_url, image_urls, status, is_active, sort_order").order("sort_order", { ascending: true })).data ?? []).map((product) => normalizeProduct(product))
    : [];
  const comboCategories = supabase ? await getCachedComboCategories() : [];
  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Chỉnh sửa" title={combo.name} description="Sửa thông tin combo, BOM sẽ chỉnh ở trang Excel riêng để đồng bộ cùng một logic." />
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/combos/${combo.id}/excel`} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              Edit excel
            </Link>
            <Link href="/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Back
            </Link>
          </div>
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
            <FormattedNumberInput name="phase" defaultValue={combo.phase} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <FormattedNumberInput name="solar_kw" step={0.01} defaultValue={Number(combo.solar_kw ?? 0)} placeholder="Công suất kWp" integer={false} inputMode="decimal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <FormattedNumberInput name="battery_kwh" step={0.01} defaultValue={Number(combo.battery_kwh ?? 0)} placeholder="Pin lưu trữ kWh" integer={false} inputMode="decimal" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
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
            {Number(combo.target_min_price ?? 0) > 0 && Number(combo.target_min_price ?? 0) > Number(combo.reference_price ?? 0) && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 md:col-span-2">
                Giá ưu đãi đang cao hơn giá tham chiếu. Public sẽ tự quay về hiển thị giá tham chiếu để tránh đội giá bất thường.
              </div>
            )}
            <input name="cost_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.cost_price)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="target_min_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.target_min_price)} placeholder="Giá ưu đãi / tuỳ biến" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
            <input name="reference_price" type="text" inputMode="numeric" defaultValue={formatMoney(combo.reference_price)} placeholder="Giá tham chiếu" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]" />
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

          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
            BOM combo được đồng bộ ở trang Excel riêng. Bấm <Link href={`/combos/${combo.id}/excel`} className="underline underline-offset-4">Edit excel</Link> để cập nhật vật tư, giá vốn và tham chiếu sản phẩm.
          </div>

          <button type="submit" className="mt-4 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Lưu
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
