import { useState, useEffect } from 'react';
import { FileText, Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useScrollContext } from '../../layout/DashboardShell';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'On-Grid', href: '/on-grid' },
  { label: 'Hybrid', href: '/hybrid-bess' },
  { label: 'Tấm Pin', href: '/equipment/panel' },
  { label: 'Inverter', href: '/equipment/inverter' },
  { label: 'Pin Lưu Trữ', href: '/equipment/battery' },
  { label: 'Dự Án', href: '/du-an' },
];

export default function HeaderBar() {
  const [activePath, setActivePath] = useState('/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isHeaderVisible } = useScrollContext();

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <header
      className={`hidden lg:block fixed left-0 right-0 z-50 top-2 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Logo - left */}
        <a href="/" className="flex-shrink-0">
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            Solar24h
          </span>
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
          {/* Search Icon */}
          <button className="p-2 bg-white/60 backdrop-blur-2xl rounded-full shadow border border-white/40 text-gray-700 hover:bg-white transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Cart Icon */}
          <button className="relative p-2 bg-white/60 backdrop-blur-2xl rounded-full shadow border border-white/40 text-gray-700 hover:bg-white transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
          {/* Phone CTA - hidden on mobile */}
          <a
            href="/bao-gia"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Nhận Báo Giá</span>
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
                href="/bao-gia"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full px-4 py-2.5 text-sm font-semibold transition-colors w-full"
              >
                <FileText className="h-4 w-4" />
                <span>Nhận Báo Giá</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
