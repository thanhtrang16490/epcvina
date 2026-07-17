"use client";

import { useState } from "react";

type BomItem = {
  id: string;
  category: string;
  item_name: string;
  brand: string;
  unit: string;
  quantity: number;
  unit_price_vat: number;
  total_price_vat: number;
  cost_price: number;
  total_cost_price: number;
  product?: {
    name?: string;
    brand?: string;
    cover_image_url?: string;
    image_urls?: string[];
  } | null;
};

type Props = {
  groups: Array<[string, BomItem[]]>;
};

function formatMillions(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Math.round(Number(value ?? 0) / 1000) * 1000)} đ`;
}

function getItemTitle(item: BomItem) {
  return item.item_name || item.product?.name || item.category || "Vật tư";
}

function getReferenceLabel(item: BomItem) {
  const productName = item.product?.name?.trim();
  const productBrand = item.product?.brand?.trim();
  if (productBrand && productName) return `${productBrand} · ${productName}`;
  return productName || productBrand || "Không gắn sản phẩm tham chiếu";
}

function getDisplayBrand(item: BomItem) {
  return item.brand?.trim() || item.product?.brand?.trim() || "EPCVINA";
}

function getCustomPrice(item: BomItem) {
  return Number(item.total_price_vat || item.unit_price_vat * item.quantity || 0);
}

function getReferencePrice(item: BomItem) {
  return Number(item.total_cost_price || item.cost_price * item.quantity || 0);
}

function getItemImage(item: BomItem) {
  return item.product?.cover_image_url || item.product?.image_urls?.[0] || "";
}

function isLaborGroup(label: string) {
  const text = label.toLowerCase();
  return text.includes("nhân công") || text.includes("nhan cong") || text.includes("lao động") || text.includes("lao dong");
}

export function ComboBomAccordion({ groups }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map(([label]) => [label, true])),
  );

  return (
    <div className="mt-5 space-y-4">
      {groups.map(([label, items]) => {
        const open = openGroups[label] ?? true;
        const total = items.reduce((sum, item) => sum + Number(item.total_price_vat ?? item.unit_price_vat * item.quantity), 0);
        const laborGroup = isLaborGroup(label);
        return (
          <div key={label} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <button
              type="button"
              onClick={() => setOpenGroups((current) => ({ ...current, [label]: !open }))}
              className="flex w-full items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-left hover:bg-slate-100/70"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                  {laborGroup ? "LC" : "B"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{label}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{laborGroup ? "1 khoản chi phí" : `${items.length} vật tư`}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700">
                      Tổng nhóm: {formatMillions(total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-slate-500">
                {open ? "Thu gọn" : "Mở rộng"}
              </div>
            </button>
            {open && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-white text-slate-500">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium">Ảnh</th>
                      <th className="px-4 py-3 font-medium">Vật tư</th>
                      <th className="px-4 py-3 font-medium">Tham chiếu</th>
                      <th className="px-4 py-3 font-medium">Số lượng</th>
                      <th className="px-4 py-3 font-medium">Giá vốn</th>
                      <th className="px-4 py-3 font-medium">Giá bán</th>
                      <th className="px-4 py-3 font-medium">Biên lợi nhuận</th>
                      <th className="px-4 py-3 font-medium">Tồn kho</th>
                      <th className="px-4 py-3 font-medium">Kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {items.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {getItemImage(item) ? <img src={getItemImage(item)} alt={getItemTitle(item)} className="h-full w-full object-cover" /> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{getItemTitle(item)}</div>
                          <div className="mt-1 text-xs text-slate-500">{item.unit || (laborGroup ? "Công" : "-")}</div>
                          <div className="mt-1 inline-flex rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-500">
                            {laborGroup ? "Nhân công lắp đặt" : item.category || "BOM line"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{getDisplayBrand(item)}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          <div className="text-sm font-medium text-slate-900">{getReferenceLabel(item)}</div>
                          <div className="mt-1 text-xs">Nhập tay từ sheet nếu chưa có tham chiếu</div>
                        </td>
                        <td className="px-4 py-3 text-slate-900">{laborGroup ? "1" : Number(item.quantity).toFixed(0)}</td>
                        <td className="px-4 py-3 text-slate-900">{formatMillions(getReferencePrice(item))}</td>
                        <td className="px-4 py-3 text-slate-900">{formatMillions(getCustomPrice(item))}</td>
                        <td className="px-4 py-3 text-slate-900">
                          {getCustomPrice(item) > 0 && getReferencePrice(item) > 0
                            ? `${Math.round(((getCustomPrice(item) - getReferencePrice(item)) / getCustomPrice(item)) * 100)}%`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-900">{Number(item.inventory ?? 0).toFixed(0)}</td>
                        <td className="px-4 py-3 text-slate-900">{item.warehouse || "Main"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
