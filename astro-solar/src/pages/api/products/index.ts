import type { APIRoute } from 'astro';
import { filterProducts, localProducts } from '../../../data/products';

export const prerender = false;

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
    // Filter local products
    let filtered = filterProducts({
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      productType,
      phase,
      voltage,
    });

    // Filter by show_on_homepage if specified
    if (showOnHomepage === 'true') {
      filtered = filtered.filter(p => p.show_on_homepage);
    } else if (showOnHomepage === 'false') {
      filtered = filtered.filter(p => !p.show_on_homepage);
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Transform to match Supabase response format
    const products = filtered.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      model: p.model,
      description: p.description,
      specifications: p.specifications,
      features: p.features,
      warranty_years: p.warranty_years,
      unit_price: p.unit_price,
      main_image: p.main_image,
      is_available: p.is_available,
      show_on_homepage: p.show_on_homepage,
      product_type: p.product_type,
      phase: p.phase,
      voltage: p.voltage,
      category_id: null, // For backward compatibility
      brand_id: null, // For backward compatibility
      brands: { name: p.brand, slug: p.brand.toLowerCase().replace(/\s+/g, '-') },
      categories: { name: p.category, slug: p.category },
    }));

    return new Response(JSON.stringify({
      success: true,
      data: products,
      count: products.length,
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
