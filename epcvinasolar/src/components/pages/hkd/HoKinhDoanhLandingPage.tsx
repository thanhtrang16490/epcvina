import { CheckCircle, Phone, Building, TrendDown, Clock, Shield, Star, ShoppingBag, ForkKnife, Coffee, Buildings } from '@phosphor-icons/react';

export default function HoKinhDoanhLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-amber-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Giải Pháp Hộ Kinh Doanh</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Cho Hộ Kinh Doanh</h1>
            <p className="text-xl text-slate-300 mb-8">Giảm 70-90% chi phí điện. Tăng lợi nhuận. Hoàn vốn nhanh 3-4 năm. Phù hợp cửa hàng, nhà hàng, quán cafe, khách sạn.</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" /> Tư Vấn Ngay
              </a>
              <a href="/bao-gia" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Báo Giá
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '70-90%', label: 'Giảm tiền điện' },
              { number: '3-4 năm', label: 'Hoàn vốn' },
              { number: '25 năm', label: 'Tuổi thọ hệ thống' },
              { number: '0đ', label: 'Chi phí bảo trì/năm đầu' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-black mb-2">{stat.number}</div>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phù Hợp Cho */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Phù Hợp Cho Mọi Mô Hình Kinh Doanh</h2>
          <p className="text-center text-slate-600 mb-12">Bất kể mô hình kinh doanh nào, điện mặt trời đều mang lại lợi ích</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Cửa Hàng', desc: 'Giảm chi phí điện cho điều hòa, chiếu sáng, tủ lạnh. Tiết kiệm 1-3 triệu/tháng.', icon: <ShoppingBag weight="duotone" className="w-10 h-10 text-amber-600" /> },
              { title: 'Nhà Hàng', desc: 'Chi phí điện cao 3-10 triệu/tháng. Điện mặt trời giảm 70-90% hóa đơn.', icon: <ForkKnife weight="duotone" className="w-10 h-10 text-amber-600" /> },
              { title: 'Quán Cafe', desc: 'Điều hòa, máy pha cafe, chiếu sáng. Tiết kiệm 500K-2 triệu/tháng.', icon: <Coffee weight="duotone" className="w-10 h-10 text-amber-600" /> },
              { title: 'Khách Sạn', desc: 'Nước nóng, điều hòa, thang máy. Giảm 5-20 triệu tiền điện/tháng.', icon: <Buildings weight="duotone" className="w-10 h-10 text-amber-600" /> },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-amber-50 rounded-xl hover:shadow-lg transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lợi Ích */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Hộ Kinh Doanh Nên Lắp Điện Mặt Trời?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendDown, title: 'Giảm Chi Phí Vận Hành', desc: 'Điện chiếm 15-30% chi phí vận hành. Điện mặt trời giảm 70-90%, tăng lợi nhuận trực tiếp.' },
              { icon: Clock, title: 'Hoàn Vốn Nhanh', desc: 'Hộ kinh doanh dùng điện nhiều vào ban ngày → tối ưu tự dùng. Hoàn vốn chỉ 3-4 năm.' },
              { icon: Shield, title: 'Bảo Hành Dài Hạn', desc: 'Pin bảo hành 25 năm, inverter 10 năm. Không chi phí phát sinh. Bảo trì miễn phí năm đầu.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl">
                <item.icon className="w-14 h-14 mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gói Phù Hợp */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Gói Điện Mặt Trời Cho Hộ Kinh Doanh</h2>
          <p className="text-center text-slate-600 mb-12">Chọn gói phù hợp với hóa đơn điện hàng tháng của bạn</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5 kWp', price: '60-80 triệu', saving: '2-3 triệu/tháng', bill: 'Hóa đơn 2-4 triệu', area: '25-30 m²', payback: '3-4 năm' },
              { power: '10 kWp', price: '110-150 triệu', saving: '4-6 triệu/tháng', bill: 'Hóa đơn 4-8 triệu', area: '50-60 m²', payback: '3-4 năm', popular: true },
              { power: '15 kWp', price: '160-200 triệu', saving: '6-8 triệu/tháng', bill: 'Hóa đơn 8-15 triệu', area: '75-90 m²', payback: '3-5 năm' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border-2 border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-4 py-1 rounded-full text-sm font-bold">Phổ biến nhất</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm mb-6 ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Tiết kiệm:</strong> {item.saving}</li>
                  <li><strong>Phù hợp:</strong> {item.bill}</li>
                  <li><strong>Diện tích mái:</strong> {item.area}</li>
                  <li><strong>Hoàn vốn:</strong> {item.payback}</li>
                </ul>
                <a href="/lien-he" className={`block text-center py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-orange-500 hover:bg-slate-100' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  Nhận Tư Vấn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ví Dụ Tiết Kiệm Thực Tế</h2>
          <div className="bg-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Nhà hàng tại Hà Nội</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between"><span className="text-slate-600">Hóa đơn điện trước:</span><span className="font-bold">8 triệu/tháng</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Hệ lắp đặt:</span><span className="font-bold">10 kWp</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Chi phí đầu tư:</span><span className="font-bold">130 triệu</span></li>
                  <li className="flex justify-between"><span className="text-slate-600">Tiết kiệm/tháng:</span><span className="font-bold text-green-600">5.5 triệu</span></li>
                </ul>
              </div>
              <div className="text-center flex flex-col justify-center">
                <div className="text-5xl font-black text-green-600 mb-2">66 triệu</div>
                <p className="text-lg text-slate-600 mb-4">Tiết kiệm/năm</p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-semibold">Hoàn vốn: 2 năm • ROI: 50%/năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Hộ Kinh Doanh</h2>
          <div className="space-y-4">
            {[
              { q: 'Hộ kinh doanh có nên lắp điện mặt trời không?', a: 'Có. Hộ kinh doanh dùng điện nhiều vào ban ngày (điều hòa, chiếu sáng, tủ lạnh). Điện mặt trời giảm 70-90% chi phí, hoàn vốn 3-4 năm. Sau hoàn vốn tiết kiệm 20-25 năm.' },
              { q: 'Chi phí lắp cho hộ kinh doanh bao nhiêu?', a: 'Từ 60-200 triệu tùy công suất. Hệ 5kWp từ 60 triệu cho cửa hàng nhỏ, hệ 10kWp từ 110 triệu cho nhà hàng, hệ 15kWp từ 160 triệu cho khách sạn. EPCVINA báo giá chi tiết sau khảo sát miễn phí.' },
              { q: 'Có phải xin phép lắp điện mặt trời không?', a: 'Theo Nghị định 135/2024, hệ dưới 1MWp chỉ cần thông báo Điện lực địa phương. EPCVINA hỗ trợ toàn bộ thủ tục đăng ký đấu nối, lắp đồng hồ 2 chiều, bán điện dư cho EVN miễn phí.' },
              { q: 'Điện mặt trời có giảm được chi phí điều hòa không?', a: 'Có. Điều hòa chiếm 40-60% hóa đơn điện. Điện mặt trời sản xuất nhiều nhất vào giờ nắng cao - đúng lúc điều hòa hoạt động mạnh nhất. Giảm 70-90% chi phí làm mát.' },
              { q: 'Bảo hành và bảo trì như thế nào?', a: 'Pin mặt trời bảo hành 25 năm, inverter 10 năm, thi công 5 năm. Bảo trì miễn phí năm đầu. Gói O&M dài hạn từ 500K/năm. EPCVINA hỗ trợ kỹ thuật trọn đời.' },
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
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tăng Lợi Nhuận Ngay Hôm Nay</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, báo giá chi tiết trong 24h. Hotline: 0988 446 113</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" /> Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
