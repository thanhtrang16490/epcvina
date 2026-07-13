"use client";

import { useState } from "react";

type Option = { id: string; name: string; code?: string; brand?: string };
type Row = { id: string; quantity: number };

type Props = {
  combos: Option[];
  products: Option[];
  initialComboRows?: Row[];
  initialProductRows?: Row[];
};

export function ProjectSelectionPicker({ combos, products, initialComboRows = [], initialProductRows = [] }: Props) {
  const [comboRows, setComboRows] = useState<Row[]>(initialComboRows.length ? initialComboRows : [{ id: "", quantity: 1 }]);
  const [productRows, setProductRows] = useState<Row[]>(initialProductRows.length ? initialProductRows : [{ id: "", quantity: 1 }]);
  const [open, setOpen] = useState<"combo" | "product" | null>(null);
  const [draftId, setDraftId] = useState("");
  const [draftQty, setDraftQty] = useState(1);

  const openModal = (kind: "combo" | "product") => {
    setOpen(kind);
    setDraftId("");
    setDraftQty(1);
  };

  const addRow = () => {
    if (!draftId) return;
    const row = { id: draftId, quantity: Math.max(1, draftQty) };
    if (open === "combo") setComboRows((current) => [...current, row]);
    if (open === "product") setProductRows((current) => [...current, row]);
    setOpen(null);
  };

  const removeCombo = (index: number) => setComboRows((current) => current.filter((_, i) => i !== index));
  const removeProduct = (index: number) => setProductRows((current) => current.filter((_, i) => i !== index));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <input type="hidden" name="project_combo_rows" value={JSON.stringify(comboRows)} />
      <input type="hidden" name="project_product_rows" value={JSON.stringify(productRows)} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Combo liên quan</div>
              <div className="text-xs text-slate-400">Tự sinh item đơn hàng theo combo chọn.</div>
            </div>
            <button type="button" onClick={() => openModal("combo")} className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-medium text-slate-950">
              + Thêm combo
            </button>
          </div>
          <div className="space-y-2">
            {comboRows.map((row, index) => (
              <div key={`${row.id}-${index}`} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-white">
                <span>{combos.find((item) => item.id === row.id)?.name || "Chưa chọn"}</span>
                <button type="button" onClick={() => removeCombo(index)} className="text-xs text-slate-400">
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Thiết bị liên quan</div>
              <div className="text-xs text-slate-400">Tự sinh item đơn hàng theo thiết bị chọn.</div>
            </div>
            <button type="button" onClick={() => openModal("product")} className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-medium text-slate-950">
              + Thêm thiết bị
            </button>
          </div>
          <div className="space-y-2">
            {productRows.map((row, index) => (
              <div key={`${row.id}-${index}`} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm text-white">
                <span>{products.find((item) => item.id === row.id)?.name || "Chưa chọn"}</span>
                <button type="button" onClick={() => removeProduct(index)} className="text-xs text-slate-400">
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[color:var(--panel-strong)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold text-white">{open === "combo" ? "Thêm combo" : "Thêm thiết bị"}</div>
              <button type="button" onClick={() => setOpen(null)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                Đóng
              </button>
            </div>
            <div className="grid gap-3">
              <select value={draftId} onChange={(event) => setDraftId(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white">
                <option value="">Chọn</option>
                {(open === "combo" ? combos : products).map((item) => (
                  <option key={item.id} value={item.id}>
                    {open === "combo" ? `${item.code ?? ""} ${item.name}` : item.name}
                  </option>
                ))}
              </select>
              <input type="number" min={1} step={1} value={draftQty} onChange={(event) => setDraftQty(Number(event.target.value) || 1)} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white" />
              <button type="button" onClick={addRow} className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950">
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
