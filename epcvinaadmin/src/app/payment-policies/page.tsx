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
import { getCachedPaymentPolicies } from "@/lib/reference-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function createPolicy(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("payment_policies").insert({
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    policy_code: String(formData.get("policy_code") ?? "3:6:1").trim(),
    deposit_percent: Number(formData.get("deposit_percent") ?? 30),
    delivery_percent: Number(formData.get("delivery_percent") ?? 60),
    acceptance_percent: Number(formData.get("acceptance_percent") ?? 10),
    description: String(formData.get("description") ?? "").trim() || null,
    is_active: String(formData.get("is_active") ?? "true") === "true",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/payment-policies");
  revalidateTag(referenceDataTags.paymentPolicies);
  redirect("/payment-policies");
}

async function updatePolicy(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("payment_policies").update({
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    policy_code: String(formData.get("policy_code") ?? "3:6:1").trim(),
    deposit_percent: Number(formData.get("deposit_percent") ?? 30),
    delivery_percent: Number(formData.get("delivery_percent") ?? 60),
    acceptance_percent: Number(formData.get("acceptance_percent") ?? 10),
    description: String(formData.get("description") ?? "").trim() || null,
    is_active: String(formData.get("is_active") ?? "true") === "true",
    sort_order: Number(formData.get("sort_order") ?? 0),
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/payment-policies");
  revalidateTag(referenceDataTags.paymentPolicies);
  redirect("/payment-policies");
}

async function deletePolicy(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("payment_policies").delete().eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/payment-policies");
  revalidateTag(referenceDataTags.paymentPolicies);
  redirect("/payment-policies");
}

function money(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value);
}

export default async function PaymentPoliciesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const supabase = createSupabaseAdminClient();
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 10, 20);
  const { start, end } = getPageRange(page, pageSize);
  const rows = supabase ? await getCachedPaymentPolicies() : [];
  const rowsRes = { data: rows.slice(start, end + 1), count: rows.length };

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between gap-3">
          <SectionTitle eyebrow="Sales" title="Chính sách thanh toán" description="Quản lý các mốc thanh toán cho đơn hàng." />
          <Link href="/admin/orders" className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm text-[color:var(--text)]">
            Đơn hàng
          </Link>
        </div>

        <CrudFilterBar
          subtitle="Sales"
          title={`Chính sách (${rowsRes.count ?? rows.length})`}
          searchLabel="Tìm theo tên, mã chính sách"
          searchSuggestions={rows.slice(0, 8).map((row: any) => ({
            label: row.name,
            href: "/payment-policies",
            meta: `${row.policy_code} · ${row.deposit_percent}% / ${row.delivery_percent}% / ${row.acceptance_percent}%`,
            group: "Policies",
          }))}
          secondaryLinks={[{ href: "/admin/orders", label: "Đơn hàng" }]}
        />

        <div className="mt-4 flex justify-end">
          <ModalShell
            trigger={<span className="inline-flex w-full justify-center rounded-2xl bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-sm sm:w-auto">Thêm chính sách</span>}
            title="Thêm chính sách thanh toán"
            description="Tạo policy mới để chọn trong thông tin đơn hàng."
          >
            <form action={createPolicy} className="grid gap-3">
              <SlugField name="name" label="Tên chính sách" placeholder="Ví dụ: Chính sách 3:6:1" />
              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mã policy</span>
                <input name="policy_code" defaultValue="3:6:1" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Cọc %</span>
                  <input name="deposit_percent" type="number" step="0.01" defaultValue={30} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Tập kết %</span>
                  <input name="delivery_percent" type="number" step="0.01" defaultValue={60} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Nghiệm thu %</span>
                  <input name="acceptance_percent" type="number" step="0.01" defaultValue={10} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
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
              <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu chính sách</button>
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
              { header: "Mã", render: (row: any) => row.policy_code },
              { header: "Cọc", render: (row: any) => `${money(Number(row.deposit_percent ?? 0))}%` },
              { header: "Tập kết", render: (row: any) => `${money(Number(row.delivery_percent ?? 0))}%` },
              { header: "Nghiệm thu", render: (row: any) => `${money(Number(row.acceptance_percent ?? 0))}%` },
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
                      title={`Sửa chính sách: ${row.name}`}
                      description="Cập nhật mốc thanh toán."
                    >
                      <form action={updatePolicy} className="grid gap-3">
                        <input type="hidden" name="id" value={row.id} />
                        <SlugField name="name" label="Tên chính sách" defaultValue={row.name} defaultSlug={row.slug} />
                        <label className="grid gap-2">
                          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mã policy</span>
                          <input name="policy_code" defaultValue={row.policy_code ?? "3:6:1"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        </label>
                        <div className="grid gap-3 md:grid-cols-3">
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Cọc %</span>
                            <input name="deposit_percent" type="number" step="0.01" defaultValue={row.deposit_percent ?? 30} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          </label>
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Tập kết %</span>
                            <input name="delivery_percent" type="number" step="0.01" defaultValue={row.delivery_percent ?? 60} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          </label>
                          <label className="grid gap-2">
                            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Nghiệm thu %</span>
                            <input name="acceptance_percent" type="number" step="0.01" defaultValue={row.acceptance_percent ?? 10} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                          </label>
                        </div>
                        <label className="grid gap-2">
                          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mô tả</span>
                          <textarea name="description" rows={3} defaultValue={row.description ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        </label>
                        <label className="grid gap-2">
                          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Trạng thái</span>
                          <select name="is_active" defaultValue={row.is_active ? "true" : "false"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </label>
                        <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                      </form>
                    </ModalShell>
                    <form action={deletePolicy} className="inline">
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">Xóa</button>
                    </form>
                  </>
                ),
              },
            ]}
            mobileTitle={(row: any) => row.name}
            mobileSummary={(row: any) => row.policy_code}
            mobileDetails={[
              { label: "Cọc", render: (row: any) => `${money(Number(row.deposit_percent ?? 0))}%` },
              { label: "Tập kết", render: (row: any) => `${money(Number(row.delivery_percent ?? 0))}%` },
              { label: "Nghiệm thu", render: (row: any) => `${money(Number(row.acceptance_percent ?? 0))}%` },
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
                  title={`Sửa chính sách: ${row.name}`}
                  description="Cập nhật mốc thanh toán."
                >
                  <form action={updatePolicy} className="grid gap-3">
                    <input type="hidden" name="id" value={row.id} />
                    <SlugField name="name" label="Tên chính sách" defaultValue={row.name} defaultSlug={row.slug} />
                    <label className="grid gap-2">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mã policy</span>
                      <input name="policy_code" defaultValue={row.policy_code ?? "3:6:1"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    </label>
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Cọc %</span>
                        <input name="deposit_percent" type="number" step="0.01" defaultValue={row.deposit_percent ?? 30} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Tập kết %</span>
                        <input name="delivery_percent" type="number" step="0.01" defaultValue={row.delivery_percent ?? 60} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Nghiệm thu %</span>
                        <input name="acceptance_percent" type="number" step="0.01" defaultValue={row.acceptance_percent ?? 10} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </label>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Mô tả</span>
                      <textarea name="description" rows={3} defaultValue={row.description ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Trạng thái</span>
                      <select name="is_active" defaultValue={row.is_active ? "true" : "false"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </label>
                    <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white">Lưu</button>
                  </form>
                </ModalShell>
                <form action={deletePolicy} className="inline">
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">Xóa</button>
                </form>
              </>
            )}
            emptyState="Chưa có chính sách thanh toán."
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
