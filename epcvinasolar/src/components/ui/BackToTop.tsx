import { useState, useEffect } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * BackToTop Component
 * 
 * - Always right: 35px
 * - Desktop: shows after scrolling 500px, bottom: 100px
 * - Mobile: shows only near page bottom (swap with Call/Zalo), bottom: 35px
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;

    const handleScroll = () => {
      if (mobile) {
        const scrollBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
        setVisible(scrollBottom < 200);
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
        right: 35,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform mx-auto" />
    </button>
  );
}
