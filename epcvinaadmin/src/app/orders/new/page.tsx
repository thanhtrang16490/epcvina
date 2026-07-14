import { AdminShell } from "@/components/AdminShell";
import { OrderFormPage } from "@/components/OrderFormPage";
import { createOrderAction } from "@/app/orders/actions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { comboItemGroups } from "@/lib/combo-builder";
import { normalizeComboItem } from "@/lib/supabase/normalize";

export const dynamic = "force-dynamic";

export default async function OrderNewPage() {
  const supabase = createSupabaseAdminClient();
  const [customers, projects, discounts, paymentPolicies, combos, products, comboItems] = supabase
    ? await Promise.all([
        supabase.from("customers").select("*").order("sort_order", { ascending: true }),
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("discounts").select("*").order("sort_order", { ascending: true }),
        supabase.from("payment_policies").select("*").order("sort_order", { ascending: true }),
        supabase.from("combos").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("products").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("combo_items").select("*").order("sort_order", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const comboBomMap = (combos.data ?? []).reduce<Record<string, { name: string; groups: Array<[string, any[]]>; rows: any[] }>>((acc, combo: any) => {
    const rows = (comboItems.data ?? [])
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
        title="Thêm đơn hàng"
        submitLabel="Tạo đơn hàng"
        action={createOrderAction}
        customers={(customers.data ?? []).map((customer: any) => ({ id: String(customer.id), name: String(customer.name), phone: customer.phone, email: customer.email, address: customer.address, tax_code: customer.tax_code, province: customer.province }))}
        projects={(projects.data ?? []).map((project: any) => ({ id: String(project.id), name: String(project.name), customer_id: project.customer_id ? String(project.customer_id) : null, address: project.address, status: project.status }))}
        discounts={(discounts.data ?? []).map((discount: any) => ({ id: String(discount.id), name: String(discount.name), discount_type: String(discount.discount_type ?? "fixed"), value: Number(discount.value ?? 0), is_active: discount.is_active }))}
        paymentPolicies={(paymentPolicies.data ?? []).map((policy: any) => ({ id: String(policy.id), name: String(policy.name), policy_code: String(policy.policy_code ?? "3:6:1"), deposit_percent: Number(policy.deposit_percent ?? 30), delivery_percent: Number(policy.delivery_percent ?? 60), acceptance_percent: Number(policy.acceptance_percent ?? 10), is_active: policy.is_active }))}
        combos={(combos.data ?? []).map((combo: any) => ({ id: String(combo.id), name: String(combo.name) }))}
        products={(products.data ?? []).map((product: any) => ({ id: String(product.id), name: String(product.name) }))}
        comboBomMap={comboBomMap}
        initialValues={{ payment_method: "bank_transfer" }}
      />
    </AdminShell>
  );
}
