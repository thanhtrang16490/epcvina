import { useMemo, useRef, useState } from 'react';

export type ComboMediaItem = { type: 'video' | 'image'; src: string };

interface ComboDetailMediaGalleryProps {
  gallery: ComboMediaItem[];
}

export default function ComboDetailMediaGallery({ gallery }: ComboDetailMediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const thumbScrollTimerRef = useRef<number | null>(null);

  const selectedMedia = gallery[selectedImage];
  const isSelectedVideo = selectedMedia?.type === 'video';
  const visibleThumbCount = 4;

  const syncThumbStartIndex = (nextSelectedImage: number) => {
    const maxStartIndex = Math.max(0, gallery.length - visibleThumbCount);
    const preferredStartIndex = Math.max(0, nextSelectedImage - Math.floor((visibleThumbCount - 1) / 2));
    setThumbStartIndex(Math.min(preferredStartIndex, maxStartIndex));
  };

  const scrollThumbs = (direction: 'up' | 'down') => {
    const maxStartIndex = Math.max(0, gallery.length - visibleThumbCount);
    setThumbStartIndex((current) => {
      if (direction === 'up') return Math.max(0, current - 1);
      return Math.min(maxStartIndex, current + 1);
    });
  };

  const startThumbScroll = (direction: 'up' | 'down') => {
    if (thumbScrollTimerRef.current) return;
    scrollThumbs(direction);
    thumbScrollTimerRef.current = window.setInterval(() => scrollThumbs(direction), 220);
  };

  const stopThumbScroll = () => {
    if (thumbScrollTimerRef.current) {
      window.clearInterval(thumbScrollTimerRef.current);
      thumbScrollTimerRef.current = null;
    }
  };

  const thumbOffset = useMemo(() => {
    const itemSize = 95;
    const maxOffset = Math.max(0, gallery.length * itemSize - visibleThumbCount * itemSize);
    return Math.min(Math.max(0, thumbStartIndex * itemSize), maxOffset);
  }, [thumbStartIndex, gallery.length]);

  const maxThumbStartIndex = Math.max(0, gallery.length - visibleThumbCount);
  const canScrollThumbUp = thumbStartIndex > 0;
  const canScrollThumbDown = thumbStartIndex < maxThumbStartIndex;

  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <div className="relative pl-[82px]">
        <div
          className="absolute left-0 top-0 h-full w-[70px] overflow-hidden pr-1 pt-10 pb-10"
          onMouseLeave={stopThumbScroll}
        >
          <button
            type="button"
            aria-label="Cuộn thumbnail lên"
            onClick={() => setThumbStartIndex((current) => Math.max(0, current - 1))}
            className={`absolute left-1/2 top-3 z-30 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
              canScrollThumbUp ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
            }`}
          >
            <span className="text-lg leading-none">⌃</span>
          </button>

          <div className="absolute left-0 top-0 z-10 hidden h-1/2 w-full lg:block" onMouseEnter={() => startThumbScroll('up')} onMouseLeave={stopThumbScroll} />
          <div className="absolute bottom-0 left-0 z-10 hidden h-1/2 w-full lg:block" onMouseEnter={() => startThumbScroll('down')} onMouseLeave={stopThumbScroll} />

          <div
            className="relative z-20 flex flex-col gap-3 transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(0, -${thumbOffset}px, 0)` }}
          >
            {gallery.map((src, index) => (
              <button
                key={`${src.src}-${index}`}
                type="button"
                onPointerEnter={() => {
                  setSelectedImage(index);
                  syncThumbStartIndex(index);
                }}
                onFocus={() => {
                  setSelectedImage(index);
                  syncThumbStartIndex(index);
                }}
                className={`main-image-tc-thumbnail relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[14px] border bg-white transition ${
                  selectedImage === index ? 'main-image-tc-thumbnail-active border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                {src.type === 'video' ? (
                  <video src={src.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <img src={src.src} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-black/5" />
                <span className="sr-only">Thumbnail {index + 1}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Cuộn thumbnail xuống"
            onClick={() => setThumbStartIndex((current) => Math.min(maxThumbStartIndex, current + 1))}
            className={`absolute bottom-3 left-1/2 z-30 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
              canScrollThumbDown ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
            }`}
          >
            <span className="text-lg leading-none">⌄</span>
          </button>
        </div>

        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-[16px] bg-white">
            <div className="absolute inset-0">
              {isSelectedVideo ? (
                <video
                  key={selectedMedia?.src}
                  src={selectedMedia?.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="h-full w-full object-cover transition duration-300 ease-out"
                />
              ) : (
                <img
                  key={selectedMedia?.src}
                  src={selectedMedia?.src}
                  alt={`Ảnh combo ${selectedImage + 1}`}
                  className={`h-full w-full transition duration-300 ease-out ${
                    zoomed ? 'scale-[1.6] cursor-zoom-out object-contain' : 'cursor-zoom-in object-cover'
                  }`}
                  onClick={() => setZoomed((current) => !current)}
                />
              )}
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-[16px] border border-gray-200" />

            {!isSelectedVideo ? (
              <button
                type="button"
                onClick={() => setZoomed((current) => !current)}
                className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[12px] font-semibold text-gray-700 shadow-md backdrop-blur transition hover:bg-white"
              >
                <span className="text-[14px] leading-none">{zoomed ? '−' : '+'}</span>
                {zoomed ? 'Thu nhỏ' : 'Phóng to'}
              </button>
            ) : null}

            {zoomed && !isSelectedVideo ? (
              <button
                type="button"
                aria-label="Tắt zoom"
                onClick={() => setZoomed(false)}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[18px] font-semibold text-gray-700 shadow-md backdrop-blur transition hover:bg-white"
              >
                ×
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setZoomed(false);
                setSelectedImage((current) => {
                  const nextIndex = Math.max(0, current - 1);
                  syncThumbStartIndex(nextIndex);
                  return nextIndex;
                });
              }}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              <span className="text-2xl leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomed(false);
                setSelectedImage((current) => {
                  const nextIndex = Math.min(gallery.length - 1, current + 1);
                  syncThumbStartIndex(nextIndex);
                  return nextIndex;
                });
              }}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              <span className="text-2xl leading-none">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
