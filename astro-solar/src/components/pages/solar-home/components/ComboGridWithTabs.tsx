import { useState } from 'react';
import { Sun, Zap, Battery, ChevronDown, ChevronUp, X, Sun as SunIcon, Zap as ZapIcon, Home, Calendar, Phone } from 'lucide-react';

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

/* ─── Combo Data (from SolarSolutionFinder catalog) ────── */
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
  roofArea?: number;
}

// Helper to format payback: '4n3t' → '4 năm 3 tháng'
function fmtPayback(s: string): string {
  const m = s.match(/(\d+)n(\d+)t/);
  if (!m) return s;
  const t = parseInt(m[2]);
  return t > 0 ? `${m[1]} năm ${t} tháng` : `${m[1]} năm`;
}

const ONGRID_COMBOS: ComboItem[] = [
  // 1-Phase
  { id: 'og1p-5', name: 'On-Grid 5 kWp', power: 5, price: 60000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 350, productionMax: 450, paybackStr: fmtPayback('4n3t'), is_popular: true, roofArea: 21.6 },
  { id: 'og1p-88', name: 'On-Grid 8.8 kWp', power: 8.75, price: 95000000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: fmtPayback('2n11t'), is_popular: true, roofArea: 37.8 },
  { id: 'og1p-107', name: 'On-Grid 10.7 kWp', power: 10.63, price: 110700000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: fmtPayback('3n1t'), roofArea: 45.9 },
  // 3-Phase
  { id: 'og3p-107', name: 'On-Grid 10.7 kWp', power: 10.63, price: 108400000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: fmtPayback('3n5t'), roofArea: 45.9 },
  { id: 'og3p-157', name: 'On-Grid 15.7 kWp', power: 15.63, price: 145800000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1100, productionMax: 1300, paybackStr: fmtPayback('3n5t'), roofArea: 67.5 },
  { id: 'og3p-188', name: 'On-Grid 18.8 kWp', power: 18.75, price: 167200000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1400, paybackStr: fmtPayback('3n7t'), is_popular: true, roofArea: 81 },
  { id: 'og3p-294', name: 'On-Grid 29.4 kWp', power: 29.38, price: 278000000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2500, productionMax: 3600, paybackStr: fmtPayback('2n7t'), roofArea: 126.9 },
  { id: 'og3p-488', name: 'On-Grid 48.8 kWp', power: 48.75, price: 440600000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 4500, productionMax: 6000, paybackStr: fmtPayback('2n5t'), roofArea: 210.6 },
  { id: 'og3p-731', name: 'On-Grid 73.1 kWp', power: 73.13, price: 638900000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 6000, productionMax: 9000, paybackStr: fmtPayback('2n5t'), roofArea: 316.1 },
  { id: 'og3p-97', name: 'On-Grid 97 kWp', power: 96.88, price: 827500000, phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 8000, productionMax: 11800, paybackStr: fmtPayback('2n5t'), roofArea: 418.8 },
];

const HYBRID_COMBOS: ComboItem[] = [
  // 1-Phase
  { id: 'h1p-5-5', name: 'Hybrid 5 kWp – 5.12 kWh', power: 5, battery: 5.12, price: 100500000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: fmtPayback('4n8t'), is_popular: true, roofArea: 21.6 },
  { id: 'h1p-5-10', name: 'Hybrid 5 kWp – 10.24 kWh', power: 5, battery: 10.24, price: 123600000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 400, productionMax: 600, paybackStr: fmtPayback('6n10t'), roofArea: 21.6 },
  { id: 'h1p-88-5', name: 'Hybrid 8.8 kWp – 5.12 kWh', power: 8.75, battery: 5.12, price: 125200000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 600, productionMax: 900, paybackStr: fmtPayback('4n8t'), is_popular: true, roofArea: 37.8 },
  { id: 'h1p-88-10', name: 'Hybrid 8.8 kWp – 10.24 kWh', power: 8.75, battery: 10.24, price: 148300000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 700, productionMax: 1000, paybackStr: fmtPayback('4n10t'), roofArea: 37.8 },
  { id: 'h1p-107-5', name: 'Hybrid 10.7 kWp – 5.12 kWh', power: 10.63, battery: 5.12, price: 151400000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1200, paybackStr: fmtPayback('4n0t'), roofArea: 45.9 },
  { id: 'h1p-88-16', name: 'Hybrid 8.8 kWp – 16 kWh', power: 8.75, battery: 16, price: 164800000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 600, productionMax: 900, paybackStr: fmtPayback('6n2t'), roofArea: 37.8 },
  { id: 'h1p-107-10', name: 'Hybrid 10.7 kWp – 10.24 kWh', power: 10.63, battery: 10.24, price: 174500000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1200, paybackStr: fmtPayback('4n8t'), roofArea: 45.9 },
  { id: 'h1p-112-16', name: 'Hybrid 11.2 kWp – 16 kWh', power: 11.25, battery: 16, price: 184600000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1200, paybackStr: fmtPayback('4n11t'), roofArea: 48.6 },
  { id: 'h1p-107-16', name: 'Hybrid 10.7 kWp – 16 kWh', power: 10.63, battery: 16, price: 189900000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1200, paybackStr: fmtPayback('5n1t'), roofArea: 45.9 },
  { id: 'h1p-157-16', name: 'Hybrid 15.7 kWp – 16 kWh', power: 15.63, battery: 16, price: 230800000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('4n9t'), roofArea: 67.5 },
  { id: 'h1p-188-16', name: 'Hybrid 18.8 kWp – 16 kWh', power: 18.75, battery: 16, price: 261300000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1400, productionMax: 1600, paybackStr: fmtPayback('4n10t'), roofArea: 81 },
  { id: 'h1p-157-32', name: 'Hybrid 15.7 kWp – 32 kWh', power: 15.63, battery: 32, price: 293500000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('6n1t'), roofArea: 67.5 },
  { id: 'h1p-244-32', name: 'Hybrid 24.4 kWp – 32 kWh', power: 24.38, battery: 32, price: 367500000, phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2000, productionMax: 2200, paybackStr: fmtPayback('4n11t'), roofArea: 105.3 },
  // 3-Phase Low Voltage
  { id: 'h3lv-107-5', name: 'Hybrid 10.7 kWp 3P – 5.12 kWh', power: 10.63, battery: 5.12, price: 177100000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 950, productionMax: 1100, paybackStr: fmtPayback('4n10t'), roofArea: 45.9 },
  { id: 'h3lv-107-16', name: 'Hybrid 10.7 kWp 3P – 16 kWh', power: 10.63, battery: 16, price: 215600000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1200, paybackStr: fmtPayback('5n9t'), roofArea: 45.9 },
  { id: 'h3lv-157-16', name: 'Hybrid 15.7 kWp 3P – 16 kWh', power: 15.63, battery: 16, price: 247000000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('5n2t'), is_popular: true, roofArea: 67.5 },
  { id: 'h3lv-244-16', name: 'Hybrid 24.4 kWp 3P – 16 kWh', power: 24.38, battery: 16, price: 321800000, phase: '3-phase-low', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1800, productionMax: 2200, paybackStr: fmtPayback('4n6t'), roofArea: 105.3 },
];

const HYBRID_BATTERY_COMBOS: ComboItem[] = [
  // 3-Phase High Voltage (Hybrid combos with large battery capacity)
  { id: 'h3hv-157-15', name: 'Hybrid 15.7 kWp 3P HV – 15.36 kWh', power: 15.63, battery: 15.36, price: 271700000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: fmtPayback('5n7t'), roofArea: 67.5 },
  { id: 'h3hv-244-15', name: 'Hybrid 24.4 kWp 3P HV – 15.36 kWh', power: 24.38, battery: 15.36, price: 345200000, phase: '3-phase-high', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1800, productionMax: 2200, paybackStr: fmtPayback('4n10t'), is_popular: true, roofArea: 105.3 },
];

/* ─── Combo Modal Component ──────────────────────────── */
function ComboModal({ combo, variant, onClose }: { combo: ComboItem; variant: 'ongrid' | 'hybrid' | 'hybrid-battery'; onClose: () => void }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);
  const area = Math.ceil(combo.power * 4.32);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden lg:w-[80vw] lg:max-w-6xl lg:aspect-[2/1] relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button - Inside modal, top right */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg z-10"
          aria-label="Đóng modal"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Left: Image Section (Desktop only) - 50% width */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/sample-combo.jpg"
                  alt={combo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Info Section (Scrollable) - 50% width */}
          <div className="lg:w-1/2 flex flex-col max-h-[90vh] lg:max-h-full">
            {/* Header - Mobile only close button */}
            <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${
                    variant === 'ongrid' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                    variant === 'hybrid' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                    'bg-gradient-to-br from-emerald-500 to-teal-600'
                  } text-white flex items-center justify-center`}>
                    {variant === 'ongrid' ? <SunIcon className="h-6 w-6" /> : <Battery className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{combo.name}</h3>
                    <p className="text-sm text-gray-500">Mã: {combo.id}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${
                  variant === 'ongrid' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                  variant === 'hybrid' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                  'bg-gradient-to-br from-emerald-500 to-teal-600'
                } text-white flex items-center justify-center`}>
                  {variant === 'ongrid' ? <SunIcon className="h-6 w-6" /> : <Battery className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{combo.name}</h3>
                  <p className="text-sm text-gray-500">Mã: {combo.id}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* System Specs */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ZapIcon className="h-4 w-4 text-emerald-600" />
                  Thông số hệ thống
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Công suất</p>
                    <p className="text-lg font-bold text-gray-900">{combo.power} kWp</p>
                  </div>
                  {combo.battery && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Pin lưu trữ</p>
                      <p className="text-lg font-bold text-blue-600">{combo.battery} kWh</p>
                    </div>
                  )}
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Sản lượng/tháng</p>
                    <p className="text-lg font-bold text-emerald-600">{combo.productionMin}–{combo.productionMax} kWh</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Diện tích lắp đặt</p>
                    <p className="text-lg font-bold text-amber-600">~{area} m²</p>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-600" />
                  Thiết bị chính
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Tấm pin</span>
                    <span className="font-semibold text-gray-900">{combo.panel_brand} × {panelCount} tấm</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Biến tần</span>
                    <span className="font-semibold text-gray-900">{combo.inverter_brand} {combo.power} kW</span>
                  </div>
                </div>
              </div>

              {/* Financial */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  Hiệu quả tài chính
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Chi phí đầu tư</p>
                    <p className="text-2xl font-bold text-emerald-600">{(combo.price / 1000000).toFixed(0)} triệu</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Thời gian hoàn vốn</p>
                    <p className="text-2xl font-bold text-blue-600">{combo.paybackStr}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed CTA Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <a
                  href={`/solar-home/combo/${combo.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Tư vấn ngay
                </a>
                <a
                  href={`/solar-home/combo/${combo.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
                >
                  Xem chi tiết combo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Combo Card Component ─────────────────────────────── */
function ComboCard({ combo, variant }: { combo: ComboItem; variant: 'ongrid' | 'hybrid' | 'hybrid-battery' }) {
  const [showModal, setShowModal] = useState(false);
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
    <>
      <div 
        className="rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col"
        onClick={() => setShowModal(true)}
      >
        <div className="px-4 pt-4 pb-3" style={{ background: headerColors[variant] }}>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5" style={{ background: badgeColors[variant].bg, color: badgeColors[variant].color }}>
            {variant === 'ongrid' ? <Sun className="w-2.5 h-2.5" /> : <Battery className="w-2.5 h-2.5" />}
            {variant === 'ongrid' ? 'On-Grid' : variant === 'hybrid' ? 'Hybrid' : 'Hybrid + Battery'}
          </span>
          <h4 className="text-base font-bold text-gray-900">{combo.name}</h4>
        </div>

        <div className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Công suất:</span>
          <span className="font-semibold text-gray-900">{combo.power} kWp</span>
        </div>
        {combo.battery && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Pin lưu trữ:</span>
            <span className="font-semibold text-blue-600">{combo.battery} kWh</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Sản lượng:</span>
          <span className="font-semibold text-emerald-600">{combo.productionMin}–{combo.productionMax} kWh/tháng</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Hoàn vốn:</span>
          <span className="font-semibold text-gray-900">{combo.paybackStr}</span>
        </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{(combo.price / 1000000).toFixed(0)} triệu</span>
          {combo.is_popular && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Phổ biến
            </span>
          )}
        </div>
      </div>

      {showModal && <ComboModal combo={combo} variant={variant} onClose={() => setShowModal(false)} />}
      </div>
    </>
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
  // Get available phases for this row
  const availablePhases = PHASE_TABS.filter(tab => 
    combos.some(c => c.phase === tab.key)
  );

  // Initialize activeTab to first available phase (not hardcoded '1-phase')
  const [activeTab, setActiveTab] = useState<PhaseType>(
    availablePhases.length > 0 ? availablePhases[0].key : '1-phase'
  );
  const [showAll, setShowAll] = useState(false);

  // Filter combos by active tab
  const filteredCombos = combos.filter(c => c.phase === activeTab);

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCombos.slice(0, showAll ? filteredCombos.length : 4).map((combo) => (
              <ComboCard key={combo.id} combo={combo} variant={variant} />
            ))}
          </div>

          {filteredCombos.length > 4 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
              >
                {showAll ? (
                  <>
                    Thu gọn
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Xem thêm {filteredCombos.length - 4} combo
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
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
        description="Hybrid 3 pha áp cao – Dung lượng lớn, dự phòng dài hạn"
        icon={Battery}
        iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
        combos={HYBRID_BATTERY_COMBOS}
        variant="hybrid-battery"
      />
    </div>
  );
}
