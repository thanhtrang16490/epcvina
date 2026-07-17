import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { ModalShell } from "@/components/ModalShell";
import { ImageField } from "@/components/ImageField";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { getCachedProductCategories } from "@/lib/reference-data";
import { slugify } from "@/lib/slug";
import { uploadMediaFiles } from "@/lib/storage-media";
import Link from "next/link";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

async function createCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "categories",
    name || "category",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("product_categories").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    parent_id: String(formData.get("parent_id") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim(),
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  });
  revalidatePath("/product-categories");
  revalidateTag(referenceDataTags.productCategories);
  redirect("/product-categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "categories",
    name || "category",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("product_categories").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    parent_id: String(formData.get("parent_id") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim(),
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/product-categories");
  revalidateTag(referenceDataTags.productCategories);
  redirect("/product-categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("product_categories").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/product-categories");
  revalidateTag(referenceDataTags.productCategories);
  redirect("/product-categories");
}

export default async function ProductCategoriesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const allCategories = supabase ? await getCachedProductCategories() : [];
  const categoriesRes = { data: allCategories.slice(start, end + 1), count: allCategories.length };
  const categories = categoriesRes.data ?? [];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Danh mục" title="Quản lý danh mục sản phẩm" description="Dùng cho sản phẩm, combo items và lọc catalog." />
          <Link href="/admin/products" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Sản phẩm</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell
            trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm danh mục</span>}
            title="Thêm danh mục sản phẩm"
            description="Tạo group sản phẩm chuẩn hóa."
          >
            <form action={createCategory} className="grid gap-3">
              <SlugField name="name" label="Tên danh mục" placeholder="Tên danh mục" />
              <input name="parent_id" placeholder="Parent ID (optional)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <ImageField name="image_url" label="Ảnh danh mục" placeholder="Dán URL ảnh hoặc chọn file" />
              <FormattedNumberInput name="sort_order" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <textarea name="description" rows={4} placeholder="Mô tả" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Tạo danh mục</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            {categories.map((category: any) => (
              <div key={category.id} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 lg:grid-cols-[72px_1fr_1fr_120px_auto] lg:items-center">
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  {category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <Link href={`/product-categories/${category.id}`} className="font-medium text-white transition hover:text-cyan-300">
                    {category.name}
                  </Link>
                  <div className="mt-2">
                    <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                      {category.slug}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-300">{category.description || "-"}</div>
                <div className="text-sm text-slate-300">{category.sort_order}</div>
                <div className="flex gap-2">
                  <ModalShell
                    trigger={<span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</span>}
                    title={`Sửa danh mục: ${category.name}`}
                    description="Chỉnh danh mục ngay trong modal."
                  >
                    <form action={updateCategory} className="grid gap-3">
                      <input type="hidden" name="id" value={category.id} />
                      <SlugField name="name" label="Tên danh mục" defaultValue={category.name} defaultSlug={category.slug} />
                      <FormattedNumberInput name="sort_order" defaultValue={category.sort_order} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <textarea name="description" defaultValue={category.description ?? ""} rows={4} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="parent_id" defaultValue={category.parent_id ?? ""} placeholder="Parent ID (optional)" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <ImageField name="image_url" label="Ảnh danh mục" defaultValue={category.image_url ?? ""} placeholder="Dán URL ảnh hoặc chọn file" />
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                        <button formAction={deleteCategory} className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-100">Xóa</button>
                      </div>
                    </form>
                  </ModalShell>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-400">Trang {page} / {getPageCount(Number(categoriesRes.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
