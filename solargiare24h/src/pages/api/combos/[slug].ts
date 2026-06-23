import type { APIRoute } from 'astro';
import { getComboBySlug } from '../../../data/combos';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  try {
    const combo = getComboBySlug(slug || '');

    if (!combo) {
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
