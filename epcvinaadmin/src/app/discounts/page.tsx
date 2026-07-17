import Link from "next/link";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { referenceDataTags } from "@/lib/reference-data";
import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { ModalShell } from "@/components/ModalShell";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCachedDiscounts } from "@/lib/reference-data";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value);
}

async function createDiscount(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("discounts").insert({
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    discount_type: String(formData.get("discount_type") ?? "fixed"),
    value: Number(formData.get("value") ?? 0),
    description: String(formData.get("description") ?? "").trim() || null,
    is_active: String(formData.get("is_active") ?? "true") === "true",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/discounts");
  revalidateTag(referenceDataTags.discounts);
  redirect("/discounts");
}

async function updateDiscount(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("discounts").update({
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    discount_type: String(formData.get("discount_type") ?? "fixed"),
    value: Number(formData.get("value") ?? 0),
    description: String(formData.get("description") ?? "").trim() || null,
    is_active: String(formData.get("is_active") ?? "true") === "true",
    sort_order: Number(formData.get("sort_order") ?? 0),
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/discounts");
  revalidateTag(referenceDataTags.discounts);
  redirect("/discounts");
}

async function deleteDiscount(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("discounts").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/discounts");
  revalidateTag(referenceDataTags.discounts);
  redirect("/discounts");
}

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const supabase = createSupabaseAdminClient();
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 10, 20);
  const { start, end } = getPageRange(page, pageSize);
  const rows = supabase ? await getCachedDiscounts() : [];
  const rowsRes = { data: rows.slice(start, end + 1), count: rows.length };

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <SectionTitle eyebrow="Sales" title="Quản lý chiết khấu" description="Tạo rule chiết khấu để áp vào đơn hàng và tổng tiền." />
          <Link href="/admin/orders" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)]">
            Đơn hàng
          </Link>
        </div>

        <CrudFilterBar
          subtitle="Sales"
          title={`Chiết khấu (${rowsRes.count ?? rows.length})`}
          searchLabel="Tìm theo tên, slug, mô tả"
          searchSuggestions={rows.slice(0, 8).map((row: any) => ({
            label: row.name,
            href: `/admin/discounts`,
            meta: [row.discount_type === "percent" ? `${row.value}%` : `${formatMoney(Number(row.value ?? 0))} đ`, row.description].filter(Boolean).join(" · "),
            group: "Discounts",
          }))}
          secondaryLinks={[{ href: "/admin/orders", label: "Đơn hàng" }]}
        />

        <div className="mt-4 flex justify-end">
          <ModalShell
            trigger={<span className="inline-flex w-full justify-center rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-sm sm:w-auto">Thêm chiết khấu</span>}
            title="Thêm chiết khấu"
            description="Tạo rule chiết khấu mới để chọn trong thông tin đơn hàng."
          >
            <form action={createDiscount} className="grid gap-3">
              <SlugField name="name" label="Tên chiết khấu" placeholder="Ví dụ: Khuyến mãi tháng 7" />
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Loại</span>
                  <select name="discount_type" defaultValue="fixed" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="fixed">Số tiền cố định</option>
                    <option value="percent">Phần trăm</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá trị</span>
                  <input name="value" type="number" step="0.01" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </label>
              </div>
              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mô tả</span>
                <textarea name="description" rows={3} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Trạng thái</span>
                  <select name="is_active" defaultValue="true" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Thứ tự</span>
                  <input name="sort_order" type="number" defaultValue={0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </label>
              </div>
              <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">
                Lưu chiết khấu
              </button>
            </form>
          </ModalShell>
        </div>

        <section className="mt-4 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
          <ResponsiveTable
            rows={rows}
            getRowKey={(row: any) => row.id}
            columns={[
              {
                header: "Tên",
                render: (row: any) => (
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="mt-1 text-xs text-[color:var(--muted)]">{row.slug}</div>
                  </div>
                ),
              },
              { header: "Loại", render: (row: any) => (row.discount_type === "percent" ? "Phần trăm" : "Số tiền cố định") },
              { header: "Giá trị", render: (row: any) => (row.discount_type === "percent" ? `${Number(row.value ?? 0)}%` : `${formatMoney(Number(row.value ?? 0))} đ`) },
              { header: "Mô tả", render: (row: any) => row.description || "-" },
              {
                header: "Trạng thái",
                render: (row: any) => (
                  <span className={(row.is_active ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-700" : "border-slate-400/30 bg-slate-400/15 text-slate-700") + " rounded-full border px-2.5 py-1 text-[10px] font-medium"}>
                    {row.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Hành động",
                render: (row: any) => (
                  <>
                    <ModalShell
                      trigger={<span className="mr-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>}
                      title={`Sửa chiết khấu: ${row.name}`}
                      description="Cập nhật rule chiết khấu."
                    >
                      <form action={updateDiscount} className="grid gap-3">
                        <input type="hidden" name="id" value={row.id} />
                        <SlugField name="name" label="Tên chiết khấu" defaultValue={row.name} defaultSlug={row.slug} />
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Loại</span>
                            <select name="discount_type" defaultValue={row.discount_type ?? "fixed"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                              <option value="fixed">Số tiền cố định</option>
                              <option value="percent">Phần trăm</option>
                            </select>
                          </label>
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá trị</span>
                            <input name="value" type="number" step="0.01" defaultValue={row.value ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          </label>
                        </div>
                        <label className="grid gap-2">
                          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mô tả</span>
                          <textarea name="description" rows={3} defaultValue={row.description ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        </label>
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Trạng thái</span>
                            <select name="is_active" defaultValue={row.is_active ? "true" : "false"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </label>
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Thứ tự</span>
                            <input name="sort_order" type="number" defaultValue={row.sort_order ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          </label>
                        </div>
                        <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                      </form>
                    </ModalShell>
                    <form action={deleteDiscount} className="inline">
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">Xóa</button>
                    </form>
                  </>
                ),
              },
            ]}
            mobileTitle={(row: any) => row.name}
            mobileSummary={(row: any) => `${row.discount_type === "percent" ? "Phần trăm" : "Số tiền cố định"} · ${row.discount_type === "percent" ? `${Number(row.value ?? 0)}%` : `${formatMoney(Number(row.value ?? 0))} đ`}`}
            mobileDetails={[
              { label: "Mô tả", render: (row: any) => row.description || "-" },
              {
                label: "Trạng thái",
                render: (row: any) => (
                  <span className={(row.is_active ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-700" : "border-slate-400/30 bg-slate-400/15 text-slate-700") + " rounded-full border px-2.5 py-1 text-[10px] font-medium"}>
                    {row.is_active ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            mobileActions={(row: any) => (
              <>
                <ModalShell
                  trigger={<span className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>}
                  title={`Sửa chiết khấu: ${row.name}`}
                  description="Cập nhật rule chiết khấu."
                >
                  <form action={updateDiscount} className="grid gap-3">
                    <input type="hidden" name="id" value={row.id} />
                    <SlugField name="name" label="Tên chiết khấu" defaultValue={row.name} defaultSlug={row.slug} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Loại</span>
                        <select name="discount_type" defaultValue={row.discount_type ?? "fixed"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                          <option value="fixed">Số tiền cố định</option>
                          <option value="percent">Phần trăm</option>
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá trị</span>
                        <input name="value" type="number" step="0.01" defaultValue={row.value ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </label>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mô tả</span>
                      <textarea name="description" rows={3} defaultValue={row.description ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Trạng thái</span>
                        <select name="is_active" defaultValue={row.is_active ? "true" : "false"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Thứ tự</span>
                        <input name="sort_order" type="number" defaultValue={row.sort_order ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </label>
                    </div>
                    <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                  </form>
                </ModalShell>
                <form action={deleteDiscount} className="inline">
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">Xóa</button>
                </form>
              </>
            )}
            emptyState="Chưa có chiết khấu nào."
          />
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
            <span>Trang {page} / {getPageCount(Number(rowsRes.count ?? 0), pageSize)}</span>
            <div className="flex gap-2">
              {page > 1 ? <Link href={`?${new URLSearchParams({ ...(params as Record<string, string>), page: String(page - 1), pageSize: String(pageSize) }).toString()}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-[color:var(--text)]">Trước</Link> : null}
              {(rowsRes.count ?? 0) > end + 1 ? <Link href={`?${new URLSearchParams({ ...(params as Record<string, string>), page: String(page + 1), pageSize: String(pageSize) }).toString()}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-[color:var(--text)]">Sau</Link> : null}
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
