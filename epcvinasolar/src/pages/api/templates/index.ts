import type { APIRoute } from 'astro';

export const prerender = false;

// Stub API - templates data migrated from Supabase (currently empty)
export const GET: APIRoute = async ({ url }) => {
  return new Response(JSON.stringify({
    success: true,
    data: [],
    count: 0,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
