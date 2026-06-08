

import { useState, useEffect } from 'react';
import {
  Sun,
  Battery,
  Home,
  Building2,
  Zap,
  Warehouse,
  CheckCircle2,
  X,
  Check,
  Wrench,
  Plug,
  Box,
  Shield,
  Package,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductOption {
  id: string;
  name: string;
  brand: string;
  specs?: string;
  price: number;
  image?: string | null;
}

export interface WizardState {
  systemType: 'on-grid' | 'hybrid' | null;
  phase: '1-phase' | '3-phase' | null;
  voltageType: 'low' | 'high' | null;

  // Equipment selections
  selectedPanel: ProductOption | null;
  selectedInverter: ProductOption | null;
  selectedBattery: ProductOption | null;

  power: number | null;
  batteryCapacity: number | null;
  roofType: 'tile' | 'metal' | 'flat' | null;

  // Accessories
  accessories: string[];
}

interface SolarWizardProps {
  onConfigComplete: (config: WizardState) => void;
  className?: string;
}

const POWER_OPTIONS = [3, 5, 8, 10, 15, 20, 30, 50] as const;
const BATTERY_OPTIONS = [5, 10, 15, 20, 30] as const;

const ACCESSORY_OPTIONS = [
  {
    slug: 'mounting',
    label: 'Hệ khung nhôm',
    desc: 'Khung lắp đặt tấm pin phù hợp loại mái',
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    slug: 'wiring',
    label: 'Hệ dây điện',
    desc: 'Dây DC, dây AC, ống luồn dây',
    icon: Plug,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    slug: 'cabinet',
    label: 'Tủ điện',
    desc: 'Tủ điện AC/DC, thiết bị bảo vệ',
    icon: Box,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    slug: 'grounding',
    label: 'Hệ tiếp địa',
    desc: 'Cọc tiếp địa, dây tiếp địa',
    icon: Shield,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function StepBadge({ number, active }: { number: number; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 transition-colors duration-300 ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
      }`}
    >
      {number}
    </span>
  );
}

function StepHeader({
  number,
  label,
  active,
  icon,
}: {
  number: number;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <StepBadge number={number} active={active} />
      {icon && <span className="text-blue-600">{icon}</span>}
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
    </div>
  );
}

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function OptionCard({ selected, onClick, children, className = '' }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md text-left w-full ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${className}`}
    >
      {selected && (
        <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
      )}
      {children}
    </button>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  isSelected,
  onSelect,
}: {
  product: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const brandName = product.brands?.name || 'N/A';
  const specs = product.specifications || {};
  const keySpec =
    specs.power ||
    specs.wattage ||
    specs.rated_power ||
    specs.capacity ||
    specs.cong_suat ||
    specs.dung_luong ||
    specs.energy ||
    '';
  const price =
    product.unit_price > 0
      ? new Intl.NumberFormat('vi-VN').format(product.unit_price) + ' đ'
      : 'Liên hệ';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md text-left w-full ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-200'
      }`}
    >
      {isSelected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </span>
      )}
      {product.main_image && (
        <img
          src={product.main_image}
          alt={product.name}
          className="w-full h-20 object-contain rounded-lg bg-gray-50"
        />
      )}
      <span className="text-xs font-bold text-blue-600 uppercase">{brandName}</span>
      <span className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
        {product.name}
      </span>
      {keySpec && <span className="text-xs text-gray-500">{keySpec}</span>}
      <span className="text-sm font-bold text-orange-600">{price}</span>
    </button>
  );
}

// ─── Product skeleton ─────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border-2 border-gray-100 p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-16" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-20" />
    </div>
  );
}

// ─── Summary breadcrumb bar ───────────────────────────────────────────────────

interface SummaryTag {
  label: string;
  stepIndex: number;
}

function SummaryBar({
  tags,
  onRemove,
}: {
  tags: SummaryTag[];
  onRemove: (stepIndex: number) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
      {tags.map((tag) => (
        <button
          key={tag.stepIndex}
          type="button"
          onClick={() => onRemove(tag.stepIndex)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          {tag.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

// ─── Animated step wrapper ────────────────────────────────────────────────────

function StepReveal({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        maxHeight: visible ? '800px' : '0px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        overflow: 'hidden',
        transition: 'max-height 500ms ease-out, opacity 500ms ease-out, transform 500ms ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="pb-6">{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SolarWizard({ onConfigComplete, className = '' }: SolarWizardProps) {
  const [wizard, setWizard] = useState<WizardState>({
    systemType: null,
    phase: null,
    voltageType: null,
    selectedPanel: null,
    selectedInverter: null,
    selectedBattery: null,
    power: null,
    batteryCapacity: null,
    roofType: null,
    accessories: [],
  });

  // ── Product lists ──
  const [panels, setPanels] = useState<any[]>([]);
  const [panelsLoading, setPanelsLoading] = useState(false);
  const [inverters, setInverters] = useState<any[]>([]);
  const [invertersLoading, setInvertersLoading] = useState(false);
  const [batteries, setBatteries] = useState<any[]>([]);
  const [batteriesLoading, setBatteriesLoading] = useState(false);

  // ── Step visibility logic ──

  const showStep2 = wizard.systemType !== null;

  const phaseComplete =
    wizard.phase !== null &&
    (wizard.systemType !== 'hybrid' || wizard.phase === '1-phase' || wizard.voltageType !== null);

  // Step 3: Panel (after phase)
  const showStep3Panel = showStep2 && phaseComplete;

  // Step 4: Power (after panel selected)
  const showStep4Power = showStep3Panel && wizard.selectedPanel !== null;

  // Step 5: Inverter — after power selected (both on-grid and hybrid)
  const showStep5Inverter = showStep4Power && wizard.power !== null;

  // Step 6: Battery product selection — hybrid only, after inverter selected
  const showStep6BatteryProduct =
    showStep5Inverter &&
    wizard.selectedInverter !== null &&
    wizard.systemType === 'hybrid';

  // Step 7: Battery capacity — hybrid only, after battery product selected
  const showStep7BatteryCapacity =
    showStep6BatteryProduct && wizard.selectedBattery !== null && wizard.systemType === 'hybrid';

  // Step 8: Roof — after inverter (on-grid) or after battery capacity (hybrid)
  const showStep8Roof =
    (wizard.systemType === 'on-grid' && showStep5Inverter && wizard.selectedInverter !== null) ||
    (wizard.systemType === 'hybrid' && showStep7BatteryCapacity && wizard.batteryCapacity !== null);

  // Step 9: Accessories — after roof selected (optional)
  const showStep9Accessories = showStep8Roof && wizard.roofType !== null;

  // isComplete: roof type selected (accessories optional)
  const isComplete = showStep9Accessories;

  // ── Fetch panels when step 3 becomes visible ──
  useEffect(() => {
    if (!showStep3Panel) return;
    setPanelsLoading(true);
    fetch('/api/products?productType=panel')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPanels(json.data || []);
      })
      .catch(() => {})
      .finally(() => setPanelsLoading(false));
  }, [showStep3Panel]);

  // ── Inverter category mapping ──
  function getInverterCategories(
    systemType: string,
    phase: string,
    voltageType: string | null,
  ): string[] {
    if (systemType === 'on-grid') {
      if (phase === '1-phase') return ['on-grid-inverter', 'on-grid-1phase'];
      if (phase === '3-phase') return ['on-grid-3phase-lv', 'on-grid-3phase-hv'];
    }
    if (systemType === 'hybrid') {
      if (phase === '1-phase') return ['hybrid-1phase'];
      if (phase === '3-phase' && voltageType === 'low') return ['hybrid-3phase-lv'];
      if (phase === '3-phase' && voltageType === 'high') return ['hybrid-3phase-hv'];
    }
    return [];
  }

  // ── Fetch inverters when step 5 becomes visible ──
  useEffect(() => {
    if (!showStep5Inverter || !wizard.systemType || !wizard.phase) return;
    const categories = getInverterCategories(wizard.systemType, wizard.phase, wizard.voltageType);
    if (categories.length === 0) return;
    setInvertersLoading(true);
    Promise.all(categories.map((cat) => fetch(`/api/products?category=${cat}`).then((r) => r.json())))
      .then((results) => {
        const allProducts = results.flatMap((r) => (r.success ? r.data || [] : []));
        const unique = [...new Map(allProducts.map((p: any) => [p.id, p])).values()];
        setInverters(unique);
      })
      .catch(() => setInverters([]))
      .finally(() => setInvertersLoading(false));
  }, [showStep5Inverter, wizard.systemType, wizard.phase, wizard.voltageType]);

  // ── Fetch battery storage when step 6 becomes visible ──
  useEffect(() => {
    if (!showStep6BatteryProduct) return;
    // Default to lv-battery for 1-phase (voltageType null) or explicit low; hv-battery for high
    const category = wizard.voltageType === 'high' ? 'hv-battery' : 'lv-battery';
    setBatteriesLoading(true);
    fetch(`/api/products?category=${category}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setBatteries(json.data || []);
        else setBatteries([]);
      })
      .catch(() => setBatteries([]))
      .finally(() => setBatteriesLoading(false));
  }, [showStep6BatteryProduct, wizard.voltageType]);

  // ── Reset helpers ──

  function resetFromStep(stepIndex: number) {
    setWizard((prev) => {
      const next = { ...prev };
      if (stepIndex <= 1) {
        next.systemType = null;
        next.phase = null;
        next.voltageType = null;
        next.selectedPanel = null;
        next.selectedInverter = null;
        next.selectedBattery = null;
        next.power = null;
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 2) {
        next.phase = null;
        next.voltageType = null;
        next.selectedInverter = null;
        next.selectedBattery = null;
        next.power = null;
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 3) {
        next.selectedPanel = null;
        next.power = null;
        next.batteryCapacity = null;
        next.selectedInverter = null;
        next.selectedBattery = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 4) {
        next.power = null;
        next.selectedInverter = null;
        next.selectedBattery = null;
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 5) {
        // Reset inverter and downstream
        next.selectedInverter = null;
        next.selectedBattery = null;
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 6) {
        // Reset battery product and downstream (hybrid)
        next.selectedBattery = null;
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 7) {
        // Reset battery capacity and downstream (hybrid)
        next.batteryCapacity = null;
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 8) {
        next.roofType = null;
        next.accessories = [];
      }
      if (stepIndex === 9) {
        next.accessories = [];
      }
      return next;
    });
  }

  // ── Summary tags ──

  const summaryTags: SummaryTag[] = [];
  if (wizard.systemType) {
    summaryTags.push({
      label: wizard.systemType === 'on-grid' ? 'On-Grid' : 'Hybrid',
      stepIndex: 1,
    });
  }
  if (wizard.phase) {
    let phaseLabel: string;
    if (wizard.systemType === 'hybrid') {
      if (wizard.phase === '1-phase') phaseLabel = '1 Pha';
      else if (wizard.voltageType === 'low') phaseLabel = '3 Pha Áp Thấp';
      else phaseLabel = '3 Pha Áp Cao';
    } else {
      phaseLabel = wizard.phase === '1-phase' ? '1 Pha' : '3 Pha';
    }
    summaryTags.push({ label: phaseLabel, stepIndex: 2 });
  }
  if (wizard.selectedPanel) {
    summaryTags.push({ label: `Panel: ${wizard.selectedPanel.brand}`, stepIndex: 3 });
  }
  if (wizard.power) {
    summaryTags.push({ label: `${wizard.power} kWp`, stepIndex: 4 });
  }
  if (wizard.selectedInverter) {
    summaryTags.push({ label: `Inverter: ${wizard.selectedInverter.brand}`, stepIndex: 5 });
  }
  if (wizard.selectedBattery) {
    summaryTags.push({ label: `Pin Lithium: ${wizard.selectedBattery.brand}`, stepIndex: 6 });
  }
  if (wizard.batteryCapacity) {
    summaryTags.push({ label: `Pin ${wizard.batteryCapacity} kWh`, stepIndex: 7 });
  }
  if (wizard.roofType) {
    const roofLabels = { tile: 'Mái ngói', metal: 'Mái tôn', flat: 'Mái bằng' };
    summaryTags.push({ label: roofLabels[wizard.roofType], stepIndex: 8 });
  }
  if (wizard.accessories.length > 0) {
    summaryTags.push({ label: `${wizard.accessories.length} phụ kiện`, stepIndex: 9 });
  }

  // ── Dynamic step numbers ──
  const isHybrid = wizard.systemType === 'hybrid';
  // Steps: 1(system) 2(phase) 3(panel) 4(power) 5(inverter) [6(battProduct) hybrid] [7(battCap) hybrid] 8(roof) 9(accessories)
  // If not hybrid: step 6 battery product and step 7 battery capacity are hidden
  let stepNum = 3; // panel is always step 3
  const panelNum = stepNum;
  const powerNum = ++stepNum; // 4
  const inverterNum = ++stepNum; // 5 always
  const battProductNum = isHybrid ? ++stepNum : null; // 6 if hybrid
  const battCapNum = isHybrid ? ++stepNum : null; // 7 if hybrid
  const roofNum = ++stepNum; // 6 (on-grid) or 8 (hybrid)
  const accessoriesNum = ++stepNum; // last

  // ── Confirm ──

  function handleConfirm() {
    if (isComplete) {
      onConfigComplete(wizard);
    }
  }

  // ── Accessory toggle ──
  function toggleAccessory(slug: string) {
    setWizard((prev) => {
      const already = prev.accessories.includes(slug);
      return {
        ...prev,
        accessories: already
          ? prev.accessories.filter((s) => s !== slug)
          : [...prev.accessories, slug],
      };
    });
  }

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6 w-full max-w-full ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống điện mặt trời</h2>
        <p className="text-gray-500 text-sm mt-1">Trả lời từng bước để nhận gợi ý phù hợp nhất</p>
      </div>

      {/* Summary bar */}
      <SummaryBar tags={summaryTags} onRemove={resetFromStep} />

      {/* ── Step 1: System Type ── */}
      <div className="mb-2">
        <StepHeader number={1} label="Chọn hệ thống" active={true} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <OptionCard
            selected={wizard.systemType === 'on-grid'}
            onClick={() => {
              setWizard((prev) => ({
                ...prev,
                systemType: 'on-grid',
                phase: null,
                voltageType: null,
                selectedPanel: null,
                selectedInverter: null,
                selectedBattery: null,
                power: null,
                batteryCapacity: null,
                roofType: null,
                accessories: [],
              }));
            }}
          >
            <div className="flex items-center gap-3 mb-2 pr-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Sun className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">On-Grid</p>
                <p className="text-xs text-gray-500">Hòa lưới – tiết kiệm điện</p>
              </div>
            </div>
          </OptionCard>

          <OptionCard
            selected={wizard.systemType === 'hybrid'}
            onClick={() => {
              setWizard((prev) => ({
                ...prev,
                systemType: 'hybrid',
                phase: null,
                voltageType: null,
                selectedPanel: null,
                selectedInverter: null,
                selectedBattery: null,
                power: null,
                batteryCapacity: null,
                roofType: null,
                accessories: [],
              }));
            }}
          >
            <div className="flex items-center gap-3 mb-2 pr-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Battery className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Hybrid</p>
                <p className="text-xs text-gray-500">Lưu trữ năng lượng – dùng cả ngày lẫn đêm</p>
              </div>
            </div>
          </OptionCard>
        </div>
      </div>

      {/* ── Step 2: Phase ── */}
      <StepReveal visible={showStep2}>
        <StepHeader number={2} label="Chọn pha" active={showStep2} />
        {wizard.systemType === 'hybrid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={wizard.phase === '1-phase'}
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  phase: '1-phase',
                  voltageType: null,
                  selectedInverter: null,
                  selectedBattery: null,
                  power: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
            >
              <div className="flex items-center gap-3 pr-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1 Pha</p>
                  <p className="text-xs text-gray-500">Phù hợp hộ gia đình</p>
                </div>
              </div>
            </OptionCard>

            <OptionCard
              selected={wizard.phase === '3-phase' && wizard.voltageType === 'low'}
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  phase: '3-phase',
                  voltageType: 'low',
                  selectedInverter: null,
                  selectedBattery: null,
                  power: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
            >
              <div className="flex items-center gap-3 pr-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Battery className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3 Pha Pin Áp Thấp</p>
                  <p className="text-xs text-gray-500">Pin áp thấp 40-60V, phù hợp hộ gia đình</p>
                </div>
              </div>
            </OptionCard>

            <OptionCard
              selected={wizard.phase === '3-phase' && wizard.voltageType === 'high'}
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  phase: '3-phase',
                  voltageType: 'high',
                  selectedInverter: null,
                  selectedBattery: null,
                  power: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
            >
              <div className="flex items-center gap-3 pr-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3 Pha Pin Áp Cao</p>
                  <p className="text-xs text-gray-500">Pin áp cao 150-600V, phù hợp doanh nghiệp</p>
                </div>
              </div>
            </OptionCard>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OptionCard
              selected={wizard.phase === '1-phase'}
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  phase: '1-phase',
                  voltageType: null,
                  selectedInverter: null,
                  selectedBattery: null,
                  power: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
            >
              <div className="flex items-center gap-3 pr-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1 Pha</p>
                  <p className="text-xs text-gray-500">Phù hợp hộ gia đình</p>
                </div>
              </div>
            </OptionCard>

            <OptionCard
              selected={wizard.phase === '3-phase'}
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  phase: '3-phase',
                  voltageType: null,
                  selectedInverter: null,
                  selectedBattery: null,
                  power: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
            >
              <div className="flex items-center gap-3 pr-5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3 Pha</p>
                  <p className="text-xs text-gray-500">Phù hợp doanh nghiệp, nhà xưởng</p>
                </div>
              </div>
            </OptionCard>
          </div>
        )}
      </StepReveal>

      {/* ── Step 3: Solar Panel ── */}
      <StepReveal visible={showStep3Panel}>
        <StepHeader
          number={panelNum}
          label="Chọn tấm pin mặt trời"
          active={showStep3Panel}
          icon={<Sun className="h-5 w-5" />}
        />
        {panelsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : panels.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">Không tìm thấy sản phẩm phù hợp</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {panels.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={wizard.selectedPanel?.id === product.id}
                onSelect={() => {
                  const specs = product.specifications || {};
                  const keySpec =
                    specs.power || specs.wattage || specs.cong_suat || '';
                  setWizard((prev) => ({
                    ...prev,
                    selectedPanel: {
                      id: product.id,
                      name: product.name,
                      brand: product.brands?.name || '',
                      specs: keySpec,
                      price: product.unit_price,
                      image: product.main_image,
                    },
                    power: null,
                    batteryCapacity: null,
                    selectedInverter: null,
                    selectedBattery: null,
                    roofType: null,
                    accessories: [],
                  }));
                }}
              />
            ))}
          </div>
        )}
      </StepReveal>

      {/* ── Step 4: Power ── */}
      <StepReveal visible={showStep4Power}>
        <StepHeader number={powerNum} label="Chọn công suất (kWp)" active={showStep4Power} />
        <div className="grid grid-cols-4 gap-2">
          {POWER_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  power: p,
                  selectedInverter: null,
                  selectedBattery: null,
                  batteryCapacity: null,
                  roofType: null,
                  accessories: [],
                }))
              }
              className={`py-2.5 px-2 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:shadow-sm ${
                wizard.power === p
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </StepReveal>

      {/* ── Step 5: Inverter ── */}
      <StepReveal visible={showStep5Inverter}>
        <StepHeader
          number={inverterNum}
          label="Chọn biến tần"
          active={showStep5Inverter}
          icon={<Zap className="h-5 w-5" />}
        />
        {invertersLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : inverters.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">Không tìm thấy sản phẩm phù hợp</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {inverters.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={wizard.selectedInverter?.id === product.id}
                onSelect={() => {
                  const specs = product.specifications || {};
                  const keySpec =
                    specs.power || specs.rated_power || specs.cong_suat || '';
                  setWizard((prev) => ({
                    ...prev,
                    selectedInverter: {
                      id: product.id,
                      name: product.name,
                      brand: product.brands?.name || '',
                      specs: keySpec,
                      price: product.unit_price,
                      image: product.main_image,
                    },
                    selectedBattery: null,
                    batteryCapacity: null,
                    roofType: null,
                    accessories: [],
                  }));
                }}
              />
            ))}
          </div>
        )}
      </StepReveal>

      {/* ── Step 6: Battery product selection (Hybrid only) ── */}
      <StepReveal visible={showStep6BatteryProduct}>
        <StepHeader
          number={battProductNum ?? 6}
          label="Chọn loại pin Lithium"
          active={showStep6BatteryProduct}
          icon={<Battery className="h-5 w-5" />}
        />
        {batteriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : batteries.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">Không tìm thấy sản phẩm phù hợp</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {batteries.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={wizard.selectedBattery?.id === product.id}
                onSelect={() => {
                  const specs = product.specifications || {};
                  const keySpec =
                    specs.capacity || specs.dung_luong || specs.energy || '';
                  setWizard((prev) => ({
                    ...prev,
                    selectedBattery: {
                      id: product.id,
                      name: product.name,
                      brand: product.brands?.name || '',
                      specs: keySpec,
                      price: product.unit_price,
                      image: product.main_image,
                    },
                    batteryCapacity: null,
                    roofType: null,
                    accessories: [],
                  }));
                }}
              />
            ))}
          </div>
        )}
      </StepReveal>

      {/* ── Step 7: Battery capacity (Hybrid only) ── */}
      <StepReveal visible={showStep7BatteryCapacity}>
        <StepHeader
          number={battCapNum ?? 7}
          label="Chọn dung lượng pin (kWh)"
          active={showStep7BatteryCapacity}
        />
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {BATTERY_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() =>
                setWizard((prev) => ({
                  ...prev,
                  batteryCapacity: b,
                  roofType: null,
                  accessories: [],
                }))
              }
              className={`py-2.5 px-2 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:shadow-sm ${
                wizard.batteryCapacity === b
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </StepReveal>

      {/* ── Step 8: Roof type ── */}
      <StepReveal visible={showStep8Roof}>
        <StepHeader number={roofNum} label="Loại mái" active={showStep8Roof} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <OptionCard
            selected={wizard.roofType === 'tile'}
            onClick={() => setWizard((prev) => ({ ...prev, roofType: 'tile' }))}
          >
            <div className="flex flex-col items-start gap-2 pr-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Home className="h-5 w-5 text-red-500" />
              </div>
              <p className="font-semibold text-gray-900">Mái ngói</p>
              <p className="text-xs text-gray-500">Lắp đặt với kẹp chuyên dụng, an toàn cao</p>
            </div>
          </OptionCard>

          <OptionCard
            selected={wizard.roofType === 'metal'}
            onClick={() => setWizard((prev) => ({ ...prev, roofType: 'metal' }))}
          >
            <div className="flex flex-col items-start gap-2 pr-5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Warehouse className="h-5 w-5 text-slate-600" />
              </div>
              <p className="font-semibold text-gray-900">Mái tôn</p>
              <p className="text-xs text-gray-500">Phổ biến nhất, lắp nhanh bằng hook</p>
            </div>
          </OptionCard>

          <OptionCard
            selected={wizard.roofType === 'flat'}
            onClick={() => setWizard((prev) => ({ ...prev, roofType: 'flat' }))}
          >
            <div className="flex flex-col items-start gap-2 pr-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <p className="font-semibold text-gray-900">Mái bằng</p>
              <p className="text-xs text-gray-500">Dùng chân đế tilt, tối ưu góc nghiêng</p>
            </div>
          </OptionCard>
        </div>
      </StepReveal>

      {/* ── Step 9: Accessories (optional) ── */}
      <StepReveal visible={showStep9Accessories}>
        <StepHeader
          number={accessoriesNum}
          label="Phụ kiện bổ sung (Tùy chọn)"
          active={showStep9Accessories}
          icon={<Package className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCESSORY_OPTIONS.map((acc) => {
            const IconComp = acc.icon;
            const isSelected = wizard.accessories.includes(acc.slug);
            return (
              <button
                key={acc.slug}
                type="button"
                onClick={() => toggleAccessory(acc.slug)}
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md text-left w-full ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${acc.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <IconComp className={`h-5 w-5 ${acc.color}`} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="font-semibold text-gray-900 text-sm">{acc.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{acc.desc}</p>
                </div>
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </StepReveal>

      {/* ── Confirm button ── */}
      <div
        style={{
          maxHeight: isComplete ? '100px' : '0px',
          opacity: isComplete ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 500ms ease-out, opacity 500ms ease-out',
        }}
      >
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full mt-2 py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>Xác nhận cấu hình</span>
        </button>
      </div>
    </div>
  );
}
