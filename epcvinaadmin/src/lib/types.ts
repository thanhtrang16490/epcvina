export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  quantity: number;
  salePriceVat: number;
  costPrice: number;
  warranty: string;
  isActive?: boolean;
};

export type Combo = {
  id: string;
  slug: string;
  code: string;
  name: string;
  phase: 1 | 3;
  solarKw: number;
  batteryKwh?: number;
  batteryType?: "LV" | "HV";
  costPrice: number;
  targetMinPrice: number;
  referencePrice: number;
  margin: number;
  description: string;
};

export type ComboItem = {
  id: string;
  comboId: string;
  productId?: string | null;
  itemName: string;
  category: string;
  brand: string;
  unit: string;
  quantity: number;
  unitPriceVat: number;
  totalPriceVat: number;
  costPrice: number;
  totalCostPrice: number;
  warranty: string;
  notes: string;
  sortOrder: number;
};

export type CatalogPayload = {
  updatedAt: string;
  products: Product[];
  combos: Combo[];
  comboItems: ComboItem[];
};
