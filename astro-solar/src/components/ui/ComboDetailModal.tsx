

import { useState } from 'react';
import { 
  Sun,
  Battery,
  X,
  ChevronRight,
  Zap,
  TrendingUp,
  Shield,
  Wrench,
  Layers,
  Plug,
  Cable,
  Gauge,
} from 'lucide-react';
import Image from './Image';
import type { Device, EquipmentCategory } from '../../lib/types';
import DevicePlaceholder from './DevicePlaceholder';
import ComboPlaceholder from './ComboPlaceholder';

// Category metadata
const CATEGORY_META: Record<EquipmentCategory, {
  label: string;
  viLabel: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
  border: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    viLabel: 'Tấm pin PV',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    border: 'border-blue-200',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    viLabel: 'Inverter DC-AC',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    border: 'border-orange-200',
  },
  battery: {
    label: 'Pin lưu trữ',
    viLabel: 'Pin lưu trữ',
    icon: <Battery className="h-4 w-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    border: 'border-green-200',
  },
  meter: {
    label: 'Đồng hồ đo',
    viLabel: 'Đồng hồ đo điện',
    icon: <Gauge className="h-4 w-4" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    border: 'border-indigo-200',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    viLabel: 'Hệ khung nhôm',
    icon: <Layers className="h-4 w-4" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    border: 'border-purple-200',
  },
  wiring: {
    label: 'Hệ dây điện',
    viLabel: 'Dây điện DC-AC',
    icon: <Cable className="h-4 w-4" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
    gradient: 'from-gray-400 to-gray-600',
    border: 'border-gray-200',
  },
  cabinet: {
    label: 'Tủ điện',
    viLabel: 'Tủ điện NLMT',
    icon: <Plug className="h-4 w-4" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    border: 'border-red-200',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    viLabel: 'Hệ tiếp địa',
    icon: <Shield className="h-4 w-4" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    accent: 'bg-teal-500',
    gradient: 'from-teal-400 to-teal-600',
    border: 'border-teal-200',
  },
  installation: {
    label: 'Nhân công lắp đặt',
    viLabel: 'Nhân công lắp đặt',
    icon: <Wrench className="h-4 w-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
    border: 'border-amber-200',
  },
};

const MAIN_ORDER: EquipmentCategory[] = ['panel', 'inverter', 'battery', 'meter'];
const ACCESSORY_ORDER: EquipmentCategory[] = ['mounting', 'wiring', 'cabinet', 'grounding', 'installation'];

function formatVND(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + ' tỷ';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + ' triệu';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 gap-3">
      <p className="text-sm text-gray-500 flex-shrink-0 max-w-[40%]">{label}</p>
      <p className={`text-sm font-semibold text-right break-words min-w-0 ${highlight ? 'text-[#1a73e8]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

// Quantity stepper component
function QuantityStepper({
  deviceId,
  quantity,
  originalQuantity,
  unit,
  onDecrement,
  onIncrement,
}: {
  deviceId: string;
  quantity: number;
  originalQuantity: number;
  unit: string;
  onDecrement: (id: string) => void;
  onIncrement: (id: string) => void;
}) {
  const isModified = quantity !== originalQuantity;
  return (
    <div className={`flex items-center gap-0.5 ${isModified ? 'ring-1 ring-blue-400 rounded-lg px-0.5' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onDecrement(deviceId); }}
        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex-shrink-0 transition-colors"
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <span className={`text-xs font-semibold min-w-[1.25rem] text-center ${isModified ? 'text-blue-600' : 'text-gray-700'}`}>
        {quantity}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onIncrement(deviceId); }}
        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex-shrink-0 transition-colors"
        aria-label="Tăng số lượng"
      >
        +
      </button>
      <span className="text-[10px] text-gray-500 ml-0.5 flex-shrink-0">{unit}</span>
    </div>
  );
}

// Category section with all sub-items in table layout
function CategorySection({ 
  category, 
  devices, 
  onDeviceClick,
  isMain,
  quantityOverrides,
  onQuantityChange,
}: { 
  category: EquipmentCategory; 
  devices: Device[]; 
  onDeviceClick?: (device: Device) => void;
  isMain?: boolean;
  quantityOverrides: Record<string, number>;
  onQuantityChange: (deviceId: string, delta: number) => void;
}) {
  const meta = CATEGORY_META[category];
  const subtotal = devices.reduce((sum, d) => {
    const qty = quantityOverrides[d.id] ?? d.quantity;
    return sum + (d.price || 0) * qty;
  }, 0);
  const hasPrice = devices.some(d => d.price && d.price > 0);

  return (
    <div className={`rounded-xl border ${meta.border} overflow-hidden`}>
      {/* Category Header */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 ${meta.bg} gap-2 min-w-0`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink">
          <span className={`flex-shrink-0 ${meta.color}`}>{meta.icon}</span>
          <span className={`text-xs font-semibold ${meta.color} truncate`}>{meta.viLabel}</span>
          <span className="text-[10px] text-gray-500 flex-shrink-0">({devices.length})</span>
        </div>
        {hasPrice && subtotal > 0 && (
          <span className={`text-[10px] font-bold ${meta.color} flex-shrink-0 whitespace-nowrap`}>{formatVND(subtotal)}</span>
        )}
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100 bg-white">
        {devices.map((device) => {
          const qty = quantityOverrides[device.id] ?? device.quantity;
          const lineTotal = (device.price || 0) * qty;
          const isClickable = isMain && onDeviceClick;
          return (
            <div
              key={device.id}
              className={`px-2.5 py-2 ${isClickable ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''}`}
              onClick={isClickable ? () => onDeviceClick!(device) : undefined}
            >
              <div className="flex items-start gap-1.5 min-w-0">
                {/* Thumbnail (main items only) */}
                {isMain && (
                  <div className={`w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 ${meta.bg} flex items-center justify-center ${meta.color}`}>
                    {device.images?.[0] ? (
                      <Image
                        src={device.images[0]}
                        alt={device.model}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="scale-75">{meta.icon}</span>
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2 break-words">{device.model}</p>
                  {device.brand && (
                    <p className="text-[10px] text-gray-500 truncate">{device.brand}</p>
                  )}
                </div>
                {isClickable && (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
              </div>

              {/* Price row */}
              <div
                className="flex items-center justify-between mt-1 gap-1 min-w-0"
                style={{ paddingLeft: isMain ? '2rem' : '0' }}
              >
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <QuantityStepper
                    deviceId={device.id}
                    quantity={qty}
                    originalQuantity={device.quantity}
                    unit={device.unit}
                    onDecrement={(id) => onQuantityChange(id, -1)}
                    onIncrement={(id) => onQuantityChange(id, 1)}
                  />
                  {device.price && device.price > 0 ? (
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">× {formatVND(device.price)}</span>
                  ) : null}
                </div>
                {lineTotal > 0 && (
                  <span className="text-[10px] font-bold text-gray-800 flex-shrink-0 whitespace-nowrap">{formatVND(lineTotal)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ComboDetailModalProps {
  combo: any;
  onClose: () => void;
  onDeviceClick?: (device: Device) => void;
  onDeviceSelect?: (category: string) => void;
}

export default function ComboDetailModal({ combo, onClose, onDeviceClick, onDeviceSelect }: ComboDetailModalProps) {
  const [modalDevice, setModalDevice] = useState<Device | null>(null);
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({});

  const handleQuantityChange = (deviceId: string, delta: number) => {
    setQuantityOverrides(prev => {
      const equipment: Device[] = combo.equipment || [];
      const device = equipment.find((d: Device) => d.id === deviceId);
      const current = prev[deviceId] ?? (device?.quantity || 1);
      const next = Math.max(1, current + delta);
      return { ...prev, [deviceId]: next };
    });
  };

  const handleDeviceClick = (device: Device) => {
    if (onDeviceSelect) {
      onDeviceSelect(device.category);
    } else if (onDeviceClick) {
      onDeviceClick(device);
    } else {
      setModalDevice(device);
    }
  };

  const equipment: Device[] = combo.equipment || [];

  // Compute grand total from equipment prices
  const grandTotal = equipment.reduce((sum: number, d: Device) => {
    const qty = quantityOverrides[d.id] ?? d.quantity;
    return sum + (d.price || 0) * qty;
  }, 0);
  const hasDetailedPrices = equipment.some((d: Device) => d.price && d.price > 0);

  // Panel count derived from equipment when combo.panelCount is 0
  const panelCount = combo.panelCount ||
    equipment.filter((d: Device) => d.category === 'panel').reduce((s: number, d: Device) => s + d.quantity, 0);

  const isCalc = combo.statsCalculated;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-12 bottom-8 z-50 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
        {/* Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${combo.systemType === 'hybrid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'} flex items-center justify-center`}>
              {combo.systemType === 'hybrid' ? <Battery className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate">{combo.name}</p>
              <p className="text-xs text-gray-500 truncate">{combo.capacityKw || combo.capacity} kWp • {combo.category === 'residential' ? 'Gia đình' : 'Công nghiệp'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Card - ComboPlaceholder */}
          <div className="bg-white rounded-2xl border-b border-gray-100">
            <ComboPlaceholder 
              systemName={combo.name}
              phase={combo.phase as '1-phase' | '3-phase'}
              panelCount={combo.panelCount}
              panelBrand={combo.panelBrand}
              inverterCount={combo.inverterCount}
              inverterBrand={combo.inverterBrand}
              hasBattery={combo.systemType === 'hybrid' && !!combo.batteryCapacity}
            />
            {/* Overlay info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      combo.systemType === 'hybrid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                    }`}>
                      Combo {combo.systemType === 'hybrid' ? 'Hy-Brid' : 'On-Grid'}
                    </span>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                      {combo.phase === '1-phase' ? '1 pha' : '3 pha'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{combo.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Tổng chi phí</p>
                  <p className="text-lg font-bold text-[#1a73e8] whitespace-nowrap">{(combo.price / 1000000).toLocaleString('vi-VN')} triệu</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Specifications — matches SystemInfoCard layout */}
          <div className="p-3 lg:p-4">
            <h4 className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Thông số hệ thống</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Công suất',       value: combo.capacityKw || combo.capacity,                          unit: 'kWp' },
                { label: 'Sản lượng/ngày',  value: combo.estimatedOutput ? Math.round((combo.estimatedOutput.monthly.min + combo.estimatedOutput.monthly.max) / 2 / 30) : 0, unit: 'kWh' },
                { label: 'Sản lượng/tháng', value: combo.estimatedOutput ? `${combo.estimatedOutput.monthly.min}–${combo.estimatedOutput.monthly.max}` : 0, unit: 'kWh' },
                { label: 'Tiết kiệm/tháng', value: combo.estimatedSavings ? formatCurrency(Math.round(combo.estimatedSavings.yearly / 12)) : '0', unit: '₫', green: true },
              ].map(({ label, value, unit, green }) => (
                <div key={label} className="p-2 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[9px] text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
                  <p className={`text-sm font-bold ${green ? 'text-green-600' : 'text-gray-900'}`}>
                    {value} <span className="text-[10px] font-normal text-gray-400">{unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Detail - Excel-like layout */}
          <div className="p-3 lg:p-4">
            <h4 className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Thiết bị &amp; phụ kiện</h4>

            {/* All Equipment grouped by category */}
            <div className="space-y-2">
              {MAIN_ORDER.map(cat => {
                const devices = equipment.filter((d: Device) => d.category === cat);
                if (devices.length === 0) return null;
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    devices={devices}
                    onDeviceClick={handleDeviceClick}
                    isMain
                    quantityOverrides={quantityOverrides}
                    onQuantityChange={handleQuantityChange}
                  />
                );
              })}
              {ACCESSORY_ORDER.map(cat => {
                const devices = equipment.filter((d: Device) => d.category === cat);
                if (devices.length === 0) return null;
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    devices={devices}
                    isMain={false}
                    quantityOverrides={quantityOverrides}
                    onQuantityChange={handleQuantityChange}
                  />
                );
              })}
            </div>

            {/* Grand Total */}
            {hasDetailedPrices && grandTotal > 0 && (
              <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-gray-900 rounded-xl">
                <span className="text-xs font-semibold text-gray-300">Tổng giá trị</span>
                <span className="text-sm font-bold text-white">{formatVND(grandTotal)}</span>
              </div>
            )}
          </div>

          {/* Warranty & Features */}
          <div className="p-3 lg:p-4 space-y-5">
            {/* Warranty */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bảo hành</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded-lg overflow-hidden">
                  <p className="text-xs text-gray-500 truncate">Pin</p>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{combo.warranty.panel} năm</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg overflow-hidden">
                  <p className="text-xs text-gray-500 truncate">Inverter</p>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{combo.warranty.inverter} năm</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg overflow-hidden">
                  <p className="text-xs text-gray-500 truncate">Lắp đặt</p>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{combo.warranty.installation} năm</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {combo.features && combo.features.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tính năng nổi bật</h4>
                <ul className="space-y-2">
                  {combo.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Detail Modal */}
      {modalDevice && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={() => setModalDevice(null)}
          />
          <div className="fixed inset-x-4 top-12 bottom-8 z-[60] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${CATEGORY_META[modalDevice.category]?.bg || 'bg-gray-50'} flex items-center justify-center ${CATEGORY_META[modalDevice.category]?.color || 'text-gray-600'}`}>
                  {CATEGORY_META[modalDevice.category]?.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{CATEGORY_META[modalDevice.category]?.label}</p>
                  <p className="text-xs text-gray-500 truncate">{modalDevice.brand}</p>
                </div>
              </div>
              <button
                onClick={() => setModalDevice(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Device Placeholder Image */}
              <DevicePlaceholder device={modalDevice} />

              <div className="p-5 space-y-5">
                {/* Title + Badges */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 break-words">{modalDevice.brand}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 break-words">{modalDevice.model}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${CATEGORY_META[modalDevice.category]?.bg || 'bg-gray-50'} ${CATEGORY_META[modalDevice.category]?.color || 'text-gray-600'}`}>
                      {CATEGORY_META[modalDevice.category]?.label}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                      Chính hãng
                    </span>
                    {modalDevice.warranty > 0 && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        Bảo hành {modalDevice.warranty} năm
                      </span>
                    )}
                    {modalDevice.price && modalDevice.price > 0 && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#1a73e8]/10 text-[#1a73e8]">
                        {formatVND(modalDevice.price)}/{modalDevice.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Technical Specs */}
                {Object.keys(modalDevice.specs).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Thông số kỹ thuật</h4>
                    <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                      {Object.entries(modalDevice.specs).map(([key, val]) => (
                        <SpecRow 
                          key={key} 
                          label={key} 
                          value={String(val)}
                          highlight={key === 'Bảo hành' || key.includes('Công suất') || key.includes('Tổng') || key.includes('Dung lượng')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {modalDevice.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tính năng nổi bật</h4>
                    <ul className="space-y-2">
                      {modalDevice.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${CATEGORY_META[modalDevice.category]?.accent || 'bg-gray-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
