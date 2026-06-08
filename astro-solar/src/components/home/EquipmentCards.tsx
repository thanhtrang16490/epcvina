

import { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { Zap, TrendingUp, Battery, X, ChevronLeft, ChevronRight, Shield, CheckCircle2, Wrench } from 'lucide-react';
import type { Device, EquipmentCategory } from '../../lib/types';

interface EquipmentCardsProps {
  panelDevice?: Device;
  inverterDevice?: Device;
  batteryDevice?: Device;  // only passed for hybrid systems
  loading: boolean;
  comboPower: number;
}

const CATEGORY_META: Record<EquipmentCategory, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  meter: {
    label: 'Đồng hồ đo',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  installation: {
    label: 'Nhân công lắp đặt',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
};

function GlassCard({ children, className = '', onClick, style }: { children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <div 
      onClick={onClick}
      style={style}
      className={`bg-gray-50/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer hover:bg-gray-100/80 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function formatSpecLabel(key: string): string {
  const labels: Record<string, string> = {
    power: 'Công suất',
    wattage: 'Công suất',
    rated_power: 'Công suất định mức',
    efficiency: 'Hiệu suất',
    capacity: 'Dung lượng',
    voltage: 'Điện áp',
    phase: 'Số pha',
    mppt: 'Số MPPT',
    cell_type: 'Loại cell',
    dimensions: 'Kích thước',
    weight: 'Trọng lượng',
    cycles: 'Chu kỳ sạc',
    cong_suat: 'Công suất',
    dung_luong: 'Dung lượng',
    dien_ap: 'Điện áp',
    hieu_suat: 'Hiệu suất',
    so_pha: 'Số pha',
  };
  return labels[key.toLowerCase()] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getPrioritySpecKeys(category: EquipmentCategory): string[] {
  switch (category) {
    case 'panel':
      return ['Công suất', 'power', 'wattage', 'Hiệu suất', 'efficiency', 'Loại cell', 'cell_type'];
    case 'inverter':
      return ['Công suất', 'power', 'rated_power', 'Số pha', 'phase', 'so_pha', 'MPPT', 'mppt'];
    case 'battery':
      return ['Dung lượng', 'capacity', 'dung_luong', 'Điện áp', 'voltage', 'dien_ap', 'Chu kỳ sạc', 'cycles'];
    default:
      return [];
  }
}

function DeviceModal({ device, isOpen, onClose }: { device: Device | null; isOpen: boolean; onClose: () => void }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setImageIndex(0);
  }, [device]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !device || !mounted) return null;

  const meta = CATEGORY_META[device.category];
  const images = device.images || [];
  const currentImage = images[imageIndex] || device.image_url;
  const hasMultipleImages = images.length > 1;

  const specEntries = Object.entries(device.specs || {});
  const priorityKeys = getPrioritySpecKeys(device.category);
  const prioritySpecs = specEntries.filter(([k]) =>
    priorityKeys.some(pk => k.toLowerCase() === pk.toLowerCase())
  );
  const remainingSpecs = specEntries.filter(([k]) =>
    !priorityKeys.some(pk => k.toLowerCase() === pk.toLowerCase())
  );
  const orderedSpecs = [...prioritySpecs, ...remainingSpecs];

  const totalPrice = device.price ? device.price * device.quantity : null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Section — Image + Identity */}
        <div className={`relative h-56 ${meta.bg} flex items-center justify-center overflow-hidden flex-shrink-0`}>
          {currentImage ? (
            <img
              src={currentImage}
              alt={device.model}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className={`${meta.color} scale-[2]`}>{meta.icon}</span>
          )}

          {/* Left/Right image navigation */}
          {hasMultipleImages && (
            <>
              <button
                onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => setImageIndex(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Brand badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white/90 shadow-sm ${meta.color}`}>
              {device.brand}
            </span>
          </div>

          {/* Category badge — top right */}
          <div className="absolute top-3 right-10">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white/90 shadow-sm text-gray-600">
              {meta.label}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:bg-white shadow-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Section — Details (scrollable) */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Model & Brand header */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{device.model}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{device.brand}</p>
          </div>

          {/* Key Specs */}
          {orderedSpecs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thông số kỹ thuật</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {orderedSpecs.map(([key, value]) => (
                  <div key={key} className="flex justify-between items-baseline py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500 mr-2">{formatSpecLabel(key)}</span>
                    <span className="text-sm font-medium text-gray-900 text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warranty */}
          {device.warranty > 0 && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg px-3 py-2">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Bảo hành: {device.warranty} năm</span>
            </div>
          )}

          {/* Features */}
          {device.features && device.features.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tính năng nổi bật</h4>
              <ul className="space-y-1.5">
                {device.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Số lượng: <span className="font-semibold text-gray-900">{device.quantity} {device.unit}</span></span>
              {device.price && (
                <span>Đơn giá: <span className="font-semibold text-gray-900">{new Intl.NumberFormat('vi-VN').format(device.price)}₫</span></span>
              )}
            </div>
            {totalPrice !== null && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4">
                <p className="text-xs font-medium opacity-80 mb-1">Thành tiền</p>
                <p className="text-2xl font-bold tracking-tight">
                  {new Intl.NumberFormat('vi-VN').format(totalPrice)}₫
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EquipmentCards({ panelDevice, inverterDevice, batteryDevice, loading, comboPower }: EquipmentCardsProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  // Build display array from explicit props
  const displayDevices = [panelDevice, inverterDevice, batteryDevice].filter(Boolean) as Device[];

  if (loading) {
    return (
      <div className="flex gap-4 mt-6 justify-start min-w-max">
        <GlassCard className="p-4 w-56 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tấm quang năng</p>
              <p className="text-sm font-semibold text-gray-900">Đang tải...</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 w-56 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Biến tần</p>
              <p className="text-sm font-semibold text-gray-900">Đang tải...</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 w-56 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Battery className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pin lưu trữ</p>
              <p className="text-sm font-semibold text-gray-900">Đang tải...</p>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  // If no devices, show fallback
  if (displayDevices.length === 0) {
    return (
      <div className="flex gap-4 mt-6 justify-start">
        <GlassCard className="p-4 w-full max-w-sm">
          <p className="text-sm text-gray-500">Không có dữ liệu thiết bị</p>
          <p className="text-xs text-gray-400 mt-1">Vui lòng kiểm tra API</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: horizontal scroll flex (original), Desktop: 3-column grid */}
      <div className="flex gap-3 lg:gap-4 mt-4 lg:mt-6 justify-start lg:grid lg:grid-cols-3 min-w-max lg:min-w-0">
        {displayDevices.map((device: Device, index: number) => {
          const meta = CATEGORY_META[device.category];
          return (
            <GlassCard
              key={device.id}
              className="p-3 lg:p-4 w-48 flex-shrink-0 lg:w-auto lg:flex-shrink-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCardClick(device)}
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={meta.color}>{meta.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] lg:text-xs text-gray-500">{meta.label}</p>
                  <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">{device.brand}</p>
                  <p className="text-[10px] text-gray-400 truncate hidden sm:block">{device.model}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <DeviceModal
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default memo(EquipmentCards);