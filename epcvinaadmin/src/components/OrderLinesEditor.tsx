"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { comboItemGroups } from "@/lib/combo-builder";

type Option = { id: string; name: string };

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
  combos: Option[];
  products: Option[];
  initialLines?: Line[];
  comboBomMap?: Record<string, { name: string; groups: Array<[string, any[]]>; rows: any[] }>;
  onSummaryChange?: (summary: { subtotal: number; comboSubtotal: number; productSubtotal: number; lineCount: number }) => void;
};

function emptyLine(): Line {
  return {
    line_type: "combo",
    combo_id: "",
    product_id: "",
    item_name: "",
    quantity: 1,
    unit_price: 0,
    sort_order: 0,
    note: "",
  };
}

export function OrderLinesEditor({ combos, products, initialLines, comboBomMap = {}, onSummaryChange }: Props) {
  const [lines, setLines] = useState<Line[]>(
    initialLines?.length
      ? initialLines.map((line) => ({
          line_type: line.line_type === "product" ? "product" : "combo",
          combo_id: String(line.combo_id ?? ""),
          product_id: String(line.product_id ?? ""),
          item_name: String(line.item_name ?? ""),
          quantity: Number(line.quantity ?? 1) || 1,
          unit_price: Number(line.unit_price ?? 0) || 0,
          sort_order: Number(line.sort_order ?? 0) || 0,
          note: String(line.note ?? ""),
        }))
      : [emptyLine()],
  );

  const rows = useMemo(() => lines, [lines]);
  const comboLabelById = useMemo(() => new Map(combos.map((combo) => [combo.id, combo.name])), [combos]);
  const formatMoney = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value);
  const groupOrder = ["panel", "inverter", "battery", "mounting", "wiring", "cabinet", "grounding", "labor"] as const;
  const groupLabelById = new Map([
    ...comboItemGroups.map((group) => [group.id, group.label] as const),
    ["labor", "Nhân công lắp đặt"] as const,
  ]);
  const groupTitleOrder = groupOrder.map((groupId) => [groupId, groupLabelById.get(groupId) ?? groupId] as const);

  const updateLine = (index: number, next: Partial<Line>) => {
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...next } : line)));
  };

  const getComboSalePrice = (comboId: string) => {
    const selectedCombo = comboBomMap[comboId];
    const selectedRows = selectedCombo?.rows ?? [];
    return selectedRows.reduce(
      (sum, item) => sum + Number(item.total_price_vat ?? Number(item.unit_price_vat ?? 0) * Number(item.quantity ?? 1)),
      0,
    );
  };

  const addLine = () => setLines((current) => [...current, emptyLine()]);
  const removeLine = (index: number) => setLines((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : [emptyLine()]));

  const summary = useMemo(() => {
    const subtotal = rows.reduce((sum, line) => sum + Number(line.quantity ?? 0) * Number(line.unit_price ?? 0), 0);
    const comboSubtotal = rows.filter((line) => line.line_type === "combo").reduce((sum, line) => sum + Number(line.quantity ?? 0) * Number(line.unit_price ?? 0), 0);
    const productSubtotal = rows.filter((line) => line.line_type === "product").reduce((sum, line) => sum + Number(line.quantity ?? 0) * Number(line.unit_price ?? 0), 0);
    return { subtotal, comboSubtotal, productSubtotal, lineCount: rows.length };
  }, [rows]);

  useEffect(() => {
    onSummaryChange?.(summary);
  }, [onSummaryChange, summary]);

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Order lines</div>
          <div className="mt-1 text-sm text-slate-500">Bảng dòng đơn hàng kiểu Odoo. Mỗi dòng là 1 combo hoặc 1 sản phẩm.</div>
        </div>
        <button type="button" onClick={addLine} className="rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[color:var(--accent)]">
          + Thêm dòng
        </button>
      </div>

      <input type="hidden" name="order_lines_json" value={JSON.stringify(rows)} />

      <div className="mt-4 overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-[980px] divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2">Loại</th>
              <th className="px-3 py-2">Combo / Sản phẩm</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">SL</th>
              <th className="px-3 py-2">Đơn giá</th>
              <th className="px-3 py-2">Thứ tự</th>
              <th className="px-3 py-2">Ghi chú</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((line, index) => {
              const options = line.line_type === "combo" ? combos : products;
              const selectedCombo = line.line_type === "combo" ? comboBomMap[line.combo_id] ?? null : null;
              const selectedRows = selectedCombo?.rows ?? [];
              const rowsByGroup = selectedRows.reduce<Record<string, any[]>>((acc, item) => {
                const groupId = String(item.sheet_group ?? "").trim() || "other";
                const next = acc[groupId] ?? [];
                next.push(item);
                acc[groupId] = next;
                return acc;
              }, {});
              const groupedRows = groupOrder.flatMap((groupId) => {
                const groupRows = rowsByGroup[groupId] ?? [];
                const label = groupLabelById.get(groupId) ?? groupId;
                return groupRows.length ? [[label, groupRows] as const] : [];
              });
              const otherRows = rowsByGroup.other ?? [];
              if (otherRows.length) groupedRows.push(["Khác", otherRows] as const);
              const selectedQty = selectedRows.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
              const selectedCost = selectedRows.reduce((sum, item) => sum + Number(item.total_cost_price ?? Number(item.cost_price ?? 0) * Number(item.quantity ?? 1)), 0);
              const selectedSale = selectedRows.reduce((sum, item) => sum + Number(item.total_price_vat ?? Number(item.unit_price_vat ?? 0) * Number(item.quantity ?? 1)), 0);
              return (
                <Fragment key={index}>
                  <tr key={index} className="bg-white">
                    <td className="px-3 py-2">
                      <select
                        value={line.line_type}
                        onChange={(event) =>
                          updateLine(index, {
                            line_type: event.target.value as "combo" | "product",
                            combo_id: "",
                            product_id: "",
                            item_name: "",
                          })
                        }
                        className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                      >
                        <option value="combo">Combo</option>
                        <option value="product">Sản phẩm</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={line.line_type === "combo" ? line.combo_id : line.product_id}
                          onChange={(event) => {
                            const selectedId = event.target.value;
                            const selectedName = options.find((option) => option.id === selectedId)?.name ?? "";
                            const comboSalePrice = line.line_type === "combo" ? getComboSalePrice(selectedId) : 0;
                            updateLine(
                              index,
                              line.line_type === "combo"
                                ? { combo_id: selectedId, item_name: selectedName, unit_price: comboSalePrice }
                                : { product_id: selectedId, item_name: selectedName },
                            );
                          }}
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                        >
                          <option value="">{line.line_type === "combo" ? "Chọn combo" : "Chọn sản phẩm"}</option>
                          {options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {line.line_type === "combo" && selectedCombo ? (
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-600">SL vật tư: {selectedQty}</div>
                          <div className="text-[11px] text-slate-600">GV: {formatMoney(selectedCost)} đ</div>
                          <div className="text-[11px] text-slate-600">GB: {formatMoney(selectedSale)} đ</div>
                        </div>
                      ) : (
                        <input
                          value={line.item_name}
                          onChange={(event) => updateLine(index, { item_name: event.target.value })}
                          className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                          placeholder="Tên dòng"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <FormattedNumberInput
                        name={`line_quantity_${index}`}
                        value={line.quantity}
                        min={1}
                        step={1}
                        onValueChange={(value) => updateLine(index, { quantity: Number(value) || 1 })}
                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormattedNumberInput
                        name={`line_unit_price_${index}`}
                        value={line.unit_price}
                        min={0}
                        step={1}
                        onValueChange={(value) => updateLine(index, { unit_price: Number(value) || 0 })}
                        className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FormattedNumberInput
                        name={`line_sort_${index}`}
                        value={line.sort_order}
                        min={0}
                        step={1}
                        onValueChange={(value) => updateLine(index, { sort_order: Number(value) || 0 })}
                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={line.note}
                        onChange={(event) => updateLine(index, { note: event.target.value })}
                        className="w-60 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
                        placeholder="Ghi chú"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => removeLine(index)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                        Xóa
                      </button>
                    </td>
                  </tr>
                  {line.line_type === "combo" && selectedCombo ? (
                    <tr key={`${index}-preview`}>
                      <td colSpan={8} className="bg-slate-50 px-3 py-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--accent)]">Combo preview</div>
                              <div className="mt-1 text-sm font-medium text-slate-900">{selectedCombo.name || comboLabelById.get(line.combo_id) || line.item_name || "Combo"}</div>
                            </div>
                            <div className="text-xs text-slate-500">
                              {selectedRows.length ? `${selectedRows.length} vật tư · Tự bung bảng ngay sau khi chọn` : "Bảng combo tự hiện ngay sau khi chọn"}
                            </div>
                          </div>
                          <div className="mb-3 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng số lượng</div>
                              <div className="mt-1 text-sm font-medium text-slate-900">{selectedQty}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng giá vốn</div>
                              <div className="mt-1 text-sm font-medium text-slate-900">{formatMoney(selectedCost)} đ</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Tổng giá bán</div>
                              <div className="mt-1 text-sm font-medium text-slate-900">{formatMoney(selectedSale)} đ</div>
                            </div>
                          </div>
                          {selectedRows.length ? (
                            <div className="overflow-hidden rounded-2xl border border-slate-200">
                              <table className="min-w-full divide-y divide-slate-200 text-xs">
                                <thead className="bg-white text-slate-500">
                                  <tr>
                                    <th className="px-3 py-2 text-left">No.</th>
                                    <th className="px-3 py-2 text-left">Category</th>
                                    <th className="px-3 py-2 text-left">Specification</th>
                                    <th className="px-3 py-2 text-left">Brand</th>
                                    <th className="px-3 py-2 text-left">Unit</th>
                                    <th className="px-3 py-2 text-left">SL</th>
                                    <th className="px-3 py-2 text-left">GV</th>
                                    <th className="px-3 py-2 text-left">GB</th>
                                    <th className="px-3 py-2 text-left">Margin</th>
                                    <th className="px-3 py-2 text-left">Bảo hành</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                  {groupTitleOrder.flatMap(([groupId, groupLabel]) => {
                                    const groupRows = selectedRows.filter((item) => String(item.sheet_group ?? "").trim() === groupId);
                                    if (!groupRows.length) return [];
                                    const groupSale = groupRows.reduce((sum, item) => sum + Number(item.total_price_vat ?? Number(item.unit_price_vat ?? 0) * Number(item.quantity ?? 1)), 0);
                                    const groupCost = groupRows.reduce((sum, item) => sum + Number(item.total_cost_price ?? Number(item.cost_price ?? 0) * Number(item.quantity ?? 1)), 0);
                                    const groupQty = groupRows.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
                                    const rowsForGroup = [
                                      <tr key={`${line.combo_id}-${groupId}-header`} className="bg-slate-50">
                                        <td colSpan={10} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                                          {groupLabel}
                                          <span className="ml-3 font-normal normal-case tracking-normal text-slate-500">
                                            {groupRows.length} dòng · SL {groupQty} · {formatMoney(groupSale)} đ bán · {formatMoney(groupCost)} đ vốn
                                          </span>
                                        </td>
                                      </tr>,
                                      ...groupRows.map((item: any, rowIndex: number) => {
                                        const cost = Number(item.total_cost_price ?? Number(item.cost_price ?? 0) * Number(item.quantity ?? 1));
                                        const sale = Number(item.total_price_vat ?? Number(item.unit_price_vat ?? 0) * Number(item.quantity ?? 1));
                                        const margin = sale > 0 ? Math.round(((sale - cost) / sale) * 100) : 0;
                                        return (
                                          <tr key={`${line.combo_id}-${groupId}-${rowIndex}`} className="align-top">
                                            <td className="px-3 py-2 text-slate-700">{Number(item.no ?? rowIndex + 1)}</td>
                                            <td className="px-3 py-2 text-slate-900">{item.category || "-"}</td>
                                            <td className="px-3 py-2 text-slate-900">
                                              <div className="font-medium">{item.item_name || "Vật tư"}</div>
                                            </td>
                                            <td className="px-3 py-2 text-slate-700">{item.brand || "-"}</td>
                                            <td className="px-3 py-2 text-slate-700">{item.unit || "-"}</td>
                                            <td className="px-3 py-2 text-slate-700">{Number(item.quantity ?? 0)}</td>
                                            <td className="px-3 py-2 text-slate-700">{formatMoney(cost)} đ</td>
                                            <td className="px-3 py-2 text-slate-700">{formatMoney(sale)} đ</td>
                                            <td className="px-3 py-2 text-slate-700">{margin}%</td>
                                            <td className="px-3 py-2 text-slate-700">{item.warranty || "-"}</td>
                                          </tr>
                                        );
                                      }),
                                    ];
                                    return rowsForGroup;
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                              Combo này chưa có BOM rows để hiển thị. Hãy kiểm tra lại dữ liệu combo_items hoặc sheet_group.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
