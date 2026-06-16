import {
  Sun,
  TrendingUp,
  Home,
  Users,
  Headphones,
  Zap,
  ArrowRight,
  Phone,
  Clock,
  Building2,
  Battery,
  CheckCircle2,
  XCircle,
  Smartphone,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import HeaderBar from '../../home/layout/HeaderBar';
import FooterSection from '../../home/layout/FooterSection';

/* ─── Data ──────────────────────────────────────────────── */

const heroHighlights = [
  { label: 'Giảm 50–90% hóa đơn điện', icon: CheckCircle2 },
  { label: 'Hoàn vốn từ 4–7 năm', icon: TrendingUp },
  { label: 'Tuổi thọ hệ thống trên 25 năm', icon: Clock },
  { label: 'Theo dõi sản lượng qua điện thoại', icon: Smartphone },
  { label: 'Hỗ trợ lưu trữ điện bằng pin Battery', icon: Battery },
];

const housingTypes = [
  {
    type: 'Nhà phố',
    icon: Building2,
    features: [
      'Mái bê tông hoặc mái tôn',
      'Tiền điện từ 1 triệu/tháng trở lên',
      'Muốn giảm chi phí điện lâu dài',
    ],
  },
  {
    type: 'Biệt thự',
    icon: Home,
    features: [
      'Diện tích mái lớn',
      'Nhiều thiết bị điện công suất cao',
      'Ưu tiên giải pháp năng lượng xanh',
    ],
  },
  {
    type: 'Chung cư',
    icon: Building2,
    features: [
      'Ban công hoặc khu vực lắp đặt riêng',
      'Hệ thống mini phù hợp nhu cầu sử dụng',
    ],
  },
  {
    type: 'Hộ gia đình',
    icon: Users,
    features: [
      'Từ 2–8 thành viên',
      'Điều hòa, bình nóng lạnh, bếp điện, xe điện',
    ],
  },
];

const solutionTypes = [
  {
    name: 'On-Grid Solar',
    icon: Sun,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    suitable: [
      'Khu vực điện lưới ổn định',
      'Mục tiêu chính là tiết kiệm điện',
    ],
    advantages: [
      'Chi phí đầu tư thấp nhất',
      'Hiệu quả kinh tế cao',
      'Hoàn vốn nhanh',
      'Không cần pin lưu trữ',
    ],
    limitations: [
      'Mất điện lưới hệ thống sẽ ngừng hoạt động',
    ],
    recommended: false,
  },
  {
    name: 'Hybrid Solar',
    icon: Zap,
    gradient: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    suitable: [
      'Muốn vừa tiết kiệm điện vừa dự phòng mất điện',
    ],
    advantages: [
      'Hoạt động kể cả khi mất điện',
      'Tự động ưu tiên điện mặt trời',
      'Chủ động hơn với giá điện tương lai',
      'Có thể mở rộng Battery sau này',
    ],
    limitations: [],
    recommended: true,
    note: 'Giải pháp được EPCVINA khuyến nghị nhiều nhất cho nhà ở mới.',
  },
  {
    name: 'Hybrid + Battery',
    icon: Battery,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    suitable: [
      'Khu vực thường xuyên mất điện',
      'Biệt thự cao cấp',
      'Nhà có xe điện',
      'Muốn tối đa hóa tự chủ năng lượng',
    ],
    advantages: [
      'Lưu trữ điện dư ban ngày',
      'Sử dụng điện vào buổi tối',
      'Dự phòng điện khi mất lưới',
      'Tăng tỷ lệ tự dùng điện mặt trời',
    ],
    limitations: [],
    recommended: false,
  },
];

const billToSystem = [
  { bill: '1–2 triệu', system: '3–5 kWp' },
  { bill: '2–4 triệu', system: '5–8 kWp' },
  { bill: '4–8 triệu', system: '8–12 kWp' },
  { bill: 'Trên 8 triệu', system: 'Tư vấn riêng' },
];

const implementationSteps = [
  {
    step: '01',
    title: 'Khảo sát nhu cầu',
    description: 'Thu thập thông tin tiêu thụ điện và hiện trạng mái.',
  },
  {
    step: '02',
    title: 'Thiết kế sơ bộ',
    description: 'Mô phỏng sản lượng và hiệu quả đầu tư.',
  },
  {
    step: '03',
    title: 'Báo giá chi tiết',
    description: 'Lựa chọn phương án tối ưu.',
  },
  {
    step: '04',
    title: 'Thi công lắp đặt',
    description: 'Đội ngũ kỹ sư EPCVINA triển khai.',
  },
  {
    step: '05',
    title: 'Vận hành & giám sát',
    description: 'Theo dõi trực tuyến trên điện thoại.',
  },
];

const whyChooseUs = [
  {
    category: 'Năng lực EPC',
    icon: Users,
    items: [
      'Kinh nghiệm triển khai hệ thống cơ điện',
      'Thiết kế theo tiêu chuẩn kỹ thuật',
      'Chú trọng an toàn điện và kết cấu mái',
    ],
  },
  {
    category: 'Giải pháp tối ưu',
    icon: Zap,
    items: [
      'Không bán theo công suất cố định',
      'Thiết kế riêng cho từng gia đình',
      'Tối ưu hiệu quả đầu tư',
    ],
  },
  {
    category: 'Đồng hành lâu dài',
    icon: Headphones,
    items: [
      'Hỗ trợ vận hành',
      'Giám sát từ xa',
      'Bảo trì định kỳ',
      'Mở rộng Battery và EV Charger trong tương lai',
    ],
  },
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

const FALLBACK_HYBRID_COMBOS = [
  { id: 'hyb-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hybrid 5 kWp 1 pha – 5 kWh', power: 5, battery: 5.12, price: 100500000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '4 năm 8 tháng', is_popular: true },
  { id: 'hyb-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hybrid 5 kWp 1 pha – 10 kWh', power: 5, battery: 10.24, price: 125000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '5 năm 2 tháng' },
  { id: 'hyb-88-5', slug: 'hybrid-88kw-1pha-5kwh', name: 'Hybrid 8.8 kWp 1 pha – 5 kWh', power: 8.75, battery: 5.12, price: 145000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 6 tháng', is_popular: true },
  { id: 'hyb-88-10', slug: 'hybrid-88kw-1pha-10kwh', name: 'Hybrid 8.8 kWp 1 pha – 10 kWh', power: 8.75, battery: 10.24, price: 168000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 9 tháng' },
  { id: 'hyb-88-16', slug: 'hybrid-88kw-1pha-16kwh', name: 'Hybrid 8.8 kWp 1 pha – 16 kWh', power: 8.75, battery: 16.38, price: 195000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '5 năm 1 tháng' },
  { id: 'hyb-107-10', slug: 'hybrid-107kw-1pha-10kwh', name: 'Hybrid 10.7 kWp 1 pha – 10 kWh', power: 10.63, battery: 10.24, price: 185000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '4 năm 10 tháng' },
  { id: 'hyb-107-16', slug: 'hybrid-107kw-1pha-16kwh', name: 'Hybrid 10.7 kWp 1 pha – 16 kWh', power: 10.63, battery: 16.38, price: 215000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '5 năm 3 tháng', is_popular: true },
  { id: 'hyb-157-16', slug: 'hybrid-157kw-1pha-16kwh', name: 'Hybrid 15.7 kWp 1 pha – 16 kWh', power: 15.63, battery: 16.38, price: 285000000, system_type: 'hybrid' as const, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: '5 năm 6 tháng' },
];

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

function HybridComboCard({ combo }: { combo: typeof FALLBACK_HYBRID_COMBOS[0] }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Zap className="w-3.5 h-3.5 text-orange-500" />, label: `Biến tần ${combo.inverter_brand}`, value: `${combo.power} kW` },
    { icon: <Battery className="w-3.5 h-3.5 text-blue-600" />, label: 'Pin lưu trữ', value: `${combo.battery} kWh` },
    { icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />, label: 'Sản lượng/tháng', value: `${combo.productionMin}–${combo.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />, label: 'Hoàn vốn', value: combo.paybackStr },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header - blue for hybrid */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
          <Battery className="w-3 h-3" />
          Hệ Hybrid
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
          className="flex-1 h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
        >
          <Phone className="w-4 h-4" /> Xem chi tiết
        </a>
      </div>
    </div>
  );
}

function HybridComboGrid() {
  const combos = FALLBACK_HYBRID_COMBOS;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Battery className="h-5 w-5 text-blue-600" aria-hidden="true" />
        Hybrid 1 Pha — Gia đình có dự phòng mất điện
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {combos.map(combo => (
          <HybridComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </div>
  );
}

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
                <span>Điện Mặt Trời Cho Gia Đình Hiện Đại</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Điện Mặt Trời Cho{' '}
                <span className="text-emerald-400">Gia Đình Hiện Đại</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                Tiết kiệm chi phí điện hàng tháng, chủ động nguồn năng lượng và gia tăng giá trị ngôi nhà với giải pháp điện mặt trời được thiết kế riêng cho từng gia đình.
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-8">
                {heroHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={highlight.label} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-200">{highlight.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 shadow-lg shadow-orange-500/25 min-h-[44px]"
                >
                  Nhận Thiết Kế Sơ Bộ Miễn Phí
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  Tính Nhanh Hiệu Quả Đầu Tư
                  <Zap className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 – GIẢI PHÁP DÀNH CHO AI?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="housing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="housing-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Điện Mặt Trời Phù Hợp Với Nhiều Loại Hình Nhà Ở
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Dù bạn đang sống trong loại hình nhà nào, đều có giải pháp điện mặt trời phù hợp.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {housingTypes.map((housing, idx) => {
              const Icon = housing.icon;
              return (
                <AnimateIn key={housing.type} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {housing.type}
                    </h3>
                    <ul className="space-y-2">
                      {housing.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 – CHỌN GIẢI PHÁP PHÙ HỢP
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="solutions-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="solutions-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                3 Cấp Độ Giải Pháp Năng Lượng Gia Đình
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Lựa chọn giải pháp phù hợp nhất với nhu cầu và điều kiện của gia đình bạn.
              </p>
            </div>
          </AnimateIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutionTypes.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <AnimateIn key={solution.name} delay={idx * 100}>
                  <div className={`relative rounded-2xl border-2 ${solution.recommended ? solution.borderColor : 'border-gray-200'} bg-white p-6 hover:shadow-xl transition-all duration-300 h-full ${solution.recommended ? 'shadow-lg' : ''}`}>
                    {solution.recommended && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${solution.gradient}`}>
                        Khuyến nghị
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.gradient} text-white flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {solution.name}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Phù hợp khi:</h4>
                      <ul className="space-y-2">
                        {solution.suitable.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Ưu điểm:</h4>
                      <ul className="space-y-2">
                        {solution.advantages.map((adv) => (
                          <li key={adv} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {solution.limitations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Hạn chế:</h4>
                        <ul className="space-y-2">
                          {solution.limitations.map((lim) => (
                            <li key={lim} className="flex items-start gap-2 text-sm text-gray-600">
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{lim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {solution.note && (
                      <div className={`rounded-xl ${solution.bgLight} ${solution.textColor} px-4 py-3 text-sm font-medium`}>
                        {solution.note}
                      </div>
                    )}
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3.6 – BẢNG SO SÁNH CÁC GIẢI PHÁP
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white" aria-labelledby="comparison-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="comparison-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                So Sánh Các Giải Pháp Solar Home
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Bảng so sánh chi tiết giúp bạn lựa chọn giải pháp phù hợp nhất với nhu cầu gia đình.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-bold text-gray-900 border-b-2 border-gray-200">Tiêu chí</th>
                    <th className="text-center p-4 font-bold text-amber-700 border-b-2 border-amber-200 bg-amber-50">
                      <Sun className="h-5 w-5 mx-auto mb-1" />
                      On-Grid Solar
                    </th>
                    <th className="text-center p-4 font-bold text-blue-700 border-b-2 border-blue-200 bg-blue-50">
                      <Zap className="h-5 w-5 mx-auto mb-1" />
                      Hybrid Solar
                    </th>
                    <th className="text-center p-4 font-bold text-emerald-700 border-b-2 border-emerald-200 bg-emerald-50">
                      <Battery className="h-5 w-5 mx-auto mb-1" />
                      Hybrid + Battery
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { criterion: 'Tấm pin mặt trời', ongrid: '✓', hybrid: '✓', hybridBattery: '✓' },
                    { criterion: 'Inverter Hybrid', ongrid: '✕', hybrid: '✓', hybridBattery: '✓' },
                    { criterion: 'Pin lưu trữ (Battery)', ongrid: '✕', hybrid: 'Tùy chọn nâng cấp sau', hybridBattery: '✓' },
                    { criterion: 'Kết nối điện lưới', ongrid: '✓', hybrid: '✓', hybridBattery: '✓' },
                    { criterion: 'Hoạt động khi mất điện', ongrid: '✕', hybrid: 'Có thể (nếu có ngõ Backup)', hybridBattery: '✓' },
                    { criterion: 'Dự phòng mất điện', ongrid: '✕', hybrid: 'Hạn chế', hybridBattery: '✓✓✓' },
                    { criterion: 'Sử dụng điện mặt trời ban ngày', ongrid: '✓', hybrid: '✓', hybridBattery: '✓' },
                    { criterion: 'Sử dụng điện mặt trời ban đêm', ongrid: '✕', hybrid: 'Hạn chế', hybridBattery: '✓' },
                    { criterion: 'Lưu trữ điện dư', ongrid: '✕', hybrid: 'Có thể nâng cấp', hybridBattery: '✓' },
                    { criterion: 'Tỷ lệ tự dùng điện mặt trời', ongrid: '30–50%', hybrid: '40–70%', hybridBattery: '70–95%' },
                    { criterion: 'Mức độ tự chủ năng lượng', ongrid: 'Thấp', hybrid: 'Trung bình', hybridBattery: 'Cao' },
                    { criterion: 'Khả năng mở rộng', ongrid: 'Hạn chế', hybrid: '✓✓✓', hybridBattery: '✓✓✓' },
                    { criterion: 'Chi phí đầu tư', ongrid: '$', hybrid: '$$', hybridBattery: '$$$' },
                    { criterion: 'Thời gian hoàn vốn', ongrid: 'Nhanh nhất', hybrid: 'Trung bình', hybridBattery: 'Dài hơn' },
                    { criterion: 'Phù hợp EV Charger', ongrid: 'Hạn chế', hybrid: 'Tốt', hybridBattery: 'Rất tốt' },
                    { criterion: 'Phù hợp khu vực hay mất điện', ongrid: '✕', hybrid: 'Tương đối', hybridBattery: '✓✓✓' },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 border-b border-gray-200 text-gray-900 font-medium">{row.criterion}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-amber-700 bg-amber-50/30 font-semibold">{row.ongrid}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-blue-700 bg-blue-50/30 font-semibold">{row.hybrid}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-emerald-700 bg-emerald-50/30 font-semibold">{row.hybridBattery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3.5 – ON-GRID COMBO GRID
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50" aria-labelledby="combo-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
                <Sun className="h-4 w-4" aria-hidden="true" />
                Hệ Thống Solar
              </span>
              <h2 id="combo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Combo On-Grid & Hybrid <span className="text-emerald-600">Sẵn Sàng Lắp Đặt</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các combo được thiết kế sẵn, tối ưu về hiệu suất và chi phí. On-Grid hoàn vốn nhanh, Hybrid có dự phòng mất điện.
              </p>
            </div>
          </AnimateIn>

          <OnGridComboGrid />

          <AnimateIn delay={100}>
            <div className="mt-16">
              <HybridComboGrid />
            </div>
          </AnimateIn>

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
          SECTION 4 – TÍNH NHANH HỆ THỐNG PHÙ HỢP
          ═══════════════════════════════════════════════════════ */}
      <section
        id="calculator"
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="calculator-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="calculator-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Tính Nhanh Hệ Thống Phù Hợp
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Dựa trên hóa đơn điện hàng tháng, chúng tôi đề xuất công suất hệ thống phù hợp.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Hóa đơn điện hàng tháng của bạn là bao nhiêu?
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {billToSystem.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">Hóa đơn</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{item.bill}</div>
                    <div className="text-xs text-gray-400 mb-1">Hệ đề xuất</div>
                    <div className="text-xl font-bold text-emerald-600">{item.system}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Kết quả hiển thị:</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Công suất hệ thống',
                    'Sản lượng điện dự kiến',
                    'Chi phí đầu tư',
                    'Mức tiết kiệm hàng tháng',
                    'Thời gian hoàn vốn',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 – QUY TRÌNH TRIỂN KHAI
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
                5 Bước Đơn Giản Để Sở Hữu Hệ Thống Điện Mặt Trời
              </h2>
            </div>
          </AnimateIn>

          {/* Desktop: Horizontal timeline */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 relative">
            {/* Connecting line */}
            <div
              className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-emerald-200"
              aria-hidden="true"
            />
            {implementationSteps.map((step, idx) => (
              <AnimateIn key={step.step} delay={idx * 100}>
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
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
            {implementationSteps.map((step, idx) => (
              <AnimateIn key={step.step} delay={idx * 80}>
                <div className="flex items-start gap-4 py-3 relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 relative z-10">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 – TẠI SAO CHỌN EPCVINA SOLAR?
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
                Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Khác biệt với phần lớn đơn vị bán solar hiện nay, EPCVINA nhấn mạnh năng lực kỹ thuật, an toàn điện và chất lượng thi công.
              </p>
            </div>
          </AnimateIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <AnimateIn key={item.category} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {item.category}
                    </h3>
                    <ul className="space-y-3">
                      {item.items.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-gray-600">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 – CTA CUỐI TRANG
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
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Bắt Đầu Hành Trình Tự Chủ Năng Lượng
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Từ hóa đơn điện hàng tháng của bạn, EPCVINA Solar sẽ đề xuất phương án phù hợp nhất giữa On-Grid, Hybrid hoặc Solar + Battery.
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-orange-500/25 min-h-[44px]"
              >
                Nhận Thiết Kế Sơ Bộ Miễn Phí
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:0912345678"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                <Phone className="h-5 w-5" />
                Tư vấn cùng kỹ sư EPCVINA Solar
              </a>
            </div>
          </AnimateIn>

          <AnimateIn delay={300}>
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">EPCVINA Solar</span>
                {' '}– Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 – FOOTER
          ═══════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
