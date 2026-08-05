import { CheckCircle, Phone, BatteryHigh, Lightning, Shield, Clock, Sun, House } from '@phosphor-icons/react';

export default function CoLuuTruLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BatteryHigh className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Hybrid Solar + Pin Lưu Trữ</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Có Lưu Trữ - Không Lo Mất Điện</h1>
            <p className="text-xl text-slate-300 mb-8">Tự chủ năng lượng 80-90%. Có điện khi mất điện lưới. Dùng điện ban đêm từ năng lượng ban ngày. Giảm 70-90% hóa đơn điện.</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" /> Tư Vấn Ngay
              </a>
              <a href="/bao-gia-pin-luu-tru" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Xem Báo Giá Pin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '80-90%', label: 'Tự chủ năng lượng' },
              { number: '0s', label: 'Chuyển mạch khi mất điện' },
              { number: '6000+', label: 'Chu kỳ sạc-xả' },
              { number: '10 năm', label: 'Bảo hành pin' },
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
          <h2 className="text-3xl font-bold text-center mb-4">Tại Sao Nên Lắp Hệ Có Lưu Trữ?</h2>
          <p className="text-center text-slate-600 mb-12">So sánh hệ on-grid thông thường và hệ hybrid có pin lưu trữ</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightning, title: 'Có Điện Khi Mất Điện', desc: 'Pin lưu trữ tự động cấp điện khi mất lưới. Chuyển mạch 0 giây - không gián đoạn sinh hoạt. Hệ on-grid thường ngừng hoạt động khi mất lưới.' },
              { icon: Sun, title: 'Dùng Điện Ban Đêm', desc: 'Lưu trữ điện dư ban ngày, sử dụng ban đêm. Không phụ thuộc điện lưới. Tối ưu tự dùng lên 80-90%.' },
              { icon: Shield, title: 'Tự Chủ Năng Lượng', desc: 'Giảm 80-90% phụ thuộc điện lưới. Bảo vệ khi giá điện tăng. An tâm trong mọi tình huống.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-all">
                <item.icon className="w-14 h-14 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So Sánh On-Grid vs Hybrid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">So Sánh Hệ On-Grid Và Hybrid</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left p-4 font-semibold">Tiêu chí</th>
                  <th className="text-center p-4 font-semibold">On-Grid</th>
                  <th className="text-center p-4 font-semibold bg-blue-700">Hybrid + Lưu Trữ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { criteria: 'Khi mất điện lưới', ongrid: 'Ngừng hoạt động', hybrid: 'Vẫn cấp điện 24/7' },
                  { criteria: 'Dùng điện ban đêm', ongrid: 'Mua từ lưới', hybrid: 'Dùng từ pin lưu trữ' },
                  { criteria: 'Tự chủ năng lượng', ongrid: '50-60%', hybrid: '80-90%' },
                  { criteria: 'Chi phí đầu tư', ongrid: 'Thấp hơn', hybrid: 'Cao hơn 40-60%' },
                  { criteria: 'Hoàn vốn', ongrid: '3-4 năm', hybrid: '5-7 năm' },
                  { criteria: 'Phù hợp', ongrid: 'Giảm tiền điện', hybrid: 'Cần dự phòng + giảm tiền điện' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-slate-900">{row.criteria}</td>
                    <td className="p-4 text-center text-slate-600">{row.ongrid}</td>
                    <td className="p-4 text-center text-blue-700 font-semibold">{row.hybrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gói Hybrid Phổ Biến */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Gói Hybrid + Lưu Trữ Phổ Biến</h2>
          <p className="text-center text-slate-600 mb-12">Chọn gói phù hợp với nhu cầu sử dụng và ngân sách</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5kWp + 5kWh', price: '120-150 triệu', saving: '2-3 triệu/tháng', backup: '4-6 giờ', area: '25-30 m²', suitable: 'Nhà dùng 2-3 triệu điện/tháng' },
              { power: '8.8kWp + 10kWh', price: '180-220 triệu', saving: '4-6 triệu/tháng', backup: '8-12 giờ', area: '45-55 m²', suitable: 'Nhà dùng 3-5 triệu điện/tháng', popular: true },
              { power: '10kWp + 15kWh', price: '250-300 triệu', saving: '6-8 triệu/tháng', backup: '12-18 giờ', area: '55-70 m²', suitable: 'Nhà dùng 5-10 triệu điện/tháng' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.popular ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 'bg-white border-2 border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-bold">Khuyên dùng</span></div>}
                <h3 className={`text-2xl font-bold text-center mb-2 ${item.popular ? 'text-white' : ''}`}>{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-blue-600'}`}>{item.price}</p>
                <ul className={`space-y-2 text-sm mb-6 ${item.popular ? 'text-white/90' : ''}`}>
                  <li><strong>Tiết kiệm:</strong> {item.saving}</li>
                  <li><strong>Dự phòng:</strong> {item.backup}</li>
                  <li><strong>Diện tích mái:</strong> {item.area}</li>
                  <li><strong>Phù hợp:</strong> {item.suitable}</li>
                </ul>
                <a href="/calculator" className={`block text-center py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-blue-600 hover:bg-slate-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Nhận Tư Vấn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thương Hiệu Pin */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Thương Hiệu Pin Lưu Trữ Chính Hãng</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { brand: 'BYD', desc: 'Pin LFP an toàn nhất thế giới. 6000+ chu kỳ. Bảo hành 10 năm. Dòng Premium HVS/HVM cho biệt thự.', capacity: '5.1-12.8 kWh', cert: 'IEC, UL certified' },
              { brand: 'Pylontech', desc: 'Module 48V dễ mở rộng. Tương thích mọi inverter. Hiệu suất 95%. Dòng US3000C/US5000 phổ biến.', capacity: '3.5-14 kWh', cert: 'CE, UN38.3' },
              { brand: 'Deye', desc: 'Pin BOS-G (LV) và BOS-P (HV). Tích hợp BMS thông minh. Tương thích inverter Deye.', capacity: '5.1-15.3 kWh', cert: 'IEC, CE certified' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-blue-600 mb-3">{item.brand}</h3>
                <p className="text-slate-600 mb-4">{item.desc}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Công suất:</strong> {item.capacity}</p>
                  <p><strong>Chứng nhận:</strong> {item.cert}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy Trình */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quy Trình Lắp Đặt</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Khảo sát', desc: 'Đánh giá mái, nhu cầu điện, vị trí lắp đặt' },
              { step: '02', title: 'Thiết kế', desc: 'Lên phương án tối ưu, bản vẽ 3D' },
              { step: '03', title: 'Thi công', desc: 'Lắp đặt 1-3 ngày, không ảnh hưởng sinh hoạt' },
              { step: '04', title: 'Đấu nối', desc: 'Đăng ký EVN, lắp đồng hồ 2 chiều' },
              { step: '05', title: 'Bàn giao', desc: 'Hướng dẫn sử dụng, giám sát app' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-14 h-14 mx-auto mb-3 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">{item.step}</div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Về Hệ Lưu Trữ</h2>
          <div className="space-y-4">
            {[
              { q: 'Pin lưu trữ dùng được bao lâu?', a: 'Pin LFP (BYD, Pylontech, Deye) có tuổi thọ 6000+ chu kỳ sạc-xả, tương đương 15-20 năm sử dụng. Sau thời gian này, dung lượng còn 80% ban đầu. Pin vẫn hoạt động nhưng hiệu suất giảm dần.' },
              { q: 'Khi mất điện, pin chuyển mạch trong bao lâu?', a: 'Hệ hybrid chuyển mạch tự động trong 0 giây (UPS mode). Các thiết bị quan trọng như tủ lạnh, router, đèn sẽ không bị gián đoạn. Không cần mua thêm UPS.' },
              { q: 'Có thể mở rộng pin lưu trữ sau không?', a: 'Có. Pin BYD, Pylontech thiết kế module, dễ dàng mở rộng bằng cách thêm module pin. Ví dụ: lắp 5kWh trước, sau mở rộng lên 10kWh. Inverter hybrid hỗ trợ mở rộng.' },
              { q: 'Hệ hybrid có đắt hơn on-grid không?', a: 'Có, đắt hơn khoảng 40-60% do thêm pin lưu trữ và inverter hybrid. Nhưng mang lại lợi ích: có điện khi mất lưới, dùng điện ban đêm, tự chủ 80-90%. Phù hợp nếu bạn cần dự phòng và muốn tối ưu tự dùng.' },
              { q: 'Pin lưu trữ có an toàn không?', a: 'Pin LFP (Lithium Sắt Photphat) an toàn nhất hiện nay. Không cháy nổ, chịu nhiệt tốt. BYD là nhà sản xuất pin lớn nhất thế giới. Tất cả pin đều có chứng nhận IEC, CE. BMS bảo vệ quá dòng, quá nhiệt, quá áp.' },
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
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Không Lo Mất Điện - Tự Chủ Năng Lượng</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, tư vấn giải pháp hybrid tối ưu. Hotline: 0988 446 113</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" /> Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
