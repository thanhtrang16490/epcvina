import {
  Building2,
  Calendar,
  User,
  FileText,
  MapPin,
  Wrench,
  Wind,
  Flame,
  Droplets,
  Zap,
  Sun,
  ClipboardCheck,
  Cpu,
  ShieldCheck,
  Award,
  BadgeCheck,
  HardHat,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

const stats = [
  { value: '500+', label: 'Kỹ sư kỹ thuật' },
  { value: '300+', label: 'Nhân sự dự án' },
  { value: '15+', label: 'Năm kinh nghiệm' },
  { value: '50+', label: 'Dự án lớn' },
];

const mepServices = [
  { icon: <Wind className="h-6 w-6" />, label: 'Hệ thống HVAC', desc: 'Điều hòa thông gió công nghiệp' },
  { icon: <Wrench className="h-6 w-6" />, label: 'Utility Piping', desc: 'Hệ thống ống kỹ thuật' },
  { icon: <Flame className="h-6 w-6" />, label: 'PCCC', desc: 'Phòng cháy chữa cháy' },
  { icon: <Droplets className="h-6 w-6" />, label: 'Cấp thoát nước', desc: 'Hệ thống nước sinh hoạt & công nghiệp' },
  { icon: <Zap className="h-6 w-6" />, label: 'Hệ thống điện', desc: 'Trung thế & hạ thế, tủ điện MSB' },
];

const solarServices = [
  { icon: <ClipboardCheck className="h-6 w-6" />, label: 'Khảo sát & đánh giá', desc: 'Đánh giá hiện trạng công trình' },
  { icon: <Building2 className="h-6 w-6" />, label: 'Thiết kế & thi công', desc: 'Bản vẽ thi công & lắp đặt' },
  { icon: <Sun className="h-6 w-6" />, label: 'Lắp tấm pin', desc: 'Panel quang năng chính hãng' },
  { icon: <Cpu className="h-6 w-6" />, label: 'Inverter & MSB', desc: 'Tích hợp biến tần & tủ điện' },
  { icon: <ShieldCheck className="h-6 w-6" />, label: 'Hệ thống giám sát', desc: 'Theo dõi hiệu suất real-time' },
];

const certifications = [
  { icon: <Award className="h-8 w-8" />, title: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
  { icon: <HardHat className="h-8 w-8" />, title: 'Năng lực xây dựng Hạng II', desc: 'Chứng nhận năng lực hoạt động xây dựng' },
  { icon: <Flame className="h-8 w-8" />, title: 'Dịch vụ PCCC', desc: 'Chứng nhận đủ điều kiện PCCC' },
  { icon: <BadgeCheck className="h-8 w-8" />, title: 'An toàn lao động', desc: 'Quản lý an toàn vệ sinh lao động' },
];

const clients = [
  'Samsung',
  'VinFast',
  'Vinhomes',
  'VinCom',
  'Lotte',
  'Keangnam',
  'Coteccons',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      <div className="md:pt-16">
        {/* Section 1 - Hero Banner */}
        <section className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>Thành lập 17/05/2011</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              CÔNG TY CỔ PHẦN XÂY LẮP{' '}
              <span className="text-amber-400">EPC VIỆT NAM</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Engineering – Procurement – Construction | Giải pháp Năng lượng & Cơ điện toàn diện
            </p>
          </div>
        </section>

        {/* Section 2 - Company Overview */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left - Text */}
              <div className="lg:col-span-3 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Về <span className="text-amber-500">EPC VINA</span>
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Công ty Cổ phần Xây lắp EPC Việt Nam (EPC VINA) là nhà thầu M&E (Mechanical & Electrical) hàng đầu
                  chuyên cung cấp giải pháp cơ điện (MEP) cho các công trình công nghiệp và điện mặt trời mái nhà.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Với hơn 15 năm kinh nghiệm, EPC VINA đã phục vụ các khách hàng FDI và nội địa lớn nhất Việt Nam,
                  cam kết mang đến chất lượng thi công vượt trội, tiến độ đúng hạn và chi phí tối ưu.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Đội ngũ kỹ sư giàu kinh nghiệm cùng quy trình quản lý chất lượng ISO 9001:2015 đảm bảo mọi dự án
                  được thực hiện đúng tiêu chuẩn kỹ thuật và an toàn lao động.
                </p>
              </div>

              {/* Right - Key Facts */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Giám đốc</p>
                      <p className="font-semibold text-gray-900">Ông Lương Thanh Đỉnh</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mã số thuế</p>
                      <p className="font-semibold text-gray-900">0105313377</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Địa chỉ trụ sở</p>
                      <p className="font-semibold text-gray-900 text-sm leading-snug">
                        Phòng 315, Khu nhà ở Học Viện Quốc Phòng, Đường Xuân Tảo, Tây Hồ, Hà Nội
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Stats Row */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 - Services Grid */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dịch vụ của chúng tôi</h2>
              <p className="text-gray-500 mt-2">Giải pháp toàn diện từ cơ điện đến năng lượng mặt trời</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* MEP Systems */}
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Hệ thống MEP</h3>
                    <p className="text-sm text-gray-500">Cơ điện công trình</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {mepServices.map((svc) => (
                    <div key={svc.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-amber-500 flex-shrink-0 shadow-sm">
                        {svc.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{svc.label}</p>
                        <p className="text-xs text-gray-500">{svc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooftop Solar */}
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <Sun className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Điện mặt trời mái nhà</h3>
                    <p className="text-sm text-gray-500">Rooftop Solar Solutions</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {solarServices.map((svc) => (
                    <div key={svc.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-amber-500 flex-shrink-0 shadow-sm">
                        {svc.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{svc.label}</p>
                        <p className="text-xs text-gray-500">{svc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 - Certifications */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Chứng nhận & Năng lực</h2>
              <p className="text-gray-500 mt-2">Cam kết chất lượng theo tiêu chuẩn quốc tế</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.title}
                  className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-500">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6 - Key Clients */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Đối tác & Khách hàng tiêu biểu</h2>
              <p className="text-gray-500 mt-2">Đồng hành cùng các tập đoàn hàng đầu</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {clients.map((client) => (
                <div
                  key={client}
                  className="border border-gray-200 rounded-lg px-6 py-3 bg-gray-50 text-gray-600 font-semibold text-sm sm:text-base hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
