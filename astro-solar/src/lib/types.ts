export type EquipmentCategory = 'panel' | 'inverter' | 'battery' | 'mounting' | 'wiring' | 'cabinet' | 'grounding' | 'meter' | 'installation';
export type SystemType = 'on-grid' | 'hybrid';
export type PhaseType = '1-phase' | '3-phase';
export type VoltageType = 'low' | 'high'; // áp thấp / áp cao (3-phase only)

export interface Device {
  id: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  quantity: number;
  unit: string;
  price?: number; // Unit price in VND
  specs: Record<string, string>;
  features: string[];
  warranty: number; // years
  images: string[]; // [0] = main image, rest = gallery
  image_url?: string; // Single image URL from database (products table)
}

export interface SolarCombo {
  id: string;
  name: string;
  // Classification
  category: 'residential' | 'commercial';
  systemType: SystemType;           // on-grid or hybrid
  phase: PhaseType;                 // 1-phase or 3-phase
  voltage?: VoltageType;            // for 3-phase: áp thấp / áp cao
  // Capacity
  capacity: number;                 // kWp (panel)
  batteryCapacity?: number;         // kWh (storage, hybrid only)
  // Legacy fields for backward compat
  panelBrand: string;
  panelCount: number;
  panelModel: string;
  inverterBrand: string;
  inverterCount: number;
  inverterModel: string;
  // Structured equipment
  equipment: Device[];
  // Content
  description: string;
  features: string[];
  images: string[];                 // [0] = main hero, rest = gallery
  // Financial
  price: number;
  estimatedOutput: {
    monthly: { min: number; max: number }; // kWh/month
  };
  estimatedSavings: {
    monthly: number;  // VND
    yearly: number;   // VND
  };
  paybackPeriod: number;            // years (decimal)
  roi: number;                      // %
  // Physical
  areaRequired?: number;            // m²
  // Warranty summary
  warranty: {
    panel: number;
    inverter: number;
    installation: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  category?: 'residential' | 'commercial' | 'all';
  systemType?: SystemType | 'all';
  phase?: PhaseType | 'all';
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'capacity' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalCombos: number;
  residentialCount: number;
  commercialCount: number;
  onGridCount: number;
  hybridCount: number;
  averageCapacity: number;
  totalCapacity: number;
  averagePrice: number;
  capacityDistribution: { range: string; count: number }[];
  categoryDistribution: { name: string; value: number }[];
}

// Template system types
export interface TemplateItem {
  id: string;
  templateId: string;
  productId: string;
  product?: any; // nested product from Supabase join
  productType: EquipmentCategory;
  slotName: string | null;
  baseQuantity: number;
  scaleSource: 'panel_count' | 'inverter_count' | 'capacity_kw' | null;
  scaleFactor: number;
  unitPrice: number;
  isUserSelectable: boolean;
  displayOrder: number;
}

export interface ComboTemplate {
  id: string;
  name: string;
  slug: string;
  systemType: 'on-grid' | 'hybrid' | 'off-grid';
  category: 'residential' | 'commercial' | 'industrial';
  phase: '1-phase' | '3-phase';
  voltage: 'low' | 'high' | null;
  capacityKwMin: number;
  capacityKwMax: number;
  description: string;
  isActive: boolean;
  displayOrder: number;
  items: TemplateItem[];
}

// User's selections when configuring a combo from a template
export interface TemplateSelection {
  templateId: string;
  selections: {
    itemId: string;
    productId: string;
    quantity: number;
  }[];
}
