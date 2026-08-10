import { useState } from 'react';
import {
  Sun,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  Phone,
  Lightning,
  Medal,
  ShieldCheck,
  CheckCircle,
  Handshake,
  Factory,
  Gauge,
  TrendUp,
  Globe,
  Eye,
  FileText,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

/* ─── Stats ─── */
const heroStats = [
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '100+', label: 'Công trình', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <Lightning className="h-6 w-6" aria-hidden="true" />, value: '42 MWp', label: 'Lớn nhất', gradient: 'from-green-600 to-green-500' },
  { icon: <Medal className="h-6 w-6" aria-hidden="true" />, value: '15+', label: 'Năm kinh nghiệm', gradient: 'from-teal-600 to-teal-500' },
  { icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />, value: '100%', label: 'Hài lòng', gradient: 'from-cyan-600 to-cyan-500' },
];

/* ─── Solar Projects - From GIGASOLAR Data ─── */
const solarProjects = [
  {
    name: 'Chị Hà - Hà Đông',
    capacity: '15 kWp',
    type: 'On Grid / Hybrid',
    location: 'Hà Đông - Hà Nội',
    year: 'T7.2024',
    details: 'Tấm Pin: Longi 550 Wp, Biến tần: Deye 10kW, Pin lưu trữ: Deye 10kWh',
    note: 'Mái hiên 2 mặt kính',
    image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.png',
    alt: 'Dự án điện mặt trời 15 kWp tại Hà Đông, Hà Nội',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Anh Thắng - TP. Hải Dương',
    capacity: '15 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'TP. Hải Dương - Hải Dương',
    year: 'T6.2024',
    details: 'Tấm pin: Canadian 545 Wp, Biến tần: Deye 12KW 3phase, BatteryHigh: Bettenergy',
    note: 'Sơn tĩnh điện toàn giàn khung, Đổ betong chân cột',
    image: '/du-an/DU-AN-LOTTE-MART-DONG-DA.jpg',
    alt: 'Dự án điện mặt trời Hybrid 15 kWp tại Hải Dương',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Linh - Dương Nội',
    capacity: '7.5 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Dương Nội - Hà Nội',
    year: 'T9.2024',
    details: 'Tấm Pin: Longi 550 Wp, Biến tần: Deye 8kW 3phase, Pin lưu trữ: SMB 10kWh',
    note: 'Sơn tĩnh điện toàn giàn khung, Mái hiên 2 mặt kính, Tầng cao 7 tầng',
    image: '/du-an/solar-nha-dan/du-an-anh-linh-duong-noi.png',
    alt: 'Dự án điện mặt trời Hybrid 7.5 kWp tại Dương Nội, Hà Nội',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Chị Hà - Long Biên',
    capacity: '5.4 kWp',
    type: 'Hòa Lưới bám tải',
    location: 'Long Biên - Hà Nội',
    year: 'T3.2024',
    details: 'Tấm pin: Canadian 545 Wp, Biến tần: Growatt 5Kw 1phase',
    note: 'Sơn tĩnh điện toàn giàn khung, Mái hiên 2 mặt kính, Tầng cao 6 tầng',
    image: '/du-an/DU-AN-VINHOMES-GOLDEN-RIVER-BA-SON-1.jpg',
    alt: 'Dự án điện mặt trời 5.4 kWp tại Long Biên, Hà Nội',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Anh Thọ - Uông Bí',
    capacity: '5.4 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Uông Bí - Quảng Ninh',
    year: 'T10.2023',
    details: 'Tấm pin: Canadian 545 Wp, Biến tần: Deye 5kw 1phase, BatteryHigh: PowerX 5kwh',
    note: 'Áp mái tôn',
    image: '/du-an/solar-nha-dan/du-an-anh-tho-uong-bi.png',
    alt: 'Dự án điện mặt trời Hybrid 5.4 kWp tại Uông Bí, Quảng Ninh',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Tùng - Tây Tựu',
    capacity: '6.5 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Tây Tựu - Hà Nội',
    year: 'T12.2024',
    details: 'Tấm pin: Longi 580 WP, Biến tần: SolaX 6Kwp 1phase, BatteryHigh: SMB 5Kwp',
    note: 'Làm trên tầng cao 6 tầng',
    image: '/du-an/DU-AN-STARCITY-CENTRER-TRAN-DUY-HUNG.jpg',
    alt: 'Dự án điện mặt trời Hybrid 6.5 kWp tại Tây Tựu, Hà Nội',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Quỳnh - Chùa Thầy',
    capacity: '6.5 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Chùa Thầy - Hà Nội',
    year: 'T10.2024',
    details: 'Tấm pin: Longi 545 Wp, Biến tần SolaX 6Kwp 1 phase, BatteryHigh: Triple power 10Kwp',
    note: 'Làm trên tầng cao 3 tầng',
    image: '/du-an/nha-may-thep-ha-noi.jpg',
    alt: 'Dự án điện mặt trời Hybrid 6.5 kWp tại Chùa Thầy, Hà Nội',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Tú - Sơn Tây',
    capacity: '5 kWp',
    type: 'Hòa Lưới bám tải',
    location: 'Sơn Tây - Hà Nội',
    year: 'T2.2024',
    details: 'Tấm pin: Longi 580 Wp, Biến tần: Growatt 5kwp 1 phase',
    note: 'Áp mái tôn',
    image: '/du-an/DU-AN-METROPOLIS-LIEU-GIAI.jpg',
    alt: 'Dự án điện mặt trời 5 kWp tại Sơn Tây, Hà Nội',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Anh Trung - Bắc Từ Liêm',
    capacity: '15 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Bắc Từ Liêm - Hà Nội',
    year: 'T3.2024',
    details: 'Tấm pin: Longi 580 Wp 2 mặt kính, Biến tần: Deye 12kwp 3phase, BatteryHigh: Bettenergy 10kwp',
    note: 'Mái hiên 2 mặt kính, Tầng cao 6 tầng',
    image: '/du-an/solar-nha-dan/du-an-anh-tung-nam-tu-liem.png',
    alt: 'Dự án điện mặt trời Hybrid 15 kWp tại Bắc Từ Liêm, Hà Nội',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Quyền - TP. Hải Dương',
    capacity: '5 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'TP. Hải Dương - Hải Dương',
    year: 'T4.2024',
    details: 'Tấm pin: Canadian 545 Wp, Biến tần: Deye 5kw 1phase, BatteryHigh: PowerX 5kwh',
    note: 'Dựng khung trên mái ngói, giảm độ dốc tăng hiệu suất',
    image: '/du-an/DU-AN-SIEU-THI-LOtTE-DEPARTMENT-STORE.jpg',
    alt: 'Dự án điện mặt trời Hybrid 5 kWp tại Hải Dương',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Thắng - Thanh Miện',
    capacity: '15 kWp',
    type: 'Hòa lưới bám tải',
    location: 'Thanh Miện - Hải Dương',
    year: 'T4.2024',
    details: 'Tấm pin: Longi 580 Wp, Biến tần: Deye 15kwp 3phase',
    note: 'Làm khung trên tầng cao 7 tầng',
    image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.png',
    alt: 'Dự án điện mặt trời 15 kWp tại Thanh Miện, Hải Dương',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Chú Thanh - TP. Hải Dương',
    capacity: '22 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'TP. Hải Dương - Hải Dương',
    year: 'T6.2024',
    details: 'Tấm pin: Longi 580 Wp, Biến tần: Deye 10Kwp 1 phase, BatteryHigh: SMB 20Kwp',
    note: 'Sơn tĩnh điện toàn giàn khung, Độ cao >6m, Đấu nối 2 biến tần Parallel',
    image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg',
    alt: 'Dự án điện mặt trời Hybrid 22 kWp tại Hải Dương',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Anh Quý - Việt Yên',
    capacity: '6 kWp',
    type: 'Hybrid có lưu trữ',
    location: 'Việt Yên - Bắc Giang',
    year: 'T10.2024',
    details: 'Tấm pin: Longi 580 Wp, Biến tần: Solis 6Kwp 3 phase, BatteryHigh: Lvtopsun 10Kwp',
    note: '',
    image: '/du-an/du-an-ky-tuc-xa-samsung-giai-doan-2-sdcv3-bac-ninh.jpeg',
    alt: 'Dự án điện mặt trời Hybrid 6 kWp tại Việt Yên, Bắc Giang',
    tagColor: 'bg-blue-100 text-blue-700',
  },
];

/* ─── MEP Projects - From EPCVINAHOME ─── */
const mepProjects = [
  {
    name: 'Keangnam Bank Tower',
    client: 'Keangnam',
    scope: 'Chiller, Cooling Tower, AHU/FCU, Ống gió, Cấp thoát nước',
    year: '2011-2012',
    location: 'Hà Nội',
    image: '/du-an/DU-AN-KEANG-NAM-LAND-MARK-TOWER.jpg',
    alt: 'Keangnam Bank Tower - Tòa nhà chọc trời cao nhất Việt Nam',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Samsung SEVT Thái Nguyên - CUB',
    client: 'Samsung',
    scope: 'HVAC, Trao đổi nhiệt, Khí nén, Boiler, Xử lý nước DI/RO',
    year: '2014',
    location: 'Thái Nguyên',
    image: '/du-an/DU-AN-SAMSUNG---SEVT-THAI-NGUYEN.jpg',
    alt: 'Samsung SEVT Thái Nguyên - Trung tâm tiện ích CUB',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Samsung SEV - 4th Component (Bắc Ninh)',
    client: 'Samsung',
    scope: 'HVAC, Utility, Phòng sạch, CTN',
    year: '2014',
    location: 'Bắc Ninh',
    image: '/du-an/DU-AN-SAMSUNG---SEV-4TH-COMPONENT-PROJECT---BAC-NINH.jpg',
    alt: 'Samsung SEV Bắc Ninh - Nhà máy Component',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Samsung SEMV Project (Thái Nguyên)',
    client: 'Samsung',
    scope: 'HVAC, Đường ống công nghệ, CTN',
    year: '2014-2015',
    location: 'Thái Nguyên',
    image: '/du-an/DU-AN-SAMSUNG---SEMV---PROJECT-THAI-NGUYEN.jpg',
    alt: 'Samsung SEMV Thái Nguyên',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Samsung Metal A - SEVT',
    client: 'Samsung',
    scope: 'PCCC, Sprinkler, Vách tường, Khí HFC-23',
    year: '2014-2015',
    location: 'Thái Nguyên',
    image: '/du-an/DU-AN-SAMSUNG---NHA-MAY-METAL-A---SEVT-THAI-NGUYEN.jpg',
    alt: 'Samsung Metal A SEVT - Hệ thống PCCC',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Samsung Diecasting - SEVT',
    client: 'Samsung',
    scope: 'PCCC, Sprinkler, Vách tường, Khí HFC-23',
    year: '2014-2015',
    location: 'Thái Nguyên',
    image: '/du-an/DU-AN-SAMSUNG---NHA-MAY-DIECASTING---SEVT-THAI-NGUYEN.png',
    alt: 'Samsung Diecasting SEVT - Nhà máy đúc',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'VinFast Factory - Xưởng thân vỏ',
    client: 'VinFast',
    scope: 'PCCC, Chiller, Khí nén, CTN',
    year: '2018-2019',
    location: 'Hải Phòng',
    image: '/du-an/DU-AN-XUONG-SAN-XUAT-THAN-VO-NHA-MAY-O-TO-VINFAST.jpg',
    alt: 'VinFast Factory - Xưởng sản xuất thân vỏ ô tô',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Lotte Center Hanoi (65 tầng)',
    client: 'Lotte',
    scope: 'PCCC toàn bộ tòa nhà 65 tầng',
    year: '2012-2014',
    location: 'Hà Nội',
    image: '/du-an/DU-ANLOTTE-CENTER-HANOI.jpg',
    alt: 'Lotte Center Hanoi - Tòa nhà 65 tầng',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Đại sứ quán Hàn Quốc',
    client: 'Đại sứ quán HQ',
    scope: 'HVAC, PCCC, Cấp thoát nước, Thiết bị vệ sinh',
    year: '2017-2018',
    location: 'Hà Nội',
    image: '/du-an/DU-AN-DAI-SU-QUAN-HAN-QUOC.jpg',
    alt: 'Đại sứ quán Hàn Quốc tại Hà Nội',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Metropolis Liễu Giai',
    client: 'Vinhomes',
    scope: 'HVAC Chiller, Cấp thoát nước',
    year: '2017-2018',
    location: 'Hà Nội',
    image: '/du-an/DU-AN-METROPOLIS-LIEU-GIAI.jpg',
    alt: 'Vinhomes Metropolis Liễu Giai',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Starcity Center Trần Duy Hưng',
    client: 'Tân Hoàng Minh',
    scope: 'HVAC, Cấp thoát nước, PCCC',
    year: '2017-2018',
    location: 'Hà Nội',
    image: '/du-an/DU-AN-STARCITY-CENTRER-TRAN-DUY-HUNG.jpg',
    alt: 'Starcity Center Trần Duy Hưng',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Vinhomes Golden River Ba Son',
    client: 'Vinhomes',
    scope: 'Cấp thoát nước, Thiết bị vệ sinh',
    year: '2017',
    location: 'TP.HCM',
    image: '/du-an/DU-AN-VINHOMES-GOLDEN-RIVER-BA-SON-1.jpg',
    alt: 'Vinhomes Golden River Ba Son TP.HCM',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Khách sạn Imperia Hải Phòng',
    client: 'Vinhomes',
    scope: 'Hệ thống PCCC',
    year: '2017',
    location: 'Hải Phòng',
    image: '/du-an/DU-AN-KHACH-SAN-IMPERIA-HAI-PHONG.jpg',
    alt: 'Khách sạn Imperia Hải Phòng',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Samsung SEHC TP.HCM',
    client: 'Samsung',
    scope: 'PCCC, Sprinkler, Khí HFC-23',
    year: '2016',
    location: 'TP.HCM',
    image: '/du-an/DU-AN-NHA-MAY-SAN-XUAT-DIEU-HOA-SAMSUNG---SEHC-CE-HO-CHI-MINH.jpg',
    alt: 'Samsung SEHC TP.HCM - Nhà máy sản xuất điều hòa',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Ký túc xá Samsung Giai đoạn 2',
    client: 'Samsung',
    scope: 'PCCC, Sprinkler, Vách tường',
    year: '2014-2015',
    location: 'Thái Nguyên',
    image: '/du-an/du-an-ky-tuc-xa-samsung-giai-doan-2-sdcv3-bac-ninh.jpeg',
    alt: 'Ký túc xá Samsung Giai đoạn 2 SEVT',
    tagColor: 'bg-amber-100 text-amber-700',
  },
];

/* ─── Client Names ─── */
const clientNames = ['Samsung', 'VinCom', 'VinFast', 'Lotte', 'Keangnam', 'Đại sứ quán HQ', 'Coteccons'];

/* ─── Client Icons ─── */
const clientIcons: Record<string, React.ReactNode> = {
  Samsung: <Factory className="h-6 w-6" aria-hidden="true" />,
  VinCom: <Building className="h-6 w-6" aria-hidden="true" />,
  VinFast: <Gauge className="h-6 w-6" aria-hidden="true" />,
  Lotte: <Handshake className="h-6 w-6" aria-hidden="true" />,
  Keangnam: <Building className="h-6 w-6" aria-hidden="true" />,
  'Đại sứ quán HQ': <Globe className="h-6 w-6" aria-hidden="true" />,
  Coteccons: <CheckCircle className="h-6 w-6" aria-hidden="true" />,
};

export default function ProjectsPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="/images/generated/solar-industrial-hero.webp"
            alt="Trang trại điện mặt trời quy mô lớn của EPCVINA Solar"
            loading="eager"
            width={1200}
            height={675}
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
              EPCVINA SOLAR — Tổng thầu EPC hàng đầu với hơn 100 công trình điện mặt trời và MEP
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
                href="/calculator"
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {solarProjects.map((project) => {
                // Map project names to actual slug file names
                const slugMap: Record<string, string> = {
                  'Chị Hà - Hà Đông': 'chi-ha-ha-dong-15kwp',
                  'Anh Thắng - TP. Hải Dương': 'anh-thanh-hai-duong-15kwp',
                  'Anh Linh - Dương Nội': 'anh-linh-duong-noi-7-5kwp',
                  'Chị Hà - Long Biên': 'chi-ha-long-bien-5-4kwp',
                  'Anh Thọ - Uông Bí': 'anh-tho-uong-bi-5-4kwp',
                  'Anh Tùng - Tây Tựu': 'anh-tung-tay-tuu-6-5kwp',
                  'Anh Quỳnh - Chùa Thầy': 'anh-quynh-chua-thay-6-5kwp',
                  'Anh Tú - Sơn Tây': 'anh-tu-son-tay-5kwp',
                  'Anh Trung - Bắc Từ Liêm': 'anh-trung-bac-tu-liem-15kwp',
                  'Anh Quyền - TP. Hải Dương': 'anh-quyen-hai-duong-5kwp',
                  'Anh Thắng - Thanh Miện': 'anh-thang-thanh-mien-15kwp',
                  'Chú Thanh - TP. Hải Dương': 'chu-thanh-hai-duong-22kwp',
                  'Anh Quý - Việt Yên': 'anh-quy-viet-yen-6kwp',
                };
                
                const slug = slugMap[project.name] || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                
                return (
                  <div
                    key={project.name}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                  >
                    {/* Image area - click to view large */}
                    <div 
                      className="aspect-square overflow-hidden relative group/img cursor-pointer"
                      onClick={() => setLightboxImage(project.image)}
                    >
                      <img
                        src={project.image}
                        alt={project.alt}
                        loading="lazy"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors duration-200" aria-hidden="true" />
                      {/* Eye icon - centered */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Eye className="w-6 h-6 text-gray-800" weight="bold" />
                        </div>
                      </div>
                      {/* Badges - show on hover */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
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
                    {/* Text area - click to go to detail */}
                    <a href={`/du-an/${slug}`} className="block p-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                          {project.year}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-1.5 line-clamp-2">
                        {project.details}
                      </p>
                      {project.note && (
                        <p className="text-xs text-emerald-600 font-medium line-clamp-1">
                          {project.note}
                        </p>
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ MEP / Industrial Projects Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="mep-projects-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-base font-semibold text-amber-300 mb-4 border border-amber-400/30">
                <Building className="h-4 w-4" aria-hidden="true" />
                Cơ điện (MEP)
              </div>
              <h2 id="mep-projects-heading" className="text-2xl sm:text-3xl font-bold">
                Dự Án <span className="text-emerald-400">Cơ Điện (MEP)</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                15+ năm kinh nghiệm M&E với các tập đoàn đa quốc gia hàng đầu Việt Nam
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mepProjects.map((project) => (
                <div
                  key={project.name}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-in-out motion-reduce:transition-none motion-reduce:transform-none cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      width={400}
                      height={225}
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
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-2.5 text-base text-emerald-300 font-medium">
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
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
                Các tập đoàn đa quốc gia và doanh nghiệp hàng đầu tin tưởng lựa chọn EPCVINA Solar
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
                { icon: <Building className="h-6 w-6" aria-hidden="true" />, value: '10+', label: 'Dự án MEP đa quốc gia', gradient: 'from-amber-600 to-amber-500' },
                { icon: <TrendUp className="h-6 w-6" aria-hidden="true" />, value: '100+ MWp', label: 'Tổng công suất đã thi công', gradient: 'from-green-600 to-green-500' },
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
                  href="/calculator"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Liên Hệ Tư Vấn
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="/bao-gia"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  Xem báo giá
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

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors cursor-pointer"
            onClick={() => setLightboxImage(null)}
            aria-label="Đóng"
          >
            ✕
          </button>
          <img
            src={lightboxImage}
            alt="Xem ảnh lớn"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
