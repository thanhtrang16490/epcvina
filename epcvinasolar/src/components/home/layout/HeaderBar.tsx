import { useState, useEffect, useRef } from 'react';
import { CaretDown, FileText, List, X } from '@phosphor-icons/react';
import { useScrollContext } from '../../layout/DashboardShell';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Solar House', href: '/solar-home' },
  { label: 'Hybrid & BESS', href: '/hybrid-bess' },
  { label: 'Sạc EV', href: '/sac-ev' },
  { label: 'Solar C&I', href: '/solar-cong-nghiep' },
  { label: 'Bảo trì O&M', href: '/bao-tri' },
  { label: 'Dự án', href: '/du-an' },
  { label: 'Liên hệ', href: '/lien-he' },
];

const secondaryNavItems = navItems.slice(5);

export default function HeaderBar() {
  const [activePath, setActivePath] = useState('/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleNavCount, setVisibleNavCount] = useState(navItems.length);
  const { isHeaderVisible } = useScrollContext();
  const navRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const logoSrc = '/logo-epcvina-solar.png';

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!moreMenuRef.current) return;
      if (!moreMenuRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [activePath]);

  useEffect(() => {
    const measureNavItems = () => {
      const navEl = navRef.current;
      const moreButtonEl = moreButtonRef.current;
      if (!navEl) return;

      const availableWidth = navEl.clientWidth;
      const itemWidths = navItems.map((_, index) => navItemRefs.current[index]?.offsetWidth ?? 0);
      const gapWidth = 4;
      const moreWidth = moreButtonEl?.offsetWidth ?? 56;
      const totalItemsWidth = itemWidths.reduce((sum, width) => sum + width, 0) + gapWidth * Math.max(0, itemWidths.length - 1);

      if (totalItemsWidth <= availableWidth) {
        setVisibleNavCount(navItems.length);
        return;
      }

      let usedWidth = 0;
      let count = 0;
      for (let i = 0; i < itemWidths.length; i += 1) {
        const nextWidth = itemWidths[i];
        const nextGap = count > 0 ? gapWidth : 0;
        const needsMore = i < itemWidths.length - 1;
        const reservedMore = needsMore ? moreWidth + gapWidth : 0;

        if (usedWidth + nextGap + nextWidth + reservedMore > availableWidth) {
          break;
        }

        usedWidth += nextGap + nextWidth;
        count += 1;
      }

      setVisibleNavCount(Math.max(1, count));
    };

    const frame = window.requestAnimationFrame(measureNavItems);
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(measureNavItems);
    });

    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    window.addEventListener('resize', measureNavItems);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureNavItems);
    };
  }, []);

  return (
    <header
      className={`hidden lg:block fixed left-0 right-0 lg:left-16 z-[80] top-2 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 rounded-full border border-white/50 bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.10)] px-3 py-2">
          <a href="/" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="EPCVINA Solar"
              width={1024}
              height={159}
              className="h-8 md:h-9 w-auto"
            />
          </a>

          <nav ref={navRef} className="hidden lg:flex flex-1 min-w-0 items-center gap-0.5 overflow-hidden">
            {navItems.slice(0, visibleNavCount).map((item, index) => {
              const isActive = activePath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    navItemRefs.current[index] = el;
                  }}
                  className={`relative flex-shrink-0 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            {visibleNavCount < navItems.length && (
              <div ref={moreMenuRef} className="relative flex-shrink-0">
                <button
                  ref={moreButtonRef}
                  type="button"
                  onClick={() => setMoreOpen((open) => !open)}
                  className="relative flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-white/70 transition-all duration-200 whitespace-nowrap active:scale-[0.97]"
                  aria-expanded={moreOpen}
                >
                  Khác
                  <CaretDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} weight="bold" />
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-48 overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                    {secondaryNavItems.map((item) => {
                      const isActive = activePath === item.href;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className={`block px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <a
              href="/bao-gia"
              className="hidden md:flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-3 lg:px-4 py-2 text-xs sm:text-sm font-semibold shadow-md transition-colors active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" weight="bold" />
              <span className="hidden xl:inline">Nhận Báo Giá</span>
              <span className="hidden lg:inline xl:hidden">Báo giá</span>
            </a>

            <button
              onClick={() => {
                setMoreOpen(false);
                setMobileOpen(!mobileOpen);
              }}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/70 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-white/50 text-gray-700 active:scale-[0.97]"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" weight="bold" /> : <List className="h-5 w-5" weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 rounded-2xl bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 overflow-hidden relative z-[81]">
          {/* Mirror reflection gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20 pointer-events-none" />
          <nav className="flex flex-col py-2 relative">
            {navItems.map((item) => {
              const isActive = activePath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-5 py-3 text-sm font-medium transition-colors active:scale-[0.98] ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-white/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="px-4 py-3 border-t border-white/20">
              <a
                href="/bao-gia"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-4 py-2.5 text-sm font-semibold transition-colors w-full active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" weight="bold" />
                <span>Nhận Báo Giá</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
