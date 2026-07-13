"use client";

import { useMemo, useState } from "react";
import { comboItemGroups, getProductGroup } from "@/lib/combo-builder";

type ProductOption = {
  id: string;
  name: string;
  brand: string;
  category: string;
  quantity?: number;
  sale_price_vat?: number;
  cost_price?: number;
  cover_image_url?: string;
};

type GroupRow = {
  product_id: string;
  quantity: number;
};

type InitialRows = Record<string, GroupRow[]>;

type Props = {
  products: ProductOption[];
  initialRows?: InitialRows;
  title?: string;
  description?: string;
};

function buildEmptyRows() {
  return comboItemGroups.reduce<InitialRows>((acc, group) => {
    acc[group.id] = [{ product_id: "", quantity: 1 }];
    return acc;
  }, {});
}

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

function formatVND(value: number) {
  return `${currency.format(value)} đ`;
}

export function ComboItemPicker({ products, initialRows, title, description }: Props) {
  const productsByGroup = useMemo(() => {
    return comboItemGroups.reduce<Record<string, ProductOption[]>>((acc, group) => {
      acc[group.id] = products.filter((product) => getProductGroup(product as never) === group.id);
      return acc;
    }, {});
  }, [products]);

  const [rowsByGroup, setRowsByGroup] = useState<InitialRows>(() => {
    const base = buildEmptyRows();
    if (!initialRows) return base;
    return comboItemGroups.reduce<InitialRows>((acc, group) => {
      const rows = initialRows[group.id]?.length ? initialRows[group.id] : base[group.id];
      acc[group.id] = rows.map((row) => ({
        product_id: String(row.product_id ?? ""),
        quantity: Number(row.quantity ?? 1) > 0 ? Number(row.quantity ?? 1) : 1,
      }));
      return acc;
    }, {});
  });
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [draftProductId, setDraftProductId] = useState("");
  const [draftQuantity, setDraftQuantity] = useState(1);
  const activeGroup = comboItemGroups.find((group) => group.id === activeGroupId) ?? null;
  const selectedProductById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const updateRow = (groupId: string, index: number, next: Partial<GroupRow>) => {
    setRowsByGroup((current) => ({
      ...current,
      [groupId]: current[groupId].map((row, rowIndex) => (rowIndex === index ? { ...row, ...next } : row)),
    }));
  };

  const addRow = (groupId: string) => {
    if (!draftProductId) return;
    setRowsByGroup((current) => ({
      ...current,
      [groupId]: [...current[groupId], { product_id: draftProductId, quantity: Math.max(1, draftQuantity) }],
    }));
    setActiveGroupId(null);
    setDraftProductId("");
    setDraftQuantity(1);
  };

  const removeRow = (groupId: string, index: number) => {
    setRowsByGroup((current) => {
      const rows = current[groupId].filter((_, rowIndex) => rowIndex !== index);
      return {
        ...current,
        [groupId]: rows.length ? rows : [{ product_id: "", quantity: 1 }],
      };
    });
  };

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 text-[color:var(--text)]">
      {(title || description) && (
        <div className="mb-4">
          {title ? <div className="text-sm font-medium text-[color:var(--text)]">{title}</div> : null}
          {description ? <p className="mt-1 text-xs text-[color:var(--muted)]">{description}</p> : null}
        </div>
      )}
      <div className="space-y-4">
        {comboItemGroups.map((group) => (
          <div key={group.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-[color:var(--text)]">{group.label}</div>
                <div className="text-xs text-[color:var(--muted)]">{productsByGroup[group.id]?.length ?? 0} sản phẩm khả dụng</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveGroupId(group.id);
                  setDraftProductId(productsByGroup[group.id]?.[0]?.id ?? "");
                  setDraftQuantity(1);
                }}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-200"
              >
                + Thêm dòng
              </button>
            </div>

            <input type="hidden" name={`${group.id}_items_json`} value={JSON.stringify(rowsByGroup[group.id] ?? [])} />

            <div className="space-y-2">
              {(rowsByGroup[group.id] ?? []).map((row, index) => (
                <div key={`${group.id}-${index}`} className="grid gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-2 md:grid-cols-[1fr_110px_auto]">
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2">
                    <select
                      value={row.product_id}
                      onChange={(event) => updateRow(group.id, index, { product_id: event.target.value })}
                      className="min-w-0 w-full bg-transparent text-sm text-[color:var(--text)] outline-none"
                    >
                      <option value="">Chọn sản phẩm</option>
                      {productsByGroup[group.id]?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.brand} - {product.name}
                        </option>
                      ))}
                    </select>
                    {row.product_id && selectedProductById.get(row.product_id) ? (
                      <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                        GV: {formatVND(Number(selectedProductById.get(row.product_id)?.cost_price ?? 0))} · GB:{" "}
                        {formatVND(Number(selectedProductById.get(row.product_id)?.sale_price_vat ?? 0))}
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={row.quantity}
                      onChange={(event) => updateRow(group.id, index, { quantity: Number(event.target.value) || 1 })}
                      className="w-full bg-transparent text-sm text-[color:var(--text)] outline-none"
                      placeholder="Số lượng"
                    />
                    {row.product_id && selectedProductById.get(row.product_id) ? (
                      <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                        Thành tiền GV: {formatVND(Number(selectedProductById.get(row.product_id)?.cost_price ?? 0) * Number(row.quantity || 1))}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(group.id, index)}
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--muted)]"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-5 text-[color:var(--text)] shadow-[var(--surface-shadow)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">Thêm sản phẩm</div>
                <h3 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{activeGroup.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Chọn sản phẩm và số lượng để thêm vào nhóm này.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGroupId(null)}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2 text-sm text-[color:var(--text)]"
              >
                Đóng
              </button>
            </div>
            <div className="grid gap-3">
              <select
                value={draftProductId}
                onChange={(event) => setDraftProductId(event.target.value)}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)] outline-none"
              >
                <option value="">Chọn sản phẩm</option>
                {productsByGroup[activeGroup.id]?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.brand} - {product.name} | GV {formatVND(Number(product.cost_price ?? 0))} | GB {formatVND(Number(product.sale_price_vat ?? 0))}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                step={1}
                value={draftQuantity}
                onChange={(event) => setDraftQuantity(Number(event.target.value) || 1)}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 text-sm text-[color:var(--text)] outline-none"
                placeholder="Số lượng"
              />
              <button
                type="button"
                onClick={() => addRow(activeGroup.id)}
                className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950"
              >
                Thêm vào combo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
