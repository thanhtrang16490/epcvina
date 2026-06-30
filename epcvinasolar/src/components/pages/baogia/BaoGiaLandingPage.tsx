import { CheckCircle, Phone, Calculator } from 'lucide-react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import FAQSection from '../ad-landing/FAQSection';

export default function BaoGiaLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Báo Giá Điện Mặt Trời 2026
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Bảng giá trọn gói từ 60 triệu. Minh bạch từng hạng mục. Không phát sinh chi phí.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/calculator" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Calculator className="w-5 h-5" />
                Tính Chi Phí
              </a>
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                <Phone className="w-5 h-5" />
                0988 446 113
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofSection />

      {/* On-Grid Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Hệ On-Grid</h2>
          <p className="text-center text-slate-600 mb-12">Giảm 70-85% hóa đơn điện. Hoàn vốn 3-5 năm.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5 kWp', price: '60-80 triệu', production: '600-700 kWh/tháng', area: '25-30 m²' },
              { power: '8 kWp', price: '90-120 triệu', production: '950-1100 kWh/tháng', area: '40-50 m²' },
              { power: '10 kWp', price: '110-150 triệu', production: '1200-1400 kWh/tháng', area: '50-60 m²' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-center mb-2">{item.power}</h3>
                <p className="text-center text-3xl font-bold text-orange-500 mb-6">{item.price}</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between"><span className="text-slate-600">Sản lượng:</span><span className="font-semibold">{item.production}</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Diện tích mái:</span><span className="font-semibold">{item.area}</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Tiết kiệm/tháng:</span><span className="font-semibold text-green-600">1.8-2.2 triệu</span></li>
                </ul>
                <a href="/lien-he" className="block text-center mt-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all">
                  Nhận Báo Giá Chi Tiết
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid Pricing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Hệ Hybrid + Pin Lưu Trữ</h2>
          <p className="text-center text-slate-600 mb-12">Có điện khi mất điện. Hoàn vốn 5-7 năm.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5 kWp + 5kWh', price: '120-150 triệu', production: '600-700 kWh/tháng', backup: '4-6 giờ' },
              { power: '8.8 kWp + 10kWh', price: '180-220 triệu', production: '1000-1200 kWh/tháng', backup: '8-12 giờ', popular: true },
              { power: '10 kWp + 15kWh', price: '250-300 triệu', production: '1200-1400 kWh/tháng', backup: '12-18 giờ' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">Phổ biến nhất</span></div>}
                <h3 className={`text-2xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-6 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <ul className={`space-y-3 text-sm ${item.popular ? 'text-white/90' : ''}`}>
                  <li className="flex justify-between"><span>Sản lượng:</span><span className="font-semibold">{item.production}</span></li>
                  <li className="flex justify-between"><span>Dự phòng:</span><span className="font-semibold">{item.backup}</span></li>
                  <li className="flex justify-between"><span>Tiết kiệm/tháng:</span><span className="font-semibold">2-4 triệu</span></li>
                </ul>
                <a href="/lien-he" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-orange-500 hover:bg-slate-100' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  Nhận Báo Giá Chi Tiết
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Báo Giá Bao Gồm</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Tấm pin năng lượng mặt trời chính hãng',
              'Biến tần (Inverter) thương hiệu hàng đầu',
              'Khung giàn nhôm/inox chất lượng cao',
              'Dây cáp, tủ điện, thiết bị bảo vệ',
              'Công lắp đặt hoàn thiện',
              'Đấu nối đồng hồ 2 chiều với EVN',
              'Bảo hành 10 năm toàn hệ thống',
              'Hỗ trợ kỹ thuật trọn đời',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Nhận Báo Giá Chi Tiết</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, báo giá chi tiết trong 24h</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" />
            Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
