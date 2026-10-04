import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getOptimizedProductImage } from '../lib/optimized-product-images';

export const prerender = false;

const SITE_URL = 'https://epcvina.com';

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function productIdFromEntry(id: string) {
  return id.replace(/\.(md|mdx)$/, '');
}

function productUrl(category: string, id: string) {
  return `${SITE_URL}/thiet-bi/${encodeURIComponent(category)}/${id
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

export const GET: APIRoute = async () => {
  try {
    const products = await getCollection('products');
    const eligibleProducts = products
      .filter(({ data }) => Boolean(data.main_image) && typeof data.price === 'number' && data.price > 0)
      .sort((a, b) => a.data.name.localeCompare(b.data.name, 'vi'));

    const items = await Promise.all(eligibleProducts.map(async (product) => {
      const id = productIdFromEntry(product.id);
      const data = product.data;
      const image = await getOptimizedProductImage(data.main_image, {
        width: 1200,
        format: 'webp',
        quality: 82,
      });
      const imageUrl = new URL(image, SITE_URL).toString();
      const title = cleanText(`${data.brand} ${data.name}`.trim(), 150);
      const description = cleanText(data.description || `${data.name} chính hãng từ EPCVINA Solar.`, 5000);
      const offerId = cleanText(data.model || id.replace(/\//g, '-'), 50);

      return `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl(data.category, id))}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${data.is_available ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${escapeXml(data.price)} VND</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(data.brand)}</g:brand>
      <g:mpn>${escapeXml(offerId)}</g:mpn>
    </item>`;
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>EPCVINA Solar - Sản phẩm điện mặt trời</title>
    <link>${SITE_URL}/thiet-bi</link>
    <description>Danh mục thiết bị điện mặt trời chính hãng từ EPCVINA Solar.</description>${items.join('')}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Google Merchant feed error:', error);
    return new Response('Unable to generate product feed', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};
