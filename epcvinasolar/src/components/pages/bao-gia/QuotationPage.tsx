import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Sun, Phone, User, Envelope, MapPin, Hash,
  Chat, House, Lightning, BatteryHigh, CheckCircle,
  CaretDown, Info, ChartBar, TrendUp,
  X, Calendar, Building, ArrowsClockwise, ArrowRight,
  Sparkle,
} from '@phosphor-icons/react';
import { SliderInput, ToggleRow } from '../../shared/solar-form-inputs';
import type { SolutionCard } from '../../shared/solar-form-inputs';
import HeaderBar from '../../home/layout/HeaderBar';
import { getLocaleFromPathname } from '../../../i18n/messages';
import { getLocalePath } from '../../../i18n/routes';
import { trackEvent } from '../../../lib/tracking';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const copy: Record<Locale, any> = {
  vi: {
    systemType: 'Loại hệ thống mong muốn',
    system: 'Hệ',
    phase: 'Số pha',
    batteryVolt: 'Áp pin lưu trữ',
    stats: { production: 'Sản lượng', payback: 'Hoàn vốn', savings: 'Tiết kiệm' },
    seeDetails: 'Xem chi tiết',
    heroTag: 'BÁO GIÁ & TƯ VẤN',
    heroTitle: ['Nhận Báo Giá', 'Chi Tiết'],
    heroLead: 'Điền thông tin và chọn thông số để nhận đề xuất, dự toán và phương án tối ưu trước khi chốt đầu tư.',
    sourceHome: 'Từ Solar Home',
    sourceCI: 'Từ Solar C&I',
    sourceCalc: 'Từ Calculator',
    contactInfo: 'Thông Tin Liên Hệ',
    contactLead: 'Điền thông tin để nhận báo giá',
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    province: 'Tỉnh/Thành phố',
    provincePlaceholder: 'Chọn tỉnh/thành phố',
    address: 'Địa chỉ lắp đặt',
    referral: 'Mã giới thiệu',
    notes: 'Ghi chú thêm',
    notesPlaceholder: 'Yêu cầu cụ thể hoặc thông tin bổ sung...',
    projectInfo: 'Thông Tin Công Trình',
    projectLead: 'Điều chỉnh các thông số phù hợp với nhu cầu',
    bill: 'Hóa đơn điện hàng tháng',
    roof: 'Diện tích mái có sẵn',
    budget: 'Ngân sách đầu tư',
    filterAll: 'Tất cả',
    noFilter: 'Không lọc',
    send: 'Xem Đề Xuất & Báo Giá',
    sent: 'Đã gửi — Xem đề xuất bên dưới',
    reset: 'Đặt lại',
    privacy: '* Thông tin sẽ được bảo mật tuyệt đối',
    resultTitle: 'Giải Pháp Phù Hợp Với Bạn',
    resultLead: (n: number) => `${n} giải pháp phù hợp — click để xem chi tiết`,
    noResult: 'Không có combo phù hợp với bộ lọc hiện tại',
    back: 'Về hub Solar C&I',
    mobileAction: 'Nhận báo giá',
    showDetails: 'Xem chi tiết',
  },
  en: {
    systemType: 'Desired system type',
    system: 'System',
    phase: 'Phase',
    batteryVolt: 'Battery voltage',
    stats: { production: 'Production', payback: 'Payback', savings: 'Savings' },
    seeDetails: 'View details',
    heroTag: 'QUOTE & CONSULTING',
    heroTitle: ['Get a Detailed', 'Quote'],
    heroLead: 'Fill in your information and choose the system parameters to receive recommendations, estimates, and the best investment plan.',
    sourceHome: 'From Solar Home',
    sourceCI: 'From Solar C&I',
    sourceCalc: 'From Calculator',
    contactInfo: 'Contact Information',
    contactLead: 'Fill in your details to receive a quote',
    name: 'Full name',
    phone: 'Phone number',
    province: 'Province / City',
    provincePlaceholder: 'Select a province/city',
    address: 'Installation address',
    referral: 'Referral code',
    notes: 'Additional notes',
    notesPlaceholder: 'Specific requirements or extra information...',
    projectInfo: 'Project Information',
    projectLead: 'Adjust parameters to fit your needs',
    bill: 'Monthly electricity bill',
    roof: 'Available roof area',
    budget: 'Investment budget',
    filterAll: 'All',
    noFilter: 'No filter',
    send: 'View Recommendations & Quote',
    sent: 'Sent - see recommendations below',
    reset: 'Reset',
    privacy: '* Your information will be kept strictly confidential',
    resultTitle: 'Solutions That Fit You',
    resultLead: (n: number) => `${n} matching solutions - click to view details`,
    noResult: 'No combo matches the current filter',
    back: 'Back to Solar C&I hub',
    mobileAction: 'Get a quote',
    showDetails: 'View details',
  },
  zh: {
    systemType: '所需系统类型',
    system: '系统',
    phase: '相数',
    batteryVolt: '电池电压',
    stats: { production: '发电量', payback: '回本', savings: '节省' },
    seeDetails: '查看详情',
    heroTag: '报价与咨询',
    heroTitle: ['获取详细', '报价'],
    heroLead: '填写信息并选择参数，即可获得方案建议、预算和最佳投资方案。',
    sourceHome: '来自 Solar Home',
    sourceCI: '来自 Solar C&I',
    sourceCalc: '来自计算器',
    contactInfo: '联系信息',
    contactLead: '填写信息以接收报价',
    name: '姓名',
    phone: '电话号码',
    province: '省 / 市',
    provincePlaceholder: '选择省市',
    address: '安装地址',
    referral: '推荐码',
    notes: '补充说明',
    notesPlaceholder: '具体需求或补充信息...',
    projectInfo: '项目信息',
    projectLead: '根据需求调整参数',
    bill: '每月电费',
    roof: '可用屋顶面积',
    budget: '投资预算',
    filterAll: '全部',
    noFilter: '不过滤',
    send: '查看建议与报价',
    sent: '已发送 - 请查看下方方案',
    reset: '重置',
    privacy: '* 您的信息将被严格保密',
    resultTitle: '适合您的方案',
    resultLead: (n: number) => `${n} 个匹配方案 - 点击查看详情`,
    noResult: '当前筛选条件下没有匹配方案',
    back: '返回 Solar C&I 中心',
    mobileAction: '获取报价',
    showDetails: '查看详情',
  },
  ja: {
    systemType: '希望するシステム種別',
    system: 'システム',
    phase: '相数',
    batteryVolt: '蓄電池電圧',
    stats: { production: '発電量', payback: '回収', savings: '削減額' },
    seeDetails: '詳細を見る',
    heroTag: '見積・相談',
    heroTitle: ['詳細な', '見積を取得'],
    heroLead: '情報を入力し、条件を選択すると、提案・概算・最適な投資案をご案内します。',
    sourceHome: 'Solar Home から',
    sourceCI: 'Solar C&I から',
    sourceCalc: '計算ツールから',
    contactInfo: '連絡先情報',
    contactLead: '見積を受け取るために情報を入力してください',
    name: '氏名',
    phone: '電話番号',
    province: '都道府県 / 市',
    provincePlaceholder: '都道府県を選択',
    address: '設置住所',
    referral: '紹介コード',
    notes: '備考',
    notesPlaceholder: '要望や補足情報...',
    projectInfo: '案件情報',
    projectLead: 'ご要望に合わせて条件を調整してください',
    bill: '月額電気料金',
    roof: '利用可能な屋根面積',
    budget: '投資予算',
    filterAll: 'すべて',
    noFilter: 'フィルタなし',
    send: '提案と見積を見る',
    sent: '送信済み - 下の提案をご覧ください',
    reset: 'リセット',
    privacy: '* 情報は厳重に管理されます',
    resultTitle: 'あなたに合うソリューション',
    resultLead: (n: number) => `${n} 件の候補 - 詳細を見る`,
    noResult: '現在の条件に合う組み合わせはありません',
    back: 'Solar C&I ハブへ戻る',
    mobileAction: '見積を受け取る',
    showDetails: '詳細を見る',
  },
  ko: {
    systemType: '희망 시스템 유형',
    system: '시스템',
    phase: '상',
    batteryVolt: '배터리 전압',
    stats: { production: '발전량', payback: '회수', savings: '절감액' },
    seeDetails: '상세 보기',
    heroTag: '견적 및 상담',
    heroTitle: ['상세한', '견적 받기'],
    heroLead: '정보를 입력하고 조건을 선택하면 제안, 예산안, 최적 투자안을 받아보실 수 있습니다.',
    sourceHome: 'Solar Home에서',
    sourceCI: 'Solar C&I에서',
    sourceCalc: '계산기에서',
    contactInfo: '연락처 정보',
    contactLead: '견적을 받기 위해 정보를 입력하세요',
    name: '성명',
    phone: '전화번호',
    province: '도 / 시',
    provincePlaceholder: '도시 선택',
    address: '설치 주소',
    referral: '추천 코드',
    notes: '추가 메모',
    notesPlaceholder: '요구 사항 또는 추가 정보...',
    projectInfo: '프로젝트 정보',
    projectLead: '요구에 맞게 조건을 조정하세요',
    bill: '월 전기요금',
    roof: '사용 가능한 지붕 면적',
    budget: '투자 예산',
    filterAll: '전체',
    noFilter: '필터 없음',
    send: '제안 및 견적 보기',
    sent: '전송 완료 - 아래 제안을 확인하세요',
    reset: '초기화',
    privacy: '* 정보는 엄격히 보호됩니다',
    resultTitle: '고객님께 맞는 솔루션',
    resultLead: (n: number) => `${n}개의 적합한 솔루션 - 상세 보기`,
    noResult: '현재 필터에 맞는 조합이 없습니다',
    back: 'Solar C&I 허브로 이동',
    mobileAction: '견적 받기',
    showDetails: '상세 보기',
  },
};

// ─────────────────────────────────────────────
// Cascading System Type Selector
// ─────────────────────────────────────────────
function SystemTypeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const kind: 'hybrid' | 'on-grid' | null =
    value.startsWith('hybrid') ? 'hybrid' : value.startsWith('on-grid') ? 'on-grid' : null;
  const phase: '1' | '3' | null =
    value.endsWith('1p') ? '1' : value.includes('3p') ? '3' : null;
  const battVolt: 'lv' | 'hv' | null =
    value.endsWith('-lv') ? 'lv' : value.endsWith('-hv') ? 'hv' : null;

  const handleKind = (k: string) => {
    onChange(k === 'on-grid' ? 'on-grid-1p' : 'hybrid-1p');
  };
  const handlePhase = (p: string) => {
    if (kind === 'on-grid') onChange(`on-grid-${p}p`);
    else onChange(p === '1' ? 'hybrid-1p' : 'hybrid-3p-lv');
  };
  const handleBatt = (v: string) => {
    onChange(`hybrid-3p-${v}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="w-8 h-8 rounded-lg bg-[#FFF4E8] flex items-center justify-center text-[#F5831F] flex-shrink-0">
          <Lightning className="w-4 h-4" />
        </span>
        Loại hệ thống mong muốn
      </div>
      <ToggleRow
        label="Hệ"
        value={kind}
        onChange={handleKind}
        options={[
          { value: 'hybrid',  label: 'Hybrid',  sub: 'Lưu trữ + dự phòng' },
          { value: 'on-grid', label: 'On-Grid', sub: 'Nối lưới trực tiếp' },
        ]}
        accentBlue={kind === 'hybrid'}
      />
      {kind && (
        <ToggleRow
          label="Số pha"
            value={phase}
            onChange={handlePhase}
            options={[
              { value: '1', label: '1 Pha', sub: 'Hộ gia đình' },
              { value: '3', label: '3 Pha', sub: 'Doanh nghiệp' },
            ]}
            accentBlue
          />
      )}
      {kind === 'hybrid' && phase === '3' && (
        <ToggleRow
          label="Áp pin lưu trữ"
            value={battVolt}
            onChange={handleBatt}
            options={[
              { value: 'lv', label: 'Áp thấp', sub: '48V · Phổ thông' },
              { value: 'hv', label: 'Áp cao',  sub: '100V+ · Hiệu suất cao' },
            ]}
            accentBlue
          />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Recommendation Card (exact SSF Column 2 copy)
// ─────────────────────────────────────────────
function RecommendationCard({ sol, index, isSelected, onSelect }: {
  sol: SolutionCard;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isHybrid = sol.type === 'hybrid';

  return (
    <div
      onClick={onSelect}
      className={`animate-slide-in-up group rounded-xl border transition-all duration-200 ease-in-out cursor-pointer overflow-hidden motion-reduce:transition-none motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-[#DC2626] bg-red-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-[#DC2626]/40 hover:shadow-md'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color bar top */}
      <div
        className="h-0.5 w-full"
        style={{ background: isHybrid ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' : 'linear-gradient(90deg,#DC2626,#F5831F)' }}
      />

      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-[#0F172A] text-sm leading-snug"
              style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' } as React.CSSProperties}
            >
              {sol.name}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: isHybrid ? 'rgba(29,78,216,0.08)' : 'rgba(234,88,12,0.08)',
                  color: isHybrid ? '#1d4ed8' : '#DC2626',
                }}
              >
                {isHybrid ? <Lightning className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                {isHybrid ? 'Hybrid' : 'On-Grid'}
              </span>
              {sol.battery && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                  <BatteryHigh className="w-3 h-3" />{sol.battery}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[13px] font-bold text-[#0F172A]">{sol.investment}M</span>
            <span className="text-[10px] text-gray-400 font-medium">VND</span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden border border-gray-100 bg-gray-100 text-center">
          {[
            { value: `${sol.productionMin}–${sol.productionMax}`, sub: 'kWh/tháng', label: 'Sản lượng' },
            { value: sol.paybackStr, sub: '', label: 'Hoàn vốn' },
            { value: `${(sol.savings / 1000000).toFixed(1)}M`, sub: 'VND/tháng', label: 'Tiết kiệm' },
          ].map(m => (
            <div key={m.label} className="bg-white py-1.5 px-1">
              <p className="text-[11px] font-bold text-[#0F172A] leading-tight">{m.value}</p>
              {m.sub && <p className="text-[9px] text-[#DC2626] font-medium leading-none mt-0.5">{m.sub}</p>}
              <p className="text-[9px] text-gray-400 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Solution Detail Modal (exact SSF Column 3 content as a modal)
// ─────────────────────────────────────────────
function SolutionDetailModal({ sol, onClose, isClosing }: { sol: SolutionCard; onClose: () => void; isClosing: boolean }) {
  const isHybrid = sol.type === 'hybrid';
  const panelBrand = 'Aiko';
  const inverterBrand = 'SAJ';
  const batteryBrand = isHybrid ? 'Genxgreen' : null;
  const panelCount = Math.ceil(sol.power * 1000 / 580);

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,     label: `Tấm ${panelBrand}`,          value: `${panelCount} tấm · ${sol.power} kWp` },
    { icon: <Lightning className="w-3.5 h-3.5 text-blue-500" />,      label: `Biến tần ${inverterBrand}`,   value: `${sol.power} kW` },
    ...(sol.battery && batteryBrand
      ? [{ icon: <BatteryHigh className="w-3.5 h-3.5 text-indigo-500" />, label: `Lưu trữ ${batteryBrand}`, value: sol.battery }]
      : []),
    { icon: <ChartBar className="w-3.5 h-3.5 text-[#DC2626]" />, label: 'Sản lượng/tháng',  value: `${sol.productionMin}–${sol.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />,  label: 'Hoàn vốn',          value: sol.paybackStr },
    ...(sol.roofArea
      ? [{ icon: <House className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${sol.roofArea} m²` }]
      : []),
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={`relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[700px] max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden z-10 ${isClosing ? 'animate-modal-panel-out' : 'animate-modal-panel-in'}`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable content — exact SSF Column 3 layout */}
        <div className="flex-1 overflow-y-auto">
          {/* Gradient header bar */}
          <div
            className="px-4 pt-4 pb-3"
            style={{ background: isHybrid ? 'linear-gradient(135deg,#eff6ff 0%,#f8fafc 100%)' : 'linear-gradient(135deg,#fff7ed 0%,#f8fafc 100%)' }}
          >
            {/* Type pill */}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"
              style={{
                background: isHybrid ? 'rgba(29,78,216,0.1)' : 'rgba(234,88,12,0.1)',
                color: isHybrid ? '#1d4ed8' : '#DC2626',
              }}
            >
              {isHybrid ? <Lightning className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              {isHybrid ? 'Hệ Hybrid' : 'Hệ On-Grid'}
            </span>
            {/* Name */}
            <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug pr-8">{sol.name}</h3>
            {/* Brand strip */}
            <p className="text-[12px] text-gray-500 mt-1">
              {[panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(' · ')}
            </p>
          </div>

          {/* Product image — 16:9 aspect */}
          <div className="relative mx-4 mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img src="/sample-combo.jpg" alt={sol.name} width={640} height={360} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%)' }} />
            <p className="absolute bottom-2.5 left-3 text-white text-[12px] font-semibold drop-shadow">{sol.name}</p>
          </div>

          {/* Price block */}
          <div className="mx-4 mt-3 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Giá niêm yết</p>
              <p className="text-[22px] font-extrabold text-[#0F172A] leading-tight mt-0.5">
                {new Intl.NumberFormat('vi-VN').format(sol.investment * 1_000_000)}
                <span className="text-[14px] font-semibold text-gray-500 ml-1">đ</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Công suất</p>
              <p className="text-[20px] font-extrabold text-[#DC2626] leading-tight mt-0.5">{sol.power} <span className="text-[13px] font-semibold text-gray-500">kWp</span></p>
            </div>
          </div>

          {/* Spec rows */}
          <div className="flex flex-col mx-4 mt-3 mb-4 rounded-xl border border-gray-100 overflow-hidden">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center justify-between px-4 py-2.5 gap-3 ${
                  i < specs.length - 1 ? 'border-b border-gray-100' : ''
                } ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex-shrink-0">{s.icon}</span>
                  <span className="text-[13px] text-gray-500 truncate">{s.label}</span>
                </div>
                <span className="text-[13px] font-semibold text-[#0F172A] text-right flex-shrink-0">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons — always visible at bottom */}
        <div className="flex gap-2.5 mx-4 my-3 flex-shrink-0">
          <a
            href="/calculator"
            className="btn-scale flex-1 h-11 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 ease-in-out shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
            style={{ background: 'linear-gradient(135deg,#DC2626 0%,#F5831F 100%)' }}
          >
            <Phone className="w-4 h-4" /> Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Combo Catalog (from SolarSolutionFinder — slmsolar.com)
// ─────────────────────────────────────────────
interface ComboCatalog {
  id: string;
  name: string;
  systemTypeKey: string;
  type: 'hybrid' | 'on-grid';
  power: number;
  battery?: number;
  investment: number;
  productionMin: number;
  productionMax: number;
  paybackStr: string;
  paybackYears: number;
  roofArea?: number;
}

function parsePayback(s: string): number {
  const m = s.match(/(\d+)n(\d+)t/);
  if (!m) return 5;
  return parseInt(m[1]) + parseInt(m[2]) / 12;
}
function fmtPayback(s: string): string {
  const m = s.match(/(\d+)n(\d+)t/);
  if (!m) return s;
  const t = parseInt(m[2]);
  return t > 0 ? `${m[1]} năm ${t} tháng` : `${m[1]} năm`;
}

const COMBO_CATALOG: ComboCatalog[] = [
  // ── Hybrid 1 pha ────────────────────────────────────────────
  { id: 'h1p-5-5',    name: 'Hy-Brid 5 kWp 1pha – 5.12 kWh',    systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 5,     battery: 5.12,  investment: 100.5, productionMin: 500,  productionMax: 700,  paybackStr: fmtPayback('4n8t'),  paybackYears: parsePayback('4n8t'),  roofArea: 21.6  },
  { id: 'h1p-5-10',   name: 'Hy-Brid 5 kWp 1pha – 10.24 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 5,     battery: 10.24, investment: 123.6, productionMin: 400,  productionMax: 600,  paybackStr: fmtPayback('6n10t'), paybackYears: parsePayback('6n10t'), roofArea: 21.6  },
  { id: 'h1p-88-5',   name: 'Hy-Brid 8.8 kWp 1pha – 5.12 kWh',  systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 8.75,  battery: 5.12,  investment: 125.2, productionMin: 600,  productionMax: 900,  paybackStr: fmtPayback('4n8t'),  paybackYears: parsePayback('4n8t'),  roofArea: 37.8  },
  { id: 'h1p-88-10',  name: 'Hy-Brid 8.8 kWp 1pha – 10.24 kWh', systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 8.75,  battery: 10.24, investment: 148.3, productionMin: 700,  productionMax: 1000, paybackStr: fmtPayback('4n10t'), paybackYears: parsePayback('4n10t'), roofArea: 37.8  },
  { id: 'h1p-107-5',  name: 'Hy-Brid 10.7 kWp 1pha – 5.12 kWh', systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 10.63, battery: 5.12,  investment: 151.4, productionMin: 900,  productionMax: 1200, paybackStr: fmtPayback('4n0t'),  paybackYears: parsePayback('4n0t'),  roofArea: 45.9  },
  { id: 'h1p-88-16',  name: 'Hy-Brid 8.8 kWp 1pha – 16 kWh',    systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 8.75,  battery: 16,    investment: 164.8, productionMin: 600,  productionMax: 900,  paybackStr: fmtPayback('6n2t'),  paybackYears: parsePayback('6n2t'),  roofArea: 37.8  },
  { id: 'h1p-107-10', name: 'Hy-Brid 10.7 kWp 1pha – 10.24 kWh',systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 10.63, battery: 10.24, investment: 174.5, productionMin: 900,  productionMax: 1200, paybackStr: fmtPayback('4n8t'),  paybackYears: parsePayback('4n8t'),  roofArea: 45.9  },
  { id: 'h1p-112-16', name: 'Hy-Brid 11.2 kWp 1pha – 16 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 11.25, battery: 16,    investment: 184.6, productionMin: 900,  productionMax: 1200, paybackStr: fmtPayback('4n11t'), paybackYears: parsePayback('4n11t'), roofArea: 48.6  },
  { id: 'h1p-107-16', name: 'Hy-Brid 10.7 kWp 1pha – 16 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 10.63, battery: 16,    investment: 189.9, productionMin: 900,  productionMax: 1200, paybackStr: fmtPayback('5n1t'),  paybackYears: parsePayback('5n1t'),  roofArea: 45.9  },
  { id: 'h1p-157-16', name: 'Hy-Brid 15.7 kWp 1pha – 16 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 15.63, battery: 16,    investment: 230.8, productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('4n9t'),  paybackYears: parsePayback('4n9t'),  roofArea: 67.5  },
  { id: 'h1p-188-16', name: 'Hy-Brid 18.8 kWp 1pha – 16 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 18.75, battery: 16,    investment: 261.3, productionMin: 1400, productionMax: 1600, paybackStr: fmtPayback('4n10t'), paybackYears: parsePayback('4n10t'), roofArea: 81    },
  { id: 'h1p-157-32', name: 'Hy-Brid 15.7 kWp 1pha – 32 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 15.63, battery: 32,    investment: 293.5, productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('6n1t'),  paybackYears: parsePayback('6n1t'),  roofArea: 67.5  },
  { id: 'h1p-244-32', name: 'Hy-Brid 24.4 kWp 1pha – 32 kWh',   systemTypeKey: 'hybrid-1p', type: 'hybrid',   power: 24.38, battery: 32,    investment: 367.5, productionMin: 2000, productionMax: 2200, paybackStr: fmtPayback('4n11t'), paybackYears: parsePayback('4n11t'), roofArea: 105.3 },
  // ── Hybrid 3 pha áp thấp ────────────────────────────────────
  { id: 'h3lv-107-5',  name: 'Hy-Brid 10.7 kWp 3pha AT – 5.12 kWh', systemTypeKey: 'hybrid-3p-lv', type: 'hybrid', power: 10.63, battery: 5.12, investment: 177.1, productionMin: 950,  productionMax: 1100, paybackStr: fmtPayback('4n10t'), paybackYears: parsePayback('4n10t'), roofArea: 45.9  },
  { id: 'h3lv-107-16', name: 'Hy-Brid 10.7 kWp 3pha AT – 16 kWh',   systemTypeKey: 'hybrid-3p-lv', type: 'hybrid', power: 10.63, battery: 16,   investment: 215.6, productionMin: 900,  productionMax: 1200, paybackStr: fmtPayback('5n9t'),  paybackYears: parsePayback('5n9t'),  roofArea: 45.9  },
  { id: 'h3lv-157-16', name: 'Hy-Brid 15.7 kWp 3pha AT – 16 kWh',   systemTypeKey: 'hybrid-3p-lv', type: 'hybrid', power: 15.63, battery: 16,   investment: 247,   productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('5n2t'),  paybackYears: parsePayback('5n2t'),  roofArea: 67.5  },
  { id: 'h3lv-244-16', name: 'Hy-Brid 24.4 kWp 3pha AT – 16 kWh',   systemTypeKey: 'hybrid-3p-lv', type: 'hybrid', power: 24.38, battery: 16,   investment: 321.8, productionMin: 1800, productionMax: 2200, paybackStr: fmtPayback('4n6t'),  paybackYears: parsePayback('4n6t'),  roofArea: 105.3 },
  // ── Hybrid 3 pha áp cao ─────────────────────────────────────
  { id: 'h3hv-157-15', name: 'Hy-Brid 15.7 kWp 3pha AC – 15.36 kWh', systemTypeKey: 'hybrid-3p-hv', type: 'hybrid', power: 15.63, battery: 15.36, investment: 271.7, productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('5n7t'),  paybackYears: parsePayback('5n7t'),  roofArea: 67.5  },
  { id: 'h3hv-244-15', name: 'Hy-Brid 24.4 kWp 3pha AC – 15.36 kWh', systemTypeKey: 'hybrid-3p-hv', type: 'hybrid', power: 24.38, battery: 15.36, investment: 345.2, productionMin: 1800, productionMax: 2200, paybackStr: fmtPayback('4n10t'), paybackYears: parsePayback('4n10t'), roofArea: 105.3 },
  // ── On-Grid 1 pha ────────────────────────────────────────────
  { id: 'og1p-5',   name: 'On-Grid 5 kWp 1 pha',    systemTypeKey: 'on-grid-1p', type: 'on-grid', power: 5,     investment: 60,    productionMin: 350,  productionMax: 450,  paybackStr: fmtPayback('4n3t'),  paybackYears: parsePayback('4n3t')  },
  { id: 'og1p-88',  name: 'On-Grid 8.8 kWp 1 pha',  systemTypeKey: 'on-grid-1p', type: 'on-grid', power: 8.75,  investment: 95,    productionMin: 800,  productionMax: 1000, paybackStr: fmtPayback('2n11t'), paybackYears: parsePayback('2n11t') },
  { id: 'og1p-107', name: 'On-Grid 10.7 kWp 1 pha', systemTypeKey: 'on-grid-1p', type: 'on-grid', power: 10.63, investment: 110.7, productionMin: 900,  productionMax: 1100, paybackStr: fmtPayback('3n1t'),  paybackYears: parsePayback('3n1t')  },
  // ── On-Grid 3 pha ────────────────────────────────────────────
  { id: 'og3p-107', name: 'On-Grid 10.7 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 10.63, investment: 108.4, productionMin: 800,  productionMax: 1000, paybackStr: fmtPayback('3n5t'),  paybackYears: parsePayback('3n5t')  },
  { id: 'og3p-157', name: 'On-Grid 15.7 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 15.63, investment: 145.8, productionMin: 1100, productionMax: 1300, paybackStr: fmtPayback('3n5t'),  paybackYears: parsePayback('3n5t')  },
  { id: 'og3p-188', name: 'On-Grid 18.8 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 18.75, investment: 167.2, productionMin: 1200, productionMax: 1400, paybackStr: fmtPayback('3n7t'),  paybackYears: parsePayback('3n7t')  },
  { id: 'og3p-294', name: 'On-Grid 29.4 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 29.38, investment: 278,   productionMin: 2500, productionMax: 3600, paybackStr: fmtPayback('2n7t'),  paybackYears: parsePayback('2n7t')  },
  { id: 'og3p-488', name: 'On-Grid 48.8 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 48.75, investment: 440.6, productionMin: 4500, productionMax: 6000, paybackStr: fmtPayback('2n5t'),  paybackYears: parsePayback('2n5t')  },
  { id: 'og3p-731', name: 'On-Grid 73.1 kWp 3 pha', systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 73.13, investment: 638.9, productionMin: 6000, productionMax: 9000, paybackStr: fmtPayback('2n5t'),  paybackYears: parsePayback('2n5t')  },
  { id: 'og3p-97',  name: 'On-Grid 97 kWp 3 pha',   systemTypeKey: 'on-grid-3p', type: 'on-grid', power: 96.88, investment: 827.5, productionMin: 8000, productionMax: 11800,paybackStr: fmtPayback('2n5t'),  paybackYears: parsePayback('2n5t')  },
];

// ─────────────────────────────────────────────
// Convert ComboCatalog → SolutionCard
// ─────────────────────────────────────────────
function catalogToCard(c: ComboCatalog, rank: number, kwhNeed: number, budgetM: number): SolutionCard {
  const mid = (c.productionMin + c.productionMax) / 2;
  let score = 0;
  if (kwhNeed > 0) {
    if (kwhNeed >= c.productionMin && kwhNeed <= c.productionMax) {
      score = 100 - Math.abs(kwhNeed - mid) / (c.productionMax - c.productionMin) * 20;
    } else if (kwhNeed < c.productionMin) {
      score = 85 - (c.productionMin - kwhNeed) / c.productionMin * 40;
    } else {
      score = 70 - (kwhNeed - c.productionMax) / kwhNeed * 60;
    }
    if (budgetM > 0) score += (1 - c.investment / (budgetM + 1)) * 3;
  }
  return {
    rank,
    name: c.name,
    power: c.power,
    type: c.type,
    systemTypeKey: c.systemTypeKey,
    match: Math.max(0, Math.min(100, Math.round(score))),
    badge: undefined,
    battery: c.battery !== undefined ? `${c.battery} kWh` : undefined,
    hasBackup: c.type === 'hybrid',
    productionMin: c.productionMin,
    productionMax: c.productionMax,
    production: Math.round(mid),
    savings: Math.round(mid * 2800),
    paybackStr: c.paybackStr,
    payback: c.paybackYears,
    investment: c.investment,
    roofArea: c.roofArea,
    color: c.type === 'hybrid' ? '#3b82f6' : '#f59e0b',
  };
}

// ─────────────────────────────────────────────
// Building type → allowed systemTypeKeys
// ─────────────────────────────────────────────
const BUILDING_ALLOWED: Record<string, string[]> = {
  house:   ['hybrid-1p', 'on-grid-1p'],
  villa:   ['hybrid-1p', 'on-grid-1p'],
  office:  ['hybrid-1p', 'hybrid-3p-lv', 'hybrid-3p-hv', 'on-grid-1p', 'on-grid-3p'],
  factory: ['hybrid-3p-lv', 'hybrid-3p-hv', 'on-grid-3p'],
};

// ─────────────────────────────────────────────
// Filter + sort (exact SSF logic)
// ─────────────────────────────────────────────
function scoreCombo(c: ComboCatalog, kwhNeed: number, budgetM: number): number {
  if (kwhNeed <= 0) return 100 - c.investment / 1000;
  const mid = (c.productionMin + c.productionMax) / 2;
  let score = 0;
  if (kwhNeed >= c.productionMin && kwhNeed <= c.productionMax) {
    score = 100 - Math.abs(kwhNeed - mid) / (c.productionMax - c.productionMin) * 20;
  } else if (kwhNeed < c.productionMin) {
    score = 85 - (c.productionMin - kwhNeed) / c.productionMin * 40;
  } else {
    score = 70 - (kwhNeed - c.productionMax) / kwhNeed * 60;
  }
  if (budgetM > 0) score += (1 - c.investment / (budgetM + 1)) * 3;
  return Math.max(0, Math.round(score));
}

function filterCombos(
  bill: number,
  roofArea: number,
  budget: number,
  systemType: string,
  buildingType: string,
  mainGoal: string,
): SolutionCard[] {
  const budgetM = budget / 1_000_000;
  const kwhNeed = bill / 2800;
  const allowedKeys = BUILDING_ALLOWED[buildingType] ?? [];

  const filtered = COMBO_CATALOG.filter(c => {
    if (systemType && c.systemTypeKey !== systemType) return false;
    if (!systemType && allowedKeys.length > 0 && !allowedKeys.includes(c.systemTypeKey)) return false;
    if (mainGoal === 'backup' && c.type !== 'hybrid') return false;
    if (mainGoal === 'save' && c.type !== 'on-grid') return false;
    if (roofArea > 0 && c.roofArea && c.roofArea > roofArea) return false;
    if (budgetM > 0 && c.investment > budgetM * 1.15) return false;
    return true;
  });

  const scored = filtered.map(c => ({ c, score: scoreCombo(c, kwhNeed, budgetM) }));
  scored.sort((a, b) => b.score - a.score || a.c.investment - b.c.investment);

  return scored.map(({ c }, i) => catalogToCard(c, i + 1, kwhNeed, budgetM));
}

// ─────────────────────────────────────────────
// Vietnamese Provinces
// ─────────────────────────────────────────────
const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bắc Ninh', 'Bắc Giang', 'Hưng Yên', 'Vĩnh Phúc', 'Thái Nguyên',
  'Nam Định', 'Ninh Bình', 'Thanh Hóa', 'Nghệ An', 'Quảng Ninh',
  'Hà Nam', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
  'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
  'Ninh Thuận', 'Bình Thuận', 'Đồng Nai', 'Bình Dương', 'Bà Rịa – Vũng Tàu',
  'Long An', 'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Trà Vinh',
  'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'An Giang', 'Đồng Tháp',
  'Kiên Giang', 'Hậu Giang', 'Tây Ninh', 'Đắk Lắk', 'Đắk Nông',
  'Gia Lai', 'Kon Tum', 'Lâm Đồng', 'Lào Cai', 'Hà Giang',
  'Cao Bằng', 'Lạng Sơn', 'Tuyên Quang', 'Yên Bái', 'Phú Thọ',
  'Điện Biên', 'Sơn La', 'Hòa Bình', 'Lai Châu', 'Bình Phước',
];

// ─────────────────────────────────────────────
// Main QuotationPage Component
// ─────────────────────────────────────────────
export default function QuotationPage({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname) as Locale;
  const t = copy[locale];
  // ── Customer info form state ──
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [notes, setNotes] = useState('');

  // ── Filter state (SSF Column 1) ──
  const [bill, setBill] = useState(0);
  const [roofArea, setRoofArea] = useState(0);
  const [budget, setBudget] = useState(0);
  const [systemType, setSystemType] = useState('');

  // ── Selection / modal state ──
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modalSol, setModalSol] = useState<SolutionCard | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setModalSol(null);
      setIsClosing(false);
    }, 250);
  }, []);


  // ── Form submission ──

  const [submitted, setSubmitted] = useState(false);

  // ── Computed results (shown only after clicking CTA) ──
  const [solutions, setSolutions] = useState<SolutionCard[]>([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setBill(0);
    setRoofArea(0);
    setBudget(0);
    setSystemType('');
    setSolutions([]);
    setShowResults(false);
    setSelectedIndex(null);
  };

  const handleShowResults = () => {
    if (!isFormValid) return;
    const computed = filterCombos(bill, roofArea, budget, systemType, '', '');
    setSolutions(computed);
    setShowResults(true);
    setSelectedIndex(computed.length > 0 ? 0 : null);
    setSubmitted(true);
    trackEvent('calculator_complete', {
      event_category: 'engagement',
      source_form: 'quotation_calculator',
      system_type: systemType || 'all',
      monthly_bill: bill,
      roof_area: roofArea,
      budget,
      result_count: computed.length,
    });
    // Smooth scroll to results after render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    // POST to API with customer info + filter selections
    fetch('/api/quotations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, email, province, address, referralCode, notes,
        systemTypeKey: systemType,
        roofArea, monthlyBill: bill, budget,
      }),
    }).catch(() => {});
  };

  const isFormValid = name.trim() && phone.trim() && province && address.trim();



  return (
    <>
      <HeaderBar pathname={pathname} />
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)' }}>

        {/* ═══════════════════════════════════════════
            SECTION 1: Customer Info + System Filters (2-column)
        ═══════════════════════════════════════════ */}
        <section className="py-10 sm:py-14 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">{t.heroTag}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-2 leading-tight">
                {t.heroTitle[0]} <span style={{ color: '#f59e0b' }}>{t.heroTitle[1]}</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
                {t.heroLead}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
                <a href={getLocalePath('/solar-home', locale)} className="rounded-full border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">
                  {t.sourceHome}
                </a>
                <a href={getLocalePath('/solar-cong-nghiep', locale)} className="rounded-full border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">
                  {t.sourceCI}
                </a>
                <a href="/calculator" className="rounded-full border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">
                  {t.sourceCalc}
                </a>
              </div>
            </div>

            {/* 2-column grid: Customer Info + Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

              {/* ── LEFT: Customer Info Card ── */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-full bg-[#F5831F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.contactInfo}</p>
                    <p className="text-[11px] text-gray-500">{t.contactLead}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.name}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.phone} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="090..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.province} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select value={province} onChange={e => setProvince(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none appearance-none cursor-pointer transition-all">
                        <option value="">{t.provincePlaceholder}</option>
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.address} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Số nhà, tên đường, quận/huyện..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.referral} <span className="text-gray-400 font-normal text-xs">(nếu có)</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="8888..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.notes}</label>
                    <div className="relative">
                      <Chat className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder={t.notesPlaceholder}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#F5831F] focus:ring-2 focus:ring-[#F5831F]/20 outline-none resize-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Filter Options Card (SSF Column 1) ── */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F5831F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.projectInfo}</p>
                      <p className="text-[11px] text-gray-500">{t.projectLead}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5 flex-1">
                  {/* System Type Selector */}
                  <SystemTypeSelector value={systemType} onChange={setSystemType} />
                  {/* Monthly Bill Slider */}
                  <SliderInput
                    label={t.bill}
                    icon={<Building className="w-4 h-4" />}
                    value={bill}
                    min={0} max={100000000} step={500000}
                    onChange={setBill}
                    format={v => v === 0 ? t.noFilter : (v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(/\.0$/, '')},000,000` : v.toLocaleString())}
                    unit={bill === 0 ? '' : 'VND'}
                    ticks={[
                      { value: 0, label: t.filterAll }, { value: 2000000, label: '2M' },
                      { value: 5000000, label: '5M' }, { value: 10000000, label: '10M' },
                      { value: 20000000, label: '20M' }, { value: 50000000, label: '50M' },
                      { value: 100000000, label: '100M' },
                    ]}
                  />
                  {/* Roof Area Slider */}
                  <SliderInput
                    label={t.roof}
                    icon={<House className="w-4 h-4" />}
                    value={roofArea}
                    min={0} max={500} step={5}
                    onChange={setRoofArea}
                    format={v => v === 0 ? t.noFilter : String(v)}
                    unit={roofArea === 0 ? '' : 'm²'}
                    ticks={[
                      { value: 0, label: t.filterAll }, { value: 40, label: '40m²' },
                      { value: 80, label: '80m²' }, { value: 150, label: '150m²' },
                      { value: 200, label: '200m²' }, { value: 500, label: '500m²' },
                    ]}
                  />
                  {/* Budget Slider */}
                  <SliderInput
                    label={t.budget}
                    icon={<TrendUp className="w-4 h-4" />}
                    value={budget}
                    min={0} max={2000000000} step={5000000}
                    onChange={setBudget}
                    format={v => v === 0 ? t.noFilter : `${(v / 1000000).toFixed(0)},000,000`}
                    unit={budget === 0 ? '' : 'VND'}
                    ticks={[
                      { value: 0, label: t.filterAll }, { value: 100000000, label: '100M' },
                      { value: 200000000, label: '200M' }, { value: 400000000, label: '400M' },
                      { value: 800000000, label: '800M' }, { value: 2000000000, label: '2B' },
                    ]}
                  />
                </div>

                {/* CTA + Reset */}
                <div className="px-5 pb-5 flex flex-col gap-2.5 mt-auto">
                  <button
                    onClick={handleShowResults}
                    type="button"
                    disabled={!isFormValid}
                    className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-base font-bold shadow-sm transition-all ${isFormValid ? 'opacity-100 btn-scale' : 'opacity-50 cursor-not-allowed'}`}
                    style={isFormValid ? { background: 'linear-gradient(135deg,#DC2626 0%,#F5831F 100%)' } : { background: '#9ca3af' }}
                  >
                    {submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {t.sent}
                      </>
                    ) : (
                      <>
                        <Sparkle className="w-5 h-5" />
                        {t.send}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    type="button"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
                  >
                    <ArrowsClockwise className="w-4 h-4" />
                    {t.reset}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">{t.privacy}</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2: Combo Recommendations (hidden until CTA click)
        ═══════════════════════════════════════════ */}
        {showResults && (
          <section className="pb-16 px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <div
                ref={resultsRef}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slide-in-up"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F5831F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{t.resultTitle}</p>
                      <p className="text-[11px] text-gray-500">
                        {solutions.length > 0 ? t.resultLead(solutions.length) : t.noResult}
                      </p>
                    </div>
                    <a href={getLocalePath('/solar-cong-nghiep', locale)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#DC2626] font-medium transition-colors">
                      {t.back} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Cards grid */}
                <div className="p-4">
                  {solutions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {solutions.map((sol, i) => (
                          <RecommendationCard
                            key={sol.name + i}
                            sol={sol}
                            index={i}
                            isSelected={selectedIndex === i}
                            onSelect={() => {
                              setSelectedIndex(i);
                              setModalSol(sol);
                            }}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400 text-sm">
                      {t.noResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* ─── Detail Modal (SSF Column 3 as modal popup) ─── */}
      {modalSol && (
        <SolutionDetailModal
          sol={modalSol}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}

      {/* Slider thumb styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #3b82f6, 0 2px 8px rgba(59,130,246,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        input[type=range]:focus { outline: none; }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────
// Mobile detail content (reuses SSF SolutionDetailPanel layout)
// ─────────────────────────────────────────────
function MobileDetailContent({ sol }: { sol: SolutionCard; onContactClick: () => void }) {
  const isHybrid = sol.type === 'hybrid';
  const panelBrand = 'Aiko';
  const inverterBrand = 'SAJ';
  const batteryBrand = isHybrid ? 'Genxgreen' : null;
  const panelCount = Math.ceil(sol.power * 1000 / 580);

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,     label: `Tấm ${panelBrand}`,          value: `${panelCount} tấm · ${sol.power} kWp` },
    { icon: <Lightning className="w-3.5 h-3.5 text-blue-500" />,      label: `Biến tần ${inverterBrand}`,   value: `${sol.power} kW` },
    ...(sol.battery && batteryBrand
      ? [{ icon: <BatteryHigh className="w-3.5 h-3.5 text-indigo-500" />, label: `Lưu trữ ${batteryBrand}`, value: sol.battery }]
      : []),
    { icon: <ChartBar className="w-3.5 h-3.5 text-[#DC2626]" />, label: 'Sản lượng/tháng', value: `${sol.productionMin}–${sol.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />,  label: 'Hoàn vốn',         value: sol.paybackStr },
    ...(sol.roofArea
      ? [{ icon: <House className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${sol.roofArea} m²` }]
      : []),
  ];

  return (
    <div key={sol.name} className="animate-slide-in-up-fast">
      <div
        className="px-4 pt-4 pb-3"
        style={{ background: isHybrid ? 'linear-gradient(135deg,#eff6ff 0%,#f8fafc 100%)' : 'linear-gradient(135deg,#fff7ed 0%,#f8fafc 100%)' }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"
          style={{
            background: isHybrid ? 'rgba(29,78,216,0.1)' : 'rgba(234,88,12,0.1)',
            color: isHybrid ? '#1d4ed8' : '#DC2626',
          }}
        >
          {isHybrid ? <Lightning className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          {isHybrid ? 'Hệ Hybrid' : 'Hệ On-Grid'}
        </span>
        <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug">{sol.name}</h3>
        <p className="text-[12px] text-gray-500 mt-1">
          {[panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="relative mx-4 mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src="/sample-combo.jpg" alt={sol.name} width={640} height={360} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%)' }} />
        <p className="absolute bottom-2.5 left-3 text-white text-[12px] font-semibold drop-shadow">{sol.name}</p>
      </div>

      <div className="mx-4 mt-3 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Giá niêm yết</p>
          <p className="text-[22px] font-extrabold text-[#0F172A] leading-tight mt-0.5">
            {new Intl.NumberFormat('vi-VN').format(sol.investment * 1_000_000)}
            <span className="text-[14px] font-semibold text-gray-500 ml-1">đ</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Công suất</p>
          <p className="text-[20px] font-extrabold text-[#DC2626] leading-tight mt-0.5">{sol.power} <span className="text-[13px] font-semibold text-gray-500">kWp</span></p>
        </div>
      </div>

      <div className="flex flex-col mx-4 mt-3 mb-4 rounded-xl border border-gray-100 overflow-hidden">
        {specs.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-4 py-2.5 gap-3 ${
              i < specs.length - 1 ? 'border-b border-gray-100' : ''
            } ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0">{s.icon}</span>
              <span className="text-[13px] text-gray-500 truncate">{s.label}</span>
            </div>
            <span className="text-[13px] font-semibold text-[#0F172A] text-right flex-shrink-0">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 mx-4 mb-4">
          <a
          href="/bao-gia"
          className="flex-1 h-11 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm"
          style={{ background: 'linear-gradient(135deg,#DC2626 0%,#F5831F 100%)' }}
        >
          <Phone className="w-4 h-4" /> {t.mobileAction}
        </a>
      </div>
    </div>
  );
}
