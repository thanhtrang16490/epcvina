import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, Home, Building2, CheckCircle2,
  RefreshCw, ChevronDown, Battery, Sun, TrendingUp,
  Sparkles, ArrowRight, BarChart3, Cpu, Info,
  Phone, Calendar, Star, Leaf, ChevronRight,
} from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SliderInputProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  ticks: { value: number; label: string }[];
  unit?: string;
}

interface SelectInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

interface SolutionCard {
  rank: number;
  name: string;
  power: number;           // kWp
  type: 'hybrid' | 'on-grid';
  systemTypeKey: string;   // matches systemTypes.value
  match: number;           // 0-100
  badge?: string;
  battery?: string;        // e.g. '10.24 kWh'
  hasBackup: boolean;
  productionMin: number;   // kWh/month
  productionMax: number;   // kWh/month
  production: number;      // mid-point for display
  savings: number;         // VND/month (estimated)
  paybackStr: string;      // e.g. '4 năm 3 tháng'
  payback: number;         // years (decimal)
  investment: number;      // M VND
  roofArea?: number;       // m² required
  color: string;
}

// ─────────────────────────────────────────────
// Slider Input
// ─────────────────────────────────────────────
function SliderInput({ label, icon, value, min, max, step, onChange, format, ticks, unit }: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="w-8 h-8 rounded-lg bg-[#FFF4E8] flex items-center justify-center text-[#F5831F] flex-shrink-0">
            {icon}
          </span>
          {label}
          <Info className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <span className="text-sm font-bold text-blue-600">
          {format(value)}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${pct}%, #e2e8f0 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        {ticks.map(t => (
          <span key={t.value}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Select Input
// ─────────────────────────────────────────────
function SelectInput({ label, icon, value, options, onChange }: SelectInputProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0">
        <span className="w-8 h-8 rounded-lg bg-[#FFF4E8] flex items-center justify-center text-[#F5831F] flex-shrink-0">
          {icon}
        </span>
        {label}
        <Info className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="appearance-none text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 w-full max-w-[200px]"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────
// Recommendation Card (clickable)
// ─────────────────────────────────────────────
function RecommendationCard({ sol, index, isSelected, onSelect }: {
  sol: SolutionCard;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isHybrid = sol.type === 'hybrid';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onSelect}
      className={`group rounded-xl border transition-all duration-200 ease-in-out cursor-pointer overflow-hidden motion-reduce:transition-none motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-[#D0202A] focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-[#D0202A] bg-red-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-[#D0202A]/40 hover:shadow-md'
      }`}
    >
      {/* Color bar top */}
      <div
        className="h-0.5 w-full"
        style={{ background: isHybrid ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' : 'linear-gradient(90deg,#D0202A,#F5831F)' }}
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
                  color: isHybrid ? '#1d4ed8' : '#D0202A',
                }}
              >
                {isHybrid ? <Zap className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                {isHybrid ? 'Hybrid' : 'On-Grid'}
              </span>
              {sol.battery && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                  <Battery className="w-3 h-3" />{sol.battery}
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
              {m.sub && <p className="text-[9px] text-[#D0202A] font-medium leading-none mt-0.5">{m.sub}</p>}
              <p className="text-[9px] text-gray-400 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Selected Solution Detail Panel (Column 3)
// ─────────────────────────────────────────────
function SolutionDetailPanel({ sol }: { sol: SolutionCard }) {
  const isHybrid = sol.type === 'hybrid';
  const panelBrand = 'Aiko';
  const inverterBrand = 'SAJ';
  const batteryBrand = isHybrid ? 'Genxgreen' : null;
  const panelCount = Math.ceil(sol.power * 1000 / 580);

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,     label: `Tấm ${panelBrand}`,          value: `${panelCount} tấm · ${sol.power} kWp` },
    { icon: <Zap className="w-3.5 h-3.5 text-blue-500" />,      label: `Biến tần ${inverterBrand}`,   value: `${sol.power} kW` },
    ...(sol.battery && batteryBrand
      ? [{ icon: <Battery className="w-3.5 h-3.5 text-indigo-500" />, label: `Lưu trữ ${batteryBrand}`, value: sol.battery }]
      : []),
    { icon: <BarChart3 className="w-3.5 h-3.5 text-[#D0202A]" />, label: 'Sản lượng/tháng',           value: `${sol.productionMin}–${sol.productionMax} kWh` },
    { icon: <Calendar className="w-3.5 h-3.5 text-[#D0202A]" />,  label: 'Hoàn vốn',                  value: sol.paybackStr },
    ...(sol.roofArea
      ? [{ icon: <Home className="w-3.5 h-3.5 text-gray-400" />,  label: 'Diện tích lắp đặt',          value: `${sol.roofArea} m²` }]
      : []),
  ];

  return (
    <motion.div
      key={sol.name}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="h-full flex flex-col"
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
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
              color: isHybrid ? '#1d4ed8' : '#D0202A',
            }}
          >
            {isHybrid ? <Zap className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            {isHybrid ? 'Hệ Hybrid' : 'Hệ On-Grid'}
          </span>
          {/* Name */}
          <h3 className="text-[17px] font-bold text-[#0F172A] leading-snug">{sol.name}</h3>
          {/* Brand strip */}
          <p className="text-[12px] text-gray-500 mt-1">
            {[panelBrand, inverterBrand, batteryBrand].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Product image — 16:9 aspect */}
        <div className="relative mx-4 mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img src="/sample-combo.jpg" alt={sol.name} className="w-full h-full object-cover" />
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
            <p className="text-[20px] font-extrabold text-[#D0202A] leading-tight mt-0.5">{sol.power} <span className="text-[13px] font-semibold text-gray-500">kWp</span></p>
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
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          href="/lien-he"
          className="flex-1 h-11 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 ease-in-out shadow-sm focus-visible:ring-2 focus-visible:ring-[#D0202A] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
          style={{ background: 'linear-gradient(135deg,#D0202A 0%,#F5831F 100%)' }}
        >
          <Phone className="w-4 h-4" /> Xem chi tiết
        </motion.a>
      </div>
    </motion.div>
  );
}



// ─────────────────────────────────────────────
// System type options
// ─────────────────────────────────────────────
const systemTypes = [
  { value: 'on-grid-1p',   label: 'On-Grid',  sub: '1 pha',               type: 'on-grid' as const },
  { value: 'on-grid-3p',   label: 'On-Grid',  sub: '3 pha',               type: 'on-grid' as const },
  { value: 'hybrid-1p',    label: 'Hybrid',   sub: '1 pha',               type: 'hybrid'  as const },
  { value: 'hybrid-3p-lv', label: 'Hybrid',   sub: '3 pha \u00b7 Pin áp thấp', type: 'hybrid'  as const },
  { value: 'hybrid-3p-hv', label: 'Hybrid',   sub: '3 pha \u00b7 Pin áp cao',  type: 'hybrid'  as const },
];

// ── Toggle row ──
function ToggleRow({
  label, options, value, onChange, accentBlue = false,
}: {
  label: string;
  options: { value: string; label: string; sub?: string }[];
  value: string | null;
  onChange: (v: string) => void;
  accentBlue?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="space-y-1.5"
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
        {options.map(opt => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? accentBlue
                    ? 'bg-[#4A4F56] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{opt.label}</span>
              {opt.sub && (
                <span className={`text-[10px] font-normal mt-0.5 ${
                  isActive ? (accentBlue ? 'text-blue-100' : 'text-gray-500') : 'text-gray-400'
                }`}>{opt.sub}</span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Cascading system type selector ──
function SystemTypeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Derive sub-state from value string
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
      {/* Label */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="w-8 h-8 rounded-lg bg-[#FFF4E8] flex items-center justify-center text-[#F5831F] flex-shrink-0">
          <Zap className="w-4 h-4" />
        </span>
        Loại hệ thống mong muốn
      </div>

      {/* Step 1: Hybrid vs On-Grid */}
      <ToggleRow
        label="Hệ"
        value={kind}
        onChange={handleKind}
        options={[
          { value: 'hybrid',   label: '⚡ Hybrid',   sub: 'Lưu trữ + dự phòng' },
          { value: 'on-grid',  label: '☀️ On-Grid',  sub: 'Nối lưới trực tiếp' },
        ]}
        accentBlue={kind === 'hybrid'}
      />

      {/* Step 2: Phase — appears after kind chosen */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Step 3: Battery voltage — only for Hybrid 3-phase */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Combo Catalog (from slmsolar.com, excluding Huawei)
// ─────────────────────────────────────────────
interface ComboCatalog {
  id: string;
  name: string;
  systemTypeKey: string;  // matches systemTypes.value
  type: 'hybrid' | 'on-grid';
  power: number;          // kWp
  battery?: number;       // kWh (undefined for on-grid)
  investment: number;     // M VND
  productionMin: number;  // kWh/month
  productionMax: number;  // kWh/month
  paybackStr: string;     // human-readable
  paybackYears: number;   // decimal years
  roofArea?: number;      // m²
}

function parsePayback(s: string): number {
  // '4n3t' => 4 + 3/12 = 4.25
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
// Convert a ComboCatalog entry to SolutionCard
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
// Filter + sort entire catalog for Column 2
// ─────────────────────────────────────────────
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

  // Allowed systemTypeKeys from buildingType (empty = all)
  const allowedKeys = BUILDING_ALLOWED[buildingType] ?? [];

  const filtered = COMBO_CATALOG.filter(c => {
    // 1. Explicit system type selector wins over everything
    if (systemType && c.systemTypeKey !== systemType) return false;
    // 2. Building type restricts eligible system keys (only when no explicit systemType)
    if (!systemType && allowedKeys.length > 0 && !allowedKeys.includes(c.systemTypeKey)) return false;
    // 3. Main goal: 'backup' requires hybrid (battery-backed)
    if (mainGoal === 'backup' && c.type !== 'hybrid') return false;
    // 4. Main goal: 'save' requires on-grid (no battery overhead cost)
    if (mainGoal === 'save' && c.type !== 'on-grid') return false;
    // 5. Roof area ceiling
    if (roofArea > 0 && c.roofArea && c.roofArea > roofArea) return false;
    // 6. Budget ceiling (+15% tolerance)
    if (budgetM > 0 && c.investment > budgetM * 1.15) return false;
    return true;
  });

  // Sort by match score desc (bill-based), then by investment asc as tie-breaker
  const scored = filtered.map(c => ({ c, score: scoreCombo(c, kwhNeed, budgetM) }));
  scored.sort((a, b) => b.score - a.score || a.c.investment - b.c.investment);

  return scored.map(({ c }, i) => catalogToCard(c, i + 1, kwhNeed, budgetM));
}

function scoreCombo(c: ComboCatalog, kwhNeed: number, budgetM: number): number {
  if (kwhNeed <= 0) return 100 - c.investment / 1000; // show cheapest first when no bill
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

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function SolarSolutionFinder() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [bill, setBill] = useState(0);
  const [roofArea, setRoofArea] = useState(0);
  const [budget, setBudget] = useState(0);
  const [buildingType, setBuildingType] = useState('');
  const [mainGoal, setMainGoal] = useState('both');
  const [systemType, setSystemType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Column 2: reactive — recompute whenever any filter changes
  const solutions = useMemo(
    () => filterCombos(bill, roofArea, budget, systemType, buildingType, mainGoal),
    [bill, roofArea, budget, systemType, buildingType, mainGoal],
  );

  // Auto-select first combo on initial load only.
  // On subsequent filter changes: keep current selection if it still exists,
  // otherwise fall back to the first item.
  const prevSolutionsRef = useRef<SolutionCard[]>([]);
  useEffect(() => {
    const prev = prevSolutionsRef.current;
    prevSolutionsRef.current = solutions;

    if (prev.length === 0) {
      // First load — select first item
      setSelectedIndex(solutions.length > 0 ? 0 : null);
      return;
    }

    // Filter changed: if current selection is still in the new list, keep it
    setSelectedIndex(idx => {
      if (solutions.length === 0) return null;
      if (idx !== null && solutions[idx] !== undefined) return idx;
      return 0; // selection fell off end of shorter list
    });
  }, [solutions]);

  const handleReset = () => {
    setBill(0);
    setRoofArea(0);
    setBudget(0);
    setSystemType('');
    setBuildingType('');
    setMainGoal('both');
    // Reset the ref so the useEffect treats the next render as a fresh load
    // and auto-selects the first combo
    prevSolutionsRef.current = [];
  };

  const selectedSol = selectedIndex !== null ? solutions[selectedIndex] : null;

  return (
    <section
      ref={sectionRef}
      className={`w-full py-10 md:py-16 px-3 sm:px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} transition-all duration-600 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none`}
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)' }}
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ─── Header ─── */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-3"
          >
            TƯ VẤN GIẢI PHÁP ĐIỆN MẶT TRỜI
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-3 leading-tight"
          >
            Hệ Thống Nào{' '}
            <span style={{ color: '#f59e0b' }}>Phù Hợp Với Bạn?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto"
          >
            Chỉ cần nhập thông tin cơ bản, EPCVINA Solar sẽ đề xuất giải pháp phù hợp nhất
            dựa trên nhu cầu sử dụng thực tế của bạn.
          </motion.p>

       
        </div>

        {/* ─── MOBILE: Detail panel only ─── */}
        <div className="lg:hidden">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              {solutions[selectedIndex ?? -1] ? (
                <SolutionDetailPanel
                  key={solutions[selectedIndex ?? 0].name + '-mobile'}
                  sol={solutions[selectedIndex ?? 0]}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-gray-200" />
                  <p className="text-sm">Nhập thông số để xem đề xuất</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── DESKTOP: 3-column grid ─── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1fr] gap-4 md:gap-5" style={{ height: '720px' }}>

          {/* ── LEFT: Calculator Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full"
          >
            {/* Card header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F5831F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Thông Tin Công Trình</p>
                  <p className="text-[11px] text-gray-500">Điều chỉnh các thông số phù hợp với nhu cầu của bạn</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              {/* System type selector */}
              <SystemTypeSelector value={systemType} onChange={setSystemType} />

              <SliderInput
                label="Hóa đơn điện hàng tháng"
                icon={<Building2 className="w-4 h-4" />}
                value={bill}
                min={0} max={100000000} step={500000}
                onChange={setBill}
                format={v => v === 0 ? 'Không lọc' : (v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(/\.0$/, '')},000,000` : v.toLocaleString())}
                unit={bill === 0 ? '' : 'VND'}
                ticks={[
                  { value: 0, label: 'Tất cả' }, { value: 2000000, label: '2M' },
                  { value: 5000000, label: '5M' }, { value: 10000000, label: '10M' },
                  { value: 20000000, label: '20M' }, { value: 50000000, label: '50M' },
                  { value: 100000000, label: '100M' },
                ]}
              />

              <SliderInput
                label="Diện tích mái có sẵn"
                icon={<Home className="w-4 h-4" />}
                value={roofArea}
                min={0} max={500} step={5}
                onChange={setRoofArea}
                format={v => v === 0 ? 'Không lọc' : String(v)}
                unit={roofArea === 0 ? '' : 'm²'}
                ticks={[
                  { value: 0, label: 'Tất cả' }, { value: 40, label: '40m²' },
                  { value: 80, label: '80m²' }, { value: 150, label: '150m²' },
                  { value: 200, label: '200m²' }, { value: 500, label: '500m²' },
                ]}
              />

              <SliderInput
                label="Ngân sách đầu tư"
                icon={<TrendingUp className="w-4 h-4" />}
                value={budget}
                min={0} max={2000000000} step={5000000}
                onChange={setBudget}
                format={v => v === 0 ? 'Không lọc' : `${(v / 1000000).toFixed(0)},000,000`}
                unit={budget === 0 ? '' : 'VND'}
                ticks={[
                  { value: 0, label: 'Tất cả' }, { value: 100000000, label: '100M' },
                  { value: 200000000, label: '200M' }, { value: 400000000, label: '400M' },
                  { value: 800000000, label: '800M' }, { value: 2000000000, label: '2B' },
                ]}
              />


            </div>

            {/* CTAs */}
            <div className="px-5 pb-5 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Đặt lại
              </motion.button>
            </div>
          </motion.div>

          {/* ── CENTER: Recommendations ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full"
          >
            <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F5831F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Giải Pháp Phù Hợp Với Bạn</p>
                  <p className="text-[11px] text-gray-500 hidden lg:block">Chọn một để xem chi tiết ở cột bên phải</p>
                              <p className="text-[11px] text-gray-500 lg:hidden">Chọn một để xem chi tiết bên dưới</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <AnimatePresence>
                {solutions.map((sol: SolutionCard, i: number) => (
                  <RecommendationCard
                    key={sol.name + i}
                    sol={sol}
                    index={i}
                    isSelected={selectedIndex === i}
                    onSelect={() => {
                      setSelectedIndex(i);
                      if (window.innerWidth < 1024 && detailRef.current) {
                        setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
              {solutions.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Không có combo phù hợp với bộ lọc hiện tại
                </div>
              )}
            </div>

            <div className="px-5 pb-5">
              <a href="/solar-home" className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-all">
                Xem tất cả giải pháp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT: Selected Detail ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full"
            ref={detailRef}
            id="solution-detail-panel"
          >
            <AnimatePresence mode="wait">
              {selectedSol ? (
                <SolutionDetailPanel
                  key={selectedSol.name}
                  sol={selectedSol}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mb-3 text-gray-200" />
                  <p className="text-sm">Chọn một giải pháp để xem chi tiết</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>

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
    </section>
  );
}
