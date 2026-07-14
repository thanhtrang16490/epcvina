import { AdminShell } from "@/components/AdminShell";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createMapping(formData: FormData) {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  await supabase.from("supplier_products").upsert({
    supplier_id: String(formData.get("supplier_id") ?? ""),
    product_id: String(formData.get("product_id") ?? ""),
    supplier_sku: String(formData.get("supplier_sku") ?? "").trim() || null,
    supplier_price: Number(formData.get("supplier_price") ?? 0),
    min_order_qty: Number(formData.get("min_order_qty") ?? 1),
    lead_time_days: String(formData.get("lead_time_days") ?? "").trim() ? Number(formData.get("lead_time_days") ?? 0) : null,
    note: String(formData.get("note") ?? "").trim() || null,
  }, { onConflict: "supplier_id,product_id" });
  revalidatePath("/supplier-products");
  redirect("/supplier-products");
}

export default async function SupplierProductsPage() {
  const supabase = createSupabaseAdminClient();
  const [rows, suppliers, products] = supabase
    ? await Promise.all([
        supabase.from("supplier_products").select("*").order("created_at", { ascending: false }),
        supabase.from("suppliers").select("*").order("sort_order", { ascending: true }),
        supabase.from("products").select("*").order("sort_order", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Supply" title="Ánh xạ nhà cung cấp - sản phẩm" description="Mỗi sản phẩm có thể có nhiều nhà cung cấp." />
          <Link href="/suppliers" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Nhà cung cấp</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm ánh xạ</span>} title="Thêm mapping" description="Gắn sản phẩm vào nhà cung cấp.">
            <form action={createMapping} className="grid gap-3">
              <select name="supplier_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Chọn nhà cung cấp</option>
                {(suppliers.data ?? []).map((supplier: any) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
              <select name="product_id" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Chọn sản phẩm</option>
                {(products.data ?? []).map((product: any) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
              <input name="supplier_sku" placeholder="SKU nhà cung cấp" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <div className="grid grid-cols-3 gap-3">
                <FormattedNumberInput name="supplier_price" placeholder="Giá NCC" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <FormattedNumberInput name="min_order_qty" defaultValue={1} placeholder="MOQ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <FormattedNumberInput name="lead_time_days" placeholder="Lead time" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              </div>
              <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu mapping</button>
            </form>
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            {(rows.data ?? []).map((row: any) => (
              <div key={row.id} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 lg:grid-cols-[1fr_1fr_1fr_120px] lg:items-center">
                <div className="text-white">{(suppliers.data ?? []).find((s: any) => s.id === row.supplier_id)?.name || "-"}</div>
                <div className="text-slate-300">{(products.data ?? []).find((p: any) => p.id === row.product_id)?.name || "-"}</div>
                <div className="text-slate-300">{row.supplier_sku || "-"}</div>
                <div className="text-slate-300">{Number(row.supplier_price ?? 0).toLocaleString("vi-VN")}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
