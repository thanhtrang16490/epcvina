import {
  Building2,
  Factory,
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
  Leaf,
  Clock,
  Shield,
  Globe,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── Client Types (with images) ─── */
const clientTypes = [
  { icon: <Factory className="h-6 w-6" aria-hidden="true" />, label: 'Nhà máy & Xưởng sản xuất', desc: '2000–10000 m²', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80', alt: 'Nhà máy sản xuất với hệ thống điện mặt trời trên mái' },
  { icon: <ShoppingBag className="h-6 w-6" aria-hidden="true" />, label: 'Trung tâm thương mại & Siêu thị', desc: 'Diện tích mái lớn', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80', alt: 'Trung tâm thương mại lắp điện mặt trời' },
  { icon: <Hotel className="h-6 w-6" aria-hidden="true" />, label: 'Tòa nhà văn phòng & Khách sạn', desc: 'Tiết kiệm vận hành', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', alt: 'Tòa nhà văn phòng với hệ thống điện mặt trời' },
  { icon: <Warehouse className="h-6 w-6" aria-hidden="true" />, label: 'Kho bãi & Trung tâm logistics', desc: 'Mái rộng, tối ưu lắp đặt', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80', alt: 'Kho bãi logistics lắp điện mặt trời mái' },
  { icon: <Server className="h-6 w-6" aria-hidden="true" />, label: 'Trung tâm dữ liệu & Server farm', desc: 'Nhu cầu điện liên tục', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80', alt: 'Trung tâm dữ liệu sử dụng điện mặt trời' },
  { icon: <HeartPulse className="h-6 w-6" aria-hidden="true" />, label: 'Cơ sở y tế & Bệnh viện', desc: 'An ninh năng lượng', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80', alt: 'Bệnh viện với hệ thống điện mặt trời an toàn' },
];

const benefits = [
  {
    icon: <PiggyBank className="h-6 w-6" aria-hidden="true" />,
    title: 'Tiết Kiệm Chi Phí',
    desc: 'Giảm 50–90% chi phí điện. VD: nhà máy 500kW tiết kiệm 200–400 triệu/năm',
    gradient: 'from-cyan-600 to-cyan-500',
  },
  {
    icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />,
    title: 'ROI Cao',
    desc: 'Hoàn vốn 4–6 năm, tuổi thọ 30+ năm = 24 năm lợi nhuận ròng',
    gradient: 'from-green-600 to-green-500',
  },
  {
    icon: <Award className="h-6 w-6" aria-hidden="true" />,
    title: 'Nâng Cao Giá Trị',
    desc: 'Chứng chỉ Green Building, cam kết Net-Zero, hỗ trợ ESG',
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    icon: <Landmark className="h-6 w-6" aria-hidden="true" />,
    title: 'Chính Sách Hỗ Trợ',
    desc: 'Bán điện dư theo NĐ 135/2024, ưu đãi thuế',
    gradient: 'from-cyan-500 to-cyan-400',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
    title: 'An Ninh Năng Lượng',
    desc: 'Độc lập nguồn điện, tránh mất điện đột xuất',
    gradient: 'from-violet-600 to-violet-500',
  },
  {
    icon: <Thermometer className="h-6 w-6" aria-hidden="true" />,
    title: 'Giảm Nhiệt Mái',
    desc: 'Giảm 3–5°C, giảm chi phí làm mát',
    gradient: 'from-cyan-600 to-cyan-500',
  },
];

const systemTiers = [
  { capacity: '100–250kWp', application: 'Nhà xưởng nhỏ, văn phòng', cost: '1.2–3.75 tỷ', roi: '5–6 năm', tag: 'Nhỏ', tagColor: 'bg-sky-100 text-sky-700' },
  { capacity: '250–500kWp', application: 'Nhà máy vừa, siêu thị', cost: '3–7.5 tỷ', roi: '4–6 năm', tag: 'Vừa', tagColor: 'bg-cyan-100 text-cyan-700' },
  { capacity: '500kWp–1MWp', application: 'Nhà máy lớn, TTTM quy mô', cost: '6–15 tỷ', roi: '4–6 năm', tag: 'Lớn', tagColor: 'bg-violet-100 text-violet-700' },
  { capacity: '1–5MWp', application: 'Dự án công nghiệp lớn', cost: '12–75 tỷ', roi: '4–6 năm', tag: 'Công nghiệp', tagColor: 'bg-red-100 text-red-700' },
];

const processSteps = [
  { step: 1, title: 'Tư Vấn & Khảo Sát', time: '1–2 tuần', icon: <ClipboardCheck className="h-6 w-6" aria-hidden="true" /> },
  { step: 2, title: 'Thiết Kế Kỹ Thuật', time: '2–3 tuần', icon: <Cpu className="h-6 w-6" aria-hidden="true" /> },
  { step: 3, title: 'Phê Duyệt & Cấp Phép', time: '2–4 tuần', icon: <FileCheck className="h-6 w-6" aria-hidden="true" /> },
  { step: 4, title: 'Thi Công Lắp Đặt', time: '4–8 tuần', icon: <HardHat className="h-6 w-6" aria-hidden="true" /> },
  { step: 5, title: 'Kiểm Tra & Đấu Nối', time: '1–2 tuần', icon: <Zap className="h-6 w-6" aria-hidden="true" /> },
  { step: 6, title: 'Vận Hành & O&M', time: '30 năm', icon: <Cog className="h-6 w-6" aria-hidden="true" /> },
];

const epcServices = [
  { icon: <ClipboardCheck className="h-6 w-6" aria-hidden="true" />, label: 'Tư vấn & Khảo sát chi tiết' },
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, label: 'Thiết kế hệ thống PV (PVsyst, AutoCAD Solar)' },
  { icon: <HardHat className="h-6 w-6" aria-hidden="true" />, label: 'Lắp đặt, giám sát chất lượng' },
  { icon: <Zap className="h-6 w-6" aria-hidden="true" />, label: 'Đấu nối lưới, thủ tục pháp lý' },
  { icon: <Award className="h-6 w-6" aria-hidden="true" />, label: 'Hỗ trợ cấp chứng chỉ Green Building' },
  { icon: <Wrench className="h-6 w-6" aria-hidden="true" />, label: 'Vận hành & Bảo dưỡng 30 năm' },
];

const stats = [
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '40,000+', label: 'MWp tiềm năng khu công nghiệp VN', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <PiggyBank className="h-6 w-6" aria-hidden="true" />, value: '12–15 triệu', label: 'VNĐ/kWp chi phí hiện tại', gradient: 'from-green-600 to-green-500' },
  { icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />, value: '4–6 năm', label: 'Hoàn vốn', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Shield className="h-6 w-6" aria-hidden="true" />, value: '30+', label: 'Năm tuổi thọ', gradient: 'from-cyan-500 to-cyan-400' },
];

export default function SolarCIPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80"
            alt="Hệ thống điện mặt trời công nghiệp trên mái nhà xưởng"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-cyan-400/30 mb-6">
              <Sun className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span className="text-cyan-300 font-semibold tracking-wide">Thương Mại & Công Nghiệp</span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Giải Pháp Điện Mặt Trời cho{' '}
              <span className="text-cyan-400">Thương Mại & Công Nghiệp</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              EPCVINA SOLAR — Tổng thầu EPC hàng đầu cung cấp giải pháp điện mặt trời toàn diện cho nhà
              máy, xưởng sản xuất, trung tâm thương mại. Công suất 100kWp đến 5MWp, tối ưu ROI và tuân thủ
              tiêu chuẩn quốc tế.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Nhận Tư Vấn Miễn Phí
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        {/* ═══════════════════ Section 1 — Đối Tượng Khách Hàng ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="client-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Đối tượng khách hàng
              </div>
              <h2 id="client-types-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Giải Pháp Dành Cho <span className="text-cyan-600">Mô Hình Doanh Nghiệp</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Hệ thống điện mặt trời phù hợp mọi loại hình doanh nghiệp thương mại và công nghiệp
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTypes.map((ct) => (
                <div
                  key={ct.label}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={ct.image}
                      alt={ct.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600 mb-3">
                      {ct.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ct.label}</h3>
                    <p className="text-base text-gray-500 leading-relaxed">{ct.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 2 — Vì Sao Doanh Nghiệp Cần Điện Mặt Trời ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Lợi ích vượt trội
              </div>
              <h2 id="benefits-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Vì Sao Doanh Nghiệp Cần <span className="text-cyan-600">Điện Mặt Trời</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Lợi ích kinh tế và chiến lược vượt trội cho doanh nghiệp
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${b.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{b.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 3 — Phân Loại Hệ Thống ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="system-tiers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="system-tiers-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Phân Loại <span className="text-cyan-600">Hệ Thống</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Lựa chọn công suất phù hợp với nhu cầu doanh nghiệp
              </p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-cyan-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-left font-semibold">Ứng Dụng</th>
                    <th className="px-6 py-4 text-left font-semibold">Chi Phí</th>
                    <th className="px-6 py-4 text-left font-semibold">ROI</th>
                    <th className="px-6 py-4 text-center font-semibold">Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {systemTiers.map((tier, i) => (
                    <tr
                      key={tier.capacity}
                      className={`border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-bold text-cyan-700">{tier.capacity}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{tier.application}</td>
                      <td className="px-6 py-4 text-gray-700">{tier.cost}</td>
                      <td className="px-6 py-4 text-gray-600">{tier.roi}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tier.tagColor}`}>
                          {tier.tag}
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
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                      <span className="font-bold text-cyan-700 text-lg">{tier.capacity}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tier.tagColor}`}>
                      {tier.tag}
                    </span>
                  </div>
                  <div className="space-y-2 text-base">
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
                      <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 rounded-full px-3 py-1 text-xs font-medium">
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                        {tier.roi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 4 — Quy Trình Triển Khai ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="process-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Quy Trình <span className="text-cyan-600">Triển Khai</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                6 bước chuyên nghiệp từ tư vấn đến vận hành dài hạn
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((ps) => (
                <div
                  key={ps.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none relative"
                >
                  <div className="absolute top-4 right-4 text-5xl font-black text-cyan-50 select-none" aria-hidden="true">
                    {ps.step}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                      {ps.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ps.title}</h3>
                    <p className="text-base text-cyan-600 font-medium">{ps.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 5 — Dịch Vụ EPCVINA ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="epc-services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: services */}
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                  <Cog className="h-4 w-4" aria-hidden="true" />
                  Dịch vụ EPC trọn gói
                </div>
                <h2 id="epc-services-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Dịch Vụ <span className="text-cyan-600">EPCVINA</span>
                </h2>
                <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-prose">
                  Tổng thầu EPC trọn gói — từ khảo sát đến vận hành dài hạn, một đầu mối duy nhất cho doanh nghiệp
                </p>
                <div className="space-y-4">
                  {epcServices.map((svc) => (
                    <div key={svc.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 flex-shrink-0 mt-0.5">
                        {svc.icon}
                      </div>
                      <span className="text-base text-gray-700 font-medium leading-relaxed">{svc.label}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/lien-he"
                  className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none text-base min-h-[44px]"
                >
                  Liên hệ tư vấn EPC
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              {/* Right: why choose EPCVINA */}
              <div className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 rounded-2xl p-8 sm:p-10 text-white">
                <h3 className="text-xl font-bold mb-6">Tại sao chọn EPCVINA SOLAR?</h3>
                <ul className="space-y-4">
                  {[
                    { icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />, text: 'Tổng thầu EPC — một đầu mối duy nhất' },
                    { icon: <Clock className="h-5 w-5" aria-hidden="true" />, text: '15+ năm kinh nghiệm M&E & điện mặt trời' },
                    { icon: <Shield className="h-5 w-5" aria-hidden="true" />, text: 'Thiết bị chính hãng — bảo hành 25 năm' },
                    { icon: <Award className="h-5 w-5" aria-hidden="true" />, text: 'Giám sát chất lượng ISO 9001:2015' },
                    { icon: <FileCheck className="h-5 w-5" aria-hidden="true" />, text: 'Hỗ trợ thủ tục pháp lý & đấu nối EVN' },
                    { icon: <Wrench className="h-5 w-5" aria-hidden="true" />, text: 'O&M chuyên nghiệp — vận hành 30 năm' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">{item.icon}</span>
                      <span className="text-base text-gray-200 leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Stats ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold">
                Thông Số <span className="text-cyan-400">Nổi Bật</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                Những con số chứng minh tiềm năng và hiệu quả của điện mặt trời công nghiệp
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-base text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-5 py-2.5 text-base text-cyan-300 font-medium">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                100% năng lượng sạch — cam kết Net-Zero
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Sun className="h-8 w-8 text-cyan-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Sẵn Sàng Tiết Kiệm Chi Phí Điện?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay để nhận tư vấn miễn phí và bản đề xuất kỹ thuật dành riêng cho doanh nghiệp của bạn.
                </p>
                <a
                  href="/lien-he"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Nhận Tư Vấn Miễn Phí
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
