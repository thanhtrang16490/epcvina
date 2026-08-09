import { useMemo, useState } from 'react';
import { CaretDown, CaretUp, Lightning, TrendUp, BatteryHigh, Shield, Plug, X, SlidersHorizontal, Stack, CableCar, Export } from '@phosphor-icons/react';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { localBrands } from '../../../data/brands';

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  group?: string;
}> = {
  panel: {
    label: 'Tấm mô-đun quang điện',
    icon: <Lightning className="h-5 w-5"/>,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  'on-grid-inverter': {
    label: 'Biến tần On-Grid',
    icon: <TrendUp className="h-5 w-5"/>,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  'hybrid-inverter': {
    label: 'Biến tần Hybrid',
    icon: <TrendUp className="h-5 w-5"/>,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  'lv-battery': {
    label: 'Pin lưu trữ áp thấp',
    icon: <BatteryHigh className="h-5 w-5"/>,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  'hv-battery': {
    label: 'Pin lưu trữ áp cao',
    icon: <BatteryHigh className="h-5 w-5"/>,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Stack className="h-5 w-5"/>,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <CableCar className="h-5 w-5"/>,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Shield className="h-5 w-5"/>,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Plug className="h-5 w-5"/>,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
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
  brand?: string;
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
  brand,
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
  // Map brand name → slug for link generation
  const brandSlugMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const b of localBrands) {
      map[b.name.toLowerCase()] = b.slug;
    }
    return map;
  }, []);

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
                  href={`/thiet-bi/${key}`}
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
              {showBrands ? <CaretUp className="h-4 w-4" /> : <CaretDown className="h-4 w-4" />}
            </button>
          </div>
          {showBrands && (
            <div className="p-3 max-h-96 overflow-y-auto">
              {/* All brands - clear filter */}
              <a
                href={`/thiet-bi/${category}`}
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
                const slug = brandSlugMap[brandName.toLowerCase()];
                const href = slug ? `/nhan-hang/${slug}` : undefined;
                return (
                  <a
                    key={brandName}
                    href={href || '#'}
                    onClick={(e) => {
                      if (!href) {
                        e.preventDefault();
                        onSelectBrand(brandName);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all mb-1 group ${
                      isSelected ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isSelected ? 'bg-[#F97316]' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm font-medium truncate">{brandName}</span>
                      {href && (
                        <Export className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {brandDevices.length}
                    </span>
                  </a>
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
