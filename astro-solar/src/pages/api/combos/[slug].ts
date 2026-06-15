import type { APIRoute } from 'astro';

export const prerender = false;

// Stub API - combo detail (currently empty)
export const GET: APIRoute = async ({ params }) => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Combo not found',
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
