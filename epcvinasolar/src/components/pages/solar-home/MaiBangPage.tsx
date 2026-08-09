import { useState } from 'react';
import { Building, CheckCircle, Warning, Wrench, Phone, Shield, ArrowRight, CaretDown, CaretUp, Ruler, Drop, Sun, Wind, Lightning, Medal, Mountains, Stack } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

const benefits = [
  {
    icon: Mountains,
    title: 'Góc nghiêng tùy chỉnh tối ưu',
    desc: 'Không bị phụ thuộc vào độ dốc có sẵn. Chủ động thiết kế giàn giá đỡ nghiêng 5-15° theo hướng Nam, Đông Nam — đạt hiệu suất phát điện cao nhất.',
  },
  {
    icon: Stack,
    title: 'Nền tảng vững chắc nhất',
    desc: 'Sàn bê tông cung cấp nền tảng cơ học vững chắc nhất. Hệ thống chịu được gió bão cấp 12, tuổi thọ kéo dài hàng chục năm.',
  },
  {
    icon: Shield,
    title: '2 phương án lắp đặt linh hoạt',
    desc: 'Khoan bắt trực tiếp (ổn định tối đa) hoặc hệ dằn tải (không khoan đục, bảo vệ chống thấm nguyên thủy). Phù hợp mọi yêu cầu công trình.',
  },
  {
    icon: Medal,
    title: 'Tận dụng không gian sân thượng',
    desc: 'Biến sân thượng/sân bê tông trống thành nhà máy phát điện. Không ảnh hưởng không gian sinh hoạt bên dưới, lý tưởng cho nhà phố, biệt thự.',
  },
];

const technicalRequirements = [
  {
    icon: Ruler,
    title: 'Độ nghiêng tối thiểu 5-10°',
    desc: 'Lắp phẳng 0° gây tổn thất năng lượng, tích tụ bụi bẩn giảm 10-30% sản lượng. Khung giá đỡ nghiêng 5-15° đảm bảo tự làm sạch khi mưa và hấp thụ nắng tối đa.',
  },
  {
    icon: Drop,
    title: 'Chống thấm tuyệt đối',
    desc: 'Mọi điểm khoan neo đều được trám keo chống thấm chuyên dụng. Hệ dằn tải không cần khoan — bảo vệ 100% lớp chống thấm nguyên thủy của sàn.',
  },
  {
    icon: Wind,
    title: 'Tính toán chịu lực gió',
    desc: 'Mái bằng chịu hiệu ứng đường hầm gió mạnh hơn. Hệ khung + dằn tải được thiết kế chuyên nghiệp theo TCVN cho vị trí và hình học cụ thể, chịu bão 50 năm.',
  },
  {
    icon: Sun,
    title: 'Tránh bóng che thiết bị',
    desc: 'Khảo sát vị trí thiết bị trên mái (HVAC, bồn nước, ống khói). Bố trí pin tránh bóng che — chỉ 1 tấm bị che có thể giảm sản lượng cả chuỗi.',
  },
];

const installMethods = [
  {
    name: 'Khoan bắt trực tiếp',
    desc: 'Phù hợp sàn thông thường, độ ổn định tối đa.',
    pros: ['Chịu gió cực tốt, ổn định cao', 'Chi phí vật tư thấp hơn', 'Phù hợp mọi loại sàn bê tông'],
    cons: ['Cần xử lý chống thấm kỹ tại điểm khoan', 'Ảnh hưởng lớp chống thấm nếu không đúng kỹ thuật'],
  },
  {
    name: 'Hệ dằn tải (Ballast)',
    desc: 'Phù hợp sàn cần bảo vệ chống thấm tuyệt đối.',
    pros: ['Không khoan đục, bảo vệ 100% chống thấm', 'Lắp đặt nhanh, dễ tháo dỡ', 'Chịu gió tốt nhờ khối bê tông đối trọng'],
    cons: ['Trọng lượng lớn hơn, cần kiểm tra kết cấu sàn', 'Chi phí vật tư cao hơn (khối bê tông đúc sẵn)'],
  },
];

const installSteps = [
  {
    step: 1,
    title: 'Chuẩn bị & thiết kế hệ thống',
    desc: 'Lựa chọn pin Mono PERC hoặc Bifacial chất lượng cao. Tính toán hướng lắp (ưu tiên hướng Nam), góc nghiêng tối ưu 5-15°. Khảo sát hiện trường: đo diện tích, kiểm tra bóng che, đánh giá kết cấu sàn.',
    details: ['Chọn pin: Mono PERC / Bifacial / TopCon', 'Tính toán công suất & số lượng pin', 'Xác định hướng Nam/Đông Nam tối ưu', 'Đánh giá kết cấu sàn bê tông'],
  },
  {
    step: 2,
    title: 'Xác định vị trí & đánh dấu',
    desc: 'Khảo sát mặt bằng, đặt khung giá đỡ và đánh dấu chính xác vị trí khoan. Kiểm tra kỹ bên dưới bề mặt khoan không có cáp điện ngầm hay đường ống nước.',
    details: ['Dọn dẹp mặt bằng, loại bỏ rong rêu', 'Đánh dấu vị trí chân đỡ theo bản vẽ', 'Kiểm tra không có ống nước/cáp ngầm bên dưới', 'Xác định khoảng cách giữa các dãy pin'],
  },
  {
    step: 3,
    title: 'Thi công khung giàn đỡ',
    desc: 'Tùy hiện trạng mái, chọn 1 trong 2 phương án: khoan bắt trực tiếp (kèm chống thấm) hoặc hệ dằn tải (khối bê tông đối trọng). Đảm bảo khung nghiêng 5-15° theo thiết kế.',
    details: ['Phương án 1: Khoan + keo chống thấm chuyên dụng', 'Phương án 2: Đặt khối bê tông đối trọng', 'Cố định chân đỡ, kiểm tra độ nghiêng', 'Lắp thanh rail nhôm ngang & dọc'],
  },
  {
    step: 4,
    title: 'Lắp tấm pin & cố định',
    desc: 'Đặt tấm pin lên giàn khung, dùng kẹp giữa + kẹp biên Inox 304 cố định chắc chắn. Đảm bảo khoảng cách đều giữa các tấm, siết chặt bu lông đúng lực.',
    details: ['Đặt pin lên khung, căn chỉnh đều', 'Siết kẹp giữa + kẹp biên bằng bulong inox', 'Đi dây DC trong máng cáp', 'Đấu nối chuỗi pin theo sơ đồ'],
  },
  {
    step: 5,
    title: 'Đấu nối điện & Inverter',
    desc: 'Đấu nối DC từ chuỗi pin về Inverter (đúng cực, an toàn). Thiết lập hệ tiếp địa chuẩn chống sét. Kiểm tra điện áp hở mạch và dòng ngắn mạch trước khi kết nối Inverter.',
    details: ['Đấu nối DC đúng cực, an toàn', 'Lắp hệ tiếp địa chống sét toàn bộ khung + pin', 'Test điện áp & dòng ngắn mạch', 'Kết nối Inverter, tủ điện bảo vệ (CB, SPD)'],
  },
  {
    step: 6,
    title: 'Nghiệm thu & vận hành',
    desc: 'Bật Inverter, kiểm tra sản lượng phát điện. Nghiệm thu cơ khí (độ vững, chống thấm) và an toàn điện. Vệ sinh, bàn giao hồ sơ hoàn công và hướng dẫn bảo trì 2-4 lần/năm.',
    details: ['Khởi động Inverter, kiểm tra sản lượng', 'Nghiệm thu cơ khí & chống thấm', 'Kiểm tra an toàn điện, tiếp địa', 'Bàn giao hồ sơ + hướng dẫn bảo trì'],
  },
];

const maintenanceTips = [
  { title: 'Vệ sinh tấm pin', desc: 'Rửa bằng nước sạch 2-4 lần/năm. Mái bằng dễ tích bụi hơn mái nghiêng. Tránh rửa lúc nắng nóng giữa trưa.' },
  { title: 'Kiểm tra chống thấm', desc: 'Mỗi 6-12 tháng kiểm tra các điểm khoan neo, keo chống thấm. Bơm lại keo nếu phát hiện vết nứt hoặc thấm.' },
  { title: 'Kiểm tra khung giàn', desc: 'Kiểm tra ốc vít, thanh rail xem có lỏng hay rỉ sét không. Đặc biệt sau mùa mưa bão cần kiểm tra kỹ.' },
  { title: 'Giám sát sản lượng', desc: 'Theo dõi app hàng ngày. Nếu công suất giảm >15%, liên hệ kỹ thuật viên. Vệ sinh pin ngay khi thấy bụi bẩn dày.' },
];

const faqs = [
  {
    q: 'Mái bằng (sàn bê tông) có lắp được điện mặt trời không?',
    a: 'Hoàn toàn có thể. Mái bằng thậm chí là nền tảng vững chắc nhất cho điện mặt trời. Cho phép chủ động thiết kế góc nghiêng 5-15° và hướng đón nắng tối ưu, không phụ thuộc vào độ dốc có sẵn như mái tôn hay mái ngói.',
  },
  {
    q: 'Lắp pin trên mái bằng có bị thấm dột không?',
    a: 'Không, nếu thi công đúng kỹ thuật. EPCVINA sử dụng keo chống thấm chuyên dụng tại mọi điểm khoan. Hoặc chọn hệ dằn tải (ballast) không cần khoan đục — bảo vệ 100% lớp chống thấm nguyên thủy.',
  },
  {
    q: 'Tại sao không nên lắp phẳng 0° trên mái bằng?',
    a: 'Lắp phẳng 0° gây tổn thất năng lượng đáng kể và tích tụ bụi bẩn giảm 10-30% sản lượng. Góc nghiêng tối thiểu 5-10° giúp nước mưa tự rửa sạch pin và tăng hiệu suất phát điện hàng năm.',
  },
  {
    q: 'Chi phí lắp điện mặt trời mái bằng bao nhiêu?',
    a: 'Mái bằng có chi phí tương đương hoặc cao hơn mái tôn 10-15% (do cần khung nghiêng + khối dằn). Hệ 3kWp từ 45 triệu, 5kWp từ 65 triệu, 10kWp từ 120 triệu. Hoàn vốn 3-5 năm.',
  },
  {
    q: 'Hệ dằn tải (ballast) có chịu được gió bão không?',
    a: 'Có. Hệ dằn tải sử dụng khối bê tông đối trọng được tính toán chuyên nghiệp theo TCVN, chịu được gió cấp 12. EPCVINA thiết kế riêng cho từng vị trí và hình học công trình cụ thể.',
  },
  {
    q: 'Nhà dân dụng sân thượng bình thường có lắp được không?',
    a: 'Có, nhưng cần khảo sát kết cấu. Sàn bê tông cần đủ độ dày và khả năng chịu lực. EPCVINA khảo sát miễn phí và tư vấn phương án phù hợp (khoan bắt hoặc dằn tải) tùy hiện trạng công trình.',
  },
];

export default function MaiBangPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen pt-14 md:pt-20">
      <div
        className="absolute inset-x-0 top-0 h-14 md:hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800"
        aria-hidden="true"
      />
      <HeaderBar />
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-200 text-sm font-medium">Giải pháp thi công mái bằng</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Lắp Điện Mặt Trời<br />Trên Mái Bằng / Sân Bê Tông
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mb-8">
            Nền tảng vững chắc nhất cho điện mặt trời. Chủ động góc nghiêng tối ưu, 
            2 phương án lắp đặt linh hoạt, chịu gió bão cấp 12, tuổi thọ 30+ năm.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0988446113" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Tư Vấn: 0988 446 113
            </a>
            <a href="/bao-gia-dien-mat-troi" className="bg-white text-emerald-900 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-all">
              Nhận Báo Giá Miễn Phí
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Ưu Điểm Của Điện Mặt Trời Mái Bằng
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Mái bằng (sàn bê tông) cho phép chủ động hoàn toàn về góc nghiêng và hướng đón nắng
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">5-15°</p>
              <p className="text-sm text-slate-600">Góc nghiêng tối ưu</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">30+</p>
              <p className="text-sm text-slate-600">Năm tuổi thọ hệ thống</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">2</p>
              <p className="text-sm text-slate-600">Phương án lắp đặt</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">Cấp 12</p>
              <p className="text-sm text-slate-600">Chịu gió bão</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            5 Cân Nhắc Kỹ Thuật Quan Trọng
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Lắp đặt mái bằng đòi hỏi kỹ thuật đặc thù khác biệt so với mái nghiêng
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {technicalRequirements.map((req, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
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

      {/* Install Methods Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            2 Phương Án Lắp Đặt
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Lựa chọn phương án phù hợp với hiện trạng và yêu cầu công trình của bạn
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {installMethods.map((method, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{method.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{method.desc}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-2">Ưu điểm:</p>
                    {method.pros.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-700 mb-2">Lưu ý:</p>
                    {method.cons.map((c, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                        <Warning className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Quy Trình Lắp Đặt 6 Bước
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Thi công bài bản, đúng tiêu chuẩn kỹ thuật, an toàn tuyệt đối
          </p>
          <div className="space-y-6">
            {installSteps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
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

      {/* Accessories & Mounting */}
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
              { name: 'Thanh rail nhôm AL6005-T5', desc: 'Dài 2.1m, dạng chữ U, cố định trên sàn bê tông. Nhẹ, bền, chống ăn mòn.' },
              { name: 'Khung nghiêng cố định', desc: 'Tạo góc nghiêng 5-15° tối ưu cho mái bằng. Nhôm AL6005-T5, chịu gió cấp 12.' },
              { name: 'Khối bê tông đối trọng', desc: 'Hệ dằn tải không khoan đục, bảo vệ 100% chống thấm nguyên thủy của sàn.' },
              { name: 'Kẹp giữa (Mid clamp)', desc: 'Cố định khoảng cách giữa các tấm pin. AL6005-T5 + Inox 304, L=40mm.' },
              { name: 'Kẹp biên (End clamp)', desc: 'Cố định 2 đầu ngoài cùng của dãy pin vào rail. Siết chặt bằng bulong inox.' },
              { name: 'Keo chống thấm chuyên dụng', desc: 'Trám kín lỗ khoan neo, ngăn nước rỉ tuyệt đối. Bền bỉ mọi thời tiết.' },
            ].map((acc, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{acc.name}</h3>
                <p className="text-xs text-slate-600">{acc.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/thiet-bi/mounting" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-semibold transition-all">
              Xem chi tiết hệ khung nhôm nhôm AL6005-T5 <ArrowRight className="w-4 h-4" />
            </a>
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
            Mái bằng dễ tích bụi hơn mái nghiêng — vệ sinh định kỳ 2-4 lần/năm
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
            <a href="/giai-phap-thi-cong-mai-ngoi" className="bg-amber-50 rounded-xl p-5 border border-amber-200 hover:shadow-md transition-all">
              <h3 className="font-bold text-amber-800 mb-1">Điện Mặt Trời Mái Ngói</h3>
              <p className="text-sm text-slate-600">Cho nhà phố, biệt thự. Móc ngói Inox 304, chống thấm kép.</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Lắp Điện Mặt Trời Trên Mái Bằng?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Liên hệ ngay để kỹ sư EPCVINA khảo sát miễn phí. Tư vấn phương án lắp đặt tối ưu cho công trình của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-all flex items-center gap-2">
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
