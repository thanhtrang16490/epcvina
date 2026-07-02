import { useState, useEffect } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * BackToTop Component
 * 
 * Features:
 * - Appears after scrolling 500px
 * - Smooth scroll to top on click
 * - Fade in/out animation
 * - Fixed position bottom-right
 * - Mobile-friendly sizing
 * - Accessible with keyboard navigation
 * 
 * Usage:
 * <BackToTop />
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 500px
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Don't render if not visible
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
      className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group motion-reduce:transition-none"
      style={{
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
