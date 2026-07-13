import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateOrderNo } from "@/lib/order-number";
import { slugify } from "@/lib/slug";
import { normalizeCombo, normalizeProduct } from "@/lib/supabase/normalize";

type SupabaseClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

function parseRows(formData: FormData, name: string) {
  try {
    const raw = JSON.parse(String(formData.get(name) ?? "[]"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

async function createOrUpdateCustomer(supabase: SupabaseClient, formData: FormData) {
  const customerIdInput = String(formData.get("customer_id") ?? "").trim();
  if (customerIdInput) return customerIdInput;
  const customerName = String(formData.get("customer_name") ?? "").trim();
  if (!customerName) return null;
  const slug = String(formData.get("customer_slug") ?? slugify(customerName)).trim();
  const { data: existing } = await supabase.from("customers").select("id").or(`slug.eq.${slug},name.eq.${customerName}`).maybeSingle();
  if (existing?.id) return existing.id as string;
  const created = await supabase.from("customers").insert({
    slug,
    name: customerName,
    phone: String(formData.get("customer_phone") ?? "").trim() || null,
    email: String(formData.get("customer_email") ?? "").trim() || null,
    tax_code: String(formData.get("customer_tax_code") ?? "").trim() || null,
    address: String(formData.get("customer_address") ?? "").trim() || null,
    note: String(formData.get("customer_note") ?? "").trim() || null,
    is_active: true,
  }).select("id").single();
  return created.data?.id ?? null;
}

async function syncOrderItems(supabase: SupabaseClient, projectId: string, formData: FormData) {
  const products = ((await supabase.from("products").select("*")).data ?? []).map(normalizeProduct);
  const combos = ((await supabase.from("combos").select("*")).data ?? []).map(normalizeCombo);
  const comboRows = parseRows(formData, "project_combo_rows");
  const productRows = parseRows(formData, "project_product_rows");
  const orderNoInput = String(formData.get("order_no") ?? "").trim();
  const payload = {
    slug: String(formData.get("order_slug") ?? slugify(orderNoInput || `project-${projectId}`)).trim(),
    project_id: projectId,
    customer_id: String(formData.get("customer_id") ?? "").trim() || null,
    order_no:
      orderNoInput ||
      (await generateOrderNo(supabase, {
        projectName: String(formData.get("name") ?? "").trim(),
        customerName: String(formData.get("customer_name") ?? "").trim(),
        systemType: String(formData.get("system_type") ?? "").trim(),
        orderType: String(formData.get("order_type") ?? "combo"),
      })),
    order_type: String(formData.get("order_type") ?? "combo"),
    status: String(formData.get("order_status") ?? "inactive"),
    order_date: String(formData.get("order_date") ?? "").trim() || null,
    note: String(formData.get("order_note") ?? "").trim() || null,
    subtotal: Number(formData.get("order_subtotal") ?? 0),
    discount: Number(formData.get("order_discount") ?? 0),
    total: Number(formData.get("order_total") ?? 0),
  };
  const { data: existingOrder } = await supabase.from("orders").select("id").eq("project_id", projectId).maybeSingle();
  const orderId = existingOrder?.id
    ? (await supabase.from("orders").update(payload).eq("id", existingOrder.id).select("id").single()).data?.id
    : (await supabase.from("orders").insert(payload).select("id").single()).data?.id;
  if (!orderId) return null;

  await supabase.from("order_items").delete().eq("order_id", orderId);
  const items: Record<string, unknown>[] = [];
  let sortOrder = 1;
  for (const row of comboRows) {
    const combo = combos.find((item) => item.id === String(row?.id ?? ""));
    const quantity = Number(row?.quantity ?? 1);
    if (!combo || quantity <= 0) continue;
    items.push({
      order_id: orderId,
      combo_id: combo.id,
      product_id: null,
      item_name: combo.name,
      item_type: "combo",
      quantity,
      unit_price: Number(combo.reference_price ?? 0),
      total_price: Number(combo.reference_price ?? 0) * quantity,
      note: "",
      sort_order: sortOrder++,
    });
  }
  for (const row of productRows) {
    const product = products.find((item) => item.id === String(row?.id ?? ""));
    const quantity = Number(row?.quantity ?? 1);
    if (!product || quantity <= 0) continue;
    items.push({
      order_id: orderId,
      combo_id: null,
      product_id: product.id,
      item_name: product.name,
      item_type: "product",
      quantity,
      unit_price: Number(product.sale_price_vat ?? 0),
      total_price: Number(product.sale_price_vat ?? 0) * quantity,
      note: "",
      sort_order: sortOrder++,
    });
  }
  if (items.length) await supabase.from("order_items").insert(items);
  return orderId;
}

export async function upsertProjectWithDependencies(formData: FormData, projectId?: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const name = String(formData.get("name") ?? "").trim();
  const customerId = await createOrUpdateCustomer(supabase, formData);
  const projectPayload = {
    slug: String(formData.get("slug") ?? slugify(name)).trim(),
    name,
    customer_id: customerId || String(formData.get("customer_id") ?? "").trim() || null,
    code: String(formData.get("code") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    status: String(formData.get("status") ?? "inactive"),
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: String(formData.get("status") ?? "inactive") === "active",
  };
  const result = projectId
    ? await supabase.from("projects").update(projectPayload).eq("id", projectId).select("id").single()
    : await supabase.from("projects").insert(projectPayload).select("id").single();
  const nextProjectId = result.data?.id;
  if (nextProjectId) {
    await syncOrderItems(supabase, nextProjectId, formData);
  }
  return nextProjectId ?? null;
}
