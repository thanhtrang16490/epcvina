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

const installTimingOptions = [
  { id: 'soonest', label: 'Sớm nhất có thể' },
  { id: '30days', label: 'Trong 30 ngày tới' },
  { id: '1-3months', label: '1–3 tháng tới' },
  { id: 'researching', label: 'Chỉ đang tìm hiểu' },
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
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="paybackRange" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path d={savingArea} fill="url(#paybackFill)" />
      <path d={`M${axisStart} ${investmentY}H${axisEnd}`} stroke="#201A12" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d={savingPath} fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 131H296" stroke="#EADFCC" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${minX} ${investmentY}H${maxX}`} stroke="url(#paybackRange)" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${averageX} ${investmentY}V131`} stroke="#201A12" strokeWidth="2" strokeLinecap="round" opacity="0.58" />
      <circle cx={averageX} cy={investmentY} r="6.5" fill="#201A12" />
      <circle cx={averageX} cy={investmentY} r="3" fill="#FBBF24" />
      <path d="M44 160H296" stroke="#EADFCC" strokeWidth="1.5" strokeLinecap="round" />
      <text x="44" y="153" fill="#756B5D" fontSize="11" fontWeight="400">
        0
      </text>
      <text x="292" y="153" fill="#756B5D" fontSize="11" fontWeight="400" textAnchor="end">
        12
      </text>
      <text x="50" y={Math.max(44, investmentY - 8)} fill="#201A12" fontSize="11" fontWeight="700">
        Vốn đầu tư
      </text>
      <text x="292" y={Math.max(42, savingEndY - 8)} fill="#F59E0B" fontSize="10.5" fontWeight="700" textAnchor="end">
        Tiết kiệm tích luỹ
      </text>
      <text x={averageX} y="153" fill="#201A12" fontSize="11" fontWeight="800" textAnchor={labelAnchor}>
        ~{averageYears.toFixed(1)} năm
      </text>
      <text x={averageX} y="169" fill="#756B5D" fontSize="9.5" fontWeight="500" textAnchor={labelAnchor}>
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
  const [dayUsage, setDayUsage] = useState(80);
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

  const activeScreen = calculatorScreens.includes(screen) ? screen : 'region';
  const billValue = Number(billAmount) || 0;
  const quickBills = quickBillsByType[billType as keyof typeof quickBillsByType];
  const roofValue = Number(roofArea) || 0;
  const nightUsage = 100 - dayUsage;
  const isNightUsageHigh = nightUsage >= 30;
  const canContinueBill = billValue > 0;
  const canContinueRoof = Boolean(roofType) && roofValue > 0;
  const customerNameError = customerName.trim().length > 1 ? '' : 'Vui lòng nhập họ tên để kỹ thuật viên tiện xưng hô.';
  const customerPhoneError = isLikelyVietnamPhone(customerPhone) ? '' : 'Vui lòng nhập số điện thoại/Zalo hợp lệ tại Việt Nam.';
  const canSubmitSurvey = !customerNameError && !customerPhoneError;
  const roofPotentialKwp = Math.round((roofValue / 6.5) * 10) / 10;
  const usageHint =
    isNightUsageHigh
      ? 'Tỷ lệ dùng buổi tối cao, hệ thống có thể cần thêm pin lưu trữ nếu công suất đủ lớn.'
      : 'Dùng điện chủ yếu ban ngày, hệ hòa lưới thường là phương án gọn và kinh tế.';
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
  const inverterKw = Math.max(1, Math.round(estimatedKwp * (phaseType === 'three' ? 0.9 : 0.77)));
  const resultAudience = billType === 'factory' ? 'nhà xưởng của' : billType === 'business' ? 'cơ sở kinh doanh của' : 'gia đình';
  const averageTariff = billType === 'factory' ? 2800 : billType === 'business' ? 3300 : 3000;
  const dailyConsumptionKwh = billValue > 0 ? billValue / averageTariff / 30 : 0;
  const nightlyConsumptionKwh = dailyConsumptionKwh * (nightUsage / 100);
  const batteryUsableRatio = 0.82; // DoD + inverter/round-trip losses.
  const storageDemandKwh = nightlyConsumptionKwh > 0 ? (nightlyConsumptionKwh / batteryUsableRatio) * 1.1 : 0;
  const storageBySystemKwh = estimatedKwp * (nightUsage / 30);
  const storageRawKwh = Math.min(storageDemandKwh, storageBySystemKwh);
  const storageStepKwh = billType === 'factory' && storageRawKwh > 100 ? 50 : storageRawKwh > 20 ? 10 : 5;
  const estimatedStorageKwh = isNightUsageHigh && storageRawKwh > 0 ? Math.max(5, Math.ceil(storageRawKwh / storageStepKwh) * storageStepKwh) : 0;
  const estimatedStorageLabel = formatStorageKwh(estimatedStorageKwh);
  const noStorageOffsetRatio = Math.min(0.72, Math.max(0.34, 0.28 + dayUsage / 100 * 0.5));
  const storageOffsetBonus = estimatedStorageKwh > 0 ? Math.min(0.2, nightUsage / 100 * 0.42) : 0;
  const billOffsetRatio = Math.max(0, Math.min(0.82, roofCoverageRatio * (noStorageOffsetRatio + storageOffsetBonus)));
  const monthlySaving = Math.max(0, billValue * billOffsetRatio);
  const afterBill = Math.max(0, billValue - monthlySaving);
  const annualSaving = Math.max(0, monthlySaving * 12);
  const annualKeepMillion = Math.max(0, Math.round(annualSaving / 1000000));
  const annualKeepLabel = formatMillionLong(annualKeepMillion);
  const lifetimeSaving = Math.max(0, annualSaving * 25);
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
        desc: `Sau khoảng ${formatYears(paybackAverage)}, mỗi năm anh/chị có thể giữ lại khoảng ${annualKeepLabel}.`,
        tone: 'border-[#BCEBCF] bg-[#F0FFF5] text-[#166534]',
      }
    : paybackAverage <= 8
      ? {
          title: 'Cần khảo sát để tối ưu thêm',
          desc: `Hoàn vốn khoảng ${formatYears(paybackAverage)}. Nên kiểm tra mái, hướng nắng và tỷ lệ dùng ban ngày để rút ngắn thời gian.`,
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
  const storageComparisonRows = [
    {
      label: estimatedStorageKwh > 0 ? 'Có pin lưu trữ' : 'Phương án hiện tại',
      cost: formatMillionShort(averageInvestmentMillion),
      saving: formatMillionLong(annualSavingMillion),
      payback: formatYears(paybackAverage),
      active: true,
    },
    {
      label: estimatedStorageKwh > 0 ? 'Không pin lưu trữ' : 'Nếu thêm pin lưu trữ',
      cost: estimatedStorageKwh > 0 ? formatMillionShort(noStorageInvestmentMillion) : 'Cần khảo sát',
      saving: estimatedStorageKwh > 0 ? formatMillionLong(noStorageAnnualSavingMillion) : 'Tăng dự phòng',
      payback: estimatedStorageKwh > 0 ? formatYears(noStoragePayback) : 'Phụ thuộc tải đêm',
      active: false,
    },
  ];
  const paybackSummaryCards = [
    { label: 'Vốn đầu tư TB', value: formatMillionShort(averageInvestmentMillion), tone: 'text-[#201A12]' },
    { label: 'Tiết kiệm/năm', value: formatMillionLong(annualSavingMillion), tone: 'text-[#15803D]' },
    { label: 'Lợi ích ròng 25 năm', value: formatMillionLong(netGain25Million), tone: 'text-[#F59E0B]' },
  ];
  const recommendedSystem = isNightUsageHigh
    ? {
        title: estimatedStorageLabel,
        label: 'Hệ Hybrid - pin lưu trữ',
        storageValue: estimatedStorageLabel,
        storageExtra: `Ban đêm ${nightUsage}% · ~${Math.round(nightlyConsumptionKwh * 10) / 10} kWh/ngày`,
      }
    : {
        title: 'Hệ Hòa Lưới',
        label: 'chưa cần Pin lưu trữ',
        storageValue: 'Chưa cần',
        storageExtra: 'Hòa lưới',
      };
  const phaseWarning = estimatedKwp >= 12 && phaseType === 'one'
    ? 'Công suất dự kiến khá lớn, nên khảo sát phương án 3 pha để vận hành ổn định hơn.'
    : phaseType === 'three'
      ? 'Hệ 3 pha phù hợp hơn cho tải kinh doanh/nhà xưởng hoặc công suất lớn.'
      : 'Hệ 1 pha phù hợp với đa số hộ gia đình công suất nhỏ và vừa.';
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
    { value: `~${annualKeepLabel}`, label: 'tiết kiệm mỗi năm' },
    { value: `~${formatYears(paybackAverage)}`, label: 'hoàn vốn dự kiến' },
    { value: formatMillionRange(costMin, costMax), label: 'chi phí dự kiến' },
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
    setRoofType('flat');
    setRoofArea('60');
    setDayUsage(80);
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
      title="Máy tính Điện Mặt Trời"
      eyebrow="Ước tính theo hoá đơn thực tế"
      showHeader={false}
    >
      <div className="space-y-5">
        {activeScreen !== 'survey' ? (
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f4b642] text-[#201A12] shadow-[0_16px_30px_-18px_rgba(245,158,11,.95)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3.5" />
                <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-tight text-[#201A12]">Máy tính Điện Mặt Trời</p>
              <p className="truncate text-[13px] leading-tight text-[#756B5D]">Ước tính theo hoá đơn thực tế</p>
            </div>
            {activeScreen === 'region' || activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' || activeScreen === 'survey' ? (
              <span className="shrink-0 rounded-full bg-[#EAF6E9] px-3 py-1.5 text-[11.5px] font-bold text-[#3A7A40]">Miễn phí</span>
            ) : activeScreen === 'result' ? (
              <span className="shrink-0 rounded-full bg-[#F8F1E7] px-3 py-1.5 text-[11.5px] font-bold text-[#756B5D]">Bước 3/3</span>
            ) : null}
          </div>

          {activeScreen === 'region' ? (
            <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#0F172A] px-6 py-6 text-white shadow-[0_26px_60px_-34px_rgba(17,24,39,.85)]">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.35)_0%,transparent_72%)]" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,.16)_0%,transparent_72%)]" />
              <div className="relative inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-bold text-white/80">
                Nhanh · Chính xác
              </div>
              <h1 className="relative mt-3 text-[27px] font-black leading-tight tracking-normal">
                Tính điện mặt trời theo hoá đơn của bạn
              </h1>
              <p className="relative mt-2 text-[15px] leading-6 text-white/72">
                Nhập số tiền điện hằng tháng để ước tính công suất nên lắp, chi phí đầu tư, số tấm pin và thời gian hoàn vốn.
              </p>
              <div className="relative mt-4 grid gap-2 text-[14px] font-medium text-white/92">
                {['Miễn phí', 'Không cần tài khoản', 'Nhận PDF tư vấn qua Zalo'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f6c445] text-[#0f172a]">
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
            <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#0F172A] px-6 py-6 text-white shadow-[0_26px_60px_-34px_rgba(17,24,39,.85)]">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.35)_0%,transparent_72%)]" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,.16)_0%,transparent_72%)]" />
              <h1 className="relative text-[18px] font-black leading-tight tracking-normal">
                Tính nhanh hệ điện mặt trời phù hợp
              </h1>
              <p className="relative mt-3 text-[15px] leading-[1.65] text-white/72">
                Nhập hóa đơn điện trung bình để hệ thống ước tính công suất nên lắp, chi phí đầu tư và thời gian hoàn vốn.
              </p>
            </div>
          ) : null}
        </div>
        ) : null}

        {activeScreen === 'region' ? (
          <div className="space-y-3">
            <div>
              <h2 className="text-[22px] font-black leading-tight tracking-normal text-[#201A12]">Nhà bạn ở khu vực nào?</h2>
              <p className="mt-1 text-[15px] leading-6 text-[#756B5D]">
                Chọn tỉnh/thành để hệ thống tính lượng nắng và đưa ra gợi ý điện mặt trời phù hợp hơn.
              </p>
            </div>
            <label className="flex h-11 items-center gap-3 rounded-full border border-[#eadfcc] bg-white px-4 shadow-[0_10px_24px_rgba(31,24,19,0.05)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#8A7C6D]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#201A12] outline-none placeholder:text-[#8E7F6F]"
                placeholder="Tìm nhanh tỉnh/thành... (vd: hue, vinh phuc)"
                name="calculator-region-search"
                aria-label="Tìm nhanh tỉnh hoặc thành phố"
              />
            </label>
            <div className="space-y-3">
              {regionSearchResults.map((item) => {
                const active = isSearchingRegion ? item.cities.length > 0 : expandedRegion === item.id;
                return (
                  <article key={item.id} className="overflow-hidden rounded-[24px] border border-[#eadfcc] bg-[#FFFDF8] shadow-[0_10px_24px_rgba(31,24,19,0.05)]">
                    <button
                      type="button"
                      onClick={() => setExpandedRegion(active ? '' : item.id)}
                      className="flex min-h-[66px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF2D6] text-[18px] font-black text-[#B56D0B]">
                          <OptionIcon type={item.id} />
                        </span>
                        <span>
                        <span className="block text-[17px] font-black leading-tight text-[#201A12]">{item.label}</span>
                        <span className="mt-1 block text-[13px] leading-tight text-[#756B5D]">
                          {isSearchingRegion ? `${item.cities.length} kết quả phù hợp` : item.sub}
                        </span>
                      </span>
                      </span>
                      <span className="text-[#7b6d5d]" aria-hidden="true"><ChevronIcon open={active} /></span>
                    </button>
                    {active ? (
                      <div className="border-t border-[#eadfcc] px-4 py-4">
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
                                  selected ? 'border-[#2D63B6] bg-[#2D63B6] text-white' : 'border-[#e9decf] bg-white text-[#3b3127]'
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
                <div className="rounded-[20px] border border-[#eadfcc] bg-[#FFFDF8] px-4 py-5 text-center text-[14px] font-medium text-[#756B5D]">
                  Không tìm thấy tỉnh/thành phù hợp. Thử nhập tên không dấu hoặc một phần tên tỉnh.
                </div>
              ) : null}
            </div>
          </div>
        ) : activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' ? (
          <div className={activeScreen === 'bill' || activeScreen === 'roof' || activeScreen === 'usage' ? '' : 'space-y-4 rounded-[28px] border border-[#eadfcc] bg-white p-4 shadow-[0_10px_24px_rgba(31,24,19,0.05)]'}>
            {activeScreen === 'bill' ? (
              <>
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#F59E0B]">Bước 2 / 4</span>
                    <span className="text-[#756B5D]">Hóa đơn điện</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F59E0B]" />
                    ))}
                    {[2, 3].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#E5D8C2]" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight tracking-[-0.02em] text-[#201A12]">
                    Tiền điện trung bình mỗi tháng của bạn khoảng bao nhiêu?
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
                            if (item.id !== 'family') setPhaseType('three');
                            if (item.id === 'family') setPhaseType('one');
                          }}
                          className={`min-h-[92px] rounded-[18px] border px-2.5 py-3 text-center transition-all ${
                            active
                              ? 'border-[#F59E0B] bg-[linear-gradient(160deg,#FBBF24,#F59E0B)] text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)]'
                              : 'border-[#eadfcc] bg-[#fffdf8] text-[#433827] shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]'
                          }`}
                        >
                          <span className="mx-auto grid h-7 w-7 place-items-center">
                            <OptionIcon type={item.id} />
                          </span>
                          <span className="mt-2 block text-[14px] font-semibold leading-tight">{item.title}</span>
                          <span className={`mt-1 block text-[10.5px] font-medium leading-snug ${active ? 'text-white/80' : 'text-[#756B5D]'}`}>
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-[13px] font-semibold text-[#756B5D]">Chọn nhanh theo hóa đơn phổ biến</p>
                    <div className="flex flex-wrap gap-2">
                      {quickBills.map((item) => {
                        const active = Number(billAmount) === item.value;
                        return (
                          <button
                          key={item.label}
                          type="button"
                          onClick={() => setBillAmount(String(item.value))}
                          className={`min-h-9 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all ${
                            active ? 'border-[#F59E0B] bg-[#F59E0B] text-white shadow-[0_12px_24px_-18px_rgba(245,158,11,.8)]' : 'border-[#E5D8C2] bg-[#fffdf8] text-[#433827]'
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
                      className="h-16 w-full rounded-[18px] border border-[#eadfcc] bg-white px-5 pr-16 text-[22px] font-semibold text-[#201A12] shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)] outline-none transition-all placeholder:text-[#756B5D] focus:border-[#F59E0B] focus:ring-2 focus:ring-orange-100"
                      placeholder="Nhập số tiền…"
                    />
                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#756B5D]">VND</span>
                  </label>

                  <p className="mt-4 text-[13px] leading-6 text-[#8A7C6D]">
                    Có thể nhập gần đúng, không cần chính xác. Hãy dùng số trên hóa đơn điện tháng gần nhất.
                  </p>
                  <p className="mt-2 rounded-[14px] bg-[#FFF7EA] px-3 py-2 text-[12px] leading-relaxed text-[#7C4A03]">
                    Khi đổi Gia đình/Kinh doanh/Nhà xưởng, hệ thống tự chọn mức hóa đơn phổ biến để kết quả thực tế hơn. Anh/chị vẫn có thể sửa lại số tiền.
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setScreen('roof')}
                    disabled={!canContinueBill}
                    className="flex min-h-12 w-full items-center justify-center rounded-[14px] bg-[#F59E0B] px-5 py-3 text-base font-bold text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)] transition-all active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    Tiếp tục →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#756B5D] transition-colors hover:text-[#201A12]"
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
                    <span className="text-[#F59E0B]">Bước 3 / 4</span>
                    <span className="text-[#756B5D]">Mái nhà</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F59E0B]" />
                    ))}
                    <span className="h-1 rounded-full bg-[#E5D8C2]" />
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight text-[#201A12]">Mái nhà của bạn?</h2>
                  <p className="mt-2 text-[14px] font-normal leading-6 text-[#756B5D]">
                    Chọn loại mái và diện tích có thể lắp pin để hệ thống ước tính sát hơn.
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
                            active ? 'border-[#F59E0B] shadow-[0_14px_28px_-22px_rgba(224,138,30,.85)]' : 'border-[#eadfcc]'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#FFF2D6] text-[#F59E0B]">
                              <OptionIcon type={item.id} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[15px] font-bold leading-5 text-[#201A12]">{item.title}</span>
                              <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-[#756B5D]">{item.desc}</span>
                            </span>
                          </span>
                          {active ? (
                            <span className="shrink-0 rounded-full bg-[#FFF2D6] px-2.5 py-1 text-[11px] font-semibold text-[#F59E0B]">
                              Đã chọn
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-[14px] font-semibold text-[#433827]">Diện tích mái có thể lắp tấm pin</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRoofArea((current) => String(Math.max(0, (Number(current) || 0) - 5)))}
                        disabled={roofValue <= 0}
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-[#eadfcc] bg-[#fffdf8] text-xl font-bold text-[#756B5D] transition-all disabled:opacity-35"
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
                          className="w-full rounded-[18px] border border-[#eadfcc] bg-white/80 py-3 pr-11 text-center text-2xl font-bold text-[#201A12] outline-none transition focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#756B5D]">m²</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRoofArea((current) => String((Number(current) || 0) + 5))}
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-[#F59E0B] bg-[#fffdf8] text-xl font-bold text-[#F59E0B] transition-all active:scale-[.98]"
                      >
                        +
                      </button>
                    </div>
                    {roofValue > 0 ? (
                      <div className="mt-3 flex justify-center">
                        <span className="rounded-full bg-[#FFF2D6] px-3 py-1.5 text-[13px] font-semibold text-[#7C4A03]">
                          Có thể lắp tối đa khoảng {roofPotentialKwp} kWp
                        </span>
                      </div>
                    ) : null}
                    <p className="mt-3 rounded-[14px] bg-[#F8F6F1] px-3 py-2 text-[12px] leading-relaxed text-[#756B5D]">
                      {roofCostAdder.label}. Chi phí lắp đặt sẽ được cộng theo loại mái để dự toán sát hơn.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setScreen('usage')}
                    disabled={!canContinueRoof}
                    className="w-full rounded-[14px] bg-[#F59E0B] py-[15px] text-[15px] font-bold text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)] transition-all active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                  >
                    Tiếp tục →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#756B5D] transition-colors hover:text-[#433827]"
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
                    <span className="text-[#F59E0B]">Bước 4 / 4</span>
                    <span className="text-[#756B5D]">Thói quen sử dụng</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[0, 1, 2, 3].map((item) => (
                      <span key={item} className="h-1 rounded-full bg-[#F59E0B]" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[24px] font-bold leading-tight text-[#201A12]">Dùng điện lúc nào?</h2>
                  <p className="mt-2 text-[14px] font-normal leading-6 text-[#756B5D]">
                    Tỷ lệ dùng ban ngày giúp hệ thống gợi ý hòa lưới hay hybrid phù hợp hơn.
                  </p>

                  <div className="relative mt-5 h-16 select-none overflow-hidden rounded-[20px] border border-[#eadfcc] bg-white shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]">
                    <div
                      className="absolute left-0 top-0 flex h-full items-center justify-center overflow-hidden transition-[width] duration-150"
                      style={{
                        width: `${dayUsage}%`,
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
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
                      className="pointer-events-none absolute top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-[#111827] shadow-md transition-[left] duration-150"
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
                  <div className="mt-3 flex justify-between px-1 text-xs leading-4 text-[#756B5D]">
                    <span>Ban ngày tự dùng trực tiếp</span>
                    <span>Ban đêm cần cân nhắc pin</span>
                  </div>

                  <div
                    className={`mt-5 rounded-[20px] border px-4 py-3 text-sm leading-relaxed ${
                      isNightUsageHigh ? 'border-[#C7D2FE] bg-[#EEF2FF] text-[#3730A3]' : 'border-[#E5D8C2] bg-[#FFF2D6] text-[#7C4A03]'
                    }`}
                  >
                    {usageHint}
                  </div>
                  <div className="mt-3 rounded-[18px] border border-[#E5D8C2] bg-[#FFFDF8] px-4 py-3 text-[13px] leading-relaxed text-[#756B5D]">
                    {phaseWarning}
                  </div>

                  <p className="mb-2 mt-5 text-sm font-medium text-[#433827]">Hệ thống điện hiện tại</p>
                  <div className="mb-6 flex rounded-[18px] border border-[#eadfcc] bg-white p-1 shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]">
                    {phaseTypes.map((item) => {
                      const active = phaseType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPhaseType(item.id)}
                          className={`flex-1 rounded-[14px] py-2.5 text-sm font-semibold leading-tight transition-all duration-200 ${
                            active ? 'bg-[#F59E0B] text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)]' : 'bg-transparent text-[#756B5D]'
                          }`}
                        >
                          <span className="block">{item.title}</span>
                          <span className={`mt-1 block text-xs font-medium ${active ? 'text-white/85' : 'text-[#756B5D]'}`}>{item.desc}</span>
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
                    className="w-full rounded-[14px] bg-[#F59E0B] py-4 text-base font-bold text-white transition-all disabled:opacity-40"
                  >
                    Xem kết quả →
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="mt-3 w-full py-2 text-sm font-medium text-[#756B5D] transition-colors hover:text-[#433827]"
                  >
                    ← Quay lại
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : activeScreen === 'result' ? (
          <div className="calculator-result space-y-4">
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
            <div data-reveal style={{ '--delay': '0ms' } as React.CSSProperties} className="relative flex h-[348px] flex-col overflow-hidden rounded-[28px] bg-[#0F172A] px-5 py-5 text-white shadow-[0_26px_60px_-34px_rgba(17,24,39,.85)]">
              <div key={resultSlide} data-slide className="flex h-full flex-col">
                {resultSlide === 'estimate' ? (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FBBF24]">
                        Ước tính sơ bộ từ hóa đơn điện
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      Tham khảo
                    </span>
                  </div>
                  <div className="relative mb-4 text-[23px] font-black leading-tight tracking-[-.03em] text-white">
                    Hoàn vốn dự kiến: ~{paybackAverage.toFixed(1)} năm
                  </div>
                  <div className="relative grid gap-3">
                    <div className="grid gap-2.5 leading-relaxed text-[#CBD5E1]">
                      <p className="text-[14.5px]">
                        Hệ thống giúp anh chị tiết kiệm{' '}
                        <strong className="whitespace-nowrap text-[16px] font-bold text-[#34D399]">
                          ~{annualKeepLabel}/năm
                        </strong>
                      </p>
                      <p className="text-[14.5px]">
                        Tương đương{' '}
                        <strong className="whitespace-nowrap text-[21px] font-black leading-none text-[#34D399]">
                          {formatCurrency(lifetimeSaving)}
                        </strong>
                        /25 năm
                        <span className="block text-[11.5px] leading-relaxed text-[#94A3B8]">
                          25 năm là tuổi thọ tham khảo của tấm pin.
                        </span>
                      </p>
                    </div>
                  </div>
                  </>
                ) : resultSlide === 'saving' ? (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FBBF24]">
                        Bạn giữ lại mỗi tháng
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      Tiết kiệm hóa đơn
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
                          className="block h-full rounded-full bg-[#FBBF24]"
                          style={{ width: `${Math.max(0, Math.min(100, (afterBill / Math.max(billValue, 1)) * 100))}%` }}
                        />
                      </span>
                      <strong className="text-right text-[13px] font-bold text-[#FBBF24]">~{formatCurrency(afterBill)}</strong>
                    </div>
                  </div>
                  <p className="relative mt-4 text-[13px] leading-relaxed text-[#CBD5E1]">
                    Số tiền ước tính có thể giữ lại thay vì trả cho tiền điện.
                  </p>
                  </>
                ) : (
                  <>
                  <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.38)_0%,transparent_70%)]" />
                  <div className="relative mt-5 mb-2 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#FBBF24]">
                        Tốt cho gia đình & môi trường
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[.08] px-3 py-1.5 text-[11.5px] font-bold leading-normal text-[#CBD5E1]">
                      Giảm phát thải
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
                    Theo giá carbon EU: tương đương ~{carbonValueMillion} triệu đồng mỗi năm.
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
                className="grid h-8 w-8 place-items-center rounded-full border border-[#E5D8C2] bg-[#FFFDF8] text-base font-bold text-[#756B5D] shadow-sm"
                aria-label="Xem kết quả trước"
              >
                ‹
              </button>
              {([
                { id: 'saving' as const, label: 'Tài chính' },
                { id: 'estimate' as const, label: 'Cấu hình' },
                { id: 'environment' as const, label: 'Môi trường' },
              ]).map((slide) => {
                const active = resultSlide === slide.id;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setResultSlide(slide.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                      active ? 'bg-[#F59E0B] text-white shadow-sm' : 'bg-[#E5D8C2] text-[#756B5D]'
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
                className="grid h-8 w-8 place-items-center rounded-full border border-[#E5D8C2] bg-[#FFFDF8] text-base font-bold text-[#756B5D] shadow-sm"
                aria-label="Xem kết quả tiếp theo"
              >
                ›
              </button>
            </div>

            <div data-reveal style={{ '--delay': '80ms' } as React.CSSProperties} className="space-y-3">
              <p className="flex items-center gap-2 text-[12.5px] font-medium leading-normal text-[#756B5D]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FFF7EA] text-[#F59E0B]">
                  <ResultMetricIcon type="power" />
                </span>
                <span>
                  Hệ thống phù hợp với <strong className="font-black text-[#201A12]">{resultAudience}</strong> anh/chị
                </span>
              </p>
              <div className="grid gap-2">
                <p className="rounded-[16px] border border-[#E5D8C2] bg-[#FFFDF8] px-3 py-2 text-[12px] font-medium leading-relaxed text-[#756B5D]">
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
                  { icon: 'power' as const, value: `${estimatedKwp} kWp`, label: 'Công suất nên lắp', tall: true },
                  { icon: 'panel' as const, value: `${estimatedPanels} tấm`, label: 'Pin 650 Wp/tấm', tall: true },
                  { icon: 'grid' as const, value: recommendedSystem.title, label: recommendedSystem.label, tall: false },
                  { icon: 'cost' as const, value: formatMillionRange(costMin, costMax), label: 'Chi phí dự kiến', tall: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.tall ? 'min-h-[105px]' : 'min-h-24'} w-full rounded-[18px] border border-[#eadfcc] bg-[#FFFDF8] p-[13px] text-left shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]`}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF7EA] text-[#F59E0B]">
                      <ResultMetricIcon type={item.icon} />
                    </span>
                    <p className={`${item.tall ? 'text-[27px]' : 'text-[19px]'} mt-2 font-black leading-none tracking-[-.03em] text-[#201A12]`}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11.5px] leading-snug text-[#756B5D]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal style={{ '--delay': '150ms', marginTop: '12px' } as React.CSSProperties} className="rounded-[24px] border border-[#eadfcc] bg-[#FFFDF8] p-4 shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]">
              <div>
                <h3 className="mb-2 text-[15px] font-black text-[#201A12]">Thời gian hoàn vốn</h3>
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
                      <p className="mt-1 text-[9.8px] font-medium leading-snug text-[#756B5D]">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 rounded-[14px] bg-[#FFF7EA] px-3 py-2 text-[11.5px] leading-relaxed text-[#756B5D]">
                  Công thức: hoàn vốn = vốn đầu tư trung bình / tiền tiết kiệm mỗi năm. Tiền tiết kiệm đã tính theo diện tích mái, vùng nắng, tỷ lệ dùng ban ngày/ban đêm và pin lưu trữ sơ bộ.
                </p>
                <div className={`mt-3 rounded-[16px] border px-3 py-2.5 ${paybackSignal.tone}`}>
                  <p className="text-[13px] font-black leading-tight">{paybackSignal.title}</p>
                  <p className="mt-1 text-[11.5px] font-medium leading-relaxed opacity-90">{paybackSignal.desc}</p>
                </div>
                <div className="mt-3">
                  <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#756B5D]">3 kịch bản hoàn vốn</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {paybackScenarios.map((item) => (
                      <div key={item.label} className="rounded-[14px] border border-[#F0E4D2] bg-white px-2.5 py-2 shadow-[0_8px_20px_-18px_rgba(67,56,39,.45)]">
                        <p className="text-[10.5px] font-bold leading-tight text-[#756B5D]">{item.label}</p>
                        <p className="mt-1 text-[13px] font-black leading-tight text-[#201A12]">{item.value}</p>
                        <p className="mt-1 text-[9.5px] font-medium leading-snug text-[#8A7C6D]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 rounded-[16px] border border-[#F0E4D2] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#756B5D]">Có pin / Không pin</p>
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
                          item.active ? 'bg-[#FFF7EA] text-[#201A12]' : 'bg-[#F8F6F1] text-[#756B5D]'
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
                </div>
                <p className="mt-2.5 rounded-[14px] bg-[#F8F6F1] px-3 py-2 text-[11.5px] leading-relaxed text-[#756B5D]">
                  Ước tính chưa bao gồm: bảo trì định kỳ, lãi vay, biến động giá thiết bị, tăng giá điện hằng năm, suy hao tấm pin và giới hạn đấu nối thực tế. Khảo sát thực tế sẽ giúp chốt phương án chính xác hơn.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScreen('survey')}
                data-press
                className="mt-3 flex w-full flex-col items-center justify-center gap-1 rounded-[14px] bg-[#F59E0B] px-4 py-3.5 text-center text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)]"
              >
                <span className="text-[14px] font-black leading-tight">Đăng ký khảo sát miễn phí</span>
                <span className="text-[11.5px] font-medium leading-snug text-white/85">Nhà thầu uy tín gần bạn lên phương án miễn phí</span>
              </button>
            </div>

            <p data-reveal style={{ '--delay': '220ms' } as React.CSSProperties} className="mb-3 px-1 text-[13px] leading-relaxed text-[#756B5D]">
              {isNightUsageHigh
                ? 'Nhà bạn dùng điện ban đêm khá nhiều, nên khảo sát thêm phương án hybrid kèm pin lưu trữ để tăng tỷ lệ tự dùng và có điện dự phòng.'
                : 'Nhà bạn đủ điều kiện để khảo sát điện mặt trời. Bước tiếp theo: nhà thầu uy tín gần bạn kiểm tra mái, hóa đơn và lên thiết kế miễn phí.'}
            </p>

            <div data-reveal style={{ '--delay': '240ms' } as React.CSSProperties} className="relative mt-4 cursor-pointer rounded-[24px] border border-[#eadfcc] bg-[#FFFDF8] px-4 py-5 shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)] transition-transform active:scale-[.995]">
              <div className="text-center">
                <p className="text-[11px] font-black uppercase leading-normal tracking-[.12em] text-[#15803D]">
                  Miễn phí • Nhà thầu uy tín gần bạn
                </p>
                <h3 className="mt-2 text-[18px] font-black leading-tight text-[#201A12]">
                  Để lại thông tin để được khảo sát & lên thiết kế miễn phí
                </h3>
                <p className="mt-2 text-[13px] font-normal leading-relaxed text-[#756B5D]">
                  Kỹ thuật viên sẽ liên hệ, kiểm tra hóa đơn và mái nhà, rồi đề xuất phương án điện mặt trời phù hợp với nhu cầu thực tế của bạn.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10.5px] font-bold text-[#756B5D]">
                  {['Phản hồi trong 24h', 'Thông tin bảo mật', 'Không ràng buộc'].map((item) => (
                    <span key={item} className="rounded-full bg-[#F8F6F1] px-2 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScreen('survey')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F59E0B] px-4 py-[15px] text-[15px] font-bold leading-[22.5px] text-white shadow-[0_16px_32px_-20px_rgba(245,158,11,.8)] transition-transform active:scale-[.99]"
              >
                Đăng ký khảo sát miễn phí
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowTech((current) => !current)}
              className="flex w-full items-center justify-center gap-1 bg-transparent px-0 py-2 text-sm font-normal text-[#8A7C6D]"
            >
              {showTech ? 'Ẩn chi tiết kỹ thuật' : 'Xem thêm chi tiết kỹ thuật'} <span aria-hidden="true">▾</span>
            </button>
            {showTech ? (
              <div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  {[
                    { value: `${estimatedKwp} kWp`, label: 'Công suất' },
                    { value: `${estimatedPanels} tấm`, label: 'Số tấm pin', extra: '650 Wp/tấm' },
                    { value: recommendedSystem.storageValue, label: 'Pin lưu trữ', extra: recommendedSystem.storageExtra },
                    { value: `${inverterKw} kW`, label: 'Inverter' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                      <div className="whitespace-nowrap text-xl font-bold leading-7 text-gray-800">{item.value}</div>
                      <div className="mt-1 text-xs leading-4 text-gray-500">{item.label}</div>
                      {item.extra ? (
                        <div className={`mt-1 text-xs leading-4 ${item.label === 'Số tấm pin' ? 'text-orange-500' : 'text-gray-400'}`}>
                          {item.extra}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5 text-[#201A12]">
                  Lưu ý: Đây là cấu hình sơ bộ. Để biết chính xác nên lắp lớn hơn hay nhỏ hơn, cần kiểm tra thêm mái nhà, hướng nắng, thiết bị phù hợp và thói quen dùng điện thực tế.
                </div>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen('usage')}
                className="block flex-1 rounded-[16px] border border-[#E6E8EF] bg-transparent px-0 py-3 text-center text-sm font-normal text-[#64748B]"
              >
                ← Sửa lại
              </button>
              <button
                type="button"
                onClick={resetCalculator}
                className="block flex-1 bg-transparent px-0 py-3 text-center text-sm font-normal text-[#8A7C6D]"
              >
                ↩ Tính lại từ đầu
              </button>
            </div>
          </div>
        ) : activeScreen === 'survey' ? (
          <div className="calculator-result space-y-3">
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

            <button
              type="button"
              onClick={() => setScreen('result')}
              data-reveal
              className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfcc] bg-[#FFFDF8] px-4 py-2.5 text-[14px] font-medium text-[#433827] shadow-[0_10px_24px_rgba(31,24,19,0.05)] transition-colors hover:text-[#201A12]"
            >
              ← Xem lại kết quả
            </button>

            <form
              data-reveal
              style={{ '--delay': '80ms' } as React.CSSProperties}
              className="rounded-[24px] border border-[#eadfcc] bg-[#FFFDF8] px-4 pb-5 pt-5 shadow-[0_12px_30px_-22px_rgba(67,56,39,.42)]"
              onSubmit={(event) => {
                event.preventDefault();
                setSurveyAttempted(true);
                if (!canSubmitSurvey) return;

                window.localStorage.setItem('epcvina-calculator-lead', JSON.stringify(leadPayload));
                setSurveySubmitted(true);
              }}
            >
              <div className="relative overflow-hidden rounded-[18px] shadow-[0_18px_38px_-24px_rgba(31,24,19,.65)]">
                <img
                  src="/hero-bg-768.webp"
                  alt=""
                  className="h-[174px] w-full object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 flex min-h-10 items-center rounded-[14px] bg-white/88 px-3 text-[13px] font-semibold text-[#201A12] shadow-[0_12px_30px_-18px_rgba(31,24,19,.45)] backdrop-blur-md">
                  Tư vấn miễn phí theo nhu cầu nhà bạn
                </div>
                <div className="absolute right-4 top-8 w-[106px] rounded-[12px] bg-white/92 px-3 py-2 shadow-[0_12px_30px_-18px_rgba(31,24,19,.55)] backdrop-blur-md">
                  <div className="flex h-12 items-end gap-1">
                    {[18, 26, 34, 42, 50, 38, 30, 22].map((height, index) => (
                      <span
                        key={index}
                        className="w-1.5 rounded-full bg-[#1F4B8F]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 h-0.5 rounded-full bg-[#F59E0B]" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className={`h-2 rounded-full ${item === 0 ? 'w-7 bg-[#2FBD6A]' : 'w-2 bg-[#BFEFCF]'}`}
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
                  <h2 className="mt-4 text-[23px] font-black leading-[1.18] tracking-[-.025em] text-[#111827]">
                    Đã nhận thông tin khảo sát
                  </h2>
                  <p className="mt-3 text-[14px] leading-[1.75] text-[#5F6673]">
                    EPCVINA sẽ liên hệ với anh/chị trong vòng 24 giờ làm việc để xác nhận hóa đơn, mái nhà và lên phương án miễn phí.
                  </p>
                  <div className="mt-5 rounded-[18px] border border-[#BCEBCF] bg-[#F0FFF5] px-4 py-3 text-left text-[13px] leading-relaxed text-[#166534]">
                    <p className="font-black">Thông tin đã gửi</p>
                    <p className="mt-1">Tên: {customerName.trim()}</p>
                    <p>SĐT/Zalo: {customerPhone.trim()}</p>
                    <p>Dự định lắp: {installTimingOptions.find((item) => item.id === installTiming)?.label}</p>
                  </div>
                  <div className="mt-3 rounded-[18px] border border-[#E5D8C2] bg-white px-4 py-3 text-left text-[12px] leading-relaxed text-[#756B5D]">
                    <p className="font-black text-[#201A12]">Tóm tắt phương án gửi kèm</p>
                    <p className="mt-1">Khu vực: {province || 'Chưa chọn'}</p>
                    <p>Hóa đơn: {formatCurrency(billValue)}/tháng · Mái: {roofValue} m²</p>
                    <p>Công suất: {estimatedKwp} kWp · Pin: {recommendedSystem.storageValue}</p>
                    <p>Chi phí: {formatMillionRange(costMin, costMax)} · Hoàn vốn: {formatYears(paybackAverage)}</p>
                  </div>
                  <a
                    href={epcvinaHotlineHref}
                    className="mt-5 flex min-h-[58px] w-full items-center justify-center rounded-[14px] bg-[#2FBD6A] px-4 py-3 text-[15px] font-black text-white shadow-[0_18px_34px_-22px_rgba(47,189,106,.85)]"
                  >
                    Gọi EPCVINA: {epcvinaHotlineLabel}
                  </a>
                  <button
                    type="button"
                    onClick={() => setScreen('result')}
                    className="mt-3 w-full py-2 text-[13px] font-bold text-[#756B5D]"
                  >
                    ← Xem lại kết quả
                  </button>
                </div>
              ) : (
                <>
              <h2 className="mt-5 text-[23px] font-black leading-[1.18] tracking-[-.025em] text-[#111827]">
                Nhận phương án khảo sát riêng cho nhà bạn
              </h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-[#5F6673]">
                Nhập SĐT/Zalo và họ tên để nhà thầu uy tín gần bạn tư vấn, khảo sát và lên thiết kế miễn phí.
              </p>

              <div className="mt-5 grid gap-3">
                <label className="relative grid">
                  <span className="sr-only">Họ và tên</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#48B978]">
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
                    className="h-[54px] rounded-[14px] border border-[#E7E1D8] bg-white pl-12 pr-4 text-[15px] font-medium text-[#201A12] shadow-[0_10px_24px_rgba(31,24,19,0.06)] outline-none transition placeholder:text-[#9AA0A9] focus:border-[#F59E0B] focus:ring-2 focus:ring-orange-100"
                    placeholder="Họ và tên *"
                    autoComplete="name"
                  />
                  {surveyAttempted && customerNameError ? (
                    <span className="mt-1.5 text-[12px] font-medium text-[#B45309]">{customerNameError}</span>
                  ) : null}
                </label>
                <label className="relative grid">
                  <span className="sr-only">SĐT/Zalo</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#48B978]">
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
                    className="h-[54px] rounded-[14px] border border-[#E7E1D8] bg-white pl-12 pr-4 text-[15px] font-medium text-[#201A12] shadow-[0_10px_24px_rgba(31,24,19,0.06)] outline-none transition placeholder:text-[#9AA0A9] focus:border-[#F59E0B] focus:ring-2 focus:ring-orange-100"
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
                <p className="text-[14px] font-black text-[#111827]">Dự định lắp khi nào?</p>
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
                            ? 'border-[#8EE2AF] bg-[#ECFFF4] text-[#166534] shadow-[0_8px_18px_rgba(47,189,106,0.10)]'
                            : 'border-[#E7E1D8] bg-white text-[#201A12]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active ? (
                          <span className="text-[13px] font-black leading-none text-[#2FBD6A]" aria-hidden="true">
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
                    ? 'bg-[#2FBD6A] shadow-[0_18px_34px_-22px_rgba(47,189,106,.85)]'
                    : 'bg-[#F8D294] shadow-[0_18px_34px_-24px_rgba(245,158,11,.9)]'
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-white text-[#66C68D]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.1 9.62a16 16 0 0 0 6.28 6.28l1.19-1.18a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1 px-3">
                  Đăng ký khảo sát<br />miễn phí
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35 text-white">
                  →
                </span>
              </button>
              <div className="mt-4 flex items-start justify-center gap-2 text-center text-[12.5px] leading-5 text-[#5F6673]">
                <span className="mt-0.5 text-[#4FB879]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <span>Miễn phí, không ràng buộc lắp đặt.</span>
              </div>
              <p className="mt-1 text-center text-[12.5px] leading-5 text-[#5F6673]">
                Kết nối nhà thầu uy tín gần khu vực của anh/chị.
              </p>
              <p className="mt-2 rounded-[14px] bg-[#F8F6F1] px-3 py-2 text-center text-[11.5px] leading-relaxed text-[#756B5D]">
                EPCVINA chỉ dùng thông tin này để tư vấn khảo sát, không chia sẻ cho bên thứ ba khi chưa có sự đồng ý của anh/chị.
              </p>
                </>
              )}
            </form>
          </div>
        ) : null}

        {activeScreen !== 'survey' ? (
          <a
            href={epcvinaHotlineHref}
            className="fixed bottom-5 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-700/25 ring-1 ring-white/40 transition-all hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
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
