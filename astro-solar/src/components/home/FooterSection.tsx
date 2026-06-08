import { Phone, Mail, MapPin } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/logo-epc-solar.png" alt="EPC Solar" className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Giải pháp điện mặt trời trọn gói từ EPC VINA - Nhà thầu M&E hàng đầu Việt Nam.
              Tư vấn - Thiết kế - Lắp đặt - Bảo trì.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-black rounded-full flex items-center justify-center transition-colors" aria-label="TikTok">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors" aria-label="YouTube">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/on-grid" className="hover:text-amber-400 transition-colors">Combo On-Grid</a></li>
              <li><a href="/hybrid" className="hover:text-amber-400 transition-colors">Combo Hybrid</a></li>
              <li><a href="/equipment/panel" className="hover:text-amber-400 transition-colors">Tấm quang năng</a></li>
              <li><a href="/equipment/on-grid-inverter" className="hover:text-amber-400 transition-colors">Biến tần</a></li>
              <li><a href="/equipment/hv-battery" className="hover:text-amber-400 transition-colors">Pin lưu trữ</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Giải pháp</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/solutions/mai-ton" className="hover:text-amber-400 transition-colors">Mái tôn</a></li>
              <li><a href="/solutions/mai-ngoi" className="hover:text-amber-400 transition-colors">Mái ngói</a></li>
              <li><a href="/solutions/mai-bang" className="hover:text-amber-400 transition-colors">Mái bằng</a></li>
              <li><a href="/applications/nha-xuong" className="hover:text-amber-400 transition-colors">Nhà xưởng</a></li>
              <li><a href="/applications/van-phong" className="hover:text-amber-400 transition-colors">Văn phòng</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Phòng 315 - Khu TM Chung cư HVQP, Đường Nguyễn Văn Huyên KD, Q. Tây Hồ, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a href="tel:0988446113" className="hover:text-amber-400 transition-colors">0988 446 113 (Mrs. Giang)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:epcvina@hotmail.com" className="hover:text-amber-400 transition-colors">epcvina@hotmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2024 EPC SOLAR - Công ty CP Xây Lắp EPC Việt Nam. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>

      {/* Floating contact button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="tel:0988446113"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <Phone className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Liên hệ tư vấn trực tiếp</span>
        </a>
      </div>
    </footer>
  );
}
