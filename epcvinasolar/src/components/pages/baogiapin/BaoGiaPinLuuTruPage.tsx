import { CheckCircle, Phone, BatteryHigh, Lightning, Shield, Clock, Medal } from '@phosphor-icons/react';

export default function BaoGiaPinLuuTruPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BatteryHigh className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Bảng Giá Pin Lưu Trữ BESS 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Báo Giá Pin Lưu Trữ BESS Chính Hãng</h1>
            <p className="text-xl text-slate-300 mb-8">
              Pin lưu trữ BYD, Pylontech, Deye chính hãng. Dung lượng 5-20kWh. Bảo hành 5-10 năm. Lắp đặt nhanh 1 ngày tại Hà Nội.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" /> Nhận Báo Giá Chi Tiết
              </a>
              <a href="/calculator" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all border border-white/20">
                Tư Vấn Miễn Phí
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Bảng Giá Pin Lưu Trữ 2026</h2>
          <p className="text-center text-slate-600 mb-12">Giá đã bao gồm thiết bị, chưa bao gồm lắp đặt và phụ kiện</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { capacity: '5 kWh', price: '35-50 triệu', brands: 'BYD, Pylontech', backup: '4-6 giờ', features: ['Phù hợp gia đình nhỏ', 'Dự phòng tải ưu tiên', 'Kết hợp hybrid 3-5kWp', 'Bảo hành 5 năm'], popular: false },
              { capacity: '10 kWh', price: '70-100 triệu', brands: 'BYD, Hubble, Pylontech', backup: '8-12 giờ', features: ['Phù hợp gia đình lớn', 'Dự phòng hầu hết tải', 'Kết hợp hybrid 5-10kWp', 'Bảo hành 5-10 năm'], popular: true },
              { capacity: '15-20 kWh', price: '100-180 triệu', brands: 'BYD, Pylontech', backup: '12-24 giờ', features: ['Phù hợp biệt thự', 'Dự phòng toàn bộ tải', 'Kết hợp hybrid 10-20kWp', 'Bảo hành 10 năm'], popular: false },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border-2 border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-4 py-1 rounded-full text-sm font-bold">Bán chạy nhất</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">Pin {item.capacity}</h3>
                <p className={`text-center text-3xl font-bold mb-2 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <p className={`text-center text-sm mb-6 ${item.popular ? 'text-white/80' : 'text-slate-500'}`}>Thương hiệu: {item.brands}</p>
                <ul className="space-y-3 mb-6">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${item.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className={`text-center text-sm mb-6 py-2 rounded-lg ${item.popular ? 'bg-white/20' : 'bg-slate-50'}`}>
                  <Clock className="w-4 h-4 inline mr-1" /> Dự phòng: <strong>{item.backup}</strong>
                </div>
                <a href="/calculator" className={`block text-center py-3 rounded-lg font-semibold transition-all ${item.popular ? 'bg-white text-orange-500 hover:bg-slate-100' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  Nhận Báo Giá Chi Tiết
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BESS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Cần Pin Lưu Trữ BESS?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Lightning, title: 'Có Điện Khi Mất Điện', desc: 'Pin tự động cấp điện cho tải ưu tiên khi mất lưới. Không gián đoạn sinh hoạt.' },
              { icon: BatteryHigh, title: 'Dùng Điện Ban Đêm', desc: 'Lưu trữ điện dư ban ngày, sử dụng vào buổi tối. Giảm mua điện từ lưới.' },
              { icon: Shield, title: 'Tự Chủ 80-90%', desc: 'Giảm phụ thuộc vào điện lưới. Tăng khả năng tự chủ năng lượng.' },
              { icon: Medal, title: 'Đầu Tư Bền Vững', desc: 'Hoàn vốn 5-7 năm. Bảo hành 5-10 năm. Tuổi thọ 15+ năm.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl">
                <item.icon className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">So Sánh Thương Hiệu Pin Lưu Trữ</h2>
          <p className="text-center text-slate-600 mb-12">Các thương hiệu pin BESS chính hãng được EPCVINA phân phối</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-4 text-left font-bold">Tiêu chí</th>
                  <th className="p-4 text-center font-bold">BYD</th>
                  <th className="p-4 text-center font-bold">Pylontech</th>
                  <th className="p-4 text-center font-bold">Deye</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { criteria: 'Công nghệ', byd: 'LFP (Lithium Iron Phosphate)', pylontech: 'LFP', deye: 'LFP' },
                  { criteria: 'Dung lượng module', byd: '5.12 kWh', pylontech: '3.55 kWh', deye: '5.12 kWh' },
                  { criteria: 'Điện áp', byd: '48V', pylontech: '48V', deye: '48V' },
                  { criteria: 'Chu kỳ sạc/xả', byd: '6000+', pylontech: '6000+', deye: '6000+' },
                  { criteria: 'Bảo hành', byd: '10 năm', pylontech: '10 năm', deye: '5 năm' },
                  { criteria: 'Xuất xứ', byd: 'Trung Quốc', pylontech: 'Trung Quốc', deye: 'Trung Quốc' },
                  { criteria: 'Tương thích', byd: 'Hybrid Deye, SMA', pylontech: 'Đa số inverter', deye: 'Deye Hybrid' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="p-4 font-semibold text-slate-700">{row.criteria}</td>
                    <td className="p-4 text-center text-slate-600">{row.byd}</td>
                    <td className="p-4 text-center text-slate-600">{row.pylontech}</td>
                    <td className="p-4 text-center text-slate-600">{row.deye}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quy Trình Lắp Đặt Pin Lưu Trữ</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Khảo sát', desc: 'Đánh giá hệ thống hiện tại, nhu cầu sử dụng' },
              { step: '2', title: 'Tư vấn', desc: 'Đề xuất dung lượng pin, vị trí lắp đặt' },
              { step: '3', title: 'Ký HĐ', desc: 'Thống nhất phương án, ký hợp đồng' },
              { step: '4', title: 'Lắp đặt', desc: 'Thi công 1 ngày, đấu nối an toàn' },
              { step: '5', title: 'Bàn giao', desc: 'Hướng dẫn sử dụng, giám sát app' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-white rounded-xl relative">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">{item.step}</div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Về Pin Lưu Trữ BESS</h2>
          <div className="space-y-4">
            {[
              { q: 'Pin lưu trữ BESS có bền không?', a: 'Pin LFP (Lithium Iron Phosphate) có tuổi thọ 15+ năm, 6000+ chu kỳ sạc/xả. Các thương hiệu BYD, Pylontech bảo hành 5-10 năm, hiệu suất vẫn đạt 80% sau 10 năm.' },
              { q: 'Pin BESS có an toàn không?', a: 'Pin LFP là công nghệ an toàn nhất hiện nay, không cháy nổ, chịu nhiệt độ cao. Có hệ thống BMS bảo vệ quá sạc, quá xả, quá nhiệt, ngắn mạch.' },
              { q: 'Có thể mở rộng dung lượng pin sau không?', a: 'Có. Hầu hết pin BESS thiết kế module, có thể lắp thêm module khi cần tăng dung lượng. Ví dụ: lắp 10kWh trước, sau đó mở rộng lên 15-20kWh.' },
              { q: 'Pin BESS có tương thích với inverter cũ không?', a: 'Phụ thuộc vào loại inverter. Pin BYD, Pylontech tương thích với đa số inverter hybrid trên thị trường. EPCVINA khảo sát miễn phí để tư vấn phương án phù hợp.' },
              { q: 'Chi phí lắp đặt pin lưu trữ bao nhiêu?', a: 'Giá pin từ 35-180 triệu tùy dung lượng. Chi phí lắp đặt, phụ kiện khoảng 5-15 triệu. EPCVINA báo giá chi tiết sau khi khảo sát miễn phí.' },
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
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tư Vấn Giải Pháp Pin Lưu Trữ</h2>
          <p className="text-xl mb-8 opacity-90">EPCVINA khảo sát miễn phí, tư vấn dung lượng pin phù hợp nhất cho gia đình bạn</p>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all">
            <Phone className="w-5 h-5" /> Gọi Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
