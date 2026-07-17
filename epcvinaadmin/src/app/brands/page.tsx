import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ImageField } from "@/components/ImageField";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { getCachedBrands } from "@/lib/reference-data";
import { slugify } from "@/lib/slug";
import { uploadMediaFiles } from "@/lib/storage-media";
import Link from "next/link";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

async function createBrand(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "brands",
    name || "brand",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("brands").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    description: String(formData.get("description") ?? "").trim(),
    logo_url: imageUrl || uploaded[0] || String(formData.get("logo_url") ?? "").trim() || null,
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  });
  revalidatePath("/brands");
  revalidateTag(referenceDataTags.brands);
  redirect("/brands");
}

async function updateBrand(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "brands",
    name || "brand",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("brands").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    description: String(formData.get("description") ?? "").trim(),
    logo_url: imageUrl || uploaded[0] || String(formData.get("logo_url") ?? "").trim() || null,
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/brands");
  revalidateTag(referenceDataTags.brands);
  redirect("/brands");
}

async function deleteBrand(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("brands").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/brands");
  revalidateTag(referenceDataTags.brands);
  redirect("/brands");
}

export default async function BrandsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const allBrands = supabase ? await getCachedBrands() : [];
  const brandsRes = { data: allBrands.slice(start, end + 1), count: allBrands.length };
  const brands = brandsRes.data ?? [];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Danh mục" title="Quản lý Brand" description="Brand dùng chung cho sản phẩm và BOM combo." />
          <Link href="/admin/products" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Sản phẩm</Link>
        </div>
        <CrudFilterBar
          subtitle="Danh mục"
          title={`Brand (${brands.length})`}
          searchLabel="Tìm theo brand, mô tả"
          searchSuggestions={brands.slice(0, 8).map((brand: any) => ({
            label: brand.name,
            href: "/brands",
            meta: brand.slug,
          }))}
          secondaryLinks={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/products", label: "Sản phẩm" },
          ]}
        />
        <div className="mb-4 flex justify-end">
          <ModalShell
            trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm brand</span>}
            title="Thêm brand"
            description="Tạo brand mới cho catalog."
          >
            <form action={createBrand} className="grid gap-3">
              <SlugField name="name" label="Tên brand" placeholder="Tên brand" />
              <ImageField name="image_url" label="Ảnh brand" placeholder="Dán URL ảnh hoặc chọn file" />
              <FormattedNumberInput name="sort_order" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <textarea name="description" rows={4} placeholder="Mô tả" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Tạo brand</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            {brands.map((brand: any) => (
              <div key={brand.id} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 lg:grid-cols-[72px_1fr_1fr_120px_auto] lg:items-center">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  {(brand.image_url || brand.logo_url) ? <img src={brand.image_url || brand.logo_url} alt={brand.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                    <Link href={`/admin/brands/${brand.id}`} className="font-medium text-white transition hover:text-cyan-300">
                    {brand.name}
                  </Link>
                  <div className="mt-2">
                    <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                      {brand.slug}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-300">{brand.description || "-"}</div>
                <div className="text-sm text-slate-300">{brand.sort_order}</div>
                <div className="flex flex-wrap gap-2">
                  <ModalShell
                    trigger={<span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</span>}
                    title={`Sửa brand: ${brand.name}`}
                    description="Chỉnh brand ngay trong modal."
                  >
                    <form action={updateBrand} className="grid gap-3">
                      <input type="hidden" name="id" value={brand.id} />
                      <SlugField name="name" label="Tên brand" defaultValue={brand.name} defaultSlug={brand.slug} />
                      <FormattedNumberInput name="sort_order" defaultValue={brand.sort_order} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <textarea name="description" defaultValue={brand.description ?? ""} rows={4} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <ImageField name="image_url" label="Ảnh brand" defaultValue={brand.image_url ?? brand.logo_url ?? ""} placeholder="Dán URL ảnh hoặc chọn file" />
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                        <button formAction={deleteBrand} className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-100">Xóa</button>
                      </div>
                    </form>
                  </ModalShell>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-400">Trang {page} / {getPageCount(Number(brandsRes.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
