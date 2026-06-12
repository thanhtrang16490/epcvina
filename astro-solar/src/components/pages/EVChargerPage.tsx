import {
  Sun,
  Battery,
  Zap,
  Leaf,
  Clock,
  TrendingUp,
  Building2,
  ShoppingBag,
  Car,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Activity,
  Shield,
  Wifi,
  DollarSign,
  Timer,
  Handshake,
  Plug,
  Smartphone,
  Globe,
  Fuel,
  Hotel,
  Building,
  Home,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── V-GREEN Network Stats ─── */
const vgreenStats = [
  { icon: <Plug className="h-6 w-6" aria-hidden="true" />, value: '150,000+', label: 'Cổng sạc trên toàn quốc', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '63', label: 'Tỉnh/Thành phủ sóng', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Zap className="h-6 w-6" aria-hidden="true" />, value: '18 triệu+', label: 'Phiên sạc hoàn thành', gradient: 'from-cyan-500 to-cyan-400' },
  { icon: <Battery className="h-6 w-6" aria-hidden="true" />, value: '400 triệu kWh', label: 'Tổng điện năng cung cấp', gradient: 'from-violet-600 to-violet-500' },
];

/* ─── Featured Charger Products (with images) ─── */
const featuredChargers = [
  {
    name: 'DC Fast Charger',
    power: '60–300kW',
    desc: 'Sạc siêu nhanh cho mọi dòng xe điện',
    image: 'https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?w=400&q=80',
    alt: 'Trụ sạc nhanh DC cho xe điện',
    tag: 'Siêu nhanh',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    name: 'AC Charger Station',
    power: '7–22kW',
    desc: 'Sạc tiêu chuẩn cho khu thương mại, nhà ở',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    alt: 'Trạm sạc AC tiêu chuẩn',
    tag: 'Chuẩn',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Super Charging Station',
    power: '150–300kW',
    desc: 'Siêu trạm sạc phục vụ cao tốc, trạm trọng điểm',
    image: 'https://images.unsplash.com/photo-1680535948052-d04c8abab5a0?w=400&q=80',
    alt: 'Siêu trạm sạc công suất lớn',
    tag: 'Siêu trạm',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Home Charger',
    power: '7–22kW',
    desc: 'Giải pháp sạc tại nhà tiện lợi, an toàn',
    image: 'https://images.unsplash.com/photo-1616361264896-2f4e35dab75a?w=400&q=80',
    alt: 'Sạc xe điện tại nhà',
    tag: 'Gia đình',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'EV Charging Network',
    power: 'Toàn quốc',
    desc: 'Mạng lưới phủ sóng 63 tỉnh thành trên cả nước',
    image: 'https://images.unsplash.com/photo-1697891437122-ac2f7f9b0a23?w=400&q=80',
    alt: 'Mạng lưới trạm sạc xe điện V-GREEN',
    tag: 'Phủ sóng',
    tagColor: 'bg-cyan-100 text-cyan-700',
  },
];

/* ─── V-GREEN Product Lineup ─── */
const chargerLineup = [
  { type: 'DC Superfast', power: '300kW', ports: '1', use: 'Sạc siêu nhanh', tag: 'Supercar', tagColor: 'bg-red-100 text-red-700' },
  { type: 'DC Ultrafast', power: '120–150kW', ports: '2', use: 'Sạc nhanh cao tốc', tag: 'Siêu nhanh', tagColor: 'bg-violet-100 text-violet-700' },
  { type: 'DC Fast', power: '60–80kW', ports: '2', use: 'Sạc nhanh + AC tích hợp', tag: 'Nhanh', tagColor: 'bg-cyan-100 text-cyan-700' },
  { type: 'DC Fast', power: '30–40kW', ports: '1', use: 'Lắp tường/trụ', tag: 'Tiết kiệm', tagColor: 'bg-teal-100 text-teal-700' },
  { type: 'DC Fast', power: '20kW', ports: '1', use: 'Sạc trung bình', tag: 'Phổ biến', tagColor: 'bg-blue-100 text-blue-700' },
  { type: 'AC Standard', power: '22kW', ports: '1', use: 'Sạc qua đêm, thương mại', tag: 'Chuẩn', tagColor: 'bg-sky-100 text-sky-700' },
  { type: 'AC Standard', power: '7kW', ports: '1', use: 'Sạc tại nhà', tag: 'Gia đình', tagColor: 'bg-teal-100 text-teal-700' },
  { type: 'Xe máy điện', power: '1.2kW+', ports: '2–4', use: 'Xe máy, xe tay ga', tag: '2 bánh', tagColor: 'bg-orange-100 text-orange-700' },
];

/* ─── 99 Siêu Trạm Stats ─── */
const superStationStats = [
  { icon: <Building2 className="h-6 w-6" aria-hidden="true" />, value: '99', label: 'Siêu trạm sạc', color: 'text-cyan-400' },
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, value: '34', label: 'Tỉnh/Thành', color: 'text-cyan-300' },
  { icon: <Car className="h-6 w-6" aria-hidden="true" />, value: '100', label: 'Xe sạc đồng thời/trạm', color: 'text-blue-400' },
  { icon: <Timer className="h-6 w-6" aria-hidden="true" />, value: '15 phút', label: 'Sạc nhanh từ NLTT', color: 'text-violet-400' },
];

/* ─── Pricing ─── */
const pricingItems = [
  { icon: <Zap className="h-5 w-5" aria-hidden="true" />, label: 'Giá sạc', value: '3,858 VNĐ/kWh', note: '(đã VAT)', color: 'bg-cyan-50 text-cyan-600' },
  { icon: <Timer className="h-5 w-5" aria-hidden="true" />, label: 'Phí giữ chỗ', value: 'Miễn phí 10 phút đầu', note: 'Sau đó 1,000–4,000 VNĐ/phút', color: 'bg-cyan-50 text-cyan-600' },
  { icon: <DollarSign className="h-5 w-5" aria-hidden="true" />, label: 'Tối đa', value: '1 triệu VNĐ/phiên', note: '', color: 'bg-blue-50 text-blue-600' },
  { icon: <Smartphone className="h-5 w-5" aria-hidden="true" />, label: 'Thanh toán', value: 'App VinFast', note: 'Nhanh chóng, tiện lợi', color: 'bg-violet-50 text-violet-600' },
];

/* ─── Application images ─── */
const applicationCards = [
  {
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=400&q=80',
    alt: 'Bãi đỗ xe có trạm sạc điện',
    title: 'Bãi đỗ xe & TTTM',
  },
  {
    image: 'https://images.unsplash.com/photo-1636906569583-950b5b1d1e7a?w=400&q=80',
    alt: 'Trạm sạc xe điện trên cao tốc',
    title: 'Trạm dừng cao tốc',
  },
];

/* ─── Franchise Venues ─── */
const franchiseVenues = [
  { icon: <Car className="h-6 w-6" aria-hidden="true" />, label: 'Bãi đỗ xe' },
  { icon: <Fuel className="h-6 w-6" aria-hidden="true" />, label: 'Trạm xăng' },
  { icon: <Building2 className="h-6 w-6" aria-hidden="true" />, label: 'Bến xe' },
  { icon: <ShoppingBag className="h-6 w-6" aria-hidden="true" />, label: 'TTTM' },
  { icon: <Hotel className="h-6 w-6" aria-hidden="true" />, label: 'Khách sạn' },
  { icon: <Building className="h-6 w-6" aria-hidden="true" />, label: 'Chung cư' },
  { icon: <Home className="h-6 w-6" aria-hidden="true" />, label: 'Văn phòng' },
];

/* ─── LINK Platform Features ─── */
const linkFeatures = [
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, title: 'Hệ thống quản lý LINK', desc: 'Giám sát và điều phối toàn bộ mạng lưới trạm sạc thông minh' },
  { icon: <Wifi className="h-6 w-6" aria-hidden="true" />, title: 'Giám sát real-time', desc: 'Theo dõi tình trạng hoạt động qua cloud 24/7' },
  { icon: <Smartphone className="h-6 w-6" aria-hidden="true" />, title: 'App VinFast', desc: 'Tìm trạm, thanh toán, xem lịch sử sạc trong một ứng dụng' },
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, title: 'Phủ sóng dày đặc', desc: '3.5km (nội đô) · 65km (cao tốc) — luôn có trạm gần bạn' },
];

/* ─── EPCVINA Services ─── */
const epcvinaServices = [
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, title: 'Khảo sát', desc: 'Đánh giá vị trí, điều kiện lắp đặt hệ thống solar cho trạm sạc' },
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, title: 'Thiết kế', desc: 'Thiết kế hệ thống điện mặt trời + BESS tối ưu cho trạm sạc V-GREEN' },
  { icon: <Building2 className="h-6 w-6" aria-hidden="true" />, title: 'Thi công', desc: 'Lắp đặt chuyên nghiệp, đúng tiến độ, đảm bảo chất lượng' },
  { icon: <Activity className="h-6 w-6" aria-hidden="true" />, title: 'Vận hành O&M', desc: 'Bảo trì định kỳ, giám sát hiệu suất, xử lý sự cố 24/7' },
];

/* ─── EPCVINA Value Props ─── */
const epcvinaValues = [
  { icon: <TrendingUp className="h-7 w-7" aria-hidden="true" />, title: 'Giảm chi phí điện sạc', value: '60–80%', desc: 'So với sử dụng điện lưới thông thường', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Leaf className="h-7 w-7" aria-hidden="true" />, title: 'Năng lượng sạch', value: '100%', desc: 'Solar + Wind + BESS — không phát thải', gradient: 'from-green-600 to-green-500' },
  { icon: <Clock className="h-7 w-7" aria-hidden="true" />, title: 'Vận hành liên tục', value: '24/7', desc: 'Hoạt động không gián đoạn với pin dự phòng', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Shield className="h-7 w-7" aria-hidden="true" />, title: 'Bảo hành dài hạn', value: 'ISO 9001', desc: 'Chứng nhận chất lượng quốc tế', gradient: 'from-cyan-500 to-cyan-400' },
];

export default function EVChargerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80"
            alt="Trạm sạc xe điện năng lượng mặt trời"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* V-GREEN badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-cyan-400/30 mb-6">
              <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span className="text-cyan-300 font-semibold tracking-wide">V-GREEN Partner</span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Trạm Sạc Xe Điện{' '}
              <span className="text-cyan-400">V-GREEN</span>
              <br className="hidden sm:block" />
              {' '}×{' '}
              <span className="text-green-400">Năng Lượng Mặt Trời</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              EPCVINA — Đối tác lắp đặt năng lượng mặt trời cho mạng lưới trạm sạc V-GREEN.
              <br className="hidden sm:block" />
              Solar + BESS + Trạm sạc = Hệ sinh thái xanh hoàn chỉnh.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                Liên hệ tư vấn lắp đặt trạm sạc V-GREEN
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="vgreen-network-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <Globe className="h-4 w-4" aria-hidden="true" />
                Mạng lưới V-GREEN
              </div>
              <h2 id="vgreen-network-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Mạng Lưới Sạc Lớn Nhất <span className="text-cyan-600">Việt Nam</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Hạ tầng sạc điện toàn quốc do V-GREEN (VinFast) vận hành, cung cấp năng lượng tái tạo cho mọi hành trình
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vgreenStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {s.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                  <div className="text-base text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-5 py-2.5 text-base text-cyan-700">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">100% năng lượng tái tạo — Solar + Wind + BESS</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Featured Products with Images ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="featured-chargers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="featured-chargers-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Sản Phẩm <span className="text-cyan-600">Nổi Bật</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Giải pháp sạc toàn diện — từ nhà ở đến trạm trọng điểm
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredChargers.map((product) => (
                <div
                  key={product.name}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.tagColor}`}>
                        {product.tag}
                      </span>
                    </div>
                    <p className="text-base text-cyan-700 font-semibold mb-1">{product.power}</p>
                    <p className="text-base text-gray-500 leading-relaxed">{product.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Product Lineup Table ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="product-lineup-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="product-lineup-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dòng Sản Phẩm <span className="text-cyan-600">Trụ Sạc V-GREEN</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Phủ sóng mọi nhu cầu sạc — từ xe máy điện đến xe hơi cao cấp</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-cyan-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Loại Trụ Sạc</th>
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-center font-semibold">Cổng</th>
                    <th className="px-6 py-4 text-left font-semibold">Ứng Dụng</th>
                    <th className="px-6 py-4 text-center font-semibold">Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {chargerLineup.map((row, i) => (
                    <tr
                      key={`${row.type}-${row.power}`}
                      className={`border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">{row.type}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{row.power}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.ports}</td>
                      <td className="px-6 py-4 text-gray-600">{row.use}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.tagColor}`}>
                          {row.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {chargerLineup.map((row) => (
                <div
                  key={`${row.type}-${row.power}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">{row.type}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.tagColor}`}>
                      {row.tag}
                    </span>
                  </div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Công suất:</span>
                      <span className="font-semibold text-cyan-700">{row.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cổng sạc:</span>
                      <span className="font-medium text-gray-700">{row.ports}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 text-gray-600 leading-relaxed">{row.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 99 Siêu Trạm Sạc ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="super-station-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-base font-semibold text-cyan-300 mb-4 border border-cyan-400/30">
                <Zap className="h-4 w-4" aria-hidden="true" />
                Dự án trọng điểm 2026
              </div>
              <h2 id="super-station-heading" className="text-2xl sm:text-3xl font-bold">
                99 <span className="text-cyan-400">Siêu Trạm Sạc</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                Đầu tư 10,000 tỷ VNĐ — 99 siêu trạm sạc phủ sóng 34 tỉnh/thành, mỗi trạm phục vụ 100 xe sạc đồng thời
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {superStationStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`${s.color} mb-3 flex justify-center`}>{s.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-base text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <DollarSign className="h-5 w-5" aria-hidden="true" />, text: 'Đầu tư 10,000 tỷ VNĐ' },
                { icon: <Timer className="h-5 w-5" aria-hidden="true" />, text: 'Sạc nhanh 15 phút từ NLTT' },
                { icon: <Leaf className="h-5 w-5" aria-hidden="true" />, text: '100% Solar + Wind + BESS' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-cyan-400">{item.icon}</span>
                  <span className="text-base text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Giá Dịch Vụ ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="pricing-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="pricing-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Giá <span className="text-cyan-600">Dịch Vụ Sạc</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Bảng giá minh bạch — thanh toán tiện lợi qua app VinFast</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingItems.map((p) => (
                <div
                  key={p.label}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-12 h-12 ${p.color.split(' ')[0]} rounded-xl flex items-center justify-center mb-4`}>
                    <span className={p.color.split(' ')[1]}>{p.icon}</span>
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">{p.label}</div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{p.value}</div>
                  {p.note && <div className="text-base text-gray-500 leading-relaxed">{p.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Mô Hình Nhượng Quyền ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="franchise-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: franchise info */}
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                  <Handshake className="h-4 w-4" aria-hidden="true" />
                  Nhượng Quyền V-GREEN
                </div>
                <h2 id="franchise-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Mô Hình <span className="text-cyan-600">Nhượng Quyền</span>
                </h2>
                <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-prose">
                  "Doanh nghiệp và nhân dân cùng làm" — Cơ hội kinh doanh trạm sạc V-GREEN với cam kết doanh thu ổn định 10 năm.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: <DollarSign className="h-4 w-4" aria-hidden="true" />, text: 'Doanh thu đảm bảo: 750 VNĐ/kWh cho đối tác' },
                    { icon: <Clock className="h-4 w-4" aria-hidden="true" />, text: 'Cam kết hợp đồng 10 năm' },
                    { icon: <Shield className="h-4 w-4" aria-hidden="true" />, text: 'V-GREEN cung cấp: công nghệ, đào tạo, hỗ trợ, marketing' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-600">{item.icon}</span>
                      </div>
                      <span className="text-base text-gray-700 leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: application images + venue cards */}
              <div>
                {/* Application images */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {applicationCards.map((app) => (
                    <div key={app.title} className="aspect-square overflow-hidden rounded-xl border border-gray-100">
                      <img
                        src={app.image}
                        alt={app.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Vị trí phù hợp lắp đặt trạm sạc</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {franchiseVenues.map((v) => (
                    <div
                      key={v.label}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none flex flex-col items-center gap-2 text-center min-h-[44px] justify-center"
                    >
                      <span className="text-cyan-600">{v.icon}</span>
                      <span className="text-base font-medium text-gray-700">{v.label}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/lien-he"
                  className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none text-base min-h-[44px]"
                >
                  Tư vấn nhượng quyền trạm sạc
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ EPCVINA Solar Integration ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 to-gray-900" aria-labelledby="epcvina-integration-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="epcvina-integration-heading" className="text-2xl sm:text-3xl font-bold text-white">
                EPCVINA × V-GREEN
              </h2>
              <p className="text-cyan-300 mt-2 max-w-2xl mx-auto text-base leading-relaxed">
                Đối tác Solar EPC cho trạm sạc V-GREEN — Biến mỗi trạm sạc thành nhà máy điện mặt trời
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {epcvinaValues.map((v) => (
                <div
                  key={v.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${v.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {v.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{v.value}</div>
                  <div className="text-base font-semibold text-cyan-300 mb-2">{v.title}</div>
                  <p className="text-base text-gray-300 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* EPCVINA services row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {epcvinaServices.map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="text-cyan-400 mb-3">{svc.icon}</div>
                  <h3 className="font-bold text-white text-base mb-1">{svc.title}</h3>
                  <p className="text-base text-gray-400 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>

            {/* Bundle highlight */}
            <div className="mt-10 bg-gradient-to-r from-cyan-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-400/30 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sun className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <span className="text-xl font-bold text-white" aria-hidden="true">+</span>
                <Battery className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                <span className="text-xl font-bold text-white" aria-hidden="true">+</span>
                <Zap className="h-6 w-6 text-violet-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Solar + BESS + Trạm Sạc = Hệ Sinh Thái Xanh Hoàn Chỉnh
              </h3>
              <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                EPCVINA cung cấp giải pháp trọn gói: lắp đặt hệ thống điện mặt trời cho trạm sạc V-GREEN,
                tích hợp pin lưu trữ BESS, giúp giảm 60–80% chi phí điện sạc với nguồn năng lượng sạch 100%.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ LINK Platform ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="link-platform-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="link-platform-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Công Nghệ <span className="text-cyan-600">LINK Platform</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Hệ thống quản lý thông minh — giám sát real-time qua cloud</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {linkFeatures.map((f) => (
                <div
                  key={f.title}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
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
                  <Zap className="h-8 w-8 text-cyan-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Sẵn sàng lắp đặt trạm sạc V-GREEN?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay với EPCVINA để được tư vấn miễn phí về giải pháp
                  Solar + BESS cho trạm sạc V-GREEN phù hợp nhất cho dự án của bạn.
                </p>
                <a
                  href="/lien-he"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  Liên hệ tư vấn lắp đặt trạm sạc V-GREEN
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
