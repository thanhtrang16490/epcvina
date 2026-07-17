import { AdminShell } from "@/components/AdminShell";
import { CrudFilterBar } from "@/components/CrudFilterBar";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
import Link from "next/link";

export const dynamic = "force-dynamic";

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, "\\$&").replace(/,/g, " ");
}

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q).toLowerCase();
  const statusFilter = normalizeQuery(params.status);
  const typeFilter = normalizeQuery(params.type);
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const searchPattern = escapeLike(query);
  let ordersQuery = supabase
    ? supabase
        .from("orders")
        .select("id, order_no, slug, customer_id, project_id, order_type, status, total, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
    : null;
  let customerNameById = new Map<string, string>();
  let projectNameById = new Map<string, string>();
  if (supabase && ordersQuery) {
    if (statusFilter) ordersQuery = ordersQuery.eq("status", statusFilter);
    if (typeFilter) ordersQuery = ordersQuery.eq("order_type", typeFilter);
    if (query) {
      const [matchingCustomers, matchingProjects] = await Promise.all([
        supabase.from("customers").select("id, name").ilike("name", `%${searchPattern}%`),
        supabase.from("projects").select("id, name").ilike("name", `%${searchPattern}%`),
      ]);
      customerNameById = new Map((matchingCustomers.data ?? []).map((row: any) => [String(row.id), String(row.name)]));
      projectNameById = new Map((matchingProjects.data ?? []).map((row: any) => [String(row.id), String(row.name)]));
      const customerIds = Array.from(customerNameById.keys());
      const projectIds = Array.from(projectNameById.keys());
      const clauses = [`order_no.ilike.%${searchPattern}%`, `slug.ilike.%${searchPattern}%`];
      if (customerIds.length) clauses.push(`customer_id.in.(${customerIds.join(",")})`);
      if (projectIds.length) clauses.push(`project_id.in.(${projectIds.join(",")})`);
      ordersQuery = ordersQuery.or(clauses.join(","));
    }
  }
  const orders = ordersQuery ? await ordersQuery.range(start, end) : { data: [], count: 0 };
  const pageOrders = orders.data ?? [];
  const pageOrderIds = pageOrders.map((row: any) => String(row.id));
  const [customers, projects, combos, products, comboItemsRes, deviceItemsRes] = supabase
    ? await Promise.all([
        supabase.from("customers").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("projects").select("id, name, customer_id, sort_order").order("sort_order", { ascending: true }),
        supabase.from("combos").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("products").select("id, name").order("sort_order", { ascending: true }),
        pageOrderIds.length ? supabase.from("order_items").select("id, order_id, item_type").in("order_id", pageOrderIds).eq("item_type", "combo") : Promise.resolve({ data: [] }),
        pageOrderIds.length ? supabase.from("order_items").select("id, order_id, item_type").in("order_id", pageOrderIds).eq("item_type", "product") : Promise.resolve({ data: [] }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];
  const combosCount = comboItemsRes.data?.length ?? 0;
  const deviceCount = deviceItemsRes.data?.length ?? 0;
  const filteredOrders = pageOrders;
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SectionTitle eyebrow="Sales" title="Đơn hàng" description="Đơn hàng sẽ link tới khách hàng, dự án và chi tiết combo/thiết bị." />
          <div className="flex flex-wrap gap-2">
            <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Dự án</Link>
            <Link href="/customers" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Khách hàng</Link>
          </div>
        </div>
        <CrudFilterBar
          subtitle="Sales"
          title={`Đơn hàng (${orders.count ?? filteredOrders.length})`}
          searchLabel="Tìm theo mã đơn, khách hàng, dự án"
          searchValue={query}
          searchSuggestions={pageOrders.slice(0, 8).map((row: any) => ({
            label: row.order_no || row.slug || "Đơn hàng",
            href: `/orders/${row.id}`,
            meta: [customerNameById.get(String(row.customer_id ?? "")) ?? (customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name, projectNameById.get(String(row.project_id ?? "")) ?? (projects.data ?? []).find((p: any) => p.id === row.project_id)?.name]
              .filter(Boolean)
              .join(" · "),
          }))}
          secondaryLinks={[
            { href: "/", label: "Dashboard" },
            { href: "/customers", label: "Khách hàng" },
          ]}
          filters={[
            {
              name: "status",
              label: "Trạng thái",
              value: statusFilter,
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
            {
              name: "type",
              label: "Loại",
              value: typeFilter,
              options: [
                { label: "Combo", value: "combo" },
                { label: "Thiết bị", value: "device" },
              ],
            },
          ]}
        />
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Đơn hàng</div>
            <div className="mt-2 text-3xl font-semibold text-white">{pageOrders.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Combo items</div>
            <div className="mt-2 text-3xl font-semibold text-white">{combosCount}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Thiết bị items</div>
            <div className="mt-2 text-3xl font-semibold text-white">{deviceCount}</div>
          </div>
        </div>
        <form className="mb-4 grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <input name="q" defaultValue={query} placeholder="Tìm theo mã đơn, khách hàng, dự án" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
          <select name="status" defaultValue={statusFilter} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select name="type" defaultValue={typeFilter} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
            <option value="">Tất cả loại</option>
            <option value="combo">Combo</option>
            <option value="device">Thiết bị</option>
          </select>
          <button type="submit" className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lọc</button>
        </form>
        <div className="mb-4 flex justify-end">
          <Link href="/orders/new" className="inline-flex w-full justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950 sm:w-auto">
            Thêm đơn hàng
          </Link>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <ResponsiveTable
            rows={filteredOrders}
            getRowKey={(row: any) => row.id}
            columns={[
              {
                header: "Đơn hàng",
                render: (row: any) => (
                  <div>
                    <div className="font-medium text-white">{row.order_no || row.slug}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">{row.slug}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">{row.order_no || "-"}</span>
                    </div>
                  </div>
                ),
              },
              { header: "Khách hàng", render: (row: any) => (customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "-" },
              { header: "Dự án", render: (row: any) => (projects.data ?? []).find((p: any) => p.id === row.project_id)?.name || "-" },
              { header: "Loại", render: (row: any) => row.order_type || "-" },
              { header: "Tổng tiền", render: (row: any) => `${Number(row.total ?? 0).toLocaleString("vi-VN")} đ` },
              {
                header: "Trạng thái",
                render: (row: any) => (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    row.status === "active"
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                      : "border-slate-400/30 bg-slate-400/15 text-slate-200"
                  }`}>
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                header: "Hành động",
                render: (row: any) => (
                  <div className="flex gap-2">
                    <Link href={`/orders/${row.id}`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Chi tiết</Link>
                    <Link href={`/orders/${row.id}/edit`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</Link>
                  </div>
                ),
              },
            ]}
            mobileTitle={(row: any) => row.order_no || row.slug}
            mobileSummary={(row: any) => `${(customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "-"} · ${(projects.data ?? []).find((p: any) => p.id === row.project_id)?.name || "-"}`}
            mobileDetails={[
              { label: "Loại", render: (row: any) => row.order_type || "-" },
              { label: "Tổng tiền", render: (row: any) => `${Number(row.total ?? 0).toLocaleString("vi-VN")} đ` },
              {
                label: "Trạng thái",
                render: (row: any) => (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    row.status === "active"
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                      : "border-slate-400/30 bg-slate-400/15 text-slate-200"
                  }`}>
                    {row.status === "active" ? "Active" : "Inactive"}
                  </span>
                ),
              },
            ]}
            mobileActions={(row: any) => (
              <>
                <Link href={`/orders/${row.id}`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Chi tiết</Link>
                <Link href={`/orders/${row.id}/edit`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</Link>
              </>
            )}
            emptyState="Không có đơn hàng phù hợp bộ lọc."
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
            <div>
              Trang {page} / {getPageCount(Number(orders.count ?? 0), pageSize)}
            </div>
            <div className="flex gap-2">
              {page > 1 ? <Link href={`?${new URLSearchParams({ ...(params as Record<string, string>), page: String(page - 1), pageSize: String(pageSize) }).toString()}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">Trước</Link> : null}
              {(orders.count ?? 0) > end + 1 ? <Link href={`?${new URLSearchParams({ ...(params as Record<string, string>), page: String(page + 1), pageSize: String(pageSize) }).toString()}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">Sau</Link> : null}
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
