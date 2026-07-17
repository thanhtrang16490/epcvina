import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";

export const dynamic = "force-dynamic";

function statusChip(status?: string) {
  switch (status) {
    case "active":
    case "public":
      return "border-emerald-400/30 bg-emerald-400/15 text-emerald-700 dark:text-emerald-200";
    case "inactive":
    case "archive":
    case "draft":
      return "border-slate-400/30 bg-slate-400/15 text-slate-700 dark:text-slate-200";
    default:
      return "border-amber-400/30 bg-amber-400/15 text-amber-700 dark:text-amber-200";
  }
}

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const [projects, customers, orders] = supabase
    ? await Promise.all([
        supabase.from("projects").select("id, name, slug, code, address, status, customer_id, sort_order, created_at", { count: "exact" }).order("sort_order", { ascending: true }).range(start, end),
        supabase.from("customers").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("orders").select("id, project_id, total, order_no, slug, status, created_at").order("created_at", { ascending: false }),
      ])
    : [{ data: [], error: { message: "Thiếu env Supabase service role" } }, { data: [], error: null }, { data: [], error: null }];
  const queryError = projects.error?.message || customers.error?.message || orders.error?.message || null;

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title="Dự án" description="Dự án là nguồn tạo khách hàng và đơn hàng." />
          <div className="flex gap-2">
            <Link href="/admin/projects/new" className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-medium text-slate-950">
              Thêm dự án
            </Link>
            <Link href="/admin/customers" className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200">
              Khách hàng
            </Link>
            <Link href="/admin/orders" className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200">
              Đơn hàng
            </Link>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Tổng dự án</div>
            <div className="mt-2 text-3xl font-semibold text-white">{projects.count ?? (projects.data ?? []).length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Có khách hàng</div>
            <div className="mt-2 text-3xl font-semibold text-white">{(projects.data ?? []).filter((project: any) => project.customer_id).length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Có đơn hàng</div>
            <div className="mt-2 text-3xl font-semibold text-white">{(projects.data ?? []).filter((project: any) => (orders.data ?? []).some((order: any) => order.project_id === project.id)).length}</div>
          </div>
        </div>
        <div className="mb-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Dự án là trung tâm: khi tạo hoặc sửa ở đây, hệ thống sẽ tự đồng bộ khách hàng và đơn hàng liên quan.
        </div>
        {queryError ? (
          <div className="mb-4 rounded-[2rem] border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Supabase query đang báo lỗi: {queryError}
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
          <ResponsiveTable
            rows={projects.data ?? []}
            getRowKey={(row: any) => row.id}
            columns={[
              {
                header: "Dự án",
                render: (row: any) => (
                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">{row.slug}</span>
                      {row.code ? <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[color:var(--muted)]">{row.code}</span> : null}
                    </div>
                  </div>
                ),
              },
              { header: "Khách hàng", render: (row: any) => (customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "-" },
              {
                header: "Đơn hàng",
                render: (row: any) => {
                  const order = (orders.data ?? []).find((item: any) => item.project_id === row.id);
                  return (
                    <div>
                      <div>{order?.order_no || order?.slug || "-"}</div>
                      <div className="mt-1 text-xs">{order ? `${Number(order.total ?? 0).toLocaleString("vi-VN")} đ` : ""}</div>
                    </div>
                  );
                },
              },
              { header: "Địa chỉ", render: (row: any) => row.address || "-" },
              {
                header: "Trạng thái",
                render: (row: any) => (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip(row.status)}`}>
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Hành động",
                render: (row: any) => (
                  <div className="flex gap-2">
                    <Link href={`/projects/${row.id}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Chi tiết</Link>
                    <Link href={`/projects/${row.id}/edit`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</Link>
                  </div>
                ),
              },
            ]}
            mobileTitle={(row: any) => row.name}
            mobileSummary={(row: any) => (customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "-"}
            mobileDetails={[
              {
                label: "Đơn hàng",
                render: (row: any) => {
                  const order = (orders.data ?? []).find((item: any) => item.project_id === row.id);
                  return order?.order_no || order?.slug || "-";
                },
              },
              { label: "Địa chỉ", render: (row: any) => row.address || "-" },
              {
                label: "Trạng thái",
                render: (row: any) => (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusChip(row.status)}`}>
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            mobileActions={(row: any) => (
              <>
                <Link href={`/projects/${row.id}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Chi tiết</Link>
                <Link href={`/projects/${row.id}/edit`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)]">Sửa</Link>
              </>
            )}
            emptyState="Chưa có dự án."
          />
          <div className="mt-4 text-sm text-[color:var(--muted)]">Trang {page} / {getPageCount(Number(projects.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
