import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Zap, TrendingUp, Battery, Shield } from 'lucide-react';
import type { Device } from '../../../lib/types';

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  group?: string;
}> = {
  panel: {
    label: 'Tấm mô-đun quang điện',
    icon: <Zap className="h-5 w-5"/>,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  inverter: {
    label: 'Biến tần / Inverter',
    icon: <TrendingUp className="h-5 w-5"/>,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5"/>,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  accessories: {
    label: 'Phụ kiện lắp đặt',
    icon: <Shield className="h-5 w-5"/>,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
};

interface EquipmentSidebarProps {
  category: string;
  devices: Device[]; // Tất cả products (cho category counts)
  categoryDevices?: Device[]; // Products của category hiện tại (cho brands)
  selectedBrand: string;
  searchQuery: string;
  sortBy: 'az' | 'za' | 'price-asc' | 'price-desc';
  onSelectBrand: (brand: string) => void;
  onSelectDevice: (deviceId: string) => void;
  onShowDevice: (deviceId: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'az' | 'za' | 'price-asc' | 'price-desc') => void;
}

export default function EquipmentSidebar({
  category,
  devices,
  categoryDevices,
  selectedBrand,
  searchQuery,
  sortBy,
  onSelectBrand,
  onSelectDevice,
  onShowDevice,
  onSearchChange,
  onSortChange,
}: EquipmentSidebarProps) {
  const [showBrands, setShowBrands] = useState(true);

  // Brands chỉ lấy từ category đang chọn
  const brands = useMemo(() => {
    const sourceDevices = categoryDevices || devices;
    const brandSet = new Set<string>();
    for (const device of sourceDevices) {
      if (device.brand) brandSet.add(device.brand);
    }
    return Array.from(brandSet).sort();
  }, [categoryDevices, devices]);

  const devicesByBrand = useMemo(() => {
    const sourceDevices = categoryDevices || devices;
    const grouped: Record<string, Device[]> = {};
    sourceDevices.forEach(device => {
      if (!grouped[device.brand]) {
        grouped[device.brand] = [];
      }
      grouped[device.brand].push(device);
    });
    return grouped;
  }, [categoryDevices, devices]);

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Category Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Danh mục thiết bị</h3>
          </div>
          <div className="p-3">
            {Object.entries(CATEGORY_META).map(([key, catMeta]) => {
              const isActive = key === category;
              const count = devices.filter(d => d.category === key).length;
              return (
                <a
                  key={key}
                  href={`/equipment/${key}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#F97316] text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : catMeta.bg
                  }`}>
                    <div className={isActive ? 'text-white' : catMeta.color}>
                      {catMeta.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{catMeta.label}</p>
                    <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {count} sản phẩm
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Thương hiệu</h3>
            <button
              onClick={() => setShowBrands(!showBrands)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {showBrands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          {showBrands && (
            <div className="p-3 max-h-96 overflow-y-auto">
              {/* All brands - clear filter */}
              <a
                href={`/equipment/${category}`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all mb-1 ${
                  !selectedBrand ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    !selectedBrand ? 'bg-[#F97316]' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm font-medium truncate">Tất cả</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {(categoryDevices || devices).length}
                </span>
              </a>
              {brands.map((brandName) => {
                const brandDevices = devicesByBrand[brandName] || [];
                const isSelected = selectedBrand === brandName;
                return (
                  <button
                    key={brandName}
                    onClick={() => onSelectBrand(brandName)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all mb-1 ${
                      isSelected ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isSelected ? 'bg-[#F97316]' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm font-medium truncate">{brandName}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {brandDevices.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-5">
          <h3 className="font-bold text-gray-900 mb-3">Thống kê</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng sản phẩm</span>
              <span className="text-lg font-bold text-[#F97316]">{devices.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thương hiệu</span>
              <span className="text-lg font-bold text-[#F97316]">{brands.length}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
