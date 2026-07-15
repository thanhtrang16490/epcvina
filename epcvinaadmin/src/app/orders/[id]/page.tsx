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
    supabase.from("orders").select("id, slug, customer_id, project_id, invoice_customer_id, invoice_contact_id, order_no, order_type, status, order_date, note, subtotal, discount, total, payment_method, discount_id, discount_name, discount_type, discount_value, payment_policy_id, payment_policy_name, payment_policy_code, payment_policy_deposit_percent, payment_policy_delivery_percent, payment_policy_acceptance_percent, deposit_amount, delivery_amount, acceptance_amount, pdf_generated_at, pdf_url, created_at, updated_at").eq("id", id).single(),
    supabase.from("order_items").select("id, order_id, combo_id, product_id, item_name, item_type, quantity, unit_price, total_price, note, sort_order, snapshot_data, created_at").eq("order_id", id).order("sort_order", { ascending: true }),
    supabase.from("products").select("id, name, brand, category, cover_image_url, image_urls, technical_specs, status, is_active, sort_order").order("sort_order", { ascending: true }),
    supabase.from("combos").select("id, code, name, slug, phase, solar_kw, battery_kwh, battery_type, cost_price, target_min_price, reference_price, margin, description, sort_order, is_active, status, combo_type, source_kind, combo_category_id").order("sort_order", { ascending: true }),
  ]);

  const order = orderRes.data;
  if (!order) notFound();

  const items = itemsRes.data ?? [];
  const products = (productsRes.data ?? []).map(normalizeProduct);
  const combos = (combosRes.data ?? []).map(normalizeCombo);

  const [customerRes, projectRes, invoiceCustomerRes, invoiceContactRes] = await Promise.all([
    order.customer_id ? supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active, status").eq("id", order.customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.project_id ? supabase.from("projects").select("id, slug, customer_id, name, code, address, capacity, system_type, completion_date, status, note, sort_order, is_active, created_at").eq("id", order.project_id).maybeSingle() : Promise.resolve({ data: null }),
    order.invoice_customer_id ? supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active, status").eq("id", order.invoice_customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.invoice_contact_id ? supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active, status").eq("id", order.invoice_contact_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const customer = customerRes.data ?? null;
  const project = projectRes.data ?? null;
  const invoiceCustomer = invoiceCustomerRes.data ?? null;
  const invoiceContact = invoiceContactRes.data ?? null;
  const resolvedCustomer = customer ?? (project?.customer_id ? (await supabase.from("customers").select("id, slug, name, customer_type, parent_company_id, phone, email, tax_code, address, province, district, ward, address_detail, billing_name, billing_phone, billing_email, note, sort_order, is_active").eq("id", project.customer_id).maybeSingle()).data ?? null : null) ?? invoiceCustomer;
  const pdfVersionsRes = await supabase
    .from("order_pdf_versions")
    .select("id, order_id, version_no, pdf_url, file_name, generated_at, created_at")
    .eq("order_id", id)
    .order("generated_at", { ascending: false })
    .limit(8);
  const pdfVersions = pdfVersionsRes.data ?? [];
  const paymentRowsRes = await supabase
    .from("order_payments")
    .select("id, order_id, amount, payment_date, method, status, note, created_at, updated_at")
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
        customer={resolvedCustomer}
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
        invoiceCustomer={invoiceCustomer}
        invoiceContact={invoiceContact}
      />
    </AdminShell>
  );
}
