import {
  Building2,
  ShoppingBag,
  Hotel,
  Server,
  HeartPulse,
  Droplets,
  PiggyBank,
  TrendingUp,
  Award,
  Landmark,
  ShieldCheck,
  Thermometer,
  Factory,
  Store,
  Warehouse,
  HardHat,
  ClipboardCheck,
  Cpu,
  Sun,
  Wrench,
  FileCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Phone,
  Cog,
  Gauge,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

const clientTypes = [
  { icon: <Factory className="h-6 w-6" />, label: 'Nhà máy & Xưởng sản xuất', desc: '2000–10000 m²' },
  { icon: <ShoppingBag className="h-6 w-6" />, label: 'Trung tâm thương mại & Siêu thị', desc: 'Diện tích mái lớn' },
  { icon: <Hotel className="h-6 w-6" />, label: 'Tòa nhà văn phòng & Khách sạn', desc: 'Tiết kiệm vận hành' },
  { icon: <Server className="h-6 w-6" />, label: 'Trung tâm dữ liệu & Server farm', desc: 'Nhu cầu điện liên tục' },
  { icon: <HeartPulse className="h-6 w-6" />, label: 'Cơ sở y tế & Bệnh viện', desc: 'An ninh năng lượng' },
  { icon: <Droplets className="h-6 w-6" />, label: 'Nhà máy nước & Xử lý nước thải', desc: 'Tiêu thụ điện cao' },
];

const benefits = [
  {
    icon: <PiggyBank className="h-6 w-6" />,
    title: 'Tiết Kiệm Chi Phí',
    desc: 'Giảm 50–90% chi phí điện. VD: nhà máy 500kW tiết kiệm 200–400 triệu/năm',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'ROI Cao',
    desc: 'Hoàn vốn 4–6 năm, tuổi thọ 30+ năm = 24 năm lợi nhuận ròng',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Nâng Cao Giá Trị',
    desc: 'Chứng chỉ Green Building, cam kết Net-Zero, hỗ trợ ESG',
  },
  {
    icon: <Landmark className="h-6 w-6" />,
    title: 'Chính Sách Hỗ Trợ',
    desc: 'Bán điện dư theo NĐ 135/2024, ưu đãi thuế',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'An Ninh Năng Lượng',
    desc: 'Độc lập nguồn điện, tránh mất điện đột xuất',
  },
  {
    icon: <Thermometer className="h-6 w-6" />,
    title: 'Giảm Nhiệt Mái',
    desc: 'Giảm 3–5°C, giảm chi phí làm mát',
  },
];

const systemTiers = [
  { capacity: '100–250kWp', application: 'Nhà xưởng nhỏ, văn phòng', cost: '1.2–3.75 tỷ', roi: '5–6 năm' },
  { capacity: '250–500kWp', application: 'Nhà máy vừa, siêu thị', cost: '3–7.5 tỷ', roi: '4–6 năm' },
  { capacity: '500kWp–1MWp', application: 'Nhà máy lớn, TTTM quy mô', cost: '6–15 tỷ', roi: '4–6 năm' },
  { capacity: '1–5MWp', application: 'Dự án công nghiệp lớn', cost: '12–75 tỷ', roi: '4–6 năm' },
];

const processSteps = [
  { step: 1, title: 'Tư Vấn & Khảo Sát', time: '1–2 tuần', icon: <ClipboardCheck className="h-6 w-6" /> },
  { step: 2, title: 'Thiết Kế Kỹ Thuật', time: '2–3 tuần', icon: <Cpu className="h-6 w-6" /> },
  { step: 3, title: 'Phê Duyệt & Cấp Phép', time: '2–4 tuần', icon: <FileCheck className="h-6 w-6" /> },
  { step: 4, title: 'Thi Công Lắp Đặt', time: '4–8 tuần', icon: <HardHat className="h-6 w-6" /> },
  { step: 5, title: 'Kiểm Tra & Đấu Nối', time: '1–2 tuần', icon: <Zap className="h-6 w-6" /> },
  { step: 6, title: 'Vận Hành & O&M', time: '30 năm', icon: <Cog className="h-6 w-6" /> },
];

const epcServices = [
  { icon: <ClipboardCheck className="h-6 w-6" />, label: 'Tư vấn & Khảo sát chi tiết' },
  { icon: <Cpu className="h-6 w-6" />, label: 'Thiết kế hệ thống PV (PVsyst, AutoCAD Solar)' },
  { icon: <HardHat className="h-6 w-6" />, label: 'Lắp đặt, giám sát chất lượng' },
  { icon: <Zap className="h-6 w-6" />, label: 'Đấu nối lưới, thủ tục pháp lý' },
  { icon: <Award className="h-6 w-6" />, label: 'Hỗ trợ cấp chứng chỉ Green Building' },
  { icon: <Wrench className="h-6 w-6" />, label: 'Vận hành & Bảo dưỡng 30 năm' },
];

const stats = [
  { value: '40,000+', label: 'MWp tiềm năng khu công nghiệp VN' },
  { value: '12–15 triệu', label: 'VNĐ/kWp chi phí hiện tại' },
  { value: '4–6 năm', label: 'Hoàn vốn' },
  { value: '30+', label: 'Năm tuổi thọ' },
];

export default function SolarCIPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      <div className="md:pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Thương Mại & Công Nghiệp</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Giải Pháp Điện Mặt Trời cho{' '}
              <span className="text-emerald-400">Thương Mại & Công Nghiệp</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              EPCVINA SOLAR là tổng thầu EPC hàng đầu cung cấp giải pháp điện mặt trời toàn diện cho nhà
              máy, xưởng sản xuất, trung tâm thương mại. Công suất 100kWp đến 5MWp, tối ưu ROI và tuân thủ
              tiêu chuẩn quốc tế.
            </p>
          </div>
        </section>

        {/* Section 1 — Đối Tượng Khách Hàng */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Đối Tượng Khách Hàng</h2>
              <p className="text-gray-500 mt-2">Giải pháp dành cho các mô hình doanh nghiệp</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTypes.map((ct) => (
                <div
                  key={ct.label}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                    {ct.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{ct.label}</h3>
                  <p className="text-sm text-gray-500">{ct.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 — Vì Sao Doanh Nghiệp Cần Điện Mặt Trời */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Vì Sao Doanh Nghiệp Cần Điện Mặt Trời
              </h2>
              <p className="text-gray-500 mt-2">Lợi ích kinh tế và chiến lược vượt trội</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Phân Loại Hệ Thống */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Phân Loại Hệ Thống</h2>
              <p className="text-gray-500 mt-2">Lựa chọn công suất phù hợp với nhu cầu</p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-left font-semibold">Ứng Dụng</th>
                    <th className="px-6 py-4 text-left font-semibold">Chi Phí</th>
                    <th className="px-6 py-4 text-left font-semibold">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {systemTiers.map((tier, i) => (
                    <tr
                      key={tier.capacity}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 font-semibold text-emerald-700">{tier.capacity}</td>
                      <td className="px-6 py-4 text-gray-700">{tier.application}</td>
                      <td className="px-6 py-4 text-gray-700">{tier.cost}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-sm font-medium">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {tier.roi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {systemTiers.map((tier) => (
                <div
                  key={tier.capacity}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700 text-lg">{tier.capacity}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ứng Dụng</span>
                      <span className="text-gray-900 font-medium">{tier.application}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chi Phí</span>
                      <span className="text-gray-900 font-medium">{tier.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">ROI</span>
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        {tier.roi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 — Quy Trình Triển Khai */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Quy Trình Triển Khai</h2>
              <p className="text-gray-500 mt-2">6 bước từ tư vấn đến vận hành</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((ps) => (
                <div
                  key={ps.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative"
                >
                  <div className="absolute top-4 right-4 text-5xl font-black text-emerald-50 select-none">
                    {ps.step}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                      {ps.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{ps.title}</h3>
                    <p className="text-sm text-amber-600 font-medium">{ps.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5 — Dịch Vụ EPCVINA */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Dịch Vụ <span className="text-emerald-600">EPCVINA</span>
                </h2>
                <p className="text-gray-500 mb-6">
                  Tổng thầu EPC trọn gói — từ khảo sát đến vận hành dài hạn
                </p>
                <div className="space-y-4">
                  {epcServices.map((svc) => (
                    <div key={svc.label} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                        {svc.icon}
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{svc.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl p-8 sm:p-10 text-white">
                <h3 className="text-xl font-bold mb-4">Tại sao chọn EPCVINA SOLAR?</h3>
                <ul className="space-y-3">
                  {[
                    'Tổng thầu EPC — một đầu mối duy nhất',
                    '15+ năm kinh nghiệm M&E & điện mặt trời',
                    'Thiết bị chính hãng — warrantee 25 năm',
                    'Giám sát chất lượng ISO 9001:2015',
                    'Hỗ trợ thủ tục pháp lý & đấu nối EVN',
                    'O&M chuyên nghiệp — vận hành 30 năm',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gray-900 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Sẵn Sàng Tiết Kiệm Chi Phí Điện?
            </h2>
            <p className="text-gray-400 mb-8">
              Liên hệ ngay để nhận tư vấn miễn phí và bản đề xuất kỹ thuật dành riêng cho doanh nghiệp của
              bạn.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-full transition-colors duration-200 text-lg"
            >
              <Phone className="h-5 w-5" />
              Nhận Tư Vấn Miễn Phí
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
