import { useState, useEffect } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * BackToTop Component
 * 
 * - Desktop: right: 35px, shows after scrolling 500px
 * - Mobile: left: 35px, shows only near page bottom (within 400px)
 * - Smooth scroll to top on click
 * - Accessible with keyboard navigation
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);

    const handleScroll = () => {
      if (mobile) {
        // Show only when near the bottom of the page
        const scrollBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
        setVisible(scrollBottom < 400);
      } else {
        setVisible(window.scrollY > 500);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      }}
      aria-label="Cuộn lên đầu trang"
      className="fixed z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 group motion-reduce:transition-none"
      style={{
        width: 40,
        height: 40,
        bottom: 100,
        ...(isMobile ? { left: 20 } : { right: 35 }),
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform mx-auto" />
    </button>
  );
}
