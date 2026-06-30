import type { APIRoute } from 'astro';
import { getCombos } from '../../../data/combos';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;

  const systemType = searchParams.get('systemType') || undefined;
  const phase = searchParams.get('phase') || undefined;
  const voltage = searchParams.get('voltage') || undefined;
  const minCapacity = searchParams.get('minCapacity')
    ? parseFloat(searchParams.get('minCapacity')!)
    : undefined;
  const maxCapacity = searchParams.get('maxCapacity')
    ? parseFloat(searchParams.get('maxCapacity')!)
    : undefined;

  try {
    const combos = getCombos({
      systemType,
      phase,
      voltage,
      minPower: minCapacity,
      maxPower: maxCapacity,
    });

    // Transform local combo format to match frontend expected format
    const transformedCombos = combos.map(combo => ({
      id: combo.id,
      slug: combo.slug,
      name: combo.name,
      system_type: combo.system_type,
      systemType: combo.system_type,
      category: 'residential',
      phase: combo.phase,
      voltage: combo.voltage,
      power: combo.power_kw,
      capacity: combo.power_kw,
      battery: combo.battery_kwh || 0,
      panelBrand: 'AIKO',
      panelCount: Math.ceil(combo.power_kw * 1000 / 650), // Approximate panel count based on 650W panels
      panelModel: 'Stellar 2N 66-202',
      inverterBrand: combo.system_type === 'on-grid' ? 'SAJ' : 'Hopetrek',
      inverterCount: 1,
      inverterModel: `${combo.power_kw}kW`,
      equipment: [], // Will be populated based on template
      description: combo.name,
      images: [],
      price: combo.investment_million_vnd * 1000000, // Convert to VND
      features: [],
      monthly_production: Math.round((combo.production_min_kwh + combo.production_max_kwh) / 2),
      payback_period: combo.payback_years,
      installation_area: combo.roof_area_m2,
      is_popular: combo.display_order <= 5,
      estimatedOutput: {
        monthly: {
          min: combo.production_min_kwh,
          max: combo.production_max_kwh,
        },
      },
      estimatedSavings: {
        monthly: Math.round((combo.production_min_kwh + combo.production_max_kwh) / 2 * 2800),
        yearly: Math.round((combo.production_min_kwh + combo.production_max_kwh) / 2 * 2800 * 12),
      },
      paybackYears: combo.payback_years,
      roi: 0,
      areaRequired: combo.roof_area_m2,
      warranty: {
        panel: 15,
        inverter: 5,
        installation: 2,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({
      success: true,
      data: transformedCombos,
      count: transformedCombos.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch combos',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
