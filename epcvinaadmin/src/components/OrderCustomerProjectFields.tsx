"use client";

import { useEffect, useState } from "react";
import { AsyncLookupSelect } from "@/components/AsyncLookupSelect";

type CustomerDetails = {
  id: string;
  name: string;
  customer_type?: string | null;
  parent_company_id?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tax_code?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  address_detail?: string | null;
  billing_name?: string | null;
  billing_phone?: string | null;
  billing_email?: string | null;
};

type ProjectDetails = {
  id: string;
  name: string;
  customer_id?: string | null;
  address?: string | null;
  status?: string | null;
};

type Props = {
  defaultCustomerId?: string;
  defaultCustomerLabel?: string;
  defaultProjectId?: string;
  defaultProjectLabel?: string;
  defaultCustomerType?: "contact" | "company";
  defaultInvoiceCustomerId?: string;
  defaultInvoiceCustomerLabel?: string;
  defaultInvoiceContactId?: string;
  defaultInvoiceContactLabel?: string;
};

function customerModeLabel(customerType: "contact" | "company") {
  return customerType === "company" ? "Doanh nghiệp" : "Cá nhân / Liên hệ";
}

export function OrderCustomerProjectFields({
  defaultCustomerId = "",
  defaultCustomerLabel = "",
  defaultProjectId = "",
  defaultProjectLabel = "",
  defaultCustomerType = "contact",
  defaultInvoiceCustomerId = "",
  defaultInvoiceCustomerLabel = "",
  defaultInvoiceContactId = "",
  defaultInvoiceContactLabel = "",
}: Props) {
  const [customerType, setCustomerType] = useState<"contact" | "company">(defaultCustomerType);
  const [customerId, setCustomerId] = useState(defaultCustomerId);
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [invoiceCustomerId, setInvoiceCustomerId] = useState(defaultInvoiceCustomerId || defaultCustomerId || "");
  const [invoiceContactId, setInvoiceContactId] = useState(defaultInvoiceContactId || "");

  useEffect(() => {
    if (customerType !== "company" || !invoiceCustomerId) return;
    if (invoiceContactId) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const url = new URL(`/api/search/customers`, window.location.origin);
        url.searchParams.set("type", "contact");
        url.searchParams.set("parentCompanyId", invoiceCustomerId);
        const response = await fetch(url.toString(), { signal: controller.signal });
        const data = (await response.json()) as { items?: Array<{ id: string }> };
        const firstContactId = data.items?.[0]?.id ?? "";
        if (firstContactId) setInvoiceContactId(firstContactId);
      } catch {
        // noop
      }
    }, 150);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [customerType, invoiceContactId, invoiceCustomerId]);

  useEffect(() => {
    if (customerType !== "company") return;
    setInvoiceContactId("");
  }, [customerType, invoiceCustomerId]);

  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Đối tượng</span>
        <select
          name="customer_type"
          value={customerType}
          onChange={(event) => {
            const next = event.target.value === "company" ? "company" : "contact";
            setCustomerType(next);
            if (next === "contact") {
              setInvoiceCustomerId("");
              setInvoiceContactId("");
            } else {
              setInvoiceCustomerId(customerId);
            }
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40"
        >
          <option value="contact">Cá nhân / Liên hệ</option>
          <option value="company">Doanh nghiệp</option>
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Khách hàng</span>
        <AsyncLookupSelect
          name="customer_id"
          value={customerId}
          onValueChange={(nextCustomerId) => {
            setCustomerId(nextCustomerId);
            setProjectId("");
            if (customerType === "company") setInvoiceCustomerId(nextCustomerId);
          }}
          placeholder={customerModeLabel(customerType)}
          endpoint="/api/search/customers"
          initialLabel={defaultCustomerLabel}
          renderSelected={(item) =>
            item ? <div className="text-xs text-slate-600">{item.label}{item.meta ? ` · ${item.meta}` : ""}</div> : null
          }
        />
        <div className="text-xs text-slate-500">Bấm vào ô khách hàng để mở danh sách hoặc gõ tên để tìm nhanh.</div>
        {customerType === "company" ? (
          <div className="text-xs text-slate-500">Đang chọn doanh nghiệp. Bên dưới chọn người phụ trách liên kết với doanh nghiệp.</div>
        ) : null}
      </label>

      {customerType === "company" ? (
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Người phụ trách</span>
          <AsyncLookupSelect
            name="invoice_contact_id"
            value={invoiceContactId}
            onValueChange={setInvoiceContactId}
            placeholder="Chọn contact liên kết"
            endpoint={`/api/search/customers?type=contact${invoiceCustomerId ? `&parentCompanyId=${encodeURIComponent(invoiceCustomerId)}` : ""}`}
            initialLabel={defaultInvoiceContactLabel}
            renderSelected={(item) => (item ? <div className="text-xs text-slate-600">{item.label}{item.meta ? ` · ${item.meta}` : ""}</div> : null)}
          />
          <div className="text-xs text-slate-500">Chỉ hiện liên hệ thuộc doanh nghiệp đã chọn.</div>
        </label>
      ) : (
        <input type="hidden" name="invoice_customer_id" value={customerId} readOnly />
      )}
      {customerType === "company" ? <input type="hidden" name="invoice_customer_id" value={invoiceCustomerId || customerId} readOnly /> : null}

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Dự án</span>
        <AsyncLookupSelect
          name="project_id"
          value={projectId}
          onValueChange={(nextProjectId) => {
            setProjectId(nextProjectId);
          }}
          placeholder="Chọn dự án"
          endpoint={`/api/search/projects${customerId ? `?customerId=${encodeURIComponent(customerId)}` : ""}`}
          initialLabel={defaultProjectLabel}
          renderSelected={(item) => (item ? <div className="text-xs text-slate-600">{item.label}{item.meta ? ` · ${item.meta}` : ""}</div> : null)}
        />
      </label>
    </div>
  );
}
