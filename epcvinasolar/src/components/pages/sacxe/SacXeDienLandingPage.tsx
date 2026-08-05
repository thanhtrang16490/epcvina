import { CheckCircle, Phone, Car } from '@phosphor-icons/react';
import SocialProofSection from '../ad-landing/SocialProofSection';

export default function SacXeDienLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Trạm Sạc Xe Điện Tại Nhà</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Sạc Xe Điện Tại Nhà - Xanh & Tiết Kiệm
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Lắp đặt trạm sạc Wallbox cho VF3, VF5, VF6. Kết hợp điện mặt trời giảm 50-70% chi phí sạc. Xe chạy hoàn toàn bằng năng lượng sạch.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" />
                Tư Vấn Lắp Đặt
              </a>
              <a href="/sac-ev" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Giải Pháp EV
              </a>
            </div>
          </div>
        </div>
      </section>

      <SocialProofSection />

      {/* Why House Charging */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Lắp Trạm Sạc Tại Nhà?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Tiện Lợi', desc: 'Sạc qua đêm, sáng đầy pin. Không cần ra trạm công cộng. Sẵn sàng mỗi khi cần đi.' },
              { title: 'Tiết Kiệm', desc: 'Giá điện tại nhà rẻ hơn 30-50% so với trạm công. Kết hợp solar giảm 70%.' },
              { title: 'An Toàn', desc: 'Trạm sạc chính hãng, lắp đặt chuyên nghiệp. Bảo vệ quá dòng, quá nhiệt.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-slate-50">
                <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Car className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charging Stations */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Trạm Sạc Phù Hợp</h2>
          <p className="text-center text-slate-600 mb-12">Đa dạng công suất cho mọi nhu cầu</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { power: '7 kW', price: '15-20 triệu', time: '6-8 giờ', range: '30-40 km/giờ', suitable: 'VF3, VF5' },
              { power: '11 kW', price: '20-30 triệu', time: '4-6 giờ', range: '50-60 km/giờ', suitable: 'VF5, VF6', popular: true },
              { power: '22 kW', price: '30-50 triệu', time: '2-4 giờ', range: '80-100 km/giờ', suitable: 'Tất cả xe' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-green-600 text-white ring-4 ring-green-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-semibold">Phổ biến nhất</span></div>}
                <h3 className={`text-2xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>Trạm {item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-6 ${item.popular ? 'text-white' : 'text-green-600'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Thời gian sạc:</strong> {item.time}</li>
                  <li><strong>Tốc độ:</strong> {item.range}</li>
                  <li><strong>Phù hợp:</strong> {item.suitable}</li>
                </ul>
                <a href="/calculator" className={`block text-center mt-6 py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-green-600 hover:bg-slate-100' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  Tư Vấn Lắp Đặt
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar + EV Combo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Kết Hợp Điện Mặt Trời + Trạm Sạc</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Xe Chạy Bằng Năng Lượng Mặt Trời</h3>
                <ul className="space-y-3">
                  {[
                    'Giảm 50-70% chi phí sạc xe',
                    'Sạc hoàn toàn bằng năng lượng sạch',
                    'Không phát thải carbon',
                    'Hoàn vốn trạm sạc 3-5 năm',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">-70%</div>
                <p className="text-xl text-slate-600">Chi phí sạc khi kết hợp solar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible Vehicles */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tương Thích Với</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'VinFast VF3', desc: 'Sạc 7-22kW' },
              { name: 'VinFast VF5', desc: 'Sạc 7-22kW' },
              { name: 'VinFast VF6', desc: 'Sạc 11-22kW' },
              { name: 'VinFast VF8/9', desc: 'Sạc 11-22kW' },
            ].map((car, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl">
                <Car className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <h3 className="font-bold">{car.name}</h3>
                <p className="text-sm text-slate-600">{car.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Sạc Xe Điện</h2>
          <div className="space-y-4">
            {[
              { q: 'Trạm sạc tại nhà có cần xin phép không?', a: 'Không cần xin phép. Lắp trạm sạc tại nhà là thiết bị điện gia dụng. Chỉ cần ổ cắm 16A (7kW) hoặc aptomat riêng (11-22kW). EPCVINA hỗ trợ lắp đặt trọn gói.' },
              { q: 'Sạc xe bằng năng lượng mặt trời có nhanh hơn không?', a: 'Tốc độ sạc phụ thuộc công suất trạm (7-22kW), không phụ thuộc nguồn điện. Kết hợp solar giảm chi phí điện, không giảm tốc độ sạc. Sạc 7kW: 5-6 giờ, 11kW: 4-5 giờ.' },
              { q: 'Có thể sạc nhiều xe cùng lúc không?', a: 'Có. Trạm sạc hỗ trợ load balancing, chia công suất khi sạc 2 xe. Ví dụ: 2 xe cùng sạc, mỗi xe nhận 50% công suất. Phù hợp gia đình có 2 xe điện.' },
              { q: 'Trạm sạc có tương thích với xe VinFast không?', a: 'Có. Trạm Wallbox sử dụng chuẩn Type 2 (AC) tương thích VF3, VF5, VF6, VF8, VF9. Có dây sạc đi kèm hoặc mua riêng. Cài đặt qua app, hẹn giờ sạc, giám sát từ xa.' },
              { q: 'Chi phí lắp trạm sạc bao nhiêu?', a: 'Từ 15-50 triệu tùy công suất. Trạm 7kW từ 15-20 triệu, 11kW từ 20-30 triệu, 22kW từ 30-50 triệu. Bao gồm thiết bị + lắp đặt + dây cáp. Bảo hành 2-5 năm.' },
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Lắp Trạm Sạc Tại Nhà Ngay</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, lắp đặt nhanh trong 1 ngày</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" />
            Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
