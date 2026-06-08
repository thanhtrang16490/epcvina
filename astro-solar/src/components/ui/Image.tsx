import React from 'react';

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
}

export default function Image({ src, alt, fill, width, height, className, style, onError, ...rest }: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
        onError={onError}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={onError}
      loading="lazy"
    />
  );
}
