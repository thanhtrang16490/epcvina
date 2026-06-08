import type { ComboTemplate, TemplateItem } from './types';

/**
 * Map product_type string from DB to EquipmentCategory
 */
function mapProductTypeToCategory(productType: string): string {
  const typeMap: Record<string, string> = {
    'panel': 'panel',
    'solar-panel': 'panel',
    'on-grid-1phase': 'inverter',
    'on-grid-3phase-lv': 'inverter',
    'on-grid-3phase-hv': 'inverter',
    'inverter': 'inverter',
    'hybrid-inverter': 'inverter',
    'lv-battery': 'battery',
    'hv-battery': 'battery',
    'battery': 'battery',
    'mounting': 'mounting',
    'wiring': 'wiring',
    'cable': 'wiring',
    'cabinet': 'cabinet',
    'grounding': 'grounding',
    'meter': 'meter',
    'installation': 'installation',
    'labor': 'installation',
  };
  return typeMap[productType] || productType;
}

/**
 * Normalize Supabase combo data to match frontend SolarCombo interface
 */
export function normalizeCombo(rawCombo: any) {
  if (!rawCombo) return null;
  
  let equipment: any[] = [];

  // If combo_items exist with nested product data, use them
  if (rawCombo.combo_items && rawCombo.combo_items.length > 0) {
    equipment = rawCombo.combo_items.map((item: any, idx: number) => {
      const product = item.product || {};
      const specs = product.specifications && typeof product.specifications === 'object'
        ? Object.fromEntries(
            Object.entries(product.specifications).map(([k, v]) => [k, String(v)])
          )
        : {};
      // Determine category: use intended_product_type from specs if available, fallback to product_type
      // This handles products stored with fallback type 'mounting' but intended for 'installation'
      const rawType = specs.intended_product_type || product.product_type || '';
      return {
        id: product.id || `${rawCombo.slug}-item-${idx}`,
        category: mapProductTypeToCategory(rawType),
        brand: product.brand_name || product.brand || '',
        model: product.name || '',
        quantity: item.quantity || 1,
        unit: product.unit || item.unit || 'bộ',
        price: item.unit_price || product.price || 0,
        specs,
        features: Array.isArray(product.features) ? product.features : [],
        warranty: product.warranty_years || 0,
        images: product.main_image ? [product.main_image] : [],
        image_url: product.main_image || null,
      };
    });
  } else {
    // Fallback: create mock equipment based on combo specs
    // Add panel device
    if (rawCombo.panel_count && rawCombo.panel_brand) {
      equipment.push({
        id: `${rawCombo.slug}-panel`,
        category: 'panel',
        brand: rawCombo.panel_brand,
        model: `${rawCombo.panel_brand} ${rawCombo.capacity_kw}kWp`,
        quantity: rawCombo.panel_count,
        unit: 'tấm',
        price: 0,
        specs: {},
        features: [],
        warranty: rawCombo.warranty_panel_years || 12,
        images: [],
      });
    }
    
    // Add inverter device
    if (rawCombo.inverter_count && rawCombo.inverter_brand) {
      equipment.push({
        id: `${rawCombo.slug}-inverter`,
        category: 'inverter',
        brand: rawCombo.inverter_brand,
        model: `${rawCombo.inverter_brand} ${rawCombo.capacity_kw}kW`,
        quantity: rawCombo.inverter_count,
        unit: 'bộ',
        price: 0,
        specs: {},
        features: [],
        warranty: rawCombo.warranty_inverter_years || 5,
        images: [],
      });
    }
    
    // Add battery for hybrid systems
    if (rawCombo.battery_capacity_kwh) {
      equipment.push({
        id: `${rawCombo.slug}-battery`,
        category: 'battery',
        brand: 'Dyness',
        model: `Battery ${rawCombo.battery_capacity_kwh}kWh`,
        quantity: 1,
        unit: 'bộ',
        price: 0,
        specs: {},
        features: [],
        warranty: 10,
        images: [],
      });
    }
  }
  
  const stats = deriveComboStats(equipment, rawCombo);

  return {
    ...rawCombo,
    // Map Supabase field names to frontend expected names
    price: rawCombo.total_price || 0,
    id: rawCombo.slug, // Use slug as ID for routing
    systemType: rawCombo.system_type,
    capacity: stats.capacityKw,
    capacityKw: stats.capacityKw,
    batteryCapacityKwh: rawCombo.battery_capacity_kwh,
    panelCount: stats.panelCount,
    panelBrand: rawCombo.panel_brand,
    inverterCount: rawCombo.inverter_count,
    inverterBrand: rawCombo.inverter_brand,
    estimatedOutput: {
      monthly: {
        min: stats.monthlyMin,
        max: stats.monthlyMax,
      }
    },
    estimatedSavings: {
      yearly: stats.yearlySavings,
      monthly: Math.round(stats.yearlySavings / 12),
    },
    paybackPeriod: stats.paybackPeriod,
    roi: stats.roi,
    statsCalculated: stats.statsCalculated,
    warranty: {
      panel: rawCombo.warranty_panel_years || 0,
      inverter: rawCombo.warranty_inverter_years || 0,
      installation: rawCombo.warranty_installation_years || 0,
    },
    // Generated equipment array
    equipment,
    images: [],
    features: Array.isArray(rawCombo.features) ? rawCombo.features : [],
  };
}

/**
 * Constants for derived calculations
 */
const SUN_HOURS_MIN = 3.5;  // Vietnam minimum daily sun hours
const SUN_HOURS_MAX = 4.5;  // Vietnam maximum daily sun hours
const EFFICIENCY_FACTOR = 0.80; // ~80% system efficiency
const ELECTRICITY_RATE_VND = 3000; // Average VND per kWh

/**
 * Extract panel wattage (Wp) from a panel Device's specs.
 * Tries several common spec keys.
 */
function extractPanelWattage(panelDevice: any): number {
  const specs = panelDevice?.specs || {};
  // Common spec key names for wattage
  const candidates = [
    specs['Công suất'],
    specs['Công suất định mức'],
    specs['Công suất tối đa'],
    specs['Wattage'],
    specs['Rated Power'],
    specs['Power'],
    specs['Pmax'],
  ];
  for (const val of candidates) {
    if (val) {
      // Extract numeric portion, e.g. "615 Wp" → 615
      const match = String(val).match(/[\d.]+/);
      if (match) return parseFloat(match[0]);
    }
  }
  return 0;
}

/**
 * Derive combo summary statistics from equipment data when DB values are absent.
 * Returns an object with the same shape as the stored fields.
 */
export function deriveComboStats(equipment: any[], storedCombo: any) {
  const totalPrice = storedCombo.total_price || 0;

  // ── 1. Capacity (kWp) ──────────────────────────────────────
  let capacityKw = storedCombo.capacity_kw || 0;
  if (!capacityKw) {
    const panels = equipment.filter(d => d.category === 'panel');
    if (panels.length > 0) {
      const panelDevice = panels[0];
      const wattage = extractPanelWattage(panelDevice);
      const totalPanels = panels.reduce((s: number, p: any) => s + (p.quantity || 1), 0);
      if (wattage > 0 && totalPanels > 0) {
        capacityKw = parseFloat(((totalPanels * wattage) / 1000).toFixed(3));
      }
    }
  }

  // ── 2. Monthly Output (kWh) ────────────────────────────────
  let monthlyMin = storedCombo.estimated_output_monthly_min || 0;
  let monthlyMax = storedCombo.estimated_output_monthly_max || 0;
  if ((!monthlyMin || !monthlyMax) && capacityKw > 0) {
    monthlyMin = Math.round(capacityKw * SUN_HOURS_MIN * 30 * EFFICIENCY_FACTOR);
    monthlyMax = Math.round(capacityKw * SUN_HOURS_MAX * 30 * EFFICIENCY_FACTOR);
  }

  // ── 3. Yearly Savings (VND) ────────────────────────────────
  let yearlySavings = storedCombo.estimated_savings_yearly || 0;
  if (!yearlySavings && monthlyMax > 0) {
    const avgMonthly = (monthlyMin + monthlyMax) / 2;
    yearlySavings = Math.round(avgMonthly * 12 * ELECTRICITY_RATE_VND);
  }

  // ── 4. Payback Period (years) ──────────────────────────────
  let paybackPeriod = storedCombo.payback_period_years || 0;
  if (!paybackPeriod && yearlySavings > 0 && totalPrice > 0) {
    paybackPeriod = parseFloat((totalPrice / yearlySavings).toFixed(1));
  }

  // ── 5. ROI (%) ────────────────────────────────────────────
  let roi = storedCombo.roi_percentage || 0;
  if (!roi && yearlySavings > 0 && totalPrice > 0) {
    roi = parseFloat(((yearlySavings / totalPrice) * 100).toFixed(1));
  }

  // Panel count: prefer DB value, else sum from equipment
  let panelCount = storedCombo.panel_count || 0;
  if (!panelCount) {
    panelCount = equipment
      .filter(d => d.category === 'panel')
      .reduce((s: number, d: any) => s + (d.quantity || 0), 0);
  }

  return {
    capacityKw,
    monthlyMin,
    monthlyMax,
    yearlySavings,
    paybackPeriod,
    roi,
    panelCount,
    // Flag so the modal can show a "calculated" indicator
    statsCalculated: !storedCombo.capacity_kw || !storedCombo.estimated_output_monthly_min,
  };
}

/**
 * Normalize array of combos
 */
export function normalizeCombos(rawCombos: any[] | null) {
  if (!rawCombos) return [];
  return rawCombos.map(normalizeCombo);
}

/**
 * Normalize Supabase template data to match frontend ComboTemplate interface
 */
export function normalizeTemplate(raw: any): ComboTemplate {
  const items: TemplateItem[] = (raw.template_items || [])
    .map((i: any): TemplateItem => ({
      id: i.id,
      templateId: i.template_id,
      productId: i.product_id,
      product: i.product,
      productType: i.product_type,
      slotName: i.slot_name ?? null,
      baseQuantity: i.base_quantity,
      scaleSource: i.scale_source ?? null,
      scaleFactor: i.scale_factor,
      unitPrice: i.unit_price,
      isUserSelectable: i.is_user_selectable,
      displayOrder: i.display_order,
    }))
    .sort((a: TemplateItem, b: TemplateItem) => a.displayOrder - b.displayOrder);

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    systemType: raw.system_type,
    category: raw.category,
    phase: raw.phase,
    voltage: raw.voltage ?? null,
    capacityKwMin: raw.capacity_kw_min,
    capacityKwMax: raw.capacity_kw_max,
    description: raw.description,
    isActive: raw.is_active,
    displayOrder: raw.display_order,
    items,
  };
}

/**
 * Calculate item quantities and line totals based on scaling rules
 */
export function calculateItemQuantities(
  items: TemplateItem[],
  context: { panelCount: number; inverterCount: number; capacityKw: number }
): { item: TemplateItem; calculatedQuantity: number; lineTotal: number }[] {
  return items.map(item => {
    let sourceCount = 0;
    if (item.scaleSource === 'panel_count') {
      sourceCount = context.panelCount;
    } else if (item.scaleSource === 'inverter_count') {
      sourceCount = context.inverterCount;
    } else if (item.scaleSource === 'capacity_kw') {
      sourceCount = context.capacityKw;
    }

    const calculatedQuantity = item.scaleSource === null
      ? item.baseQuantity
      : item.baseQuantity + Math.round(item.scaleFactor * sourceCount);

    return {
      item,
      calculatedQuantity,
      lineTotal: calculatedQuantity * item.unitPrice,
    };
  });
}

/**
 * @deprecated Use calculateItemQuantities instead
 */
export function calculateAccessories(
  items: TemplateItem[],
  context: { panelCount: number; inverterCount: number; capacityKw: number }
): { item: TemplateItem; calculatedQuantity: number; lineTotal: number }[] {
  return calculateItemQuantities(items, context);
}
