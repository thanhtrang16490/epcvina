import { Eye } from '@phosphor-icons/react';
import Image from '../ui/Image';

const DEFAULT_COMBO_IMAGE = '/sample-combo.jpg';

export interface ComboCardData {
  id: string;
  slug: string;
  name: string;
  power: number;
  battery: number;
  price: number;
  system_type: 'on-grid' | 'hybrid';
  phase: string;
  panel_brand?: string;
  inverter_brand?: string;
  inverter_model?: string;
  battery_brand?: string;
  battery_model?: string;
  panel_count?: number;
  inverter_count?: number;
  battery_count?: number;
  panel_warranty?: number;
  inverter_warranty?: number;
  battery_warranty?: number;
  raw?: Record<string, unknown>;
  monthly_production?: number;
  payback_period?: number;
  installation_area?: number;
  image?: string;
  is_popular?: boolean;
  voltage?: 'low' | 'high';
}

interface ComboListingCardProps {
  combo: ComboCardData;
  basePath: string; // '/goi-combo'
  onQuickView?: (combo: ComboCardData) => void;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

export default function ComboListingCard({ combo, basePath, onQuickView }: ComboListingCardProps) {
  const monthlyProduction = combo.monthly_production || Math.round(combo.power * 4 * 30);
  const paybackPeriod = combo.payback_period || (combo.price > 0 ? Math.round((combo.price / (monthlyProduction * 3500 * 12)) * 10) / 10 : 0);
  const area = combo.installation_area || Math.round(combo.power * 4.3);

  // Build brands string
  const brands = [
    combo.panel_brand || 'Aiko',
    combo.inverter_brand || (combo.system_type === 'hybrid' ? 'SAJ' : 'Auxsol'),
    combo.system_type === 'hybrid' ? (combo.battery_brand || 'Genxgreen') : null,
  ].filter(Boolean).join(' - ');

  const paybackYears = Math.floor(paybackPeriod);
  const paybackMonths = Math.round((paybackPeriod - paybackYears) * 12);
  const paybackLabel = paybackMonths > 0 
    ? `${paybackYears} năm ${paybackMonths} tháng` 
    : `${paybackYears} năm`;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-orange-300 hover:-translate-y-2 flex flex-col">
      {/* Product image */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={combo.image?.trim() ? combo.image : DEFAULT_COMBO_IMAGE}
          alt={combo.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {/* System type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
            combo.system_type === 'hybrid'
              ? 'bg-blue-500/90 text-white'
              : 'bg-orange-500/90 text-white'
          }`}>
            {combo.system_type === 'hybrid' ? 'Hybrid' : 'On-Grid'}
          </span>
        </div>
        {/* Popular badge */}
        {combo.is_popular && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Bán chạy
            </span>
          </div>
        )}
        {/* Hover overlay with eye icon for quick view */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(combo);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white hover:scale-110 transform transition-all duration-200 cursor-pointer shadow-lg"
            aria-label={`Xem nhanh ${combo.name}`}
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Combo Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <a href={`${basePath}/${combo.slug}`} className="block">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-orange-600 transition-colors duration-300">
              {combo.name}
            </h3>
            {combo.voltage && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                combo.voltage === 'low' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {combo.voltage === 'low' ? 'AT' : 'AC'}
              </span>
            )}
          </div>
        </a>
        <p className="text-xs text-gray-500">{brands}</p>

        {/* Specs */}
        <div className="space-y-1.5 text-xs text-gray-600 flex-1">
          <div className="flex justify-between">
            <span>{combo.panel_brand || 'Aiko'}:</span>
            <span className="font-medium text-gray-900">{combo.power} kWp</span>
          </div>
          <div className="flex justify-between">
            <span>Biến tần:</span>
            <span className="font-medium text-gray-900">{combo.inverter_brand || (combo.system_type === 'hybrid' ? 'SAJ' : 'Auxsol')} {combo.power} kW</span>
          </div>
          {combo.system_type === 'hybrid' && combo.battery > 0 && (
            <div className="flex justify-between">
              <span>Lưu trữ:</span>
              <span className="font-medium text-gray-900">{combo.battery} kWh</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Sản lượng:</span>
            <span className="font-medium text-gray-900">{monthlyProduction} kWh/tháng</span>
          </div>
          <div className="flex justify-between">
            <span>Hoàn vốn:</span>
            <span className="font-medium text-gray-900">{paybackLabel}</span>
          </div>
          <div className="flex justify-between">
            <span>Diện tích:</span>
            <span className="font-medium text-gray-900">{area} m²</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Giá niêm yết</p>
          <p className="text-lg font-bold text-orange-600">{formatVND(combo.price)}</p>
        </div>
      </div>
    </div>
  );
}
