import { ArrowLeft, ArrowRight, BatteryHigh, CheckCircle, Lightning, Phone, Shield, Sun, TrendUp } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ComboDetailMediaGallery, { type ComboMediaItem } from './ComboDetailMediaGallery';
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

function MaterialRow({
  name,
  warranty,
  quantity,
  highlight = false,
}: {
  name: string;
  warranty: string;
  quantity: string;
  highlight?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_88px_120px] gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-gray-900">{name}</p>
      </div>
        <div className={`text-center text-[15px] font-semibold ${highlight ? 'text-[#ff6a00]' : 'text-gray-900'}`}>{quantity}</div>
        <div className="text-right text-[15px] text-gray-600">{warranty}</div>
    </div>
  );
}

export default function ComboDetailEquipmentStyle({ combo }: { combo: ComboData }) {
  const { data, body } = combo;
  const equipmentStripRef = useRef<HTMLDivElement>(null);
  const [equipmentActiveIndex, setEquipmentActiveIndex] = useState(0);
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const isHybrid = data.system_type === 'hybrid';
  const systemLabel = isHybrid ? 'Hybrid' : 'On-Grid';
  const phaseLabel = data.phase === '1-phase' ? '1 pha' : '3 pha';
  const panelCount = Math.ceil(data.power_kw * 1000 / 580);
  const roofArea = data.roof_area_m2 || Math.ceil(data.power_kw * 4.32);
  const avgProduction = Math.round((data.production_min_kwh + data.production_max_kwh) / 2);
  const monthlySaving = Math.round(avgProduction * 3100);
  const yearlySaving = monthlySaving * 12;
  const panelModel = 'Aiko';
  const inverterModel = isHybrid ? 'SAJ' : 'SAJ';
  const panelQuantity = Math.max(1, Math.round(data.power_kw * 1.6));
  const inverterQuantity = 1;
  const equipmentCards = useMemo(
    () => [
      {
        icon: <Sun className="h-5 w-5 text-amber-500" />,
        title: `${panelModel} tấm pin`,
        image: '/images/combo/source-panel.webp',
        imagePosition: 'left top',
        specs: [['Bảo hành', '12 năm'], ['Nhóm vật tư', 'Tấm pin mặt trời'], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
      },
      {
        icon: <Lightning className="h-5 w-5 text-[#f60]" />,
        title: 'Biến tần',
        image: '/images/combo/source-inverter.avif',
        imagePosition: 'center top',
        specs: [['Bảo hành', '5 năm'], ['Nhóm vật tư', `${inverterModel} biến tần`], ['Trạng thái', 'Phù hợp combo']] as Array<[string, string]>,
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
        title: 'Tủ điện',
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
    [inverterModel, panelModel]
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

          <div className="space-y-6">
            <div className="rounded-[18px] border border-gray-200 bg-white p-6">
              <h2 className="text-[18px] font-semibold text-gray-900">Combo {data.title}</h2>
              <div className="mt-4 rounded-[18px] border border-[#ffd7c2] bg-[#fff7f2] p-4 shadow-[0_10px_24px_-20px_rgba(255,102,0,0.65)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f60] text-[12px] font-bold text-white shadow-[0_8px_18px_-10px_rgba(255,102,0,0.9)]">
                    i
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-900">Điểm nổi bật</p>
                    <p className="text-[12px] text-gray-600">Nhìn nhanh cấu hình cốt lõi của combo</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    `Công suất ${data.power_kw} kWp`,
                    `Sản lượng ${data.production_min_kwh}-${data.production_max_kwh} kWh/tháng`,
                    `Diện tích mái ~${roofArea} m²`,
                    isHybrid ? `Pin lưu trữ ${data.battery_kwh} kWh` : 'Không cần pin lưu trữ',
                  ].map((item) => (
                    <div key={item} className="rounded-[14px] border border-[#ffe3d2] bg-white px-4 py-3 text-[13px] font-medium leading-6 text-gray-800 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Bản kê chi tiết vật tư</p>
              <h3 className="mt-2 text-[22px] font-semibold leading-tight text-gray-900">Danh sách vật tư chính</h3>
              <div className="mt-5 overflow-hidden rounded-[18px] border border-gray-200">
                <div className="grid grid-cols-[minmax(0,1.5fr)_88px_120px] gap-4 border-b border-gray-200 bg-[#fafafa] px-5 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Nhóm vật tư</p>
                  <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Số lượng</p>
                  <p className="pr-1 text-right text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Bảo hành</p>
                </div>
                <div className="bg-white">
                  <MaterialRow name={`${panelModel} tấm pin`} warranty="12 năm" quantity={`${panelQuantity} tấm`} highlight />
                  <MaterialRow name={`${inverterModel} biến tần`} warranty="5 năm" quantity={`${inverterQuantity} bộ`} />
                  <MaterialRow name="Hệ khung nhôm" warranty="5 năm" quantity="1 bộ" />
                  <MaterialRow name="Hệ dây điện" warranty="5 năm" quantity="1 bộ" />
                  <MaterialRow name="Tủ điện" warranty="2 năm" quantity="1 bộ" />
                  <MaterialRow name="Hệ tiếp địa" warranty="2 năm" quantity="1 bộ" />
                  <MaterialRow name="Vận chuyển + lắp đặt" warranty="--" quantity="1 gói" />
                </div>
              </div>
            </div>

          </div>

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

                <a
                  href="/calculator"
                  className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] bg-[#f60] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-16px_rgba(255,102,0,.65)] transition active:scale-[0.98]"
                >
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
                  <p className="mt-1 text-sm text-emerald-100">
                    EPCVINA sẽ liên hệ sớm để tư vấn giải pháp phù hợp.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="mb-2 text-lg font-bold">Để lại số, chúng tôi sẽ liên hệ lại</h3>
                  <p className="mb-4 text-sm text-emerald-100">
                    Chỉ cần nhập số điện thoại, đội ngũ EPCVINA sẽ gọi lại để tư vấn giải pháp phù hợp cho công trình của bạn.
                  </p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/90">
                        Số điện thoại
                      </span>
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
        </section>

        <section className="mt-8 rounded-[18px] border border-gray-200 bg-white p-6">
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
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-gray-200 bg-white p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Biện pháp thi công</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {constructionSteps.map((step) => (
              <div key={step.step} className="rounded-[18px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-semibold text-gray-900">{step.title}</h4>
                    <p className="mt-2 text-[13px] leading-6 text-gray-600">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[18px] border border-gray-200 bg-white p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">FAQ</p>
            <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {[
                {
                  question: 'Cần bao nhiêu m² mái?',
                  answer: 'Diện tích mái sẽ được tính theo công suất combo và điều kiện lắp đặt thực tế. Kỹ sư EPCVINA sẽ kiểm tra để xác nhận phương án phù hợp nhất.',
                },
                {
                  question: 'Bao lâu hoàn vốn?',
                  answer: 'Thời gian hoàn vốn phụ thuộc mức tiêu thụ điện, biểu giá điện và vị trí lắp đặt. Thông thường EPCVINA sẽ tư vấn con số ước tính ngay khi báo giá.',
                },
                {
                  question: 'Có cần xin phép không?',
                  answer: 'Tùy quy mô công trình và yêu cầu địa phương. EPCVINA sẽ hỗ trợ đánh giá hồ sơ cần thiết trước khi thi công để tránh phát sinh thủ tục.',
                },
                {
                  question: 'Bảo hành gồm những gì?',
                  answer: 'Bảo hành bao gồm thiết bị chính, hệ khung, tủ điện và các hạng mục liên quan theo từng cấu hình combo. Chi tiết sẽ được xác nhận trong báo giá.',
                },
                {
                  question: 'Khi nào kỹ sư khảo sát?',
                  answer: 'Sau khi tiếp nhận yêu cầu, EPCVINA sẽ liên hệ sớm để đặt lịch khảo sát mái và tư vấn phương án trong thời gian thuận tiện nhất cho khách hàng.',
                },
              ].map((item) => (
                <details key={item.question} className="group rounded-[16px] border border-gray-200 bg-[#fafafa] px-5 py-4 open:bg-white open:shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <summary className="cursor-pointer list-none text-[16px] font-semibold text-gray-900">
                    <span className="flex items-center justify-between gap-4">
                      <span>{item.question}</span>
                      <span className="text-[20px] leading-none text-gray-400 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] leading-7 text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[18px] border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold">Cần tư vấn ngay?</h3>
              <p className="mt-2 text-sm text-emerald-100">
                Để lại số điện thoại, EPCVINA sẽ liên hệ lại và giải đáp nhanh các thắc mắc về mái, hoàn vốn và bảo hành.
              </p>
              <a
                href="tel:0988446113"
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Gọi tư vấn: 0988 446 113
              </a>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Cam kết</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                  Khảo sát mái miễn phí trước khi chốt phương án.
                </div>
                <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                  Báo giá minh bạch, rõ vật tư và hạng mục thi công.
                </div>
                <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
                  Phản hồi nhanh trong giờ hành chính.
                </div>
              </div>
            </div>
          </aside>
        </section>

      </div>
    </div>
  );
}

function EquipmentCard({
  icon,
  title,
  image,
  imagePosition,
  specs,
}: {
  icon: ReactNode;
  title: string;
  image: string;
  imagePosition: string;
  specs: Array<[string, string]>;
}) {
  return (
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
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
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
}
