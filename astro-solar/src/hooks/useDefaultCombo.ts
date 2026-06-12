import { useState, useEffect } from 'react';
import type { Device, EquipmentCategory, ComboTemplate, TemplateItem } from '../lib/types';
import { normalizeTemplate } from '../lib/api-helpers';

interface ComboData {
  name: string;
  power: number;
  battery: number;
  phase: string;
  systemType: string;
  dailyProduction: number;
  monthlySavings: number;
  price: number;
  paybackPeriod: number;
  roi: number;
  equipment: Device[];
}

interface UseDefaultComboResult {
  combo: ComboData | null;
  devices: Device[];
  template: ComboTemplate | null;
  templateItems: TemplateItem[];
  loading: boolean;
  error: string | null;
}

// Default fallback combo - On-Grid 5.1 kWp 1 Pha
const DEFAULT_COMBO: ComboData = {
  name: 'Hệ On-Grid 5.1 kWp 1 Pha',
  power: 5.1,
  battery: 0,
  phase: '1-phase',
  systemType: 'on-grid',
  dailyProduction: 20,
  monthlySavings: 2000000,
  price: 85000000,
  paybackPeriod: 3.5,
  roi: 22,
  equipment: [],
};

// Map product_type to equipment category (checks specs.intended_product_type for overrides)
function mapProductTypeToCategory(productType: string, specs?: Record<string, any>): EquipmentCategory | null {
  const effectiveType = specs?.intended_product_type || productType;
  if (effectiveType === 'panel') return 'panel';
  if (effectiveType === 'inverter') return 'inverter';
  if (effectiveType === 'battery') return 'battery';
  if (effectiveType === 'mounting') return 'mounting';
  if (effectiveType === 'wiring') return 'wiring';
  if (effectiveType === 'cabinet') return 'cabinet';
  if (effectiveType === 'grounding') return 'grounding';
  if (effectiveType === 'meter') return 'meter';
  if (effectiveType === 'installation' || effectiveType === 'labor') return 'installation';
  return null;
}

export function useDefaultCombo(): UseDefaultComboResult {
  const [combo, setCombo] = useState<ComboData | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [template, setTemplate] = useState<ComboTemplate | null>(null);
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefaultCombo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch on-grid combos list
        const listResponse = await fetch('/api/combos?systemType=on-grid');
        
        if (!listResponse.ok) {
          throw new Error(`HTTP error! status: ${listResponse.status}`);
        }

        const listResult = await listResponse.json();
        
        if (!listResult.success || !listResult.data || listResult.data.length === 0) {
          console.log('No on-grid combos found, using default');
          setCombo(DEFAULT_COMBO);
          setDevices([]);
          setLoading(false);
          return;
        }

        // Find On-Grid 5.1 kWp 1 Pha combo or use first one
        const rawCombo = listResult.data.find((c: any) => 
          c.name?.includes('5.1') && c.name?.includes('1 Pha')
        ) || listResult.data[0];

        console.log('Selected combo:', rawCombo);

        // Step 2: Fetch full combo details with combo_items
        const detailResponse = await fetch(`/api/combos/${rawCombo.slug}`);
        
        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch combo details: ${detailResponse.status}`);
        }

        const detailResult = await detailResponse.json();
        console.log('Combo detail:', detailResult);

        if (!detailResult.success || !detailResult.data) {
          throw new Error('Invalid combo detail response');
        }

        const fullCombo = detailResult.data;

        // Map combo data
        const mappedCombo: ComboData = {
          name: fullCombo.name || DEFAULT_COMBO.name,
          power: fullCombo.capacity_kw || DEFAULT_COMBO.power,
          battery: fullCombo.battery_capacity_kwh || DEFAULT_COMBO.battery,
          phase: fullCombo.phase || DEFAULT_COMBO.phase,
          systemType: fullCombo.system_type || DEFAULT_COMBO.systemType,
          dailyProduction: Math.round((fullCombo.estimated_output_monthly_min || 600) / 30),
          monthlySavings: Math.round((fullCombo.estimated_savings_yearly || 24000000) / 12),
          price: fullCombo.total_price || DEFAULT_COMBO.price,
          paybackPeriod: fullCombo.payback_period_years || DEFAULT_COMBO.paybackPeriod,
          roi: fullCombo.roi_percentage || DEFAULT_COMBO.roi,
          equipment: [],
        };

        // Map combo_items to devices
        const equipment: Device[] = [];
        
        if (fullCombo.combo_items && Array.isArray(fullCombo.combo_items)) {
          console.log('Combo items:', fullCombo.combo_items);
          
          for (const item of fullCombo.combo_items) {
            const product = item.product;
            if (!product) continue;

            const specs = product.specifications || {};
            const category = mapProductTypeToCategory(product.product_type, specs);
            if (!category) continue;

            // Extract brand from product name (e.g., "Tấm quang năng Aiko 640Wp" -> "Aiko")
            let brand = 'Unknown';
            let model = product.name || 'Unknown';
            
            const nameParts = product.name?.split(' ') || [];
            if (category === 'panel' && nameParts.includes('Solar')) {
              const solarIndex = nameParts.indexOf('Solar');
              brand = nameParts.slice(solarIndex - 1, solarIndex + 1).join(' ');
            } else if (category === 'inverter' && nameParts.includes('Auxsol')) {
              brand = 'Auxsol';
            } else if (product.brand?.name) {
              brand = product.brand.name;
            }
            
            const device: Device = {
              id: product.id || `${fullCombo.slug}-${category}`,
              category: category,
              brand: brand,
              model: model,
              quantity: item.quantity || 1,
              unit: product.unit === 'unit' ? 'bộ' : (product.unit || 'bộ'),
              price: product.unit_price || 0,
              specs: product.specifications || {},
              features: product.features || [],
              warranty: product.warranty_years || 0,
              images: product.main_image ? [product.main_image] : [],
              image_url: product.main_image,
            };

            equipment.push(device);
            console.log('Added device:', device);
          }
        }

        // Fallback: if no combo_items, create from combo fields
        if (equipment.length === 0) {
          console.log('No combo_items, using fallback from combo fields');
          
          if (fullCombo.panel_count && fullCombo.panel_brand) {
            equipment.push({
              id: `${fullCombo.slug}-panel`,
              category: 'panel',
              brand: fullCombo.panel_brand,
              model: `${fullCombo.panel_brand} ${fullCombo.capacity_kw}kWp`,
              quantity: fullCombo.panel_count,
              unit: 'tấm',
              specs: {},
              features: [],
              warranty: fullCombo.warranty_panel_years || 12,
              images: [],
            });
          }

          if (fullCombo.inverter_count && fullCombo.inverter_brand) {
            equipment.push({
              id: `${fullCombo.slug}-inverter`,
              category: 'inverter',
              brand: fullCombo.inverter_brand,
              model: `${fullCombo.inverter_brand} ${fullCombo.capacity_kw}kW`,
              quantity: fullCombo.inverter_count,
              unit: 'bộ',
              specs: {},
              features: [],
              warranty: fullCombo.warranty_inverter_years || 5,
              images: [],
            });
          }
        }

        mappedCombo.equipment = equipment;
        console.log('Final equipment:', equipment);
        
        setCombo(mappedCombo);
        setDevices(equipment);

        // Step 3: Try to fetch matching template
        try {
          const systemType = fullCombo.system_type || 'on-grid';
          const phase = fullCombo.phase || '1-phase';
          const capacityKw = fullCombo.capacity_kw || mappedCombo.power;

          const templateListRes = await fetch(
            `/api/templates?systemType=${systemType}&phase=${phase}`
          );

          if (templateListRes.ok) {
            const templateListResult = await templateListRes.json();
            const templateList: any[] = templateListResult.data ?? templateListResult ?? [];

            // Find a template whose capacity range contains the combo's capacity
            const matchedTemplate = templateList.find((t: any) => {
              const min = t.capacity_kw_min ?? t.capacityKwMin ?? 0;
              const max = t.capacity_kw_max ?? t.capacityKwMax ?? Infinity;
              return capacityKw >= min && capacityKw <= max;
            });

            if (matchedTemplate) {
              const slug = matchedTemplate.slug;
              const fullTemplateRes = await fetch(`/api/templates/${slug}`);
              if (fullTemplateRes.ok) {
                const fullTemplateResult = await fullTemplateRes.json();
                const rawTemplate = fullTemplateResult.data ?? fullTemplateResult;
                if (rawTemplate) {
                  const normalized = normalizeTemplate(rawTemplate);
                  setTemplate(normalized);
                  setTemplateItems(normalized.items);
                  console.log('Loaded template:', normalized.name, 'items:', normalized.items.length);
                }
              }
            }
          }
        } catch (templateErr) {
          // Non-fatal: template loading failure just means we fall back to devices
          console.warn('Template fetch failed (non-fatal):', templateErr);
        }
        
      } catch (err) {
        console.error('Error fetching default combo:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setCombo(DEFAULT_COMBO);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultCombo();
  }, []);

  return { combo, devices, template, templateItems, loading, error };
}
