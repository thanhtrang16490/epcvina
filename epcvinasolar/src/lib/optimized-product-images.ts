import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

type ProductImageModule = {
  default: ImageMetadata;
};

const productImages = import.meta.glob<ProductImageModule>(
  '/public/images/products/**/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

const optimizedCache = new Map<string, Promise<string>>();

function productImageKey(src = '') {
  if (!src.startsWith('/images/products/')) return null;
  return `/public${src}`;
}

export async function getOptimizedProductImage(
  src = '',
  options: { width?: number; format?: 'avif' | 'webp' | 'png' | 'jpg' | 'jpeg'; quality?: number } = {},
) {
  const key = productImageKey(src);
  if (!key) return src;

  const image = productImages[key]?.default;
  if (!image) return src;

  const width = options.width ?? 640;
  const format = options.format ?? 'webp';
  const quality = options.quality ?? 78;
  const cacheKey = `${key}:${width}:${format}:${quality}`;

  if (!optimizedCache.has(cacheKey)) {
    optimizedCache.set(
      cacheKey,
      getImage({ src: image, width, format, quality }).then((optimized) => optimized.src),
    );
  }

  return optimizedCache.get(cacheKey)!;
}
