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
