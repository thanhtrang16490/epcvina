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
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)} đ`;
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
    <div className="mt-5 space-y-5">
      {groups.map(([label, items]) => {
        const open = openGroups[label] ?? true;
        const total = items.reduce((sum, item) => sum + Number(item.total_price_vat ?? item.unit_price_vat * item.quantity), 0);
        const laborGroup = isLaborGroup(label);
        return (
          <div key={label} className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
            <button
              type="button"
              onClick={() => setOpenGroups((current) => ({ ...current, [label]: !open }))}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-[color:var(--text)]">{label}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                  <span>{laborGroup ? "1 khoản chi phí" : `${items.length} vật tư`}</span>
                  <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-0.5 font-medium text-[color:var(--text)]">
                    Tổng nhóm: {formatMillions(total)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-[color:var(--muted)]">
                {open ? "Thu gọn" : "Mở rộng"}
              </div>
            </button>
            {open && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)]">
                <table className="min-w-full divide-y divide-[color:var(--border)] text-sm">
                  <thead className="bg-[color:var(--panel-strong)]">
                    <tr className="text-left text-[color:var(--muted)]">
                      <th className="px-4 py-3 font-medium">Ảnh</th>
                      <th className="px-4 py-3 font-medium">Sản phẩm</th>
                      <th className="px-4 py-3 font-medium">Sản phẩm tham chiếu</th>
                      <th className="px-4 py-3 font-medium">SL</th>
                      <th className="px-4 py-3 font-medium">Giá tuỳ biến</th>
                      <th className="px-4 py-3 font-medium">Giá vốn</th>
                      <th className="px-4 py-3 font-medium">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    {items.map((item) => (
                      <tr key={item.id} className="bg-[color:var(--panel)]/60">
                        <td className="px-4 py-3">
                          <div className="h-12 w-12 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)]">
                            {getItemImage(item) ? <img src={getItemImage(item)} alt={getItemTitle(item)} className="h-full w-full object-cover" /> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[color:var(--text)]">{getItemTitle(item)}</div>
                          <div className="text-xs text-[color:var(--muted)]">{item.unit || (laborGroup ? "Công" : "")}</div>
                          <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                            Giá tuỳ biến: <span className="font-medium text-[color:var(--text)]">{formatMillions(getCustomPrice(item))}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[color:var(--muted)]">
                          <div className="text-sm font-medium text-[color:var(--text)]">{getReferenceLabel(item)}</div>
                          <div className="mt-1 text-[11px]">
                            Giá tham chiếu: <span className="font-medium text-[color:var(--text)]">{formatMillions(getReferencePrice(item))}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[color:var(--text)]">{laborGroup ? "1" : Number(item.quantity).toFixed(0)}</td>
                        <td className="px-4 py-3 text-[color:var(--text)]">{formatMillions(getCustomPrice(item))}</td>
                        <td className="px-4 py-3 text-[color:var(--text)]">{formatMillions(getReferencePrice(item))}</td>
                        <td className="px-4 py-3 text-[color:var(--text)]">{formatMillions(getCustomPrice(item))}</td>
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
