export type ComboPriceSource = {
  target_min_price?: number | string | null;
  reference_price?: number | string | null;
};

export function getDisplayedComboPrice(combo: ComboPriceSource) {
  const customPrice = Number(combo.target_min_price ?? 0);
  const referencePrice = Number(combo.reference_price ?? 0);
  if (customPrice > 0 && (referencePrice <= 0 || customPrice <= referencePrice)) {
    return {
      label: "Giá ưu đãi",
      value: customPrice,
    };
  }
  return {
    label: "Giá tham chiếu",
    value: referencePrice,
  };
}
