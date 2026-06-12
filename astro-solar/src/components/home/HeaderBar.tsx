import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Solar Home', href: '/solutions' },
  { label: 'Hybrid & BESS', href: '/hybrid' },
  { label: 'EV Charger', href: '#ev-charger' },
  { label: 'Solar C&I', href: '#solar-ci' },
  { label: 'Bảo trì O&M', href: '#bao-tri' },
  { label: 'Dự án', href: '/projects' },
  { label: 'Liên hệ', href: '/contact' },
];

export default function HeaderBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActivePath(window.location.pathname);
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`hidden lg:block fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'top-1' : 'top-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo - left */}
        <a href="/" className="flex-shrink-0">
          <img
            src="/logo-epcvina-solar-white.png"
            alt="EPCVINA Solar"
            className="h-10 w-auto drop-shadow-sm"
          />
        </a>

        {/* Nav pill - center (desktop only) */}
        <nav className="hidden md:flex items-center gap-0.5 bg-white/60 backdrop-blur-2xl rounded-full px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 relative overflow-hidden">
          {/* Mirror reflection gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20 pointer-events-none rounded-full" />
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Phone CTA - hidden on mobile */}
          <a
            href="tel:0988446113"
            className="hidden sm:flex items-center gap-2 bg-orange-500 text-white rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Phone className="h-4 w-4" />
            <span>0988 446 113</span>
          </a>

          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 rounded-2xl bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 overflow-hidden relative">
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
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
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
                href="tel:0988446113"
                className="flex items-center justify-center gap-2 bg-orange-500 text-white rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>0988 446 113</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
