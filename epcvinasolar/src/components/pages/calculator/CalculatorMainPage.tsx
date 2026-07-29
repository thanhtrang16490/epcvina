import { useEffect, useState } from 'react';
import CalculatorPageShell from './CalculatorPageShell';

const calculatorScreens = ['region', 'bill', 'roof', 'usage', 'result', 'survey'] as const;
const epcvinaHotlineHref = 'tel:0988446113';
const epcvinaHotlineLabel = '0988 446 113';

const billTypes = [
  { id: 'family', title: 'Gia đình', desc: 'Nhà ở, biệt thự' },
  { id: 'business', title: 'Kinh doanh', desc: 'Quán, cửa hàng' },
  { id: 'factory', title: 'Nhà xưởng', desc: 'Cơ sở sản xuất' },
];

const quickBillsByType = {
  family: [
    { label: '500k', value: 500000 },
    { label: '1 triệu', value: 1000000 },
    { label: '2 triệu', value: 2000000 },
    { label: '3 triệu', value: 3000000 },
    { label: '5 triệu', value: 5000000 },
    { label: '8 triệu', value: 8000000 },
  ],
  business: [
    { label: '3 triệu', value: 3000000 },
    { label: '5 triệu', value: 5000000 },
    { label: '10 triệu', value: 10000000 },
    { label: '20 triệu', value: 20000000 },
    { label: '30 triệu', value: 30000000 },
    { label: '50 triệu', value: 50000000 },
  ],
  factory: [
    { label: '20 triệu', value: 20000000 },
    { label: '50 triệu', value: 50000000 },
    { label: '100 triệu', value: 100000000 },
    { label: '200 triệu', value: 200000000 },
    { label: '500 triệu', value: 500000000 },
  ],
};

const defaultBillByType: Record<string, number> = {
  family: 3000000,
  business: 10000000,
  factory: 50000000,
};

const defaultRoofAreaByType: Record<string, number> = {
  family: 60,
  business: 180,
  factory: 900,
};

const defaultRoofTypeByBillType: Record<string, string> = {
  family: 'flat',
  business: 'flat',
  factory: 'metal',
};

const defaultDayUsageByBillType: Record<string, number> = {
  family: 70,
  business: 50,
  factory: 90,
};

const usageProfileLabels: Record<string, string> = {
  family: 'Gia đình thường dùng điện cả ban ngày và buổi tối, nên mặc định 70% ban ngày / 30% ban đêm để kiểm tra phương án Hybrid.',
  business: 'Văn phòng, cửa hàng có tải khá cân bằng, nên mặc định 50% ban ngày / 50% ban đêm để xem nhu cầu Hybrid và pin dự phòng.',
  factory: 'Nhà xưởng thường chạy tải chính ban ngày, nên mặc định 90% ban ngày / 10% ban đêm để ưu tiên hệ hòa lưới tối ưu chi phí.',
};

const storageSizingProfiles: Record<string, {
  triggerNightPercent: number;
  nightCoverageRatio: number;
  maxKwhPerKwp: number;
  minKwh: number;
  maxKwh: number;
  note: string;
}> = {
  family: {
    triggerNightPercent: 25,
    nightCoverageRatio: 0.72,
    maxKwhPerKwp: 1.25,
    minKwh: 5,
    maxKwh: 40,
    note: 'Pin gia đình ưu tiên phủ một phần tải buổi tối và dự phòng thiết yếu, không cố gắng ôm toàn bộ điện ban đêm.',
  },
  business: {
    triggerNightPercent: 35,
    nightCoverageRatio: 0.45,
    maxKwhPerKwp: 1.05,
    minKwh: 10,
    maxKwh: 160,
    note: 'Pin cho văn phòng/cửa hàng được tính theo tải cân bằng ngày đêm, ưu tiên tự dùng và dự phòng tải quan trọng.',
  },
  factory: {
    triggerNightPercent: 35,
    nightCoverageRatio: 0.25,
    maxKwhPerKwp: 0.65,
    minKwh: 30,
    maxKwh: 300,
    note: 'Nhà xưởng chỉ nên đề xuất pin sơ bộ cho tải quan trọng hoặc ca đêm; hệ BESS lớn cần khảo sát biểu đồ phụ tải.',
  },
};

const roofTypes = [
  { id: 'metal', title: 'Mái tôn', desc: 'Không phụ phí' },
  { id: 'tile', title: 'Mái ngói', desc: 'Phát sinh phí khung đỡ' },
  { id: 'flat', title: 'Mái bê tông / phẳng', desc: 'Phát sinh phí khung đỡ' },
];

const roofCostAdders: Record<string, { min: number; max: number; label: string }> = {
  metal: { min: 0, max: 0, label: 'Không phụ phí mái' },
  tile: { min: 0.75, max: 1.15, label: 'Có phụ phí khung mái ngói' },
  flat: { min: 0.45, max: 0.85, label: 'Có phụ phí khung nghiêng mái phẳng' },
};

const phaseTypes = [
  { id: 'one', title: '1 Pha', desc: 'Hộ gia đình' },
  { id: 'three', title: '3 Pha', desc: 'Doanh nghiệp' },
];

const loadProfiles = [
  {
    id: 'standard',
    phase: 'one',
    title: 'Không có tải lớn',
    desc: 'Điều hòa dân dụng, bếp, thiết bị văn phòng thông thường',
  },
  {
    id: 'heavy',
    phase: 'three',
    title: 'Có tải lớn',
    desc: 'Điều hòa tổng, thang máy, bơm hoặc máy công suất lớn',
  },
];

const installTimingOptions = [
  { id: 'soonest', label: 'Sớm nhất có thể' },
  { id: '30days', label: 'Trong 30 ngày tới' },
  { id: '1-3months', label: '1–3 tháng tới' },
  { id: 'researching', label: 'Chỉ đang tìm hiểu' },
];

const trustProjects = [
  {
    title: 'Samsung SEVT Thái Nguyên',
    image: '/du-an/DU-AN-SAMSUNG---SEVT-THAI-NGUYEN.jpg',
  },
  {
    title: 'Keangnam Landmark Tower',
    image: '/du-an/DU-AN-KEANG-NAM-LAND-MARK-TOWER.jpg',
  },
  {
    title: 'Lotte Center Hà Nội',
    image: '/du-an/DU-ANLOTTE-CENTER-HANOI.jpg',
  },
];

const regions = [
  { id: 'north', label: 'Miền Bắc', sub: '25 tỉnh/thành' },
  { id: 'central', label: 'Miền Trung', sub: '19 tỉnh/thành' },
  { id: 'south', label: 'Miền Nam', sub: '19 tỉnh/thành' },
];

const regionSolarProfiles: Record<string, { factor: number; label: string }> = {
  north: { factor: 0.94, label: 'Miền Bắc: sản lượng nắng thận trọng hơn' },
  central: { factor: 1, label: 'Miền Trung: sản lượng nắng trung bình tốt' },
  south: { factor: 1.07, label: 'Miền Nam: sản lượng nắng tốt hơn' },
};

const regionDetails: Record<string, string[]> = {
  north: [
    'Hà Nội',
    'Hải Phòng',
    'Quảng Ninh',
    'Hải Dương',
    'Hưng Yên',
    'Bắc Ninh',
    'Bắc Giang',
    'Vĩnh Phúc',
    'Phú Thọ',
    'Thái Nguyên',
    'Thái Bình',
    'Nam Định',
    'Hà Nam',
    'Ninh Bình',
    'Hòa Bình',
    'Hà Giang',
    'Cao Bằng',
    'Bắc Kạn',
    'Tuyên Quang',
    'Lạng Sơn',
    'Lào Cai',
    'Yên Bái',
    'Điện Biên',
    'Lai Châu',
    'Sơn La',
  ],
  central: [
    'Thanh Hóa',
    'Nghệ An',
    'Hà Tĩnh',
    'Quảng Bình',
    'Quảng Trị',
    'Thừa Thiên Huế',
    'Đà Nẵng',
    'Quảng Nam',
    'Quảng Ngãi',
    'Bình Định',
    'Phú Yên',
    'Khánh Hòa',
    'Ninh Thuận',
    'Bình Thuận',
    'Đắk Lắk',
    'Đắk Nông',
    'Gia Lai',
    'Kon Tum',
    'Lâm Đồng',
  ],
  south: [
    'TP. HCM',
    'Bình Dương',
    'Đồng Nai',
    'Bà Rịa - Vũng Tàu',
    'Long An',
    'Tiền Giang',
    'Bến Tre',
    'Vĩnh Long',
    'Đồng Tháp',
    'An Giang',
    'Kiên Giang',
    'Cần Thơ',
    'Hậu Giang',
    'Sóc Trăng',
    'Bạc Liêu',
    'Cà Mau',
    'Tây Ninh',
    'Bình Phước',
    'Trà Vinh',
  ],
};

const formatDecimal = (value: number) =>
  value.toLocaleString('vi-VN', {
    maximumFractionDigits: 1,
  });
const formatCurrency = (value: number) => {
  const rounded = Math.round(value);
  if (rounded >= 1000000000) return `${formatDecimal(rounded / 1000000000)} tỉ`;
  return `${rounded.toLocaleString('vi-VN')}đ`;
};
const formatMillionShort = (value: number) => {
  if (value >= 1000) return `${formatDecimal(value / 1000)} tỉ`;
  return `${formatDecimal(value)} tr`;
};
const formatMillionLong = (value: number) => {
  if (value >= 1000) return `${formatDecimal(value / 1000)} tỉ`;
  return `${formatDecimal(value)} triệu`;
};
const formatMillionRange = (min: number, max: number) => `${formatMillionShort(min)}–${formatMillionShort(max)}`;
const formatYears = (value: number) => `${formatDecimal(value)} năm`;
const formatInputMoney = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('vi-VN') : '';
};
const parseInputMoney = (value: string) => value.replace(/\D/g, '');
const formatStorageKwh = (value: number) => {
  if (value >= 1000) return `${Math.round(value / 100) / 10} MWh`;
  return `${value} kWh`;
};
const getStorageStepKwh = (value: number, billType: string) => {
  if (billType === 'factory') return value > 100 ? 50 : 20;
  if (billType === 'business') return value > 80 ? 20 : value > 20 ? 10 : 5;
  return value > 20 ? 10 : 5;
};
const selectInverterKw = (systemKwp: number, phase: string) => {
  const targetKw = systemKwp * (phase === 'three' ? 0.95 : 0.9);
  const commonSizes = phase === 'three'
    ? [10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110, 125]
    : [3, 3.6, 5, 6, 8, 10, 12];
  const matchedSize = commonSizes.find((size) => size >= targetKw);
  return matchedSize ?? Math.ceil(targetKw / 10) * 10;
};
const normalizeVietnamese = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
const isLikelyVietnamPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return /^(0|\+?84)?[1-9]\d{8,9}$/.test(digits);
};

function OptionIcon({ type }: { type: string }) {
  const common = "h-5 w-5";

  if (type === 'family') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }

  if (type === 'business') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 20V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v14" />
        <path d="M8 8h5M8 12h5M8 16h5" />
        <path d="M17 10h1a2 2 0 0 1 2 2v8" />
      </svg>
    );
  }

  if (type === 'factory') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 20V9l6 4V9l6 4V5h4v15" />
        <path d="M5 17h2M10 17h2M15 17h2" />
      </svg>
    );
  }

  if (type === 'metal') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 15 12 7l8 8" />
        <path d="M7 15h10M9 17h6" />
      </svg>
    );
  }

  if (type === 'tile') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12c2-4 5-6 8-6s6 2 8 6" />
        <path d="M5 16c2-2 4-3 7-3s5 1 7 3" />
      </svg>
    );
  }

  if (type === 'flat') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 8h16v8H4z" />
        <path d="M7 12h10" />
      </svg>
    );
  }

  if (type === 'one' || type === 'three') {
    return (
      <span className="text-[16px] font-black leading-none" aria-hidden="true">
        {type === 'one' ? '1' : '3'}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? <path d="m6 14 6-6 6 6" /> : <path d="m6 10 6 6 6-6" />}
    </svg>
  );
}

function ResultMetricIcon({ type }: { type: 'power' | 'panel' | 'grid' | 'cost' }) {
  const common = 'h-4 w-4';

  if (type === 'panel') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16v11H4z" />
        <path d="M8 7v11M16 7v11M4 12.5h16" />
      </svg>
    );
  }

  if (type === 'grid') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v18M5 8h14M7 16h10" />
        <path d="M8 21h8" />
      </svg>
    );
  }

  if (type === 'cost') {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v18" />
        <path d="M17 7.5c-.8-1-2.2-1.5-4-1.5-2.4 0-4 1.1-4 2.8 0 4 8 1.8 8 5.9 0 1.9-1.7 3.3-4.6 3.3-2 0-3.7-.6-4.8-1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 5 13h6l-1 9 9-13h-6l1-7Z" />
    </svg>
  );
}

function StepProgress({ value, dark = false }: { value: number; dark?: boolean }) {
  return (
    <div
      className={`mt-3 h-1.5 overflow-hidden rounded-full ${dark ? 'bg-white/12' : 'bg-[#F2E5D2]'}`}
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-[#F5831F] transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function PaybackChart({
  minYears,
  maxYears,
  averageYears,
  investmentMillion,
  annualSavingMillion,
}: {
  minYears: number;
  maxYears: number;
  averageYears: number;
  investmentMillion: number;
  annualSavingMillion: number;
}) {
  const axisStart = 44;
  const axisEnd = 296;
  const axisWidth = axisEnd - axisStart;
  const chartTop = 34;
  const chartBottom = 131;
  const maxValue = Math.max(investmentMillion, annualSavingMillion * 12, 1) * 1.08;
  const xForYear = (value: number) => axisStart + (Math.max(0, Math.min(12, value)) / 12) * axisWidth;
  const yForValue = (value: number) => chartBottom - (Math.max(0, Math.min(maxValue, value)) / maxValue) * (chartBottom - chartTop);
  const minX = xForYear(minYears);
  const maxX = xForYear(maxYears);
  const averageX = xForYear(averageYears);
  const investmentY = yForValue(investmentMillion);
  const savingEndY = yForValue(annualSavingMillion * 12);
  const labelAnchor = averageX > 260 ? 'end' : averageX < 76 ? 'start' : 'middle';
  const savingPath = `M${axisStart} ${chartBottom} L${axisEnd} ${savingEndY}`;
  const savingArea = `${savingPath} L${axisEnd} ${chartBottom} Z`;

  return (
    <svg
      viewBox="0 0 332 176"
      className="block h-auto w-full"
      role="img"
      aria-label={`Thời gian hoàn vốn khoảng ${averageYears.toFixed(1)} năm, dao động từ ${minYears.toFixed(1)} đến ${maxYears.toFixed(1)} năm`}
    >
      <defs>
        <linearGradient id="paybackFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F58220" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F58220" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="paybackRange" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F58220" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path d={savingArea} fill="url(#paybackFill)" />
      <path d={`M${axisStart} ${investmentY}H${axisEnd}`} stroke="#414042" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d={savingPath} fill="none" stroke="#F58220" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 131H296" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${minX} ${investmentY}H${maxX}`} stroke="url(#paybackRange)" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${averageX} ${investmentY}V131`} stroke="#414042" strokeWidth="2" strokeLinecap="round" opacity="0.58" />
      <circle cx={averageX} cy={investmentY} r="6.5" fill="#414042" />
      <circle cx={averageX} cy={investmentY} r="3" fill="#FFB020" />
      <path d="M44 160H296" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
      <text x="44" y="153" fill="#71717A" fontSize="11" fontWeight="400">
        0
      </text>
      <text x="292" y="153" fill="#71717A" fontSize="11" fontWeight="400" textAnchor="end">
        12
      </text>
      <text x="50" y={Math.max(44, investmentY - 8)} fill="#414042" fontSize="11" fontWeight="700">
        Vốn đầu tư
      </text>
      <text x="292" y={Math.max(42, savingEndY - 8)} fill="#F58220" fontSize="10.5" fontWeight="700" textAnchor="end">
        Tiết kiệm tích luỹ
      </text>
      <text x={averageX} y="153" fill="#414042" fontSize="11" fontWeight="800" textAnchor={labelAnchor}>
        ~{averageYears.toFixed(1)} năm
      </text>
      <text x={averageX} y="169" fill="#71717A" fontSize="9.5" fontWeight="500" textAnchor={labelAnchor}>
        khoảng {minYears.toFixed(1)}–{maxYears.toFixed(1)}
      </text>
    </svg>
  );
}

export default function CalculatorMainPage() {
  const [screen, setScreen] = useState<'region' | 'bill' | 'roof' | 'usage' | 'result' | 'survey'>('region');
  const [expandedRegion, setExpandedRegion] = useState('north');
  const [province, setProvince] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [billType, setBillType] = useState('family');
  const [billAmount, setBillAmount] = useState('3000000');
  const [roofType, setRoofType] = useState('flat');
  const [roofArea, setRoofArea] = useState('60');
  const [dayUsage, setDayUsage] = useState(defaultDayUsageByBillType.family);
  const [loadProfile, setLoadProfile] = useState('standard');
  const [phaseType, setPhaseType] = useState('one');
  const [showTech, setShowTech] = useState(false);
  const [resultSlide, setResultSlide] = useState<'estimate' | 'saving' | 'environment'>('saving');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [installTiming, setInstallTiming] = useState('30days');
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyAttempted, setSurveyAttempted] = useState(false);

  useEffect(() => {
    if (!calculatorScreens.includes(screen)) {
      setScreen('region');
    }
  }, [screen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    if (source !== 'family-landing') return;

    const typeParam = params.get('type');
    const billParam = params.get('bill')?.replace(/\D/g, '');
    const roofParam = params.get('roof')?.replace(/[^\d.]/g, '');
    const dayParam = Number(params.get('day'));
    const provinceParam = params.get('province');
    const validBillType = billTypes.some((item) => item.id === typeParam) ? (typeParam as string) : 'family';
    const validDayUsage = Number.isFinite(dayParam) ? Math.max(10, Math.min(95, Math.round(dayParam))) : defaultDayUsageByBillType.family;

    setBillType(validBillType);
    setBillAmount(billParam || String(defaultBillByType.family));
    setRoofArea(roofParam || String(defaultRoofAreaByType.family));
    setRoofType(defaultRoofTypeByBillType[validBillType] || defaultRoofTypeByBillType.family);
    setDayUsage(validDayUsage);
    setProvince(provinceParam || 'Hà Nội');
    setExpandedRegion('north');
    setLoadProfile('standard');
    setPhaseType(validBillType === 'factory' ? 'three' : 'one');
    setScreen('result');
  }, []);

  const activeScreen = calculatorScreens.includes(screen) ? screen : 'region';
  const billValue = Number(billAmount) || 0;
  const quickBills = quickBillsByType[billType as keyof typeof quickBillsByType];
  const selectedBillType = billTypes.find((item) => item.id === billType) ?? billTypes[0];
  const roofValue = Number(roofArea) || 0;
  const nightUsage = 100 - dayUsage;
  const storageSizingProfile = storageSizingProfiles[billType] ?? storageSizingProfiles.family;
  const isNightUsageHigh = nightUsage >= storageSizingProfile.triggerNightPercent;
  const canContinueBill = billValue > 0;
  const canContinueRoof = Boolean(roofType) && roofValue > 0;
  const customerNameError = customerName.trim().length > 1 ? '' : 'Vui lòng nhập họ tên để kỹ thuật viên tiện xưng hô.';
  const customerPhoneError = isLikelyVietnamPhone(customerPhone) ? '' : 'Vui lòng nhập số điện thoại/Zalo hợp lệ tại Việt Nam.';
  const canSubmitSurvey = !customerNameError && !customerPhoneError;
  const roofPotentialKwp = Math.round((roofValue / 6.5) * 10) / 10;
  const shouldAskLoadProfile = billType !== 'factory';
  const shouldPreferHybridReady = billType !== 'factory';
  const usageHint =
    isNightUsageHigh
      ? 'Nhà dùng nhiều sau giờ nắng. EPCVINA sẽ ưu tiên phương án hybrid để tăng tự dùng và có điện dự phòng.'
      : shouldPreferHybridReady
        ? 'Tải ban đêm hiện chưa đủ lớn để lắp pin ngay. EPCVINA vẫn ưu tiên inverter Hybrid-ready để sau này nâng cấp pin dễ hơn.'
        : 'Phần lớn điện được dùng ban ngày. Phương án hòa lưới thường gọn chi phí và hoàn vốn dễ hơn.';
  const usageProfileHint = usageProfileLabels[billType] ?? usageProfileLabels.family;
  const normalizedSearchTerm = normalizeVietnamese(searchTerm.trim());
  const isSearchingRegion = normalizedSearchTerm.length > 0;
  const regionSearchResults = regions
    .map((item) => ({
      ...item,
      cities: regionDetails[item.id].filter((city) => normalizeVietnamese(city).includes(normalizedSearchTerm)),
    }))
    .filter((item) => !isSearchingRegion || item.cities.length > 0);

  const selectedRegionId = regions.find((item) => regionDetails[item.id].includes(province))?.id ?? 'north';
  const selectedRegionProfile = regionSolarProfiles[selectedRegionId];
  const roofCostAdder = roofCostAdders[roofType] ?? roofCostAdders.flat;
  const baseDemandKwp = Math.max(0, (billValue / 3000000) * 7.8);
  const estimatedKwpByBill = selectedRegionProfile.factor > 0 ? baseDemandKwp / selectedRegionProfile.factor : baseDemandKwp;
  const estimatedKwp = Math.max(0, Math.round(Math.min(estimatedKwpByBill, Math.max(roofPotentialKwp, 0)) * 10) / 10);
  const isRoofLimited = roofValue > 0 && estimatedKwpByBill > roofPotentialKwp;
  const roofCoverageRatio = estimatedKwpByBill > 0 ? Math.max(0, Math.min(1, estimatedKwp / estimatedKwpByBill)) : 0;
  const estimatedPanels = Math.max(0, Math.round(estimatedKwp * 1.54));
  const inverterKw = selectInverterKw(estimatedKwp, phaseType);
  const requiredRoofArea = Math.max(0, Math.round(estimatedKwp * 6.5));
  const resultAudience = billType === 'factory' ? 'nhà xưởng của' : billType === 'business' ? 'cơ sở kinh doanh của' : 'gia đình';
  const averageTariff = billType === 'factory' ? 2800 : billType === 'business' ? 3300 : 3000;
  const dailyConsumptionKwh = billValue > 0 ? billValue / averageTariff / 30 : 0;
  const nightlyConsumptionKwh = dailyConsumptionKwh * (nightUsage / 100);
  const batteryUsableRatio = 0.82; // DoD + inverter/round-trip losses.
  const storageDemandKwh = nightlyConsumptionKwh > 0
    ? (nightlyConsumptionKwh / batteryUsableRatio) * 1.1 * storageSizingProfile.nightCoverageRatio
    : 0;
  const storageBySystemKwh = estimatedKwp * storageSizingProfile.maxKwhPerKwp;
  const storageRawKwh = Math.min(storageDemandKwh, storageBySystemKwh, storageSizingProfile.maxKwh);
  const storageStepKwh = getStorageStepKwh(storageRawKwh, billType);
  const estimatedStorageKwh = isNightUsageHigh && storageRawKwh > 0
    ? Math.max(storageSizingProfile.minKwh, Math.ceil(storageRawKwh / storageStepKwh) * storageStepKwh)
    : 0;
  const estimatedStorageLabel = formatStorageKwh(estimatedStorageKwh);
  const storageSizingNote = estimatedStorageKwh > 0
    ? `${storageSizingProfile.note} Tải ban đêm ước khoảng ${Math.round(nightlyConsumptionKwh * 10) / 10} kWh/ngày, dung lượng đề xuất sơ bộ ${estimatedStorageLabel}.`
    : storageSizingProfile.note;
  const noStorageOffsetRatio = Math.min(0.72, Math.max(0.34, 0.28 + dayUsage / 100 * 0.5));
  const storageOffsetBonus = estimatedStorageKwh > 0 ? Math.min(0.2, nightUsage / 100 * 0.42) : 0;
  const billOffsetRatio = Math.max(0, Math.min(0.82, roofCoverageRatio * (noStorageOffsetRatio + storageOffsetBonus)));
  const monthlySaving = Math.max(0, billValue * billOffsetRatio);
  const afterBill = Math.max(0, billValue - monthlySaving);
  const annualSaving = Math.max(0, monthlySaving * 12);
  const annualKeepMillion = Math.max(0, Math.round(annualSaving / 1000000));
  const annualKeepLabel = formatMillionLong(annualKeepMillion);
  const lifetimeSaving = Math.max(0, annualSaving * 25);
  const annualProductionKwh = Math.max(0, Math.round(estimatedKwp * selectedRegionProfile.factor * 1250));
  const monthlyProductionKwh = Math.max(0, Math.round(annualProductionKwh / 12));
  const co2Ton = Math.max(0, Math.round(estimatedKwp * selectedRegionProfile.factor * 0.63 * 10) / 10);
  const treeEquivalent = Math.max(0, Math.round(co2Ton * 47));
  const flightEquivalent = Math.max(0, Math.round(co2Ton * 6.8));
  const motorbikeKm = Math.max(0, Math.round(co2Ton * 8367));
  const carbonValueMillion = Math.max(0, Math.round(co2Ton * 1.63));
  const solarCostMin = Math.max(0, estimatedKwp * (8.72 + roofCostAdder.min));
  const solarCostMax = Math.max(0, estimatedKwp * (9.62 + roofCostAdder.max));
  const storageCostMin = Math.max(0, estimatedStorageKwh * 5.05);
  const storageCostMax = Math.max(0, estimatedStorageKwh * 5.65);
  const costMin = Math.max(0, Math.round(solarCostMin + storageCostMin));
  const costMax = Math.max(0, Math.round(solarCostMax + storageCostMax));
  const averageInvestmentMillion = (costMin + costMax) / 2;
  const annualSavingMillion = annualSaving / 1000000;
  const paybackMin = billValue > 0 && annualSavingMillion > 0
    ? Math.max(1.2, Math.round((costMin / annualSavingMillion) * 10) / 10)
    : 0;
  const paybackMax = billValue > 0 && annualSavingMillion > 0
    ? Math.max(paybackMin, Math.round((costMax / annualSavingMillion) * 10) / 10)
    : 0;
  const paybackAverage = billValue > 0 && annualSavingMillion > 0
    ? Math.max(1.2, Math.round(((averageInvestmentMillion / annualSavingMillion) * 10)) / 10)
    : 0;
  const totalSaving25Million = Math.max(0, Math.round(annualSavingMillion * 25));
  const netGain25Million = Math.max(0, Math.round(totalSaving25Million - averageInvestmentMillion));
  const conservativePayback = billValue > 0 && annualSavingMillion > 0
    ? Math.max(1.2, Math.round((costMax / (annualSavingMillion * 0.85)) * 10) / 10)
    : 0;
  const optimisticPayback = billValue > 0 && annualSavingMillion > 0
    ? Math.max(1.2, Math.round((costMin / (annualSavingMillion * 1.12)) * 10) / 10)
    : 0;
  const paybackScenarios = [
    { label: 'Thận trọng', value: formatYears(conservativePayback), desc: 'Chi phí cao hơn, tiết kiệm thấp hơn 15%' },
    { label: 'Cơ sở', value: formatYears(paybackAverage), desc: 'Theo dữ liệu anh/chị vừa nhập' },
    { label: 'Tốt', value: formatYears(optimisticPayback), desc: 'Chi phí thấp hơn, tự dùng hiệu quả hơn' },
  ];
  const paybackSignal = paybackAverage <= 5
    ? {
        title: 'Phương án tài chính tốt',
        desc: `Nếu điều kiện mái phù hợp, sau khoảng ${formatYears(paybackAverage)} hệ thống có thể tạo ra dòng tiền tiết kiệm khoảng ${annualKeepLabel}/năm.`,
        tone: 'border-[#BCEBCF] bg-[#F0FFF5] text-[#166534]',
      }
    : paybackAverage <= 8
      ? {
          title: 'Cần khảo sát để tối ưu thêm',
          desc: `Mức hoàn vốn khoảng ${formatYears(paybackAverage)}. Kỹ sư EPCVINA cần kiểm tra mái, hướng nắng và tải tiêu thụ để tinh chỉnh công suất.`,
          tone: 'border-[#F4DBA8] bg-[#FFF8EC] text-[#92400E]',
        }
      : {
          title: 'Hoàn vốn đang khá dài',
          desc: 'Nên rà lại công suất, chi phí pin lưu trữ và thói quen dùng điện trước khi chốt phương án.',
          tone: 'border-[#F4C7C7] bg-[#FFF4F4] text-[#991B1B]',
        };
  const noStorageInvestmentMillion = Math.max(0, (solarCostMin + solarCostMax) / 2);
  const noStorageSavingRatio = isNightUsageHigh ? Math.max(0.45, dayUsage / 100) : 1;
  const noStorageAnnualSavingMillion = annualSavingMillion * noStorageSavingRatio;
  const noStoragePayback = noStorageAnnualSavingMillion > 0
    ? Math.max(1.2, Math.round((noStorageInvestmentMillion / noStorageAnnualSavingMillion) * 10) / 10)
    : 0;
  const shouldDeferStorageForPayback =
    shouldPreferHybridReady &&
    estimatedStorageKwh > 0 &&
    noStoragePayback > 0 &&
    paybackAverage - noStoragePayback >= 0.5 &&
    nightUsage <= 35;
  const storageDecisionMessage = shouldDeferStorageForPayback
    ? `Để hoàn vốn nhanh hơn, EPCVINA nên ưu tiên lắp inverter Hybrid trước và để pin ${estimatedStorageLabel} là phương án nâng cấp khi gia đình cần dự phòng nhiều hơn.`
    : estimatedStorageKwh > 0
      ? 'Tải ban đêm của công trình khá đáng kể. EPCVINA nên kiểm tra thêm pin lưu trữ để tăng tỷ lệ tự dùng và bổ sung khả năng dự phòng.'
      : shouldPreferHybridReady
        ? 'Công trình hiện chưa cần lắp pin ngay, nhưng nên dùng inverter Hybrid để sau này nâng cấp pin dễ hơn.'
        : 'Dữ liệu ban đầu cho thấy công trình có thể triển khai điện mặt trời. Bước tiếp theo là kiểm tra mái, hóa đơn và phương án đấu nối.';
  const storageComparisonRows = [
    {
      label: estimatedStorageKwh > 0 ? 'Có pin lưu trữ' : 'Phương án hiện tại',
      cost: formatMillionShort(averageInvestmentMillion),
      saving: formatMillionLong(annualSavingMillion),
      payback: formatYears(paybackAverage),
      active: !shouldDeferStorageForPayback,
    },
    {
      label: estimatedStorageKwh > 0
        ? shouldPreferHybridReady ? 'Hybrid trước, pin lắp sau' : 'Không pin lưu trữ'
        : 'Nếu thêm pin lưu trữ',
      cost: estimatedStorageKwh > 0 ? formatMillionShort(noStorageInvestmentMillion) : 'Cần khảo sát',
      saving: estimatedStorageKwh > 0 ? formatMillionLong(noStorageAnnualSavingMillion) : 'Tăng dự phòng',
      payback: estimatedStorageKwh > 0 ? formatYears(noStoragePayback) : 'Phụ thuộc tải đêm',
      active: shouldDeferStorageForPayback,
    },
  ];
  const paybackSummaryCards = [
    { label: 'Vốn đầu tư TB', value: formatMillionShort(averageInvestmentMillion), tone: 'text-[#414042]' },
    { label: 'Tiết kiệm/năm', value: formatMillionLong(annualSavingMillion), tone: 'text-[#15803D]' },
    { label: 'Lợi ích ròng 25 năm', value: formatMillionLong(netGain25Million), tone: 'text-[#F58220]' },
  ];
  const roofTypeLabel = roofTypes.find((item) => item.id === roofType)?.title ?? 'Mái cần khảo sát';
  const phaseLabel = phaseTypes.find((item) => item.id === phaseType)?.title ?? 'Cần kiểm tra';
  const recommendedSystem = estimatedStorageKwh > 0 && !shouldDeferStorageForPayback
    ? {
        title: estimatedStorageLabel,
        label: 'Hệ Hybrid - pin lưu trữ',
        storageValue: estimatedStorageLabel,
        storageExtra: `Ban đêm ${nightUsage}% · ~${Math.round(nightlyConsumptionKwh * 10) / 10} kWh/ngày`,
      }
    : shouldPreferHybridReady
      ? {
          title: 'Hệ Hybrid',
          label: estimatedStorageKwh > 0 ? `pin ${estimatedStorageLabel} tùy chọn` : 'sẵn sàng lắp pin sau',
          storageValue: estimatedStorageKwh > 0 ? `${estimatedStorageLabel} tùy chọn` : 'Chưa lắp pin',
          storageExtra: estimatedStorageKwh > 0 ? 'Có thể lắp sau' : 'Hybrid-ready',
        }
      : {
          title: 'Hệ Hòa Lưới',
          label: 'chưa cần Pin lưu trữ',
          storageValue: 'Chưa cần',
          storageExtra: 'Hòa lưới',
        };
  const technicalSpecCards = [
    { value: `${estimatedKwp} kWp`, label: 'Công suất DC đề xuất', extra: isRoofLimited ? 'Đang bị giới hạn bởi diện tích mái' : 'Theo hóa đơn và vùng nắng' },
    { value: `${estimatedPanels} tấm`, label: 'Tấm pin mặt trời', extra: 'Quy đổi theo panel 650 Wp/tấm' },
    { value: `${inverterKw} kW`, label: 'Inverter AC tham chiếu', extra: `${phaseLabel} · chọn theo cấp thiết bị phổ biến` },
    { value: recommendedSystem.storageValue, label: 'Pin lưu trữ', extra: recommendedSystem.storageExtra },
    { value: `~${monthlyProductionKwh.toLocaleString('vi-VN')} kWh`, label: 'Sản lượng/tháng', extra: `~${annualProductionKwh.toLocaleString('vi-VN')} kWh/năm trước khảo sát` },
    { value: `~${requiredRoofArea} m²`, label: 'Mái cần dùng', extra: `${roofTypeLabel} · đang nhập ${roofValue} m²` },
    { value: `${dayUsage}% / ${nightUsage}%`, label: 'Tỷ lệ ngày / đêm', extra: usageHint },
    { value: formatMillionRange(costMin, costMax), label: 'Ngân sách dự kiến', extra: `${roofCostAdder.label} · chưa gồm khảo sát chi tiết` },
  ];
  const phaseWarning = estimatedKwp >= 12 && phaseType === 'one'
    ? 'Công suất dự kiến khá lớn. EPCVINA khuyến nghị kiểm tra phương án 3 pha để hệ thống vận hành ổn định hơn.'
    : phaseType === 'three'
      ? 'Nguồn 3 pha phù hợp với tải kinh doanh, nhà xưởng hoặc hệ thống công suất lớn.'
      : 'Nguồn 1 pha phù hợp với đa số nhà dân, biệt thự và công suất nhỏ đến trung bình.';
  const roofLimitWarning = isRoofLimited
    ? `Diện tích mái hiện tại chỉ đủ khoảng ${roofPotentialKwp} kWp, thấp hơn nhu cầu ước tính ${formatDecimal(estimatedKwpByBill)} kWp theo hóa đơn.`
    : '';
  const leadPayload = {
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    installTiming: installTimingOptions.find((item) => item.id === installTiming)?.label ?? installTiming,
    province,
    billType,
    monthlyBill: billValue,
    roofType,
    roofArea: roofValue,
    dayUsage,
    nightUsage,
    phaseType,
    estimatedKwp,
    estimatedPanels,
    estimatedStorage: estimatedStorageLabel,
    costRange: formatMillionRange(costMin, costMax),
    payback: formatYears(paybackAverage),
    annualSaving: annualKeepLabel,
    roofLimited: isRoofLimited,
  };
  const financialHighlightCards = [
    { value: `~${annualKeepLabel}`, label: 'giá trị tiết kiệm/năm' },
    { value: `~${formatYears(paybackAverage)}`, label: 'mốc thu hồi vốn' },
    { value: formatMillionRange(costMin, costMax), label: 'ngân sách tham chiếu' },
    { value: recommendedSystem.title, label: recommendedSystem.label },
  ];

  const goBack = () => {
    if (activeScreen === 'survey') setScreen('result');
    if (activeScreen === 'result') setScreen('usage');
    if (activeScreen === 'usage') setScreen('roof');
    if (activeScreen === 'roof') setScreen('bill');
    if (activeScreen === 'bill') setScreen('region');
  };

  const resetCalculator = () => {
    setScreen('region');
    setExpandedRegion('north');
    setProvince('');
    setBillType('family');
    setBillAmount('3000000');
    setRoofType(defaultRoofTypeByBillType.family);
    setRoofArea(String(defaultRoofAreaByType.family));
    setDayUsage(defaultDayUsageByBillType.family);
    setLoadProfile('standard');
    setPhaseType('one');
    setShowTech(false);
    setResultSlide('saving');
    setCustomerName('');
    setCustomerPhone('');
    setInstallTiming('30days');
    setSurveySubmitted(false);
    setSurveyAttempted(false);
  };

  return (
    <CalculatorPageShell
      title="Công cụ lập phương án Solar"
      eyebrow="Dành cho khách hàng EPCVINA"
      showHeader={false}
    >
      <div className={activeScreen === 'survey' ? 'mx-auto max-w-md space-y-5 lg:max-w-2xl' : 'space-y-5 lg:grid lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0'}>
        {activeScreen !== 'survey' ? (
        <div className="lg:sticky lg:top-8">
          <div className="sticky top-0 z-30 -mx-5 flex items-center gap-2 border-b border-[#E5E7EB]/80 bg-[#F4F5F7]/92 px-5 py-3 [padding-top:calc(env(safe-area-inset-top)+0.75rem)] shadow-[0_14px_28px_-28px_rgba(65,64,66,.9)] backdrop-blur-md lg:static lg:mx-0 lg:gap-3 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:[padding-top:0] lg:shadow-none lg:backdrop-blur-0">
            <div className="grid h-11 w-[136px] shrink-0 place-items-center rounded-[16px] border border-[#E5E7EB] bg-white px-2.5 py-1.5 shadow-[0_14px_26px_-24px_rgba(65,64,66,.7)] max-[374px]:w-[118px] lg:h-12 lg:w-[150px]">
              <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-[#414042] sm:text-[15px]">Tư vấn nhanh điện mặt trời</p>
              <p className="hidden truncate text-[12px] leading-tight text-[#71717A] min-[390px]:block sm:text-[13px]">Ước lượng chi phí & hoàn vốn</p>
            </div>
            {activeScreen === 'region' || activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' ? (
              <span className="shrink-0 rounded-full bg-[#FFF3E6] px-2.5 py-1.5 text-[10.5px] font-bold text-[#C2410C] sm:px-3 sm:text-[11.5px]">Miễn phí</span>
            ) : activeScreen === 'result' ? (
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[10.5px] font-bold text-[#71717A] ring-1 ring-[#E5E7EB] sm:px-3 sm:text-[11.5px]">3/3</span>
            ) : null}
          </div>

          {activeScreen === 'region' ? (
            <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#2F3035] px-6 py-6 text-white shadow-[0_26px_60px_-34px_rgba(65,64,66,.85)] lg:min-h-[520px] lg:px-8 lg:py-8">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(245,130,32,.38)_0%,transparent_72%)]" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(229,37,42,.18)_0%,transparent_72%)]" />
              <div className="relative inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-bold text-white/80">
                Tư vấn nhanh · Không ràng buộc
              </div>
              <h1 className="relative mt-3 text-[27px] font-black leading-tight tracking-normal lg:mt-6 lg:text-[42px] lg:leading-[1.04]">
                Biết ngay nhà bạn nên lắp hệ solar bao nhiêu kWp
              </h1>
              <p className="relative mt-2 text-[15px] leading-6 text-white/72 lg:mt-4 lg:text-[17px] lg:leading-7">
                Trả lời vài câu hỏi ngắn, EPCVINA ước lượng công suất, ngân sách, pin lưu trữ và dòng tiền tiết kiệm trước khi khảo sát.
              </p>
              <div className="relative mt-4 grid gap-2 text-[14px] font-medium text-white/92 lg:mt-8 lg:gap-3">
                {['Không cần đăng nhập', 'Có gợi ý pin lưu trữ', 'Kỹ sư EPCVINA rà lại miễn phí'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F58220] text-white">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeScreen === 'bill' ? (
            <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#2F3035] px-6 py-6 text-white shadow-[0_26px_60px_-34px_rgba(65,64,66,.85)] lg:min-h-[360px] lg:px-8 lg:py-8">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(245,130,32,.38)_0%,transparent_72%)]" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(229,37,42,.18)_0%,transparent_72%)]" />
              <h1 className="relative text-[18px] font-black leading-tight tracking-normal lg:text-[34px] lg:leading-[1.08]">
                Tính nhanh hệ điện mặt trời phù hợp
              </h1>
              <p className="relative mt-3 text-[15px] leading-[1.65] text-white/72 lg:text-[17px]">
                Bắt đầu từ hóa đơn điện để EPCVINA khoanh vùng quy mô hệ thống và mức đầu tư phù hợp ngân sách.
              </p>
            </div>
          ) : null}
          {activeScreen === 'roof' || activeScreen === 'usage' || activeScreen === 'result' ? (
            <div className="mt-5 hidden overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_20px_50px_-34px_rgba(65,64,66,.45)] lg:block">
              <div className="rounded-[22px] bg-[#2F3035] p-5 text-white">
                <p className="text-[12px] font-black uppercase tracking-[.12em] text-[#FFB020]">Tóm tắt phương án</p>
                <h2 className="mt-3 text-[28px] font-black leading-[1.08]">
                  {province || 'Khu vực lắp đặt'} · {formatCurrency(billValue)}/tháng
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-white/70">
                  EPCVINA dùng dữ liệu này để ước lượng công suất, ngân sách và pin lưu trữ trước khi khảo sát thực tế.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Công suất', value: `${estimatedKwp} kWp` },
                  { label: 'Diện tích mái', value: `${roofValue} m²` },
                  { label: 'Ban ngày', value: `${dayUsage}%` },
                  { label: 'Pin lưu trữ', value: recommendedSystem.storageValue },
                ].map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-[#E5E7EB] bg-[#F4F5F7] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[.08em] text-[#71717A]">{item.label}</p>
                    <p className="mt-1 text-[16px] font-black text-[#414042]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[18px] bg-[#FFF3E6] px-4 py-3 text-[13px] font-semibold leading-5 text-[#9A3412]">
                Hotline EPCVINA: {epcvinaHotlineLabel}
              </div>
            </div>
          ) : null}
        </div>
        ) : null}

        {activeScreen === 'region' ? (
          <div className="space-y-3 lg:rounded-[28px] lg:border lg:border-[#E5E7EB] lg:bg-white lg:p-6 lg:shadow-[0_20px_50px_-34px_rgba(65,64,66,.45)]">
            <div>
              <h2 className="text-[22px] font-black leading-tight tracking-normal text-[#414042]">Công trình của anh/chị ở tỉnh nào?</h2>
              <p className="mt-1 text-[15px] leading-6 text-[#71717A]">
                Khu vực lắp đặt giúp EPCVINA ước lượng sản lượng nắng và mức tiết kiệm sát thực tế hơn.
              </p>
            </div>
            <label className="flex h-11 items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 shadow-[0_10px_24px_rgba(65,64,66,0.06)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#71717A]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#414042] outline-none placeholder:text-[#A1A1AA]"
                placeholder="Tìm tỉnh/thành… ví dụ: Ha Noi, Da Nang"
                name="calculator-region-search"
                aria-label="Tìm nhanh tỉnh hoặc thành phố"
              />
            </label>
            <div className="space-y-3">
              {regionSearchResults.map((item) => {
                const active = isSearchingRegion ? item.cities.length > 0 : expandedRegion === item.id;
                return (
                  <article key={item.id} className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_10px_24px_rgba(65,64,66,0.06)]">
                    <button
                      type="button"
                      onClick={() => setExpandedRegion(active ? '' : item.id)}
                      className="flex min-h-[66px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF3E6] text-[18px] font-black text-[#F58220]">
                          <OptionIcon type={item.id} />
                        </span>
                        <span>
                        <span className="block text-[17px] font-black leading-tight text-[#414042]">{item.label}</span>
                        <span className="mt-1 block text-[13px] leading-tight text-[#71717A]">
                          {isSearchingRegion ? `${item.cities.length} kết quả phù hợp` : item.sub}
                        </span>
                      </span>
                      </span>
                      <span className="text-[#71717A]" aria-hidden="true"><ChevronIcon open={active} /></span>
                    </button>
                    {active ? (
                      <div className="border-t border-[#E5E7EB] px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {item.cities.map((city) => {
                            const selected = province === city;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setProvince(city);
                                  setScreen('bill');
                                }}
                                className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                                  selected ? 'border-[#F58220] bg-[#F58220] text-white' : 'border-[#E5E7EB] bg-white text-[#414042]'
                                }`}
                              >
                                {selected ? `✓ ${city}` : city}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
              {regionSearchResults.length === 0 ? (
                <div className="rounded-[20px] border border-[#E5E7EB] bg-white px-4 py-5 text-center text-[14px] font-medium text-[#71717A]">
                  Không tìm thấy tỉnh/thành phù hợp. Thử nhập tên không dấu hoặc một phần tên tỉnh.
                </div>
              ) : null}
            </div>
          </div>
        ) : activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' ? (
          <div className={activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' ? 'lg:rounded-[28px] lg:border lg:border-[#E5E7EB] lg:bg-white lg:p-6 lg:shadow-[0_20px_50px_-34px_rgba(65,64,66,.45)]' : 'space-y-4 rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_24px_rgba(65,64,66,0.06)]'}>
            {activeScreen === 'bill' ? (
              <>
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#F58220]">Bước 2 / 4</span>
                    <span className="text-[#71717A]">Hóa đơn điện</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F58220]" />
                    ))}
                    {[2, 3].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#D4D4D8]" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight tracking-[-0.02em] text-[#414042]">
                    Hóa đơn điện mỗi tháng thường ở mức nào?
                  </h2>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {billTypes.map((item) => {
                      const active = billType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setBillType(item.id);
                            setBillAmount(String(defaultBillByType[item.id]));
                            setRoofArea(String(defaultRoofAreaByType[item.id]));
                            setRoofType(defaultRoofTypeByBillType[item.id]);
                            setDayUsage(defaultDayUsageByBillType[item.id]);
                            setLoadProfile(item.id === 'factory' ? 'heavy' : 'standard');
                            setPhaseType(item.id === 'factory' ? 'three' : 'one');
                          }}
                          className={`min-h-[92px] rounded-[18px] border px-2.5 py-3 text-center transition-all ${
                            active
                              ? 'border-[#F58220] bg-[linear-gradient(160deg,#FFB020,#F58220)] text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)]'
                              : 'border-[#E5E7EB] bg-white text-[#414042] shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]'
                          }`}
                        >
                          <span className="mx-auto grid h-7 w-7 place-items-center">
                            <OptionIcon type={item.id} />
                          </span>
                          <span className="mt-2 block text-[14px] font-semibold leading-tight">{item.title}</span>
                          <span className={`mt-1 block text-[10.5px] font-medium leading-snug ${active ? 'text-white/80' : 'text-[#71717A]'}`}>
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-[13px] font-semibold text-[#71717A]">Chọn nhanh theo hóa đơn phổ biến</p>
                    <div className="flex flex-wrap gap-2">
                      {quickBills.map((item) => {
                        const active = Number(billAmount) === item.value;
                        return (
                          <button
                          key={item.label}
                          type="button"
                          onClick={() => setBillAmount(String(item.value))}
                          className={`min-h-9 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all ${
                            active ? 'border-[#F58220] bg-[#F58220] text-white shadow-[0_12px_24px_-18px_rgba(245,130,32,.8)]' : 'border-[#D4D4D8] bg-white text-[#414042]'
                          }`}
                        >
                          {item.label}
                        </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="relative mt-5 block">
                    <input
                      type="text"
                      inputMode="numeric"
                      name="monthly-electric-bill"
                      aria-label="Tiền điện trung bình mỗi tháng"
                      value={formatInputMoney(billAmount)}
                      onChange={(event) => setBillAmount(parseInputMoney(event.target.value))}
                      className="h-16 w-full rounded-[18px] border border-[#E5E7EB] bg-white px-5 pr-16 text-[22px] font-semibold text-[#414042] shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)] outline-none transition-all placeholder:text-[#A1A1AA] focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
                      placeholder="Nhập số tiền…"
                    />
                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">VND</span>
                  </label>

                  <p className="mt-4 text-[13px] leading-6 text-[#71717A]">
                    Chỉ cần nhập khoảng tiền quen thuộc. EPCVINA dùng số này để tính nhanh quy mô hệ thống ban đầu.
                  </p>
                  {shouldAskLoadProfile ? (
                    <div className="mt-4 rounded-[20px] border border-[#E5E7EB] bg-[#F4F5F7] p-3">
                      <p className="text-[13px] font-bold text-[#414042]">
                        Công trình có điều hòa tổng, thang máy hoặc thiết bị công suất lớn không?
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#71717A]">
                        Câu trả lời này giúp EPCVINA chọn mặc định nguồn 1 pha hoặc 3 pha phù hợp hơn trước khi tính inverter.
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {loadProfiles.map((item) => {
                          const active = loadProfile === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setLoadProfile(item.id);
                                setPhaseType(item.phase);
                              }}
                              className={`rounded-[16px] border p-3 text-left transition-all ${
                                active
                                  ? 'border-[#F58220] bg-white text-[#414042] shadow-[0_14px_28px_-22px_rgba(245,130,32,.9)]'
                                  : 'border-[#E5E7EB] bg-white/70 text-[#414042]'
                              }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${active ? 'bg-[#F58220] text-white' : 'bg-[#FFF3E6] text-[#F58220]'}`}>
                                  <OptionIcon type={item.phase} />
                                </span>
                                <span className="text-[13px] font-black leading-tight">{item.title}</span>
                              </span>
                              <span className="mt-2 block text-[11.5px] leading-relaxed text-[#71717A]">{item.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-[14px] bg-[#F4F5F7] px-3 py-2 text-[12px] leading-relaxed text-[#71717A]">
                      Nhà xưởng được mặc định nguồn 3 pha vì thường có tải sản xuất, motor hoặc hệ thống công suất lớn.
                    </p>
                  )}
                  <p className="mt-2 rounded-[14px] bg-[#FFF3E6] px-3 py-2 text-[12px] leading-relaxed text-[#9A3412]">
                    Chọn đúng nhóm khách hàng giúp hệ thống lấy mức điện giá tham chiếu phù hợp hơn cho nhà ở, cửa hàng hoặc nhà xưởng.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setScreen('roof')}
                    disabled={!canContinueBill}
                    className="flex min-h-12 w-full items-center justify-center rounded-[14px] bg-[#F58220] px-5 py-3 text-base font-bold text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)] transition-all active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    Tiếp tục →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#71717A] transition-colors hover:text-[#414042]"
                  >
                    ← Quay lại
                  </button>
                </div>
              </>
            ) : null}

            {activeScreen === 'roof' ? (
              <>
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#F58220]">Bước 3 / 4</span>
                    <span className="text-[#71717A]">Mái nhà</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F58220]" />
                    ))}
                    <span className="h-1 rounded-full bg-[#D4D4D8]" />
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight text-[#414042]">Mái có thể bố trí được bao nhiêu tấm pin?</h2>
                  <p className="mt-2 text-[14px] font-normal leading-6 text-[#71717A]">
                    Loại mái và diện tích trống quyết định công suất tối đa, khung đỡ và chi phí thi công.
                  </p>
                  <div className="mt-5 grid gap-3">
                    {roofTypes.map((item) => {
                      const active = roofType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRoofType(item.id)}
                          className={`flex items-center justify-between gap-3 rounded-[20px] border bg-[#fffdf8] px-4 py-3.5 text-left shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)] transition-all ${
                            active ? 'border-[#F58220] shadow-[0_14px_28px_-22px_rgba(245,130,32,.85)]' : 'border-[#E5E7EB]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#FFF3E6] text-[#F58220]">
                              <OptionIcon type={item.id} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[15px] font-bold leading-5 text-[#414042]">{item.title}</span>
                              <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-[#71717A]">{item.desc}</span>
                            </span>
                          </span>
                          {active ? (
                            <span className="shrink-0 rounded-full bg-[#FFF3E6] px-2.5 py-1 text-[11px] font-semibold text-[#F58220]">
                              Đã chọn
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5">
	                    <p className="mb-3 text-[14px] font-semibold text-[#52525B]">Diện tích mái có thể lắp tấm pin</p>
	                    <p className="mb-3 rounded-[14px] bg-[#FFF3E6] px-3 py-2 text-[12px] leading-relaxed text-[#9A3412]">
	                      Mặc định cho nhóm {selectedBillType.title.toLowerCase()} là {defaultRoofAreaByType[billType]} m². Anh/chị có thể chỉnh lại theo phần mái trống thực tế.
	                    </p>
	                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRoofArea((current) => String(Math.max(0, (Number(current) || 0) - 5)))}
                        disabled={roofValue <= 0}
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-[#E5E7EB] bg-white text-xl font-bold text-[#71717A] transition-all disabled:opacity-35"
                      >
                        −
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          step="5"
                          name="roof-area"
                          aria-label="Diện tích mái có thể lắp tấm pin"
                          value={roofArea}
                          onChange={(event) => setRoofArea(event.target.value)}
                          className="w-full rounded-[18px] border border-[#E5E7EB] bg-white/90 py-3 pr-11 text-center text-2xl font-bold text-[#414042] outline-none transition focus:ring-2 focus:ring-[#F58220]"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#71717A]">m²</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRoofArea((current) => String((Number(current) || 0) + 5))}
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-[#F58220] bg-white text-xl font-bold text-[#F58220] transition-all active:scale-[.98]"
                      >
                        +
                      </button>
                    </div>
                    {roofValue > 0 ? (
                      <div className="mt-3 flex justify-center">
                        <span className="rounded-full bg-[#FFF3E6] px-3 py-1.5 text-[13px] font-semibold text-[#9A3412]">
                          Sức chứa mái khoảng {roofPotentialKwp} kWp
                        </span>
                      </div>
                    ) : null}
                    <p className="mt-3 rounded-[14px] bg-[#F4F5F7] px-3 py-2 text-[12px] leading-relaxed text-[#71717A]">
                      {roofCostAdder.label}. EPCVINA sẽ đưa phụ kiện mái vào dự toán để tránh báo giá quá thấp.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setScreen('usage')}
                    disabled={!canContinueRoof}
                    className="w-full rounded-[14px] bg-[#F58220] py-[15px] text-[15px] font-bold text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)] transition-all active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                  >
                    Tiếp tục →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#71717A] transition-colors hover:text-[#52525B]"
                  >
                    ← Quay lại
                  </button>
                </div>
              </>
            ) : null}

            {activeScreen === 'usage' ? (
              <>
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#F58220]">Bước 4 / 4</span>
                    <span className="text-[#71717A]">Thói quen sử dụng</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F58220]" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight text-[#414042]">Điện được dùng nhiều vào khung giờ nào?</h2>
                  <p className="mt-2 text-[14px] font-normal leading-6 text-[#71717A]">
                    Tỷ lệ dùng ban ngày/ban đêm giúp xác định nên ưu tiên hòa lưới hay thêm pin lưu trữ.
                  </p>

                  <div className="relative mt-5 h-16 select-none overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]">
                    <div
                      className="absolute left-0 top-0 flex h-full items-center justify-center overflow-hidden transition-[width] duration-150"
                      style={{
                        width: `${dayUsage}%`,
                        background: 'linear-gradient(135deg, #FFB020 0%, #F58220 100%)',
                      }}
                    >
                      {dayUsage >= 25 ? <span className="whitespace-nowrap px-2 text-sm font-semibold text-white">Ban ngày {dayUsage}%</span> : null}
                    </div>
                    <div
                      className="absolute right-0 top-0 flex h-full items-center justify-center overflow-hidden transition-[width] duration-150"
                      style={{
                        width: `${nightUsage}%`,
                        background: 'linear-gradient(135deg, rgb(100, 116, 139) 0%, rgb(51, 65, 85) 100%)',
                      }}
                    >
                      {nightUsage >= 25 ? <span className="whitespace-nowrap px-2 text-sm font-semibold text-white">Ban đêm {nightUsage}%</span> : null}
                    </div>
                    <div
                      className="pointer-events-none absolute top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-[#414042] shadow-md transition-[left] duration-150"
                      style={{ left: `calc(${dayUsage}% - 12px)` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={dayUsage}
                      onChange={(event) => setDayUsage(Number(event.target.value))}
                      aria-label="Tỷ lệ dùng điện ban ngày"
                      className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                  <div className="mt-3 flex justify-between px-1 text-xs leading-4 text-[#71717A]">
                    <span>Tự dùng khi có nắng</span>
                    <span>Dự phòng cho buổi tối</span>
                  </div>
                  <p className="mt-3 rounded-[14px] bg-[#F4F5F7] px-3 py-2 text-[12px] leading-relaxed text-[#71717A]">
                    {usageProfileHint}
                  </p>

                  <div
                    className={`mt-5 rounded-[20px] border px-4 py-3 text-sm leading-relaxed ${
                      isNightUsageHigh ? 'border-[#FECACA] bg-[#FFF1F2] text-[#B91C1C]' : 'border-[#FED7AA] bg-[#FFF3E6] text-[#9A3412]'
                    }`}
                  >
                    {usageHint}
                  </div>
                  <div className="mt-3 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-3 text-[13px] leading-relaxed text-[#71717A]">
                    {phaseWarning}
                  </div>

                  <p className="mb-2 mt-5 text-sm font-medium text-[#52525B]">Nguồn điện tại công trình</p>
                  <div className="mb-6 flex rounded-[18px] border border-[#E5E7EB] bg-white p-1 shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]">
                    {phaseTypes.map((item) => {
                      const active = phaseType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPhaseType(item.id)}
                          className={`flex-1 rounded-[14px] py-2.5 text-sm font-semibold leading-tight transition-all duration-200 ${
                            active ? 'bg-[#F58220] text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)]' : 'bg-transparent text-[#71717A]'
                          }`}
                        >
                          <span className="block">{item.title}</span>
                          <span className={`mt-1 block text-xs font-medium ${active ? 'text-white/85' : 'text-[#71717A]'}`}>{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setResultSlide('saving');
                      setScreen('result');
                    }}
                    className="w-full rounded-[14px] bg-[#F58220] py-4 text-base font-bold text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)] transition-all disabled:opacity-40"
                  >
                    Xem kết quả →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#71717A] transition-colors hover:text-[#52525B]"
                  >
                    ← Quay lại
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : activeScreen === 'result' ? (
          <div className="calculator-result space-y-4 lg:max-w-[680px]">
            <style>{`
              .calculator-result {
                animation: result-enter 420ms cubic-bezier(.2,.75,.24,1) both;
              }
              .calculator-result [data-reveal] {
                animation: result-card-in 520ms cubic-bezier(.2,.75,.24,1) both;
                animation-delay: var(--delay, 0ms);
              }
              .calculator-result [data-slide] {
                animation: result-slide-in 280ms cubic-bezier(.2,.75,.24,1) both;
              }
              .calculator-result [data-press] {
                transition: transform 150ms cubic-bezier(.4,0,.2,1), box-shadow 150ms cubic-bezier(.4,0,.2,1), border-color 150ms cubic-bezier(.4,0,.2,1);
              }
              .calculator-result [data-press]:active {
                transform: scale(.985);
              }
              .calculator-result [data-press]:hover {
                transform: translateY(-1px);
              }
              .calculator-result [data-progress] {
                transform-origin: left center;
                animation: progress-grow 760ms cubic-bezier(.2,.75,.24,1) both;
              }
              @media (prefers-reduced-motion: reduce) {
                .calculator-result,
                .calculator-result [data-reveal],
                .calculator-result [data-slide],
                .calculator-result [data-progress] {
                  animation: none;
                }
                .calculator-result [data-press],
                .calculator-result [data-press]:active,
                .calculator-result [data-press]:hover {
                  transform: none;
                }
              }
              @keyframes result-enter {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes result-card-in {
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes result-slide-in {
                from { opacity: 0; transform: translateX(14px); }
                to { opacity: 1; transform: translateX(0); }
              }
              @keyframes progress-grow {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
              }
            `}</style>
            <div data-reveal style={{ '--delay': '0ms' } as React.CSSProperties} className="relative flex h-[348px] flex-col overflow-hidden rounded-[28px] bg-[#2F3035] px-5 py-5 text-white shadow-[0_26px_60px_-34px_rgba(65,64,66,.85)]">
              <div key={resultSlide} data-slide className="flex h-full flex-col">
                {resultSlide === 'estimate' ? (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(245,130,32,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FFB020]">
                        Bản nháp phương án EPCVINA
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      Cần khảo sát
                    </span>
                  </div>
                  <div className="relative mb-4 text-[23px] font-black leading-tight tracking-[-.03em] text-white">
                    Mốc thu hồi vốn khoảng ~{paybackAverage.toFixed(1)} năm
                  </div>
                  <div className="relative grid gap-3">
                    <div className="grid gap-2.5 leading-relaxed text-[#CBD5E1]">
                      <p className="text-[14.5px]">
                        Phương án sơ bộ có thể tạo giá trị tiết kiệm{' '}
                        <strong className="whitespace-nowrap text-[16px] font-bold text-[#34D399]">
                          ~{annualKeepLabel}/năm
                        </strong>
                      </p>
                      <p className="text-[14.5px]">
                        Lũy kế 25 năm ước khoảng{' '}
                        <strong className="whitespace-nowrap text-[21px] font-black leading-none text-[#34D399]">
                          {formatCurrency(lifetimeSaving)}
                        </strong>
                        <span className="block text-[11.5px] leading-relaxed text-[#94A3B8]">
                          Đây là mốc tham chiếu theo tuổi thọ phổ biến của tấm pin.
                        </span>
                      </p>
                    </div>
                  </div>
                  </>
                ) : resultSlide === 'saving' ? (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(245,130,32,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FFB020]">
                        Dòng tiền tiết kiệm hàng tháng
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      Sau khi lắp
                    </span>
                  </div>
                  <div className="relative mb-4 whitespace-nowrap text-[31px] font-black leading-none tracking-[-.03em] text-white">
                    ~{formatCurrency(monthlySaving)}
                  </div>
                  <div className="relative grid grid-cols-2 gap-2 rounded-[16px] bg-white/[.08] p-2.5">
                    {financialHighlightCards.map((item) => (
                      <div key={item.label} className="flex min-w-0 flex-col items-center rounded-[13px] bg-white/[.06] px-2.5 py-2.5 text-center">
                        <div className="mb-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#34D399]/[.14] text-[#34D399]">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] font-black leading-tight text-white">{item.value}</div>
                          <div className="mt-1 text-[9.8px] leading-snug text-[#94A3B8]">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-4 space-y-2">
                    <div className="grid grid-cols-[40px_1fr_92px] items-center gap-2 text-[11.5px] leading-normal text-[#CBD5E1]">
                      <span>Trước</span>
                      <span className="h-3 rounded-full bg-[#EF4444]/[.18]">
                        <span className="block h-full rounded-full bg-[#EF4444]" style={{ width: '100%' }} />
                      </span>
                      <strong className="text-right text-[13px] font-bold text-white">{formatCurrency(billValue)}</strong>
                    </div>
                    <div className="grid grid-cols-[40px_1fr_92px] items-center gap-2 text-[11.5px] leading-normal text-[#CBD5E1]">
                      <span>Sau</span>
                      <span className="h-3 rounded-full bg-[#F5A623]/[.18]">
                        <span
                          className="block h-full rounded-full bg-[#F58220]"
                          style={{ width: `${Math.max(0, Math.min(100, (afterBill / Math.max(billValue, 1)) * 100))}%` }}
                        />
                      </span>
                      <strong className="text-right text-[13px] font-bold text-[#FFB020]">~{formatCurrency(afterBill)}</strong>
                    </div>
                  </div>
                  <p className="relative mt-4 text-[13px] leading-relaxed text-[#CBD5E1]">
                    Khoản tiết kiệm phụ thuộc thực tế mái, hướng nắng, thói quen dùng điện và cấu hình thiết bị.
                  </p>
                  </>
                ) : (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(245,130,32,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FFB020]">
                        Lợi ích xanh cho công trình
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      CO₂ tránh phát thải
                    </span>
                  </div>
                  <div className="relative mb-4 whitespace-nowrap text-[31px] font-black leading-none tracking-[-.03em] text-white">
                    ~{co2Ton} tấn CO₂/năm
                  </div>
                  <div className="relative grid gap-2 rounded-[16px] bg-white/[.08] p-2.5">
                    {[
                      { value: `~${treeEquivalent}`, label: 'cây xanh hấp thụ CO₂ trong một năm' },
                      { value: `${flightEquivalent}`, label: 'chuyến bay Hà Nội - TP.HCM khứ hồi' },
                      { value: `~${motorbikeKm.toLocaleString('vi-VN')} km`, label: 'quãng đường xe máy phát thải tương đương' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-[13px] bg-white/[.06] px-2.5 py-2.5">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#34D399]/[.14] text-[#34D399]">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-[12.5px] font-black leading-tight text-white">{item.value}</div>
                          <div className="mt-1 text-[9.8px] leading-snug text-[#94A3B8]">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="relative mt-4 text-[13px] leading-relaxed text-[#CBD5E1]">
                    Nếu quy đổi theo giá carbon tham chiếu tại EU: khoảng ~{carbonValueMillion} triệu đồng/năm.
                  </p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setResultSlide(resultSlide === 'estimate' ? 'environment' : resultSlide === 'saving' ? 'estimate' : 'saving')}
                data-press
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D4D4D8] bg-white text-base font-bold text-[#71717A] shadow-sm"
                aria-label="Xem kết quả trước"
              >
                ‹
              </button>
              {([
                { id: 'saving' as const, label: 'Tiết kiệm' },
                { id: 'estimate' as const, label: 'Phương án' },
                { id: 'environment' as const, label: 'Carbon' },
              ]).map((slide) => {
                const active = resultSlide === slide.id;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setResultSlide(slide.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                      active ? 'bg-[#F58220] text-white shadow-sm' : 'bg-[#E5E7EB] text-[#71717A]'
                    }`}
                    aria-label={`Xem ${slide.label.toLowerCase()}`}
                    aria-current={active ? 'true' : undefined}
                  >
                    {slide.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setResultSlide(resultSlide === 'estimate' ? 'saving' : resultSlide === 'saving' ? 'environment' : 'estimate')}
                data-press
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D4D4D8] bg-white text-base font-bold text-[#71717A] shadow-sm"
                aria-label="Xem kết quả tiếp theo"
              >
                ›
              </button>
            </div>

            <div data-reveal style={{ '--delay': '80ms' } as React.CSSProperties} className="space-y-3">
              <p className="flex items-center gap-2 text-[12.5px] font-medium leading-normal text-[#71717A]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FFF3E6] text-[#F58220]">
                  <ResultMetricIcon type="power" />
                </span>
                <span>
                  Gợi ý ban đầu cho <strong className="font-black text-[#414042]">{resultAudience}</strong> anh/chị
                </span>
              </p>
              <div className="grid gap-2">
                <p className="rounded-[16px] border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-medium leading-relaxed text-[#71717A]">
                  {selectedRegionProfile.label}. {roofCostAdder.label}.
                </p>
                {roofLimitWarning ? (
                  <p className="rounded-[16px] border border-[#F4DBA8] bg-[#FFF8EC] px-3 py-2 text-[12px] font-semibold leading-relaxed text-[#92400E]">
                    {roofLimitWarning}
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'power' as const, value: `${estimatedKwp} kWp`, label: 'Công suất khuyến nghị', tall: true },
                  { icon: 'panel' as const, value: `${estimatedPanels} tấm`, label: 'Pin 650 Wp/tấm', tall: true },
                  { icon: 'grid' as const, value: recommendedSystem.title, label: recommendedSystem.label, tall: false },
                  { icon: 'cost' as const, value: formatMillionRange(costMin, costMax), label: 'Ngân sách dự kiến', tall: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.tall ? 'min-h-[105px]' : 'min-h-24'} w-full rounded-[18px] border border-[#E5E7EB] bg-white p-[13px] text-left shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]`}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF3E6] text-[#F58220]">
                      <ResultMetricIcon type={item.icon} />
                    </span>
                    <p className={`${item.tall ? 'text-[27px]' : 'text-[19px]'} mt-2 font-black leading-none tracking-[-.03em] text-[#414042]`}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11.5px] leading-snug text-[#71717A]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal style={{ '--delay': '150ms', marginTop: '12px' } as React.CSSProperties} className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]">
              <div>
                <h3 className="mb-2 text-[15px] font-black text-[#414042]">Dự phóng thu hồi vốn</h3>
                <div data-progress>
                  <PaybackChart
                    minYears={paybackMin}
                    maxYears={paybackMax}
                    averageYears={paybackAverage}
                    investmentMillion={averageInvestmentMillion}
                    annualSavingMillion={annualSavingMillion}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {paybackSummaryCards.map((item) => (
                    <div key={item.label} className="rounded-[14px] border border-[#F0E4D2] bg-white px-2.5 py-2 text-center shadow-[0_8px_20px_-18px_rgba(67,56,39,.45)]">
                      <p className={`text-[13px] font-black leading-tight ${item.tone}`}>{item.value}</p>
                      <p className="mt-1 text-[9.8px] font-medium leading-snug text-[#71717A]">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 rounded-[14px] bg-[#FFF3E6] px-3 py-2 text-[11.5px] leading-relaxed text-[#71717A]">
                  Cách tính: vốn đầu tư trung bình chia cho giá trị tiết kiệm mỗi năm. Mô hình đã xét diện tích mái, vùng nắng, tỷ lệ dùng điện và pin lưu trữ sơ bộ.
                </p>
                <div className={`mt-3 rounded-[16px] border px-3 py-2.5 ${paybackSignal.tone}`}>
                  <p className="text-[13px] font-black leading-tight">{paybackSignal.title}</p>
                  <p className="mt-1 text-[11.5px] font-medium leading-relaxed opacity-90">{paybackSignal.desc}</p>
                </div>
                <div className="mt-3">
                  <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#71717A]">Ba kịch bản tài chính</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {paybackScenarios.map((item) => (
                      <div key={item.label} className="rounded-[14px] border border-[#F0E4D2] bg-white px-2.5 py-2 shadow-[0_8px_20px_-18px_rgba(67,56,39,.45)]">
                        <p className="text-[10.5px] font-bold leading-tight text-[#71717A]">{item.label}</p>
                        <p className="mt-1 text-[13px] font-black leading-tight text-[#414042]">{item.value}</p>
                        <p className="mt-1 text-[9.5px] font-medium leading-snug text-[#8A7C6D]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 rounded-[16px] border border-[#F0E4D2] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#71717A]">So sánh phương án pin</p>
                    {estimatedStorageKwh > 0 ? (
                      <span className="rounded-full bg-[#ECFFF4] px-2.5 py-1 text-[10.5px] font-black text-[#166534]">
                        Ban đêm {nightUsage}%
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 grid gap-2">
                    {storageComparisonRows.map((item) => (
                      <div
                        key={item.label}
                        className={`grid grid-cols-[1.1fr_.9fr_.9fr] gap-2 rounded-[13px] px-2.5 py-2 text-[10.5px] leading-tight ${
                          item.active ? 'bg-[#FFF3E6] text-[#414042]' : 'bg-[#F4F5F7] text-[#71717A]'
                        }`}
                      >
                        <div>
                          <p className="font-black">{item.label}</p>
                          <p className="mt-1 font-medium opacity-75">{item.cost}</p>
                        </div>
                        <div>
                          <p className="font-bold opacity-70">Tiết kiệm/năm</p>
                          <p className="mt-1 font-black">{item.saving}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold opacity-70">Hoàn vốn</p>
                          <p className="mt-1 font-black">{item.payback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 rounded-[12px] bg-[#F4F5F7] px-3 py-2 text-[11px] font-medium leading-relaxed text-[#71717A]">
                    {storageSizingNote}
                  </p>
                </div>
                <p className="mt-2.5 rounded-[14px] bg-[#F4F5F7] px-3 py-2 text-[11.5px] leading-relaxed text-[#71717A]">
                  Con số trên là dự phóng trước khảo sát, chưa bao gồm lãi vay, biến động giá thiết bị, bảo trì, suy hao tấm pin và điều kiện đấu nối tại công trình.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScreen('survey')}
                data-press
                className="mt-3 flex w-full flex-col items-center justify-center gap-1 rounded-[14px] bg-[#F58220] px-4 py-3.5 text-center text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)]"
              >
                <span className="text-[14px] font-black leading-tight">Nhận tư vấn kỹ thuật miễn phí</span>
                <span className="text-[11.5px] font-medium leading-snug text-white/85">EPCVINA kiểm tra mái và tối ưu cấu hình</span>
              </button>
            </div>

            <p data-reveal style={{ '--delay': '220ms' } as React.CSSProperties} className="mb-3 px-1 text-[13px] leading-relaxed text-[#71717A]">
              {storageDecisionMessage}
            </p>

            <div data-reveal style={{ '--delay': '240ms' } as React.CSSProperties} className="relative mt-4 cursor-pointer rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-5 shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)] transition-transform active:scale-[.995]">
              <div className="text-center">
                <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#C2410C]">
                  Khảo sát 0đ • Tư vấn bởi EPCVINA
                </p>
                <h3 className="mt-2 text-[18px] font-black leading-tight text-[#414042]">
                  Gửi thông tin để nhận phương án solar cá nhân hóa
                </h3>
                <p className="mt-2 text-[13px] font-normal leading-relaxed text-[#71717A]">
                  Đội kỹ thuật EPCVINA sẽ rà lại hóa đơn, diện tích mái, thói quen dùng điện và đề xuất cấu hình phù hợp trước khi báo giá.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10.5px] font-bold text-[#71717A]">
                  {['Gọi lại trong 24h', 'Tư vấn đúng nhu cầu', 'Không ép lắp đặt'].map((item) => (
                    <span key={item} className="rounded-full bg-[#F4F5F7] px-2 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScreen('survey')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F58220] px-4 py-[15px] text-[15px] font-bold leading-[22.5px] text-white shadow-[0_16px_32px_-20px_rgba(245,130,32,.8)] transition-transform active:scale-[.99]"
              >
                Nhận phương án miễn phí
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowTech((current) => !current)}
              className="flex w-full items-center justify-center gap-1.5 rounded-[16px] bg-transparent px-0 py-2.5 text-sm font-semibold text-[#71717A] transition-colors hover:text-[#414042]"
              aria-expanded={showTech}
            >
              {showTech ? 'Thu gọn thông số kỹ thuật' : 'Xem thêm thông số kỹ thuật'}
              <ChevronIcon open={showTech} />
            </button>
            {showTech ? (
              <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-3 shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]">
                <div className="mb-3 flex items-start justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[.1em] text-[#F58220]">Thông số mở rộng</p>
                    <h3 className="mt-1 text-[16px] font-black leading-tight text-[#414042]">Cấu hình kỹ thuật tham chiếu</h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FFF3E6] px-2.5 py-1 text-[10.5px] font-black text-[#C2410C]">
                    Trước khảo sát
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {technicalSpecCards.map((item) => (
                    <div key={item.label} className="min-h-[116px] rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFC] p-3 shadow-[0_10px_22px_-20px_rgba(65,64,66,.4)]">
                      <div className="text-[18px] font-black leading-tight tracking-[-.02em] text-[#414042]">{item.value}</div>
                      <div className="mt-1 text-[11.5px] font-bold leading-snug text-[#71717A]">{item.label}</div>
                      {item.extra ? (
                        <div className="mt-2 line-clamp-3 text-[10.5px] font-medium leading-snug text-[#8A7C6D]">
                          {item.extra}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2 rounded-[18px] border border-[#F0E4D2] bg-[#FFF9F0] p-3 text-[12px] leading-relaxed text-[#8A5A1F]">
                  <p>
                    <strong className="font-black">Lưu ý:</strong> Inverter đang chọn theo cấp công suất thương mại gần nhất, không phải phép nhân cơ học từ kWp.
                  </p>
                  {roofLimitWarning ? <p>{roofLimitWarning}</p> : null}
                  <p>{phaseWarning}</p>
                  <p>Kỹ sư EPCVINA sẽ đo mái, kiểm tra hướng nắng, bóng che và phụ tải thực tế trước khi chốt thiết kế.</p>
                </div>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen('usage')}
                className="block flex-1 rounded-[16px] border border-[#E6E8EF] bg-transparent px-0 py-3 text-center text-sm font-normal text-[#64748B]"
              >
                ← Chỉnh thông tin
              </button>
              <button
                type="button"
                onClick={resetCalculator}
                className="block flex-1 bg-transparent px-0 py-3 text-center text-sm font-normal text-[#71717A]"
              >
                ↩ Làm lại từ đầu
              </button>
            </div>
          </div>
        ) : activeScreen === 'survey' ? (
          <div className="calculator-result space-y-3 lg:mx-auto lg:w-full lg:max-w-[560px]">
            <style>{`
              .calculator-result {
                animation: result-enter 420ms cubic-bezier(.2,.75,.24,1) both;
              }
              .calculator-result [data-reveal] {
                animation: result-card-in 520ms cubic-bezier(.2,.75,.24,1) both;
                animation-delay: var(--delay, 0ms);
              }
              .calculator-result [data-press] {
                transition: transform 150ms cubic-bezier(.4,0,.2,1), box-shadow 150ms cubic-bezier(.4,0,.2,1), border-color 150ms cubic-bezier(.4,0,.2,1);
              }
              .calculator-result [data-press]:active {
                transform: scale(.985);
              }
              @media (prefers-reduced-motion: reduce) {
                .calculator-result,
                .calculator-result [data-reveal] {
                  animation: none;
                }
              }
            `}</style>

            <div className="sticky top-0 z-30 -mx-5 flex items-center gap-2 border-b border-[#E5E7EB]/80 bg-[#F4F5F7]/92 px-5 py-3 [padding-top:calc(env(safe-area-inset-top)+0.75rem)] shadow-[0_14px_28px_-28px_rgba(65,64,66,.9)] backdrop-blur-md lg:static lg:mx-0 lg:rounded-[24px] lg:border lg:bg-white lg:px-4 lg:py-3 lg:[padding-top:0] lg:shadow-[0_12px_30px_-24px_rgba(65,64,66,.35)] lg:backdrop-blur-0">
              <div className="grid h-11 w-[136px] shrink-0 place-items-center rounded-[16px] border border-[#E5E7EB] bg-white px-2.5 py-1.5 shadow-[0_14px_26px_-24px_rgba(65,64,66,.7)] max-[374px]:w-[118px]">
                <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold leading-tight text-[#414042] sm:text-[15px]">Gửi thông tin khảo sát</p>
                <p className="hidden truncate text-[12px] leading-tight text-[#71717A] min-[390px]:block sm:text-[13px]">Kỹ sư EPCVINA liên hệ miễn phí</p>
              </div>
              <a
                href={epcvinaHotlineHref}
                className="shrink-0 rounded-full bg-[#FFF3E6] px-2.5 py-1.5 text-[10.5px] font-bold text-[#C2410C] sm:px-3 sm:text-[11.5px]"
                aria-label={`Gọi hotline EPCVINA ${epcvinaHotlineLabel}`}
              >
                Gọi ngay
              </a>
            </div>

            <button
              type="button"
              onClick={() => setScreen('result')}
              data-reveal
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-[14px] font-medium text-[#414042] shadow-[0_10px_24px_rgba(65,64,66,0.05)] transition-colors hover:text-[#E5252A]"
            >
              ← Xem lại kết quả
            </button>

            <section
              data-reveal
              style={{ '--delay': '50ms' } as React.CSSProperties}
              className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]"
              aria-label="Thông tin tin cậy EPCVINA Solar"
            >
              <div className="bg-[#2F3035] px-4 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-white p-2 shadow-[0_16px_34px_-22px_rgba(0,0,0,.55)]">
                    <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-[.13em] text-[#FFB020]">Dữ liệu tính toán bởi EPCVINA Solar</p>
                    <h2 className="mt-1 text-[19px] font-black leading-tight">Kỹ sư rà lại trước khi báo giá</h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-white/72">
                      Kết quả là ước tính sơ bộ dựa trên hóa đơn, vùng nắng, mái và thói quen dùng điện.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { value: '15 năm', label: 'kinh nghiệm cơ điện' },
                    { value: 'Bảo hành', label: 'theo thiết bị & thi công' },
                    { value: '0đ', label: 'khảo sát ban đầu' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[14px] bg-white/10 px-2 py-2 text-center ring-1 ring-white/10">
                      <p className="text-[15px] font-black leading-tight text-white">{item.value}</p>
                      <p className="mt-1 text-[9.5px] font-semibold leading-snug text-white/62">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-black uppercase tracking-[.08em] text-[#71717A]">Công trình tiêu biểu</p>
                  <a href="/du-an" className="text-[12px] font-bold text-[#F58220] hover:text-[#E5252A]">
                    Xem dự án
                  </a>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {trustProjects.map((project) => (
                    <a
                      key={project.title}
                      href="/du-an"
                      className="group overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-[#F4F5F7] text-left"
                    >
                      <img src={project.image} alt={project.title} className="h-16 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <p className="min-h-[42px] px-2 py-2 text-[10.5px] font-bold leading-snug text-[#414042]">{project.title}</p>
                    </a>
                  ))}
                </div>

                <div className="mt-4 rounded-[18px] border border-[#FED7AA] bg-[#FFF7ED] px-3 py-3">
                  <p className="text-[12.5px] font-black leading-tight text-[#9A3412]">Vì sao có thể tin kết quả tính?</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#8A5A2B]">
                    Mô hình chỉ dùng để khoanh vùng công suất, ngân sách và phương án Hybrid/pin. EPCVINA sẽ kiểm tra mái, hướng nắng, phụ tải và điều kiện đấu nối trước khi chốt thiết kế.
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-[11.5px] font-bold">
                  <a href="/calculator/thoi-gian-hoan-von" className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-[#414042] hover:border-[#F58220] hover:text-[#F58220]">
                    Phương pháp tính
                  </a>
                  <a href="/bao-hanh" className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-[#414042] hover:border-[#F58220] hover:text-[#F58220]">
                    Bảo hành
                  </a>
                  <a href="/chinh-sach-bao-mat" className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-[#414042] hover:border-[#F58220] hover:text-[#F58220]">
                    Chính sách bảo mật
                  </a>
                </div>
              </div>
            </section>

            <form
              data-reveal
              style={{ '--delay': '80ms' } as React.CSSProperties}
              className="rounded-[24px] border border-[#E5E7EB] bg-white px-4 pb-5 pt-5 shadow-[0_12px_30px_-22px_rgba(65,64,66,.35)]"
              onSubmit={(event) => {
                event.preventDefault();
                setSurveyAttempted(true);
                if (!canSubmitSurvey) return;

                window.localStorage.setItem('epcvina-calculator-lead', JSON.stringify(leadPayload));
                setSurveySubmitted(true);
              }}
            >
              <div className="relative overflow-hidden rounded-[18px] shadow-[0_18px_38px_-24px_rgba(65,64,66,.55)]">
                <img
                  src="/hero-bg-768.webp"
                  alt=""
                  className="h-[174px] w-full object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 flex min-h-10 items-center rounded-[14px] bg-white/90 px-3 text-[13px] font-semibold text-[#414042] shadow-[0_12px_30px_-18px_rgba(65,64,66,.35)] backdrop-blur-md">
                  Tư vấn miễn phí theo nhu cầu nhà bạn
                </div>
                <div className="absolute right-4 top-8 w-[106px] rounded-[12px] bg-white/92 px-3 py-2 shadow-[0_12px_30px_-18px_rgba(65,64,66,.45)] backdrop-blur-md">
                  <div className="flex h-12 items-end gap-1">
                    {[18, 26, 34, 42, 50, 38, 30, 22].map((height, index) => (
                      <span
                        key={index}
                        className="w-1.5 rounded-full bg-[#F58220]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 h-0.5 rounded-full bg-[#E5252A]" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className={`h-2 rounded-full ${item === 0 ? 'w-7 bg-[#F58220]' : 'w-2 bg-[#FED7AA]'}`}
                  />
                ))}
              </div>

              {surveySubmitted ? (
                <div className="py-5 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ECFFF4] text-[#2FBD6A]">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-[23px] font-black leading-[1.18] tracking-[-.025em] text-[#414042]">
                    EPCVINA đã nhận yêu cầu tư vấn
                  </h2>
                  <p className="mt-3 text-[14px] leading-[1.75] text-[#5F6673]">
                    Bộ phận kỹ thuật sẽ gọi lại trong giờ làm việc để xác nhận nhu cầu, kiểm tra dữ liệu đầu vào và tư vấn bước tiếp theo.
                  </p>
                  <div className="mt-5 rounded-[18px] border border-[#BCEBCF] bg-[#F0FFF5] px-4 py-3 text-left text-[13px] leading-relaxed text-[#166534]">
                    <p className="font-black">Thông tin liên hệ</p>
                    <p className="mt-1">Tên: {customerName.trim()}</p>
                    <p>SĐT/Zalo: {customerPhone.trim()}</p>
                    <p>Dự định lắp: {installTimingOptions.find((item) => item.id === installTiming)?.label}</p>
                  </div>
                  <div className="mt-3 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-3 text-left text-[12px] leading-relaxed text-[#71717A]">
                    <p className="font-black text-[#414042]">Dữ liệu tư vấn đi kèm</p>
                    <p className="mt-1">Khu vực: {province || 'Chưa chọn'}</p>
                    <p>Hóa đơn: {formatCurrency(billValue)}/tháng · Mái: {roofValue} m²</p>
                    <p>Công suất: {estimatedKwp} kWp · Pin: {recommendedSystem.storageValue}</p>
                    <p>Chi phí: {formatMillionRange(costMin, costMax)} · Hoàn vốn: {formatYears(paybackAverage)}</p>
                  </div>
                  <a
                    href={epcvinaHotlineHref}
                    className="mt-5 flex min-h-[58px] w-full items-center justify-center rounded-[14px] bg-[#F58220] px-4 py-3 text-[15px] font-black text-white shadow-[0_18px_34px_-22px_rgba(245,130,32,.85)]"
                  >
                    Gọi EPCVINA: {epcvinaHotlineLabel}
                  </a>
                  <button
                    type="button"
                    onClick={() => setScreen('result')}
                    className="mt-3 w-full py-2 text-[13px] font-bold text-[#71717A]"
                  >
                    ← Quay lại phương án
                  </button>
                </div>
              ) : (
                <>
              <h2 className="mt-5 text-[23px] font-black leading-[1.18] tracking-[-.025em] text-[#414042]">
                Nhận tư vấn solar theo công trình của anh/chị
              </h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-[#5F6673]">
                Để lại số điện thoại/Zalo, EPCVINA sẽ rà lại kết quả tính toán và gợi ý phương án đầu tư phù hợp hơn.
              </p>

              <div className="mt-5 grid gap-3">
                <label className="relative grid">
                  <span className="sr-only">Họ và tên</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F58220]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    name="customer-name"
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                      if (surveyAttempted) setSurveyAttempted(false);
                    }}
                    className="h-[54px] rounded-[14px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[15px] font-medium text-[#414042] shadow-[0_10px_24px_rgba(65,64,66,0.06)] outline-none transition placeholder:text-[#9AA0A9] focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
                    placeholder="Họ và tên *"
                    autoComplete="name"
                  />
                  {surveyAttempted && customerNameError ? (
                    <span className="mt-1.5 text-[12px] font-medium text-[#B45309]">{customerNameError}</span>
                  ) : null}
                </label>
                <label className="relative grid">
                  <span className="sr-only">SĐT/Zalo</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#F58220]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.1 9.62a16 16 0 0 0 6.28 6.28l1.19-1.18a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </span>
                  <input
                    name="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(event) => {
                      setCustomerPhone(event.target.value);
                      if (surveyAttempted) setSurveyAttempted(false);
                    }}
                    className="h-[54px] rounded-[14px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[15px] font-medium text-[#414042] shadow-[0_10px_24px_rgba(65,64,66,0.06)] outline-none transition placeholder:text-[#9AA0A9] focus:border-[#F58220] focus:ring-2 focus:ring-orange-100"
                    placeholder="Số điện thoại / Zalo *"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {surveyAttempted && customerPhoneError ? (
                    <span className="mt-1.5 text-[12px] font-medium text-[#B45309]">{customerPhoneError}</span>
                  ) : null}
                </label>
              </div>

              <div className="mt-5">
                <p className="text-[14px] font-black text-[#414042]">Anh/chị muốn triển khai trong khoảng thời gian nào?</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {installTimingOptions.map((item) => {
                    const active = installTiming === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setInstallTiming(item.id)}
                        data-press
                        className={`flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-center text-[12.5px] font-semibold leading-[1.15] transition-all ${
                          active
                            ? 'border-[#FDBA74] bg-[#FFF3E6] text-[#9A3412] shadow-[0_8px_18px_rgba(245,130,32,0.12)]'
                            : 'border-[#E5E7EB] bg-white text-[#414042]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active ? (
                          <span className="text-[13px] font-black leading-none text-[#F58220]" aria-hidden="true">
                            ✓
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                data-press
                className={`mt-5 flex min-h-[78px] w-full items-center justify-between rounded-[14px] px-4 py-4 text-left text-[16px] font-black leading-[1.15] text-white transition-all active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-100 ${
                  canSubmitSurvey
                    ? 'bg-[#F58220] shadow-[0_18px_34px_-22px_rgba(245,130,32,.85)]'
                    : 'bg-[#D4D4D8] shadow-none'
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-white text-[#F58220]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.1 9.62a16 16 0 0 0 6.28 6.28l1.19-1.18a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1 px-3">
                  Nhận tư vấn<br />miễn phí
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 text-white">
                  →
                </span>
              </button>
              <div className="mt-4 flex items-start justify-center gap-2 text-center text-[12.5px] leading-5 text-[#5F6673]">
                <span className="mt-0.5 text-[#F58220]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span>Tư vấn miễn phí, không ràng buộc mua hàng.</span>
              </div>
              <p className="mt-1 text-center text-[12.5px] leading-5 text-[#5F6673]">
                EPCVINA ưu tiên phương án phù hợp hóa đơn, mái và ngân sách thực tế.
              </p>
              <p className="mt-2 rounded-[14px] bg-[#F4F5F7] px-3 py-2 text-center text-[11.5px] leading-relaxed text-[#71717A]">
                Thông tin chỉ dùng cho mục đích tư vấn điện mặt trời EPCVINA và không chia sẻ cho bên thứ ba nếu chưa được anh/chị đồng ý.
              </p>
                </>
              )}
            </form>
          </div>
        ) : null}

        {activeScreen !== 'survey' ? (
          <a
            href={epcvinaHotlineHref}
            className="fixed bottom-5 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-[#F58220] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-700/25 ring-1 ring-white/40 transition-all hover:bg-[#E5252A] focus:outline-none focus:ring-4 focus:ring-orange-200"
            aria-label={`Gọi ${epcvinaHotlineLabel}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.1 9.62a16 16 0 0 0 6.28 6.28l1.19-1.18a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span>{epcvinaHotlineLabel}</span>
          </a>
        ) : null}
      </div>
    </CalculatorPageShell>
  );
}
