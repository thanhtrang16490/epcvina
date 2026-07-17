import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { CustomerCreateForm } from "@/components/CustomerCreateForm";
import { ModalShell } from "@/components/ModalShell";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createCustomer(_: { ok: boolean; error: string | null }, formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Thiếu Supabase admin env" };
  const name = String(formData.get("name") ?? "").trim();
  const { error } = await supabase.from("customers").upsert({
    slug: String(formData.get("slug") ?? "").trim(),
    name,
    customer_type: String(formData.get("customer_type") ?? "contact"),
    parent_company_id: String(formData.get("parent_company_id") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    tax_code: String(formData.get("tax_code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    province: String(formData.get("province") ?? "").trim() || null,
    district: String(formData.get("district") ?? "").trim() || null,
    ward: String(formData.get("ward") ?? "").trim() || null,
    address_detail: String(formData.get("address_detail") ?? "").trim() || null,
    billing_name: String(formData.get("billing_name") ?? "").trim() || null,
    billing_phone: String(formData.get("billing_phone") ?? "").trim() || null,
    billing_email: String(formData.get("billing_email") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: true,
  }, { onConflict: "slug" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/customers");
  return { ok: true, error: null };
}

async function updateCustomer(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("name") ?? "").trim();
  const { error } = await supabase.from("customers").update({
    slug: String(formData.get("slug") ?? "").trim(),
    name,
    customer_type: String(formData.get("customer_type") ?? "contact"),
    parent_company_id: String(formData.get("parent_company_id") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    tax_code: String(formData.get("tax_code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    province: String(formData.get("province") ?? "").trim() || null,
    district: String(formData.get("district") ?? "").trim() || null,
    ward: String(formData.get("ward") ?? "").trim() || null,
    address_detail: String(formData.get("address_detail") ?? "").trim() || null,
    billing_name: String(formData.get("billing_name") ?? "").trim() || null,
    billing_phone: String(formData.get("billing_phone") ?? "").trim() || null,
    billing_email: String(formData.get("billing_email") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("status") ?? "active") === "active",
  }).eq("id", String(formData.get("id") ?? ""));
  if (error) throw error;
  revalidatePath("/customers");
  redirect("/customers");
}

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function CustomersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const supabase = createSupabaseAdminClient();
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const [rowsRes, projectsRes, ordersRes] = supabase
    ? await Promise.all([
        supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active", { count: "exact" }).order("sort_order", { ascending: true }).range(start, end),
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
            <Link href="/admin/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Dự án</Link>
            <Link href="/admin/orders" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Đơn hàng</Link>
          </div>
        </div>
        <CrudFilterBar
          subtitle="CRM"
          title={`Khách hàng (${rowsRes.count ?? rows.length})`}
          searchLabel="Tìm theo tên, điện thoại, email"
          searchSuggestions={rows.slice(0, 8).map((row: any) => ({
            label: row.name,
            href: `/customers/${row.id}`,
            meta: [row.phone, row.email].filter(Boolean).join(" · "),
          }))}
          secondaryLinks={[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/orders", label: "Đơn hàng" },
          ]}
        />
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
            <CustomerCreateForm action={createCustomer} />
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
          <ResponsiveTable
            rows={rows}
            getRowKey={(row: any) => row.id}
            columns={[
              {
                header: "Khách hàng",
                render: (row: any) => {
                  const customerType = row.customer_type ?? "contact";
                  return (
                    <div>
                      <div className="font-medium">{row.name}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--accent)]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--accent)]">
                          {customerType === "company" ? "Doanh nghiệp" : "Liên hệ"}
                        </span>
                        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">
                          {row.slug}
                        </span>
                        {row.parent_company_id ? <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">Thuộc công ty</span> : null}
                        {row.tax_code ? <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">MST {row.tax_code}</span> : null}
                      </div>
                    </div>
                  );
                },
              },
              {
                header: "Liên hệ",
                render: (row: any) => (
                  <div className="text-[color:var(--muted)]">
                    <div>{row.phone || row.billing_phone || "-"}</div>
                    <div className="mt-1 text-xs">{row.email || row.billing_email || "-"}</div>
                  </div>
                ),
              },
              {
                header: "Địa chỉ",
                render: (row: any) => (
                  <div className="text-[color:var(--muted)]">
                    <div>{row.address_detail || row.address || "-"}</div>
                    <div className="mt-1 text-xs">{[row.ward, row.district, row.province].filter(Boolean).join(" · ") || "-"}</div>
                  </div>
                ),
              },
              {
                header: "Lịch sử",
                render: (row: any) => {
                  const projectCount = (projects as any[]).filter((project) => project.customer_id === row.id).length;
                  const orderCount = (orders as any[]).filter((order) => order.customer_id === row.id).length;
                  return (
                    <div className="text-[color:var(--muted)]">
                      <div>{projectCount} dự án</div>
                      <div className="mt-1 text-xs">{orderCount} đơn hàng</div>
                      <Link href={`/customers/${row.id}`} className="mt-2 inline-flex text-xs font-medium text-cyan-600 dark:text-cyan-300">Xem lịch sử</Link>
                    </div>
                  );
                },
              },
              {
                header: "Trạng thái",
                render: (row: any) => (
                  <span className={(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-200" : "rounded-full border border-slate-400/30 bg-slate-400/15 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-200"}>
                    {(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Hành động",
                render: (row: any) => (
                  <ModalShell trigger={<span className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>} title={`Sửa khách hàng: ${row.name}`} description="Chỉnh trực tiếp trong modal.">
                    <form action={updateCustomer} className="grid gap-3">
                      <input type="hidden" name="id" value={row.id} />
                      <SlugField name="name" label="Tên khách hàng" defaultValue={row.name} defaultSlug={row.slug} />
                      <select name="customer_type" defaultValue={row.customer_type ?? "contact"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                        <option value="contact">Liên hệ / Cá nhân</option>
                        <option value="company">Doanh nghiệp</option>
                      </select>
                      <input type="hidden" name="parent_company_id" value={row.parent_company_id ?? ""} />
                      <input name="phone" defaultValue={row.phone ?? ""} placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="email" defaultValue={row.email ?? ""} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="tax_code" defaultValue={row.tax_code ?? ""} placeholder="Mã số thuế" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="province" defaultValue={row.province ?? ""} placeholder="Tỉnh / Thành" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="district" defaultValue={row.district ?? ""} placeholder="Quận / Huyện" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="ward" defaultValue={row.ward ?? ""} placeholder="Xã / Phường" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="address_detail" defaultValue={row.address_detail ?? ""} placeholder="Địa chỉ chi tiết" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="address" defaultValue={row.address ?? ""} placeholder="Địa chỉ đầy đủ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="billing_name" defaultValue={row.billing_name ?? ""} placeholder="Tên xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="billing_phone" defaultValue={row.billing_phone ?? ""} placeholder="SĐT xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <input name="billing_email" defaultValue={row.billing_email ?? ""} placeholder="Email xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <select name="status" defaultValue={row.status ?? (row.is_active ? "active" : "inactive")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <textarea name="note" defaultValue={row.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                    </form>
                  </ModalShell>
                ),
              },
            ]}
            mobileTitle={(row: any) => row.name}
            mobileSummary={(row: any) => {
              const customerType = row.customer_type ?? "contact";
              return `${customerType === "company" ? "Doanh nghiệp" : "Liên hệ"} · ${row.phone || row.billing_phone || "-"}`;
            }}
            mobileDetails={[
              { label: "Email", render: (row: any) => row.email || row.billing_email || "-" },
              { label: "Địa chỉ", render: (row: any) => row.address_detail || row.address || "-" },
              {
                label: "Trạng thái",
                render: (row: any) => (
                  <span className={(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-200" : "rounded-full border border-slate-400/30 bg-slate-400/15 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-200"}>
                    {(row.status ?? (row.is_active ? "active" : "inactive")) === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            mobileActions={(row: any) => (
              <ModalShell trigger={<span className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</span>} title={`Sửa khách hàng: ${row.name}`} description="Chỉnh trực tiếp trong modal.">
                <form action={updateCustomer} className="grid gap-3">
                  <input type="hidden" name="id" value={row.id} />
                  <SlugField name="name" label="Tên khách hàng" defaultValue={row.name} defaultSlug={row.slug} />
                  <select name="customer_type" defaultValue={row.customer_type ?? "contact"} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-[color:var(--text)]">
                    <option value="contact">Liên hệ / Cá nhân</option>
                    <option value="company">Doanh nghiệp</option>
                  </select>
                  <input type="hidden" name="parent_company_id" value={row.parent_company_id ?? ""} />
                  <input name="phone" defaultValue={row.phone ?? ""} placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="email" defaultValue={row.email ?? ""} placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="tax_code" defaultValue={row.tax_code ?? ""} placeholder="Mã số thuế" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="province" defaultValue={row.province ?? ""} placeholder="Tỉnh / Thành" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="district" defaultValue={row.district ?? ""} placeholder="Quận / Huyện" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="ward" defaultValue={row.ward ?? ""} placeholder="Xã / Phường" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="address_detail" defaultValue={row.address_detail ?? ""} placeholder="Địa chỉ chi tiết" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="address" defaultValue={row.address ?? ""} placeholder="Địa chỉ đầy đủ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="billing_name" defaultValue={row.billing_name ?? ""} placeholder="Tên xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="billing_phone" defaultValue={row.billing_phone ?? ""} placeholder="SĐT xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <input name="billing_email" defaultValue={row.billing_email ?? ""} placeholder="Email xuất hoá đơn" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <select name="status" defaultValue={row.status ?? (row.is_active ? "active" : "inactive")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <textarea name="note" defaultValue={row.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                  <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                </form>
              </ModalShell>
            )}
            emptyState="Chưa có khách hàng."
          />
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
            <div>
              Trang {page} / {getPageCount(Number(rowsRes.count ?? rows.length), pageSize)}
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
