import { AdminShell } from "@/components/AdminShell";
import { ModalShell } from "@/components/ModalShell";
import { SectionTitle } from "@/components/SectionTitle";
import { SupplierProductMappingForm } from "@/components/SupplierProductMappingForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPage, getPageCount, getPageRange, getPageSize } from "@/lib/pagination";
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

export default async function SupplierProductsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const page = getPage(params.page);
  const pageSize = getPageSize(params.pageSize, 20, 50);
  const { start, end } = getPageRange(page, pageSize);
  const supabase = createSupabaseAdminClient();
  const [rows] = supabase
    ? await Promise.all([
        supabase.from("supplier_products").select("id, supplier_id, product_id, supplier_sku, supplier_price, min_order_qty, lead_time_days, note, created_at, suppliers(name), products(name)", { count: "exact" }).order("created_at", { ascending: false }).range(start, end),
      ])
    : [{ data: [] }];
  return (
    <AdminShell>
      <main className="mx-auto max-w-[1600px] px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="Supply" title="Ánh xạ nhà cung cấp - sản phẩm" description="Mỗi sản phẩm có thể có nhiều nhà cung cấp." />
          <Link href="/suppliers" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Nhà cung cấp</Link>
        </div>
        <div className="mb-4 flex justify-end">
          <ModalShell trigger={<span className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">Thêm ánh xạ</span>} title="Thêm mapping" description="Gắn sản phẩm vào nhà cung cấp.">
            <SupplierProductMappingForm action={createMapping} />
          </ModalShell>
        </div>
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            {(rows.data ?? []).map((row: any) => (
              <div key={row.id} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 lg:grid-cols-[1fr_1fr_1fr_120px] lg:items-center">
                <div className="text-white">{row.suppliers?.name || row.supplier_id || "-"}</div>
                <div className="text-slate-300">{row.products?.name || row.product_id || "-"}</div>
                <div className="text-slate-300">{row.supplier_sku || "-"}</div>
                <div className="text-slate-300">{Number(row.supplier_price ?? 0).toLocaleString("vi-VN")}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-400">Trang {page} / {getPageCount(Number(rows.count ?? 0), pageSize)}</div>
        </section>
      </main>
    </AdminShell>
  );
}
