import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateOrderNo } from "@/lib/order-number";
import { slugify } from "@/lib/slug";
import { buildOrderItemSnapshot } from "@/lib/order-snapshot";
import { generateOrderPdf } from "@/lib/order-pdf";

export type OrderActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type PaymentActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialState: OrderActionState = { ok: true };

function inferOrderTypeFromLines(orderLines: Array<Record<string, unknown>>) {
  const hasCombo = orderLines.some((line) => String(line.line_type ?? "combo") !== "product");
  const hasProduct = orderLines.some((line) => String(line.line_type ?? "combo") === "product");
  if (hasCombo && hasProduct) return "mixed";
  if (hasProduct) return "device";
  return "combo";
}

function calculateDiscountAmount(subtotal: number, discount: { discount_type: string; value: number } | null) {
  if (!discount) return 0;
  if (discount.discount_type === "percent") return Math.min(subtotal, (subtotal * Number(discount.value ?? 0)) / 100);
  return Math.min(subtotal, Number(discount.value ?? 0));
}

function calculatePolicyAmounts(total: number, policy: { deposit_percent: number; delivery_percent: number; acceptance_percent: number } | null) {
  if (!policy) {
    return {
      depositAmount: Math.round(total * 0.3),
      deliveryAmount: Math.round(total * 0.6),
      acceptanceAmount: Math.max(total - Math.round(total * 0.3) - Math.round(total * 0.6), 0),
    };
  }
  const depositAmount = Math.round((total * Number(policy.deposit_percent ?? 30)) / 100);
  const deliveryAmount = Math.round((total * Number(policy.delivery_percent ?? 60)) / 100);
  const acceptanceAmount = Math.max(total - depositAmount - deliveryAmount, 0);
  return { depositAmount, deliveryAmount, acceptanceAmount };
}

function parseOrderLines(formData: FormData) {
  const rawLines = String(formData.get("order_lines_json") ?? "[]");
  try {
    const parsed = JSON.parse(rawLines);
    return Array.isArray(parsed) ? (parsed as Array<Record<string, unknown>>) : [];
  } catch {
    return [];
  }
}

function formatSupabaseError(context: string, error: { message?: string; details?: string; hint?: string }) {
  const parts = [error?.message, error?.details, error?.hint].filter(Boolean).join(" | ");
  return `${context}${parts ? `: ${parts}` : ""}`;
}

function isMissingColumnError(error: { message?: string }) {
  return String(error?.message ?? "").toLowerCase().includes("could not find the 'payment_method' column");
}

async function loadSnapshotRows(supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, discountId: string | null, paymentPolicyId: string | null) {
  const discountRow = discountId
    ? (await supabase.from("discounts").select("id, name, discount_type, value").eq("id", discountId).maybeSingle()).data ?? null
    : null;
  const paymentPolicyRow = paymentPolicyId
    ? (await supabase.from("payment_policies").select("id, name, policy_code, deposit_percent, delivery_percent, acceptance_percent").eq("id", paymentPolicyId).maybeSingle()).data ?? null
    : null;
  return { discountRow, paymentPolicyRow };
}

function buildOrderSnapshotUpdate(
  discountId: string | null,
  discountRow: { name?: unknown; discount_type?: unknown; value?: unknown } | null,
  paymentPolicyId: string | null,
  paymentPolicyRow:
    | {
        name?: unknown;
        policy_code?: unknown;
        deposit_percent?: unknown;
        delivery_percent?: unknown;
        acceptance_percent?: unknown;
      }
    | null,
  paymentPolicyAmounts: { depositAmount: number; deliveryAmount: number; acceptanceAmount: number },
) {
  return {
    discount_id: discountId,
    discount_name: discountRow ? String(discountRow.name ?? "") : null,
    discount_type: discountRow ? String(discountRow.discount_type ?? "") : null,
    discount_value: discountRow ? Number(discountRow.value ?? 0) : null,
    payment_policy_id: paymentPolicyId,
    payment_policy_name: paymentPolicyRow ? String(paymentPolicyRow.name ?? "") : null,
    payment_policy_code: paymentPolicyRow ? String(paymentPolicyRow.policy_code ?? "") : null,
    payment_policy_deposit_percent: paymentPolicyRow ? Number(paymentPolicyRow.deposit_percent ?? 30) : null,
    payment_policy_delivery_percent: paymentPolicyRow ? Number(paymentPolicyRow.delivery_percent ?? 60) : null,
    payment_policy_acceptance_percent: paymentPolicyRow ? Number(paymentPolicyRow.acceptance_percent ?? 10) : null,
    deposit_amount: paymentPolicyAmounts.depositAmount,
    delivery_amount: paymentPolicyAmounts.deliveryAmount,
    acceptance_amount: paymentPolicyAmounts.acceptanceAmount,
  };
}

export async function createOrderAction(_: OrderActionState, formData: FormData): Promise<OrderActionState> {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, message: "Thiếu cấu hình Supabase admin." };

  const name = String(formData.get("order_no") ?? "").trim() || String(formData.get("slug") ?? "").trim();
  const customerId = String(formData.get("customer_id") ?? "").trim() || null;
  const projectId = String(formData.get("project_id") ?? "").trim() || null;
  const discountId = String(formData.get("discount_id") ?? "").trim() || null;
  const paymentPolicyId = String(formData.get("payment_policy_id") ?? "").trim() || null;

  if (!customerId) return { ok: false, fieldErrors: { customer_id: "Vui lòng chọn khách hàng." }, message: "Thiếu khách hàng." };

  const orderNo =
    String(formData.get("order_no") ?? "").trim() ||
    (await generateOrderNo(supabase, {
      projectName: projectId ? (await supabase.from("projects").select("name").eq("id", projectId).maybeSingle()).data?.name ?? "" : "",
      customerName: customerId ? (await supabase.from("customers").select("name").eq("id", customerId).maybeSingle()).data?.name ?? "" : "",
      orderType: "combo",
    }));

  const orderLines = parseOrderLines(formData);
  const orderType = inferOrderTypeFromLines(orderLines);
  const subtotal = Number(formData.get("subtotal") ?? 0);
  const { discountRow, paymentPolicyRow } = await loadSnapshotRows(supabase, discountId, paymentPolicyId);
  const discountAmount = calculateDiscountAmount(subtotal, discountRow ? { discount_type: String(discountRow.discount_type ?? "fixed"), value: Number(discountRow.value ?? 0) } : null);
  const paymentPolicyAmounts = calculatePolicyAmounts(subtotal - discountAmount, paymentPolicyRow ? {
    deposit_percent: Number(paymentPolicyRow.deposit_percent ?? 30),
    delivery_percent: Number(paymentPolicyRow.delivery_percent ?? 60),
    acceptance_percent: Number(paymentPolicyRow.acceptance_percent ?? 10),
  } : null);

  const coreOrderInsert = {
      slug: String(formData.get("slug") ?? slugify(name)).trim(),
      customer_id: customerId,
      project_id: projectId,
      order_no: orderNo,
      order_type: orderType,
      status: String(formData.get("status") ?? "inactive"),
      order_date: String(formData.get("order_date") ?? "").trim() || null,
      note: String(formData.get("note") ?? "").trim() || null,
      subtotal,
      discount: discountAmount,
      total: Math.max(subtotal - discountAmount, 0),
    };
  const paymentMethod = String(formData.get("payment_method") ?? "").trim() || null;

  let orderInsertRes = await supabase.from("orders").insert({ ...coreOrderInsert, payment_method: paymentMethod }).select("id").single();
  if (orderInsertRes.error && isMissingColumnError(orderInsertRes.error)) {
    orderInsertRes = await supabase.from("orders").insert(coreOrderInsert).select("id").single();
  }

  if (orderInsertRes.error) {
    return { ok: false, message: formatSupabaseError("orders.insert", orderInsertRes.error) };
  }

  const orderId = orderInsertRes.data?.id;
  if (orderId) {
    const snapshotUpdate = buildOrderSnapshotUpdate(discountId, discountRow, paymentPolicyId, paymentPolicyRow, paymentPolicyAmounts);
    const snapshotUpdateRes = await supabase.from("orders").update(snapshotUpdate).eq("id", orderId);
    if (snapshotUpdateRes.error) {
      return { ok: false, message: formatSupabaseError("orders.update(snapshot)", snapshotUpdateRes.error) };
    }
  }

  if (orderId && orderLines.length) {
    const items = await Promise.all(
      orderLines.map(async (line, index) => {
        const lineType = String(line.line_type ?? "combo") === "product" ? "product" : "combo";
        const comboId = String(line.combo_id ?? "").trim() || null;
        const productId = String(line.product_id ?? "").trim() || null;
        const quantity = Number(line.quantity ?? 1) || 1;
        const unitPrice = Number(line.unit_price ?? 0) || 0;
        const snapshot = await buildOrderItemSnapshot(supabase, {
          itemType: lineType,
          comboId,
          productId,
        });
        return {
          order_id: orderId,
          combo_id: lineType === "combo" ? comboId : null,
          product_id: lineType === "product" ? productId : null,
          item_name: String(line.item_name ?? "").trim() || (lineType === "combo" ? "Combo" : "Thiết bị"),
          item_type: lineType,
          quantity,
          unit_price: unitPrice,
          total_price: quantity * unitPrice,
          sort_order: Number(line.sort_order ?? index) || index,
          note: String(line.note ?? "").trim() || null,
          snapshot_data: snapshot,
        };
      }),
    );
    const itemsRes = await supabase.from("order_items").insert(items);
    if (itemsRes.error) {
      return { ok: false, message: formatSupabaseError("order_items.insert", itemsRes.error) };
    }
  }

  revalidatePath("/orders");
  redirect("/orders");
}

export async function updateOrderAction(_: OrderActionState, formData: FormData): Promise<OrderActionState> {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, message: "Thiếu cấu hình Supabase admin." };

  const name = String(formData.get("order_no") ?? "").trim() || String(formData.get("slug") ?? "").trim();
  const customerId = String(formData.get("customer_id") ?? "").trim() || null;
  const projectId = String(formData.get("project_id") ?? "").trim() || null;
  const discountId = String(formData.get("discount_id") ?? "").trim() || null;
  const paymentPolicyId = String(formData.get("payment_policy_id") ?? "").trim() || null;

  if (!customerId) return { ok: false, fieldErrors: { customer_id: "Vui lòng chọn khách hàng." }, message: "Thiếu khách hàng." };

  const orderNo =
    String(formData.get("order_no") ?? "").trim() ||
    (await generateOrderNo(supabase, {
      projectName: projectId ? (await supabase.from("projects").select("name").eq("id", projectId).maybeSingle()).data?.name ?? "" : "",
      customerName: customerId ? (await supabase.from("customers").select("name").eq("id", customerId).maybeSingle()).data?.name ?? "" : "",
      orderType: "combo",
    }));

  const orderLines = parseOrderLines(formData);
  const orderType = inferOrderTypeFromLines(orderLines);
  const subtotal = Number(formData.get("subtotal") ?? 0);
  const { discountRow, paymentPolicyRow } = await loadSnapshotRows(supabase, discountId, paymentPolicyId);
  const discountAmount = calculateDiscountAmount(subtotal, discountRow ? { discount_type: String(discountRow.discount_type ?? "fixed"), value: Number(discountRow.value ?? 0) } : null);
  const paymentPolicyAmounts = calculatePolicyAmounts(subtotal - discountAmount, paymentPolicyRow ? {
    deposit_percent: Number(paymentPolicyRow.deposit_percent ?? 30),
    delivery_percent: Number(paymentPolicyRow.delivery_percent ?? 60),
    acceptance_percent: Number(paymentPolicyRow.acceptance_percent ?? 10),
  } : null);

  const coreOrderUpdate = {
      slug: String(formData.get("slug") ?? slugify(name)).trim(),
      customer_id: customerId,
      project_id: projectId,
      order_no: orderNo,
      order_type: orderType,
      status: String(formData.get("status") ?? "inactive"),
      order_date: String(formData.get("order_date") ?? "").trim() || null,
      note: String(formData.get("note") ?? "").trim() || null,
      subtotal,
      discount: discountAmount,
      total: Math.max(subtotal - discountAmount, 0),
    };
  const paymentMethod = String(formData.get("payment_method") ?? "").trim() || null;

  let orderUpdateRes = await supabase.from("orders").update({ ...coreOrderUpdate, payment_method: paymentMethod }).eq("id", String(formData.get("id") ?? ""));
  if (orderUpdateRes.error && isMissingColumnError(orderUpdateRes.error)) {
    orderUpdateRes = await supabase.from("orders").update(coreOrderUpdate).eq("id", String(formData.get("id") ?? ""));
  }

  if (orderUpdateRes.error) {
    return { ok: false, message: formatSupabaseError("orders.update", orderUpdateRes.error) };
  }

  const orderId = String(formData.get("id") ?? "");
  if (orderId) {
    const snapshotUpdate = buildOrderSnapshotUpdate(discountId, discountRow, paymentPolicyId, paymentPolicyRow, paymentPolicyAmounts);
    const snapshotUpdateRes = await supabase.from("orders").update(snapshotUpdate).eq("id", orderId);
    if (snapshotUpdateRes.error) {
      return { ok: false, message: formatSupabaseError("orders.update(snapshot)", snapshotUpdateRes.error) };
    }
  }

  if (orderId) {
    const deleteRes = await supabase.from("order_items").delete().eq("order_id", orderId);
    if (deleteRes.error) {
      return { ok: false, message: formatSupabaseError("order_items.delete", deleteRes.error) };
    }
    if (orderLines.length) {
      const items = await Promise.all(
        orderLines.map(async (line, index) => {
          const lineType = String(line.line_type ?? "combo") === "product" ? "product" : "combo";
          const comboId = String(line.combo_id ?? "").trim() || null;
          const productId = String(line.product_id ?? "").trim() || null;
          const quantity = Number(line.quantity ?? 1) || 1;
          const unitPrice = Number(line.unit_price ?? 0) || 0;
          const snapshot = await buildOrderItemSnapshot(supabase, {
            itemType: lineType,
            comboId,
            productId,
          });
          return {
            order_id: orderId,
            combo_id: lineType === "combo" ? comboId : null,
            product_id: lineType === "product" ? productId : null,
            item_name: String(line.item_name ?? "").trim() || (lineType === "combo" ? "Combo" : "Thiết bị"),
            item_type: lineType,
            quantity,
            unit_price: unitPrice,
            total_price: quantity * unitPrice,
            sort_order: Number(line.sort_order ?? index) || index,
            note: String(line.note ?? "").trim() || null,
            snapshot_data: snapshot,
          };
        }),
      );
      const itemsRes = await supabase.from("order_items").insert(items);
      if (itemsRes.error) {
        return { ok: false, message: formatSupabaseError("order_items.insert", itemsRes.error) };
      }
    }
  }

  revalidatePath("/orders");
  redirect("/orders");
}

export async function generateOrderPdfAction(formData: FormData) {
  "use server";
  const orderId = String(formData.get("id") ?? "").trim();
  if (!orderId) return;
  await generateOrderPdf(orderId, { persist: true });
  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}/edit`);
}

export async function createOrderPaymentAction(_: PaymentActionState, formData: FormData): Promise<PaymentActionState> {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, message: "Thiếu cấu hình Supabase admin." };

  const orderId = String(formData.get("order_id") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const paymentDate = String(formData.get("payment_date") ?? "").trim() || new Date().toISOString().slice(0, 10);
  const paymentMethod = String(formData.get("payment_method") ?? "").trim() || null;
  const transactionId = String(formData.get("transaction_id") ?? "").trim() || null;
  const paymentStage = String(formData.get("payment_stage") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!orderId) return { ok: false, fieldErrors: { order_id: "Thiếu mã đơn hàng." }, message: "Thiếu đơn hàng." };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, fieldErrors: { amount: "Số tiền phải lớn hơn 0." }, message: "Số tiền không hợp lệ." };

  const orderRes = await supabase.from("orders").select("id, order_no, subtotal, total, discount, payment_policy_name, payment_policy_code").eq("id", orderId).maybeSingle();
  if (orderRes.error || !orderRes.data) {
    return { ok: false, message: formatSupabaseError("orders.select", orderRes.error ?? { message: "Không tìm thấy đơn hàng." }) };
  }

  const paymentNo = `PAY-${String(orderRes.data.order_no ?? orderId).toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 24)}-${Date.now().toString().slice(-6)}`;
  const paymentRes = await supabase.from("order_payments").insert({
    order_id: orderId,
    payment_no: paymentNo,
    payment_type: "manual",
    payment_stage: paymentStage,
    payment_date: paymentDate,
    amount,
    payment_method: paymentMethod,
    transaction_id: transactionId,
    status: "completed",
    note,
  });

  if (paymentRes.error) {
    return { ok: false, message: formatSupabaseError("order_payments.insert", paymentRes.error) };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}/edit`);
  return { ok: true, message: "Đã ghi nhận thanh toán." };
}

export async function deleteOrderPaymentAction(_: PaymentActionState, formData: FormData): Promise<PaymentActionState> {
  "use server";
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { ok: false, message: "Thiếu cấu hình Supabase admin." };
  const paymentId = String(formData.get("id") ?? "").trim();
  const orderId = String(formData.get("order_id") ?? "").trim();
  if (!paymentId) return { ok: false, message: "Thiếu mã thanh toán." };
  const deleteRes = await supabase.from("order_payments").delete().eq("id", paymentId);
  if (deleteRes.error) return { ok: false, message: formatSupabaseError("order_payments.delete", deleteRes.error) };
  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}/edit`);
  return { ok: true, message: "Đã xoá thanh toán." };
}
