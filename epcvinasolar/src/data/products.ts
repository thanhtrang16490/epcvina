// Local product catalog - EPCVINA products
export interface LocalProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  warranty_years: number;
  unit_price: number;
  main_image: string;
  is_available: boolean;
  show_on_homepage: boolean;
  product_type: 'panel' | 'inverter';
  phase?: '1-phase' | '3-phase' | null;
  voltage?: 'low' | 'high' | null;
}

// Actual product data
export const localProducts: LocalProduct[] = [
  {
    id: "aiko-800w-stellar-2n-78-232",
    name: "Tấm pin mặt trời Aiko 800W Mặt Kính Stellar 2N 78-232",
    slug: "tam-pin-mat-troi-aiko-800w-mat-kinh-stellar-2n-78-232",
    brand: "AIKO",
    category: "solar-panel",
    model: "Stellar 2N 78-232",
    description: "Tấm pin mặt trời Aiko 800W công nghệ ABC (All Back Contact) hiệu suất cao, mặt kính trong suốt",
    specifications: {
      power: "800W",
      efficiency: "24.0%",
      cell_type: "ABC (All Back Contact)",
      panel_type: "Mặt kính trong suốt",
      dimensions: "2384 x 1303 x 33 mm",
      weight: "38.5 kg"
    },
    features: [
      "Công nghệ ABC tiên tiến không có busbar mặt trước",
      "Hiệu suất chuyển đổi lên đến 24.0%",
      "Hệ số nhiệt độ thấp, hoạt động tốt ở môi trường nóng",
      "Bảo hành sản phẩm 15 năm",
      "Bảo hành hiệu suất 30 năm"
    ],
    warranty_years: 15,
    unit_price: 0,
    main_image: "/images/products/260424(1).png",
    is_available: true,
    show_on_homepage: true,
    product_type: "panel",
    phase: null,
    voltage: "high"
  },
  {
    id: "aiko-680w-stellar-2n-66-231",
    name: "Tấm pin mặt trời Aiko 680W Mặt Kính Stellar 2N 66-231",
    slug: "tam-pin-mat-troi-aiko-680w-mat-kinh-stellar-2n-66-231",
    brand: "AIKO",
    category: "solar-panel",
    model: "Stellar 2N 66-231",
    description: "Tấm pin mặt trời Aiko 680W công nghệ ABC (All Back Contact), mặt kính trong suốt",
    specifications: {
      power: "680W",
      efficiency: "23.6%",
      cell_type: "ABC (All Back Contact)",
      panel_type: "Mặt kính trong suốt",
      dimensions: "2278 x 1134 x 30 mm",
      weight: "32.8 kg"
    },
    features: [
      "Công nghệ ABC tiên tiến không có busbar mặt trước",
      "Hiệu suất chuyển đổi lên đến 23.6%",
      "Thiết kế thẩm mỹ cao với mặt trước đồng nhất",
      "Bảo hành sản phẩm 15 năm",
      "Bảo hành hiệu suất 30 năm"
    ],
    warranty_years: 15,
    unit_price: 0,
    main_image: "/images/products/260424.png",
    is_available: true,
    show_on_homepage: true,
    product_type: "panel",
    phase: null,
    voltage: "high"
  },
  {
    id: "aiko-650w-stellar-2n-66-202",
    name: "Tấm pin mặt trời Aiko 650W Mặt Kính Stellar 2N 66-202",
    slug: "tam-pin-mat-troi-aiko-650w-mat-kinh-stellar-2n-66-202",
    brand: "AIKO",
    category: "solar-panel",
    model: "Stellar 2N 66-202",
    description: "Tấm pin mặt trời Aiko 650W công nghệ ABC (All Back Contact), mặt kính trong suốt",
    specifications: {
      power: "650W",
      efficiency: "23.2%",
      cell_type: "ABC (All Back Contact)",
      panel_type: "Mặt kính trong suốt",
      dimensions: "2278 x 1134 x 30 mm",
      weight: "32.5 kg"
    },
    features: [
      "Công nghệ ABC tiên tiến không có busbar mặt trước",
      "Hiệu suất chuyển đổi lên đến 23.2%",
      "Phù hợp cho cả hệ thống residential và commercial",
      "Bảo hành sản phẩm 15 năm",
      "Bảo hành hiệu suất 30 năm"
    ],
    warranty_years: 15,
    unit_price: 0,
    main_image: "/images/products/260508(1).png",
    is_available: true,
    show_on_homepage: true,
    product_type: "panel",
    phase: null,
    voltage: "high"
  }
];


// Helper functions
export function getProductsByCategory(category: string): LocalProduct[] {
  if (!category || category === 'all') return localProducts;
  return localProducts.filter(p => p.category === category);
}

export function getProductsByBrand(brand: string): LocalProduct[] {
  if (!brand) return localProducts;
  return localProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
}

export function searchProducts(query: string): LocalProduct[] {
  if (!query) return localProducts;
  const q = query.toLowerCase();
  return localProducts.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.model.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

export function getProductById(id: string): LocalProduct | undefined {
  return localProducts.find(p => p.id === id);
}

export function getBrands(): string[] {
  const brands = new Set(localProducts.map(p => p.brand));
  return Array.from(brands).sort();
}

export function filterProducts(filters: {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  productType?: string;
  phase?: string;
  voltage?: string;
}): LocalProduct[] {
  let filtered = [...localProducts];

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.brand) {
    const brand = filters.brand.toLowerCase();
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q)
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.unit_price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.unit_price <= filters.maxPrice!);
  }

  if (filters.productType) {
    filtered = filtered.filter(p => p.product_type === filters.productType);
  }

  if (filters.phase) {
    filtered = filtered.filter(p => p.phase === filters.phase);
  }

  if (filters.voltage) {
    filtered = filtered.filter(p => p.voltage === filters.voltage);
  }

  return filtered;
}
