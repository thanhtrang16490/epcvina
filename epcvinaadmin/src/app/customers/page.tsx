import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createCustomer(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  await supabase.from("customers").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    tax_code: String(formData.get("tax_code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    status: String(formData.get("status") ?? "active"),
    is_active: String(formData.get("status") ?? "active") === "active",
  });
  revalidatePath("/customers");
  redirect("/customers");
}

async function updateCustomer(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  await supabase.from("customers").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    tax_code: String(formData.get("tax_code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    status: String(formData.get("status") ?? "active"),
    is_active: String(formData.get("status") ?? "active") === "active",
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/customers");
  redirect("/customers");
}

export default async function CustomersPage() {
  const supabase = createSupabaseAdminClient();
  const [rowsRes, projectsRes, ordersRes] = supabase
    ? await Promise.all([
        supabase.from("customers").select("*").order("sort_order", { ascending: true }),
        supabase.from("projects").select("id, customer_id").order("sort_order", { ascending: true }),
        supabase.from("orders").select("id, customer_id").order("created_at", { ascending: false }),
      ])
    : [{ data: [], error: { message: "Thiếu env Supabase service role" } }, { data: [], error: null }, { data: [], error: null }];
  const rows = rowsRes.data ?? [];
  const projects = projectsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const queryError = rowsRes.error?.message || projectsRes.error?.message || ordersRes.error?.message || null;
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title="Khách hàng" description="Quản lý khách hàng và liên kết tới dự án, đơn hàng." />
          <div className="flex gap-2">
            <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Dự án</Link>
            <Link href="/orders" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Đơn hàng</Link>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Khách hàng</div>
            <div className="mt-2 text-3xl font-semibold text-white">{rows.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Dự án gắn khách</div>
            <div className="mt-2 text-3xl font-semibold text-white">{projects.filter((project: any) => project.customer_id).length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Đơn hàng gắn khách</div>
            <div className="mt-2 text-3xl font-semibold text-white">{orders.filter((order: any) => order.customer_id).length}</div>
          </div>
        </div>
        <div className="mb-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Mỗi khách hàng có thể gắn nhiều dự án và nhiều đơn hàng. Dùng trang này làm điểm vào để đi sang Projects và Orders.
        </div>
        {queryError ? (
          <div className="mb-4 rounded-[2rem] border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Supabase query đang báo lỗi: {queryError}
          </div>
        ) : null}
        <div className="mb-4 flex justify-end">
          <ModalShell trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm khách hàng</span>} title="Thêm khách hàng" description="Tạo khách hàng mới.">
            <form action={createCustomer} className="grid gap-3">
              <SlugField name="name" label="Tên khách hàng" placeholder="Tên khách hàng" />
              <input name="phone" placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="email" placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="tax_code" placeholder="Mã số thuế" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="address" placeholder="Địa chỉ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <select name="status" defaultValue="active" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Tạo khách hàng</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)]">
            <table className="min-w-full divide-y divide-[color:var(--border)] text-left text-sm">
              <thead className="bg-[color:var(--bg-elevated)] text-[color:var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium">Liên hệ</th>
                  <th className="px-4 py-3 font-medium">Địa chỉ</th>
                  <th className="px-4 py-3 font-medium">Lịch sử</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--border)]">
                {rows.map((row: any) => {
                  const projectCount = (projects as any[]).filter((project) => project.customer_id === row.id).length;
                  const orderCount = (orders as any[]).filter((order) => order.customer_id === row.id).length;
                  return (
                    <tr key={row.id} className="bg-[color:var(--panel)]/70 text-[color:var(--text)]">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium">{row.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                            {row.slug}
                          </span>
                          {row.tax_code ? (
                            <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                              MST {row.tax_code}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-[color:var(--muted)]">
                        <div>{row.phone || "-"}</div>
                        <div className="mt-1 text-xs">{row.email || "-"}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-[color:var(--muted)]">{row.address || "-"}</td>
                      <td className="px-4 py-3 align-top text-[color:var(--muted)]">
                        <div>{projectCount} dự án</div>
                        <div className="mt-1 text-xs">{orderCount} đơn hàng</div>
                        <Link href={`/customers/${row.id}`} className="mt-2 inline-flex text-xs font-medium text-cyan-600 dark:text-cyan-300">
                          Xem lịch sử
                        </Link>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-200" : "rounded-full border border-slate-400/30 bg-slate-400/15 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-200"}>
                          {(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <ModalShell trigger={<span className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>} title={`Sửa khách hàng: ${row.name}`} description="Chỉnh trực tiếp trong modal.">
                    <form action={updateCustomer} className="grid gap-3">
                      <input type="hidden" name="id" value={row.id} />
                      <SlugField name="name" label="Tên khách hàng" defaultValue={row.name} defaultSlug={row.slug} />
                      <input name="phone" defaultValue={row.phone ?? ""} placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="email" defaultValue={row.email ?? ""} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="tax_code" defaultValue={row.tax_code ?? ""} placeholder="Mã số thuế" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="address" defaultValue={row.address ?? ""} placeholder="Địa chỉ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <select name="status" defaultValue={row.status ?? (row.is_active ? "active" : "inactive")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <textarea name="note" defaultValue={row.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                    </form>
                        </ModalShell>
                      </td>
                    </tr>
                  );
                })}
                {!rows.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-sm text-[color:var(--muted)]">
                      Chưa có khách hàng.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
