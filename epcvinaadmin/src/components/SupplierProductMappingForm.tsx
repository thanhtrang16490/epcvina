"use client";

import { useState } from "react";
import { AsyncLookupSelect } from "@/components/AsyncLookupSelect";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export function SupplierProductMappingForm({ action }: Props) {
  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");

  return (
    <form action={action} className="grid gap-3">
      <AsyncLookupSelect name="supplier_id" value={supplierId} onValueChange={setSupplierId} placeholder="Chọn nhà cung cấp" endpoint="/api/search/suppliers" />
      <AsyncLookupSelect name="product_id" value={productId} onValueChange={setProductId} placeholder="Chọn sản phẩm" endpoint="/api/search/products" />
      <input name="supplier_sku" placeholder="SKU nhà cung cấp" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
      <div className="grid grid-cols-3 gap-3">
        <FormattedNumberInput name="supplier_price" placeholder="Giá NCC" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
        <FormattedNumberInput name="min_order_qty" defaultValue={1} placeholder="MOQ" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
        <FormattedNumberInput name="lead_time_days" placeholder="Lead time" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
      </div>
      <textarea name="note" rows={4} placeholder="Ghi chú" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
      <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">Lưu mapping</button>
    </form>
  );
}
