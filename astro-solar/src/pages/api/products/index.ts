import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;

  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const search = searchParams.get('search') || undefined;
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : undefined;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined;

  try {
    // Get products from Content Collections
    const allProducts = await getCollection('products');
    
    let filtered = allProducts;

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.data.category === category);
    }

    // Filter by brand
    if (brand) {
      filtered = filtered.filter(p => p.data.brand.toLowerCase() === brand.toLowerCase());
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.data.name.toLowerCase().includes(searchLower) ||
        p.data.brand.toLowerCase().includes(searchLower) ||
        p.data.model.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => (p.data.price || 0) >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => (p.data.price || 0) <= maxPrice);
    }

    // Sort by name
    filtered.sort((a, b) => a.data.name.localeCompare(b.data.name));

    // Transform to match expected response format
    const products = filtered.map(p => ({
      id: p.id,
      name: p.data.name,
      brand: p.data.brand,
      category: p.data.category,
      model: p.data.model,
      description: p.data.description,
      specifications: p.data.specifications,
      features: p.data.features,
      warranty: p.data.warranty,
      price: p.data.price,
      main_image: p.data.main_image,
      is_available: p.data.is_available,
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
