import { useState } from 'react';
import { Factory, CheckCircle, AlertTriangle, Wrench, Phone, Shield, Clock, ArrowRight, ChevronDown, ChevronUp, Ruler, Droplets, Sun, Wind, Zap, Award, Thermometer } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Tận dụng không gian, tiết kiệm điện',
    desc: 'Biến diện tích mái trống thành nhà máy phát điện. Cắt giảm 70-90% chi phí điện hàng tháng, tự cung cấp điện khi cúp lưới.',
  },
  {
    icon: Thermometer,
    title: 'Giảm nóng, làm mát công trình',
    desc: 'Tấm pin hấp thụ và phản xạ nhiệt, giảm nhiệt độ bên dưới 2-10°C. Đặc biệt hiệu quả cho nhà xưởng, kho hàng.',
  },
  {
    icon: Shield,
    title: 'Bảo vệ mái tôn, chống bão',
    desc: 'Hệ khung đỡ kẹp chặt mái tôn, tăng độ bền, ngăn mái bị xô lệch khi gió bão. Trọng lượng pin phân bố đều giúp gia cố kết cấu.',
  },
  {
    icon: Award,
    title: 'Thẩm mỹ hiện đại, tăng giá trị',
    desc: 'Hệ thống pin mặt trời tạo vẻ hiện đại cho công trình. Nâng cao giá trị bất động sản và hình ảnh doanh nghiệp xanh.',
  },
];

const technicalRequirements = [
  {
    icon: Ruler,
    title: 'Loại mái tôn phù hợp',
    desc: 'Lắp được trên mọi loại tôn: tôn sóng vuông, tôn standing seam, tôn sóng tròn. Độ dày tối thiểu 0.4mm. Mái cũ cần kiểm tra khả năng chịu lực.',
  },
  {
    icon: Droplets,
    title: 'Chống thấm tại điểm bắt vít',
    desc: 'Sử dụng chân L mái tôn kèm ron cao su và vít chuyên dụng. Bơm keo silicon chống thấm tại mọi vị trí bắt vít. Lắp tấm flashing ngăn nước rỉ.',
  },
  {
    icon: Sun,
    title: 'Hướng & góc nghiêng tối ưu',
    desc: 'Hướng tốt nhất: Nam, Đông Nam, Tây Nam. Lắp song song với mái, cách bề mặt tối thiểu 15cm để thông gió. Khoảng cách giữa các tấm: 1cm.',
  },
  {
    icon: Wind,
    title: 'Chịu gió & chống rung lắc',
    desc: 'Khung nhôm AL6005-T5 chịu lực, chống ăn mòn. Kẹp giữa + kẹp biên Inox 304 cố định pin. Hệ thống chịu được gió cấp 12 (trên 100 km/h).',
  },
];

const accessories = [
  { name: 'Thanh rail nhôm AL6005-T5', desc: 'Dài 2.1m, dạng chữ U, bắt trực tiếp vào mái tôn. Nhẹ, bền, chống ăn mòn.' },
  { name: 'Chân L mái tôn + ron cao su', desc: 'Cố định rail vào xà gồ, kèm vít bắn tôn. Chống thấm tại điểm bắt vít.' },
  { name: 'Kẹp giữa (Mid clamp)', desc: 'Cố định khoảng cách giữa các tấm pin. AL6005-T5 + Inox 304, L=40mm.' },
  { name: 'Kẹp biên (End clamp)', desc: 'Cố định 2 đầu ngoài cùng của dãy pin vào rail. Siết chặt bằng bulong inox.' },
  { name: 'Thanh nối rail', desc: 'Kết nối các đoạn rail dài tạo hệ giá đỡ liên tục. AL6005-T5 + SUS304, 20cm.' },
  { name: 'Bát Z (thay thế rail)', desc: 'Hệ giá đỡ thông minh, giảm thời gian thi công. Phù hợp mái tôn sóng vuông.' },
];

const installSteps = [
  {
    step: 1,
    title: 'Chuẩn bị & khảo sát',
    desc: 'Xác định loại hệ thống (hòa lưới/hybrid/độc lập), công nghệ pin, tính toán công suất. Khảo sát hiện trường: hướng mái, độ dốc, bóng che, kết cấu xà gồ.',
    details: ['Đo diện tích mái khả thi', 'Kiểm tra kết cấu xà gồ, độ chịu lực', 'Xác định hướng nắng & bóng che', 'Tính toán công suất (3kWp-1MWp+)'],
  },
  {
    step: 2,
    title: 'Lắp giàn đỡ & chống thấm',
    desc: 'Bố trí thanh giá đỡ, chân L. Bắt vít bắn tôn cố định vào xà gồ. Bơm keo silicon chống thấm tại mọi vị trí bắt vít. Lắp tấm flashing ngăn nước.',
    details: ['Bố trí chân L theo khoảng cách thiết kế', 'Bắn vít cố định vào xà gồ thép', 'Bơm keo silicon chống thấm từng điểm vít', 'Lắp thanh rail nhôm, kiểm tra độ phẳng'],
  },
  {
    step: 3,
    title: 'Lắp tấm pin & đấu nối điện',
    desc: 'Đặt pin lên giàn đỡ (cách mái ≥15cm, cách nhau ≥1cm). Siết chặt bằng kẹp giữa + kẹp biên. Đi dây DC trong máng cáp, đấu nối vào inverter và tủ điện bảo vệ.',
    details: ['Đặt pin: cách mái 15cm, cách nhau 1cm', 'Siết kẹp giữa + kẹp biên bằng bulong inox', 'Đi dây DC, lắp máng cáp cách điện', 'Đấu nối inverter, tủ điện (CB, chống sét)'],
  },
  {
    step: 4,
    title: 'Nghiệm thu & vận hành',
    desc: 'Kiểm tra toàn bộ hệ thống: điện áp, dòng điện, cách điện. Khởi động inverter, kết nối app giám sát Wi-Fi. Theo dõi ổn định và bàn giao cho khách hàng.',
    details: ['Test điện áp & dòng điện từng chuỗi pin', 'Kiểm tra cách điện, tiếp địa', 'Khởi động inverter, kết nối app giám sát', 'Bàn giao hồ sơ hoàn công & bảo hành'],
  },
];

const maintenanceTips = [
  { title: 'Vệ sinh tấm pin', desc: 'Rửa bằng nước sạch 3-6 tháng/lần. Bụi bẩn làm giảm 5-15% hiệu suất. Tránh rửa lúc nắng nóng.' },
  { title: 'Kiểm tra ốc vít', desc: 'Mỗi 6-12 tháng kiểm tra ốc vít, khung giàn xem có lỏng hay rỉ sét không. Siết lại nếu cần.' },
  { title: 'Kiểm tra chống thấm', desc: 'Sau mùa mưa, kiểm tra các điểm bắt vít, tấm flashing xem có thấm dột không. Bơm lại keo silicon nếu cần.' },
  { title: 'Giám sát sản lượng', desc: 'Theo dõi app hàng ngày. Nếu công suất giảm bất thường >15%, liên hệ kỹ thuật viên kiểm tra.' },
];

const faqs = [
  {
    q: 'Mái tôn nào lắp được điện mặt trời?',
    a: 'Hầu hết mọi loại tôn đều lắp được: tôn sóng vuông, standing seam, tôn sóng tròn. Độ dày tối thiểu 0.4mm. Mái tôn cũ cần kiểm tra kết cấu xà gồ trước khi lắp.',
  },
  {
    q: 'Lắp pin mặt trời mái tôn có bị dột không?',
    a: 'Không, nếu dùng chân L kèm ron cao su và bơm keo silicon chống thấm đúng kỹ thuật. EPCVINA bảo hành chống thấm 5 năm cho mọi công trình mái tôn.',
  },
  {
    q: 'Chi phí lắp điện mặt trời mái tôn bao nhiêu?',
    a: 'Mái tôn có chi phí lắp đặt thấp nhất trong các loại mái. Hệ 3kWp từ 40 triệu, 5kWp từ 60 triệu, 10kWp từ 110 triệu. Hoàn vốn 3-5 năm.',
  },
  {
    q: 'Mái tôn có giảm nhiệt độ bên trong không?',
    a: 'Có. Tấm pin hấp thụ và phản xạ nhiệt, giảm nhiệt độ bên dưới 2-10°C. Đặc biệt hiệu quả cho nhà xưởng, giúp tiết kiệm chi phí điều hòa.',
  },
  {
    q: 'Hệ thống chịu được gió bão cấp mấy?',
    a: 'Khung nhôm AL6005-T5 + kẹp Inox 304 chịu được gió cấp 12 (trên 100 km/h). EPCVINA tính toán chịu lực theo tiêu chuẩn TCVN cho từng khu vực.',
  },
  {
    q: 'Thời gian lắp đặt mái tôn bao lâu?',
    a: 'Nhanh nhất trong các loại mái. 1-2 ngày cho hộ gia đình 3-10kWp. 3-7 ngày cho nhà xưởng 50-200kWp. Mái tôn không cần tháo/lắp phức tạp như mái ngói.',
  },
];

export default function MaiTonPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Factory className="w-5 h-5 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Giải pháp thi công mái tôn</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Lắp Điện Mặt Trời<br />Trên Mái Tôn
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            Giải pháp phổ biến nhất cho nhà ở và nhà xưởng. Lắp đặt nhanh chóng, 
            chống thấm tuyệt đối, giảm nhiệt độ 2-10°C, tiết kiệm 70-90% chi phí điện.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0988446113" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Tư Vấn: 0988 446 113
            </a>
            <a href="/bao-gia-dien-mat-troi" className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all">
              Nhận Báo Giá Miễn Phí
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Tại Sao Nên Lắp Điện Mặt Trời Trên Mái Tôn?
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Mái tôn là bề mặt lý tưởng nhất cho điện mặt trời: thi công nhanh, chi phí thấp, hiệu quả cao
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">1-2 ngày</p>
              <p className="text-sm text-slate-600">Thi công hộ gia đình</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">70-90%</p>
              <p className="text-sm text-slate-600">Tiết kiệm tiền điện</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">2-10°C</p>
              <p className="text-sm text-slate-600">Giảm nhiệt bên dưới</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">3-5 năm</p>
              <p className="text-sm text-slate-600">Thời gian hoàn vốn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Yêu Cầu Kỹ Thuật Khi Lắp Trên Mái Tôn
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Tuân thủ nguyên tắc kỹ thuật đảm bảo an toàn và hiệu suất tối đa
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {technicalRequirements.map((req, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <req.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{req.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{req.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Phụ Kiện Lắp Đặt Chuyên Dụng
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            100% phụ kiện nhôm AL6005-T5 và Inox 304 chống ăn mòn, bền bỉ 30+ năm
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessories.map((acc, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{acc.name}</h3>
                <p className="text-xs text-slate-600">{acc.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/thiet-bi/mounting" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all">
              Xem chi tiết hệ khung nhôm nhôm AL6005-T5 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Quy Trình Lắp Đặt 4 Bước
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Thi công bài bản, đúng tiêu chuẩn kỹ thuật, an toàn tuyệt đối
          </p>
          <div className="space-y-6">
            {installSteps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
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

      {/* Maintenance */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Bảo Dưỡng Để Hệ Thống Bền Lâu
          </h2>
          <p className="text-slate-600 text-center mb-10">
            Chăm sóc định kỳ giúp duy trì hiệu suất cao nhất trong 30+ năm
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {maintenanceTips.map((tip, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-slate-600">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-all"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Giải Pháp Thi Công Khác
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href="/giai-phap-thi-cong-mai-ngoi" className="bg-amber-50 rounded-xl p-5 border border-amber-200 hover:shadow-md transition-all">
              <h3 className="font-bold text-amber-800 mb-1">Điện Mặt Trời Mái Ngói</h3>
              <p className="text-sm text-slate-600">Cho nhà phố, biệt thự. Móc ngói Inox 304, chống thấm kép.</p>
            </a>
            <a href="/giai-phap-thi-cong-mai-bang" className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 hover:shadow-md transition-all">
              <h3 className="font-bold text-emerald-800 mb-1">Điện Mặt Trời Mái Bằng</h3>
              <p className="text-sm text-slate-600">Cho sân thượng, sàn bê tông. Góc nghiêng tùy chỉnh 5-15°.</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Lắp Điện Mặt Trời Trên Mái Tôn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Liên hệ ngay để kỹ sư EPCVINA khảo sát miễn phí. Thi công nhanh 1-2 ngày, bảo hành chống thấm 5 năm.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2">
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
