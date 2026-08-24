import { useEffect, useMemo, useRef, useState } from 'react';

export type ComboMediaItem = { type: 'video' | 'image'; src: string };

interface ComboDetailMediaGalleryProps {
  gallery: ComboMediaItem[];
}

export default function ComboDetailMediaGallery({ gallery }: ComboDetailMediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mediaTransitioning, setMediaTransitioning] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const thumbScrollTimerRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const autoplayProgressTimerRef = useRef<number | null>(null);
  const mediaTransitionTimerRef = useRef<number | null>(null);

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

  const changeSelectedImage = (nextIndex: number) => {
    if (gallery.length === 0) return;

    if (mediaTransitionTimerRef.current) {
      window.clearTimeout(mediaTransitionTimerRef.current);
    }

    setMediaTransitioning(true);
    setZoomed(false);
    setAutoplayProgress(0);
    setSelectedImage(nextIndex);
    syncThumbStartIndex(nextIndex);

    mediaTransitionTimerRef.current = window.setTimeout(() => {
      setMediaTransitioning(false);
      mediaTransitionTimerRef.current = null;
    }, 220);
  };

  const startAutoplay = () => {
    if (autoplayTimerRef.current || gallery.length <= 1 || autoplayPaused) return;
    if (autoplayProgressTimerRef.current) {
      window.clearInterval(autoplayProgressTimerRef.current);
      autoplayProgressTimerRef.current = null;
    }

    setAutoplayProgress(0);
    autoplayTimerRef.current = window.setInterval(() => {
      if (mediaTransitionTimerRef.current) {
        window.clearTimeout(mediaTransitionTimerRef.current);
      }

      setMediaTransitioning(true);
      setZoomed(false);
      setSelectedImage((current) => {
        const nextIndex = (current + 1) % gallery.length;
        syncThumbStartIndex(nextIndex);
        setAutoplayProgress(0);
        return nextIndex;
      });

      mediaTransitionTimerRef.current = window.setTimeout(() => {
        setMediaTransitioning(false);
        mediaTransitionTimerRef.current = null;
      }, 220);
    }, 4500);

    autoplayProgressTimerRef.current = window.setInterval(() => {
      setAutoplayProgress((current) => Math.min(100, current + (100 / 45)));
    }, 100);
  };

  const stopAutoplay = () => {
    if (!autoplayTimerRef.current) return;
    window.clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = null;
    if (autoplayProgressTimerRef.current) {
      window.clearInterval(autoplayProgressTimerRef.current);
      autoplayProgressTimerRef.current = null;
    }
  };

  const openLightbox = () => {
    setZoomed(false);
    setLightboxOpen(true);
    startAutoplay();
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    startAutoplay();
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

  const mobileThumbOffset = useMemo(() => {
    const itemSize = 68;
    const visibleCount = 4;
    const maxOffset = Math.max(0, gallery.length * itemSize - visibleCount * itemSize);
    return Math.min(Math.max(0, thumbStartIndex * itemSize), maxOffset);
  }, [thumbStartIndex, gallery.length]);

  const maxThumbStartIndex = Math.max(0, gallery.length - visibleThumbCount);
  const canScrollThumbUp = thumbStartIndex > 0;
  const canScrollThumbDown = thumbStartIndex < maxThumbStartIndex;

  useEffect(() => {
    startAutoplay();
    window.addEventListener('blur', stopAutoplay);
    window.addEventListener('focus', startAutoplay);

    return () => {
      stopAutoplay();
      if (mediaTransitionTimerRef.current) {
        window.clearTimeout(mediaTransitionTimerRef.current);
        mediaTransitionTimerRef.current = null;
      }
      if (autoplayTimerRef.current) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      if (autoplayProgressTimerRef.current) {
        window.clearInterval(autoplayProgressTimerRef.current);
        autoplayProgressTimerRef.current = null;
      }
      window.removeEventListener('blur', stopAutoplay);
      window.removeEventListener('focus', startAutoplay);
    };
  }, [gallery.length, autoplayPaused]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <div className="relative md:pl-[82px]">
        <div
          className="absolute left-0 top-0 hidden h-full w-[70px] overflow-hidden pr-1 pt-10 pb-10 md:block"
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
                  changeSelectedImage(index);
                }}
                onFocus={() => {
                  changeSelectedImage(index);
                }}
                className={`main-image-tc-thumbnail relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[14px] border bg-white transition ${
                  selectedImage === index ? 'main-image-tc-thumbnail-active border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                {src.type === 'video' ? (
                  <video src={src.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <img src={src.src} alt={`Thumbnail ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
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

        <div className="relative" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
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
                  className={`h-full w-full object-cover transition-all duration-300 ease-out ${
                    mediaTransitioning ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'
                  }`}
                />
              ) : (
                <img
                  key={selectedMedia?.src}
                  src={selectedMedia?.src}
                  alt={`Ảnh combo ${selectedImage + 1}`}
                  fetchPriority={selectedImage === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className={`h-full w-full transition-all duration-300 ease-out ${
                    zoomed ? 'scale-[1.35] cursor-zoom-out object-contain' : 'cursor-zoom-in object-cover'
                  } ${mediaTransitioning ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'}`}
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  onClick={openLightbox}
                />
              )}
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-[16px] border border-gray-200" />

            {!isSelectedVideo ? (
              <button
                type="button"
                onClick={openLightbox}
                className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[12px] font-semibold text-gray-700 shadow-md backdrop-blur transition hover:bg-white"
              >
                <span className="text-[14px] leading-none">+</span>
                Xem lớn
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                changeSelectedImage(Math.max(0, selectedImage - 1));
              }}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              <span className="text-2xl leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={() => {
                changeSelectedImage(Math.min(gallery.length - 1, selectedImage + 1));
              }}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              <span className="text-2xl leading-none">›</span>
            </button>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cuộn thumbnail sang trái"
              onClick={() => setThumbStartIndex((current) => Math.max(0, current - 1))}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
                canScrollThumbUp ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
              }`}
            >
              <span className="text-lg leading-none">‹</span>
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <div
                className="flex gap-2 transition-transform duration-300 ease-out"
                style={{ transform: `translate3d(-${mobileThumbOffset}px, 0, 0)` }}
              >
                {gallery.map((item, index) => (
                  <button
                    key={`mobile-thumb-${item.src}-${index}`}
                    type="button"
                    onPointerEnter={() => {
                      changeSelectedImage(index);
                    }}
                    onFocus={() => {
                      changeSelectedImage(index);
                    }}
                    onClick={() => changeSelectedImage(index)}
                    className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[12px] border bg-white transition ${
                      selectedImage === index ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      <img src={item.src} alt={`Mobile thumbnail ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-black/5" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Cuộn thumbnail sang phải"
              onClick={() => setThumbStartIndex((current) => Math.min(maxThumbStartIndex, current + 1))}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white text-gray-700 shadow-sm transition ${
                canScrollThumbDown ? 'border-gray-300 hover:border-gray-500' : 'pointer-events-none opacity-30'
              }`}
            >
              <span className="text-lg leading-none">›</span>
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-[1080px] overflow-hidden rounded-[22px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button
                type="button"
                aria-label={autoplayPaused ? 'Phát trình chiếu' : 'Tạm dừng trình chiếu'}
                onClick={() => {
                  setAutoplayPaused((current) => {
                    const nextPaused = !current;
                    if (nextPaused) {
                      stopAutoplay();
                    } else {
                      startAutoplay();
                    }
                    return nextPaused;
                  });
                }}
                className="relative grid h-12 w-12 place-items-center rounded-full bg-white/95 text-gray-700 shadow-md transition hover:bg-white"
              >
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    pathLength="100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="text-emerald-500"
                    style={{
                      strokeDasharray: '100',
                      strokeDashoffset: String(100 - autoplayProgress),
                    }}
                  />
                </svg>
                <span className="relative text-[14px] leading-none">{autoplayPaused ? '▶' : '❚❚'}</span>
              </button>
              <button
                type="button"
                aria-label="Đóng popup gallery"
                onClick={closeLightbox}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition hover:bg-white"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col">
              <div className="relative bg-white">
                <div className="relative flex items-center justify-center bg-white px-3 py-3 sm:px-4 sm:py-4">
                  {isSelectedVideo ? (
                    <video
                      key={selectedMedia?.src}
                      src={selectedMedia?.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className={`max-h-[68vh] w-full object-contain transition-all duration-300 ease-out ${
                        mediaTransitioning ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'
                      }`}
                    />
                  ) : (
                    <img
                      key={selectedMedia?.src}
                      src={selectedMedia?.src}
                      alt={`Ảnh combo lớn ${selectedImage + 1}`}
                      loading="eager"
                      decoding="async"
                      className={`max-h-[68vh] w-full object-contain transition-all duration-300 ease-out ${
                        mediaTransitioning ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'
                      }`}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    changeSelectedImage(Math.max(0, selectedImage - 1));
                  }}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-50"
                >
                  <span className="text-2xl leading-none">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeSelectedImage(Math.min(gallery.length - 1, selectedImage + 1));
                  }}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-50"
                >
                  <span className="text-2xl leading-none">›</span>
                </button>
              </div>

              <div className="border-t border-gray-200 bg-white p-2 sm:p-2.5">
                <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1">
                  {gallery.map((item, index) => (
                    <button
                      key={`lightbox-${item.src}-${index}`}
                      type="button"
                      onClick={() => {
                        changeSelectedImage(index);
                      }}
                      className={`relative shrink-0 overflow-hidden rounded-[10px] border transition ${
                        item.type === 'video' ? 'aspect-video w-[92px] sm:w-[104px] md:w-[116px]' : 'aspect-square w-[52px] sm:w-[56px] md:w-[60px]'
                      } ${
                        selectedImage === index ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                      ) : (
                        <img src={item.src} alt={`Lightbox thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
