import { useEffect, useState } from 'react';

export type HeaderTheme = 'light' | 'dark';

const HEADER_THEME_SELECTOR = '[data-header-theme]';

export function useHeaderTheme(fallback: HeaderTheme = 'light') {
  const [theme, setTheme] = useState<HeaderTheme>(fallback);

  useEffect(() => {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(HEADER_THEME_SELECTOR),
    );

    if (candidates.length === 0) {
      setTheme(fallback);
      return;
    }

    let frame = 0;

    const resolveTheme = () => {
      const headerOffset = 96;
      let bestCandidate: { theme: HeaderTheme; score: number } | null = null;

      for (const element of candidates) {
        const rect = element.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, headerOffset);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight * 0.72);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight <= 0) continue;

        const themeValue = (element.dataset.headerTheme || fallback) as HeaderTheme;
        const score = visibleHeight * Math.min(rect.width, window.innerWidth);

        if (!bestCandidate || score > bestCandidate.score) {
          bestCandidate = { theme: themeValue, score };
        }
      }

      setTheme(bestCandidate?.theme ?? fallback);
    };

    const scheduleResolve = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        resolveTheme();
      });
    };

    resolveTheme();
    window.addEventListener('scroll', scheduleResolve, { passive: true });
    window.addEventListener('resize', scheduleResolve);

    const observer = new IntersectionObserver(scheduleResolve, {
      root: null,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    candidates.forEach((element) => observer.observe(element));

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleResolve);
      window.removeEventListener('resize', scheduleResolve);
      observer.disconnect();
    };
  }, [fallback]);

  return theme;
}
