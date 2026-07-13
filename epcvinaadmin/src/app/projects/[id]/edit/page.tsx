import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProjectSelectionPicker } from "@/components/ProjectSelectionPicker";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { upsertProjectWithDependencies } from "@/lib/project-form-actions";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function updateProject(formData: FormData) {
  "use server";
  const projectId = String(formData.get("id") ?? "");
  const nextId = await upsertProjectWithDependencies(formData, projectId);
  revalidatePath("/projects");
  revalidatePath("/customers");
  revalidatePath("/orders");
  redirect(nextId ? `/projects/${nextId}` : "/projects");
}

export default async function ProjectEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();
  const projectRes = await supabase.from("projects").select("*").eq("id", id).single();
  const project = projectRes.data;
  if (!project) notFound();
  const [customers, combos, products, orders] = await Promise.all([
    supabase.from("customers").select("*").order("sort_order", { ascending: true }),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("orders").select("*").eq("project_id", id).maybeSingle(),
  ]);
  const order = orders.data ?? null;
  const orderItems = order ? ((await supabase.from("order_items").select("*").eq("order_id", order.id).order("sort_order", { ascending: true })).data ?? []) : [];
  const comboOptions = (combos.data ?? []).map((combo: any) => normalizeCombo(combo));
  const productOptions = (products.data ?? []).map((product: any) => normalizeProduct(product));
  const initialComboRows = orderItems.filter((item: any) => item.item_type === "combo").map((item: any) => ({ id: String(item.combo_id ?? ""), quantity: Number(item.quantity ?? 1) }));
  const initialProductRows = orderItems.filter((item: any) => item.item_type === "product").map((item: any) => ({ id: String(item.product_id ?? ""), quantity: Number(item.quantity ?? 1) }));

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title={`Sửa dự án: ${project.name}`} description="Sửa dự án và tự đồng bộ khách hàng/đơn hàng." />
          <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>

        <form action={updateProject} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <input type="hidden" name="id" value={project.id} />
          <div className="grid gap-3 md:grid-cols-2">
            <SlugField name="name" label="Tên dự án" defaultValue={project.name} defaultSlug={project.slug} />
            <input name="code" defaultValue={project.code ?? ""} placeholder="Mã dự án" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <select name="customer_id" defaultValue={project.customer_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2">
              <option value="">Chọn khách hàng</option>
              {(customers.data ?? []).map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <input name="address" defaultValue={project.address ?? ""} placeholder="Địa chỉ công trình" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
            <select name="status" defaultValue={project.status ?? "inactive"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <textarea name="note" defaultValue={project.note ?? ""} rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
          </div>

          <div className="mt-6">
            <ProjectSelectionPicker combos={comboOptions} products={productOptions} initialComboRows={initialComboRows} initialProductRows={initialProductRows} />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <input name="order_no" defaultValue={order?.order_no ?? ""} placeholder="Để trống để tự sinh mã đơn hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <select name="order_type" defaultValue={order?.order_type ?? "combo"} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
              <option value="combo">Combo</option>
              <option value="device">Thiết bị</option>
            </select>
            <select name="order_status" defaultValue={order?.status ?? "inactive"} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input name="order_date" type="date" defaultValue={order?.order_date ?? ""} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_subtotal" type="number" defaultValue={order?.subtotal ?? 0} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_discount" type="number" defaultValue={order?.discount ?? 0} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_total" type="number" defaultValue={order?.total ?? 0} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <textarea name="order_note" rows={3} defaultValue={order?.note ?? ""} placeholder="Ghi chú đơn hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white md:col-span-4" />
          </div>

          <button type="submit" className="mt-6 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Lưu dự án
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
