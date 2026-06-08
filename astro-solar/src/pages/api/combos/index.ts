import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;

  const category = searchParams.get('category') || undefined;
  const systemType = searchParams.get('systemType') || undefined;
  const phase = searchParams.get('phase') || undefined;
  const search = searchParams.get('search') || undefined;
  const minCapacity = searchParams.get('minCapacity')
    ? parseFloat(searchParams.get('minCapacity')!)
    : undefined;
  const maxCapacity = searchParams.get('maxCapacity')
    ? parseFloat(searchParams.get('maxCapacity')!)
    : undefined;

  try {
    let query = supabase
      .from('combos')
      .select('*, combo_items(*, product:products(*))')
      .eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (systemType) {
      query = query.eq('system_type', systemType);
    }

    if (phase) {
      query = query.eq('phase', phase);
    }

    if (minCapacity !== undefined) {
      query = query.gte('capacity_kw', minCapacity);
    }

    if (maxCapacity !== undefined) {
      query = query.lte('capacity_kw', maxCapacity);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.order('display_order', { ascending: true });

    const { data: combos, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      data: combos || [],
      count: combos?.length || 0,
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
