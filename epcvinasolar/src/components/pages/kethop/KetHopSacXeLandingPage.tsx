import { CheckCircle, Phone, Car, Lightning, Leaf, Clock, Shield, TrendDown } from '@phosphor-icons/react';

export default function KetHopSacXeLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Solar + EV Charging</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Kết Hợp Sạc Xe Điện</h1>
            <p className="text-xl text-slate-300 mb-8">Xe chạy bằng năng lượng mặt trời. Giảm 70% chi phí sạc. Sạc tại nhà - xanh &amp; tiết kiệm. Hoàn vốn 3-5 năm.</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" /> Tư Vấn Ngay
              </a>
              <a href="/sac-ev" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Giải Pháp EV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '-70%', label: 'Chi phí sạc xe' },
              { number: '0g', label: 'Khí thải CO₂' },
              { number: '3-5 năm', label: 'Hoàn vốn' },
              { number: '100%', label: 'Năng lượng sạch' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-black mb-2">{stat.number}</div>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lợi Ích */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Tại Sao Nên Kết Hợp Solar + Sạc Xe?</h2>
          <p className="text-center text-slate-600 mb-12">Xe điện + Điện mặt trời = Giải pháp di chuyển xanh &amp; tiết kiệm nhất</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: TrendDown, title: 'Giảm 70% Chi Phí Sạc', desc: 'Tự sản xuất điện từ mặt trời, sạc xe miễn phí. Giá sạc chỉ 300-500đ/km thay vì 1.500-2.500đ/km.' },
              { icon: Leaf, title: 'Không Phát Thải', desc: 'Xe chạy hoàn toàn bằng năng lượng sạch. Không CO₂, không khói bụi. Góp phần bảo vệ môi trường.' },
              { icon: Clock, title: 'Sạc Tiện Lợi', desc: 'Sạc qua đêm tại nhà, sáng đầy pin. Không cần ra trạm sạc công cộng. Kết hợp solar tự động.' },
              { icon: Shield, title: 'Hoàn Vốn Nhanh', desc: 'Hệ solar + trạm sạc hoàn vốn 3-5 năm. Sau đó tiết kiệm 20+ năm. Tăng giá trị bất động sản.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all">
                <item.icon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cách Hoạt Động */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Hệ Thống Hoạt Động Như Thế Nào?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Ban ngày', desc: 'Pin mặt trời hấp thụ ánh nắng, tạo ra điện DC. Inverter chuyển đổi thành điện AC sử dụng.', highlight: 'Sản xuất 40-60 kWh/ngày (hệ 10kWp)' },
              { step: '02', title: 'Tự dùng & Sạc xe', desc: 'Điện ưu tiên cho gia đình và trạm sạc xe. Xe sạc trực tiếp từ năng lượng mặt trời.', highlight: 'Sạc 30-50km mỗi giờ nắng' },
              { step: '03', title: 'Ban đêm', desc: 'Điện dư lưu trữ vào pin (nếu có) hoặc bán lại EVN qua đồng hồ 2 chiều.', highlight: 'Bán điện dư: 1.800-2.100đ/kWh' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-3">{item.desc}</p>
                <p className="text-sm text-green-600 font-semibold">{item.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gói Kết Hợp */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Gói Kết Hợp Solar + Sạc Xe</h2>
          <p className="text-center text-slate-600 mb-12">Chọn gói phù hợp với nhu cầu di chuyển và mức tiêu thụ điện</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { config: '5kWp + Sạc 7kW', price: '80-100 triệu', saving: '1-1.5 triệu/tháng', range: '150-200 km/tháng', suitable: 'VF3, VF5 - đi làm hàng ngày', area: '25-30 m²' },
              { config: '8kWp + Sạc 11kW', price: '130-160 triệu', saving: '2-3 triệu/tháng', range: '300-400 km/tháng', suitable: 'VF5, VF6 - gia đình', area: '40-50 m²', popular: true },
              { config: '10kWp + Sạc 22kW', price: '170-200 triệu', saving: '3-4 triệu/tháng', range: '500-700 km/tháng', suitable: 'VF8, VF9 - di chuyển nhiều', area: '55-70 m²' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.popular ? 'bg-green-600 text-white ring-4 ring-green-200' : 'bg-white border-2 border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-bold">Phổ biến nhất</span></div>}
                <h3 className={`text-xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>{item.config}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-green-600'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm mb-6 ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Tiết kiệm:</strong> {item.saving}</li>
                  <li><strong>Quãng đường:</strong> {item.range}</li>
                  <li><strong>Phù hợp:</strong> {item.suitable}</li>
                  <li><strong>Diện tích mái:</strong> {item.area}</li>
                </ul>
                <a href="/lien-he" className={`block text-center py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-green-600 hover:bg-slate-100' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  Nhận Tư Vấn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Xe Tương Thích */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tương Thích Với Xe Điện VinFast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'VinFast VF3', battery: '17.9 kWh', range: '215 km', charge: '7kW: 2h' },
              { name: 'VinFast VF5', battery: '37.9 kWh', range: '300 km', charge: '7kW: 5h' },
              { name: 'VinFast VF6', battery: '59.6 kWh', range: '399 km', charge: '11kW: 5.5h' },
              { name: 'VinFast VF8/9', battery: '82-123 kWh', range: '400-680 km', charge: '22kW: 4-5h' },
            ].map((car, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl border border-slate-200">
                <Car className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <h3 className="font-bold mb-2">{car.name}</h3>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><strong>Pin:</strong> {car.battery}</p>
                  <p><strong>Tầm xa:</strong> {car.range}</p>
                  <p><strong>Sạc:</strong> {car.charge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ví Dụ Tiết Kiệm */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ví Dụ Tiết Kiệm Thực Tế</h2>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">VF5 + Hệ 8kWp</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between"><span className="text-slate-600">Sạc tại trạm công cộng:</span><span className="font-bold">3.500đ/km</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Sạc bằng solar:</span><span className="font-bold text-green-600">~500đ/km</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Di chuyển/tháng:</span><span className="font-bold">1.000 km</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Tiết kiệm/tháng:</span><span className="font-bold text-green-600">3 triệu</span></li>
                </ul>
              </div>
              <div className="text-center flex flex-col justify-center">
                <div className="text-5xl font-black text-green-600 mb-2">36 triệu</div>
                <p className="text-lg text-slate-600 mb-4">Tiết kiệm/năm</p>
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-semibold">Hoàn vốn hệ solar: 4-5 năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Solar + Sạc Xe</h2>
          <div className="space-y-4">
            {[
              { q: 'Có cần mua thêm pin lưu trữ khi kết hợp solar + sạc xe không?', a: 'Không bắt buộc. Nếu sạc xe ban ngày (khi có nắng), điện mặt trời cấp trực tiếp cho trạm sạc. Tuy nhiên, nếu muốn sạc ban đêm, nên thêm pin lưu trữ để tối ưu. Hệ không pin lưu trữ vẫn tiết kiệm 50-70%, hệ có pin lưu trữ tiết kiệm 80-90%.' },
              { q: 'Trạm sạc 7kW hay 11kW phù hợp cho gia đình?', a: 'Trạm 7kW phù hợp VF3, VF5 - sạc qua đêm 5-6 giờ đầy. Trạm 11kW phù hợp VF6, VF8 - sạc nhanh hơn 4-5 giờ. Nếu chỉ đi làm hàng ngày (50-80km), trạm 7kW là đủ. Nếu di chuyển nhiều, chọn 11kW hoặc 22kW.' },
              { q: 'Hệ solar có đủ điện để sạc xe không?', a: 'Hệ 5kWp sản xuất 20-30 kWh/ngày - đủ sạc VF5 đi 150-200km. Hệ 8kWp sản xuất 35-50 kWh/ngày - đủ sạc VF6 đi 300-400km. Nếu dùng thêm cho gia đình, chọn hệ công suất lớn hơn.' },
              { q: 'Lắp trạm sạc tại nhà có an toàn không?', a: 'Trạm sạc Wallbox chính hãng có đầy đủ bảo vệ: quá dòng, quá nhiệt, rò điện, chống nước IP65. Lắp đặt bởi kỹ sư chuyên nghiệp, dây cáp đạt chuẩn. An toàn hơn sạc bằng ổ cắm thông thường.' },
              { q: 'Có thể lắp trạm sạc ngoài trời không?', a: 'Có. Trạm sạc Wallbox có chuẩn chống nước IP65, hoạt động tốt ngoài trời. Nên lắp ở gara, hiên nhà, hoặc tường ngoài. EPCVINA tư vấn vị trí lắp đặt tối ưu khi khảo sát.' },
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
          <h2 className="text-3xl font-bold mb-4">Xe Xanh - Năng Lượng Sạch - Tiết Kiệm Tối Đa</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, tư vấn combo solar + sạc xe tối ưu. Hotline: 0988 446 113</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" /> Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
