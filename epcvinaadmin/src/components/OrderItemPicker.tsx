"use client";

import { useEffect, useMemo, useState } from "react";

type ComboOption = {
  id: string;
  name: string;
};

type ProductOption = {
  id: string;
  name: string;
};

type Props = {
  combos: ComboOption[];
  products: ProductOption[];
  defaultItemType?: "combo" | "product";
  defaultComboId?: string;
  defaultProductId?: string;
};

export function OrderItemPicker({
  combos,
  products,
  defaultItemType = "combo",
  defaultComboId = "",
  defaultProductId = "",
}: Props) {
  const [itemType, setItemType] = useState<"combo" | "product">(defaultItemType);
  const [comboId, setComboId] = useState(defaultComboId);
  const [productId, setProductId] = useState(defaultProductId);

  useEffect(() => {
    if (itemType === "combo") setProductId("");
    if (itemType === "product") setComboId("");
  }, [itemType]);

  const activeOptions = useMemo(() => (itemType === "combo" ? combos : products), [combos, itemType, products]);

  return (
    <>
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Loại item</span>
        <select
          name="item_type"
          value={itemType}
          onChange={(event) => setItemType(event.target.value as "combo" | "product")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
        >
          <option value="combo">Combo</option>
          <option value="product">Thiết bị</option>
        </select>
      </label>

      {itemType === "combo" ? (
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Chọn combo</span>
          <select
            name="combo_id"
            value={comboId}
            onChange={(event) => setComboId(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          >
            <option value="">Chọn combo</option>
            {activeOptions.map((combo) => (
              <option key={combo.id} value={combo.id}>
                {combo.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Chọn thiết bị</span>
          <select
            name="product_id"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          >
            <option value="">Chọn thiết bị</option>
            {activeOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </>
  );
}
