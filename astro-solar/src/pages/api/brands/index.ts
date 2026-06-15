import type { APIRoute } from 'astro';
import { getBrands } from '../../../data/brands';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const brands = getBrands();

    return new Response(JSON.stringify({
      success: true,
      data: brands,
      count: brands.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch brands',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
