import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Catalogue', href: '/hybrid' },
  { label: 'Dự án', href: '/projects' },
  { label: 'Liên hệ', href: '/contact' },
];

export default function HeaderBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <img
              src="/logo-epc-solar.png"
              alt="EPC Solar"
              className="h-8 sm:h-10 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-md text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
