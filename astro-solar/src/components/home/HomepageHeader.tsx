import { Sun, SlidersHorizontal, Phone } from 'lucide-react';

interface HomepageHeaderProps {
  combo: {
    name: string;
    power: number;
    price: number;
    dailyProduction: number;
    monthlySavings: number;
  };
  mounted: boolean;
  onConfigClick: () => void;
}

function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu`;
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

export default function HomepageHeader({ combo, mounted, onConfigClick }: HomepageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Sun className="h-7 w-7 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              EPC <span className="text-red-500">SOLAR</span>
            </span>
          </a>

          {/* Center - Combo Info (hidden on small mobile) */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-6 text-sm">
            {mounted ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Hệ thống:</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">{combo.name}</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="text-gray-500">Công suất:</span>
                  <span className="font-semibold text-green-600">{combo.power} kWp</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-gray-500">Sản lượng:</span>
                  <span className="font-semibold text-blue-600">{combo.dailyProduction} kWh/ngày</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-red-600 font-bold text-base">{formatVND(combo.price)}</span>
                </div>
              </>
            ) : (
              <span className="text-gray-400">Đang tải...</span>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onConfigClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Tùy chỉnh</span>
            </button>
            <a
              href="tel:0988446113"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">Hotline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile compact info bar */}
      <div className="sm:hidden border-t border-gray-50 bg-gray-50/80 px-4 py-2">
        {mounted ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 truncate">{combo.name}</span>
            <span className="text-red-600 font-bold ml-2 flex-shrink-0">{formatVND(combo.price)}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Đang tải...</span>
        )}
      </div>
    </header>
  );
}
