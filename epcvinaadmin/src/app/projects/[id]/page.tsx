import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { SectionTitle } from "@/components/SectionTitle";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

        <ThemeCard className="mt-6 p-6">
          <SectionTitle eyebrow="Order items" title="Đơn hàng của dự án" description="Combo hoặc thiết bị chỉ hiển thị theo đơn hàng đã tạo, không lấy trực tiếp từ dự án." />
          <div className="mt-4 space-y-3">
            {orderItems.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-white">{item.item_name}</div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.item_type === "combo" ? "Combo" : "Thiết bị"}</div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-400">
                    <div>SL {item.quantity}</div>
                    <div>{Number(item.total_price ?? 0).toLocaleString("vi-VN")} đ</div>
                  </div>
                </div>
              </div>
            ))}
            {!orderItems.length && <div className="text-sm text-slate-400">Chưa có đơn hàng hoặc item nào được gắn với dự án này.</div>}
          </div>
        </ThemeCard>
      </main>
    </AdminShell>
  );
}
