import { ArrowLeft, ArrowRight, BatteryHigh, CheckCircle, Factory, FileText, Handshake, Lightning, Medal, Phone, Shield, ShieldCheck, Sun, TrendUp, Users } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ComboDetailMediaGallery, { type ComboMediaItem } from './ComboDetailMediaGallery';
import ConstructionMethodsSection from './combo-detail/ConstructionMethodsSection';
import DetailRow from './combo-detail/DetailRow';
import HighlightsMaterialsSection from './combo-detail/HighlightsMaterialsSection';
import ProcessFaqSection from './combo-detail/ProcessFaqSection';
import ProjectsSection from './combo-detail/ProjectsSection';
import QuickQuoteSidebar from './combo-detail/QuickQuoteSidebar';
import SolarCapabilitySection from './combo-detail/SolarCapabilitySection';
import RightSidebarSection from './combo-detail/RightSidebarSection';
import { submitCrmLead } from '../../../../lib/crm-leads';

interface ComboData {
  data: {
    title: string;
    slug: string;
    system_type: 'on-grid' | 'hybrid';
    phase: '1-phase' | '3-phase';
    voltage: 'low' | 'high' | null;
    power_kw: number;
    battery_kwh?: number;
    panel_brand?: string;
    panel_model?: string;
    panel_slug?: string;
    inverter_brand?: string;
    inverter_model?: string;
    inverter_slug?: string;
    battery_brand?: string;
    battery_model?: string;
    battery_slug?: string;
    investment_million_vnd: number;
    production_min_kwh: number;
    production_max_kwh: number;
    payback_years: number;
    payback_label: string;
    roof_area_m2?: number;
  };
  body: string;
}

function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'amber' | 'blue' | 'emerald' }) {
  const map = {
    slate: 'bg-gray-50 text-gray-700 border-gray-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold ${map[tone]}`}>{children}</span>;
}

/*
function StatCard({ label, value, tone, icon }: { label: string; value: string; tone: 'emerald' | 'blue' | 'amber' | 'purple'; icon: ReactNode }) {
  const map = {
    emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-100',
    blue: 'from-blue-50 to-blue-100/50 border-blue-100',
    amber: 'from-amber-50 to-amber-100/50 border-amber-100',
    purple: 'from-purple-50 to-purple-100/50 border-purple-100',
  };

  return (
    <div className={`rounded-[16px] border bg-gradient-to-br p-4 ${map[tone]}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-600">{label}</p>
      </div>
      <p className="text-[22px] font-semibold leading-none text-gray-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0">
      <div className="text-[15px] text-gray-500">{label}</div>
      <div className="text-[15px] font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function HighlightsMaterialsSection({
  data,
  systemLabel,
  phaseLabel,
  roofArea,
  avgProduction,
  isHybrid,
  materialIcons,
  panelModel,
  panelQuantity,
  inverterModel,
  inverterQuantity,
}: {
  data: ComboData['data'];
  systemLabel: string;
  phaseLabel: string;
  roofArea: number;
  avgProduction: number;
  isHybrid: boolean;
  materialIcons: Record<'panel' | 'inverter' | 'rail' | 'wiring' | 'cabinet' | 'grounding' | 'install', ReactNode>;
  panelModel: string;
  panelQuantity: number;
  inverterModel: string;
  inverterQuantity: number;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[18px] bg-[#eef6ff] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded bg-white ring-1 ring-black/5">
            {isHybrid ? <BatteryHigh className="h-6 w-6 text-blue-600" /> : <Sun className="h-6 w-6 text-amber-500" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[18px] font-semibold text-gray-900">{data.title}</p>
              <span className={`rounded px-2 py-0.5 text-[12px] font-semibold ${isHybrid ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                {systemLabel}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-gray-600">
              {phaseLabel}
              {data.voltage ? ` · ${data.voltage === 'high' ? 'áp cao' : 'áp thấp'}` : ''} · {data.power_kw} kWp
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{roofArea} m² mái</span>
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.payback_label} hoàn vốn</span>
              {isHybrid && data.battery_kwh ? <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.battery_kwh} kWh pin</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-[16px] bg-white p-4">
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">
              {data.power_kw} <span className="text-[12px] font-medium text-gray-500">kWp</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-600">Công suất</p>
          </div>
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">~{avgProduction}</p>
            <p className="mt-2 text-[13px] text-gray-600">kWh/tháng</p>
          </div>
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">{data.payback_label}</p>
            <p className="mt-2 text-[13px] text-gray-600">Hoàn vốn</p>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Thông số kỹ thuật</h3>
        <div className="overflow-hidden rounded-[12px] border border-gray-200">
          <DetailRow label="Hệ thống" value={systemLabel} />
          <DetailRow label="Pha" value={phaseLabel} />
          {data.voltage ? <DetailRow label="Điện áp" value={data.voltage === 'high' ? 'Áp cao' : 'Áp thấp'} /> : null}
          <DetailRow label="Công suất" value={`${data.power_kw} kWp`} />
          <DetailRow label="Sản lượng" value={`${data.production_min_kwh} - ${data.production_max_kwh} kWh/tháng`} />
          <DetailRow label="Mái yêu cầu" value={`~${roofArea} m²`} />
        </div>
      </div>

      <div className="rounded-[18px] border border-gray-200 bg-white p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Bản kê chi tiết vật tư</p>
        <h3 className="mt-2 text-[22px] font-semibold leading-tight text-gray-900">Danh sách vật tư chính</h3>
        <div className="mt-5 overflow-hidden rounded-[18px] border border-gray-200">
          <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4 border-b border-gray-200 bg-[#fafafa] px-5 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Thương hiệu</p>
            <p className="text-right text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Công suất</p>
          </div>
          <div className="bg-white">
            <MaterialRow name={`${panelBrand} ${panelModel}`} power={`${data.power_kw} kWp`} highlight />
            <MaterialRow name={`${inverterBrand} ${inverterModel}`} power={data.system_type === 'on-grid' ? `${data.power_kw} kW` : `${data.power_kw} kW`} />
            <MaterialRow name="Hệ khung nhôm" power="1 bộ" />
            <MaterialRow name="Hệ dây điện" power="1 bộ" />
            <MaterialRow name="Tủ điện" power="1 bộ" />
            <MaterialRow name="Hệ tiếp địa" power="1 bộ" />
            <MaterialRow name="Vận chuyển + lắp đặt" power="1 gói" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickQuoteSidebar({
  leadSubmitted,
  leadPhone,
  leadSubmitting,
  leadError,
  setLeadPhone,
  handleLeadSubmit,
}: {
  leadSubmitted: boolean;
  leadPhone: string;
  leadSubmitting: boolean;
  leadError: string;
  setLeadPhone: (value: string) => void;
  handleLeadSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="space-y-0">
          <div className="pb-4">
            <h3 className="text-[18px] font-semibold text-gray-900">Nhận báo giá nhanh</h3>
            <p className="mt-4 text-[13px] leading-6 text-gray-700">
              Gửi thông tin để EPCVINA liên hệ tư vấn, kiểm tra nhu cầu thực tế và đề xuất phương án phù hợp nhất cho công trình của bạn.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid gap-3">
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                Khảo sát mái miễn phí trước khi chốt phương án.
              </div>
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                Báo giá minh bạch, rõ vật tư và hạng mục thi công.
              </div>
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                Kỹ sư EPCVINA liên hệ lại để tư vấn nhanh trong giờ hành chính.
              </div>
            </div>
          </div>

          <a href="/calculator" className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] bg-[#f60] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-16px_rgba(255,102,0,.65)] transition active:scale-[0.98]">
            Nhận báo giá ngay
          </a>
          <a
            href="https://zalo.me/0368927332"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-gray-400 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition active:scale-[0.98]"
          >
            Chat ngay
          </a>
          <a
            href="tel:0988446113"
            className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-[#f60] bg-[#fff7f2] px-5 py-3 text-[14px] font-semibold text-[#c24f00] transition active:scale-[0.98]"
          >
            Gọi kỹ sư tư vấn
          </a>
        </div>
      </div>

      <div className="rounded-[18px] bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
        {leadSubmitted ? (
          <div className="py-2 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <CheckCircle className="h-7 w-7" weight="fill" />
            </div>
            <h3 className="mt-3 text-lg font-bold">Cảm ơn bạn</h3>
            <p className="mt-1 text-sm text-emerald-100">EPCVINA sẽ liên hệ sớm để tư vấn giải pháp phù hợp.</p>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-lg font-bold">Để lại số, chúng tôi sẽ liên hệ lại</h3>
            <p className="mb-4 text-sm text-emerald-100">Chỉ cần nhập số điện thoại, đội ngũ EPCVINA sẽ gọi lại để tư vấn giải pháp phù hợp cho công trình của bạn.</p>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/90">Số điện thoại</span>
                <div className="flex items-stretch gap-2 rounded-2xl border border-white/20 bg-white p-1">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={leadPhone}
                    onChange={(event) => setLeadPhone(event.target.value)}
                    placeholder="VD: 0988 446 113"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleLeadSubmit}
                    disabled={leadSubmitting}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {leadSubmitting ? 'ĐANG GỬI...' : 'Gửi'}
                  </button>
                </div>
              </label>
              {leadError && <p className="text-sm text-amber-100">{leadError}</p>}
            </div>
            <p className="mt-3 text-center text-xs text-emerald-200">
              Hotline: <a href="tel:0988446113" className="underline hover:text-white">0988 446 113</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ConstructionMethodsSection({
  constructionSteps,
  constructionTab,
  setConstructionTab,
  constructionImages,
}: {
  constructionSteps: Array<{ title: string; desc: string }>;
  constructionTab: number;
  setConstructionTab: (index: number) => void;
  constructionImages: string[][];
}) {
  return (
    <section className="mt-8 rounded-[18px] border border-gray-200 bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Biện pháp thi công</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {constructionSteps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => setConstructionTab(index)}
            className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition ${
              constructionTab === index ? 'border-[#0B63CE] bg-[#0B63CE] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
            aria-pressed={constructionTab === index}
          >
            {step.title}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-[18px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
        <h4 className="text-[16px] font-semibold text-gray-900">{constructionSteps[constructionTab].title}</h4>
        <p className="mt-2 text-[13px] leading-6 text-gray-600">{constructionSteps[constructionTab].desc}</p>
        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex min-w-max flex-nowrap gap-3">
            {constructionImages[constructionTab].map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square w-[132px] shrink-0 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm sm:w-[144px]"
              >
                <img src={src} alt={`${constructionSteps[constructionTab].title} ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialRow({
  name,
  power,
  highlight = false,
}: {
  name: string;
  power: string;
  highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-gray-900">{name}</p>
      </div>
      <div className={`text-right text-[15px] font-semibold ${highlight ? 'text-[#ff6a00]' : 'text-gray-900'}`}>{power}</div>
    </div>
  );
}
*/

export default function ComboDetailEquipmentStyle({ combo }: { combo: ComboData }) {
  const { data, body } = combo;
  const equipmentStripRef = useRef<HTMLDivElement>(null);
  const sidebarSectionRef = useRef<HTMLElement>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement>(null);
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const [equipmentActiveIndex, setEquipmentActiveIndex] = useState(0);
  const [constructionTab, setConstructionTab] = useState(0);
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
  const isHybrid = data.system_type === 'hybrid';
  const systemLabel = isHybrid ? 'Hybrid' : 'On-Grid';
  const phaseLabel = data.phase === '1-phase' ? '1 pha' : '3 pha';
  const panelCount = Math.ceil(data.power_kw * 1000 / 580);
  const roofArea = data.roof_area_m2 || Math.ceil(data.power_kw * 4.32);
  const avgProduction = Math.round((data.production_min_kwh + data.production_max_kwh) / 2);
  const monthlySaving = Math.round(avgProduction * 3100);
  const yearlySaving = monthlySaving * 12;
  const panelBrand = data.panel_brand || 'Aiko';
  const panelModel = data.panel_model || 'Stellar';
  const panelSlug = data.panel_slug;
  const inverterBrand = data.inverter_brand || 'SAJ';
  const inverterModel = data.inverter_model || (isHybrid ? 'Hybrid' : 'On-Grid');
  const inverterSlug = data.inverter_slug;
  const batteryBrand = data.battery_brand || 'Genxgreen';
  const batteryModel = data.battery_model || (data.battery_kwh ? `${data.battery_kwh} kWh` : '');
  const batterySlug = data.battery_slug;
  const panelQuantity = Math.max(1, Math.round(data.power_kw * 1.6));
  const inverterQuantity = 1;
  const materialIcons = {
    panel: <Sun className="h-4.5 w-4.5 text-amber-500" />,
    inverter: <Lightning className="h-4.5 w-4.5 text-[#f60]" />,
    rail: <Shield className="h-4.5 w-4.5 text-gray-700" />,
    wiring: <Lightning className="h-4.5 w-4.5 text-sky-600" />,
    cabinet: <Shield className="h-4.5 w-4.5 text-gray-700" />,
    grounding: <Shield className="h-4.5 w-4.5 text-emerald-600" />,
    install: <Phone className="h-4.5 w-4.5 text-emerald-600" />,
  };
  const equipmentCards = useMemo(
    () => [
      {
        icon: <Sun className="h-5 w-5 text-amber-500" />,
        title: `${panelBrand} ${panelModel}`,
        image: '/images/combo/source-panel.webp',
        imagePosition: 'left top',
        href: panelSlug ? `/thiet-bi/panel/${panelSlug}` : undefined,
        specs: [['Bảo hành', '12 năm'], ['Model', panelModel], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Lightning className="h-5 w-5 text-[#f60]" />,
        title: `${inverterBrand} ${inverterModel}`,
        image: '/images/combo/source-inverter.avif',
        imagePosition: 'center top',
        href: inverterSlug ? `/thiet-bi/${data.system_type === 'hybrid' ? 'hybrid-inverter' : 'on-grid-inverter'}/${inverterSlug}` : undefined,
        specs: [['Bảo hành', '5 năm'], ['Model', inverterModel], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Shield className="h-5 w-5 text-gray-700" />,
        title: 'Hệ khung nhôm',
        image: '/images/combo/source-rail.webp',
        imagePosition: 'right top',
        specs: [['Bảo hành', '5 năm'], ['Nhóm vật tư', 'Hệ khung nhôm'], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Lightning className="h-5 w-5 text-[#f60]" />,
        title: 'Hệ dây điện',
        image: '/images/combo/source-wiring.avif',
        imagePosition: 'left center',
        specs: [['Bảo hành', '5 năm'], ['Nhóm vật tư', 'Hệ dây điện'], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Shield className="h-5 w-5 text-gray-700" />,
        title: data.voltage === 'high' ? 'Tủ điện áp cao' : 'Tủ điện',
        image: '/images/combo/source-cabinet.webp',
        imagePosition: 'center center',
        specs: [['Bảo hành', '2 năm'], ['Nhóm vật tư', 'Tủ điện'], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Shield className="h-5 w-5 text-gray-700" />,
        title: 'Hệ tiếp địa',
        image: '/images/combo/source-grounding.avif',
        imagePosition: 'right center',
        specs: [['Bảo hành', '2 năm'], ['Nhóm vật tư', 'Hệ tiếp địa'], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Phone className="h-5 w-5 text-emerald-600" />,
        title: 'Vận chuyển + lắp đặt',
        image: '/images/combo/source-install.webp',
        imagePosition: 'center bottom',
        specs: [['Bảo hành', '--'], ['Nhóm vật tư', 'Vận chuyển + lắp đặt'], ['Trạng thái', 'Áp dụng theo công trình']] as Array<[string, string]>,
      },
    ],
    [batteryBrand, batteryModel, batterySlug, inverterBrand, inverterModel, inverterSlug, panelBrand, panelModel, panelSlug, data.system_type, data.voltage]
  );
  const constructionSteps = useMemo(
    () => [
      {
        title: 'Giải pháp cho mái tôn',
        desc: 'Thi công bằng hệ full rail nhôm 4,2m, áp dụng 100% và không dùng minirail hay thanh bắt Z cho mái tôn.',
      },
      {
        title: 'Giải pháp cho mái ngói',
        desc: 'Áp dụng toàn bộ hệ full rail nhôm dài 4,2m, tuyệt đối không dùng minirail hoặc thanh bắt Z cho mái ngói.',
      },
      {
        title: 'Giải pháp cho mái bằng',
        desc: 'Toàn bộ phương án được dựng 3D trước khi thi công để tối ưu vật tư thép và chừa hành lang thuận tiện cho bảo trì tấm pin.',
      },
    ],
    []
  );
  const constructionImages = useMemo(
    () => [
      [
        '/images/combo/roof-ton/1.webp',
        '/images/combo/roof-ton/2.webp',
        '/images/combo/roof-ton/3.webp',
        '/images/combo/roof-ton/4.webp',
        '/images/combo/roof-ton/5.webp',
        '/images/combo/roof-ton/6.webp',
      ],
      [
        '/images/combo/roof-ngoi/1.webp',
        '/images/combo/roof-ngoi/2.webp',
        '/images/combo/roof-ngoi/3.webp',
        '/images/combo/roof-ngoi/4.webp',
        '/images/combo/roof-ngoi/5.webp',
        '/images/combo/roof-ngoi/6.webp',
      ],
      [
        '/images/combo/roof-bang/1.webp',
        '/images/combo/roof-bang/2.webp',
        '/images/combo/roof-bang/3.webp',
        '/images/combo/roof-bang/4.webp',
        '/images/combo/roof-bang/5.webp',
        '/images/combo/roof-bang/6.webp',
      ],
    ],
    []
  );
  const loopedEquipmentCards = useMemo(
    () => Array.from({ length: 9 }, () => equipmentCards).flat(),
    [equipmentCards]
  );
  const scrollEquipmentStrip = (direction: 'left' | 'right') => {
    const el = equipmentStripRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-equipment-card]'));
    if (!cards.length) return;

    const slideWidth = cards[0].getBoundingClientRect().width + 16;
    const fallbackIndex = Math.round(el.scrollLeft / slideWidth);
    const nextIndex = direction === 'right' ? fallbackIndex + 1 : fallbackIndex - 1;
    const targetIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));

    cards[targetIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };
  useEffect(() => {
    const section = sidebarSectionRef.current;
    const wrapper = sidebarWrapperRef.current;
    const content = sidebarContentRef.current;
    if (!section || !wrapper || !content) return;

    let raf = 0;
    const updateSidebar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
        if (!isDesktop) {
          setSidebarStyle({});
          return;
        }

        const topOffset = 96;
        const sectionRect = section.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const contentHeight = content.offsetHeight;
        const sectionTop = window.scrollY + sectionRect.top;
        const sectionBottom = window.scrollY + sectionRect.bottom;
        const scrollTop = window.scrollY + topOffset;
        const left = wrapperRect.left;
        const width = wrapperRect.width;

        if (scrollTop < sectionTop) {
          setSidebarStyle({});
          return;
        }

        if (scrollTop + contentHeight >= sectionBottom) {
          setSidebarStyle({
            position: 'absolute',
            top: Math.max(0, wrapper.clientHeight - contentHeight),
            left: 0,
            width: '100%',
            zIndex: 30,
          });
          return;
        }

        setSidebarStyle({
          position: 'fixed',
          top: topOffset,
          left,
          width,
          maxHeight: window.innerHeight - topOffset - 24,
          overflowY: 'auto',
          zIndex: 30,
        });
      });
    };

    updateSidebar();
    window.addEventListener('scroll', updateSidebar, { passive: true });
    window.addEventListener('resize', updateSidebar);

    const observer = new ResizeObserver(updateSidebar);
    observer.observe(section);
    observer.observe(wrapper);
    observer.observe(content);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateSidebar);
      window.removeEventListener('resize', updateSidebar);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = equipmentStripRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-equipment-card]'));
    const total = equipmentCards.length;
    if (!cards.length || total === 0) return;

    const middleStart = total * 4;
    const middleCards = cards.slice(middleStart, middleStart + total);
    middleCards[0]?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });

    let raf = 0;
    const syncCarousel = () => {
      const slideWidth = cards[0].getBoundingClientRect().width + 16;
      const relativeIndex = Math.round((el.scrollLeft - middleCards[0].offsetLeft) / slideWidth);
      const normalized = ((relativeIndex % total) + total) % total;
      setEquipmentActiveIndex(normalized);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncCarousel);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, [equipmentCards.length]);

  const gallery: ComboMediaItem[] = [
    {
      type: 'image',
      src: '/sample-combo.jpg',
    },
    {
      type: 'image',
      src: '/images/combo/source-video-thumb.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-panel.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-inverter.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-rail.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-wiring.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-cabinet.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-grounding.webp',
    },
    {
      type: 'image',
      src: '/images/combo/source-install.webp',
    },
  ];

  const handleLeadSubmit = async () => {
    const value = leadPhone.trim();
    if (!value) {
      setLeadError('Vui lòng nhập số điện thoại.');
      return;
    }

    setLeadSubmitting(true);
    setLeadError('');
    try {
      await submitCrmLead({
        phone: value,
        source_form: 'combo_detail_green_cta',
        message: `Khách để lại số điện thoại từ block Nhận tư vấn của combo: ${data.title}.`,
      });
      setLeadSubmitted(true);
      setLeadPhone('');
      window.setTimeout(() => setLeadSubmitted(false), 5000);
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'Không gửi được thông tin.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="mx-auto w-full max-w-[1824px] px-4 py-4 sm:px-6 lg:px-12">
        <nav className="flex flex-wrap items-center gap-2 px-1 pb-4 text-[13px] text-gray-500">
          <a href="/solar-home" className="font-medium text-gray-700 hover:text-[#ff6a00]">
            Solar Home
          </a>
          <span>/</span>
          <a href={isHybrid ? '/solar-home/hybrid' : '/solar-home/on-grid'} className="font-medium text-gray-700 hover:text-[#ff6a00]">
            {systemLabel}
          </a>
          <span>/</span>
          <span className="truncate font-medium text-gray-700" aria-current="page">
            {data.title}
          </span>
        </nav>

        <section className="grid grid-cols-1 gap-6 bg-white px-0 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_388px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_404px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_416px] lg:items-start">
          <div className="space-y-6">
            <ComboDetailMediaGallery gallery={gallery} />
            <div className="rounded-[18px] bg-[#eef6ff] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded bg-white ring-1 ring-black/5">
                  {isHybrid ? <BatteryHigh className="h-6 w-6 text-blue-600" /> : <Sun className="h-6 w-6 text-amber-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[18px] font-semibold text-gray-900">{data.title}</p>
                    <span className={`rounded px-2 py-0.5 text-[12px] font-semibold ${isHybrid ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {systemLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-gray-600">
                    {phaseLabel}
                    {data.voltage ? ` · ${data.voltage === 'high' ? 'áp cao' : 'áp thấp'}` : ''} · {data.power_kw} kWp
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{roofArea} m² mái</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.payback_label} hoàn vốn</span>
                    {isHybrid && data.battery_kwh ? (
                      <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.battery_kwh} kWh pin</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-[16px] bg-white p-4">
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">{data.power_kw} <span className="text-[12px] font-medium text-gray-500">kWp</span></p>
                  <p className="mt-2 text-[13px] text-gray-600">Công suất</p>
                </div>
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">~{avgProduction}</p>
                  <p className="mt-2 text-[13px] text-gray-600">kWh/tháng</p>
                </div>
                <div>
                  <p className="text-[17px] font-bold leading-none text-gray-900">{data.payback_label}</p>
                  <p className="mt-2 text-[13px] text-gray-600">Hoàn vốn</p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Thông số kỹ thuật</h3>
              <div className="overflow-hidden rounded-[12px] border border-gray-200">
                <DetailRow label="Hệ thống" value={systemLabel} />
                <DetailRow label="Pha" value={phaseLabel} />
                {data.voltage ? <DetailRow label="Điện áp" value={data.voltage === 'high' ? 'Áp cao' : 'Áp thấp'} /> : null}
                <DetailRow label="Công suất" value={`${data.power_kw} kWp`} />
                <DetailRow label="Sản lượng" value={`${data.production_min_kwh} - ${data.production_max_kwh} kWh/tháng`} />
                <DetailRow label="Mái yêu cầu" value={`~${roofArea} m²`} />
              </div>
            </div>

          </div>

          <HighlightsMaterialsSection
            data={data}
            systemLabel={systemLabel}
            phaseLabel={phaseLabel}
            roofArea={roofArea}
            avgProduction={avgProduction}
            isHybrid={isHybrid}
            materialIcons={materialIcons}
            panelModel={panelModel}
            panelQuantity={panelQuantity}
            inverterModel={inverterModel}
            inverterQuantity={inverterQuantity}
          />

          <QuickQuoteSidebar
            leadSubmitted={leadSubmitted}
            leadPhone={leadPhone}
            leadSubmitting={leadSubmitting}
            leadError={leadError}
            setLeadPhone={setLeadPhone}
            handleLeadSubmit={handleLeadSubmit}
          />
        </section>

        <section className="mt-8 rounded-[18px] border border-gray-200 bg-white p-6 [content-visibility:auto] [contain-intrinsic-size:1px_900px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Thiết bị chính</p>
          <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Các thiết bị trong combo</h2>
          <div className="relative mt-5">
            <button
              type="button"
              onClick={() => scrollEquipmentStrip('left')}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-md transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
              aria-label="Cuộn sang trái"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollEquipmentStrip('right')}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-md transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
              aria-label="Cuộn sang phải"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div
              ref={equipmentStripRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-12 pl-12 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {loopedEquipmentCards.map((item, index) => (
                <EquipmentCard
                  key={`${item.title}-${index}`}
                  icon={item.icon}
                  title={item.title}
                  image={item.image}
                  imagePosition={item.imagePosition}
                  specs={item.specs}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              {equipmentCards.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    const el = equipmentStripRef.current;
                    if (!el) return;
                    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-equipment-card]'));
                    const target = cards[equipmentCards.length + index];
                    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${equipmentActiveIndex === index ? 'w-8 bg-[#0B63CE]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Chuyển tới ${item.title}`}
                  aria-pressed={equipmentActiveIndex === index}
                >
                  <span className="sr-only">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <ConstructionMethodsSection
          constructionSteps={constructionSteps}
          constructionTab={constructionTab}
          setConstructionTab={setConstructionTab}
          constructionImages={constructionImages}
        />

        <section ref={sidebarSectionRef} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-[18px] border border-gray-200 bg-white p-6 [content-visibility:auto] [contain-intrinsic-size:1px_700px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Mô tả chi tiết combo</p>
              <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Thông tin chi tiết để khách hàng dễ ra quyết định</h2>
              <div className="mt-5 rounded-[18px] border border-gray-200 bg-[#fafafa] p-5 sm:p-6">
                <p className="text-[15px] leading-7 text-gray-700">
                  Combo {data.title} được xây dựng theo hướng tối ưu cho hiệu suất vận hành, độ bền vật tư và khả năng triển khai thực tế trên công trình dân dụng hoặc thương mại.
                  Cấu hình đã được chuẩn hóa theo từng nhóm thiết bị chính, giúp khách hàng dễ dàng so sánh, kiểm tra và lựa chọn phương án phù hợp theo nhu cầu sử dụng điện, diện tích mái và ngân sách đầu tư.
                </p>
                <p className="mt-4 text-[15px] leading-7 text-gray-700">
                  Từ tấm pin, biến tần, hệ khung, dây dẫn cho đến tủ điện và tiếp địa, mỗi hạng mục đều được mô tả rõ ràng để hỗ trợ khách hàng hiểu nhanh phạm vi cung cấp.
                  Với các công trình có yêu cầu đặc thù, EPCVINA có thể hiệu chỉnh cấu hình, thay đổi phương án thi công và tối ưu lại danh mục vật tư ngay từ giai đoạn khảo sát.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    'Cấu hình theo nhu cầu thực tế, dễ so sánh và đối chiếu.',
                    'Vật tư chính được mô tả rõ, minh bạch từng hạng mục.',
                    'Có thể tùy chỉnh theo diện tích mái và mức tiêu thụ điện.',
                    'Phù hợp cho nhu cầu tiết kiệm điện và giảm chi phí vận hành.',
                  ].map((item) => (
                    <div key={item} className="rounded-[14px] border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium leading-6 text-gray-800 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="[content-visibility:auto] [contain-intrinsic-size:1px_1100px]">
              <ProcessFaqSection faqExpanded={faqExpanded} setFaqExpanded={setFaqExpanded} />
            </div>

            <section className="rounded-[18px] border border-gray-200 bg-white p-6 [content-visibility:auto] [contain-intrinsic-size:1px_520px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Đánh giá khách hàng</p>
              <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Khách hàng nói gì về combo</h2>
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {[
                  {
                    name: 'Anh Minh, Hà Nội',
                    role: 'Combo on-grid 1 pha',
                    quote: 'Hệ thống vận hành ổn định sau khi lắp đặt. EPCVINA hỗ trợ khá kỹ từ khảo sát đến nghiệm thu nên gia đình tôi yên tâm.',
                  },
                  {
                    name: 'Chị Hạnh, Hải Dương',
                    role: 'Combo hybrid lưu trữ',
                    quote: 'Tôi hài lòng vì cấu hình được tư vấn sát nhu cầu dùng điện. Sau thi công, đội ngũ vẫn theo dõi và phản hồi nhanh.',
                  },
                  {
                    name: 'Anh Quang, Bắc Ninh',
                    role: 'Combo 3 pha',
                    quote: 'Bảng vật tư và tiến độ triển khai rõ ràng. Dịch vụ sau lắp đặt tốt, dễ trao đổi khi cần kiểm tra thêm.',
                  },
                  {
                    name: 'Chị Thảo, Hưng Yên',
                    role: 'Combo tiết kiệm điện',
                    quote: 'Báo giá minh bạch và có các hạng mục đánh giá thực tế. Tôi thấy dễ đối chiếu trước khi quyết định lắp.',
                  },
                  {
                    name: 'Anh Đức, Hải Phòng',
                    role: 'Combo doanh nghiệp',
                    quote: 'Quy trình làm việc chuyên nghiệp, lắp đặt gọn gàng, bàn giao đầy đủ hồ sơ và hướng dẫn vận hành.',
                  },
                  {
                    name: 'Chị Lan, Bắc Giang',
                    role: 'Combo hộ gia đình',
                    quote: 'Sau khi dùng thực tế, sản lượng khá đúng như tư vấn. Tôi đánh giá cao cách EPCVINA hỗ trợ sau bán hàng.',
                  },
                ].slice(0, reviewsExpanded ? 6 : 3).map((item) => (
                  <div key={item.name} className="rounded-[16px] border border-gray-200 bg-[#fafafa] p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#f60] ring-1 ring-gray-200">
                        <span className="text-[14px] font-bold leading-none">{item.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-0.5 text-[12px] font-medium text-gray-500">{item.role}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[#f59e0b]" aria-label="5 sao">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className="text-[14px] leading-none">★</span>
                      ))}
                    </div>
                    <p className="mt-3 text-[14px] leading-7 text-gray-700">{item.quote}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setReviewsExpanded((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0B63CE]/20 bg-[#eef6ff] px-4 py-2 text-[13px] font-semibold text-[#0B63CE] transition hover:bg-[#dfeeff]"
                >
                  {reviewsExpanded ? 'Thu gọn' : 'Xem thêm đánh giá'}
                </button>
              </div>
            </section>

            <div className="[content-visibility:auto] [contain-intrinsic-size:1px_620px]">
              <ProjectsSection projectsExpanded={projectsExpanded} setProjectsExpanded={setProjectsExpanded} />
            </div>

            <div className="[content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
              <SolarCapabilitySection />
            </div>
          </div>

          <RightSidebarSection />
        </section>

      </div>
    </div>
  );
}

function EquipmentCard({
  icon,
  title,
  href,
  image,
  imagePosition,
  specs,
}: {
  icon: ReactNode;
  title: string;
  href?: string;
  image: string;
  imagePosition: string;
  specs: Array<[string, string]>;
}) {
  const Content = (
    <article
      data-equipment-card
      className="group min-w-[280px] snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0B63CE] hover:shadow-xl xl:min-w-[calc((100%-4.5rem)/4)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <picture>
          <source srcSet={image.endsWith('.avif') ? image : image.replace(/\.webp$/, '.avif')} type="image/avif" />
          <source srcSet={image.endsWith('.webp') ? image : image.replace(/\.avif$/, '.webp')} type="image/webp" />
          <img src={image} alt={title} className="h-full w-full object-cover" style={{ objectPosition: imagePosition }} loading="lazy" />
        </picture>
        <div className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-[#f60] shadow-sm ring-1 ring-black/5 backdrop-blur">
          {icon}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-[14px] font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#0B63CE] transition-colors duration-300">
          {title}
        </h3>
        <div className="space-y-2">
          {specs.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
              <span className="text-[10px] leading-none text-gray-500">{label}</span>
              <span className="text-right text-[11px] font-semibold leading-none text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-gray-100" />
      </div>
    </article>
  );

  if (href) {
    return <a href={href} className="block">{Content}</a>;
  }

  return Content;
}
