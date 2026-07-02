import { CheckCircle, BatteryHigh, Lightning, Shield, Phone } from '@phosphor-icons/react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import FAQSection from '../ad-landing/FAQSection';

export default function BESSLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BatteryHigh className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Hệ Thống Pin Lưu Trữ BESS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Lưu Trữ Năng Lượng - Tự Chủ Điện Năng
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Pin BESS lưu trữ điện dư thừa từ hệ mặt trời. Có điện khi mất điện lưới, dùng điện vào ban đêm. Hoàn vốn 5-7 năm.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" />
                Gọi Ngay: 0988 446 113
              </a>
              <a href="/bao-gia-dien-mat-troi" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Báo Giá
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofSection />

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Cần Pin Lưu Trữ BESS?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightning, title: 'Có Điện Khi Mất Điện', desc: 'Không bị gián đoạn khi lưới điện gặp sự cố. Pin BESS tự động cấp điện cho tải ưu tiên.' },
              { icon: BatteryHigh, title: 'Dùng Điện Ban Đêm', desc: 'Lưu trữ điện dư ban ngày, sử dụng vào buổi tối. Giảm mua điện từ lưới.' },
              { icon: Shield, title: 'Tự Chủ Năng Lượng', desc: 'Giảm phụ thuộc vào điện lưới. Tăng khả năng tự chủ lên 80-90%.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-slate-50">
                <item.icon className="w-14 h-14 mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Bảng Giá Pin Lưu Trữ BESS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { capacity: '5 kWh', price: '35-50 triệu', features: ['Phù hợp gia đình nhỏ', 'Dự phòng 4-6 giờ', 'Bảo hành 5 năm'] },
              { capacity: '10 kWh', price: '70-100 triệu', features: ['Phù hợp gia đình lớn', 'Dự phòng 8-12 giờ', 'Bảo hành 5 năm'], popular: true },
              { capacity: '15 kWh', price: '100-150 triệu', features: ['Phù hợp biệt thự', 'Dự phòng 12-18 giờ', 'Bảo hành 5 năm'] },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">Phổ biến nhất</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">Pin {item.capacity}</h3>
                <p className={`text-center text-3xl font-bold mb-6 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <ul className="space-y-3">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${item.popular ? 'text-white' : 'text-green-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/lien-he" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-orange-500 hover:bg-slate-100' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  Tư Vấn Miễn Phí
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Thương Hiệu Pin Hàng Đầu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'BYD', desc: 'Pin Lithium Iron Phosphate' },
              { name: 'Pylontech', desc: 'Pin hiệu suất cao' },
              { name: 'Hubble', desc: 'Pin module linh hoạt' },
              { name: 'Deye', desc: 'Pin tích hợp biến tần' },
            ].map((brand, i) => (
              <div key={i} className="text-center p-6 bg-slate-50 rounded-xl">
                <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                <p className="text-sm text-slate-600">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tư Vấn Giải Pháp Lưu Trữ</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, tư vấn giải pháp pin BESS phù hợp nhất</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" />
            Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
