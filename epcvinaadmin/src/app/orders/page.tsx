import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateOrderNo } from "@/lib/order-number";
import { slugify } from "@/lib/slug";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function normalizeQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

async function createOrder(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("order_no") ?? "").trim() || String(formData.get("slug") ?? "").trim();
  const customerId = String(formData.get("customer_id") ?? "").trim() || null;
  const projectId = String(formData.get("project_id") ?? "").trim() || null;
  const orderNo =
    String(formData.get("order_no") ?? "").trim() ||
    (await generateOrderNo(supabase, {
      projectName: projectId ? (await supabase.from("projects").select("name").eq("id", projectId).maybeSingle()).data?.name ?? "" : "",
      customerName: customerId ? (await supabase.from("customers").select("name").eq("id", customerId).maybeSingle()).data?.name ?? "" : "",
      orderType: String(formData.get("order_type") ?? "combo"),
    }));
  await supabase.from("orders").insert({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    customer_id: customerId,
    project_id: projectId,
    order_no: orderNo,
    order_type: String(formData.get("order_type") ?? "combo"),
    status: String(formData.get("status") ?? "inactive"),
    order_date: String(formData.get("order_date") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    subtotal: Number(formData.get("subtotal") ?? 0),
    discount: Number(formData.get("discount") ?? 0),
    total: Number(formData.get("total") ?? 0),
  });
  revalidatePath("/orders");
  redirect("/orders");
}

async function updateOrder(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const name = String(formData.get("order_no") ?? "").trim() || String(formData.get("slug") ?? "").trim();
  const customerId = String(formData.get("customer_id") ?? "").trim() || null;
  const projectId = String(formData.get("project_id") ?? "").trim() || null;
  const orderNo =
    String(formData.get("order_no") ?? "").trim() ||
    (await generateOrderNo(supabase, {
      projectName: projectId ? (await supabase.from("projects").select("name").eq("id", projectId).maybeSingle()).data?.name ?? "" : "",
      customerName: customerId ? (await supabase.from("customers").select("name").eq("id", customerId).maybeSingle()).data?.name ?? "" : "",
      orderType: String(formData.get("order_type") ?? "combo"),
    }));
  await supabase.from("orders").update({
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    customer_id: customerId,
    project_id: projectId,
    order_no: orderNo,
    order_type: String(formData.get("order_type") ?? "combo"),
    status: String(formData.get("status") ?? "inactive"),
    order_date: String(formData.get("order_date") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    subtotal: Number(formData.get("subtotal") ?? 0),
    discount: Number(formData.get("discount") ?? 0),
    total: Number(formData.get("total") ?? 0),
  }).eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/orders");
  redirect("/orders");
}

export default async function OrdersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q).toLowerCase();
  const statusFilter = normalizeQuery(params.status);
  const typeFilter = normalizeQuery(params.type);
  const supabase = createSupabaseAdminClient();
  const [orders, customers, projects, comboItemsRes, deviceItemsRes] = supabase
    ? await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*").order("sort_order", { ascending: true }),
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("order_items").select("id, order_id, item_type").eq("item_type", "combo"),
        supabase.from("order_items").select("id, order_id, item_type").eq("item_type", "product"),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];
  const combosCount = comboItemsRes.data?.length ?? 0;
  const deviceCount = deviceItemsRes.data?.length ?? 0;
  const filteredOrders = (orders.data ?? []).filter((row: any) => {
    const customer = (customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "";
    const project = (projects.data ?? []).find((p: any) => p.id === row.project_id)?.name || "";
    const matchesQuery = !query || [row.order_no, row.slug, customer, project].join(" ").toLowerCase().includes(query);
    const matchesStatus = !statusFilter || String(row.status ?? "") === statusFilter;
    const matchesType = !typeFilter || String(row.order_type ?? "") === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Sales" title="Đơn hàng" description="Đơn hàng sẽ link tới khách hàng, dự án và chi tiết combo/thiết bị." />
          <div className="flex gap-2">
            <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Dự án</Link>
            <Link href="/customers" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Khách hàng</Link>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">Đơn hàng</div>
            <div className="mt-2 text-3xl font-semibold text-white">{(orders.data ?? []).length}</div>
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
          <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lọc</button>
        </form>
        <div className="mb-4 flex justify-end">
          <ModalShell trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm đơn hàng</span>} title="Thêm đơn hàng" description="Tạo đơn hàng mới.">
            <form action={createOrder} className="grid gap-3">
              <SlugField name="order_no" label="Mã đơn hàng" placeholder="Sẽ tự sinh nếu để trống" />
              <select name="customer_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Chọn khách hàng</option>
                {(customers.data ?? []).map((customer: any) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
              <select name="project_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Chọn dự án</option>
                {(projects.data ?? []).map((project: any) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
              <select name="order_type" defaultValue="combo" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="combo">Combo</option>
                <option value="device">Thiết bị</option>
              </select>
              <select name="status" defaultValue="inactive" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input name="order_date" type="date" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <div className="grid grid-cols-3 gap-3">
                <input name="subtotal" type="number" placeholder="Tổng trước giảm" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <input name="discount" type="number" placeholder="Chiết khấu" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <input name="total" type="number" placeholder="Tổng thanh toán" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              </div>
              <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Tạo đơn hàng</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Đơn hàng</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Dự án</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Tổng tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredOrders.map((row: any) => (
                  <tr key={row.id} className="bg-slate-950/40">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{row.order_no || row.slug}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                          {row.slug}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                          {row.order_no || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{(customers.data ?? []).find((c: any) => c.id === row.customer_id)?.name || "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{(projects.data ?? []).find((p: any) => p.id === row.project_id)?.name || "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{row.order_type || "-"}</td>
                    <td className="px-4 py-3 text-slate-200">{Number(row.total ?? 0).toLocaleString("vi-VN")} đ</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        row.status === "active"
                          ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                          : "border-slate-400/30 bg-slate-400/15 text-slate-200"
                      }`}>
                        {row.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/orders/${row.id}`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Chi tiết</Link>
                        <ModalShell trigger={<span className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">Sửa</span>} title={`Sửa đơn hàng: ${row.order_no || row.slug}`} description="Chỉnh nhanh trong modal.">
                    <form action={updateOrder} className="grid gap-3">
                      <input type="hidden" name="id" value={row.id} />
                      <SlugField name="order_no" label="Mã đơn hàng" defaultValue={row.order_no ?? ""} defaultSlug={row.slug} />
                      <select name="customer_id" defaultValue={row.customer_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="">Chọn khách hàng</option>
                        {(customers.data ?? []).map((customer: any) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                      </select>
                      <select name="project_id" defaultValue={row.project_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="">Chọn dự án</option>
                        {(projects.data ?? []).map((project: any) => <option key={project.id} value={project.id}>{project.name}</option>)}
                      </select>
                      <select name="order_type" defaultValue={row.order_type ?? "combo"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="combo">Combo</option>
                        <option value="device">Thiết bị</option>
                      </select>
                      <select name="status" defaultValue={row.status ?? "inactive"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <input name="order_date" type="date" defaultValue={row.order_date ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <div className="grid grid-cols-3 gap-3">
                        <input name="subtotal" type="number" defaultValue={row.subtotal ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        <input name="discount" type="number" defaultValue={row.discount ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                        <input name="total" type="number" defaultValue={row.total ?? 0} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      </div>
                      <textarea name="note" defaultValue={row.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                      <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu</button>
                    </form>
                        </ModalShell>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredOrders.length && <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-sm text-slate-400">Không có đơn hàng phù hợp bộ lọc.</div>}
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
