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
  Mail,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Activity,
  Zap,
  Sun,
  ThermometerSun,
  Gauge,
  Battery,
  Headphones,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

const stats = [
  { value: '15-20%', label: 'Tăng sản lượng với O&M', icon: <TrendingUp className="h-5 w-5" /> },
  { value: '80%', label: 'Giảm downtime', icon: <Activity className="h-5 w-5" /> },
  { value: '60%', label: 'Giảm chi phí sửa chữa', icon: <Gauge className="h-5 w-5" /> },
  { value: '24/7', label: 'Giám sát & hỗ trợ', icon: <Headphones className="h-5 w-5" /> },
];

const whyOMItems = [
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    value: '36%',
    label: 'Sản lượng giảm nếu không vệ sinh tấm pin',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    value: '10-15 năm',
    label: 'Tuổi thọ inverter – cần kiểm tra định kỳ',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    value: '500K–2 triệu/năm',
    label: 'O&M định kỳ vs 10–50 triệu/lần sửa chữa khẩn cấp',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    value: '15-20%',
    label: 'Trung bình tăng sản lượng khi có O&M',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
];

const services = [
  {
    icon: <Monitor className="h-7 w-7" />,
    title: 'Giám Sát Từ Xa 24/7',
    subtitle: 'Remote Monitoring',
    items: [
      'Data Logger ghi 5 phút/lần',
      'App web/mobile real-time',
      'Cảnh báo lỗi tức thì',
      'Chỉ số: công suất, nhiệt độ, dòng/áp, năng lượng tích lũy',
    ],
  },
  {
    icon: <Droplets className="h-7 w-7" />,
    title: 'Vệ Sinh Tấm Pin',
    subtitle: 'Panel Cleaning',
    items: [
      '2-6 lần/năm tùy vùng',
      'Nước sạch + chổi mềm, không áp lực cao',
      'Tăng sản lượng 15-36%',
      'Chi phí: 200K-500K/lần',
    ],
  },
  {
    icon: <Wrench className="h-7 w-7" />,
    title: 'Kiểm Tra & Bảo Dưỡng Định Kỳ',
    subtitle: 'Preventive Maintenance',
    items: [
      'Hàng tuần: kiểm tra trực quan',
      'Hàng tháng: số liệu monitoring',
      'Hàng quý: vệ sinh, kiểm tra nối kết',
      'Hàng năm: test inverter, thay lọc',
      '10 năm: xem xét thay inverter',
    ],
  },
  {
    icon: <ShieldAlert className="h-7 w-7" />,
    title: 'Sửa Chữa & Phòng Ngừa',
    subtitle: 'Corrective Maintenance',
    items: [
      'Inverter mất kết nối, quá nhiệt, mất đất',
      'Thay dây cáp, sửa mạch, thay fan',
      'Khắc phục trong vòng 24 giờ',
    ],
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: 'Phân Tích & Tối Ưu',
    subtitle: 'Performance Analytics',
    items: [
      'Báo cáo tháng/năm',
      'PR (Performance Ratio) > 80%',
      'So sánh forecast vs thực tế',
      'Đề xuất nâng cấp',
    ],
  },
];

const packages = [
  {
    name: 'Cơ Bản',
    power: '100-250kWp',
    price: '2-3 triệu',
    period: '/năm',
    features: [
      'Giám sát từ xa 24/7',
      'Vệ sinh tấm pin 2 lần/năm',
      'Báo cáo định kỳ',
    ],
    highlight: false,
  },
  {
    name: 'Tiêu Chuẩn',
    power: '250-500kWp',
    price: '4-6 triệu',
    period: '/năm',
    features: [
      'Tất cả gói Cơ Bản',
      'Bảo dưỡng định kỳ',
      'Sửa chữa nhỏ',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    power: '500kWp+',
    price: '8-15 triệu',
    period: '/năm',
    features: [
      'Tất cả gói Tiêu Chuẩn',
      'Kiểm tra chuyên sâu',
      'Thay linh kiện',
      'Hỗ trợ 24/7 ưu tiên',
    ],
    highlight: false,
  },
  {
    name: 'EPC Trọn Gói',
    power: 'Bất kỳ',
    price: 'Tùy chỉnh',
    period: '',
    features: [
      'Tư vấn & Thiết kế',
      'Lắp đặt trọn gói',
      'O&M 30 năm',
      'Bảo hành toàn diện',
    ],
    highlight: false,
  },
];

const commitments = [
  { label: 'PR ≥ 80%', desc: 'Performance Ratio đạt chuẩn quốc tế' },
  { label: 'Giảm ≤ 0.5%/năm', desc: 'Sản lượng giảm không quá 0.5% mỗi năm' },
  { label: '< 24 giờ', desc: 'Sửa chữa khẩn cấp trong vòng 24 giờ' },
  { label: '30 năm', desc: 'Bảo hành tấm pin' },
  { label: '5-10 năm', desc: 'Bảo hành inverter' },
];

const processSteps = [
  { step: 1, label: 'Khách hàng phát hiện lỗi' },
  { step: 2, label: 'Liên hệ EPCVINA (Phone/Email/Chat)' },
  { step: 3, label: 'Đội kỹ sư kiểm tra từ xa' },
  { step: 4, label: 'Phân loại lỗi' },
  { step: 5, label: 'Hướng dẫn sửa remote hoặc lập lịch on-site' },
  { step: 6, label: 'Sửa chữa & báo cáo hoàn thành' },
  { step: 7, label: 'Theo dõi hiệu suất liên tục' },
];

export default function BaoTriPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      <div className="md:pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Operation & Maintenance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Dịch Vụ Vận Hành & Bảo Trì{' '}
              <span className="text-emerald-400">Điện Mặt Trời (O&M)</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              EPCVINA SOLAR cung cấp dịch vụ O&M chuyên nghiệp để tối đa hóa hiệu suất hệ thống điện mặt trời.
              Từ giám sát từ xa, vệ sinh pin đến bảo dưỡng định kỳ, chúng tôi đảm bảo hệ thống hoạt động tối ưu 30 năm.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-center mb-2 text-amber-400">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1: Tại Sao Cần O&M */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Tại Sao Cần <span className="text-emerald-600">O&M</span>?
              </h2>
              <p className="text-gray-500 mt-2">Những con số nói lên tất cả</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyOMItems.map((item) => (
                <div
                  key={item.value}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  <div className={`w-14 h-14 mx-auto ${item.bg} rounded-full flex items-center justify-center ${item.color} mb-4`}>
                    {item.icon}
                  </div>
                  <div className={`text-2xl font-bold ${item.color} mb-2`}>{item.value}</div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Các Dịch Vụ */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Các Dịch Vụ <span className="text-emerald-600">O&M</span>
              </h2>
              <p className="text-gray-500 mt-2">Giải pháp toàn diện cho hệ thống điện mặt trời</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                      {svc.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{svc.title}</h3>
                      <p className="text-xs text-gray-400">{svc.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {svc.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Gói Dịch Vụ */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gói Dịch Vụ <span className="text-emerald-600">O&M</span>
              </h2>
              <p className="text-gray-500 mt-2">Lựa chọn gói phù hợp với quy mô hệ thống</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    pkg.highlight
                      ? 'bg-emerald-900 text-white border-emerald-700 ring-2 ring-emerald-400'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  {pkg.highlight && (
                    <div className="inline-block bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                      Phổ biến nhất
                    </div>
                  )}
                  <h3 className={`text-xl font-bold ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm mt-1 ${pkg.highlight ? 'text-emerald-200' : 'text-gray-500'}`}>
                    {pkg.power}
                  </p>
                  <div className="mt-4 mb-5">
                    <span className={`text-3xl font-bold ${pkg.highlight ? 'text-amber-400' : 'text-emerald-600'}`}>
                      {pkg.price}
                    </span>
                    <span className={`text-sm ${pkg.highlight ? 'text-emerald-200' : 'text-gray-500'}`}>
                      {pkg.period}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${pkg.highlight ? 'text-amber-400' : 'text-emerald-500'}`} />
                        <span className={pkg.highlight ? 'text-emerald-100' : 'text-gray-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Cam Kết Hiệu Suất */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Cam Kết <span className="text-emerald-600">Hiệu Suất</span>
              </h2>
              <p className="text-gray-500 mt-2">Chỉ số hiệu suất được đảm bảo bằng hợp đồng</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {commitments.map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-emerald-700 mb-1">{c.label}</div>
                  <p className="text-xs text-gray-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Quy Trình Hỗ Trợ */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Quy Trình <span className="text-emerald-600">Hỗ Trợ</span>
              </h2>
              <p className="text-gray-500 mt-2">Quy trình xử lý sự cố nhanh chóng & chuyên nghiệp</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {processSteps.map((s, idx) => (
                <div key={s.step} className="flex gap-4">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    {idx < processSteps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-emerald-200 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${idx === processSteps.length - 1 ? 'pb-0' : ''}`}>
                    <p className="text-gray-800 font-medium pt-2">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Sẵn Sàng Tối Ưu Hệ Thống Điện Mặt Trời?
            </h2>
            <p className="text-emerald-200 max-w-2xl mx-auto mb-8">
              Liên hệ ngay để được tư vấn gói O&M phù hợp với hệ thống của bạn.
              Đội ngũ kỹ sư EPCVINA sẵn sàng hỗ trợ 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold px-8 py-3.5 rounded-full transition-colors duration-200"
              >
                Đăng Ký Dịch Vụ O&M
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:0988446113"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-full border border-white/20 transition-colors duration-200"
              >
                <Phone className="h-5 w-5" />
                0988 446 113
              </a>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
