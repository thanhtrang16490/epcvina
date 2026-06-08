import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  try {
    const { data: combo, error } = await supabase
      .from('combos')
      .select(`
        *,
        combo_items (
          *,
          product:products (*)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !combo) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Combo not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: combo,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch combo',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
