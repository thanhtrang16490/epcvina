import { Sun, Zap, Home, BarChart3, Calendar, Phone, Battery } from 'lucide-react';

/* ─── On-Grid Combo Components ──────────────────────────── */

interface OnGridCombo {
  id: string;
  slug: string;
  name: string;
  power: number;
  price: number;
  system_type: 'on-grid';
  phase: '1-phase' | '3-phase';
  panel_brand: string;
  inverter_brand: string;
  productionMin: number;
  productionMax: number;
  paybackStr: string;
  is_popular?: boolean;
}

const FALLBACK_ONGRID_COMBOS: OnGridCombo[] = [
  { id: 'og1p-5', slug: 'on-grid-5kwp-1p', name: 'On-Grid 5 kWp 1 pha', power: 5, price: 60000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 350, productionMax: 450, paybackStr: '4 năm 3 tháng', is_popular: true },
  { id: 'og1p-88', slug: 'on-grid-88kwp-1p', name: 'On-Grid 8.8 kWp 1 pha', power: 8.75, price: 95000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '2 năm 11 tháng', is_popular: true },
  { id: 'og1p-107', slug: 'on-grid-107kwp-1p', name: 'On-Grid 10.7 kWp 1 pha', power: 10.63, price: 110700000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 900, productionMax: 1100, paybackStr: '3 năm 1 tháng' },
  { id: 'og3p-107', slug: 'on-grid-107kwp-3p', name: 'On-Grid 10.7 kWp 3 pha', power: 10.63, price: 108400000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 800, productionMax: 1000, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-157', slug: 'on-grid-157kwp-3p', name: 'On-Grid 15.7 kWp 3 pha', power: 15.63, price: 145800000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1100, productionMax: 1300, paybackStr: '3 năm 5 tháng' },
  { id: 'og3p-188', slug: 'on-grid-188kwp-3p', name: 'On-Grid 18.8 kWp 3 pha', power: 18.75, price: 167200000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 1200, productionMax: 1400, paybackStr: '3 năm 7 tháng', is_popular: true },
  { id: 'og3p-294', slug: 'on-grid-294kwp-3p', name: 'On-Grid 29.4 kWp 3 pha', power: 29.38, price: 278000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 2500, productionMax: 3600, paybackStr: '2 năm 7 tháng' },
  { id: 'og3p-488', slug: 'on-grid-488kwp-3p', name: 'On-Grid 48.8 kWp 3 pha', power: 48.75, price: 440600000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 4500, productionMax: 6000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-731', slug: 'on-grid-731kwp-3p', name: 'On-Grid 73.1 kWp 3 pha', power: 73.13, price: 638900000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 6000, productionMax: 9000, paybackStr: '2 năm 5 tháng' },
  { id: 'og3p-97', slug: 'on-grid-97kwp-3p', name: 'On-Grid 97 kWp 3 pha', power: 96.88, price: 827500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', productionMin: 8000, productionMax: 11800, paybackStr: '2 năm 5 tháng' },
];

export function OnGridComboCard({ combo }: { combo: OnGridCombo }) {
  const panelCount = Math.ceil(combo.power * 1000 / 580);

  const specs = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: `Tấm ${combo.panel_brand}`, value: `${panelCount} tấm · ${combo.power} kWp` },
    { icon: <Zap className="w-3.5 h-3.5 text-orange-500" />, label: `Biến tần ${combo.inverter_brand}`, value: `${combo.power} kW` },
    { icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />, label: 'Sản lượng/tháng', value: `${combo.productionMin}–${combo.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />, label: 'Hoàn vốn', value: combo.paybackStr },
    { icon: <Home className="w-3.5 h-3.5 text-gray-400" />, label: 'Diện tích lắp đặt', value: `${Math.ceil(combo.power * 4.32)} m²` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Gradient header - orange for on-grid */}
      <div className="px-4 pt-4 pb-3" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)' }}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: 'rgba(234,88,12,0.1)', color: '#ea580c' }}>
          <Sun className="w-3 h-3" />
          Hệ On-Grid
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
          className="flex-1 h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
        >
          <Phone className="w-4 h-4" /> Xem chi tiết
        </a>
      </div>
    </div>
  );
}

export function OnGridComboGrid() {
  const combos = FALLBACK_ONGRID_COMBOS;
  const phase1 = combos.filter(c => c.phase === '1-phase');
  const phase3 = combos.filter(c => c.phase === '3-phase');

  return (
    <div className="space-y-10">
      {phase1.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" aria-hidden="true" />
            On-Grid 1 Pha — Gia đình
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase1.map(combo => (
              <OnGridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      )}
      {phase3.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" aria-hidden="true" />
            On-Grid 3 Pha — Doanh nghiệp & Nhà xưởng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phase3.map(combo => (
              <OnGridComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
