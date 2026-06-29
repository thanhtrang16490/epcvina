/**
 * DienMatTroiGiaDinh - Landing Page Cho Quảng Cáo
 * 
 * Trang chuyên biệt để chạy quảng cáo Google Ads/Facebook Ads
 * Target: Hộ gia đình có nhu cầu lắp điện mặt trời
 * 
 * Key conversion elements:
 * - Hero section với CTA mạnh mẽ
 * - Social proof (dự án đã thực hiện)
 * - Bảng giá combo rõ ràng
 * - Form đăng ký tư vấn
 * - Trust badges (bảo hành, uy tín)
 */

import { useState } from 'react';
import {
  Sun,
  Phone,
  CheckCircle,
  TrendingDown,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Home,
  Zap,
  Battery,
  Users,
  Award,
} from 'lucide-react';

/* ─── Component Chính ─────────────────────────────────── */

export default function DienMatTroiGiaDinh() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bill: '',
    system: 'on-grid-3kw',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gửi form data đến API/Zalo
    alert('Cảm ơn! Chúng tôi sẽ liên hệ tư vấn trong 24h.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO (Above the fold - Conversion focus)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
            alt="Solar panels on residential roof"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>500+ gia đình đã tin tưởng tại Hà Nội</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Điện Mặt Trời
                <span className="block text-yellow-300">Cho Gia Đình</span>
              </h1>

              <p className="text-xl sm:text-2xl text-emerald-50 leading-relaxed">
                Tiết kiệm đến <span className="font-bold text-yellow-300">70%</span> hóa đơn điện hàng tháng. 
                Lắp đặt trong <span className="font-bold">1-2 ngày</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:0988446113"
                  className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5" />
                  Gọi Ngay: 0988 446 113
                </a>
                <a
                  href="#bang-gia"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border-2 border-white/30"
                >
                  Xem Bảng Giá
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Bảo hành 25 năm</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Lắp đặt 1-2 ngày</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Hoàn vốn 3-5 năm</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Form */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-2">Nhận Báo Giá Miễn Phí</h2>
              <p className="text-gray-600 mb-6">Tư vấn trong 24h. Không bắt buộc.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="0988 446 113"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Địa chỉ lắp đặt *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="Quận/Huyện, Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hóa đơn điện/tháng</label>
                  <select
                    value={formData.bill}
                    onChange={(e) => setFormData({...formData, bill: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  >
                    <option value="">Chọn mức hóa đơn</option>
                    <option value="1-2tr">1 - 2 triệu</option>
                    <option value="2-3tr">2 - 3 triệu</option>
                    <option value="3-5tr">3 - 5 triệu</option>
                    <option value="5tr+">Trên 5 triệu</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Nhận Báo Giá Ngay
                </button>

                <p className="text-xs text-gray-500 text-center">
                  🔒 Thông tin được bảo mật. Không spam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — WHY SOLAR (Benefits)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Điện Mặt Trời?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Đầu tư thông minh cho gia đình bạn - Tiết kiệm ngay, lợi ích lâu dài
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingDown,
                title: 'Tiết kiệm 70%',
                desc: 'Giảm hóa đơn điện hàng tháng đáng kể',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                icon: Shield,
                title: 'Bảo hành 25 năm',
                desc: 'Hiệu suất tấm pin được bảo hành chính hãng',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Home,
                title: 'Tăng giá trị nhà',
                desc: 'Tăng 5-10% giá trị bất động sản',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: Zap,
                title: 'Hoàn vốn 3-5 năm',
                desc: 'Sử dụng điện miễn phí 20+ năm sau đó',
                color: 'bg-yellow-100 text-yellow-600',
              },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 rounded-lg ${benefit.color} flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — COMBO BẢNG GIÁ
          ═══════════════════════════════════════════════════════ */}
      <section id="bang-gia" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Bảng Giá Combo Cho Gia Đình
            </h2>
            <p className="text-lg text-gray-600">
              Chọn công suất phù hợp với nhu cầu gia đình bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Combo 1: 3kW */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-all">
              <div className="bg-gray-100 px-6 py-4">
                <h3 className="text-2xl font-bold text-gray-900">On-Grid 3kW</h3>
                <p className="text-gray-600 text-sm mt-1">Phù hợp hộ gia đình nhỏ</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-4xl font-bold text-emerald-600">49 triệu</div>
                <div className="space-y-2">
                  {[
                    'Tiết kiệm 500k-1tr/tháng',
                    '6 tấm pin 550W',
                    '1 Inverter Huawei 3kW',
                    'Lắp đặt trọn gói',
                    'Bảo hành 25 năm',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="tel:0988446113"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-center transition-all"
                >
                  Tư Vấn Ngay
                </a>
              </div>
            </div>

            {/* Combo 2: 5kW (Popular) */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-emerald-500 relative">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-lg font-bold text-sm">
                PHỔ BIẾN NHẤT
              </div>
              <div className="bg-emerald-50 px-6 py-4">
                <h3 className="text-2xl font-bold text-gray-900">On-Grid 5kW</h3>
                <p className="text-gray-600 text-sm mt-1">Phù hợp hộ gia đình trung bình</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-4xl font-bold text-emerald-600">79 triệu</div>
                <div className="space-y-2">
                  {[
                    'Tiết kiệm 1-1.5tr/tháng',
                    '10 tấm pin 550W',
                    '1 Inverter Huawei 5kW',
                    'Lắp đặt trọn gói',
                    'Bảo hành 25 năm',
                    'Giám sát từ xa qua app',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="tel:0988446113"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-center transition-all"
                >
                  Tư Vấn Ngay
                </a>
              </div>
            </div>

            {/* Combo 3: 10kW Hybrid */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-all">
              <div className="bg-purple-50 px-6 py-4">
                <h3 className="text-2xl font-bold text-gray-900">Hybrid 10kW + Pin</h3>
                <p className="text-gray-600 text-sm mt-1">Có điện khi mất lưới</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-4xl font-bold text-purple-600">219 triệu</div>
                <div className="space-y-2">
                  {[
                    'Tiết kiệm 2-3tr/tháng',
                    '18 tấm pin 550W',
                    '1 Inverter Hybrid 10kW',
                    '1 Pin lưu trữ 10kWh',
                    'Lắp đặt trọn gói',
                    'Bảo hành 25 năm',
                    'Điện dự phòng 24/7',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="tel:0988446113"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg text-center transition-all"
                >
                  Tư Vấn Ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — SOCIAL PROOF (Projects)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              500+ Gia Đình Đã Tin Tưởng
            </h2>
            <p className="text-lg text-gray-600">
              Dự án thực tế đã triển khai tại Hà Nội và các tỉnh lân cận
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Anh Hùng - Long Biên',
                system: 'On-Grid 5kW',
                savings: 'Tiết kiệm 1.2tr/tháng',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
              },
              {
                name: 'Chị Mai - Cầu Giấy',
                system: 'Hybrid 10kW',
                savings: 'Tiết kiệm 2.5tr/tháng',
                image: 'https://images.unsplash.com/photo-1508514177221-188b1cf2f26f?w=600&q=80',
              },
              {
                name: 'Chú Đức - Hà Đông',
                system: 'On-Grid 3kW',
                savings: 'Tiết kiệm 800k/tháng',
                image: 'https://images.unsplash.com/photo-1545208941-e0e12a50b606?w=600&q=80',
              },
            ].map((project, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={project.image}
                  alt={`Dự án điện mặt trời ${project.name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                  <p className="text-emerald-600 font-semibold mt-1">{project.system}</p>
                  <p className="text-gray-600 text-sm mt-2">{project.savings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — TRUST BADGES
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn EPCVINA Solar?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Uy tín 10+ năm',
                desc: 'Công ty CP EPCVINA, đã thông báo Bộ Công Thương',
              },
              {
                icon: Users,
                title: '500+ khách hàng',
                desc: 'Đã lắp đặt thành công tại Hà Nội và các tỉnh',
              },
              {
                icon: Shield,
                title: 'Bảo hành 25 năm',
                desc: 'Chính hãng từ nhà sản xuất, ghi rõ trong hợp đồng',
              },
              {
                icon: Clock,
                title: 'Lắp đặt nhanh',
                desc: 'Hoàn thành trong 1-2 ngày, không ảnh hưởng sinh hoạt',
              },
            ].map((trust, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <trust.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{trust.title}</h3>
                <p className="text-gray-600">{trust.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-emerald-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bắt Đầu Tiết Kiệm Điện Ngay Hôm Nay
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Tư vấn miễn phí. Khảo sát tận nơi. Báo giá trong 24h.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0988446113"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Phone className="w-5 h-5" />
              Gọi Ngay: 0988 446 113
            </a>
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border-2 border-white/30"
            >
              Chat Zalo
            </a>
          </div>

          <p className="mt-8 text-sm text-emerald-100">
            Hoặc điền form phía trên để nhận báo giá chi tiết
          </p>
        </div>
      </section>
    </div>
  );
}
