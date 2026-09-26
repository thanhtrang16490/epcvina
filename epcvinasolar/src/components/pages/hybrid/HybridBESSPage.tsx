import {
  BatteryHigh,
  Sun,
  Moon,
  LightningSlash,
  TrendDown,
  Lightning,
  Receipt,
  TrendUp,
  Pulse,
  House,
  Building,
  Factory,
  HardDrives,
  Radio,
  Warehouse,
  Buildings,
  ForkKnife,
  Stethoscope,
  ShieldCheck,
  Wrench,
  Headphones,
  Users,
  Monitor,
  ChartBar,
  Calendar,
  ArrowsOut,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { getLocaleFromPathname } from '../../../i18n/messages';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';


/* ─── Data ──────────────────────────────────────────────── */

const heroStats = [
  { value: 'Dự phòng khi mất điện', label: 'Backup liên tục', icon: Lightning },
  { value: 'Tối ưu chi phí giờ cao điểm', label: 'Tiết kiệm tối đa', icon: TrendDown },
  { value: 'Quản lý năng lượng thông minh', label: 'EMS tự động', icon: Monitor },
  { value: 'Tuổi thọ pin đến 15 năm', label: 'Bền bỉ dài hạn', icon: BatteryHigh },
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
      'BatteryHigh Pack + BMS + PCS/Inverter + EMS + Hệ thống bảo vệ và giám sát. Được thiết kế cho các công trình có yêu cầu cao về tính liên tục và hiệu quả sử dụng năng lượng.',
    icon: BatteryHigh,
    accent: 'from-amber-500 to-amber-600',
    bgIcon: 'bg-amber-100',
    textIcon: 'text-amber-600',
    border: 'border-amber-200',
  },
];

const painPoints = [
  {
    icon: Lightning,
    title: 'Mất Điện Đột Xuất',
    description: 'Duy trì nguồn điện cho tải quan trọng khi điện lưới gặp sự cố.',
  },
  {
    icon: Receipt,
    title: 'Hóa Đơn Điện Cao',
    description: 'Lưu trữ điện để sử dụng vào thời điểm giá điện hoặc phụ tải cao.',
  },
  {
    icon: TrendUp,
    title: 'Công Suất Đỉnh Lớn',
    description: 'Giảm Peak Demand và tránh phát sinh chi phí công suất không cần thiết.',
  },
  {
    icon: Pulse,
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
    icon: House,
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
    icon: Building,
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
    title: 'Utility Scales BESS',
    subtitle: 'Dự án quy mô lớn',
    storage: 'Từ 1 MWh trở lên',
    features: ['Grid-level storage', 'Microgrid', 'Frequency regulation'],
    apps: 'Trang trại điện mặt trời, Khu công nghiệp lớn, Hệ thống Microgrid, Trạm năng lượng',
    accent: 'from-slate-500 to-slate-600',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    icon: HardDrives,
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
    icon: LightningSlash,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  {
    title: 'Khi Giá Điện Cao',
    description: 'Pin lưu trữ xả điện để giảm chi phí sử dụng điện lưới',
    icon: TrendDown,
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
    icon: TrendDown,
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
    icon: ArrowsOut,
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
    icon: Lightning,
    title: 'Mục tiêu đầu tư',
    examples: ['Giảm tiền điện', 'Backup khi mất điện', 'Cả hai'],
  },
  {
    icon: Clock,
    title: 'Thời gian cần dự phòng',
    examples: ['1 giờ', '2 giờ', '4 giờ', '8 giờ'],
  },
  {
    icon: TrendUp,
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
  { icon: House, label: 'Nhà dân & Biệt thự' },
  { icon: Building, label: 'Văn phòng' },
  { icon: Buildings, label: 'Khách sạn & Resort' },
  { icon: ForkKnife, label: 'Nhà hàng' },
  { icon: Stethoscope, label: 'Bệnh viện' },
  { icon: Factory, label: 'Nhà máy sản xuất' },
  { icon: Warehouse, label: 'Kho lạnh' },
  { icon: HardDrives, label: 'Data Center' },
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── HybridComboCard ───────────────────────────────────── */

function HybridComboCard({ combo }: { combo: typeof FALLBACK_HYBRID_COMBOS[0] }) {
  const investmentM = combo.price / 1000000;
  const panelCount = Math.ceil(combo.power * 1000 / 580);
  const prodMin = Math.round(combo.power * 4.2 * 30);
  const prodMax = Math.round(combo.power * 5.5 * 30);
  // Production is monthly kWh. Keep the 30-day conversion here; omitting it
  // turns a normal ~5-year system into the old, incorrect 123+ year result.
  const monthlySavings = combo.power * 4.85 * 30 * 2800;
  const paybackYears = combo.price > 0 && monthlySavings > 0
    ? combo.price / (monthlySavings * 12)
    : 0;
  const totalMonths = Math.max(0, Math.round(paybackYears * 12));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const paybackStr = totalMonths > 0
    ? (months > 0 ? `${years} năm ${months} tháng` : `${years} năm`)
    : 'Đang cập nhật';

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand || 'Aiko'}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Lightning className="w-3.5 h-3.5 text-blue-500" />, label: `Biến tần ${combo.inverter_brand || 'SAJ'}`, value: `${combo.power} kW` },
    ...(combo.battery > 0
      ? [{ icon: <BatteryHigh className="w-3.5 h-3.5 text-indigo-500" />, label: `Lưu trữ ${combo.battery_brand || 'Genxgreen'}`, value: `${combo.battery} kWh` }]
      : []),
    { icon: <ChartBar className="w-3.5 h-3.5 text-indigo-600" />, label: 'Sản lượng/tháng', value: `${prodMin}–${prodMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-indigo-600" />, label: 'Hoàn vốn', value: paybackStr },
    { icon: <House className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${Math.ceil(combo.power * 4.32)} m²` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(29,78,216,0.1)', color: '#1d4ed8' }}>
          <Lightning className="w-3 h-3" />
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
          href="/calculator"
          className="flex-1 h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
        >
          <Phone className="w-4 h-4" /> Xem chi tiết
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
            <Lightning className="h-5 w-5 text-indigo-500" aria-hidden="true" />
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
                <Lightning className="h-5 w-5 text-amber-500" aria-hidden="true" />
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
                <Lightning className="h-5 w-5 text-purple-500" aria-hidden="true" />
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
            <Lightning className="h-5 w-5 text-amber-500" aria-hidden="true" />
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

export default function HybridBESSPage({ pathname = '/' }: { pathname?: string }) {
  const locale = (['vi', 'en', 'zh', 'ja', 'ko'].includes(getLocaleFromPathname(pathname)) ? getLocaleFromPathname(pathname) : 'vi') as Locale;
  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <div className="relative">
        <HeaderBar pathname={pathname} />
        <section
          className="relative overflow-hidden bg-slate-900 text-white min-h-[70vh] sm:min-h-[80vh] flex items-center"
          aria-labelledby="hero-heading"
        >
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/images/generated/solar-hybrid-bess-hero.webp"
              alt="Hệ thống lưu trữ năng lượng pin BESS"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
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
                <BatteryHigh className="h-4 w-4 text-amber-400" />
                <span>{locale === 'vi' ? 'Hybrid & BESS' : locale === 'en' ? 'Hybrid & BESS' : locale === 'zh' ? '混合式与储能系统' : locale === 'ja' ? 'ハイブリッド＆BESS' : '하이브리드 & BESS'}</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                {locale === 'vi' ? 'Lưu Trữ Năng Lượng' : locale === 'en' ? 'Smart Energy' : locale === 'zh' ? '智能能源' : locale === 'ja' ? 'スマートエネルギー' : '스마트 에너지'}{' '}
                <span className="text-indigo-400">{locale === 'vi' ? 'Thông Minh' : locale === 'en' ? 'Storage' : locale === 'zh' ? '储存' : locale === 'ja' ? '蓄電' : '저장'}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-gray-200 mb-6">
                {locale === 'vi' ? 'Cho Gia Đình Và' : locale === 'en' ? 'For Homes And' : locale === 'zh' ? '面向家庭与' : locale === 'ja' ? '家庭と' : '가정과'}{' '}
                <span className="text-amber-400">{locale === 'vi' ? 'Doanh Nghiệp' : locale === 'en' ? 'Businesses' : locale === 'zh' ? '企业' : locale === 'ja' ? '企業' : '기업'}</span>
              </p>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                {locale === 'vi' ? 'Kết hợp điện mặt trời và hệ thống lưu trữ năng lượng tiên tiến giúp chủ động nguồn điện, duy trì hoạt động liên tục và tối ưu chi phí điện năng.' : locale === 'en' ? 'Combine solar power with advanced energy storage to secure backup power, keep operations running, and optimize electricity costs.' : locale === 'zh' ? '将太阳能与先进储能系统结合，实现备用供电、持续运行和电费优化。' : locale === 'ja' ? '太陽光発電と高度な蓄電システムを組み合わせ、バックアップ電源の確保、継続運転、電気料金の最適化を実現します。' : '태양광과 첨단 에너지 저장 시스템을 결합해 백업 전원 확보, 지속 운영, 전기요금 최적화를 실현합니다.'}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-lg shadow-indigo-500/25 min-h-[44px]"
                >
                  {locale === 'vi' ? 'Nhận tư vấn giải pháp' : locale === 'en' ? 'Request a solution consult' : locale === 'zh' ? '获取方案咨询' : locale === 'ja' ? 'ご提案を依頼' : '솔루션 상담 받기'}
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  {locale === 'vi' ? 'Tính toán dung lượng lưu trữ' : locale === 'en' ? 'Calculate storage capacity' : locale === 'zh' ? '计算储能容量' : locale === 'ja' ? '蓄電容量を計算' : '저장 용량 계산'}
                  <Lightning className="h-5 w-5" />
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {heroStats.map((stat, idx) => {
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
                          {locale === 'vi' ? stat.value : locale === 'en' ? ['Backup during outages','Peak cost optimization','Smart energy management','Battery life up to 15 years'][idx] : locale === 'zh' ? ['停电备用','优化高峰成本','智能能源管理','电池寿命长达15年'][idx] : locale === 'ja' ? ['停電時のバックアップ','ピーク時間コスト最適化','スマートエネルギー管理','最大15年の電池寿命'][idx] : ['정전 대비 백업','피크 비용 최적화','스마트 에너지 관리','최대 15년 배터리 수명'][idx]}
                        </div>
                        <div className="text-xs text-gray-400">{locale === 'vi' ? stat.label : locale === 'en' ? ['Continuous backup','Maximum savings','Automated EMS','Long-lasting'][idx] : locale === 'zh' ? ['持续供电','节省更多','自动 EMS','持久耐用'][idx] : locale === 'ja' ? ['連続バックアップ','最大節約','自動 EMS','長寿命'][idx] : ['연속 백업','최대 절감','자동 EMS','장기 내구성'][idx]}</div>
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
                {locale === 'vi' ? 'Từ Điện Mặt Trời Đến' : locale === 'en' ? 'From Solar Power To A' : locale === 'zh' ? '从太阳能到' : locale === 'ja' ? '太陽光から' : '태양광에서'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Hệ Sinh Thái Năng Lượng' : locale === 'en' ? 'Complete Energy Ecosystem' : locale === 'zh' ? '完整能源生态系统' : locale === 'ja' ? '完全なエネルギーエコシステム' : '완전한 에너지 생태계'}</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Hai giải pháp lưu trữ năng lượng phù hợp với mọi quy mô và nhu cầu.' : locale === 'en' ? 'Two energy storage options for every scale and use case.' : locale === 'zh' ? '两种储能方案，适配不同规模与需求。' : locale === 'ja' ? '規模や用途に応じた2つの蓄電ソリューション。' : '규모와 용도에 맞는 두 가지 에너지 저장 솔루션.'}
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
                {locale === 'vi' ? 'Những Bài Toán Mà Hybrid & BESS Giải Quyết' : locale === 'en' ? 'Problems Hybrid & BESS Solve' : locale === 'zh' ? 'Hybrid 与 BESS 解决的痛点' : locale === 'ja' ? 'Hybrid と BESS が解決する課題' : 'Hybrid & BESS가 해결하는 문제'}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Những vấn đề phổ biến mà hệ thống lưu trữ năng lượng giúp bạn khắc phục.' : locale === 'en' ? 'Common energy challenges that storage systems can help you overcome.' : locale === 'zh' ? '储能系统可帮助您应对常见能源问题。' : locale === 'ja' ? '蓄電システムが一般的なエネルギー課題を解決します。' : '저장 시스템이 흔한 에너지 문제를 해결합니다.'}
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
                {locale === 'vi' ? 'Chọn Hệ Thống Phù Hợp Với' : locale === 'en' ? 'Choose The Right System For' : locale === 'zh' ? '选择适合您' : locale === 'ja' ? '規模に合った' : '규모에 맞는'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Quy Mô' : locale === 'en' ? 'Your Scale' : locale === 'zh' ? '规模' : locale === 'ja' ? 'システムを' : '시스템을'}</span>{' '}
                {locale === 'vi' ? 'Của Bạn' : locale === 'en' ? '' : locale === 'zh' ? '的系统' : locale === 'ja' ? '選ぶ' : '선택'}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Từ gia đình đến nhà máy quy mô lớn, EPCVINA Solar có giải pháp phù hợp.' : locale === 'en' ? 'From homes to large industrial plants, EPCVINA Solar has a suitable solution.' : locale === 'zh' ? '从家庭到大型工厂，EPCVINA Solar 都有合适方案。' : locale === 'ja' ? '住宅から大型工場まで、EPCVINA Solar が最適解をご用意します。' : '가정부터 대형 공장까지, EPCVINA Solar가 적합한 솔루션을 제공합니다.'}
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
                {locale === 'vi' ? 'Quản Lý Năng Lượng' : locale === 'en' ? 'Automated Energy' : locale === 'zh' ? '自动化能源' : locale === 'ja' ? '自動エネルギー' : '자동 에너지'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Tự Động' : locale === 'en' ? 'Management' : locale === 'zh' ? '管理' : locale === 'ja' ? '管理' : '관리'}</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Hệ thống tự động điều phối năng lượng theo từng thời điểm trong ngày.' : locale === 'en' ? 'The system automatically manages energy through every time of day.' : locale === 'zh' ? '系统会根据一天中的不同时间自动调配能源。' : locale === 'ja' ? 'システムが時間帯ごとに自動でエネルギーを配分します。' : '시스템이 하루의 각 시간대에 맞춰 에너지를 자동으로 배분합니다.'}
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
                {locale === 'vi' ? 'Không Chỉ Là Một Bộ Pin' : locale === 'en' ? 'More Than Just A Battery' : locale === 'zh' ? '不仅仅是' : locale === 'ja' ? '単なる蓄電池' : '단순한 배터리'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Lưu Trữ' : locale === 'en' ? 'Storage' : locale === 'zh' ? '储能电池' : locale === 'ja' ? 'ではありません' : '저장 그 이상'}</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Hệ thống tích hợp nhiều tính năng thông minh để tối ưu năng lượng.' : locale === 'en' ? 'Integrated smart features help you optimize energy use.' : locale === 'zh' ? '多种智能功能助您优化能源使用。' : locale === 'ja' ? 'スマート機能を統合し、エネルギー使用を最適化します。' : '통합 스마트 기능으로 에너지 사용을 최적화합니다.'}
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
                <BatteryHigh className="h-4 w-4" aria-hidden="true" />
                {locale === 'vi' ? 'Combo Hybrid & BESS' : locale === 'en' ? 'Hybrid & BESS Combos' : locale === 'zh' ? 'Hybrid 与 BESS 组合' : locale === 'ja' ? 'Hybrid & BESS 構成' : 'Hybrid & BESS 조합'}
              </span>
              <h2
                id="combo-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                {locale === 'vi' ? 'Hệ Thống Hybrid' : locale === 'en' ? 'Ready-to-Deploy Hybrid Systems' : locale === 'zh' ? 'Hybrid 系统' : locale === 'ja' ? 'Hybrid システム' : '하이브리드 시스템'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Sẵn Sàng Lắp Đặt' : locale === 'en' ? 'Ready To Deploy' : locale === 'zh' ? '可直接部署' : locale === 'ja' ? '導入可能' : '즉시 구축 가능'}</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {locale === 'vi' ? 'Các combo Hybrid & BESS được thiết kế sẵn, tối ưu về hiệu suất và chi phí cho từng nhu cầu sử dụng.' : locale === 'en' ? 'Preconfigured Hybrid & BESS combos optimized for performance and cost for each use case.' : locale === 'zh' ? '预设 Hybrid 与 BESS 组合，针对不同场景优化性能与成本。' : locale === 'ja' ? '用途ごとに性能とコストを最適化した Hybrid & BESS の事前構成。' : '각 사용 목적에 맞게 성능과 비용을 최적화한 Hybrid & BESS 사전 구성.'}
              </p>
            </div>
          </AnimateIn>
      
          <HybridComboGrid />
      
          <AnimateIn delay={100}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">
                {locale === 'vi' ? 'Không tìm thấy cấu hình phù hợp?' : locale === 'en' ? 'Did not find a matching configuration?' : locale === 'zh' ? '没有找到合适的配置？' : locale === 'ja' ? '最適な構成が見つかりませんか？' : '맞는 구성을 찾지 못하셨나요?'}
              </p>
              <a
                href="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full cursor-pointer transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {locale === 'vi' ? 'Tư vấn cấu hình riêng' : locale === 'en' ? 'Request a custom design' : locale === 'zh' ? '咨询定制方案' : locale === 'ja' ? '個別設計を依頼' : '맞춤 설계 요청'}
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
                {locale === 'vi' ? 'Chuyên Gia Năng Lượng Và' : locale === 'en' ? 'Energy & MEP Specialists' : locale === 'zh' ? '能源与机电专家' : locale === 'ja' ? 'エネルギー・MEP 専門チーム' : '에너지 & MEP 전문가'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Cơ Điện' : locale === 'en' ? '' : locale === 'zh' ? '' : locale === 'ja' ? '' : ''}</span>{' '}
                {locale === 'vi' ? 'Cho Những Hệ Thống Quan Trọng' : locale === 'en' ? '' : locale === 'zh' ? '' : locale === 'ja' ? '' : ''}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'EPCVINA Solar mang đến giải pháp lưu trữ năng lượng với cam kết chất lượng từ A đến Z.' : locale === 'en' ? 'EPCVINA Solar delivers energy storage solutions with end-to-end quality commitments.' : locale === 'zh' ? 'EPCVINA Solar 提供从 A 到 Z 的高品质储能解决方案。' : locale === 'ja' ? 'EPCVINA Solar は A から Z まで一貫した品質を約束する蓄電ソリューションを提供します。' : 'EPCVINA Solar는 A부터 Z까지 품질을 보장하는 에너지 저장 솔루션을 제공합니다.'}
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
                {locale === 'vi' ? 'Giải Pháp Được Ứng Dụng Trong Nhiều' : locale === 'en' ? 'Solutions Used Across Many' : locale === 'zh' ? '适用于多个' : locale === 'ja' ? '幅広い' : '다양한'}{' '}
                <span className="text-indigo-600">{locale === 'vi' ? 'Lĩnh Vực' : locale === 'en' ? 'Industries' : locale === 'zh' ? '领域' : locale === 'ja' ? '分野' : '분야'}</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {locale === 'vi' ? 'Hybrid & BESS phù hợp với mọi loại hình công trình và doanh nghiệp.' : locale === 'en' ? 'Hybrid & BESS fits a wide range of buildings and businesses.' : locale === 'zh' ? 'Hybrid 与 BESS 适用于各类建筑与企业。' : locale === 'ja' ? 'Hybrid & BESS はあらゆる建物と事業に適しています。' : 'Hybrid & BESS는 다양한 건물과 기업에 적합합니다.'}
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
              {locale === 'vi' ? 'Sẵn Sàng Chủ Động Nguồn Điện Cho' : locale === 'en' ? 'Ready To Take Control Of Power For' : locale === 'zh' ? '准备好为' : locale === 'ja' ? '電力を自ら確保する' : '전력을 주도적으로 확보할'}{' '}
              <span className="text-indigo-400">{locale === 'vi' ? 'Tương Lai' : locale === 'en' ? 'The Future' : locale === 'zh' ? '未来' : locale === 'ja' ? '未来' : '미래'}</span>?
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {locale === 'vi' ? 'Từ giải pháp Hybrid cho biệt thự đến hệ thống BESS quy mô MWh cho doanh nghiệp, EPCVINA Solar mang đến các giải pháp lưu trữ năng lượng an toàn, hiệu quả và có khả năng mở rộng.' : locale === 'en' ? 'From villa hybrid solutions to MWh-scale BESS for businesses, EPCVINA Solar delivers safe, efficient, and scalable energy storage.' : locale === 'zh' ? '从别墅混合方案到企业级 MWh 储能系统，EPCVINA Solar 提供安全、高效且可扩展的储能方案。' : locale === 'ja' ? 'ヴィラ向け Hybrid から企業向けの MWh 級 BESS まで、EPCVINA Solar は安全で効率的、拡張性のある蓄電ソリューションを提供します。' : '빌라용 하이브리드부터 기업용 MWh급 BESS까지, EPCVINA Solar는 안전하고 효율적이며 확장 가능한 에너지 저장 솔루션을 제공합니다.'}
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-indigo-500/25 min-h-[44px]"
              >
                {locale === 'vi' ? 'Tư Vấn Hybrid & BESS' : locale === 'en' ? 'Consult Hybrid & BESS' : locale === 'zh' ? '咨询 Hybrid 与 BESS' : locale === 'ja' ? 'Hybrid & BESS を相談' : 'Hybrid & BESS 상담'}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                {locale === 'vi' ? 'Đăng Ký Khảo Sát Miễn Phí' : locale === 'en' ? 'Request A Free Survey' : locale === 'zh' ? '申请免费勘察' : locale === 'ja' ? '無料調査を申し込む' : '무료 현장조사 신청'}
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
    </div>
  );
}
