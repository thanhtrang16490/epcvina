import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const BRAND_RED = '#DC2626';

export default function FooterSection() {
  return (
    <footer style={{ backgroundColor: '#1A1D21' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                Solar24h
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-1">
              Hệ thống điện mặt trời chính hãng, giá tốt.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Tư vấn · Sản phẩm · Giải pháp
            </p>

            {/* Strategic Partner Link */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">Đối tác chiến lược:</p>
              <a 
                href="https://epcvina.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold inline-flex items-center gap-1"
              >
                EPCVINA Solar
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0 0L10 14" />
                </svg>
              </a>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Tổng thầu EPC #1 Việt Nam
              </p>
            </div>

            {/* Social links - Commented out as no specific social accounts */}
            <div className="flex items-center gap-2.5">
              {/* Add social links here when available */}
            </div>

            {/* BCT Registration Badge */}
            {/* <div className="mt-5">
              <a
                href="http://online.gov.vn/Home/WebDetails/110771"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xác nhận đăng ký Bộ Công Thương"
              >
                <img
                  src="/logo-da-thong-bao-bo-cong-thuong.webp"
                  alt="Đã thông báo Bộ Công Thương"
                  className="h-10 w-auto"
                  loading="lazy"
                />
              </a>
            </div> */}
          </div>

          {/* Products */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Sản phẩm</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/on-grid" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Combo On-Grid</a></li>
              <li><a href="/hybrid-bess" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Combo Hybrid</a></li>
              <li><a href="/equipment/panel" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Tấm quang năng</a></li>
              <li><a href="/equipment/hybrid-inverter" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Biến tần Hybrid</a></li>
              <li><a href="/equipment/hv-battery" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Pin lưu trữ BESS</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="pb-6 sm:pb-0 border-b sm:border-b-0 border-white/10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dịch vụ</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/solar-home" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Solar Home</a></li>
              <li><a href="/hybrid-bess" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Hybrid & BESS</a></li>
              <li><a href="/applications/nha-xuong" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Solar C&I</a></li>
              <li><a href="/applications/van-phong" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Văn phòng</a></li>
              <li><a href="/du-an" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Dự án đã thi công</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors cursor-pointer py-1.5 inline-block motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Blog</a></li>
            </ul>
          </div>

          {/* Contact - Simplified without specific business info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400 text-xs leading-relaxed">
                Liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp điện mặt trời phù hợp với nhu cầu của bạn.
              </li>
              <li><a href="/lien-he" className="text-emerald-400 hover:text-emerald-300 transition-colors">Liên hệ ngay →</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-10 pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Solar Giá Rẻ 24h. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-300 transition-colors cursor-pointer py-1 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Chính sách bảo mật</a>
            <a href="/terms" className="hover:text-gray-300 transition-colors cursor-pointer py-1 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
