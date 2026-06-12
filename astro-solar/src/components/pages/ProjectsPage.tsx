import {
  Sun,
  Building2,
  MapPin,
  Calendar,
  ArrowRight,
  Phone,
  Zap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Handshake,
  Factory,
  Gauge,
  TrendingUp,
  Globe,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── Stats ─── */
const heroStats = [
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '500+', label: 'Công trình', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <Zap className="h-6 w-6" aria-hidden="true" />, value: '42 MWp', label: 'Lớn nhất', gradient: 'from-green-600 to-green-500' },
  { icon: <Award className="h-6 w-6" aria-hidden="true" />, value: '6+', label: 'Năm kinh nghiệm', gradient: 'from-teal-600 to-teal-500' },
  { icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />, value: '100%', label: 'Khách hàng hài lòng', gradient: 'from-cyan-600 to-cyan-500' },
];

/* ─── Solar Projects ─── */
const solarProjects = [
  {
    name: 'Trang trại Điện mặt trời Bình Thuận',
    capacity: '~42 MWp',
    type: 'Solar Farm',
    location: 'Bình Thuận',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80',
    alt: 'Trang trại điện mặt trời Bình Thuận công suất 42 MWp',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Trang trại Điện mặt trời Khánh Hòa',
    capacity: '~35 MWp',
    type: 'Solar Farm',
    location: 'Khánh Hòa',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&q=80',
    alt: 'Trang trại điện mặt trời Khánh Hòa công suất 35 MWp',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Điện mặt trời mái nhà C&I Thái Nguyên',
    capacity: '~12.6 MWp',
    type: 'Rooftop C&I',
    location: 'Thái Nguyên',
    year: '2021',
    image: 'https://images.unsplash.com/photo-1611365892117-00d741f29fc0?w=400&q=80',
    alt: 'Hệ thống điện mặt trời mái nhà C&I Thái Nguyên',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Điện mặt trời mái nhà C&I Nghệ An',
    capacity: '~7.3 MWp',
    type: 'Rooftop C&I',
    location: 'Nghệ An',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&q=80',
    alt: 'Hệ thống điện mặt trời mái nhà C&I Nghệ An',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Điện mặt trời mái nhà C&I Nam Định',
    capacity: '~4.8 MWp',
    type: 'Rooftop C&I',
    location: 'Nam Định',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400&q=80',
    alt: 'Hệ thống điện mặt trời mái nhà C&I Nam Định',
    tagColor: 'bg-sky-100 text-sky-700',
  },
];

/* ─── MEP Projects ─── */
const mepProjects = [
  { name: 'Samsung SEV — Bắc Ninh', scope: 'HVAC, Chiller, Hệ thống nước, Đường ống', client: 'Samsung', year: '2014–2015', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80', alt: 'Dự án cơ điện Samsung SEV Bắc Ninh', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Samsung SEVT — Thái Nguyên', scope: 'HVAC, Khí nén, Hệ thống DI/RO', client: 'Samsung', year: '2014–2016', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', alt: 'Dự án cơ điện Samsung SEVT Thái Nguyên', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'VinFast Auto Complex — Hải Phòng', scope: 'Đường ống công nghệ, HVAC, PCCC', client: 'VinFast', year: '2018–2020', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80', alt: 'Dự án cơ điện VinFast Auto Complex Hải Phòng', tagColor: 'bg-red-100 text-red-700' },
  { name: 'Lotte Mall Tây Hồ', scope: 'HVAC, Hệ thống nước, PCCC', client: 'Lotte', year: '2021–2023', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', alt: 'Dự án cơ điện Lotte Mall Tây Hồ', tagColor: 'bg-violet-100 text-violet-700' },
  { name: 'Shilla Hotel — StarLake', scope: 'HVAC, Hệ thống nước, Vệ sinh', client: 'Shilla', year: '2024–2026', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80', alt: 'Dự án cơ điện Shilla Hotel StarLake', tagColor: 'bg-teal-100 text-teal-700' },
  { name: 'Đại sứ quán Hàn Quốc — Hà Nội', scope: 'HVAC, Nước, PCCC, Xử lý nước thải', client: 'Chính phủ Hàn Quốc', year: '2017–2018', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', alt: 'Dự án cơ điện Đại sứ quán Hàn Quốc', tagColor: 'bg-sky-100 text-sky-700' },
  { name: 'Samsung SEHC — TP.HCM', scope: 'PCCC, Lắp đặt cơ khí', client: 'Samsung', year: '2015–2016', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80', alt: 'Dự án cơ điện Samsung SEHC TP.HCM', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Vinhomes Metropolis Liễu Giai', scope: 'HVAC, Hệ thống Chiller', client: 'VinGroup', year: '2017–2018', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', alt: 'Dự án cơ điện Vinhomes Metropolis', tagColor: 'bg-red-100 text-red-700' },
];

/* ─── Client Names ─── */
const clientNames = ['Samsung', 'VinFast', 'VinGroup', 'Lotte', 'Keangnam', 'Coteccons', 'Shilla'];

/* ─── Client Icons ─── */
const clientIcons: Record<string, React.ReactNode> = {
  Samsung: <Factory className="h-6 w-6" aria-hidden="true" />,
  VinFast: <Gauge className="h-6 w-6" aria-hidden="true" />,
  VinGroup: <Building2 className="h-6 w-6" aria-hidden="true" />,
  Lotte: <Handshake className="h-6 w-6" aria-hidden="true" />,
  Keangnam: <Building2 className="h-6 w-6" aria-hidden="true" />,
  Coteccons: <CheckCircle2 className="h-6 w-6" aria-hidden="true" />,
  Shilla: <Award className="h-6 w-6" aria-hidden="true" />,
};

export default function ProjectsPage() {
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
            alt="Trang trại điện mặt trời quy mô lớn của EPC Solar"
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
              <span className="text-emerald-300 font-semibold tracking-wide">Dự Án Tiêu Biểu</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Dự Án <span className="text-emerald-400">Điện Mặt Trời</span> & MEP
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              EPCVINA SOLAR — Tổng thầu EPC hàng đầu với hơn 500 công trình điện mặt trời và MEP
              trên toàn quốc. Từ trang trại MWp đến mái nhà C&I, mỗi dự án đều cam kết chất lượng
              quốc tế.
            </p>
            {/* Hero stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto w-full">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                >
                  <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center text-white mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Tư Vấn Dự Án Mới
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        {/* ═══════════════════ Solar Projects Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="solar-projects-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Sun className="h-4 w-4" aria-hidden="true" />
                Điện mặt trời
              </div>
              <h2 id="solar-projects-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dự Án <span className="text-emerald-600">Điện Mặt Trời</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Từ trang trại MWp đến rooftop C&I — mỗi dự án đều cam kết hiệu suất tối ưu
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solarProjects.map((project) => (
                <div
                  key={project.name}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 backdrop-blur-sm text-white">
                          {project.capacity}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${project.tagColor}`}>
                          {project.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ MEP / Industrial Projects Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="mep-projects-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-base font-semibold text-amber-300 mb-4 border border-amber-400/30">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Cơ điện (MEP)
              </div>
              <h2 id="mep-projects-heading" className="text-2xl sm:text-3xl font-bold">
                Dự Án <span className="text-emerald-400">Cơ Điện (MEP)</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                15+ năm kinh nghiệm M&E với các tập đoàn đa quốc gia hàng đầu Việt Nam
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mepProjects.map((project) => (
                <div
                  key={project.name}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${project.tagColor}`}>
                        {project.client}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
                      {project.scope}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {project.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-2.5 text-base text-emerald-300 font-medium">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                15+ năm kinh nghiệm M&E — ISO 9001:2015
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Client Partners Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="partners-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Handshake className="h-4 w-4" aria-hidden="true" />
                Đối tác tin cậy
              </div>
              <h2 id="partners-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Đối Tác <span className="text-emerald-600">Tiên Phong</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Các tập đoàn đa quốc gia và doanh nghiệp hàng đầu tin tưởng lựa chọn EPC Solar
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {clientNames.map((name) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none text-center flex flex-col items-center justify-center gap-3 min-h-[120px]"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    {clientIcons[name]}
                  </div>
                  <span className="text-base font-semibold text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Summary Stats ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="summary-stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="summary-stats-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Năng Lực <span className="text-emerald-600">EPCVINA SOLAR</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Tổng thầu EPC trọn gói — từ khảo sát đến vận hành dài hạn
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Sun className="h-6 w-6" aria-hidden="true" />, value: '5+', label: 'Dự án Solar Farm MWp', gradient: 'from-emerald-600 to-emerald-500' },
                { icon: <Building2 className="h-6 w-6" aria-hidden="true" />, value: '8+', label: 'Dự án MEP đa quốc gia', gradient: 'from-amber-600 to-amber-500' },
                { icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />, value: '100+ MWp', label: 'Tổng công suất đã thi công', gradient: 'from-green-600 to-green-500' },
                { icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />, value: 'ISO 9001', label: 'Chứng nhận chất lượng', gradient: 'from-teal-600 to-teal-500' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-base text-gray-500">{stat.label}</div>
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
                  Bạn Có Dự Án Cần Triển Khai?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay để được tư vấn giải pháp điện mặt trời & MEP phù hợp nhất.
                  Đội ngũ EPCVINA sẵn sàng hỗ trợ từ khảo sát đến vận hành.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/lien-he"
                    className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    Liên Hệ Tư Vấn
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