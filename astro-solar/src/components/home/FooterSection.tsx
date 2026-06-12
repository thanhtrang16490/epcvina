import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const BRAND_RED = '#D0202A';

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: '#1A1D21' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img src="/logo-epcvina-solar-white.png" alt="EPCVINA Solar" className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-1">
              Điện mặt trời an toàn từ chuyên gia cơ điện.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Tư vấn · Thiết kế · Lắp đặt · Bảo trì
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {/* Zalo */}
              <a
                href="https://zalo.me/0988446113"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#1a3a5c' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1452a0')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1a3a5c')}
                aria-label="Zalo"
              >
                <img src="/icons8-zalo.svg" alt="Zalo" width={20} height={20} className="w-5 h-5 object-contain" />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61590381766646"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = BRAND_RED)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = BRAND_RED)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#111')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Sản phẩm</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/on-grid" className="hover:text-white transition-colors">Combo On-Grid</a></li>
              <li><a href="/hybrid" className="hover:text-white transition-colors">Combo Hybrid</a></li>
              <li><a href="/equipment/panel" className="hover:text-white transition-colors">Tấm quang năng</a></li>
              <li><a href="/equipment/hybrid-inverter" className="hover:text-white transition-colors">Biến tần Hybrid</a></li>
              <li><a href="/equipment/hv-battery" className="hover:text-white transition-colors">Pin lưu trữ BESS</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dịch vụ</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/solutions" className="hover:text-white transition-colors">Solar Home</a></li>
              <li><a href="/hybrid" className="hover:text-white transition-colors">Hybrid & BESS</a></li>
              <li><a href="/applications/nha-xuong" className="hover:text-white transition-colors">Solar C&I</a></li>
              <li><a href="/applications/van-phong" className="hover:text-white transition-colors">Văn phòng</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors">Dự án đã thi công</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: BRAND_RED }} />
                <span className="text-gray-400 leading-relaxed">
                  Phòng 315 - Khu TM Chung cư HVQP,<br />
                  Nguyễn Văn Huyên, Q. Tây Hồ, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: BRAND_RED }} />
                <a href="tel:0988446113" className="hover:text-white transition-colors">
                  0988 446 113 <span className="text-gray-500">(Mrs. Giang)</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 flex-shrink-0" style={{ color: BRAND_RED }} />
                <a
                  href="https://zalo.me/0988446113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Zalo: 0988 446 113
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: BRAND_RED }} />
                <a href="mailto:epcvina@hotmail.com" className="hover:text-white transition-colors">
                  epcvina@hotmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} EPCVINA Solar — Công ty CP Xây Lắp EPC Việt Nam. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-300 transition-colors">Chính sách bảo mật</a>
            <a href="/terms" className="hover:text-gray-300 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
