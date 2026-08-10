import { CheckCircle, Phone, Diamond } from '@phosphor-icons/react';
import SocialProofSection from '../ad-landing/SocialProofSection';

export default function BietThuLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Giải Pháp Cao Cấp Cho Biệt Thự</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Điện Mặt Trời Biệt Thự - Sang Trọng & Tiết Kiệm
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Hệ Hybrid cao cấp, thẩm mỹ kiến trúc. Giảm 70-90% hóa đơn điện 5-20 triệu. Có điện khi mất điện.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" />
                Tư Vấn Cao Cấp
              </a>
              <a href="/calculator" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Tính Chi Phí Nhanh
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofSection />

      {/* Why Villa Solar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Biệt Thự Nên Lắp Điện Mặt Trời?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Hóa Đơn Cao', desc: 'Biệt thự dùng 5-20 triệu/tháng. Hệ 10-20kWp giảm 70-90% chi phí điện.' },
              { title: 'Mái Rộng', desc: 'Mái 100-300m2 lý tưởng cho hệ công suất lớn. Tận dụng không gian hiệu quả.' },
              { title: 'Thẩm Mỹ', desc: 'Pin all-black sang trọng. Lắp đặt chuyên nghiệp, đảm bảo kiến trúc biệt thự.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-slate-50">
                <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Diamond className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Systems */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Gói Cao Cấp Cho Biệt Thự</h2>
          <p className="text-center text-slate-600 mb-12">Hệ Hybrid + Pin lưu trữ - Tự chủ năng lượng, sang trọng</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { power: '10 kWp + 10kWh', price: '200-250 triệu', saving: '3-4 triệu/tháng', backup: '8-12 giờ' },
              { power: '15 kWp + 15kWh', price: '300-380 triệu', saving: '4-6 triệu/tháng', backup: '12-18 giờ', popular: true },
              { power: '20 kWp + 20kWh', price: '400-500 triệu', saving: '6-8 triệu/tháng', backup: '18-24 giờ' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white ring-4 ring-purple-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">Khuyên dùng</span></div>}
                <h3 className={`text-2xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-6 ${item.popular ? 'text-white' : 'text-purple-600'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Tiết kiệm:</strong> {item.saving}</li>
                  <li><strong>Dự phòng:</strong> {item.backup}</li>
                  <li><strong>Hoàn vốn:</strong> 4-6 năm</li>
                </ul>
                <a href="/calculator" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-purple-600 hover:bg-slate-100' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  Tư Vấn Riêng
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tiêu Chuẩn Cao Cấp</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Pin all-black thẩm mỹ cao, bảo hành 25 năm',
              'Biến tần Hybrid cao cấp Deye, SMA',
              'Pin lưu trữ BYD, Pylontech chính hãng',
              'Lắp đặt hidden hoặc flush-mount',
              'Giám sát online qua app điện thoại',
              'Bảo hành 10 năm, hỗ trợ VIP 24/7',
              'Khảo sát thiết kế 3D miễn phí',
              'Đội kỹ sư chuyên nghiệp 10+ năm',
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
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Biệt Thự</h2>
          <div className="space-y-4">
            {[
              { q: 'Biệt thự nên lắp hệ on-grid hay hybrid?', a: 'Nếu hóa đơn điện 5-20 triệu/tháng và cần dự phòng khi mất điện, nên lắp hệ hybrid + pin lưu trữ. Nếu chỉ muốn giảm tiền điện, hệ on-grid đủ dùng. Biệt thự thường có mái rộng 100-300m2, lý tưởng cho hệ 10-20kWp.' },
              { q: 'Pin all-black là gì? Có khác gì pin thường?', a: 'Pin all-black có khung đen, cell đen, thẩm mỹ cao hơn pin thường (khung bạc, cell xanh). Hiệu suất tương đương nhưng phù hợp biệt thự sang trọng. Giá cao hơn 10-15%. Bảo hành 25 năm như pin thường.' },
              { q: 'Lắp điện mặt trời có ảnh hưởng kiến trúc biệt thự không?', a: 'Không. EPCVINA thiết kế 3D trước khi lắp. Pin lắp sát mái, dây đi âm. Có thể lắp hidden-mount (giấu khung) hoặc flush-mount (ốp sát). Đảm bảo thẩm mỹ kiến trúc biệt thự.' },
              { q: 'Chi phí lắp cho biệt thự bao nhiêu?', a: 'Từ 200-500 triệu tùy công suất. Hệ 10kWp+10kWh từ 200 triệu, hệ 15kWp+15kWh từ 300 triệu, hệ 20kWp+20kWh từ 400 triệu. EPCVINA báo giá chi tiết sau khảo sát miễn phí.' },
              { q: 'Có thể giám sát hệ thống từ xa không?', a: 'Có. Tất cả hệ đều có app giám sát online. Theo dõi sản xuất điện, tiêu thụ, pin lưu trữ qua điện thoại. Cảnh báo sự cố tự động. Hỗ trợ kỹ thuật từ xa.' },
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
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tư Vấn Giải Pháp Riêng Cho Biệt Thự</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, thiết kế giải pháp tối ưu cho biệt thự của bạn</p>
          <a href="/bao-gia" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" />
            Nhận Báo Giá
          </a>
        </div>
      </section>
    </div>
  );
}
