import type { APIRoute } from 'astro';
import { getCategories } from '../../../data/categories';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const categories = getCategories();

    return new Response(JSON.stringify({
      success: true,
      data: categories,
      count: categories.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch categories',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
