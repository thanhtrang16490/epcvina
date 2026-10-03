// Combo catalog data - canonical combo schema with a flattened compatibility layer.
import combosData from './combos-data.json';

type AnyRecord = Record<string, any>;

type CanonicalCombo = AnyRecord & {
  id: string;
  slug: string;
  name: string;
  status?: string;
  system?: {
    technology?: 'on-grid' | 'hybrid';
    phase?: 'single_phase' | 'three_phase';
    solar_capacity?: { value?: number; unit?: string };
    inverter_capacity?: { value?: number; unit?: string };
    battery_capacity?: { value?: number; unit?: string };
    estimated_generation?: { monthly_kwh?: number; annual_kwh?: number };
  };
  components?: Array<AnyRecord>;
  meta?: AnyRecord;
};

export interface LocalCombo {
  id: string;
  slug: string;
  name: string;
  system_type: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  voltage?: 'low' | 'high' | null;
  power_kw: number;
  battery_kwh?: number;
  panel_brand?: string;
  panel_model?: string;
  panel_power?: string;
  panel_count?: number;
  panel_slug?: string;
  inverter_brand?: string;
  inverter_model?: string;
  inverter_count?: number;
  inverter_slug?: string;
  battery_brand?: string;
  battery_model?: string;
  battery_count?: number;
  battery_slug?: string;
  equipment_items?: Array<{
    label: string;
    model?: string;
    quantity?: number;
    unit?: string;
    warranty?: string;
    product_slug?: string;
  }>;
  investment_million_vnd: number;
  production_min_kwh: number;
  production_max_kwh: number;
  payback_years: number;
  payback_label: string;
  roof_area_m2?: number;
  is_active: boolean;
  display_order: number;
}

function normalizePhase(phase?: string): '1-phase' | '3-phase' {
  return phase === 'three_phase' ? '3-phase' : '1-phase';
}

function getComponentLabel(type?: string): string {
  switch (type) {
    case 'solar_panel':
      return 'Tấm pin';
    case 'inverter':
      return 'Biến tần';
    case 'battery':
      return 'Pin lưu trữ';
    case 'mounting_structure':
      return 'Hệ khung nhôm';
    case 'electrical_wiring':
      return 'Hệ dây điện';
    case 'electrical_panel':
      return 'Tủ điện';
    case 'grounding_system':
      return 'Hệ tiếp địa';
    case 'installation':
      return 'Vận chuyển + lắp đặt';
    default:
      return type || 'Thiết bị';
  }
}

function flattenCombo(combo: CanonicalCombo): LocalCombo {
  const meta = combo.meta || {};

  const equipment_items = (combo.components || []).map((component) => ({
    label: getComponentLabel(component.type),
    model: component.snapshot?.model ?? undefined,
    quantity: component.quantity,
    unit: component.unit,
    warranty: component.snapshot?.warranty?.note || (component.snapshot?.warranty?.period ? `${component.snapshot.warranty.period} năm` : undefined),
    product_slug: component.product_reference?.slug || undefined,
  }));

  return {
    id: combo.id,
    slug: combo.slug,
    name: combo.name,
    system_type: combo.system?.technology || meta.system_type || 'on-grid',
    phase: normalizePhase(combo.system?.phase || meta.phase),
    voltage: meta.voltage ?? null,
    power_kw: combo.system?.solar_capacity?.value ?? meta.power_kw ?? 0,
    battery_kwh: combo.system?.battery_capacity?.value ?? meta.battery_kwh,
    panel_brand: meta.panel_brand,
    panel_model: meta.panel_model,
    panel_power: meta.panel_power,
    panel_count: meta.panel_count,
    panel_slug: meta.panel_slug,
    inverter_brand: meta.inverter_brand,
    inverter_model: meta.inverter_model,
    inverter_count: meta.inverter_count,
    inverter_slug: meta.inverter_slug,
    battery_brand: meta.battery_brand,
    battery_model: meta.battery_model,
    battery_count: meta.battery_count,
    battery_slug: meta.battery_slug,
    equipment_items,
    investment_million_vnd: meta.investment_million_vnd ?? 0,
    production_min_kwh: meta.production_min_kwh ?? 0,
    production_max_kwh: meta.production_max_kwh ?? 0,
    payback_years: meta.payback_years ?? 0,
    payback_label: meta.payback_label ?? '',
    roof_area_m2: meta.roof_area_m2,
    is_active: meta.is_active ?? combo.status === 'active',
    display_order: meta.display_order ?? 0,
  };
}

export const localCombos = (combosData as CanonicalCombo[]).map(flattenCombo);
export const canonicalCombos = combosData as CanonicalCombo[];

export function getCombos(filters?: {
  systemType?: string;
  phase?: string;
  voltage?: string;
  minPower?: number;
  maxPower?: number;
}): LocalCombo[] {
  let filtered = localCombos.filter((c) => c.is_active);

  if (filters?.systemType && filters.systemType !== 'all') {
    filtered = filtered.filter((c) => c.system_type === filters.systemType);
  }

  if (filters?.phase) {
    filtered = filtered.filter((c) => c.phase === filters.phase);
  }

  if (filters?.voltage) {
    filtered = filtered.filter((c) => c.voltage === filters.voltage);
  }

  if (filters?.minPower !== undefined) {
    filtered = filtered.filter((c) => c.power_kw >= filters.minPower!);
  }

  if (filters?.maxPower !== undefined) {
    filtered = filtered.filter((c) => c.power_kw <= filters.maxPower!);
  }

  return filtered.sort((a, b) => a.display_order - b.display_order);
}

export function getComboBySlug(slug: string): LocalCombo | undefined {
  return localCombos.find((c) => c.slug === slug);
}
