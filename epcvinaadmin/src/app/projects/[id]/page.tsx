import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();
  const [projectRes, customerRes, orderRes, orderItemsRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("customers").select("*"),
    supabase.from("orders").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", (await supabase.from("orders").select("id").eq("project_id", id).maybeSingle()).data?.id ?? ""),
  ]);
  const project = projectRes.data;
  if (!project) notFound();
  const customer = (customerRes.data ?? []).find((item: any) => item.id === project.customer_id) ?? null;
  const order = orderRes.data ?? null;
  const orderItems = order ? (orderItemsRes.data ?? []) : [];

  const combos = ((await supabase.from("combos").select("*").order("sort_order", { ascending: true })).data ?? []).map(normalizeCombo);
  const products = ((await supabase.from("products").select("*").order("sort_order", { ascending: true })).data ?? []).map(normalizeProduct);

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-4 md:px-0">
        <div className="mb-6 flex items-center justify-between">
          <SectionTitle eyebrow="CRM" title={project.name} description={project.address || "Chi tiết dự án"} />
          <div className="flex gap-2">
            <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Back
            </Link>
            <Link href={`/projects/${project.id}/edit`} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950">
              Sửa
            </Link>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <ThemeCard className="p-6">
            <div className="text-sm text-slate-400">Khách hàng</div>
            <div className="mt-2 text-xl font-semibold text-white">{customer?.name || "-"}</div>
            <div className="mt-2 text-sm text-slate-300">{customer?.phone || customer?.email || "-"}</div>
          </ThemeCard>
          <ThemeCard className="p-6">
            <div className="text-sm text-slate-400">Đơn hàng</div>
            <div className="mt-2 text-xl font-semibold text-white">{order?.order_no || order?.slug || "-"}</div>
            <div className="mt-2 text-sm text-slate-300">{order ? `${Number(order.total ?? 0).toLocaleString("vi-VN")} đ` : "-"}</div>
          </ThemeCard>
          <ThemeCard className="p-6">
            <div className="text-sm text-slate-400">Trạng thái</div>
            <div className="mt-2 text-xl font-semibold text-white">{project.status}</div>
            <div className="mt-2 text-sm text-slate-300">Slug: {project.slug}</div>
          </ThemeCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Order items" title="Combo liên quan" description="Các combo gắn vào đơn hàng từ dự án." />
            <div className="mt-4 space-y-3">
              {orderItems.filter((item: any) => item.item_type === "combo").map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="font-medium text-white">{item.item_name}</div>
                  <div className="text-xs text-slate-400">SL {item.quantity} · {Number(item.total_price ?? 0).toLocaleString("vi-VN")} đ</div>
                </div>
              ))}
              {!orderItems.filter((item: any) => item.item_type === "combo").length && <div className="text-sm text-slate-400">Chưa có combo.</div>}
            </div>
          </ThemeCard>

          <ThemeCard className="p-6">
            <SectionTitle eyebrow="Order items" title="Thiết bị liên quan" description="Các thiết bị gắn vào đơn hàng từ dự án." />
            <div className="mt-4 space-y-3">
              {orderItems.filter((item: any) => item.item_type === "product").map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="font-medium text-white">{item.item_name}</div>
                  <div className="text-xs text-slate-400">SL {item.quantity} · {Number(item.total_price ?? 0).toLocaleString("vi-VN")} đ</div>
                </div>
              ))}
              {!orderItems.filter((item: any) => item.item_type === "product").length && <div className="text-sm text-slate-400">Chưa có thiết bị.</div>}
            </div>
          </ThemeCard>
        </section>

        <ThemeCard className="mt-6 p-6">
          <SectionTitle eyebrow="Catalog" title="Combo và thiết bị khả dụng" description="Danh sách tham chiếu nhanh để đối chiếu khi chỉnh dự án." />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-white">Combo</div>
              <div className="space-y-2">
                {combos.map((combo) => (
                  <div key={combo.id} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                    {combo.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-white">Thiết bị</div>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white">
                    {product.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
