/**
 * Optimized Image Component
 * 
 * Features:
 * - Automatic WebP/AVIF conversion when using Astro assets
 * - Lazy loading by default
 * - Responsive sizing support
 * - Error handling with fallback
 * - Accessibility-first (alt text required)
 * 
 * Usage:
 * 1. For local images (auto-optimized):
 *    import { Image } from 'astro:assets';
 *    <Image src={importedLocalImage} alt="..." width={800} />
 * 
 * 2. For external/URL images (current component):
 *    <Image src="https://..." alt="..." width={800} />
 */
import React, { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  loading?: 'lazy' | 'eager';
}

export default function Image({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  style, 
  onError,
  loading = 'lazy',
  ...rest 
}: ImageProps) {
  const [error, setError] = useState(false);
  const isLocalAsset = src.startsWith('/') && !src.startsWith('//');
  // Local static assets should render immediately; remote images can still fade in.
  const [loaded, setLoaded] = useState(isLocalAsset);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setError(true);
    onError?.(e);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  // Fallback for broken images
  if (error) {
    return (
      <div 
        className={`${className || ''} bg-gray-100 flex items-center justify-center aspect-square`.trim()}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-300">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-10 w-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="M7 14l3-3 3 3 2-2 4 4" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className || ''} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`.trim()}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        decoding="async"
        {...rest}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className || ''} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`.trim()}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      decoding="async"
      {...rest}
    />
  );
}
