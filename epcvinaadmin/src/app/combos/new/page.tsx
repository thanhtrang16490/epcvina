import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { parseImageUrls, uploadMediaFiles } from "@/lib/storage-media";
import { getCachedComboCategories } from "@/lib/reference-data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

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
    solar_kw: Number(formData.get("solar_kw") ?? 0),
    battery_kwh: Number(formData.get("battery_kwh") ?? 0) || null,
    battery_type: batteryTypeRaw || null,
    combo_category_id: comboCategoryId,
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
  revalidatePath("/combos");
  redirect(`/combos/${comboResult.data?.id}/excel`);
}

export default async function ComboNewPage() {
  const supabase = await createSupabaseServerClient();
  const comboCategories = supabase ? await getCachedComboCategories() : [];

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Combo" title="Thêm combo mới" description="Tạo combo xong sẽ chuyển sang trang Excel BOM để nhập cấu trúc vật tư." />
          <Link href="/admin/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
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
            <FormattedNumberInput name="phase" defaultValue={1} min={1} max={3} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <FormattedNumberInput name="solar_kw" step={0.01} placeholder="Công suất kWp" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <FormattedNumberInput name="battery_kwh" step={0.01} placeholder="Pin lưu trữ kWh (nếu có)" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="battery_type" placeholder="LV/HV" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <select name="combo_type" defaultValue="standard" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <option value="standard">Combo chuẩn</option>
              <option value="custom">Combo tuỳ biến</option>
            </select>
            <FormattedNumberInput name="cost_price" step={0.01} placeholder="Giá vốn" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <FormattedNumberInput name="target_min_price" step={0.01} placeholder="Giá tối thiểu" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <FormattedNumberInput name="reference_price" step={0.01} placeholder="Giá tham chiếu" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <FormattedNumberInput name="margin" step={0.01} placeholder="Biên %" integer={false} inputMode="decimal" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <input name="cover_image_url" placeholder="Cover image URL (Supabase public URL)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
            <textarea name="image_urls" rows={3} placeholder="Các URL ảnh khác, ngăn cách bằng xuống dòng hoặc dấu phẩy" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
            <input name="images" type="file" multiple accept="image/*" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-slate-950 md:col-span-2" />
            <select name="status" defaultValue="inactive" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FormattedNumberInput name="sort_order" placeholder="Sort order" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <textarea name="description" rows={4} placeholder="Mô tả" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
          </div>
          <button type="submit" className="mt-4 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Tạo combo và mở sheet BOM
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
