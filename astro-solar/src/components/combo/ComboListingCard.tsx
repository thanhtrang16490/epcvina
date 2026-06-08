import { Sun, Battery, Zap } from 'lucide-react';

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
  battery_brand?: string;
  monthly_production?: number;
  payback_period?: number;
  installation_area?: number;
  image?: string;
  is_popular?: boolean;
  voltage?: 'low' | 'high';
}

interface ComboListingCardProps {
  combo: ComboCardData;
  basePath: string; // '/on-grid' or '/hybrid'
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

export default function ComboListingCard({ combo, basePath }: ComboListingCardProps) {
  const monthlyProduction = combo.monthly_production || Math.round(combo.power * 4 * 30);
  const paybackPeriod = combo.payback_period || (combo.price > 0 ? Math.round((combo.price / (monthlyProduction * 3500 * 12)) * 10) / 10 : 0);
  const area = combo.installation_area || Math.round(combo.power * 4.3);

  // Build brands string
  const brands = [
    combo.panel_brand || 'JA Solar',
    combo.inverter_brand || (combo.system_type === 'hybrid' ? 'Solis' : 'Auxsol'),
    combo.system_type === 'hybrid' ? (combo.battery_brand || 'Dyness') : null,
  ].filter(Boolean).join(' - ');

  const paybackYears = Math.floor(paybackPeriod);
  const paybackMonths = Math.round((paybackPeriod - paybackYears) * 12);
  const paybackLabel = paybackMonths > 0 
    ? `${paybackYears} năm ${paybackMonths} tháng` 
    : `${paybackYears} năm`;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Popular badge */}
      {combo.is_popular && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Bán chạy
          </span>
        </div>
      )}

      {/* Product image area */}
      <div className="relative bg-gray-50 px-4 pt-4 pb-3 flex items-center justify-center gap-3 min-h-[120px]">
        {/* Panel icon */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
            <Sun className="h-7 w-7 text-blue-600" />
          </div>
          <span className="text-[10px] text-gray-500">{Math.ceil(combo.power * 1000 / 580)} tấm</span>
        </div>

        {/* Inverter icon */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
            <Zap className="h-7 w-7 text-orange-600" />
          </div>
          <span className="text-[10px] text-gray-500">Biến tần</span>
        </div>

        {/* Battery icon (hybrid only) */}
        {combo.system_type === 'hybrid' && combo.battery > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <Battery className="h-7 w-7 text-green-600" />
            </div>
            <span className="text-[10px] text-gray-500">{combo.battery} kWh</span>
          </div>
        )}
      </div>

      {/* Title & Brands */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{combo.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{brands}</p>
      </div>

      {/* Price */}
      <div className="px-4 py-2 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Giá niêm yết</p>
        <p className="text-lg font-bold text-red-600 mt-0.5">{formatVND(combo.price)}</p>
      </div>

      {/* Specs */}
      <div className="px-4 py-2 text-xs text-gray-600 space-y-1.5 border-t border-gray-100 flex-1">
        <div className="flex justify-between">
          <span>{combo.panel_brand || 'JA Solar'}:</span>
          <span className="font-medium text-gray-900">{combo.power} kWp</span>
        </div>
        <div className="flex justify-between">
          <span>Biến tần: {combo.inverter_brand || (combo.system_type === 'hybrid' ? 'Solis' : 'Auxsol')}</span>
          <span className="font-medium text-gray-900">{combo.power} kW</span>
        </div>
        {combo.system_type === 'hybrid' && combo.battery > 0 && (
          <div className="flex justify-between">
            <span>Lưu trữ: {combo.battery_brand || 'Dyness'}</span>
            <span className="font-medium text-gray-900">{combo.battery} kWh</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Sản Lượng:</span>
          <span className="font-medium text-gray-900">{monthlyProduction} kWh/tháng</span>
        </div>
        <div className="flex justify-between">
          <span>Hoàn Vốn:</span>
          <span className="font-medium text-gray-900">{paybackLabel}</span>
        </div>
        <div className="flex justify-between">
          <span>Diện tích lắp đặt:</span>
          <span className="font-medium text-gray-900">{area} m²</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-2 flex gap-2">
        <a
          href={`${basePath}/${combo.slug}`}
          className="flex-1 text-center py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Xem chi tiết
        </a>
        <a
          href="tel:0988446113"
          className="flex-1 text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Liên hệ
        </a>
      </div>
    </div>
  );
}
