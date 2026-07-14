"use client";

import { useMemo, useState } from "react";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { comboItemGroups } from "@/lib/combo-builder";

export type ComboExcelSheetRow = {
  no: number;
  product_id: string;
  reference_product_id?: string;
  category: string;
  specification: string;
  brand_name: string;
  unit: string;
  quantity: number;
  unit_price_vat: number;
  warranty: string;
  cost_price: number;
  gross_margin: number;
  notes: string;
};

type Props = {
  comboId: string;
  title?: string;
  description?: string;
  initialRows: ComboExcelSheetRow[];
  products: { id: string; brand: string; name: string; cost_price?: number; sale_price_vat?: number }[];
  onSaveAction: (formData: FormData) => Promise<void>;
};

function emptyRow(no: number): ComboExcelSheetRow {
  return {
    no,
    product_id: "",
    category: "",
    specification: "",
    brand_name: "",
    unit: "Cái",
    quantity: 1,
    unit_price_vat: 0,
    warranty: "",
    cost_price: 0,
    gross_margin: 0,
    notes: "",
  };
}

function clampRow(row: ComboExcelSheetRow, no: number): ComboExcelSheetRow {
  return {
    ...row,
    no,
    product_id: String(row.product_id ?? ""),
    reference_product_id: String(row.reference_product_id ?? ""),
    quantity: Number(row.quantity || 0) > 0 ? Number(row.quantity) : 1,
    unit_price_vat: Number(row.unit_price_vat || 0),
    cost_price: Number(row.cost_price || 0),
    gross_margin: Number(row.gross_margin || 0),
  };
}

function calcTotal(value: number, quantity: number) {
  return Math.round(Number(value || 0) * Number(quantity || 0));
}

function inferGroupId(row: ComboExcelSheetRow) {
  const text = `${row.category ?? ""} ${row.specification ?? ""}`.toLowerCase();
  if (text.includes("nhan cong") || text.includes("nhân công") || text.includes("thi cong") || text.includes("thi công")) return "labor";
  if (text.includes("pin lưu trữ") || text.includes("battery") || text.includes("lithium")) return "battery";
  if (text.includes("tấm pin") || text.includes("panel") || text.includes("pv")) return "panel";
  if (text.includes("inverter") || text.includes("biến tần")) return "inverter";
  if (text.includes("khung") || text.includes("rail") || text.includes("mount")) return "mounting";
  if (text.includes("dây") || text.includes("cáp") || text.includes("wire") || text.includes("mc4")) return "wiring";
  if (text.includes("tủ điện") || text.includes("cabinet") || text.includes("meter")) return "cabinet";
  if (text.includes("tiếp địa") || text.includes("ground")) return "grounding";
  return "wiring";
}

export function ComboExcelSheetEditor({ comboId, title = "Edit Excel", description = "Chỉnh BOM theo bảng giống data sheet.", initialRows, products, onSaveAction }: Props) {
  const [rows, setRows] = useState<ComboExcelSheetRow[]>(
    initialRows.length ? initialRows.map((row, index) => clampRow(row, index + 1)) : [emptyRow(1)],
  );

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.sale += calcTotal(row.unit_price_vat, row.quantity);
        acc.cost += calcTotal(row.cost_price, row.quantity);
        return acc;
      },
      { sale: 0, cost: 0 },
    );
  }, [rows]);

  const rowsByGroup = useMemo(() => {
    return comboItemGroups.reduce<Record<string, ComboExcelSheetRow[]>>((acc, group) => {
      acc[group.id] = rows.filter((row) => inferGroupId(row) === group.id);
      return acc;
    }, {});
  }, [rows]);

  const groupTotals = useMemo(() => {
    return comboItemGroups.reduce<Record<string, { sale: number; cost: number }>>((acc, group) => {
      const grouped = rowsByGroup[group.id] ?? [];
      acc[group.id] = grouped.reduce(
        (sum, row) => ({
          sale: sum.sale + calcTotal(row.unit_price_vat, row.quantity),
          cost: sum.cost + calcTotal(row.cost_price, row.quantity),
        }),
        { sale: 0, cost: 0 },
      );
      return acc;
    }, {});
  }, [rowsByGroup]);

  const updateRow = (index: number, next: Partial<ComboExcelSheetRow>) => {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? clampRow({ ...row, ...next }, row.no) : row)),
    );
  };

  const addRowToGroup = (groupId: string) => {
    const label = comboItemGroups.find((group) => group.id === groupId)?.label ?? "";
    setRows((current) => [...current, clampRow({ ...emptyRow(current.length + 1), category: label }, current.length + 1)]);
  };

  const removeRow = (index: number) => {
    setRows((current) => {
      const next = current.filter((_, rowIndex) => rowIndex !== index).map((row, rowIndex) => ({ ...row, no: rowIndex + 1 }));
      return next.length ? next : [emptyRow(1)];
    });
  };

  return (
    <form action={onSaveAction} className="space-y-4">
      <input type="hidden" name="id" value={comboId} />
      <input type="hidden" name="excel_rows_json" value={JSON.stringify(rows)} />
      <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[var(--surface-shadow)]">
        <div className="flex flex-col gap-3 border-b border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent)]">Excel BOM</div>
            <h1 className="mt-1 text-xl font-semibold text-[color:var(--text)]">{title}</h1>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-[color:var(--muted)]">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addRowToGroup("panel")} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--text)]">
              + Tấm pin
            </button>
            <button type="button" onClick={() => addRowToGroup("inverter")} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--text)]">
              + Inverter
            </button>
            <button type="button" onClick={() => addRowToGroup("battery")} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--text)]">
              + Pin
            </button>
            <button type="button" onClick={() => addRowToGroup("wiring")} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--text)]">
              + Phụ trợ
            </button>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {comboItemGroups.map((group) => {
            const groupedRows = rowsByGroup[group.id] ?? [];
            const groupSale = groupTotals[group.id]?.sale ?? 0;
            const groupCost = groupTotals[group.id]?.cost ?? 0;
            return (
              <details key={group.id} open className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3">
                  <div>
                    <div className="text-xs font-semibold text-[color:var(--text)]">{group.label}</div>
                    <div className="mt-1 text-[11px] text-[color:var(--muted)]">
                      {groupedRows.length} dòng · Giá bán {groupSale.toLocaleString("vi-VN")} đ · Giá vốn {groupCost.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      addRowToGroup(group.id);
                    }}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100"
                  >
                    + Thêm dòng
                  </button>
                </summary>
                <div className="overflow-x-auto border-t border-[color:var(--border)]">
                  <table className="min-w-[1260px] divide-y divide-[color:var(--border)] text-left text-xs">
                    <thead className="bg-[color:var(--bg-elevated)] text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      <tr>
                        <th className="px-2 py-2">No.</th>
                        <th className="px-2 py-2">Category</th>
                        <th className="px-2 py-2">Specification</th>
                        <th className="px-2 py-2">Brand Name</th>
                        <th className="px-2 py-2">Unit</th>
                        <th className="px-2 py-2">Qty</th>
                        <th className="px-2 py-2">Unit Price</th>
                        <th className="px-2 py-2">Total Price</th>
                        <th className="px-2 py-2">Warranty</th>
                        <th className="px-2 py-2">Cost</th>
                        <th className="px-2 py-2">Total Cost</th>
                        <th className="px-2 py-2">Margin</th>
                        <th className="px-2 py-2">Product Ref</th>
                        <th className="px-2 py-2">Notes</th>
                        <th className="px-2 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--border)]">
                      {groupedRows.length ? (
                        groupedRows.map((row) => {
                          const index = rows.findIndex((item) => item.no === row.no);
                          const totalSale = calcTotal(row.unit_price_vat, row.quantity);
                          const totalCost = calcTotal(row.cost_price, row.quantity);
                          const margin = totalSale > 0 ? ((totalSale - totalCost) / totalSale) * 100 : 0;
                          return (
                            <tr key={`${group.id}-${row.no}`} className="bg-[color:var(--panel)]">
                              <td className="px-2 py-2 text-[color:var(--muted)]">{row.no}</td>
                              <td className="px-2 py-2">
                                <input value={row.category} onChange={(event) => updateRow(index, { category: event.target.value })} className="w-36 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <textarea value={row.specification} onChange={(event) => updateRow(index, { specification: event.target.value })} rows={1} className="w-64 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs leading-5 text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <input value={row.brand_name} onChange={(event) => updateRow(index, { brand_name: event.target.value })} className="w-28 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <input value={row.unit} onChange={(event) => updateRow(index, { unit: event.target.value })} className="w-20 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <FormattedNumberInput name={`qty_${row.no}`} min={0} step={1} value={row.quantity} onValueChange={(value) => updateRow(index, { quantity: Number(value) || 1 })} className="w-20 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <FormattedNumberInput name={`unit_price_vat_${row.no}`} min={0} step={1} value={row.unit_price_vat} onValueChange={(value) => updateRow(index, { unit_price_vat: Number(value) || 0 })} className="w-32 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2 text-[color:var(--text)]">{totalSale.toLocaleString("vi-VN")}</td>
                              <td className="px-2 py-2">
                                <input value={row.warranty} onChange={(event) => updateRow(index, { warranty: event.target.value })} className="w-24 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <FormattedNumberInput name={`cost_${row.no}`} min={0} step={1} value={row.cost_price} onValueChange={(value) => updateRow(index, { cost_price: Number(value) || 0 })} className="w-32 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2 text-[color:var(--text)]">{totalCost.toLocaleString("vi-VN")}</td>
                              <td className="px-2 py-2 text-[color:var(--text)]">{margin.toFixed(1)}%</td>
                              <td className="px-2 py-2">
                                <select
                                  value={row.reference_product_id ?? row.product_id}
                                  onChange={(event) => updateRow(index, { product_id: event.target.value, reference_product_id: event.target.value })}
                                  className="w-52 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none"
                                >
                                  <option value="">Chọn tham chiếu</option>
                                  {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.brand} - {product.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-2 py-2">
                                <input value={row.notes} onChange={(event) => updateRow(index, { notes: event.target.value })} className="w-36 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)] outline-none" />
                              </td>
                              <td className="px-2 py-2">
                                <button type="button" onClick={() => removeRow(index)} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-1.5 text-xs text-[color:var(--text)]">
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="px-3 py-4 text-sm text-[color:var(--muted)]" colSpan={14}>
                            Chưa có dòng nào trong nhóm này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--muted)]">
          <div>
            Tổng giá bán: <span className="text-[color:var(--text)]">{totals.sale.toLocaleString("vi-VN")} đ</span>
            {" · "}
            Tổng giá vốn: <span className="text-[color:var(--text)]">{totals.cost.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setRows((current) => [...current, emptyRow(current.length + 1)])} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 text-xs text-[color:var(--text)]">
              + Thêm dòng
            </button>
            <button type="submit" className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-medium text-slate-950">
              Lưu Excel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
