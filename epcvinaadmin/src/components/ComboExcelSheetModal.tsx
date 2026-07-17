"use client";

import { useMemo, useState } from "react";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { ModalShell } from "@/components/ModalShell";
import { comboItemGroups } from "@/lib/combo-builder";

type SheetRow = {
  no: number;
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
  title?: string;
  description?: string;
  triggerLabel?: string;
  initialRows: SheetRow[];
  onSaveAction: (formData: FormData) => Promise<void>;
};

function emptyRow(no: number): SheetRow {
  return {
    no,
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

function clampRow(row: SheetRow, no: number): SheetRow {
  return {
    ...row,
    no,
    quantity: Number(row.quantity || 0) > 0 ? Number(row.quantity) : 1,
    unit_price_vat: Number(row.unit_price_vat || 0),
    cost_price: Number(row.cost_price || 0),
    gross_margin: Number(row.gross_margin || 0),
  };
}

function calcTotal(value: number, quantity: number) {
  return Math.round(Number(value || 0) * Number(quantity || 0));
}

function calcPreVatTotal(value: number, quantity: number) {
  return Math.round((Number(value || 0) / 1.1) * Number(quantity || 0));
}

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(Math.round(Number(value ?? 0) / 1000) * 1000);
}

function inferGroupId(row: SheetRow) {
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

export function ComboExcelSheetModal({ title = "Edit Excel", description = "Chỉnh BOM theo bảng giống data sheet.", triggerLabel = "Edit excel", initialRows, onSaveAction }: Props) {
  const [rows, setRows] = useState<SheetRow[]>(
    initialRows.length ? initialRows.map((row, index) => clampRow(row, index + 1)) : [emptyRow(1)],
  );

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const sale = calcPreVatTotal(row.unit_price_vat, row.quantity);
        const cost = calcPreVatTotal(row.cost_price, row.quantity);
        acc.sale += sale;
        acc.cost += cost;
        return acc;
      },
      { sale: 0, cost: 0 },
    );
  }, [rows]);

  const rowsByGroup = useMemo(() => {
    return comboItemGroups.reduce<Record<string, SheetRow[]>>((acc, group) => {
      acc[group.id] = rows.filter((row) => inferGroupId(row) === group.id);
      return acc;
    }, {});
  }, [rows]);

  const groupTotals = useMemo(() => {
    return comboItemGroups.reduce<Record<string, { sale: number; cost: number }>>((acc, group) => {
      const grouped = rowsByGroup[group.id] ?? [];
      acc[group.id] = grouped.reduce(
        (sum, row) => ({
          sale: sum.sale + calcPreVatTotal(row.unit_price_vat, row.quantity),
          cost: sum.cost + calcPreVatTotal(row.cost_price, row.quantity),
        }),
        { sale: 0, cost: 0 },
      );
      return acc;
    }, {});
  }, [rowsByGroup]);

  const updateRow = (index: number, next: Partial<SheetRow>) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? clampRow({ ...row, ...next }, row.no)
          : row,
      ),
    );
  };

  const addRow = () => {
    setRows((current) => [...current, emptyRow(current.length + 1)]);
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
    <ModalShell
      trigger={<span className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm sm:w-auto">{triggerLabel}</span>}
      title={title}
      description={description}
    >
      <form action={onSaveAction} className="space-y-4">
        <input type="hidden" name="excel_rows_json" value={JSON.stringify(rows)} />
        <div className="space-y-4">
          {comboItemGroups.map((group) => {
            const groupedRows = rowsByGroup[group.id] ?? [];
            const groupSale = groupTotals[group.id]?.sale ?? 0;
            const groupCost = groupTotals[group.id]?.cost ?? 0;
            return (
              <details key={group.id} open className="rounded-[1.25rem] border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{group.label}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {groupedRows.length} dòng · Giá bán {formatVnd(groupSale)} đ · Giá vốn {formatVnd(groupCost)} đ
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      addRowToGroup(group.id);
                    }}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[color:var(--accent)]/30"
                  >
                    + Thêm dòng
                  </button>
                </summary>
                <div className="overflow-x-auto border-t border-slate-200">
                  <table className="min-w-[1400px] divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-3">No.</th>
                        <th className="px-3 py-3">Category</th>
                        <th className="px-3 py-3">Specification</th>
                        <th className="px-3 py-3">Brand Name</th>
                        <th className="px-3 py-3">Unit</th>
                        <th className="px-3 py-3">Quatity</th>
                        <th className="px-3 py-3">Unit Price VAT</th>
                        <th className="px-3 py-3">Total Price VAT</th>
                        <th className="px-3 py-3">Warranty</th>
                        <th className="px-3 py-3">COST</th>
                        <th className="px-3 py-3">TOTAL COST</th>
                        <th className="px-3 py-3">Gross Margin</th>
                        <th className="px-3 py-3">Notes</th>
                        <th className="px-3 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {groupedRows.length ? (
                        groupedRows.map((row) => {
                          const index = rows.findIndex((item) => item.no === row.no);
                          const totalSale = calcPreVatTotal(row.unit_price_vat, row.quantity);
                          const totalCost = calcPreVatTotal(row.cost_price, row.quantity);
                          const margin = totalSale > 0 ? ((totalSale - totalCost) / totalSale) * 100 : 0;
                          return (
                            <tr key={`${group.id}-${row.no}`} className="bg-white">
                              <td className="px-3 py-3 text-slate-500">{row.no}</td>
                              <td className="px-3 py-3">
                                <input value={row.category} onChange={(event) => updateRow(index, { category: event.target.value })} className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <textarea value={row.specification} onChange={(event) => updateRow(index, { specification: event.target.value })} rows={2} className="w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <input value={row.brand_name} onChange={(event) => updateRow(index, { brand_name: event.target.value })} className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <input value={row.unit} onChange={(event) => updateRow(index, { unit: event.target.value })} className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <FormattedNumberInput name={`qty_${row.no}`} min={0} step={1} value={row.quantity} onValueChange={(value) => updateRow(index, { quantity: Number(value) || 1 })} className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <FormattedNumberInput name={`unit_price_vat_${row.no}`} min={0} step={1} value={row.unit_price_vat} onValueChange={(value) => updateRow(index, { unit_price_vat: Number(value) || 0 })} className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3 text-slate-900">{formatVnd(totalSale)}</td>
                              <td className="px-3 py-3">
                                <input value={row.warranty} onChange={(event) => updateRow(index, { warranty: event.target.value })} className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <FormattedNumberInput name={`cost_${row.no}`} min={0} step={1} value={row.cost_price} onValueChange={(value) => updateRow(index, { cost_price: Number(value) || 0 })} className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3 text-slate-900">{formatVnd(totalCost)}</td>
                              <td className="px-3 py-3 text-slate-900">{margin.toFixed(1)}%</td>
                              <td className="px-3 py-3">
                                <input value={row.notes} onChange={(event) => updateRow(index, { notes: event.target.value })} className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[color:var(--accent)]/40" />
                              </td>
                              <td className="px-3 py-3">
                                <button type="button" onClick={() => removeRow(index)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:border-[color:var(--accent)]/30">
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="px-3 py-4 text-sm text-slate-500" colSpan={14}>
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

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm text-slate-500">
          <div>
            Tổng giá bán (chưa VAT): <span className="text-slate-900">{formatVnd(totals.sale)} đ</span>
            {" · "}
            Tổng giá vốn (chưa VAT): <span className="text-slate-900">{formatVnd(totals.cost)} đ</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addRow} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:border-[color:var(--accent)]/30">
              + Thêm dòng
            </button>
            <button type="submit" className="rounded-2xl bg-[color:var(--accent)] px-4 py-2 font-medium text-white shadow-sm">
              Lưu Excel
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
