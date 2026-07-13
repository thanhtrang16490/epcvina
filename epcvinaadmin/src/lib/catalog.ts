import type { CatalogPayload } from "./types";

export const catalog: CatalogPayload = {
  updatedAt: new Date(0).toISOString(),
  products: [],
  combos: [],
  comboItems: [],
};

export const comboStats = {
  count: 0,
  productCount: 0,
  avgMargin: 0,
  maxDiscountRoom: 0,
};

export const currency = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});
