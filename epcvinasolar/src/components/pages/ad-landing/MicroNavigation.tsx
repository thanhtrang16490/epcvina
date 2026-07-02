import { Phone, ChatCircle } from '@phosphor-icons/react';

export default function MicroNavigation() {
  const navItems = [
    { label: 'Dự án thực tế', href: '#du-an' },
    { label: 'Bảng giá tham khảo', href: '#bang-gia' },
    { label: 'Chính sách bảo hành', href: '#bao-hanh' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 cursor-pointer" aria-label="EPCVINA Solar Homepage">
            <img 
              src="/logo-epcvina-solar.png" 
              alt="EPCVINA Solar" 
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="text-slate-700 hover:text-orange-600 font-medium text-sm transition-colors cursor-pointer min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Hotline - Desktop */}
            <a
              href="tel:0988446113"
              onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'nav_hotline_click', { event_category: 'conversion' })}
              className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer min-h-[44px]"
              aria-label="Gọi hotline 0988 446 113"
            >
              <Phone className="w-4 h-4" />
              <span>0988 446 113</span>
            </a>

            {/* Zalo Button */}
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'nav_zalo_click', { event_category: 'conversion' })}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer min-h-[44px]"
              aria-label="Chat Zalo với EPCVINA"
            >
              <ChatCircle className="w-4 h-4" weight="bold" />
              <span>Chat Zalo</span>
            </a>

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'nav_cta_click', { event_category: 'conversion' })}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer min-h-[44px]"
              aria-label="Nhận tư vấn miễn phí"
            >
              Nhận tư vấn miễn phí
            </a>
          </div>
        </div>

        {/* Mobile Navigation - Scrollable */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 py-2 border-t border-slate-200 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="text-slate-700 hover:text-orange-600 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center px-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
