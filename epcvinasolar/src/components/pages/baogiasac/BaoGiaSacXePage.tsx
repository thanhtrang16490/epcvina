import { CheckCircle, Phone, Car, Lightning, Shield, Clock, Medal } from '@phosphor-icons/react';

export default function BaoGiaSacXePage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Bảng Giá Trạm Sạc Xe Điện 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Báo Giá Trạm Sạc Xe Điện Wallbox</h1>
            <p className="text-xl text-slate-300 mb-8">
              Trạm sạc chính hãng 7-22kW. Tương thích VF3, VF5, VF6, VinFast. Lắp đặt nhanh 1 ngày. Kết hợp điện mặt trời giảm 70% chi phí sạc.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" /> Nhận Báo Giá Chi Tiết
              </a>
              <a href="/sac-ev" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Giải Pháp EV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Bảng Giá Trạm Sạc 2026</h2>
          <p className="text-center text-slate-600 mb-12">Giá đã bao gồm thiết bị, chưa bao gồm lắp đặt và vật tư</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '7 kW', price: '15-20 triệu', time: '6-8 giờ', range: '30-40 km/giờ sạc', features: ['Sạc 1 pha 220V', 'Phù hợp VF3, VF5', 'Lắp đặt tại nhà', 'Bảo hành 2 năm'], suitable: 'Gia đình, sạc qua đêm', popular: false },
              { power: '11 kW', price: '20-30 triệu', time: '4-6 giờ', range: '50-60 km/giờ sạc', features: ['Sạc 3 pha 380V', 'Phù hợp VF5, VF6', 'Tích hợp solar', 'Bảo hành 2 năm'], suitable: 'Doanh nghiệp, sạc nhanh', popular: true },
              { power: '22 kW', price: '30-50 triệu', time: '2-4 giờ', range: '80-100 km/giờ sạc', features: ['Sạc 3 pha 380V', 'Phù hợp tất cả xe', 'Công suất lớn', 'Bảo hành 2 năm'], suitable: 'KCN, bãi xe, trạm sạc', popular: false },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.popular ? 'bg-green-600 text-white ring-4 ring-green-200' : 'bg-white border-2 border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-bold">Bán chạy nhất</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">Trạm {item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-2 ${item.popular ? 'text-white' : 'text-green-600'}`}>{item.price}</p>
                <p className={`text-center text-sm mb-6 ${item.popular ? 'text-white/80' : 'text-slate-500'}`}>{item.suitable}</p>
                <ul className="space-y-3 mb-6">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${item.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className={`text-sm space-y-1 mb-6 py-3 px-4 rounded-lg ${item.popular ? 'bg-white/20' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Thời gian sạc: <strong>{item.time}</strong></div>
                  <div className="flex items-center gap-2"><Lightning className="w-4 h-4" /> Tốc độ: <strong>{item.range}</strong></div>
                </div>
                <a href="/lien-he" className={`block text-center py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-green-600 hover:bg-slate-100' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  Nhận Báo Giá Chi Tiết
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why House Charging */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Lắp Trạm Sạc Tại Nhà?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Car, title: 'Tiện Lợi', desc: 'Sạc qua đêm, sáng đầy pin. Không cần ra trạm công cộng. Sẵn sàng mỗi khi cần đi.' },
              { icon: Lightning, title: 'Tiết Kiệm 70%', desc: 'Kết hợp điện mặt trời giảm 50-70% chi phí sạc. Giá điện rẻ hơn trạm công cộng.' },
              { icon: Shield, title: 'An Toàn', desc: 'Trạm chính hãng, bảo vệ quá dòng, quá nhiệt, rò điện. Lắp đặt chuyên nghiệp.' },
              { icon: Medal, title: 'Đầu Tư Hiệu Quả', desc: 'Hoàn vốn 3-5 năm. Tăng giá trị bất động sản. Xu hướng tất yếu.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl">
                <item.icon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatible Vehicles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Tương Thích Với Xe Điện</h2>
          <p className="text-center text-slate-600 mb-12">Trạm sạc EPCVINA tương thích với tất cả xe điện phổ biến tại Việt Nam</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'VinFast VF3', type: 'AC Type 2', power: '7-22 kW' },
              { name: 'VinFast VF5', type: 'AC Type 2', power: '7-22 kW' },
              { name: 'VinFast VF6', type: 'AC Type 2', power: '11-22 kW' },
              { name: 'VinFast VF8/9', type: 'AC Type 2', power: '11-22 kW' },
            ].map((car, i) => (
              <div key={i} className="text-center p-6 bg-slate-50 rounded-xl">
                <Car className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <h3 className="font-bold mb-1">{car.name}</h3>
                <p className="text-xs text-slate-500">{car.type} • {car.power}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar + EV Combo */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Kết Hợp Điện Mặt Trời + Trạm Sạc</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6">Xe Chạy Bằng Năng Lượng Mặt Trời</h3>
              <ul className="space-y-4">
                {[
                  { text: 'Giảm 50-70% chi phí sạc xe', highlight: true },
                  { text: 'Sạc hoàn toàn bằng năng lượng sạch, không phát thải' },
                  { text: 'Tự động ưu tiên sạc xe khi dư điện mặt trời' },
                  { text: 'Hoàn vốn trạm sạc 3-5 năm', highlight: true },
                  { text: 'Bảo vệ môi trường, giảm carbon' },
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 ${item.highlight ? 'font-semibold' : ''}`}>
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl">
              <div className="text-7xl font-black text-green-600 mb-2">-70%</div>
              <p className="text-xl text-slate-600 mb-4">Chi phí sạc khi kết hợp solar</p>
              <a href="/dien-mat-troi-ket-hop-sac-xe-dien" className="inline-block bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-all">
                Xem Giải Pháp Kết Hợp →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Về Trạm Sạc Xe Điện</h2>
          <div className="space-y-4">
            {[
              { q: 'Lắp trạm sạc tại nhà có phức tạp không?', a: 'Không. EPCVINA khảo sát miễn phí, lắp đặt nhanh trong 1 ngày. Trạm 7kW chỉ cần ổ cắm 220V. Trạm 11-22kW cần nguồn 3 pha 380V.' },
              { q: 'Trạm sạc có tương thích với xe VinFast không?', a: 'Có. Trạm sạc EPCVINA sử dụng chuẩn AC Type 2, tương thích với tất cả xe VinFast VF3, VF5, VF6, VF8, VF9 và xe điện nhập khẩu.' },
              { q: 'Chi phí sạc xe tại nhà bao nhiêu?', a: 'Trung bình 300-500đ/km với điện lưới, giảm còn 100-200đ/km khi kết hợp điện mặt trời. Rẻ hơn 50-70% so với trạm công cộng.' },
              { q: 'Có cần xin phép lắp trạm sạc không?', a: 'Không cần xin phép cho trạm sạc gia đình công suất dưới 22kW. Chỉ cần nguồn điện phù hợp (1 pha hoặc 3 pha).' },
              { q: 'Bảo hành trạm sạc bao lâu?', a: 'Trạm sạc chính hãng bảo hành 2 năm. EPCVINA hỗ trợ kỹ thuật trọn đời, bảo trì định kỳ miễn phí năm đầu.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-100 transition-all">
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
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, lắp đặt nhanh trong 1 ngày. Hotline: 0988 446 113</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" /> Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
