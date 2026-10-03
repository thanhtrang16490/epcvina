import type { APIRoute } from 'astro';
import { canonicalCombos, getCombos } from '../../../data/combos';

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

    const transformedCombos = combos.map((combo) => {
      const canonical = canonicalCombos.find((item) => item.slug === combo.slug);
      return {
        ...(canonical || {}),
      };
    });

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
