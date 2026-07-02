import { Sun, Lightning, ChartBar, Calendar, Phone, BatteryHigh } from '@phosphor-icons/react';

/* ─── Hybrid Combo Components ───────────────────────────── */

interface HybridCombo {
  id: string;
  slug: string;
  name: string;
  power: number;
  battery: number;
  price: number;
  system_type: 'hybrid';
  phase: '1-phase';
  panel_brand: string;
  inverter_brand: string;
  productionMin: number;
  productionMax: number;
  paybackStr: string;
  is_popular?: boolean;
}

const FALLBACK_HYBRID_COMBOS: HybridCombo[] = [
  { id: 'hyb-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hybrid 5 kWp 1 pha – 5 kWh', power: 5, battery: 5.12, price: 100500000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '4 năm 8 tháng', is_popular: true },
  { id: 'hyb-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hybrid 5 kWp 1 pha – 10 kWh', power: 5, battery: 10.24, price: 125000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 500, productionMax: 700, paybackStr: '5 năm 2 tháng' },
  { id: 'hyb-88-5', slug: 'hybrid-88kw-1pha-5kwh', name: 'Hybrid 8.8 kWp 1 pha – 5 kWh', power: 8.75, battery: 5.12, price: 145000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 6 tháng', is_popular: true },
  { id: 'hyb-88-10', slug: 'hybrid-88kw-1pha-10kwh', name: 'Hybrid 8.8 kWp 1 pha – 10 kWh', power: 8.75, battery: 10.24, price: 168000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '4 năm 9 tháng' },
  { id: 'hyb-88-16', slug: 'hybrid-88kw-1pha-16kwh', name: 'Hybrid 8.8 kWp 1 pha – 16 kWh', power: 8.75, battery: 16.38, price: 195000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '5 năm 1 tháng' },
  { id: 'hyb-107-10', slug: 'hybrid-107kw-1pha-10kwh', name: 'Hybrid 10.7 kWp 1 pha – 10 kWh', power: 10.63, battery: 10.24, price: 185000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '4 năm 10 tháng' },
  { id: 'hyb-107-16', slug: 'hybrid-107kw-1pha-16kwh', name: 'Hybrid 10.7 kWp 1 pha – 16 kWh', power: 10.63, battery: 16.38, price: 215000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '5 năm 3 tháng', is_popular: true },
  { id: 'hyb-157-16', slug: 'hybrid-157kw-1pha-16kwh', name: 'Hybrid 15.7 kWp 1 pha – 16 kWh', power: 15.63, battery: 16.38, price: 285000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1500, paybackStr: '5 năm 6 tháng' },
];

export function HybridComboCard({ combo }: { combo: HybridCombo }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Lightning className="w-3.5 h-3.5 text-orange-500" />, label: `Biến tần ${combo.inverter_brand}`, value: `${combo.power} kW` },
    { icon: <BatteryHigh className="w-3.5 h-3.5 text-blue-600" />, label: 'Pin lưu trữ', value: `${combo.battery} kWh` },
    { icon: <ChartBar className="w-3.5 h-3.5 text-emerald-600" />, label: 'Sản lượng/tháng', value: `${combo.productionMin}–${combo.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />, label: 'Hoàn vốn', value: combo.paybackStr },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header - blue for hybrid */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
          <BatteryHigh className="w-3 h-3" />
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

export function HybridComboGrid() {
  const combos = FALLBACK_HYBRID_COMBOS;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BatteryHigh className="h-5 w-5 text-blue-600" aria-hidden="true" />
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
