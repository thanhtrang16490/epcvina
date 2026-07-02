import { Info } from '@phosphor-icons/react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface SliderInputProps {
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

export interface SolutionCard {
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
export function SliderInput({ label, icon, value, min, max, step, onChange, format, ticks, unit }: SliderInputProps) {
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
// Toggle Row
// ─────────────────────────────────────────────
export function ToggleRow({
  label, options, value, onChange, accentBlue = false,
}: {
  label: string;
  options: { value: string; label: string; sub?: string }[];
  value: string | null;
  onChange: (v: string) => void;
  accentBlue?: boolean;
}) {
  return (
    <div className="animate-slide-in-down space-y-1.5">
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
    </div>
  );
}
