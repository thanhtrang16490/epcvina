import { AdminShell } from "@/components/AdminShell";
import { OrderFormPage } from "@/components/OrderFormPage";
import { generateOrderPdfAction, updateOrderAction } from "@/app/orders/actions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { comboItemGroups } from "@/lib/combo-builder";
import { normalizeComboItem } from "@/lib/supabase/normalize";
import { getCachedDiscounts, getCachedPaymentPolicies } from "@/lib/reference-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  if (!supabase) notFound();

  const [orderRes, discounts, paymentPolicies, combos, products, itemsRes, comboItemsRes] = await Promise.all([
    supabase.from("orders").select("id, slug, customer_id, project_id, order_no, order_type, status, order_date, note, subtotal, discount, total, payment_method, discount_id, discount_name, discount_type, discount_value, payment_policy_id, payment_policy_name, payment_policy_code, payment_policy_deposit_percent, payment_policy_delivery_percent, payment_policy_acceptance_percent, deposit_amount, delivery_amount, acceptance_amount, pdf_generated_at, pdf_url, created_at, updated_at, customer_type, invoice_customer_id, invoice_contact_id").eq("id", id).single(),
    getCachedDiscounts(),
    getCachedPaymentPolicies(),
    supabase.from("combos").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("products").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("order_items").select("id, order_id, combo_id, product_id, item_name, item_type, quantity, unit_price, total_price, note, sort_order, snapshot_data, created_at").eq("order_id", id).order("sort_order", { ascending: true }),
    supabase.from("combo_items").select("id, combo_id, category, item_name, quantity, unit_price_vat, total_price_vat, cost_price, total_cost_price, sort_order, sheet_group, product_id").order("sort_order", { ascending: true }),
  ]);

  const order = orderRes.data;
  if (!order) notFound();

  const [customerRes, projectRes, invoiceCustomerRes, invoiceContactRes] = await Promise.all([
    order.customer_id ? supabase.from("customers").select("id, name").eq("id", order.customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.project_id ? supabase.from("projects").select("id, name").eq("id", order.project_id).maybeSingle() : Promise.resolve({ data: null }),
    order.invoice_customer_id ? supabase.from("customers").select("id, name").eq("id", order.invoice_customer_id).maybeSingle() : Promise.resolve({ data: null }),
    order.invoice_contact_id ? supabase.from("customers").select("id, name").eq("id", order.invoice_contact_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const customer = customerRes.data ?? null;
  const project = projectRes.data ?? null;
  const invoiceCustomer = invoiceCustomerRes.data ?? null;
  const invoiceContact = invoiceContactRes.data ?? null;

  const initialLines = (itemsRes.data ?? []).map((item: any) => ({
    line_type: item.item_type === "product" ? "product" : "combo",
    combo_id: String(item.combo_id ?? ""),
    product_id: String(item.product_id ?? ""),
    item_name: String(item.item_name ?? ""),
    quantity: Number(item.quantity ?? 1),
    unit_price: Number(item.unit_price ?? 0),
    sort_order: Number(item.sort_order ?? 0),
    note: String(item.note ?? ""),
  }));

  const comboBomMap = (combos.data ?? []).reduce<Record<string, { name: string; groups: Array<[string, any[]]>; rows: any[] }>>((acc, combo: any) => {
    const rows = (comboItemsRes.data ?? [])
      .filter((item: any) => String(item.combo_id ?? "") === String(combo.id))
      .map((item: any) => normalizeComboItem(item));
    const groups = comboItemGroups
      .map((group) => [
        group.label,
        rows.filter((row) => String(row.sheet_group ?? "") === group.id),
      ] as const)
      .filter(([, groupRows]) => groupRows.length > 0) as Array<[string, any[]]>;
    acc[String(combo.id)] = { name: String(combo.name), groups, rows };
    return acc;
  }, {});

  return (
    <AdminShell>
      <OrderFormPage
        title={`Sửa đơn hàng: ${String(order.order_no ?? order.slug ?? "")}`}
        submitLabel="Lưu đơn hàng"
        action={updateOrderAction}
        pdfAction={generateOrderPdfAction}
        orderId={String(order.id)}
        discounts={(discounts.data ?? []).map((discount: any) => ({ id: String(discount.id), name: String(discount.name), discount_type: String(discount.discount_type ?? "fixed"), value: Number(discount.value ?? 0), is_active: discount.is_active }))}
        paymentPolicies={(paymentPolicies.data ?? []).map((policy: any) => ({ id: String(policy.id), name: String(policy.name), policy_code: String(policy.policy_code ?? "3:6:1"), deposit_percent: Number(policy.deposit_percent ?? 30), delivery_percent: Number(policy.delivery_percent ?? 60), acceptance_percent: Number(policy.acceptance_percent ?? 10), is_active: policy.is_active }))}
        combos={(combos.data ?? []).map((combo: any) => ({ id: String(combo.id), name: String(combo.name) }))}
        products={(products.data ?? []).map((product: any) => ({ id: String(product.id), name: String(product.name) }))}
        comboBomMap={comboBomMap}
        initialValues={{
          id: String(order.id),
          order_no: String(order.order_no ?? ""),
          customer_id: String(order.customer_id ?? ""),
          project_id: String(order.project_id ?? ""),
          order_type: String(order.order_type ?? "combo"),
          status: String(order.status ?? "inactive"),
          order_date: String(order.order_date ?? ""),
          payment_method: String(order.payment_method ?? "bank_transfer"),
          discount_id: String(order.discount_id ?? ""),
          discount_name: String(order.discount_name ?? ""),
          discount_type: String(order.discount_type ?? ""),
          discount_value: Number(order.discount_value ?? 0),
          payment_policy_id: String(order.payment_policy_id ?? ""),
          payment_policy_name: String(order.payment_policy_name ?? ""),
          payment_policy_code: String(order.payment_policy_code ?? ""),
          payment_policy_deposit_percent: Number(order.payment_policy_deposit_percent ?? 30),
          payment_policy_delivery_percent: Number(order.payment_policy_delivery_percent ?? 60),
          payment_policy_acceptance_percent: Number(order.payment_policy_acceptance_percent ?? 10),
          deposit_amount: Number(order.deposit_amount ?? 0),
          delivery_amount: Number(order.delivery_amount ?? 0),
          acceptance_amount: Number(order.acceptance_amount ?? 0),
          subtotal: Number(order.subtotal ?? 0),
          discount: Number(order.discount ?? 0),
          total: Number(order.total ?? 0),
          pdf_generated_at: order.pdf_generated_at ? String(order.pdf_generated_at) : undefined,
          pdf_url: order.pdf_url ? String(order.pdf_url) : undefined,
          note: String(order.note ?? ""),
        }}
        initialLines={initialLines}
        customerLabel={customer?.name ?? ""}
        projectLabel={project?.name ?? ""}
        invoiceCustomerLabel={invoiceCustomer?.name ?? ""}
        invoiceContactLabel={invoiceContact?.name ?? ""}
      />
    </AdminShell>
  );
}
