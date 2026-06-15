import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Zap, TrendingUp, Battery, Layers, Cable, Shield, Plug, X, SlidersHorizontal } from 'lucide-react';
import type { Device, EquipmentCategory } from '../../lib/types';

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  group?: string;
}> = {
  // Nhóm Tấm mô-đun quang điện
  panel: {
    label: 'Tấm mô-đun quang điện',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  
  // Nhóm Biến tần / Inverter
  'hybrid-inverter': {
    label: 'Biến tần / Inverter',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    group: 'inverter',
  },
  'on-grid-inverter': {
    label: 'Biến tần / Inverter',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    group: 'inverter',
  },
  
  // Nhóm Pin lưu trữ
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  
  // Nhóm Phụ kiện lắp đặt
  mounting: {
    label: 'Phụ kiện lắp đặt',
    icon: <Layers className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  accessories: {
    label: 'Phụ kiện lắp đặt',
    icon: <Shield className="h-5 w-5" />,
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
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});
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

  const toggleBrand = (brand: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  useMemo(() => {
    if (brands.length > 0 && Object.keys(expandedBrands).length === 0) {
      const initial: Record<string, boolean> = {};
      brands.forEach(b => initial[b] = true);
      setExpandedBrands(initial);
    }
  }, [brands]);

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <h3 className="font-bold text-gray-900 text-sm">Bộ lọc tìm kiếm</h3>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm thiết bị..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
            className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-white"
          >
            <option value="az">Tên A-Z</option>
            <option value="za">Tên Z-A</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

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
              {brands.map((brand) => {
                const brandDevices = devicesByBrand[brand] || [];
                const isExpanded = expandedBrands[brand];
                const isSelected = selectedBrand === brand;
                return (
                  <div key={brand} className="mb-1">
                    <button
                      onClick={() => {
                        toggleBrand(brand);
                        onSelectBrand(brand);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        isSelected ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isSelected ? 'bg-[#F97316]' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm font-medium truncate">{brand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{brandDevices.length}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="ml-5 mt-1 space-y-1">
                        {brandDevices.slice(0, 5).map((device) => (
                          <button
                            key={device.id}
                            onClick={() => onShowDevice(device.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:text-[#F97316] hover:bg-orange-50 rounded transition-colors truncate"
                          >
                            {device.model}
                          </button>
                        ))}
                        {brandDevices.length > 5 && (
                          <p className="px-3 py-1 text-xs text-gray-400">
                            +{brandDevices.length - 5} sản phẩm khác
                          </p>
                        )}
                      </div>
                    )}
                  </div>
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
