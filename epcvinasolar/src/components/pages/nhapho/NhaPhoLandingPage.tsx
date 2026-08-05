import { CheckCircle, House, Lightning, Phone } from '@phosphor-icons/react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import CalculatorSection from '../ad-landing/CalculatorSection';

export default function NhaPhoLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-emerald-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <House className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Giải Pháp Cho Nhà Phố</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Điện Mặt Trời Nhà Phố - Giảm 80% Tiền Điện
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Nhà phố, nhà ống 30-60m2 mái. Lắp hệ 3-8kWp giảm 70-90% hóa đơn điện. Thi công nhanh 1-2 ngày.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" />
                Tư Vấn Miễn Phí
              </a>
              <a href="/bao-gia-dien-mat-troi" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Báo Giá
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofSection />

      {/* Why Solar for Townhouse */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Nhà Phố Nên Lắp Điện Mặt Trời?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Hóa Đơn Điện Cao', desc: 'Nhà phố thường dùng 2-5 triệu/tháng. Điện mặt trời giảm 70-90% chi phí.' },
              { title: 'Mái Phù Hợp', desc: 'Mái 30-60m2 lý tưởng cho hệ 3-8kWp. Tận dụng không gian chết.' },
              { title: 'Hoàn Vốn Nhanh', desc: 'Chỉ 3-5 năm hoàn vốn. Sau đó tiết kiệm 20-30 năm.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-slate-50">
                <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Lightning className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Systems */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gói Phù Hợp Cho Nhà Phố</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { power: '3 kWp', price: '45-60 triệu', saving: '1-1.5 triệu/tháng', area: '15-20 m²', suitable: 'Hóa đơn 1-2 triệu' },
              { power: '5 kWp', price: '60-80 triệu', saving: '1.8-2.2 triệu/tháng', area: '25-30 m²', suitable: 'Hóa đơn 2-3 triệu', popular: true },
              { power: '8 kWp', price: '90-120 triệu', saving: '2.5-3 triệu/tháng', area: '40-50 m²', suitable: 'Hóa đơn 3-5 triệu' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">Phổ biến nhất</span></div>}
                <h3 className={`text-2xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-6 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Tiết kiệm:</strong> {item.saving}</li>
                  <li><strong>Diện tích:</strong> {item.area}</li>
                  <li><strong>Phù hợp:</strong> {item.suitable}</li>
                </ul>
                <a href="/calculator" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-orange-500 hover:bg-slate-100' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  Nhận Tư Vấn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalculatorSection onSubmit={() => {}} />

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Lợi Ích Khi Lắp Đặt</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Giảm 70-90% hóa đơn điện hàng tháng',
              'Thi công nhanh 1-2 ngày, không ảnh hưởng sinh hoạt',
              'Bảo hành 10 năm, hỗ trợ kỹ thuật trọn đời',
              'Tăng giá trị bất động sản',
              'Góp phần bảo vệ môi trường',
              'Hoàn vốn 3-5 năm, tiết kiệm 20+ năm',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Nhà Phố</h2>
          <div className="space-y-4">
            {[
              { q: 'Nhà phố mái nhỏ có lắp được điện mặt trời không?', a: 'Có. Nhà phố, nhà ống có mái 30-60m2 lắp được hệ 3-8kWp. Pin lắp sát mái, không chiếm diện tích. EPCVINA khảo sát miễn phí, tư vấn vị trí tối ưu.' },
              { q: 'Nhà phố nên lắp hệ on-grid hay hybrid?', a: 'Nếu hóa đơn 2-5 triệu/tháng, hệ on-grid 3-8kWp là đủ, hoàn vốn 3-5 năm. Nếu cần dự phòng khi mất điện, thêm pin lưu trữ hybrid. Hệ on-grid tiết kiệm chi phí nhất.' },
              { q: 'Lắp trên mái tôn được không?', a: 'Được. Mái tôn, mái ngói, mái bằng đều lắp được. Mái tôn dùng kẹp tôn, mái ngói dùng móc ngói, mái bằng dùng khung nâng. Không khoan thủng mái, không thấm dột.' },
              { q: 'Thi công có ảnh hưởng sinh hoạt không?', a: 'Không. Thi công nhanh 1-2 ngày. Không ồn, không bụi. Dây đi âm tường hoặc máng cáp. Không ảnh hưởng sinh hoạt gia đình.' },
              { q: 'Sau hoàn vốn có còn tiết kiệm không?', a: 'Có. Hệ thống hoạt động 25-30 năm. Sau hoàn vốn 3-5 năm, tiếp tục tiết kiệm 20-25 năm. Chi phí bảo trì rất thấp, chỉ vệ sinh pin 1-2 lần/năm.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-all">
                  <span className="text-lg font-semibold text-slate-900 pr-4">{faq.q}</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Khảo Sát Miễn Phí Cho Nhà Bạn</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA đánh giá miễn phí mái nhà, tư vấn giải pháp tối ưu nhất</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" />
            Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
