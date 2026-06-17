

import { useState } from 'react';
import Image from './Image';

interface SolarImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function SolarImage({ 
  src, 
  alt, 
  width = 600, 
  height = 400,
  className = '',
  priority = false 
}: SolarImageProps) {
  const [error, setError] = useState(false);

  // Fallback placeholder with gradient
  const placeholderSrc = `https://placehold.co/${width}x${height}/gray/white?text=${encodeURIComponent(alt)}`;

  if (error || !src) {
    return (
      <div 
        className={`relative bg-gradient-to-b from-gray-300 via-gray-100 to-white overflow-hidden ${className}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-700 text-lg font-medium px-4 text-center">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
