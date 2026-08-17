import { useState, useEffect } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

/**
 * BackToTop Component
 * 
 * - Always right: 35px
 * - Shows only near the page footer
 */
interface BackToTopProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export default function BackToTop({ onVisibilityChange }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      const nextVisible = scrollBottom < 220;
      setVisible(nextVisible);
      onVisibilityChange?.(nextVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      onVisibilityChange?.(false);
    };
  }, [onVisibilityChange]);

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
        bottom: 32,
        right: 35,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform mx-auto" />
    </button>
  );
}
