import { Phone, Envelope, MapPin, ChatCircle } from '@phosphor-icons/react';

const BRAND_RED = '#DC2626';

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: '#1A1D21' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <div className="mb-4">
              <img src="/logo-epcvina-solar-white.png" alt="EPCVINA Solar" width={1024} height={159} className="h-9 sm:h-12 w-auto" loading="lazy" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-1">
              Điện mặt trời an toàn từ chuyên gia cơ điện.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              Tư vấn &middot; Thiết kế &middot; Lắp đặt &middot; Bảo trì
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {/* Zalo */}
              <a
                href="https://zalo.me/0988446113"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#1a3a5c' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1452a0')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1a3a5c')}
                aria-label="Zalo"
              >
                <img src="/icons8-zalo.svg" alt="Zalo" width={20} height={20} className="w-5 h-5 object-contain" loading="lazy" />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/epcvinacom/"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
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
                href="https://www.youtube.com/@EPCVINA"
                target="_blank" rel="noopener noreferrer"

                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#374151' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = BRAND_RED)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#374151')}
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Sản phẩm</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/solar-home" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Solar Home</a></li>
              <li><a href="/solar-home/he-thong" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Tất cả combo</a></li>
              <li><a href="/solar-home/on-grid" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Combo On-Grid</a></li>
              <li><a href="/solar-home/hybrid" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Combo Hybrid</a></li>
              <li><a href="/thiet-bi/panel" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Tấm quang năng</a></li>
              <li><a href="/thiet-bi/hybrid-inverter" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Biến tần Hybrid</a></li>
              <li><a href="/thiet-bi/hv-battery" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Pin lưu trữ BESS</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dịch vụ</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/calculator" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Công cụ tính toán</a></li>
              <li><a href="/solar-home" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Solar Home</a></li>
              <li><a href="/solar-home/hybrid" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Hybrid & BESS</a></li>
              <li><a href="/solar-cong-nghiep" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Solar C&I</a></li>
              <li><a href="/ung-dung/van-phong" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Văn phòng</a></li>
              <li><a href="/du-an" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Dự án đã thi công</a></li>
              <li><a href="/tin-tuc" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block active:scale-[0.98]">Blog</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Chính sách</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/chinh-sach-bao-mat" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Chính sách bảo mật</a></li>
              <li><a href="/chinh-sach-thanh-toan" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Chính sách thanh toán</a></li>
              <li><a href="/bao-hanh" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Chính sách bảo hành</a></li>
              <li><a href="/chinh-sach-doi-tra" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Chính sách đổi trả</a></li>
              <li><a href="/chinh-sach-giao-nhan" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Chính sách giao nhận</a></li>
              <li><a href="/dieu-khoan" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" weight="fill" style={{ color: BRAND_RED }} />
                <span className="text-gray-400 leading-relaxed">
                  Phòng 315, Khu thương mại – Chung cư Học viện Quốc phòng,<br className="sm:hidden" />
                  Đường Xuân Tảo, Q. Tây Hồ, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a href="tel:0988446113" className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]">
                  0988 446 113 <span className="text-gray-400">(Mrs. Giang)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a href="tel:0368927332" className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]">
                  0368 927 332 <span className="text-gray-400">(Mr. Thái)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ChatCircle className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a
                  href="https://zalo.me/0988446113"
                  target="_blank" rel="noopener noreferrer"

                  className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]"
                >
                  Zalo: 0988 446 113
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Envelope className="h-4 w-4 flex-shrink-0" weight="fill" style={{ color: BRAND_RED }} />
                <a href="mailto:epcvinasolar@gmail.com" className="hover:text-white transition-colors cursor-pointer py-1 inline-block active:scale-[0.98]">
                  epcvinasolar@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-10 pt-4 sm:pt-6 pb-2 space-y-3 text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} EPCVINA Solar — Công ty CP Xây Lắp EPC Việt Nam. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/chinh-sach-bao-mat" className="hover:text-gray-300 transition-colors cursor-pointer py-1">Chính sách bảo mật</a>
              <a href="/dieu-khoan" className="hover:text-gray-300 transition-colors cursor-pointer py-1">Điều khoản sử dụng</a>
            </div>
          </div>
          <div className="text-center sm:text-left leading-relaxed text-gray-400">
            <p>CÔNG TY CỔ PHẦN XÂY LẮP EPC VIỆT NAM (EPC VINA.,JSC)</p>
            <p>Giấy chứng nhận đăng ký doanh nghiệp số 0105313377 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 17/05/2011.</p>
          </div>
        </div>
      </div>

    </footer>
  );
}
