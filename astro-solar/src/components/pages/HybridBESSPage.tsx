import {
  Battery,
  Sun,
  Moon,
  ZapOff,
  TrendingDown,
  Zap,
  Receipt,
  TrendingUp,
  Activity,
  Home,
  Building2,
  Factory,
  Server,
  Radio,
  Warehouse,
  Hotel,
  UtensilsCrossed,
  Stethoscope,
  ShieldCheck,
  Wrench,
  Headphones,
  Users,
  Monitor,
  BarChart3,
  Calendar,
  Expand,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';


/* ─── Data ──────────────────────────────────────────────── */

const heroStats = [
  { value: 'Dự phòng khi mất điện', label: 'Backup liên tục', icon: Zap },
  { value: 'Tối ưu chi phí giờ cao điểm', label: 'Tiết kiệm tối đa', icon: TrendingDown },
  { value: 'Quản lý năng lượng thông minh', label: 'EMS tự động', icon: Monitor },
  { value: 'Tuổi thọ pin đến 15 năm', label: 'Bền bỉ dài hạn', icon: Battery },
];

const systemTypes = [
  {
    title: 'Solar Hybrid',
    description:
      'Điện mặt trời + Inverter Hybrid + Pin lưu trữ Lithium. Cho phép sử dụng điện mặt trời ngay cả khi mất điện lưới.',
    icon: Sun,
    accent: 'from-indigo-500 to-indigo-600',
    bgIcon: 'bg-indigo-100',
    textIcon: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  {
    title: 'BESS',
    description:
      'Battery Pack + BMS + PCS/Inverter + EMS + Hệ thống bảo vệ và giám sát. Được thiết kế cho các công trình có yêu cầu cao về tính liên tục và hiệu quả sử dụng năng lượng.',
    icon: Battery,
    accent: 'from-amber-500 to-amber-600',
    bgIcon: 'bg-amber-100',
    textIcon: 'text-amber-600',
    border: 'border-amber-200',
  },
];

const painPoints = [
  {
    icon: Zap,
    title: 'Mất Điện Đột Xuất',
    description: 'Duy trì nguồn điện cho tải quan trọng khi điện lưới gặp sự cố.',
  },
  {
    icon: Receipt,
    title: 'Hóa Đơn Điện Cao',
    description: 'Lưu trữ điện để sử dụng vào thời điểm giá điện hoặc phụ tải cao.',
  },
  {
    icon: TrendingUp,
    title: 'Công Suất Đỉnh Lớn',
    description: 'Giảm Peak Demand và tránh phát sinh chi phí công suất không cần thiết.',
  },
  {
    icon: Activity,
    title: 'Nguồn Điện Không Ổn Định',
    description: 'Ổn định vận hành cho văn phòng, nhà máy, cửa hàng và hệ thống CNTT.',
  },
];

const scaleTiers = [
  {
    title: 'Residential Hybrid',
    subtitle: 'Gia đình & Biệt thự',
    storage: '5–20 kWh lưu trữ',
    features: ['Backup khi mất điện', 'Kết hợp điện mặt trời'],
    apps: 'Nhà phố, Biệt thự, Homestay',
    accent: 'from-indigo-400 to-indigo-500',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: Home,
  },
  {
    title: 'Commercial Hybrid',
    subtitle: 'Doanh nghiệp vừa và nhỏ',
    storage: '20–100 kWh lưu trữ',
    features: ['Duy trì vận hành thiết bị quan trọng'],
    apps: 'Văn phòng, Nhà hàng, Khách sạn, Showroom',
    accent: 'from-amber-400 to-amber-500',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: Building2,
  },
  {
    title: 'Commercial BESS',
    subtitle: 'Nhà máy & Tòa nhà thương mại',
    storage: '100 kWh – 1 MWh+',
    features: ['Peak Shaving', 'Load Shifting', 'Backup Power'],
    apps: 'Nhà máy sản xuất, Kho vận, Trung tâm dữ liệu, Khu công nghiệp',
    accent: 'from-blue-500 to-blue-600',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: Factory,
  },
  {
    title: 'Utility Scale BESS',
    subtitle: 'Dự án quy mô lớn',
    storage: 'Từ 1 MWh trở lên',
    features: ['Grid-level storage', 'Microgrid', 'Frequency regulation'],
    apps: 'Trang trại điện mặt trời, Khu công nghiệp lớn, Hệ thống Microgrid, Trạm năng lượng',
    accent: 'from-slate-500 to-slate-600',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    icon: Server,
  },
];

const scenarios = [
  {
    title: 'Ban Ngày',
    description: 'Điện mặt trời cấp tải, phần dư sạc pin lưu trữ',
    icon: Sun,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    title: 'Buổi Tối',
    description: 'Pin lưu trữ cấp điện cho tải',
    icon: Moon,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    title: 'Khi Mất Điện',
    description: 'Hệ thống tự động chuyển sang chế độ Backup',
    icon: ZapOff,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    title: 'Khi Giá Điện Cao',
    description: 'Pin lưu trữ xả điện để giảm chi phí sử dụng điện lưới',
    icon: TrendingDown,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
];

const features = [
  {
    icon: Monitor,
    title: 'Energy Management System (EMS)',
    description: 'Giám sát và điều phối năng lượng thông minh.',
  },
  {
    icon: Users,
    title: 'Remote Monitoring',
    description: 'Theo dõi trạng thái hệ thống từ điện thoại hoặc máy tính.',
  },
  {
    icon: TrendingDown,
    title: 'Peak Shaving',
    description: 'Giảm công suất đỉnh.',
  },
  {
    icon: Clock,
    title: 'Load Shifting',
    description: 'Sạc điện giờ thấp điểm – sử dụng giờ cao điểm.',
  },
  {
    icon: ShieldCheck,
    title: 'Backup Power',
    description: 'Đảm bảo nguồn điện liên tục.',
  },
  {
    icon: Expand,
    title: 'Expandable Capacity',
    description: 'Dễ dàng mở rộng khi nhu cầu tăng.',
  },
];

const FALLBACK_HYBRID_COMBOS = [
  // ── Hybrid 1 pha ────────────────────────────────────────────
  { id: 'h1p-5-5',    slug: 'hybrid-5kwp-5.12kwh',    name: 'Hy-Brid 5 kWp 1pha – 5.12 kWh',    power: 5,     battery: 5.12,  price: 100500000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', is_popular: true },
  { id: 'h1p-5-10',   slug: 'hybrid-5kwp-10.24kwh',   name: 'Hy-Brid 5 kWp 1pha – 10.24 kWh',   power: 5,     battery: 10.24, price: 123600000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-88-5',   slug: 'hybrid-8.8kwp-5.12kwh',  name: 'Hy-Brid 8.8 kWp 1pha – 5.12 kWh',  power: 8.75,  battery: 5.12,  price: 125200000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-88-10',  slug: 'hybrid-8.8kwp-10.24kwh', name: 'Hy-Brid 8.8 kWp 1pha – 10.24 kWh', power: 8.75,  battery: 10.24, price: 148300000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-107-5',  slug: 'hybrid-10.7kwp-5.12kwh', name: 'Hy-Brid 10.7 kWp 1pha – 5.12 kWh', power: 10.63, battery: 5.12,  price: 151400000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-88-16',  slug: 'hybrid-8.8kwp-16kwh',    name: 'Hy-Brid 8.8 kWp 1pha – 16 kWh',    power: 8.75,  battery: 16,    price: 164800000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-107-10', slug: 'hybrid-10.7kwp-10.24kwh',name: 'Hy-Brid 10.7 kWp 1pha – 10.24 kWh',power: 10.63, battery: 10.24, price: 174500000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', is_popular: true },
  { id: 'h1p-112-16', slug: 'hybrid-11.2kwp-16kwh',   name: 'Hy-Brid 11.2 kWp 1pha – 16 kWh',   power: 11.25, battery: 16,    price: 184600000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-107-16', slug: 'hybrid-10.7kwp-16kwh',   name: 'Hy-Brid 10.7 kWp 1pha – 16 kWh',   power: 10.63, battery: 16,    price: 189900000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-157-16', slug: 'hybrid-15.7kwp-16kwh',   name: 'Hy-Brid 15.7 kWp 1pha – 16 kWh',   power: 15.63, battery: 16,    price: 230800000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-188-16', slug: 'hybrid-18.8kwp-16kwh',   name: 'Hy-Brid 18.8 kWp 1pha – 16 kWh',   power: 18.75, battery: 16,    price: 261300000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-157-32', slug: 'hybrid-15.7kwp-32kwh',   name: 'Hy-Brid 15.7 kWp 1pha – 32 kWh',   power: 15.63, battery: 32,    price: 293500000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'h1p-244-32', slug: 'hybrid-24.4kwp-32kwh',   name: 'Hy-Brid 24.4 kWp 1pha – 32 kWh',   power: 24.38, battery: 32,    price: 367500000,  system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  // ── Hybrid 3 pha áp thấp (Low Voltage) ──────────────────────
  { id: 'h3lv-107-5',  slug: 'hybrid-3p-10.7kwp-5.12kwh-at',  name: 'Hy-Brid 10.7 kWp 3pha AT – 5.12 kWh', power: 10.63, battery: 5.12, price: 177100000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'low' as const },
  { id: 'h3lv-107-16', slug: 'hybrid-3p-10.7kwp-16kwh-at',    name: 'Hy-Brid 10.7 kWp 3pha AT – 16 kWh',   power: 10.63, battery: 16,   price: 215600000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'low' as const },
  { id: 'h3lv-157-16', slug: 'hybrid-3p-15.7kwp-16kwh-at',    name: 'Hy-Brid 15.7 kWp 3pha AT – 16 kWh',   power: 15.63, battery: 16,   price: 247000000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'low' as const, is_popular: true },
  { id: 'h3lv-244-16', slug: 'hybrid-3p-24.4kwp-16kwh-at',    name: 'Hy-Brid 24.4 kWp 3pha AT – 16 kWh',   power: 24.38, battery: 16,   price: 321800000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'low' as const },
  // ── Hybrid 3 pha áp cao (High Voltage) ──────────────────────
  { id: 'h3hv-157-15', slug: 'hybrid-3p-15.7kwp-15.36kwh-ac', name: 'Hy-Brid 15.7 kWp 3pha AC – 15.36 kWh', power: 15.63, battery: 15.36, price: 271700000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'high' as const },
  { id: 'h3hv-244-15', slug: 'hybrid-3p-24.4kwp-15.36kwh-ac', name: 'Hy-Brid 24.4 kWp 3pha AC – 15.36 kWh', power: 24.38, battery: 15.36, price: 345200000, system_type: 'hybrid' as const, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', voltage: 'high' as const },
];

const calculatorInputs = [
  {
    icon: Receipt,
    title: 'Tiền điện hàng tháng',
    examples: ['5 triệu', '20 triệu', '100 triệu+'],
  },
  {
    icon: Zap,
    title: 'Mục tiêu đầu tư',
    examples: ['Giảm tiền điện', 'Backup khi mất điện', 'Cả hai'],
  },
  {
    icon: Clock,
    title: 'Thời gian cần dự phòng',
    examples: ['1 giờ', '2 giờ', '4 giờ', '8 giờ'],
  },
  {
    icon: TrendingUp,
    title: 'Công suất tải quan trọng',
    examples: ['5 kW', '20 kW', '100 kW'],
  },
];

const valueProps = [
  {
    icon: Users,
    title: 'Thiết Kế Chuẩn EPC',
    description: 'Đội ngũ kỹ sư giàu kinh nghiệm trong lĩnh vực cơ điện và năng lượng.',
  },
  {
    icon: ShieldCheck,
    title: 'Thiết Bị Chính Hãng',
    description: 'Pin lưu trữ, inverter và hệ thống điều khiển từ các nhà sản xuất uy tín toàn cầu.',
  },
  {
    icon: Wrench,
    title: 'Tối Ưu Theo Nhu Cầu Thực Tế',
    description: 'Không bán cấu hình có sẵn, mỗi hệ thống được tính toán riêng theo phụ tải và mục tiêu đầu tư.',
  },
  {
    icon: Headphones,
    title: 'Đồng Hành Dài Hạn',
    description: 'Giám sát, bảo trì và hỗ trợ kỹ thuật trong suốt quá trình vận hành.',
  },
];

const industries = [
  { icon: Home, label: 'Nhà dân & Biệt thự' },
  { icon: Building2, label: 'Văn phòng' },
  { icon: Hotel, label: 'Khách sạn & Resort' },
  { icon: UtensilsCrossed, label: 'Nhà hàng' },
  { icon: Stethoscope, label: 'Bệnh viện' },
  { icon: Factory, label: 'Nhà máy sản xuất' },
  { icon: Warehouse, label: 'Kho lạnh' },
  { icon: Server, label: 'Data Center' },
  { icon: Radio, label: 'Trạm viễn thông' },
  { icon: Warehouse, label: 'Khu công nghiệp' },
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

/* ─── HybridComboCard ───────────────────────────────────── */

function HybridComboCard({ combo }: { combo: typeof FALLBACK_HYBRID_COMBOS[0] }) {
  const investmentM = combo.price / 1000000;
  const panelCount = Math.ceil(combo.power * 1000 / 580);
  const prodMin = Math.round(combo.power * 4.2 * 30);
  const prodMax = Math.round(combo.power * 5.5 * 30);
  const monthlySavings = combo.power * 4.85 * 2800;
  const paybackYears = combo.price / (monthlySavings * 12);
  const years = Math.floor(paybackYears);
  const months = Math.round((paybackYears - years) * 12);
  const paybackStr = months > 0 ? `${years} năm ${months} tháng` : `${years} năm`;

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand || 'Aiko'}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Zap className="w-3.5 h-3.5 text-blue-500" />, label: `Biến tần ${combo.inverter_brand || 'SAJ'}`, value: `${combo.power} kW` },
    ...(combo.battery > 0
      ? [{ icon: <Battery className="w-3.5 h-3.5 text-indigo-500" />, label: `Lưu trữ ${combo.battery_brand || 'Genxgreen'}`, value: `${combo.battery} kWh` }]
      : []),
    { icon: <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />, label: 'Sản lượng/tháng', value: `${prodMin}–${prodMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-indigo-600" />, label: 'Hoàn vốn', value: paybackStr },
    { icon: <Home className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${Math.ceil(combo.power * 4.32)} m²` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(29,78,216,0.1)', color: '#1d4ed8' }}>
          <Zap className="w-3 h-3" />
          Hệ Hybrid
        </span>
        {combo.voltage && (
          <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${combo.voltage === 'low' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {combo.voltage === 'low' ? 'Áp Thấp' : 'Áp Cao'}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900 leading-snug">{combo.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {[combo.panel_brand, combo.inverter_brand, combo.battery_brand].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Product image */}
      <div className="relative mx-4 mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src="/sample-combo.jpg" alt={combo.name} className="w-full h-full object-cover" loading="lazy" />
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
          <p className="text-lg font-extrabold text-indigo-600 leading-tight mt-0.5">{combo.power} <span className="text-xs font-semibold text-gray-500">kWp</span></p>
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
          className="flex-1 h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
        >
          <Phone className="w-4 h-4" /> Nhận báo giá
        </a>
        <a
          href="tel:0988446113"
          className="h-11 w-24 rounded-xl border border-indigo-300 text-indigo-600 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-indigo-50 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Phone className="w-3.5 h-3.5" /> Gọi ngay
        </a>
      </div>
    </div>
  );
}

/* ─── HybridComboGrid ───────────────────────────────────── */

function HybridComboGrid() {
  const combos = FALLBACK_HYBRID_COMBOS;

  const phase1 = combos.filter(c => c.phase === '1-phase');
  const phase3lv = combos.filter(c => c.phase === '3-phase' && c.voltage === 'low');
  const phase3hv = combos.filter(c => c.phase === '3-phase' && c.voltage === 'high');
  const phase3other = combos.filter(c => c.phase === '3-phase' && !c.voltage);
  const hasVoltageSplit = phase3lv.length > 0 || phase3hv.length > 0;

  return (
    <div className="space-y-10">
      {phase1.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" aria-hidden="true" />
            Hybrid 1 Pha — Gia đình & Biệt thự
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase1.map(combo => (
              <HybridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      )}
      {hasVoltageSplit ? (
        <>
          {phase3lv.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" aria-hidden="true" />
                Hybrid 3 Pha Áp Thấp — Pin 48V
                <span className="text-xs font-normal text-gray-500 ml-1">(Low Voltage)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {phase3lv.map(combo => (
                  <HybridComboCard key={combo.id} combo={combo} />
                ))}
              </div>
            </div>
          )}
          {phase3hv.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" aria-hidden="true" />
                Hybrid 3 Pha Áp Cao — Pin 100V+
                <span className="text-xs font-normal text-gray-500 ml-1">(High Voltage)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {phase3hv.map(combo => (
                  <HybridComboCard key={combo.id} combo={combo} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : phase3other.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Hybrid 3 Pha — Doanh nghiệp & Công nghiệp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase3other.map(combo => (
              <HybridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Section Component ─────────────────────────────────── */

export default function HybridBESSPage() {
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
              src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&q=80"
              alt="Hệ thống lưu trữ năng lượng pin BESS"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-20 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
                <Battery className="h-4 w-4 text-amber-400" />
                <span>Hybrid & BESS</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Lưu Trữ Năng Lượng{' '}
                <span className="text-indigo-400">Thông Minh</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-gray-200 mb-6">
                Cho Gia Đình Và{' '}
                <span className="text-amber-400">Doanh Nghiệp</span>
              </p>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                Kết hợp điện mặt trời và hệ thống lưu trữ năng lượng tiên tiến giúp
                chủ động nguồn điện, duy trì hoạt động liên tục và tối ưu chi phí
                điện năng.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-lg shadow-indigo-500/25 min-h-[44px]"
                >
                  Nhận tư vấn giải pháp
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  Tính toán dung lượng lưu trữ
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
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <StatIcon className="h-5 w-5 text-indigo-400" />
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
          SECTION 2 — HYBRID & BESS LÀ GÌ?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="what-is-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="what-is-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Từ Điện Mặt Trời Đến{' '}
                <span className="text-indigo-600">Hệ Sinh Thái Năng Lượng</span>{' '}
                Hoàn Chỉnh
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Hai giải pháp lưu trữ năng lượng phù hợp với mọi quy mô và nhu cầu.
              </p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-8">
            {systemTypes.map((sys, idx) => {
              const SysIcon = sys.icon;
              return (
                <AnimateIn key={sys.title} delay={idx * 150}>
                  <div
                    className={`relative rounded-2xl border-2 ${sys.border} bg-white p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full`}
                  >
                    {/* Icon + gradient badge */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-14 h-14 rounded-xl ${sys.bgIcon} flex items-center justify-center flex-shrink-0`}
                      >
                        <SysIcon className={`h-7 w-7 ${sys.textIcon}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {sys.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {sys.description}
                    </p>
                    {/* Accent line */}
                    <div
                      className={`absolute bottom-0 left-8 right-8 h-1 rounded-t-full bg-gradient-to-r ${sys.accent}`}
                      aria-hidden="true"
                    />
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — BÀI TOÁN GIẢI QUYẾT (Pain Points)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-slate-900 text-white"
        aria-labelledby="pain-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="pain-heading"
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Những Bài Toán Mà Hybrid & BESS Giải Quyết
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Những vấn đề phổ biến mà hệ thống lưu trữ năng lượng giúp bạn khắc phục.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, idx) => {
              const Icon = point.icon;
              return (
                <AnimateIn key={point.title} delay={idx * 100}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {point.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — GIẢI PHÁP THEO QUY MÔ
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="scale-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="scale-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Chọn Hệ Thống Phù Hợp Với{' '}
                <span className="text-indigo-600">Quy Mô</span> Của Bạn
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Từ gia đình đến nhà máy quy mô lớn, EPCVINA Solar có giải pháp phù hợp.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {scaleTiers.map((tier, idx) => {
              const TierIcon = tier.icon;
              return (
                <AnimateIn key={tier.title} delay={idx * 100}>
                  <div
                    className={`relative rounded-2xl border-2 ${tier.border} bg-white p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full flex flex-col`}
                  >
                    {/* Icon badge */}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tier.accent} text-white mb-4`}
                    >
                      <TierIcon className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {tier.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{tier.subtitle}</p>

                    {/* Storage badge */}
                    <div
                      className={`inline-block ${tier.bg} ${tier.text} text-xs font-semibold rounded-full px-3 py-1 mb-4 w-fit`}
                    >
                      {tier.storage}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-4 flex-1">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Applications */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Ứng dụng:</span>{' '}
                        {tier.apps}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — HỆ THỐNG HOẠT ĐỘNG NHƯ THẾ NÀO?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="how-it-works-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Quản Lý Năng Lượng{' '}
                <span className="text-indigo-600">Tự Động</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Hệ thống tự động điều phối năng lượng theo từng thời điểm trong ngày.
              </p>
            </div>
          </AnimateIn>

          {/* Desktop: Horizontal flow */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div
              className="absolute top-10 left-[12%] right-[12%] h-0.5 bg-indigo-200"
              aria-hidden="true"
            />
            {scenarios.map((scenario, idx) => {
              const ScenarioIcon = scenario.icon;
              return (
                <AnimateIn key={scenario.title} delay={idx * 120}>
                  <div className="flex flex-col items-center text-center relative">
                    <div
                      className={`w-20 h-20 rounded-full ${scenario.bg} border-2 ${scenario.border} flex items-center justify-center mb-4 relative z-10`}
                    >
                      <ScenarioIcon className={`h-8 w-8 ${scenario.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {scenario.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                      {scenario.description}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          {/* Mobile: Vertical flow */}
          <div className="sm:hidden space-y-4 relative">
            {/* Vertical line */}
            <div
              className="absolute left-9 top-8 bottom-8 w-0.5 bg-indigo-200"
              aria-hidden="true"
            />
            {scenarios.map((scenario, idx) => {
              const ScenarioIcon = scenario.icon;
              return (
                <AnimateIn key={scenario.title} delay={idx * 80}>
                  <div className="flex items-start gap-4 relative">
                    <div
                      className={`w-[72px] h-[72px] rounded-full ${scenario.bg} border-2 ${scenario.border} flex items-center justify-center flex-shrink-0 relative z-10`}
                    >
                      <ScenarioIcon className={`h-7 w-7 ${scenario.color}`} />
                    </div>
                    <div className="pt-3">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — TÍNH NĂNG NỔI BẬT
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Không Chỉ Là Một Bộ Pin{' '}
                <span className="text-indigo-600">Lưu Trữ</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Hệ thống tích hợp nhiều tính năng thông minh để tối ưu năng lượng.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <AnimateIn key={feature.title} delay={idx * 80}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — HYBRID COMBO GRID
          ═══════════════════════════════════════════════════════ */}
      <section
        id="calculator"
        className="py-16 sm:py-20 bg-slate-50"
        aria-labelledby="combo-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
                <Battery className="h-4 w-4" aria-hidden="true" />
                Combo Hybrid & BESS
              </span>
              <h2
                id="combo-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                Hệ Thống Hybrid{' '}
                <span className="text-indigo-600">Sẵn Sàng Lắp Đặt</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các combo Hybrid & BESS được thiết kế sẵn, tối ưu về hiệu suất và chi
                phí cho từng nhu cầu sử dụng.
              </p>
            </div>
          </AnimateIn>
      
          <HybridComboGrid />
      
          <AnimateIn delay={100}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">
                Không tìm thấy cấu hình phù hợp?
              </p>
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full cursor-pointer transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Tư vấn cấu hình riêng
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — TẠI SAO CHỌN EPCVINA
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
                Chuyên Gia Năng Lượng Và{' '}
                <span className="text-indigo-600">Cơ Điện</span> Cho Những Hệ Thống
                Quan Trọng
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                EPCVINA Solar mang đến giải pháp lưu trữ năng lượng với cam kết chất
                lượng từ A đến Z.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <AnimateIn key={prop.title} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-indigo-600" />
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
          SECTION 9 — NGÀNH NGHỀ PHÙ HỢP
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="industries-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="industries-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Giải Pháp Được Ứng Dụng Trong Nhiều{' '}
                <span className="text-indigo-600">Lĩnh Vực</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Hybrid & BESS phù hợp với mọi loại hình công trình và doanh nghiệp.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {industries.map((industry, idx) => {
              const IndustryIcon = industry.icon;
              return (
                <AnimateIn key={industry.label} delay={idx * 60}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none cursor-default min-h-[44px]">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
                      <IndustryIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 leading-tight">
                      {industry.label}
                    </span>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 10 — CTA CUỐI TRANG
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 sm:py-24 bg-gradient-to-br from-slate-900 to-gray-900 text-white overflow-hidden"
        aria-labelledby="final-cta-heading"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2
              id="final-cta-heading"
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Sẵn Sàng Chủ Động Nguồn Điện Cho{' '}
              <span className="text-indigo-400">Tương Lai</span>?
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Từ giải pháp Hybrid cho biệt thự đến hệ thống BESS quy mô MWh cho
              doanh nghiệp, EPCVINA Solar mang đến các giải pháp lưu trữ năng lượng
              an toàn, hiệu quả và có khả năng mở rộng.
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-indigo-500/25 min-h-[44px]"
              >
                Tư Vấn Hybrid & BESS
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                Đăng Ký Khảo Sát Miễn Phí
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
