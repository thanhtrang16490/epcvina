"use client";

import { useActionState, useMemo, useState } from "react";
import { ThemeCard } from "@/components/ui/ThemeCard";
import { ThemeLinkButton } from "@/components/ui/ThemeButton";
import { ComboBomAccordion } from "@/components/ComboBomAccordion";
import type { PaymentActionState } from "@/app/orders/actions";

type AnyRow = Record<string, any>;

type Props = {
  order: AnyRow;
  customer: AnyRow | null;
  project: AnyRow | null;
  items: AnyRow[];
  comboGroups: Array<[string, AnyRow[]]>;
  pdfVersions: AnyRow[];
  total: number;
  subtotal: number;
  discount: number;
  discountLabel?: string;
  discountType?: string | null;
  discountValue?: number | null;
  paymentPolicyLabel?: string;
  customerHistoryHref?: string;
  projectHistoryHref?: string;
  paymentRows?: AnyRow[];
  paidTotal?: number;
  remainingTotal?: number;
  paymentAction?: (state: PaymentActionState, formData: FormData) => Promise<PaymentActionState>;
  invoiceCustomer?: AnyRow | null;
  invoiceContact?: AnyRow | null;
};

const tabs = [
  "Tổng quan",
  "Sản phẩm",
  "BOM",
  "Thi công",
  "Tài liệu",
  "Tiến trình",
  "Hóa đơn",
  "Thanh toán",
  "Hoạt động",
  "Ghi chú",
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value);
}

function pillClass(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("active") || normalized.includes("paid") || normalized.includes("completed") || normalized.includes("in progress")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized.includes("warning") || normalized.includes("pending") || normalized.includes("survey")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized.includes("error") || normalized.includes("cancel")) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function OrderDetailWorkspace({
  order,
  customer,
  project,
  items,
  comboGroups,
  pdfVersions,
  total,
  subtotal,
  discount,
  discountLabel,
  discountType,
  discountValue,
  paymentPolicyLabel,
  customerHistoryHref,
  projectHistoryHref,
  paymentRows = [],
  paidTotal = 0,
  remainingTotal = total,
  paymentAction,
  invoiceCustomer,
  invoiceContact,
}: Props) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Tổng quan");
  const [productRows] = useState(() =>
    items.map((item) => ({
      id: item.id,
      name: item.item_name || "-",
      sku: item.product_id || item.combo_id || "-",
      quantity: Number(item.quantity ?? 0),
      unit: item.unit || "pcs",
      unitPrice: Number(item.unit_price ?? 0),
      discount: Number(item.discount ?? 0),
      tax: item.tax || "VAT",
      subtotal: Number(item.total_price ?? 0),
    })),
  );
  const productItems = items.filter((item) => item.item_type === "product");
  const comboItems = items.filter((item) => item.item_type === "combo");
  const resolvedPaymentAction = paymentAction ?? (async () => ({ ok: true }));
  const [paymentState, paymentFormAction, paymentPending] = useActionState<PaymentActionState, FormData>(resolvedPaymentAction, { ok: true });
  const metrics = useMemo(
    () => [
      { label: "Giá trị báo giá", value: total, tone: "text-[color:var(--accent)]" },
      { label: "Giá vốn", value: subtotal, tone: "text-slate-800" },
      { label: "Lợi nhuận gộp", value: Math.max(0, total - subtotal), tone: "text-emerald-600" },
      { label: "Biên lợi nhuận gộp", value: total > 0 ? `${Math.round(((total - subtotal) / total) * 100)}%` : "0%", tone: "text-slate-800" },
      { label: "Đặt cọc", value: Math.round(total * 0.3), tone: "text-blue-600" },
      { label: "Còn lại", value: Math.max(0, total - Math.round(total * 0.3)), tone: "text-red-600" },
    ],
    [subtotal, total],
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-slate-900">
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/20" />
                <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Đơn hàng</div>
              <div className="text-lg font-semibold text-slate-900">{order.order_no || order.slug || "-"}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeLinkButton href={`/admin/orders/${order.id}/edit`} tone="secondary">Sửa</ThemeLinkButton>
            <ThemeLinkButton href={customerHistoryHref || "#"} tone="secondary">Lịch sử khách</ThemeLinkButton>
            <ThemeLinkButton href={projectHistoryHref || "#"} tone="secondary">Lịch sử dự án</ThemeLinkButton>
            <ThemeLinkButton href={`/admin/orders/${order.id}/pdf`} tone="primary">Tải PDF</ThemeLinkButton>
            <ThemeLinkButton href={`/admin/orders/${order.id}/edit`} tone="ghost">Mở sửa nhanh</ThemeLinkButton>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${pillClass(String(order.status ?? ""))}`}>
                    {String(order.status ?? "draft")}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    {String(order.order_type ?? "combo")}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
                    Giai đoạn hiện tại: Đang thi công
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Đơn hàng bán</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    SO-{String(order.order_no || order.slug || "-")} · Không gian xử lý đơn EPCVINA Solar
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Khách hàng</div>
                    <div className="mt-1 font-medium text-slate-900">{customer?.name || "Chưa có khách hàng"}</div>
                  </div>
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Dự án</div>
                    <div className="mt-1 font-medium text-slate-900">{project?.name || "Chưa có dự án"}</div>
                  </div>
                  <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Loại đơn</div>
                    <div className="mt-1 font-medium text-slate-900">{String(order.order_type ?? "combo")}</div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Xuất hoá đơn cho</div>
                    <div className="mt-1 font-medium text-slate-900">{invoiceCustomer?.billing_name || invoiceCustomer?.name || customer?.name || "-"}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      <div>{invoiceCustomer?.tax_code || order.invoice_tax_code_snapshot || "-"}</div>
                      <div>{invoiceCustomer?.billing_phone || invoiceCustomer?.phone || order.invoice_phone_snapshot || "-"}</div>
                      <div>{invoiceCustomer?.billing_email || invoiceCustomer?.email || order.invoice_email_snapshot || "-"}</div>
                      <div>{order.invoice_address_snapshot || invoiceCustomer?.address_detail || invoiceCustomer?.address || "-"}</div>
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Người phụ trách</div>
                    <div className="mt-1 font-medium text-slate-900">{invoiceContact?.name || order.contact_name_snapshot || customer?.name || "-"}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      <div>{invoiceContact?.phone || order.contact_phone_snapshot || "-"}</div>
                      <div>{invoiceContact?.email || order.contact_email_snapshot || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-4xl rounded-[12px] border border-slate-200 bg-[#F8F9FA] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Tiến trình</div>
                  <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600">Đang thi công</div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {["Tiếp cận","Khảo sát","Thiết kế","Báo giá","Hợp đồng","Đặt cọc","Mua hàng","Thi công","Nghiệm thu","EVN","Đã thanh toán","Bảo hành"].map((stage, index) => (
                    <span
                      key={stage}
                      className={`rounded-full border px-3 py-1 ${index <= 7 ? "border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 text-[color:var(--accent)]" : "border-slate-200 bg-white text-slate-500"}`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ThemeCard>

          <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeTab === tab ? "bg-[color:var(--accent)] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </ThemeCard>

          {activeTab === "Tổng quan" ? (
            <>
              <div className="grid gap-6 xl:grid-cols-3">
                <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                  <div className="mb-4 text-sm font-semibold text-slate-900">Khách hàng</div>
                  <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                    <div className="flex items-center justify-center rounded-[12px] bg-slate-100 text-xs text-slate-500">Avatar</div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Tên khách hàng" value={customer?.name || "-"} />
                      <Field label="Số điện thoại" value={customer?.phone || "-"} />
                      <Field label="Email" value={customer?.email || "-"} />
                      <Field label="Địa chỉ" value={customer?.address || "-"} />
                      <Field label="Tỉnh / thành" value={customer?.province || "-"} />
                      <Field label="Mã số thuế" value={customer?.tax_code || "-"} />
                      <Field label="Địa chỉ lắp đặt" value={project?.address || "-"} />
                      <div className="flex items-end">
                        <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">Xem Google Map</button>
                      </div>
                    </div>
                  </div>
                </ThemeCard>

                <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 text-sm font-semibold text-slate-900">Thao tác nhanh</div>
                  <div className="grid gap-2">
                    {["Tạo hóa đơn","Lên lịch khảo sát","Phân công kỹ thuật","Sinh BOM","Gửi email","In hợp đồng","Sinh bảo hành","Lịch sử khách hàng","Lịch sử dự án"].map((item) => (
                      <button key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:border-[color:var(--accent)]/30 hover:bg-[color:var(--accent)]/5">
                        {item}
                      </button>
                    ))}
                  </div>
                </ThemeCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <ThemeCard key={metric.label} className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</div>
                  <div className={`mt-2 text-3xl font-semibold ${metric.tone}`}>{typeof metric.value === "number" ? formatCurrency(metric.value) : metric.value}</div>
                </ThemeCard>
              ))}
            </div>
          </>
        ) : null}

          {activeTab === "Sản phẩm" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Sản phẩm</div>
                  <div className="text-sm text-slate-500">Bảng dòng đơn hàng cho phép chỉnh sửa như ERP.</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm xl:w-72" placeholder="Tìm sản phẩm" />
                  <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">Lọc</button>
                  <button className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm text-white">Thêm dòng</button>
                </div>
              </div>
              <div className="overflow-auto rounded-[12px] border border-slate-200">
                <table className="min-w-[1320px] divide-y divide-slate-200 text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500">
                    <tr>
                      {["Ảnh","Sản phẩm","SKU","Số lượng","Đơn vị","Đơn giá","Chiết khấu","Thuế","Thành tiền","Thao tác"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {productRows.map((item) => (
                      <tr key={item.id} className="bg-white align-top hover:bg-slate-50/70">
                        <td className="px-4 py-3"><div className="h-10 w-10 rounded-xl bg-slate-100" /></td>
                        <td className="px-4 py-3">
                          <input defaultValue={item.name} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-900" />
                          <div className="mt-1 text-xs text-slate-500">Chỉnh sửa trực tiếp</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <input defaultValue={item.sku} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                        </td>
                        <td className="px-4 py-3">
                          <input defaultValue={String(item.quantity)} type="number" className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                        </td>
                        <td className="px-4 py-3">
                          <select defaultValue={item.unit} className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                            <option value="pcs">cái</option>
                            <option value="set">bộ</option>
                            <option value="job">công việc</option>
                            <option value="m">m</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input defaultValue={String(item.unitPrice)} type="number" className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                        </td>
                        <td className="px-4 py-3">
                          <input defaultValue={String(item.discount)} type="number" className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                        </td>
                        <td className="px-4 py-3">
                          <select defaultValue={item.tax} className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                            <option value="VAT">VAT</option>
                            <option value="0%">0%</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{formatCurrency(item.subtotal)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">Mở</button>
                            <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ThemeCard>
          ) : null}

          {activeTab === "BOM" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">BOM</div>
                  <div className="text-sm text-slate-500">Cây vật tư được nhóm theo hạng mục.</div>
                </div>
              </div>
              <ComboBomAccordion groups={comboGroups} />
            </ThemeCard>
          ) : null}

          {activeTab === "Tiến trình" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-slate-900">Tiến trình</div>
              <div className="space-y-4">
                {["Tạo lead","Khảo sát xong","Gửi báo giá","Khách duyệt","Đã nhận cọc","Đã đặt vật tư","Bắt đầu thi công","Nghiệm thu xong","Xuất hóa đơn","Đã thanh toán"].map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-[color:var(--accent)]" />
                    <div className="flex-1 border-b border-slate-200 pb-4">
                      <div className="font-medium text-slate-900">{step}</div>
                      <div className="text-sm text-slate-500">2026-07-{String(index + 1).padStart(2, "0")} 09:30 · Cập nhật bởi EPCVINA</div>
                    </div>
                  </div>
                ))}
              </div>
            </ThemeCard>
          ) : null}

          {activeTab === "Tài liệu" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-slate-900">Tài liệu</div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {["Báo giá PDF","Hợp đồng","Biên bản nghiệm thu","Bản vẽ điện","Sơ đồ 1 sợi","Hóa đơn","Phiếu bảo hành"].map((doc) => (
                  <div key={doc} className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                    <div className="h-28 rounded-xl bg-white" />
                    <div className="mt-3 font-medium text-slate-900">{doc}</div>
                    <div className="mt-1 text-sm text-slate-500">Ngày tải lên · Phiên bản 1.0</div>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">Xem trước</button>
                      <button className="rounded-full bg-[color:var(--accent)] px-3 py-2 text-sm text-white">Tải xuống</button>
                    </div>
                  </div>
                ))}
              </div>
            </ThemeCard>
          ) : null}

          {activeTab === "Hóa đơn" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-slate-900">Hóa đơn</div>
              <div className="overflow-auto rounded-[12px] border border-slate-200">
                <table className="min-w-[900px] divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {["Số hóa đơn","Ngày","Số tiền","Trạng thái","Đã thanh toán","Còn lại"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-4">-</td>
                      <td className="px-4 py-4">-</td>
                      <td className="px-4 py-4">{formatCurrency(total)}</td>
                      <td className="px-4 py-4"><span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">Nháp</span></td>
                      <td className="px-4 py-4">0</td>
                      <td className="px-4 py-4">{formatCurrency(total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ThemeCard>
          ) : null}

          {activeTab === "Thanh toán" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-slate-900">Thanh toán</div>
              {paymentState?.message ? <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${paymentState.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{paymentState.message}</div> : null}
              <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                <form action={paymentFormAction} className="space-y-3 rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                  <input type="hidden" name="order_id" value={String(order.id)} />
                  <div className="text-sm font-medium text-slate-900">Ghi nhận thanh toán mới</div>
                  <div className="grid gap-3">
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Ngày thanh toán</span>
                      <input name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Số tiền</span>
                      <input name="amount" type="number" min={0} step="1" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Nhập số tiền" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Giai đoạn</span>
                      <select name="payment_stage" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option value="deposit">Đặt cọc</option>
                        <option value="delivery">Tập kết vật tư</option>
                        <option value="acceptance">Nghiệm thu</option>
                        <option value="other">Khác</option>
                      </select>
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Phương thức</span>
                      <select name="payment_method" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option value="cash">Tiền mặt</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                        <option value="card">Thẻ</option>
                        <option value="other">Khác</option>
                      </select>
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Mã giao dịch</span>
                      <input name="transaction_id" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="VN-..." />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Ghi chú</span>
                      <textarea name="note" rows={3} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Ghi chú thanh toán" />
                    </label>
                  </div>
                  <button type="submit" disabled={paymentPending} className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm text-white disabled:opacity-60">
                    {paymentPending ? "Đang lưu..." : "Ghi nhận thanh toán"}
                  </button>
                </form>
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900">Lịch sử thanh toán</div>
                    <div className="text-xs text-slate-500">Đã thanh toán: {formatCurrency(paidTotal)}</div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {paymentRows.length ? paymentRows.map((payment) => (
                      <div key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-slate-900">{payment.payment_no || payment.transaction_id || "Thanh toán"}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString("vi-VN") : "-"} · {payment.payment_method || "-"} · {payment.payment_stage || "-"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900">{formatCurrency(Number(payment.amount ?? 0))}</div>
                            <div className="text-xs text-emerald-600">{payment.status || "completed"}</div>
                          </div>
                        </div>
                        {payment.note ? <div className="mt-2 text-xs text-slate-500">{payment.note}</div> : null}
                      </div>
                    )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">Chưa có thanh toán nào.</div>}
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                    <Row label="Tổng phải thu" value={formatCurrency(total)} />
                    <Row label="Đã thanh toán" value={formatCurrency(paidTotal)} />
                    <Row label="Còn lại" value={formatCurrency(remainingTotal)} />
                  </div>
                </div>
              </div>
            </ThemeCard>
          ) : null}

          {activeTab === "Ghi chú" ? (
            <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 text-sm font-semibold text-slate-900">Ghi chú</div>
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">Ghi chú nội bộ</div>
                  <div className="mt-2 h-40 rounded-xl border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">Vùng soạn thảo nội dung</div>
                </div>
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-900">Ghi chú cho khách</div>
                  <div className="mt-2 h-40 rounded-xl border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">Đính kèm, nhắc tên và ghi chú gửi khách</div>
                </div>
              </div>
            </ThemeCard>
          ) : null}
        </div>

        <aside className="space-y-6">
          <ThemeCard className="sticky top-4 rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Thao tác nhanh</div>
            <div className="mt-4 grid gap-2">
              {[
                { label: "Sửa đơn hàng", href: `/orders/${order.id}/edit` },
                { label: "Mở PDF", href: `/orders/${order.id}/pdf` },
                { label: "Lịch sử khách hàng", href: customerHistoryHref || "#" },
                { label: "Lịch sử dự án", href: projectHistoryHref || "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:border-[color:var(--accent)]/30 hover:bg-[color:var(--accent)]/5"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Trạng thái đơn</div>
                <div className="mt-2 text-sm font-medium text-slate-900">{String(order.status ?? "draft")}</div>
              </div>
              <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Tiến độ</div>
                <div className="mt-2 text-sm font-medium text-slate-900">Đang thi công</div>
              </div>
            </div>
            <div className="mt-4 rounded-[12px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Tổng hợp</div>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Tạm tính" value={formatCurrency(subtotal)} />
                <Row
                  label="Chiết khấu"
                  value={
                    discountLabel
                      ? `${formatCurrency(discount)} · ${discountLabel}${discountType === "percent" && discountValue !== null && discountValue !== undefined ? ` (${discountValue}%)` : ""}`
                      : formatCurrency(discount)
                  }
                />
                <Row label="Tổng tiền" value={formatCurrency(total)} />
                <Row label="Sản phẩm" value={String(productItems.length)} />
                <Row label="Combo" value={String(comboItems.length)} />
              </div>
            </div>
            <div className="mt-4 rounded-[12px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Chính sách thanh toán</div>
              <div className="mt-2 text-sm font-medium text-slate-900">{paymentPolicyLabel ?? "3 : 6 : 1"}</div>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Đặt cọc 30%" value={formatCurrency(Math.round(total * 0.3))} />
                <Row label="Tập kết 60%" value={formatCurrency(Math.round(total * 0.6))} />
                <Row label="Nghiệm thu 10%" value={formatCurrency(Math.max(total - Math.round(total * 0.3) - Math.round(total * 0.6), 0))} />
              </div>
            </div>
          </ThemeCard>

        <ThemeCard className="rounded-[12px] border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Lịch sử PDF</div>
            <div className="mt-3 space-y-2">
              {pdfVersions.length ? pdfVersions.slice(0, 5).map((version) => (
                <div key={version.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  <div className="font-medium text-slate-900">{new Date(version.generated_at).toLocaleString("vi-VN")}</div>
                  <div className="mt-1 text-xs text-slate-500">{version.storage_path || version.pdf_url || "-"}</div>
                </div>
              )) : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">Chưa có lịch sử PDF.</div>}
            </div>
          </ThemeCard>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
