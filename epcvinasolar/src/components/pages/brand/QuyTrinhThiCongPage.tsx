import { ClipboardCheck, Ruler, Wrench, Zap, CheckCircle, Phone, ArrowRight, Users, Clock, Shield } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Tư Vấn & Khảo Sát',
    duration: '1-2 ngày',
    desc: 'Kỹ sư đến tận nơi khảo sát mái, đo đạc, phân tích hướng nắng, đánh giá kết cấu. Tư vấn giải pháp phù hợp nhu cầu và ngân sách.',
    details: ['Khảo sát mái, hướng nhà, góc nghiêng', 'Phân tích hóa đơn điện, nhu cầu sử dụng', 'Đánh giá bóng che, vật cản', 'Tư vấn loại hệ thống phù hợp'],
    color: 'bg-blue-100 text-blue-700',
  },
  {
    step: 2,
    title: 'Thiết Kế & Báo Giá',
    duration: '2-3 ngày',
    desc: 'Thiết kế bản vẽ kỹ thuật 3D, mô phỏng sản lượng điện, lập dự toán chi tiết và gửi báo giá minh bạch.',
    details: ['Bản vẽ thiết kế 3D trên mái', 'Mô phỏng sản lượng PVSyst/Helioscope', 'Bảng dự toán chi tiết từng hạng mục', 'Phân tích ROI, thời gian hoàn vốn'],
    color: 'bg-purple-100 text-purple-700',
  },
  {
    step: 3,
    title: 'Ký Hợp Đồng',
    duration: '1 ngày',
    desc: 'Ký hợp đồng EPC rõ ràng, điều khoản minh bạch. Khách hàng đặt cọc 30% để EPCVINA tiến hành đặt hàng thiết bị.',
    details: ['Hợp đồng EPC chi tiết', 'Điều khoản thanh toán linh hoạt', 'Cam kết tiến độ & chất lượng', 'Hỗ trợ trả góp ngân hàng'],
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    step: 4,
    title: 'Cung Cấp Thiết Bị',
    duration: '3-7 ngày',
    desc: 'EPCVINA nhập thiết bị chính hãng từ nhà phân phối. Kiểm tra chất lượng (QC) trước khi vận chuyển đến công trình.',
    details: ['Thiết bị chính hãng, có CO/CQ', 'Kiểm tra QC trước khi giao', 'Vận chuyển đến công trình', 'Lưu kho an toàn, bảo hiểm đầy đủ'],
    color: 'bg-amber-100 text-amber-700',
  },
  {
    step: 5,
    title: 'Thi Công Lắp Đặt',
    duration: '3-7 ngày',
    desc: 'Đội ngũ kỹ thuật viên chuyên nghiệp thi công theo bản vẽ. Lắp đặt khung giàn, tấm pin, inverter, tủ điện, dây dẫn.',
    details: ['Lắp khung giàn & chống thấm', 'Gắn tấm pin mặt trời', 'Lắp inverter & tủ điện', 'Đi dây DC/AC, tiếp địa'],
    color: 'bg-red-100 text-red-700',
  },
  {
    step: 6,
    title: 'Kiểm Tra & Đấu Nối',
    duration: '2-3 ngày',
    desc: 'Test toàn bộ hệ thống, đo điện áp, dòng điện, kiểm tra cách điện. Đấu nối lưới EVN, lắp công tơ 2 chiều.',
    details: ['Test cách điện, tiếp địa', 'Kiểm tra chuỗi pin, inverter', 'Đấu nối lưới điện EVN', 'Lắp công tơ 2 chiều (nếu có)'],
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    step: 7,
    title: 'Nghiệm Thu & Bàn Giao',
    duration: '1 ngày',
    desc: 'Khách hàng nghiệm thu hệ thống, hướng dẫn sử dụng app giám sát, bàn giao hồ sơ hoàn công và sổ bảo hành.',
    details: ['Nghiệm thu cùng khách hàng', 'Hướng dẫn sử dụng app monitoring', 'Bàn giao hồ sơ hoàn công', 'Kích hoạt bảo hành điện tử'],
    color: 'bg-green-100 text-green-700',
  },
];

export default function QuyTrinhThiCongPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <ClipboardCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Quy Trình Thi Công</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Quy Trình Thi Công Điện Mặt Trời
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            7 bước chuyên nghiệp từ tư vấn đến bàn giao. 
            EPCVINA cam kết đúng tiến độ, đúng chất lượng, minh bạch chi phí.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">7-15 ngày</p>
              <p className="text-sm text-slate-600">Tổng thời gian thi công</p>
            </div>
            <div>
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">Đội ngũ 20+</p>
              <p className="text-sm text-slate-600">Kỹ sư, kỹ thuật viên</p>
            </div>
            <div>
              <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-600">Đúng tiến độ cam kết</p>
            </div>
            <div>
              <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">500+</p>
              <p className="text-sm text-slate-600">Công trình hoàn thành</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            7 Bước Triển Khai Chi Tiết
          </h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className={`${s.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl`}>
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                      <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{s.duration}</span>
                    </div>
                    <p className="text-slate-600 mb-4">{s.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {s.details.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Tổng Quan Tiến Độ
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            {steps.map((s) => (
              <div key={s.step} className="relative flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold">
                  {s.step}
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{s.title}</span>
                    <span className="text-sm text-blue-600">{s.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Liên hệ ngay để được khảo sát miễn phí và nhận báo giá trong 24h.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-orange-50 transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> 0988 446 113
            </a>
            <a href="/bao-gia-dien-mat-troi" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              Nhận Báo Giá <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
