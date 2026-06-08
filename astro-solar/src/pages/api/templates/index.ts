import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { normalizeTemplate } from '../../../lib/api-helpers';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;
  const systemType = searchParams.get('systemType') || undefined;
  const phase = searchParams.get('phase') || undefined;

  try {
    let query = supabase
      .from('combo_templates')
      .select('*, template_items(*, product:products(*))')
      .eq('is_active', true)
      .order('display_order');

    if (systemType) {
      query = query.eq('system_type', systemType);
    }

    if (phase) {
      query = query.eq('phase', phase);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const normalized = (templates || []).map(normalizeTemplate);

    return new Response(JSON.stringify({
      success: true,
      data: normalized,
      count: normalized.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch templates',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
