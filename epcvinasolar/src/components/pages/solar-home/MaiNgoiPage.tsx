import { useState } from 'react';
import { House, CheckCircle, Warning, Wrench, Phone, Shield, Clock, ArrowRight, CaretDown, CaretUp, Ruler, Drop, Sun, Wind, Lightning, Medal } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

const technicalRequirements = [
  {
    icon: Shield,
    title: 'Kết cấu & chịu lực',
    desc: 'Mái ngói có trọng lượng nặng. Khi thêm pin (30-35kg/tấm + khung đỡ), hệ xà gồ thép hoặc gỗ phải đảm bảo chịu lực bền vững. Không được làm xô lệch, rạn nứt ngói xung quanh.',
  },
  {
    icon: Drop,
    title: 'Chống thấm dột',
    desc: 'Sử dụng móc ngói Inox 304 xuyên khe ngói vào xà gồ, không khoan đục bề mặt. Bơm keo silicon + foam chống thấm vào lỗ bắt vít và khe hở. Hạ ngói về vị trí cũ khít khao, không vênh.',
  },
  {
    icon: Sun,
    title: 'Hướng & góc nghiêng',
    desc: 'Hướng lý tưởng: Nam, Đông Nam hoặc Tây Nam. Độ nghiêng tiêu chuẩn 10-15°. Tránh vùng bị che bóng bởi cây cối hoặc công trình lân cận.',
  },
  {
    icon: Wind,
    title: 'Chống gió bão',
    desc: 'Khoảng cách tối thiểu giữa tấm pin và mặt ngói: 15cm để thông thoáng, giải nhiệt. Sử dụng kẹp giữa (Mid clamp) và kẹp biên (End clamp) chịu được sức gió lớn.',
  },
];

const installSteps = [
  {
    step: 1,
    title: 'Khảo sát & chuẩn bị vật tư',
    desc: 'Đo đạc diện tích mái khả thi, kiểm tra hướng nắng, tính toán công suất (thường 3-10 kWp cho hộ gia đình). Tập kết vật tư tại khu vực khô ráo. Vận chuyển pin lên mái nhẹ nhàng, không trầy xước.',
    details: ['Đo diện tích mái & xác định hướng nắng', 'Kiểm tra xà gồ, chất lượng ngói', 'Tính toán công suất phù hợp', 'Tập kết tấm pin, inverter, tủ điện, dây cáp DC'],
  },
  {
    step: 2,
    title: 'Thi công móc ngói & khung ray',
    desc: 'Định vị điểm bắt khung, nhấc viên ngói để lộ xà gồ. Bắt móc ngói Inox 304 vào xà gồ bằng vít chuyên dụng. Bơm keo silicon + foam chống thấm. Hạ ngói về vị trí cũ, liên kết thanh ray nhôm.',
    details: ['Nhấc ngói tại vị trí bắt móc, lộ xà gồ', 'Bắt chặt móc Inox 304 vào xà gồ', 'Bơm keo silicon + foam chống thấm kép', 'Hạ ngói khít, lắp thanh ray nhôm định hình'],
  },
  {
    step: 3,
    title: 'Cố định tấm pin & đấu nối điện',
    desc: 'Đặt pin lên ray, dùng kẹp giữa và kẹp biên siết chặt. Đấu nối thành chuỗi (string) theo sơ đồ kỹ thuật. Kết nối vào inverter, tủ điện bảo vệ (CB, cầu chì, chống sét) và tiếp địa.',
    details: ['Gắn pin bằng Mid clamp + End clamp', 'Khoảng cách pin-mái tối thiểu 15cm', 'Đấu chuỗi pin theo sơ đồ kỹ thuật', 'Lắp tủ điện: CB, cầu chì, chống sét lan truyền'],
  },
  {
    step: 4,
    title: 'Kiểm tra & vận hành',
    desc: 'Đo điện áp, dòng điện từng chuỗi pin bằng đồng hồ chuyên dụng. Khởi động inverter, kết nối app giám sát qua Wi-Fi. Theo dõi sản lượng real-time và bàn giao cho gia chủ.',
    details: ['Test điện áp & dòng điện từng chuỗi', 'Khởi động inverter, kiểm tra lỗi', 'Kết nối app giám sát qua Wi-Fi', 'Bàn giao hồ sơ & hướng dẫn sử dụng'],
  },
];

const faqs = [
  {
    q: 'Mái ngói nào lắp được điện mặt trời?',
    a: 'Hầu hết các loại ngói đều lắp được: ngói sóng, ngói phẳng, ngói xi măng, ngói đất nung. Quan trọng là chất lượng ngói và xà gồ còn tốt, không mục nát hay nứt vỡ. Mái quá cũ cần cải tạo trước khi lắp.',
  },
  {
    q: 'Lắp điện mặt trời mái ngói có bị dột không?',
    a: 'Không, nếu thi công đúng kỹ thuật. EPCVINA sử dụng móc ngói Inox 304 chuyên dụng, kết hợp chống thấm kép (silicon + foam) và hạ ngói khít về vị trí cũ. Bảo hành chống thấm 5 năm.',
  },
  {
    q: 'Chi phí lắp điện mặt trời mái ngói bao nhiêu?',
    a: 'Từ 50-200 triệu tùy công suất. Chi phí khung giá đỡ mái ngói cao hơn mái tôn khoảng 10-15% do cần móc ngói chuyên dụng. Hệ 5kWp từ 55 triệu, 10kWp từ 110 triệu.',
  },
  {
    q: 'Có nên tự lắp pin mặt trời trên mái ngói?',
    a: 'Không khuyến khích. Mái ngói đòi hỏi kỹ thuật phức tạp: tháo/lắp ngói chính xác, chống thấm đúng cách, đấu nối điện an toàn. Tự thi công có nguy cơ vỡ ngói, thấm dột, chập cháy và bị từ chối bảo hành.',
  },
  {
    q: 'Bảo trì hệ thống mái ngói như thế nào?',
    a: 'Vệ sinh tấm pin 3-6 tháng/lần bằng nước sạch. Kiểm tra đầu nối MC4, tủ điện định kỳ. Giám sát qua app, nếu công suất giảm bất thường cần liên hệ kỹ thuật viên ngay.',
  },
  {
    q: 'Thời gian lắp đặt bao lâu?',
    a: 'Từ 3-5 ngày cho hệ gia đình 3-10kWp. Bao gồm: 1 ngày khảo sát, 2-3 ngày thi công, 1 ngày kiểm tra & bàn giao. Mái ngói phức tạp hơn mái tôn khoảng 1 ngày.',
  },
];

const maintenanceTips = [
  { title: 'Vệ sinh tấm pin', desc: 'Rửa bằng nước ngọt sạch 3-6 tháng/lần. Bụi bẩn, lá cây, phân chim tạo hotspot làm giảm hiệu suất.' },
  { title: 'Kiểm tra đầu nối', desc: 'Định kỳ kiểm tra jack MC4, tủ điện xem có lỏng, oxy hóa hay rò rỉ điện không.' },
  { title: 'Giám sát sản lượng', desc: 'Theo dõi biểu đồ trên app hàng ngày. Nếu công suất giảm bất thường, liên hệ kỹ thuật viên ngay.' },
  { title: 'Kiểm tra ngói', desc: 'Sau mùa mưa, kiểm tra các vị trí móc ngói xem có dịch chuyển hay thấm dột không.' },
];

export default function MaiNgoiPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <HeaderBar />
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <House className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">Giải pháp thi công mái ngói</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Lắp Điện Mặt Trời<br />Trên Mái Ngói
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mb-8">
            Giải pháp thi công chuyên nghiệp cho nhà phố, biệt thự. Giữ nguyên thẩm mỹ mái nhà, 
            chống thấm tuyệt đối, tối ưu hiệu suất phát điện.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0988446113" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Tư Vấn: 0988 446 113
            </a>
            <a href="/bao-gia-dien-mat-troi" className="bg-white text-orange-900 font-semibold px-8 py-3 rounded-lg hover:bg-amber-50 transition-all">
              Nhận Báo Giá Miễn Phí
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-slate-700 text-lg leading-relaxed">
              Mái ngói là kiến trúc đặc trưng tại Việt Nam nhờ tính thẩm mỹ cao và khả năng cách nhiệt tốt. 
              Việc kết hợp kiến trúc truyền thống với công nghệ điện mặt trời đang được nhiều gia chủ quan tâm.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              Tuy nhiên, do đặc thù kết cấu mái ngói không liền mạch như mái tôn, việc thi công đòi hỏi 
              kỹ thuật khắt khe hơn để vừa tối ưu hiệu suất, vừa bảo toàn cấu trúc ngôi nhà. 
              EPCVINA với kinh nghiệm hàng trăm công trình mái ngói sẽ tư vấn giải pháp toàn diện cho bạn.
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">30 năm</p>
              <p className="text-sm text-slate-600">Tuổi thọ hệ thống</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">5-20kWp</p>
              <p className="text-sm text-slate-600">Phù hợp nhà ở</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">3-5 ngày</p>
              <p className="text-sm text-slate-600">Thời gian thi công</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">5 năm</p>
              <p className="text-sm text-slate-600">Bảo hành chống thấm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Yêu Cầu Kỹ Thuật Đối Với Mái Ngói
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Khảo sát và đánh giá kỹ thuật trước khi thi công là bước không thể bỏ qua
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {technicalRequirements.map((req, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Phụ Kiện Lắp Đặt Chuyên Dụng
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            100% phụ kiện nhôm AL6005-T5 và Inox 304 chống ăn mòn, bền bỉ 30+ năm
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Móc ngói Inox 304', desc: 'Xuyên khe ngói vào xà gồ, không khoan đục bề mặt. Chống thấm kép với silicon + foam.' },
              { name: 'Thanh rail nhôm AL6005-T5', desc: 'Dài 2.1m, dạng chữ U, cố định trên xà gồ. Nhẹ, bền, chống ăn mòn.' },
              { name: 'Kẹp giữa (Mid clamp)', desc: 'Cố định khoảng cách giữa các tấm pin. AL6005-T5 + Inox 304, L=40mm.' },
              { name: 'Kẹp biên (End clamp)', desc: 'Cố định 2 đầu ngoài cùng của dãy pin vào rail. Siết chặt bằng bulong inox.' },
              { name: 'Thanh nối rail', desc: 'Kết nối các đoạn rail dài tạo hệ giá đỡ liên tục. AL6005-T5 + SUS304.' },
              { name: 'Keo chống thấm chuyên dụng', desc: 'Trám kín lỗ bắt vít và khe hở. Ngăn nước rỉ tuyệt đối, bền bỉ mọi thời tiết.' },
            ].map((acc, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{acc.name}</h3>
                <p className="text-xs text-slate-600">{acc.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/thiet-bi/danh-sach/mounting" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold transition-all">
              Xem chi tiết hệ khung nhôm nhôm AL6005-T5 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Quy Trình Lắp Đặt 4 Bước
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Triển khai bài bản, đúng tiêu chuẩn kỹ thuật
          </p>
          <div className="space-y-6">
            {installSteps.map((s) => (
              <div key={s.step} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
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

      {/* Why professional installation */}
      <section className="py-16 bg-red-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Có Nên Tự Lắp Đặt Tại Nhà?
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Mái ngói phức tạp hơn mái tôn, việc tự thi công tiềm ẩn nhiều rủi ro
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Risks */}
            <div className="bg-white rounded-2xl border border-red-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Warning className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-red-700">Rủi ro khi tự thi công</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Vỡ ngói hàng loạt, thấm dột khi mùa mưa đến',
                  'Đấu nối sai cực gây chập cháy, nổ inverter',
                  'Sai góc nghiêng, hướng nắng làm giảm sản lượng',
                  'Bị từ chối bảo hành thiết bị do lắp sai kỹ thuật',
                ].map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Medal className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-green-700">Lợi ích khi chọn EPCVINA</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Đội ngũ lành nghề, am hiểu kết cấu mái ngói',
                  'Bản vẽ 2D/3D tối ưu không gian & thẩm mỹ',
                  'Thiết bị chính hãng, đầy đủ CO/CQ',
                  'Bảo hành chống thấm 5 năm, bảo trì định kỳ',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Bảo Dưỡng & Vận Hành
          </h2>
          <p className="text-slate-600 text-center mb-10">
            Chăm sóc đúng cách để duy trì hiệu suất cao nhất
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
                    <CaretUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <CaretDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
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
            <a href="/giai-phap-thi-cong-mai-ton" className="bg-blue-50 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all">
              <h3 className="font-bold text-blue-800 mb-1">Điện Mặt Trời Mái Tôn</h3>
              <p className="text-sm text-slate-600">Cho nhà xưởng, nhà ở. Thi công nhanh 1-2 ngày, giảm nhiệt 2-10°C.</p>
            </a>
            <a href="/giai-phap-thi-cong-mai-bang" className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 hover:shadow-md transition-all">
              <h3 className="font-bold text-emerald-800 mb-1">Điện Mặt Trời Mái Bằng</h3>
              <p className="text-sm text-slate-600">Cho sân thượng, sàn bê tông. Góc nghiêng tùy chỉnh 5-15°.</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Lắp Điện Mặt Trời Trên Mái Ngói?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Liên hệ ngay để kỹ sư EPCVINA khảo sát miễn phí và tư vấn giải pháp tối ưu cho ngôi nhà bạn.
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
