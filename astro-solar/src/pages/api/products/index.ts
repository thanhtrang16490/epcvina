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
  const brand = searchParams.get('brand') || undefined;
  const productType = searchParams.get('productType') || undefined;
  const phase = searchParams.get('phase') || undefined;
  const voltage = searchParams.get('voltage') || undefined;
  const search = searchParams.get('search') || undefined;
  const showOnHomepage = searchParams.get('show_on_homepage');
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : undefined;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined;

  try {
    let categoryId = null;
    if (category && category !== 'all') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (catData) {
        categoryId = catData.id;
      } else {
        return new Response(JSON.stringify({
          success: true,
          data: [],
          count: 0,
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        brands (*),
        categories (*)
      `)
      .eq('is_available', true);

    if (showOnHomepage === 'true') {
      query = query.eq('show_on_homepage', true);
    } else if (showOnHomepage === 'false') {
      query = query.eq('show_on_homepage', false);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (brand) {
      query = query.eq('brands.slug', brand);
    }

    if (productType) {
      query = query.eq('product_type', productType);
    }

    if (phase) {
      query = query.eq('phase', phase);
    }

    if (voltage) {
      query = query.eq('voltage', voltage);
    }

    if (minPrice !== undefined) {
      query = query.gte('unit_price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('unit_price', maxPrice);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,model.ilike.%${search}%`);
    }

    query = query.order('name', { ascending: true });

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      data: products || [],
      count: products?.length || 0,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch products',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
