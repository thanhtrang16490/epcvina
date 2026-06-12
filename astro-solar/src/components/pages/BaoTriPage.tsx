import {
  Monitor,
  Droplets,
  Wrench,
  ShieldAlert,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Activity,
  Zap,
  Sun,
  Gauge,
  Headphones,
  Shield,
  Award,
  Eye,
  ThumbsUp,
  FileCheck,
  ClipboardCheck,
  Cog,
  Radio,
  Sparkles,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── Stats ─── */
const stats = [
  { icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />, value: '15–20%', label: 'Tăng sản lượng với O&M', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <Activity className="h-6 w-6" aria-hidden="true" />, value: '80%', label: 'Giảm thời gian dừng hệ thống', gradient: 'from-green-600 to-green-500' },
  { icon: <Gauge className="h-6 w-6" aria-hidden="true" />, value: '60%', label: 'Giảm chi phí sửa chữa', gradient: 'from-teal-600 to-teal-500' },
  { icon: <Headphones className="h-6 w-6" aria-hidden="true" />, value: '24/7', label: 'Giám sát & hỗ trợ', gradient: 'from-cyan-600 to-cyan-500' },
];

/* ─── Why O&M ─── */
const whyOMItems = [
  {
    icon: <AlertTriangle className="h-6 w-6" aria-hidden="true" />,
    value: '36%',
    label: 'Sản lượng giảm nếu không vệ sinh tấm pin',
    color: 'text-red-500',
    bg: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80',
    alt: 'Tấm pin mặt trời bám bụi giảm hiệu suất',
  },
  {
    icon: <Clock className="h-6 w-6" aria-hidden="true" />,
    value: '10–15 năm',
    label: 'Tuổi thọ inverter — cần kiểm tra định kỳ',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    alt: 'Kiểm tra bảo dưỡng inverter điện mặt trời',
  },
  {
    icon: <Zap className="h-6 w-6" aria-hidden="true" />,
    value: '500K–2 triệu/năm',
    label: 'O&M định kỳ vs 10–50 triệu/lần sửa chữa khẩn cấp',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
    alt: 'Kỹ thuật viên bảo trì hệ thống điện mặt trời',
  },
  {
    icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />,
    value: '15–20%',
    label: 'Trung bình tăng sản lượng khi có O&M chuyên nghiệp',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    image: 'https://images.unsplash.com/photo-1509391366360-70e75625e0a0?w=400&q=80',
    alt: 'Hệ thống điện mặt trời hoạt động tối ưu',
  },
];

/* ─── Services (with images) ─── */
const services = [
  {
    icon: <Monitor className="h-6 w-6" aria-hidden="true" />,
    title: 'Giám Sát Từ Xa 24/7',
    subtitle: 'Remote Monitoring',
    items: [
      'Data Logger ghi 5 phút/lần',
      'App web/mobile real-time',
      'Cảnh báo lỗi tức thì',
      'Chỉ số: công suất, nhiệt độ, dòng/áp, năng lượng tích lũy',
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
    alt: 'Bảng giám sát hệ thống điện mặt trời từ xa',
    tag: 'Real-time',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: <Droplets className="h-6 w-6" aria-hidden="true" />,
    title: 'Vệ Sinh Tấm Pin',
    subtitle: 'Panel Cleaning',
    items: [
      '2–6 lần/năm tùy vùng',
      'Nước sạch + chổi mềm, không áp lực cao',
      'Tăng sản lượng 15–36%',
      'Chi phí: 200K–500K/lần',
    ],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    alt: 'Vệ sinh tấm pin mặt trời chuyên nghiệp',
    tag: 'Tăng 36%',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    icon: <Wrench className="h-6 w-6" aria-hidden="true" />,
    title: 'Kiểm Tra & Bảo Dưỡng Định Kỳ',
    subtitle: 'Preventive Maintenance',
    items: [
      'Hàng tuần: kiểm tra trực quan',
      'Hàng tháng: số liệu monitoring',
      'Hàng quý: vệ sinh, kiểm tra nối kết',
      'Hàng năm: test inverter, thay lọc',
      '10 năm: xem xét thay inverter',
    ],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
    alt: 'Kỹ thuật viên bảo dưỡng hệ thống điện mặt trời',
    tag: 'Định kỳ',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <ShieldAlert className="h-6 w-6" aria-hidden="true" />,
    title: 'Sửa Chữa & Phòng Ngừa',
    subtitle: 'Corrective Maintenance',
    items: [
      'Inverter mất kết nối, quá nhiệt, mất đất',
      'Thay dây cáp, sửa mạch, thay quạt tản nhiệt',
      'Khắc phục trong vòng 24 giờ',
    ],
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80',
    alt: 'Sửa chữa hệ thống điện mặt trời trên mái',
    tag: '24 giờ',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    icon: <BarChart3 className="h-6 w-6" aria-hidden="true" />,
    title: 'Phân Tích & Tối Ưu',
    subtitle: 'Performance Analytics',
    items: [
      'Báo cáo tháng/năm chi tiết',
      'PR (Performance Ratio) > 80%',
      'So sánh dự báo vs thực tế',
      'Đề xuất nâng cấp hệ thống',
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    alt: 'Phân tích dữ liệu hiệu suất điện mặt trời',
    tag: 'Analytics',
    tagColor: 'bg-violet-100 text-violet-700',
  },
];

/* ─── Packages (table data) ─── */
const packages = [
  {
    name: 'Cơ Bản',
    power: '100–250kWp',
    price: '2–3 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '2 lần/năm',
    repair: '—',
    support: 'Giờ hành chính',
    highlight: false,
    tag: 'Nhỏ',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Tiêu Chuẩn',
    power: '250–500kWp',
    price: '4–6 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '4 lần/năm',
    repair: 'Sửa chữa nhỏ',
    support: '8/7',
    highlight: true,
    tag: 'Vừa',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Premium',
    power: '500kWp+',
    price: '8–15 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '6 lần/năm',
    repair: 'Thay linh kiện',
    support: '24/7 ưu tiên',
    highlight: false,
    tag: 'Lớn',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'EPC Trọn Gói',
    power: 'Bất kỳ',
    price: 'Tùy chỉnh',
    period: '',
    monitoring: '24/7',
    cleaning: 'Không giới hạn',
    repair: 'Toàn diện',
    support: '24/7 ưu tiên',
    highlight: false,
    tag: 'Trọn gói',
    tagColor: 'bg-amber-100 text-amber-700',
  },
];

/* ─── Commitments ─── */
const commitments = [
  { icon: <Gauge className="h-6 w-6" aria-hidden="true" />, label: 'PR ≥ 80%', desc: 'Performance Ratio đạt chuẩn quốc tế', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />, label: 'Giảm ≤ 0.5%/năm', desc: 'Sản lượng giảm không quá 0.5% mỗi năm', gradient: 'from-green-600 to-green-500' },
  { icon: <Clock className="h-6 w-6" aria-hidden="true" />, label: '< 24 giờ', desc: 'Sửa chữa khẩn cấp trong vòng 24 giờ', gradient: 'from-teal-600 to-teal-500' },
  { icon: <Shield className="h-6 w-6" aria-hidden="true" />, label: '30 năm', desc: 'Bảo hành tấm pin', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Award className="h-6 w-6" aria-hidden="true" />, label: '5–10 năm', desc: 'Bảo hành inverter', gradient: 'from-amber-600 to-amber-500' },
];

/* ─── Process Steps ─── */
const processSteps = [
  { step: 1, title: 'Phát Hiện Sự Cố', desc: 'Hệ thống cảnh báo tự động hoặc khách hàng phát hiện', icon: <Radio className="h-6 w-6" aria-hidden="true" /> },
  { step: 2, title: 'Liên Hệ EPCVINA', desc: 'Hotline, Email hoặc Chat — tiếp nhận ngay lập tức', icon: <Phone className="h-6 w-6" aria-hidden="true" /> },
  { step: 3, title: 'Kiểm Tra Từ Xa', desc: 'Đội kỹ sư phân tích dữ liệu monitoring', icon: <Eye className="h-6 w-6" aria-hidden="true" /> },
  { step: 4, title: 'Phân Loại & Đánh Giá', desc: 'Xác định mức độ nghiêm trọng, phương án xử lý', icon: <ClipboardCheck className="h-6 w-6" aria-hidden="true" /> },
  { step: 5, title: 'Xử Lý Sự Cố', desc: 'Hướng dẫn remote hoặc cử kỹ thuật viên on-site', icon: <Wrench className="h-6 w-6" aria-hidden="true" /> },
  { step: 6, title: 'Báo Cáo Hoàn Thành', desc: 'Xác nhận khắc phục, báo cáo chi tiết', icon: <FileCheck className="h-6 w-6" aria-hidden="true" /> },
  { step: 7, title: 'Theo Dõi Liên Tục', desc: 'Giám sát hiệu suất, phòng ngừa tái phát', icon: <Cog className="h-6 w-6" aria-hidden="true" /> },
];

export default function BaoTriPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1509391366360-70e75625e0a0?w=1200&q=80"
            alt="Hệ thống điện mặt trời được vận hành và bảo trì chuyên nghiệp"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-emerald-400/30 mb-6">
              <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span className="text-emerald-300 font-semibold tracking-wide">Vận Hành & Bảo Trì</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Dịch Vụ O&M{' '}
              <span className="text-emerald-400">Điện Mặt Trời</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              EPCVINA SOLAR cung cấp dịch vụ vận hành & bảo trì chuyên nghiệp — tối đa hóa hiệu suất,
              kéo dài tuổi thọ hệ thống, giảm thiểu rủi ro. Từ giám sát từ xa 24/7, vệ sinh pin
              đến bảo dưỡng định kỳ, đảm bảo hệ thống hoạt động tối ưu suốt 30 năm.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Đăng Ký Dịch Vụ O&M
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        {/* ═══════════════════ Stats Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold">
                Hiệu Quả <span className="text-emerald-400">O&M</span> Nói Lên Tất Cả
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                Những con số chứng minh giá trị của dịch vụ vận hành & bảo trì chuyên nghiệp
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
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-2.5 text-base text-emerald-300 font-medium">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Đảm bảo hiệu suất — tối đa hóa lợi nhuận đầu tư
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 1: Tại Sao Cần O&M ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="why-om-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Tại sao cần O&M
              </div>
              <h2 id="why-om-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Không Bảo Trì = <span className="text-emerald-600">Lỗ Hổng Lớn</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Những con số cho thấy rủi ro khi bỏ qua bảo trì hệ thống điện mặt trời
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyOMItems.map((item) => (
                <div
                  key={item.value}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <div className={`w-12 h-12 mx-auto ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3`}>
                      {item.icon}
                    </div>
                    <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 2: Các Dịch Vụ (with images) ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Cog className="h-4 w-4" aria-hidden="true" />
                Dịch vụ toàn diện
              </div>
              <h2 id="services-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Các Dịch Vụ <span className="text-emerald-600">O&M</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Giải pháp bảo trì toàn diện cho hệ thống điện mặt trời
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={svc.image}
                      alt={svc.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                          {svc.icon}
                        </div>
                        <span className="text-white font-bold text-sm">{svc.title}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${svc.tagColor}`}>
                        {svc.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">{svc.subtitle}</p>
                    <ul className="space-y-2.5">
                      {svc.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 3: Gói Dịch Vụ (Desktop table + Mobile cards) ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="packages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                Gói dịch vụ
              </div>
              <h2 id="packages-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gói Dịch Vụ <span className="text-emerald-600">O&M</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Lựa chọn gói phù hợp với quy mô hệ thống điện mặt trời
              </p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Gói</th>
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-left font-semibold">Chi Phí</th>
                    <th className="px-6 py-4 text-center font-semibold">Giám Sát</th>
                    <th className="px-6 py-4 text-center font-semibold">Vệ Sinh</th>
                    <th className="px-6 py-4 text-left font-semibold">Sửa Chữa</th>
                    <th className="px-6 py-4 text-left font-semibold">Hỗ Trợ</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, i) => (
                    <tr
                      key={pkg.name}
                      className={`border-t border-gray-100 hover:bg-emerald-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${pkg.highlight ? 'bg-emerald-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{pkg.name}</span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${pkg.tagColor}`}>
                            {pkg.tag}
                          </span>
                          {pkg.highlight && (
                            <span className="inline-block bg-amber-400 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full">
                              Phổ biến
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-700">{pkg.power}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{pkg.price}</span>
                        <span className="text-gray-500 text-sm">{pkg.period}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">{pkg.monitoring}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{pkg.cleaning}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.repair}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-2xl p-5 border transition-shadow duration-200 motion-reduce:transition-none hover:shadow-md ${
                    pkg.highlight
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${pkg.highlight ? 'text-emerald-800' : 'text-gray-900'}`}>{pkg.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${pkg.tagColor}`}>
                        {pkg.tag}
                      </span>
                    </div>
                    {pkg.highlight && (
                      <span className="bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                        Phổ biến nhất
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className={`text-2xl font-bold ${pkg.highlight ? 'text-emerald-700' : 'text-emerald-600'}`}>{pkg.price}</span>
                    <span className={`text-sm ${pkg.highlight ? 'text-emerald-600' : 'text-gray-500'}`}>{pkg.period}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Công suất</span>
                      <span className={`font-medium ${pkg.highlight ? 'text-emerald-700' : 'text-gray-700'}`}>{pkg.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giám sát</span>
                      <span className="text-gray-700">{pkg.monitoring}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vệ sinh</span>
                      <span className="text-gray-700">{pkg.cleaning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sửa chữa</span>
                      <span className="text-gray-700">{pkg.repair}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Hỗ trợ</span>
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium">
                        <Headphones className="h-3 w-3" aria-hidden="true" />
                        {pkg.support}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 4: Cam Kết Hiệu Suất ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="commitments-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Cam kết hiệu suất
              </div>
              <h2 id="commitments-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Cam Kết <span className="text-emerald-600">Hiệu Suất</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Chỉ số hiệu suất được đảm bảo bằng hợp đồng — an tâm đầu tư dài hạn
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {commitments.map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none text-center"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {c.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{c.label}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 5: Quy Trình Hỗ Trợ ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Cog className="h-4 w-4" aria-hidden="true" />
                Quy trình xử lý
              </div>
              <h2 id="process-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Quy Trình <span className="text-emerald-600">Hỗ Trợ</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Quy trình xử lý sự cố nhanh chóng & chuyên nghiệp — 7 bước đảm bảo
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((ps) => (
                <div
                  key={ps.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none relative"
                >
                  <div className="absolute top-4 right-4 text-5xl font-black text-emerald-50 select-none" aria-hidden="true">
                    {ps.step}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                      {ps.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ps.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{ps.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-emerald-50" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Sun className="h-8 w-8 text-emerald-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Sẵn Sàng Tối Ưu Hệ Thống Điện Mặt Trời?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay để được tư vấn gói O&M phù hợp với hệ thống của bạn.
                  Đội ngũ kỹ sư EPCVINA sẵn sàng hỗ trợ 24/7.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/lien-he"
                    className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                  >
                    Đăng Ký Dịch Vụ O&M
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="tel:0988446113"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    0988 446 113
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
