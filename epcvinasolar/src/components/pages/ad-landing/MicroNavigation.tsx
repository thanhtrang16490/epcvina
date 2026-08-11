import { Phone, ChatCircle } from '@phosphor-icons/react';
import { trackConversionEvent } from '../../../lib/tracking';

export default function MicroNavigation() {
  const navItems = [
    { label: 'Tính chi phí', href: '#calculator' },
    { label: 'Case thực tế', href: '#hoa-don' },
    { label: 'Bảo hành', href: '#bao-hanh' },
    { label: 'Nhận khảo sát', href: '#contact' },
  ];
  const mobileNavItems = [
    { label: 'Tính chi phí', href: '#calculator' },
    { label: 'Case thực tế', href: '#hoa-don' },
    { label: 'Khảo sát 0đ', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 cursor-pointer" aria-label="EPCVINA Solar">
            <img 
              src="/logo-epcvina-solar.png" 
              alt="EPCVINA Solar" 
              className="h-8 w-auto object-contain md:h-10"
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
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hotline - Desktop */}
            <a
              href="tel:0988446113"
              onClick={() => trackConversionEvent('hotline_click', { event_label: 'nav_hotline', conversion_action: 'hotline_click_nav_hotline' })}
	              className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              aria-label="Gọi hotline 0988 446 113"
            >
              <Phone className="w-4 h-4" />
              <span>0988 446 113</span>
            </a>

            {/* Zalo Button */}
            <a
              href="https://zalo.me/0368927332"
              target="_blank" rel="noopener noreferrer"

              onClick={() => trackConversionEvent('zalo_click', { event_label: 'nav_zalo', conversion_action: 'zalo_click_nav_zalo' })}
	              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Chat Zalo với EPCVINA"
            >
              <ChatCircle className="w-4 h-4" weight="bold" />
              <span>Chat Zalo</span>
            </a>

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={() => trackConversionEvent('nav_cta_click', { event_label: 'nav_cta', conversion_action: 'nav_cta_click' })}
	              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-2 rounded-lg transition-[background-color,box-shadow] shadow-md hover:shadow-lg cursor-pointer min-h-[40px] text-[13px] md:min-h-[44px] md:px-5 md:text-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              aria-label="Nhận tư vấn miễn phí"
            >
              <span className="md:hidden">Khảo sát</span>
              <span className="hidden md:inline">Khảo sát miễn phí</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation - Scrollable */}
        <div className="md:hidden -mx-3 border-t border-slate-200 px-3 py-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {mobileNavItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full bg-slate-50 px-2 text-[12px] font-bold text-slate-700 transition-colors hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
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
