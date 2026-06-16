import { useState } from 'react';
import { Sun, Zap, Battery } from 'lucide-react';

/* ─── Tab Types ────────────────────────────────────────── */
type PhaseType = '1-phase' | '3-phase' | '3-phase-low' | '3-phase-high';

interface TabConfig {
  key: PhaseType;
  label: string;
  icon: typeof Sun;
}

const PHASE_TABS: TabConfig[] = [
  { key: '1-phase', label: '1 Pha', icon: Sun },
  { key: '3-phase', label: '3 Pha', icon: Zap },
  { key: '3-phase-low', label: '3 Pha Áp Thấp', icon: Battery },
  { key: '3-phase-high', label: '3 Pha Áp Cao', icon: Battery },
];

/* ─── Combo Data ───────────────────────────────────────── */
interface ComboItem {
  id: string;
  name: string;
  power: number;
  price: number;
  battery?: number;
  phase: PhaseType;
  panel_brand: string;
  inverter_brand: string;
  productionMin: number;
  productionMax: number;
  paybackStr: string;
  is_popular?: boolean;
}

const ONGRID_COMBOS: ComboItem[] = [
  // 1-Phase
  { id: 'og1p-5', name: 'On-Grid 5 kWp', power: 5, price: 60000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 350, productionMax: 450, paybackStr: '4 năm 3 tháng', is_popular: true },
  { id: 'og1p-88', name: 'On-Grid 8.8 kWp', power: 8.75, price: 95000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '2 năm 11 tháng', is_popular: true },
  { id: 'og1p-107', name: 'On-Grid 10.7 kWp', power: 10.63, price: 110700000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '3 năm 1 tháng' },
  // 3-Phase
  { id: 'og3p-107', name: 'On-Grid 10.7 kWp', power: 10.63, price: 108400000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-157', name: 'On-Grid 15.7 kWp', power: 15.63, price: 145800000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1100, productionMax: 1300, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-188', name: 'On-Grid 18.8 kWp', power: 18.75, price: 167200000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1400, paybackStr: '3 năm 7 tháng', is_popular: true },
  { id: 'og3p-294', name: 'On-Grid 29.4 kWp', power: 29.38, price: 278000000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2500, productionMax: 3600, paybackStr: '2 năm 7 tháng' },
  { id: 'og3p-488', name: 'On-Grid 48.8 kWp', power: 48.75, price: 440600000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 4500, productionMax: 6000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-731', name: 'On-Grid 73.1 kWp', power: 73.13, price: 638900000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 6000, productionMax: 9000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-97', name: 'On-Grid 97 kWp', power: 96.88, price: 827500000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 8000, productionMax: 11800, paybackStr: '2 năm 5 tháng' },
];

const HYBRID_COMBOS: ComboItem[] = [
  // 1-Phase
  { id: 'hyb-5-5', name: 'Hybrid 5 kWp – 5 kWh', power: 5, battery: 5.12, price: 100500000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '4 năm 8 tháng', is_popular: true },
  { id: 'hyb-5-10', name: 'Hybrid 5 kWp – 10 kWh', power: 5, battery: 10.24, price: 125000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '5 năm 2 tháng' },
  { id: 'hyb-88-5', name: 'Hybrid 8.8 kWp – 5 kWh', power: 8.75, battery: 5.12, price: 145000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 6 tháng', is_popular: true },
  { id: 'hyb-88-10', name: 'Hybrid 8.8 kWp – 10 kWh', power: 8.75, battery: 10.24, price: 168000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 9 tháng' },
  // 3-Phase Low Voltage
  { id: 'hyb-3p-10-10', name: 'Hybrid 10 kWp 3P – 10 kWh', power: 10, battery: 10.24, price: 175000000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1100, paybackStr: '4 năm 9 tháng' },
  { id: 'hyb-3p-15-15', name: 'Hybrid 15 kWp 3P – 15 kWh', power: 15, battery: 15.36, price: 245000000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: '5 năm 1 tháng', is_popular: true },
  { id: 'hyb-3p-20-20', name: 'Hybrid 20 kWp 3P – 20 kWh', power: 20, battery: 20.48, price: 320000000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1600, productionMax: 2000, paybackStr: '5 năm 4 tháng' },
];

const HYBRID_BATTERY_COMBOS: ComboItem[] = [
  // 3-Phase High Voltage
  { id: 'hyb-hv-30-30', name: 'Hybrid 30 kWp 3P HV – 30 kWh', power: 30, battery: 30.72, price: 450000000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2400, productionMax: 3000, paybackStr: '5 năm 6 tháng', is_popular: true },
  { id: 'hyb-hv-40-40', name: 'Hybrid 40 kWp 3P HV – 40 kWh', power: 40, battery: 40.96, price: 580000000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 3200, productionMax: 4000, paybackStr: '5 năm 9 tháng' },
  { id: 'hyb-hv-50-50', name: 'Hybrid 50 kWp 3P HV – 50 kWh', power: 50, battery: 51.20, price: 720000000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 4000, productionMax: 5000, paybackStr: '6 năm' },
  { id: 'hyb-hv-75-75', name: 'Hybrid 75 kWp 3P HV – 75 kWh', power: 75, battery: 76.80, price: 1050000000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 6000, productionMax: 7500, paybackStr: '6 năm 3 tháng' },
];

/* ─── Combo Card Component ─────────────────────────────── */
function ComboCard({ combo, variant }: { combo: ComboItem; variant: 'ongrid' | 'hybrid' | 'hybrid-battery' }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);
  const isHybrid = variant !== 'ongrid';
  
  const headerColors = {
    'ongrid': 'linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)',
    'hybrid': 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
    'hybrid-battery': 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)',
  };

  const badgeColors = {
    'ongrid': { bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
    'hybrid': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
    'hybrid-battery': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow p-4">
      <div className="px-3 pt-3 pb-2 rounded-lg mb-3" style={{ background: headerColors[variant] }}>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5" style={{ background: badgeColors[variant].bg, color: badgeColors[variant].color }}>
          {variant === 'ongrid' ? <Sun className="w-2.5 h-2.5" /> : <Battery className="w-2.5 h-2.5" />}
          {variant === 'ongrid' ? 'On-Grid' : variant === 'hybrid' ? 'Hybrid' : 'Hybrid + Battery'}
        </span>
        <h4 className="text-base font-bold text-gray-900">{combo.name}</h4>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Công suất:</span>
          <span className="font-semibold text-gray-900">{combo.power} kWp</span>
        </div>
        {combo.battery && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Pin lưu trữ:</span>
            <span className="font-semibold text-blue-600">{combo.battery} kWh</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Sản lượng:</span>
          <span className="font-semibold text-emerald-600">{combo.productionMin}–{combo.productionMax} kWh/tháng</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Hoàn vốn:</span>
          <span className="font-semibold text-gray-900">{combo.paybackStr}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{(combo.price / 1000000).toFixed(0)} triệu</span>
          {combo.is_popular && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Phổ biến
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── System Row Component ─────────────────────────────── */
function SystemRow({ 
  title, 
  description, 
  icon: Icon, 
  iconColor,
  combos, 
  variant 
}: { 
  title: string; 
  description: string; 
  icon: typeof Sun; 
  iconColor: string;
  combos: ComboItem[]; 
  variant: 'ongrid' | 'hybrid' | 'hybrid-battery';
}) {
  const [activeTab, setActiveTab] = useState<PhaseType>('1-phase');

  // Filter combos by active tab
  const filteredCombos = combos.filter(c => c.phase === activeTab);

  // Group available phases
  const availablePhases = PHASE_TABS.filter(tab => 
    combos.some(c => c.phase === tab.key)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Row Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconColor} text-white flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {/* Tabs */}
      {availablePhases.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {availablePhases.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Combo Grid */}
      {filteredCombos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCombos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} variant={variant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Chưa có combo cho cấu hình này</p>
          <a href="/lien-he" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-2 inline-block">
            Liên hệ để được tư vấn →
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────── */
export default function ComboGridWithTabs() {
  return (
    <div className="space-y-6">
      {/* On-Grid Solar Row */}
      <SystemRow
        title="On-Grid Solar"
        description="Hoàn vốn nhanh, tiết kiệm 50-70% hóa đơn – 1 pha & 3 pha"
        icon={Sun}
        iconColor="bg-gradient-to-br from-amber-500 to-orange-600"
        combos={ONGRID_COMBOS}
        variant="ongrid"
      />

      {/* Hybrid Solar Row */}
      <SystemRow
        title="Hybrid Solar"
        description="Có pin lưu trữ, sử dụng khi mất điện – 1 pha & 3 pha áp thấp"
        icon={Zap}
        iconColor="bg-gradient-to-br from-blue-500 to-indigo-600"
        combos={HYBRID_COMBOS}
        variant="hybrid"
      />

      {/* Hybrid + Battery Row */}
      <SystemRow
        title="Hybrid + Battery"
        description="Dung lượng lớn, dự phòng dài hạn – 3 pha áp cao"
        icon={Battery}
        iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
        combos={HYBRID_BATTERY_COMBOS}
        variant="hybrid-battery"
      />
    </div>
  );
}
