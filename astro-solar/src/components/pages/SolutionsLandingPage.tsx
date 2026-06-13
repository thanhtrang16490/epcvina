import {
  Sun,
  Wallet,
  TrendingUp,
  Home,
  Leaf,
  Users,
  ShieldCheck,
  Wrench,
  Headphones,
  Zap,
  ArrowRight,
  Phone,
  Clock,
  Receipt,
  Ruler,
  PiggyBank,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── Data ──────────────────────────────────────────────── */

const heroStats = [
  { value: 'Tiết kiệm đến 90%', label: 'Chi phí điện', icon: Wallet },
  { value: 'Tuổi thọ trên 25 năm', label: 'Vận hành bền bỉ', icon: Clock },
  { value: 'Bảo hành chính hãng', label: 'An tâm sử dụng', icon: ShieldCheck },
  { value: 'Đội ngũ cơ điện chuyên nghiệp', label: 'Thi công chuẩn', icon: Users },
];

const benefits = [
  {
    icon: Wallet,
    title: 'Tiết Kiệm Chi Phí Điện',
    description:
      'Giảm đáng kể hóa đơn điện hàng tháng, đặc biệt với các gia đình sử dụng điều hòa, bình nóng lạnh và thiết bị công suất lớn.',
  },
  {
    icon: TrendingUp,
    title: 'Đầu Tư Một Lần – Hưởng Lợi Dài Hạn',
    description:
      'Hệ thống có tuổi thọ trên 25 năm, giúp tiết kiệm chi phí điện trong nhiều năm.',
  },
  {
    icon: Home,
    title: 'Nâng Cao Giá Trị Bất Động Sản',
    description:
      'Ngôi nhà được trang bị hệ thống năng lượng sạch hiện đại luôn có giá trị cao hơn.',
  },
  {
    icon: Leaf,
    title: 'Bảo Vệ Môi Trường',
    description:
      'Giảm lượng khí thải CO₂, góp phần xây dựng môi trường sống xanh và bền vững.',
  },
];

const packages = [
  {
    size: 'S',
    label: 'Gia đình nhỏ',
    bill: 'Tiền điện từ 1–2 triệu/tháng',
    system: 'Hệ thống 3–5 kWp',
    accent: 'from-emerald-400 to-emerald-500',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    size: 'M',
    label: 'Nhà phố',
    bill: 'Tiền điện từ 2–4 triệu/tháng',
    system: 'Hệ thống 5–8 kWp',
    accent: 'from-amber-400 to-amber-500',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    size: 'L',
    label: 'Biệt thự',
    bill: 'Tiền điện từ 4–8 triệu/tháng',
    system: 'Hệ thống 8–15 kWp',
    accent: 'from-orange-400 to-orange-500',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
  {
    size: 'XL',
    label: 'Biệt thự lớn & Villa',
    bill: 'Tiền điện trên 8 triệu/tháng',
    system: 'Hệ thống từ 15 kWp trở lên',
    accent: 'from-red-400 to-red-500',
    border: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
];

const calculatorInputs = [
  {
    icon: Receipt,
    title: 'Hóa đơn điện trung bình mỗi tháng',
    examples: ['1.500.000 VNĐ', '3.000.000 VNĐ', '5.000.000 VNĐ'],
  },
  {
    icon: Ruler,
    title: 'Diện tích mái khả dụng',
    examples: ['Dưới 20m²', '20–50m²', 'Trên 50m²'],
  },
  {
    icon: PiggyBank,
    title: 'Ngân sách dự kiến',
    examples: ['Dưới 50 triệu', '50–100 triệu', 'Trên 100 triệu'],
  },
];

const valueProps = [
  {
    icon: Users,
    title: 'Thiết Kế Bởi Đội Ngũ Kỹ Sư EPC',
    description: 'Kinh nghiệm triển khai các dự án cơ điện và năng lượng.',
  },
  {
    icon: ShieldCheck,
    title: 'Thiết Bị Chính Hãng',
    description:
      'Pin mặt trời, inverter và phụ kiện từ các thương hiệu uy tín.',
  },
  {
    icon: Wrench,
    title: 'Thi Công Chuẩn Kỹ Thuật',
    description:
      'Đảm bảo an toàn điện, chống thấm và độ bền lâu dài.',
  },
  {
    icon: Headphones,
    title: 'Bảo Hành & Hỗ Trợ Sau Bán Hàng',
    description:
      'Đồng hành cùng khách hàng trong suốt vòng đời hệ thống.',
  },
];

const steps = [
  'Tiếp nhận nhu cầu',
  'Khảo sát mái nhà',
  'Thiết kế & báo giá',
  'Thi công lắp đặt',
  'Bàn giao & hướng dẫn sử dụng',
];

const FALLBACK_ONGRID_COMBOS = [
  { id: 'og1p-5', slug: 'on-grid-5kwp-1p', name: 'On-Grid 5 kWp 1 pha', power: 5, price: 60000000, system_type: 'on-grid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 350, productionMax: 450, paybackStr: '4 năm 3 tháng', is_popular: true },
  { id: 'og1p-88', slug: 'on-grid-88kwp-1p', name: 'On-Grid 8.8 kWp 1 pha', power: 8.75, price: 95000000, system_type: 'on-grid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '2 năm 11 tháng', is_popular: true },
  { id: 'og1p-107', slug: 'on-grid-107kwp-1p', name: 'On-Grid 10.7 kWp 1 pha', power: 10.63, price: 110700000, system_type: 'on-grid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '3 năm 1 tháng' },
  { id: 'og3p-107', slug: 'on-grid-107kwp-3p', name: 'On-Grid 10.7 kWp 3 pha', power: 10.63, price: 108400000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-157', slug: 'on-grid-157kwp-3p', name: 'On-Grid 15.7 kWp 3 pha', power: 15.63, price: 145800000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1100, productionMax: 1300, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-188', slug: 'on-grid-188kwp-3p', name: 'On-Grid 18.8 kWp 3 pha', power: 18.75, price: 167200000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1400, paybackStr: '3 năm 7 tháng', is_popular: true },
  { id: 'og3p-294', slug: 'on-grid-294kwp-3p', name: 'On-Grid 29.4 kWp 3 pha', power: 29.38, price: 278000000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2500, productionMax: 3600, paybackStr: '2 năm 7 tháng' },
  { id: 'og3p-488', slug: 'on-grid-488kwp-3p', name: 'On-Grid 48.8 kWp 3 pha', power: 48.75, price: 440600000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 4500, productionMax: 6000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-731', slug: 'on-grid-731kwp-3p', name: 'On-Grid 73.1 kWp 3 pha', power: 73.13, price: 638900000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 6000, productionMax: 9000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-97', slug: 'on-grid-97kwp-3p', name: 'On-Grid 97 kWp 3 pha', power: 96.88, price: 827500000, system_type: 'on-grid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 8000, productionMax: 11800, paybackStr: '2 năm 5 tháng' },
];

/* ─── Animation Wrapper ─────────────────────────────────── */

function AnimateIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── On-Grid Combo Components ─────────────────────────── */

function OnGridComboCard({ combo }: { combo: typeof FALLBACK_ONGRID_COMBOS[0] }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Zap className="w-3.5 h-3.5 text-orange-500" />, label: `Biến tần ${combo.inverter_brand}`, value: `${combo.power} kW` },
    { icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />, label: 'Sản lượng/tháng', value: `${combo.productionMin}–${combo.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />, label: 'Hoàn vốn', value: combo.paybackStr },
    { icon: <Home className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${Math.ceil(combo.power * 4.32)} m²` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header - orange for on-grid */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(234,88,12,0.1)', color: '#ea580c' }}>
          <Sun className="w-3 h-3" />
          Hệ On-Grid
        </span>
        <h3 className="text-base font-bold text-gray-900 leading-snug">{combo.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {combo.panel_brand} · {combo.inverter_brand}
        </p>
      </div>

      {/* Product image */}
      <div className="relative mx-4 mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src="/sample-combo.jpg" alt={combo.name} width={640} height={360} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%)' }} />
        <p className="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow">{combo.name}</p>
      </div>

      {/* Price block */}
      <div className="mx-4 mt-3 rounded-xl border border-gray-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Giá niêm yết</p>
          <p className="text-xl font-extrabold text-gray-900 leading-tight mt-0.5">
            {new Intl.NumberFormat('vi-VN').format(combo.price)}
            <span className="text-sm font-semibold text-gray-500 ml-1">đ</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Công suất</p>
          <p className="text-lg font-extrabold text-emerald-600 leading-tight mt-0.5">{combo.power} <span className="text-xs font-semibold text-gray-500">kWp</span></p>
        </div>
      </div>

      {/* Spec rows */}
      <div className="flex flex-col mx-4 mt-3 mb-4 rounded-xl border border-gray-100 overflow-hidden flex-1">
        {specs.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-4 py-2.5 gap-3 ${i < specs.length - 1 ? 'border-b border-gray-100' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0">{s.icon}</span>
              <span className="text-[13px] text-gray-500 truncate">{s.label}</span>
            </div>
            <span className="text-[13px] font-semibold text-gray-900 text-right flex-shrink-0">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 mx-4 mb-4 flex-shrink-0">
        <a
          href="/lien-he"
          className="flex-1 h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
        >
          <Phone className="w-4 h-4" /> Xem chi tiết
        </a>
      </div>
    </div>
  );
}

function OnGridComboGrid() {
  const combos = FALLBACK_ONGRID_COMBOS;
  const phase1 = combos.filter(c => c.phase === '1-phase');
  const phase3 = combos.filter(c => c.phase === '3-phase');

  return (
    <div className="space-y-10">
      {phase1.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" aria-hidden="true" />
            On-Grid 1 Pha — Gia đình
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase1.map(combo => (
              <OnGridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      )}
      {phase3.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" aria-hidden="true" />
            On-Grid 3 Pha — Doanh nghiệp & Nhà xưởng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase3.map(combo => (
              <OnGridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Section Component ─────────────────────────────────── */

export default function SolutionsLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <div className="relative">
        <HeaderBar />
        <section
          className="relative overflow-hidden bg-slate-900 text-white min-h-[70vh] sm:min-h-[80vh] flex items-center"
          aria-labelledby="hero-heading"
        >
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"
              alt="Ngôi nhà với hệ thống điện mặt trời trên mái"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-20 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Điện Mặt Trời Cho Gia Đình</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Giảm Hóa Đơn Điện Đến{' '}
                <span className="text-emerald-400">90%</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                Biến mái nhà thành nguồn năng lượng sạch, tiết kiệm chi phí điện
                hàng tháng và gia tăng giá trị ngôi nhà với giải pháp điện mặt
                trời trọn gói từ EPCVINA Solar.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-lg shadow-emerald-500/25 min-h-[44px]"
                >
                  Nhận tư vấn miễn phí
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  Tính toán hệ thống phù hợp
                  <Zap className="h-5 w-5" />
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {heroStats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <StatIcon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — SOLAR HOME LÀ GÌ?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="what-is-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <AnimateIn>
                <h2
                  id="what-is-heading"
                  className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
                >
                  Điện Mặt Trời Dành Cho Gia Đình Là Gì?
                </h2>
              </AnimateIn>

              <AnimateIn delay={100}>
                <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                  Solar Home là hệ thống điện mặt trời lắp đặt trên mái nhà, sử
                  dụng ánh nắng để tạo ra điện năng phục vụ sinh hoạt hàng ngày.
                </p>
              </AnimateIn>

              <AnimateIn delay={200}>
                <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                  Ban ngày, điện được ưu tiên sử dụng trực tiếp cho các thiết bị
                  trong gia đình như điều hòa, tủ lạnh, máy giặt, bình nóng lạnh
                  và các thiết bị điện khác.
                </p>
              </AnimateIn>

              <AnimateIn delay={300}>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Khi điện mặt trời không đủ, hệ thống tự động lấy điện từ lưới
                  điện mà không làm thay đổi thói quen sử dụng của gia đình.
                </p>
              </AnimateIn>
            </div>

            {/* Image */}
            <AnimateIn delay={150}>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80"
                  alt="Tấm pin mặt trời lắp trên mái nhà dân dụng"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover aspect-[4/3]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      Solar Home
                    </div>
                    <div className="text-xs text-gray-500">
                      Năng lượng mặt trời cho gia đình
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — VÌ SAO NÊN LẮP? (4 Benefits)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="benefits-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                4 Lợi Ích Thiết Thực Cho Gia Đình
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Lắp điện mặt trời gia đình mang lại giá trị kinh tế và môi trường
                rõ ràng, lâu dài.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <AnimateIn key={benefit.title} delay={idx * 100}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — HỆ THỐNG PHÙ HỢP VỚI AI? (Packages)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="packages-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="packages-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Chúng Tôi Có Giải Pháp Cho Mọi Nhu Cầu
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Dù gia đình bạn nhỏ hay lớn, EPCVINA Solar đều có giải pháp điện
                mặt trời mái nhà phù hợp.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, idx) => (
              <AnimateIn key={pkg.size} delay={idx * 100}>
                <div
                  className={`relative rounded-2xl border-2 ${pkg.border} bg-white p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full`}
                >
                  {/* Size badge */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.accent} text-white font-bold text-lg mb-4`}
                  >
                    {pkg.size}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.label}
                  </h3>

                  <div className={`inline-block ${pkg.bg} ${pkg.text} text-xs font-semibold rounded-full px-3 py-1 mb-4`}>
                    {pkg.system}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pkg.bill}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — ON-GRID COMBO GRID
          ═══════════════════════════════════════════════════════ */}
      <section id="calculator" className="py-16 sm:py-20 bg-slate-50" aria-labelledby="combo-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
                <Sun className="h-4 w-4" aria-hidden="true" />
                Combo On-Grid
              </span>
              <h2 id="combo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Hệ Thống On-Grid <span className="text-emerald-600">Sẵn Sàng Lắp Đặt</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các combo On-Grid được thiết kế sẵn, tối ưu về hiệu suất và chi phí — hoàn vốn nhanh nhất từ 2.5 năm.
              </p>
            </div>
          </AnimateIn>

          <OnGridComboGrid />

          <AnimateIn delay={200}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">Không tìm thấy cấu hình phù hợp?</p>
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Tư vấn cấu hình riêng
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — TẠI SAO CHỌN EPCVINA SOLAR?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="why-us-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="why-us-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Chuyên Gia Cơ Điện Đồng Hành Cùng Gia Đình Bạn
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                EPCVINA Solar mang đến giải pháp điện mặt trời gia đình với cam
                kết chất lượng từ A đến Z.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <AnimateIn key={prop.title} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — QUY TRÌNH TRIỂN KHAI
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="process-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="process-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                5 Bước Để Sở Hữu Hệ Thống Điện Mặt Trời
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Từ tiếp nhận nhu cầu đến bàn giao, EPCVINA Solar đồng hành cùng
                bạn mỗi bước.
              </p>
            </div>
          </AnimateIn>

          {/* Desktop: Horizontal timeline */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 relative">
            {/* Connecting line */}
            <div
              className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-emerald-200"
              aria-hidden="true"
            />
            {steps.map((step, idx) => (
              <AnimateIn key={step} delay={idx * 100}>
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 relative z-10">
                    {idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight max-w-[140px]">
                    {step}
                  </h3>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="sm:hidden space-y-0 relative">
            {/* Vertical line */}
            <div
              className="absolute left-7 top-6 bottom-6 w-0.5 bg-emerald-200"
              aria-hidden="true"
            />
            {steps.map((step, idx) => (
              <AnimateIn key={step} delay={idx * 80}>
                <div className="flex items-start gap-4 py-3 relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 relative z-10">
                    {idx + 1}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-base font-bold text-gray-900">
                      {step}
                    </h3>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — CTA CUỐI TRANG
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 sm:py-24 bg-slate-900 text-white overflow-hidden"
        aria-labelledby="final-cta-heading"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2
              id="final-cta-heading"
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Bắt Đầu Tiết Kiệm Điện Ngay Hôm Nay
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Nhận tư vấn miễn phí và phương án thiết kế phù hợp với ngôi nhà của
              bạn.
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-emerald-500/25 min-h-[44px]"
              >
                Tính Toán Hệ Thống
                <Zap className="h-5 w-5" />
              </a>
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                Đăng Ký Khảo Sát Miễn Phí
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — FOOTER
          ═══════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
