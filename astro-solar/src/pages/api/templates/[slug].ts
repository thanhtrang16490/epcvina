import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { normalizeTemplate } from '../../../lib/api-helpers';

export const prerender = false;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  try {
    const { data: template, error } = await supabase
      .from('combo_templates')
      .select('*, template_items(*, product:products(*))')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({
          success: false,
          error: 'Template not found',
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      data: normalizeTemplate(template),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch template',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
