import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { ModalShell } from "@/components/ModalShell";
import { ImageField } from "@/components/ImageField";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { getCachedComboCategories } from "@/lib/reference-data";
import { slugify } from "@/lib/slug";
import { uploadMediaFiles } from "@/lib/storage-media";
import Link from "next/link";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function isHiddenComboCategory(category: { name?: string; slug?: string }) {
  const name = String(category.name ?? "").toLowerCase();
  const slug = String(category.slug ?? "").toLowerCase();
  return slug === "hybrid-inverter" || name.includes("hybrid inverter");
}

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
  revalidateTag(referenceDataTags.comboCategories);
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
  revalidateTag(referenceDataTags.comboCategories);
  redirect("/combo-categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("combo_categories").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/combo-categories");
  revalidateTag(referenceDataTags.comboCategories);
  redirect("/combo-categories");
}

export default async function ComboCategoriesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const allCategories = supabase ? await getCachedComboCategories() : [];
  const categoriesRes = { data: allCategories.slice(start, end + 1), count: allCategories.length };
  const categories = categoriesRes.data ?? [];
  const combos = supabase
    ? ((await supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, combo_category_id, is_active, status, sort_order").order("sort_order", { ascending: true })).data ?? [])
    : [];
  const visibleCategories = categories.filter((category: any) => !isHiddenComboCategory(category));
  const combosByCategoryId = new Map<string, any[]>();
  combos.forEach((combo: any) => {
    const key = String(combo.combo_category_id ?? "");
    if (!key) return;
    const current = combosByCategoryId.get(key) ?? [];
    current.push(combo);
    combosByCategoryId.set(key, current);
  });
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Danh mục" title="Quản lý danh mục combo" description="Chuẩn hóa nhóm combo theo epcvinasolar." />
          <Link href="/combos" className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]">Combo</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell
            trigger={<span className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white">Thêm danh mục</span>}
            title="Thêm danh mục combo"
            description="Dùng cho phân nhóm combo trong admin."
          >
            <form action={createCategory} className="grid gap-3">
              <SlugField name="name" label="Tên danh mục" placeholder="Tên danh mục" />
              <ImageField name="image_url" label="Ảnh danh mục" placeholder="Dán URL ảnh hoặc chọn file" />
              <FormattedNumberInput name="sort_order" defaultValue={0} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <textarea name="description" rows={4} placeholder="Mô tả" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
              <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Tạo danh mục</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
          <div className="space-y-3">
            {visibleCategories.map((category: any) => (
              <div key={category.id} className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
                <div className="grid gap-3 lg:grid-cols-[72px_1fr_1fr_120px_auto] lg:items-center">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)]">
                    {category.image_url ? <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[color:var(--text)]">{category.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                        {category.slug}
                      </span>
                      <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-2.5 py-1 text-[10px] font-medium text-[color:var(--accent)]">
                        {combosByCategoryId.get(category.id)?.length ?? 0} combo
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">{category.description || "-"}</div>
                  <div className="text-sm text-[color:var(--text)]">{category.sort_order}</div>
                  <div className="flex gap-2">
                    <ModalShell
                      trigger={<span className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>}
                      title={`Sửa danh mục: ${category.name}`}
                      description="Chỉnh danh mục ngay trong modal."
                    >
                      <form action={updateCategory} className="grid gap-3">
                        <input type="hidden" name="id" value={category.id} />
                        <SlugField name="name" label="Tên danh mục" defaultValue={category.name} defaultSlug={category.slug} />
                        <FormattedNumberInput name="sort_order" defaultValue={category.sort_order} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                        <textarea name="description" defaultValue={category.description ?? ""} rows={4} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)] outline-none" />
                        <ImageField name="image_url" label="Ảnh danh mục" defaultValue={category.image_url ?? ""} placeholder="Dán URL ảnh hoặc chọn file" />
                        <div className="flex gap-2">
                          <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                          <button formAction={deleteCategory} className="rounded-2xl border border-[color:var(--danger)]/20 bg-[color:var(--danger)]/10 px-4 py-3 text-[color:var(--danger)]">Xóa</button>
                        </div>
                      </form>
                    </ModalShell>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-[color:var(--text)]">Combo trong nhóm</div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">Danh sách combo đã gán vào danh mục này.</div>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {(combosByCategoryId.get(category.id) ?? []).map((combo: any) => (
                      <Link
                        key={combo.id}
                        href={`/combos/${combo.id}`}
                        className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-3 transition hover:bg-white/10"
                      >
                        <div className="truncate text-sm font-medium text-[color:var(--text)]">{combo.name}</div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">
                          {combo.code} · {combo.phase === 1 ? "1 pha" : "3 pha"} · {Number(combo.solar_kw ?? 0)} kWp
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-2 py-0.5 text-[color:var(--text)]">
                            {combo.status === "active" ? "Active" : combo.status || "Draft"}
                          </span>
                          {Number(combo.battery_kwh ?? 0) > 0 ? (
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-2 py-0.5 text-[color:var(--accent)]">
                              Pin {Number(combo.battery_kwh).toFixed(1)} kWh
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                    {!(combosByCategoryId.get(category.id) ?? []).length ? (
                      <div className="rounded-2xl border border-dashed border-[color:var(--border)] px-3 py-3 text-sm text-[color:var(--muted)]">
                        Chưa có combo nào trong nhóm này.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-[color:var(--muted)]">Trang {page} / {getPageCount(Number(categoriesRes.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
