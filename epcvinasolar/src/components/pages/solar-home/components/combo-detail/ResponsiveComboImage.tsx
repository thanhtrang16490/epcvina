export default function ResponsiveComboImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  const avifSrc = src.replace(/\.(png|webp)$/i, '.avif');
  const webpSrc = src.replace(/\.(png|avif)$/i, '.webp');

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={className} loading={loading} />
    </picture>
  );
}
