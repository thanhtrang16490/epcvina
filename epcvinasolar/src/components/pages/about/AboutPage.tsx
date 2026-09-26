import {
  Building,
  Calendar,
  FileText,
  MapPin,
  Wrench,
  Wind,
  Flame,
  Drop,
  Lightning,
  Sun,
  ClipboardText,
  Cpu,
  ShieldCheck,
  Medal,
  SealCheck,
  HardHat,
  Phone,
  ArrowRight,
  ChatCircle,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

const stats = [
  { value: '500+', label: 'Khách hàng đã tư vấn' },
  { value: '200+', label: 'Công trình triển khai' },
  { value: '13+', label: 'Năm kinh nghiệm' },
  { value: '42 MWp', label: 'Tổng công suất triển khai' },
];

const mepServices = [
  { icon: <Wind className="h-6 w-6" />, label: 'Hệ thống HVAC', desc: 'Điều hòa thông gió công nghiệp' },
  { icon: <Wrench className="h-6 w-6" />, label: 'Utility Piping', desc: 'Hệ thống ống kỹ thuật' },
  { icon: <Flame className="h-6 w-6" />, label: 'PCCC', desc: 'Phòng cháy chữa cháy' },
  { icon: <Drop className="h-6 w-6" />, label: 'Cấp thoát nước', desc: 'Hệ thống nước sinh hoạt & công nghiệp' },
  { icon: <Lightning className="h-6 w-6" />, label: 'Hệ thống điện', desc: 'Trung thế & hạ thế, tủ điện MSB' },
];

const solarServices = [
  { icon: <ClipboardText className="h-6 w-6" />, label: 'Khảo sát & đánh giá', desc: 'Đánh giá hiện trạng công trình' },
  { icon: <Building className="h-6 w-6" />, label: 'Thiết kế & thi công', desc: 'Bản vẽ thi công & lắp đặt' },
  { icon: <Sun className="h-6 w-6" />, label: 'Lắp tấm pin', desc: 'Panel quang năng chính hãng' },
  { icon: <Cpu className="h-6 w-6" />, label: 'Inverter & MSB', desc: 'Tích hợp biến tần & tủ điện' },
  { icon: <ShieldCheck className="h-6 w-6" />, label: 'Hệ thống giám sát', desc: 'Theo dõi hiệu suất real-time' },
];

const certifications = [
  { icon: <Medal className="h-8 w-8" />, title: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
  { icon: <HardHat className="h-8 w-8" />, title: 'Năng lực xây dựng Hạng II', desc: 'Chứng nhận năng lực hoạt động xây dựng' },
  { icon: <Flame className="h-8 w-8" />, title: 'Dịch vụ PCCC', desc: 'Chứng nhận đủ điều kiện PCCC' },
  { icon: <SealCheck className="h-8 w-8" />, title: 'An toàn lao động', desc: 'Quản lý an toàn vệ sinh lao động' },
];

const brands = [
  { name: 'AIKO', logo: '/partners/aiko.webp', category: 'Tấm pin mặt trời', slug: 'aiko' },
  { name: 'Canadian Solar', logo: '/brands/canadian-solar.png', category: 'Tấm pin mặt trời', slug: 'canadian-solar' },
  { name: 'Longi', logo: '/brands/longi.png', category: 'Tấm pin mặt trời', slug: 'longi' },
  { name: 'Trina Solar', logo: '/partners/trina.png', category: 'Tấm pin mặt trời' },
  { name: 'SAJ', logo: '/partners/saj.png', category: 'Biến tần Inverter', slug: 'saj' },
  { name: 'Deye', logo: '/brands/deye.png', category: 'Biến tần Inverter', slug: 'deye' },
  { name: 'Growatt', logo: '/brands/growatt.png', category: 'Biến tần Inverter', slug: 'growatt' },
  { name: 'Huawei', logo: '/brands/huawei.jpg', category: 'Biến tần Inverter', slug: 'huawei' },
  { name: 'Genxgreen', logo: '/partners/GenixGreen.webp', category: 'Pin lưu trữ', slug: 'genix-green' },
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

const clientLogos: Record<string, { src: string; alt: string }> = {
  Samsung: { src: '/partners/samsung.svg', alt: 'Samsung logo' },
  VinFast: { src: '/partners/vinfast.png', alt: 'VinFast logo' },
  VinCom: { src: '/partners/vincom.webp', alt: 'Vincom logo' },
  Lotte: { src: '/partners/lotte.jpg', alt: 'Lotte logo' },
  Keangnam: { src: '/partners/keangnam.png', alt: 'Keangnam logo' },
  Coteccons: { src: '/partners/coteccons.png', alt: 'Coteccons logo' },
};

const brandLinkClassName =
  'group flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 hover:cursor-pointer transition-all duration-200 aspect-[4/3]';
const clientLinkClassName =
  'group flex flex-col items-center justify-center border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 hover:cursor-pointer transition-all duration-200 aspect-[4/3]';

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
                        Phòng 315, Khu thương mại – Chung cư Học viện Quốc phòng, Đường Xuân Tảo, Tây Hồ, Hà Nội
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
                    <Building className="h-6 w-6" />
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

        {/* Section 5.5 - Distributed Brands */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 mb-2">THƯƠNG HIỆU PHÂN PHỐI</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Các thương hiệu EPCVINA phân phối</h2>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                EPCVINA phân phối và triển khai các thương hiệu chính hãng đang được sử dụng trong dự án thực tế,
                đảm bảo hiệu suất, độ bền và khả năng tương thích trong suốt vòng đời hệ thống.
              </p>
            </div>

            {/* Brand logos grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {brands.map((brand) => (
                brand.slug ? (
                  <a
                    key={brand.name}
                    href={`/nhan-hang/${brand.slug}`}
                    className={brandLinkClassName}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-10 sm:h-12 object-contain transition-all duration-200"
                      loading="lazy"
                    />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2 group-hover:text-gray-900 transition-colors text-center">
                      {brand.name}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 text-center">
                      {brand.category}
                    </p>
                  </a>
                ) : (
                  <div
                    key={brand.name}
                    className={brandLinkClassName}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-10 sm:h-12 object-contain transition-all duration-200"
                      loading="lazy"
                    />
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2 text-center">
                      {brand.name}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 text-center">
                      {brand.category}
                    </p>
                  </div>
                )
              ))}
            </div>


          </div>
        </section>

        {/* Section 6 - Key Clients */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Khách hàng tiêu biểu</h2>
              <p className="text-gray-500 mt-2">Đồng hành cùng các tập đoàn hàng đầu</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {clients.map((client) => {
                const logo = clientLogos[client];
                return (
                  <div
                    key={client}
                    className={clientLinkClassName}
                  >
                    {logo ? (
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-11 sm:h-14 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-11 sm:h-14 items-center justify-center">
                        <span className="text-sm sm:text-base font-bold text-gray-700">{client}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 7 - CTA Banner */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Bạn cần tư vấn giải pháp điện mặt trời?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Đội ngũ kỹ sư EPCVINA sẵn sàng khảo sát tận nơi, đề xuất giải pháp tối ưu và báo giá chi tiết trong 24 giờ.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/bao-gia"
                className="inline-flex items-center gap-2 bg-white text-orange-700 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                <FileText className="h-5 w-5" />
                Xem báo giá chi tiết
              </a>
              <a
                href="tel:0988446113"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Gọi: 0988 446 113
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
