import {
  Sun,
  TrendingUp,
  Home,
  Users,
  Headphones,
  Zap,
  Clock,
  Building2,
  Battery,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

/* ─── Hero Section Data ─────────────────────────────────── */

export const heroHighlights = [
  { label: 'Giảm 50–90% hóa đơn điện', icon: CheckCircle2 },
  { label: 'Hoàn vốn từ 4–7 năm', icon: TrendingUp },
  { label: 'Tuổi thọ hệ thống trên 25 năm', icon: Clock },
  { label: 'Theo dõi sản lượng qua điện thoại', icon: Smartphone },
  { label: 'Hỗ trợ lưu trữ điện bằng pin Battery', icon: Battery },
];

/* ─── Housing Types Data ────────────────────────────────── */

export const housingTypes = [
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

/* ─── Solution Types Data ───────────────────────────────── */

export interface SolutionType {
  name: string;
  icon: typeof Sun;
  gradient: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  suitable: string[];
  advantages: string[];
  limitations: string[];
  recommended: boolean;
  note?: string;
}

export const solutionTypes: SolutionType[] = [
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

/* ─── Comparison Table Data ─────────────────────────────── */

export interface ComparisonRow {
  criterion: string;
  ongrid: string;
  hybrid: string;
  hybridBattery: string;
}

export const comparisonData: ComparisonRow[] = [
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
];

/* ─── Calculator Data ───────────────────────────────────── */

export const billToSystem = [
  { bill: '1–2 triệu', system: '3–5 kWp' },
  { bill: '2–4 triệu', system: '5–8 kWp' },
  { bill: '4–8 triệu', system: '8–12 kWp' },
  { bill: 'Trên 8 triệu', system: 'Tư vấn riêng' },
];

export const calculatorResults = [
  'Công suất hệ thống',
  'Sản lượng điện dự kiến',
  'Chi phí đầu tư',
  'Mức tiết kiệm hàng tháng',
  'Thời gian hoàn vốn',
];

/* ─── Process Data ──────────────────────────────────────── */

export const implementationSteps = [
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

/* ─── Why Choose Us Data ────────────────────────────────── */

export const whyChooseUs = [
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
