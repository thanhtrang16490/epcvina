import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { ImageField } from "@/components/ImageField";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";
import { uploadMediaFiles } from "@/lib/storage-media";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "categories",
    name || "combo-category",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("combo_categories").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    description: String(formData.get("description") ?? "").trim(),
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  });
  revalidatePath("/combo-categories");
  redirect("/combo-categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const uploaded = await uploadMediaFiles(
    supabase,
    "categories",
    name || "combo-category",
    name,
    formData.getAll("images").filter((value): value is File => value instanceof File),
  );
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  await supabase.from("combo_categories").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    description: String(formData.get("description") ?? "").trim(),
    image_url: imageUrl || uploaded[0] || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("is_active") ?? "true") === "true",
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/combo-categories");
  redirect("/combo-categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("combo_categories").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/combo-categories");
  redirect("/combo-categories");
}

export default async function ComboCategoriesPage() {
  const supabase = createSupabaseAdminClient();
  const categories = supabase ? ((await supabase.from("combo_categories").select("*").order("sort_order", { ascending: true })).data ?? []) : [];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Danh mục" title="Quản lý danh mục combo" description="Chuẩn hóa nhóm combo theo epcvinasolar." />
          <Link href="/combos" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Combo</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell
            trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm danh mục</span>}
            title="Thêm danh mục combo"
            description="Dùng cho phân nhóm combo trong admin."
          >
            <form action={createCategory} className="grid gap-3">
              <SlugField name="name" label="Tên danh mục" placeholder="Tên danh mục" />
              <ImageField name="image_url" label="Ảnh danh mục" placeholder="Dán URL ảnh hoặc chọn file" />
              <input name="sort_order" type="number" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
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
                  <div className="font-medium text-white">{category.name}</div>
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
                      <input name="sort_order" type="number" defaultValue={category.sort_order} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <textarea name="description" defaultValue={category.description ?? ""} rows={4} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
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
        </section>
      </main>
    </AdminShell>
  );
}
