import { AdminShell } from "@/components/AdminShell";
import { OrderDetailWorkspace } from "@/components/OrderDetailWorkspace";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { comboItemGroups } from "@/lib/combo-builder";
import { generateOrderPdf } from "@/lib/order-pdf";
import { createOrderPaymentAction } from "@/app/orders/actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();

  const [orderRes, itemsRes, productsRes, combosRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id).order("sort_order", { ascending: true }),
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("combos").select("*").order("sort_order", { ascending: true }),
  ]);

  const order = orderRes.data;
  if (!order) notFound();

  const items = itemsRes.data ?? [];
  const products = (productsRes.data ?? []).map(normalizeProduct);
  const combos = (combosRes.data ?? []).map(normalizeCombo);

  const [customerRes, projectRes] = await Promise.all([
    order.customer_id ? supabase.from("customers").select("*").eq("id", order.customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.project_id ? supabase.from("projects").select("*").eq("id", order.project_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const customer = customerRes.data ?? null;
  const project = projectRes.data ?? null;
  const pdfVersionsRes = await supabase
    .from("order_pdf_versions")
    .select("*")
    .eq("order_id", id)
    .order("generated_at", { ascending: false })
    .limit(8);
  const pdfVersions = pdfVersionsRes.data ?? [];
  const paymentRowsRes = await supabase
    .from("order_payments")
    .select("*")
    .eq("order_id", id)
    .order("payment_date", { ascending: false })
    .order("created_at", { ascending: false });
  const paymentRows = paymentRowsRes.data ?? [];
  const comboItems = items.filter((item: any) => item.item_type === "combo");
  const deviceItems = items.filter((item: any) => item.item_type === "product");
  const subtotalFromItems = items.reduce((sum: number, item: any) => sum + Number(item.total_price ?? 0), 0);
  const subtotal = Number(order.subtotal ?? subtotalFromItems);
  const discount = Number(order.discount ?? 0);
  const total = Number(order.total ?? Math.max(0, subtotal - discount));
  const paidTotal = paymentRows.reduce((sum: number, row: any) => sum + Number(row.amount ?? 0), 0);
  const remainingTotal = Math.max(total - paidTotal, 0);
  const bomGroups = comboItems.length
    ? comboItemGroups.map((group) => {
        const relatedItems = comboItems.flatMap((item: any) => {
          const snapshot = item.snapshot_data ?? {};
          const bomRows = Array.isArray(snapshot.bom_rows) ? snapshot.bom_rows : [];
          return bomRows.filter((bom: any) => {
            const text = `${bom.category ?? ""} ${bom.item_name ?? ""} ${bom.sheet_group ?? ""}`.toLowerCase();
            return group.id === "panel"
              ? text.includes("pin") || text.includes("panel") || text.includes("pv")
              : group.id === "battery"
                ? text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")
                : group.id === "inverter"
                  ? text.includes("inverter") || text.includes("biến tần")
                  : group.id === "mounting"
                    ? text.includes("khung") || text.includes("rail") || text.includes("mount")
                    : group.id === "wiring"
                      ? text.includes("dây") || text.includes("cáp") || text.includes("wire")
                      : group.id === "cabinet"
                        ? text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")
                        : text.includes("tiếp địa") || text.includes("ground");
          });
        });
        return [group.label, relatedItems] as const;
      })
    : [];

  return (
    <AdminShell>
      <OrderDetailWorkspace
        order={order}
        customer={customer}
        project={project}
        items={items}
        comboGroups={bomGroups.filter(([, groupItems]) => groupItems.length > 0) as Array<[string, any[]]>}
        pdfVersions={pdfVersions}
        total={total}
        subtotal={subtotal}
        discount={discount}
        discountLabel={order.discount_name ? String(order.discount_name) : undefined}
        discountType={order.discount_type ? String(order.discount_type) : undefined}
        discountValue={order.discount_value !== null && order.discount_value !== undefined ? Number(order.discount_value) : undefined}
        paymentPolicyLabel={order.payment_policy_name ? String(order.payment_policy_name) : undefined}
        customerHistoryHref={customer?.id ? `/customers/${customer.id}` : undefined}
        projectHistoryHref={project?.id ? `/projects/${project.id}` : undefined}
        paymentRows={paymentRows}
        paidTotal={paidTotal}
        remainingTotal={remainingTotal}
        paymentAction={createOrderPaymentAction}
      />
    </AdminShell>
  );
}
