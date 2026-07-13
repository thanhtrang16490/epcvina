import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProjectSelectionPicker } from "@/components/ProjectSelectionPicker";
import { SectionTitle } from "@/components/SectionTitle";
import { SlugField } from "@/components/SlugField";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { upsertProjectWithDependencies } from "@/lib/project-form-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createProject(formData: FormData) {
  "use server";
  const projectId = await upsertProjectWithDependencies(formData);
  revalidatePath("/projects");
  revalidatePath("/customers");
  revalidatePath("/orders");
  if (projectId) redirect(`/projects/${projectId}`);
  redirect("/projects");
}

export default async function ProjectNewPage() {
  const supabase = createSupabaseAdminClient();
  const [customers, combos, products] = supabase
    ? await Promise.all([
        supabase.from("customers").select("*").order("sort_order", { ascending: true }),
        supabase.from("combos").select("*").order("sort_order", { ascending: true }),
        supabase.from("products").select("*").order("sort_order", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const comboOptions = (combos.data ?? []).map((combo: any) => normalizeCombo(combo));
  const productOptions = (products.data ?? []).map((product: any) => normalizeProduct(product));

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title="Thêm dự án" description="Tạo dự án, khách hàng và đơn hàng từ cùng một form." />
          <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Back
          </Link>
        </div>

        <form action={createProject} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <SlugField name="name" label="Tên dự án" placeholder="Tên dự án" />
            <input name="code" placeholder="Mã dự án" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <select name="customer_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2">
              <option value="">Chọn khách hàng</option>
              {(customers.data ?? []).map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <div className="text-sm font-medium text-white">Tạo khách hàng mới từ dự án</div>
              <div className="mt-3 grid gap-3">
                <input name="customer_name" placeholder="Tên khách hàng mới" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="customer_phone" placeholder="Số điện thoại" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
                  <input name="customer_email" placeholder="Email" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="customer_tax_code" placeholder="Mã số thuế" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
                  <input name="customer_address" placeholder="Địa chỉ khách hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
                </div>
                <textarea name="customer_note" rows={3} placeholder="Ghi chú khách hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
              </div>
            </div>
            <input name="address" placeholder="Địa chỉ công trình" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
            <select name="status" defaultValue="inactive" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input name="sort_order" type="number" placeholder="Sort order" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
          </div>

          <div className="mt-6">
            <ProjectSelectionPicker combos={comboOptions} products={productOptions} />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <input name="order_no" placeholder="Để trống để tự sinh mã đơn hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <select name="order_type" defaultValue="combo" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
              <option value="combo">Combo</option>
              <option value="device">Thiết bị</option>
            </select>
            <select name="order_status" defaultValue="inactive" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input name="order_date" type="date" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_subtotal" type="number" placeholder="Tổng trước giảm" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_discount" type="number" placeholder="Chiết khấu" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <input name="order_total" type="number" placeholder="Tổng thanh toán" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" />
            <textarea name="order_note" rows={3} placeholder="Ghi chú đơn hàng" className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white md:col-span-4" />
          </div>

          <button type="submit" className="mt-6 rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
            Tạo dự án
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
