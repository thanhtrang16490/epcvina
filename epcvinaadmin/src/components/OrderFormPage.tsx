"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { OrderCustomerProjectFields } from "@/components/OrderCustomerProjectFields";
import { OrderLinesEditor } from "@/components/OrderLinesEditor";
import { ModalShell } from "@/components/ModalShell";
import type { OrderActionState } from "@/app/orders/actions";

type Option = { id: string; name: string; customer_id?: string | null };
type Line = {
  line_type: "combo" | "product";
  combo_id: string;
  product_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
  note: string;
};

type Props = {
  title: string;
  submitLabel: string;
  action: (state: OrderActionState, formData: FormData) => Promise<OrderActionState>;
  pdfAction?: (formData: FormData) => Promise<void>;
  orderId?: string;
  discounts: { id: string; name: string; discount_type: string; value: number; is_active?: boolean }[];
  paymentPolicies: {
    id: string;
    name: string;
    policy_code: string;
    deposit_percent: number;
    delivery_percent: number;
    acceptance_percent: number;
    is_active?: boolean;
  }[];
  combos: { id: string; name: string }[];
  products: { id: string; name: string }[];
  comboBomMap?: Record<string, { name: string; groups: Array<[string, any[]]> }>;
  customerLabel?: string;
  projectLabel?: string;
  invoiceCustomerLabel?: string;
  invoiceContactLabel?: string;
  initialValues?: {
    id?: string;
    order_no?: string;
    customer_type?: string;
    customer_id?: string;
    invoice_customer_id?: string;
    invoice_contact_id?: string;
    project_id?: string;
    order_type?: string;
    status?: string;
    order_date?: string;
    payment_method?: string;
    subtotal?: number;
    discount?: number;
    total?: number;
    discount_id?: string;
    discount_name?: string;
    discount_type?: string;
    discount_value?: number;
    payment_policy_id?: string;
    payment_policy_name?: string;
    payment_policy_code?: string;
    payment_policy_deposit_percent?: number;
    payment_policy_delivery_percent?: number;
    payment_policy_acceptance_percent?: number;
    note?: string;
    pdf_generated_at?: string;
    pdf_url?: string;
  };
  initialLines?: Line[];
};

const initialActionState: OrderActionState = { ok: true };

export function OrderFormPage({
  title,
  submitLabel,
  action,
  pdfAction,
  orderId,
  discounts,
  paymentPolicies,
  combos,
  products,
  comboBomMap,
  customerLabel,
  projectLabel,
  invoiceCustomerLabel,
  invoiceContactLabel,
  initialValues,
  initialLines,
}: Props) {
  const [state, formAction, isPending] = useActionState(action, initialActionState);
  const [summary, setSummary] = useState({
    subtotal: Number(initialValues?.subtotal ?? 0),
    comboSubtotal: 0,
    productSubtotal: 0,
    lineCount: initialLines?.length ?? 0,
  });
  const [selectedDiscountId, setSelectedDiscountId] = useState(initialValues?.discount_id ?? "");
  const [selectedPaymentPolicyId, setSelectedPaymentPolicyId] = useState(initialValues?.payment_policy_id ?? "");
  const today = new Date();
  const todayValue = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  const defaultOrderDate = initialValues?.order_date ?? todayValue;
  const subtotal = summary.subtotal;
  const selectedDiscount = discounts.find((discountOption) => discountOption.id === selectedDiscountId) ?? null;
  const discount = selectedDiscount && subtotal > 0 ? (selectedDiscount.discount_type === "percent" ? Math.min(subtotal, (subtotal * Number(selectedDiscount.value ?? 0)) / 100) : Math.min(subtotal, Number(selectedDiscount.value ?? 0))) : Number(initialValues?.discount ?? 0);
  const shipping = 0;
  const vat = 0;
  const total = Math.max(subtotal - discount + shipping + vat, 0);
  const pdfGeneratedAt = initialValues?.pdf_generated_at ? new Date(initialValues.pdf_generated_at) : null;
  const selectedPaymentPolicy = paymentPolicies.find((policy) => policy.id === selectedPaymentPolicyId) ?? null;
  const depositPercent = selectedPaymentPolicy?.deposit_percent ?? Number(initialValues?.payment_policy_deposit_percent ?? 30);
  const deliveryPercent = selectedPaymentPolicy?.delivery_percent ?? Number(initialValues?.payment_policy_delivery_percent ?? 60);
  const acceptancePercent = selectedPaymentPolicy?.acceptance_percent ?? Number(initialValues?.payment_policy_acceptance_percent ?? 10);
  const depositAmount = Math.round((total * depositPercent) / 100);
  const deliveryAmount = Math.round((total * deliveryPercent) / 100);
  const acceptanceAmount = Math.max(total - depositAmount - deliveryAmount, 0);
  const previewOrderNo = initialValues?.order_no || "SO-DRAFT";
  const previewDate = defaultOrderDate;
  const previewPaymentPolicy = selectedPaymentPolicy?.name ?? "Chính sách 3:6:1";
  const previewDiscount = selectedDiscount?.name ?? "Không áp dụng";

  return (
    <main className="mx-auto max-w-[1600px] bg-[#F8F9FA] px-4 py-4 text-slate-900 md:px-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">Orders</div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {orderId ? (
            <>
              {pdfAction ? (
                <form action={pdfAction}>
                  <input type="hidden" name="id" value={orderId} />
                  <button type="submit" className="rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-4 py-3 text-sm text-[color:var(--accent)] shadow-sm">
                    Generate / Refresh PDF
                  </button>
                </form>
              ) : null}
              <ModalShell trigger={<span className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Xem trước PDF</span>} title="Xem trước PDF" description="Bản xem trước này lấy trực tiếp từ dữ liệu đang nhập, không dùng file PDF đã lưu.">
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
                  <div className="border-b border-slate-200 bg-[#F8F9FA] px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">PDF Preview</div>
                        <div className="mt-1 text-2xl font-semibold text-slate-900">Sales Order {previewOrderNo}</div>
                        <div className="mt-2 text-sm text-slate-600">Ngày đơn: {previewDate}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right">
                        <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng thanh toán</div>
                        <div className="mt-1 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(total)} đ</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Thông tin đơn</div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Mã đơn</span><span className="font-medium text-slate-900">{previewOrderNo}</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Phương thức</span><span className="font-medium text-slate-900">{initialValues?.payment_method ?? "bank_transfer"}</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Chiết khấu</span><span className="font-medium text-slate-900">{previewDiscount}</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Chính sách</span><span className="font-medium text-slate-900">{previewPaymentPolicy}</span></div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Khách hàng / Dự án</div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Khách hàng</span><span className="font-medium text-slate-900">{initialValues?.customer_id || "-"}</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Dự án</span><span className="font-medium text-slate-900">{initialValues?.project_id || "-"}</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Tổng trước CK</span><span className="font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(subtotal)} đ</span></div>
                        <div className="flex justify-between gap-3"><span className="text-slate-500">Chiết khấu</span><span className="font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(discount)} đ</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="rounded-2xl border border-slate-200">
                      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">Kế hoạch thanh toán</div>
                      <div className="grid gap-2 p-4 text-sm text-slate-700 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Đặt cọc 30%</div>
                          <div className="mt-1 font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(depositAmount)} đ</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Tập kết 60%</div>
                          <div className="mt-1 font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(deliveryAmount)} đ</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Nghiệm thu 10%</div>
                          <div className="mt-1 font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(acceptanceAmount)} đ</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalShell>
              <a href={`/orders/${orderId}/pdf`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Tải PDF</a>
            </>
          ) : null}
          <Link href="/orders" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            Quay lại
          </Link>
        </div>
      </div>

      <form action={formAction} className="grid gap-4">
        {initialValues?.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">Thông tin khách</div>
              <div className="mt-1 text-xs text-slate-500">Khách hàng và dự án liên quan.</div>
            </div>
            <OrderCustomerProjectFields
              defaultCustomerId={initialValues?.customer_id ?? ""}
              defaultCustomerLabel={customerLabel}
              defaultProjectId={initialValues?.project_id ?? ""}
              defaultProjectLabel={projectLabel}
              defaultCustomerType={initialValues?.customer_type === "company" ? "company" : "contact"}
              defaultInvoiceCustomerId={initialValues?.invoice_customer_id ?? ""}
              defaultInvoiceCustomerLabel={invoiceCustomerLabel}
              defaultInvoiceContactId={initialValues?.invoice_contact_id ?? ""}
              defaultInvoiceContactLabel={invoiceContactLabel}
            />
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">Thông tin đơn</div>
                <div className="mt-1 text-xs text-slate-500">Mã, loại, trạng thái và ngày đơn.</div>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">{initialValues?.order_no ? `#${initialValues.order_no}` : "New order"}</div>
            </div>
            {state?.ok === false ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message || "Không thể lưu đơn hàng."}</div> : null}
            {orderId ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <div className="font-medium text-slate-900">PDF gần nhất</div>
                <div className="mt-1">
                  {pdfGeneratedAt ? (
                    <>
                      Đã tạo lúc {pdfGeneratedAt.toLocaleString("vi-VN")}
                      {initialValues?.pdf_url ? (
                        <>
                          {" "}
                          · <a href={initialValues.pdf_url} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] underline underline-offset-2">mở file</a>
                        </>
                      ) : null}
                    </>
                  ) : (
                    "Chưa có PDF nào được tạo."
                  )}
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Mã đơn hàng</span>
                <input name="order_no" defaultValue={initialValues?.order_no ?? ""} placeholder="Sẽ tự sinh nếu để trống" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Ngày đơn</span>
                <input name="order_date" type="date" defaultValue={defaultOrderDate} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Trạng thái</span>
                <select name="status" defaultValue={initialValues?.status ?? "inactive"} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Phương thức thanh toán</span>
                <select name="payment_method" defaultValue={initialValues?.payment_method ?? "bank_transfer"} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40">
                  <option value="cash">Tiền mặt</option>
                  <option value="bank_transfer">Chuyển khoản</option>
                  <option value="card">Thẻ</option>
                  <option value="installment">Trả góp</option>
                  <option value="other">Khác</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Chiết khấu</span>
                <select name="discount_id" value={selectedDiscountId} onChange={(event) => setSelectedDiscountId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40">
                  <option value="">Không áp dụng</option>
                  {discounts.filter((discountOption) => discountOption.is_active !== false).map((discountOption) => (
                    <option key={discountOption.id} value={discountOption.id}>
                      {discountOption.name} ({discountOption.discount_type === "percent" ? `${discountOption.value}%` : `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(discountOption.value)} đ`})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500">Chiết khấu sẽ được tính vào tổng tiền khi lưu đơn.</div>
              </label>
              <label className="grid gap-1.5 md:col-span-2">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Chính sách thanh toán</span>
                <select
                  name="payment_policy_id"
                  value={selectedPaymentPolicyId}
                  onChange={(event) => setSelectedPaymentPolicyId(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40"
                >
                  <option value="">3 : 6 : 1 mặc định</option>
                  {paymentPolicies
                    .filter((policy) => policy.is_active !== false)
                    .map((policy) => (
                      <option key={policy.id} value={policy.id}>
                        {policy.name} ({policy.policy_code})
                      </option>
                    ))}
                </select>
                <div className="text-xs text-slate-500">{selectedPaymentPolicy ? `${depositPercent}% cọc · ${deliveryPercent}% khi tập kết · ${acceptancePercent}% khi nghiệm thu` : "Đang dùng mốc mặc định 30/60/10."}</div>
              </label>
            </div>

            <input type="hidden" name="subtotal" value={subtotal} />
            <input type="hidden" name="discount" value={discount} />
            <input type="hidden" name="total" value={total} />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tạm tính</div>
                <div className="mt-1 text-sm font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(subtotal)} đ</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Chiết khấu</div>
                <div className="mt-1 text-sm font-medium text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(discount)} đ</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">Tổng tiền</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(total)} đ</div>
              </div>
            </div>

            <textarea name="note" defaultValue={initialValues?.note ?? ""} rows={3} placeholder="Ghi chú" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40" />
          </div>
        </div>

        <div className="grid gap-4">
          <OrderLinesEditor combos={combos} products={products} initialLines={initialLines} comboBomMap={comboBomMap} onSummaryChange={setSummary} />

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">Tổng đơn</div>
                <div className="mt-1 text-sm text-slate-500">Tổng hợp giá trị đơn hàng theo kiểu ERP/Odoo.</div>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">Thuế, phí và chiết khấu được thể hiện riêng</div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Giá trị hàng hóa</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(subtotal)} đ</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng dòng combo</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(summary.comboSubtotal)} đ</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng dòng thiết bị</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(summary.productSubtotal)} đ</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Chiết khấu</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(discount)} đ</div>
                  <div className="mt-1 text-xs text-slate-500">{selectedDiscount ? `${selectedDiscount.name} · ${selectedDiscount.discount_type === "percent" ? `${selectedDiscount.value}%` : `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(selectedDiscount.value)} đ`}` : "Chưa áp dụng chiết khấu"}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Thuế VAT</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(vat)} đ</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Phí vận chuyển / lắp đặt</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(shipping)} đ</div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">Tổng thanh toán</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(total)} đ</div>
                <div className="mt-2 text-sm text-slate-600">Đây là số tổng hợp hiển thị giống khối Total trong Odoo. Nếu cần tính động theo VAT hoặc phí khác, mình có thể nối tiếp vào logic tính.</div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2">
            <button type="submit" disabled={isPending} className="rounded-2xl bg-[color:var(--accent)] px-4 py-3 font-medium text-white shadow-sm disabled:opacity-60">
              {isPending ? "Đang lưu..." : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
