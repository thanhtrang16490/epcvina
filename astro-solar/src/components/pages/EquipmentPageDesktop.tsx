import { useMemo, useState, useEffect } from 'react';
import { Zap, TrendingUp, Battery, Layers, Cable, Shield, Plug, Wrench, X, Search } from 'lucide-react';
import Image from '../ui/Image';
import DevicePlaceholder from '../ui/DevicePlaceholder';
import type { Device, EquipmentCategory } from '../../lib/types';

// Format currency helper
function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' tỷ';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' triệu';
  if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
  return value.toString();
}

const CATEGORY_META: Record<EquipmentCategory, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Layers className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <Cable className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Plug className="h-5 w-5"/>,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: 'bg-red-500',
  },
  'hybrid-inverter': {
    label: 'Biến tần Hybrid',
    icon: <TrendingUp className="h-5 w-5"/>,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    accent: 'bg-teal-500',
  },
  meter: {
    label: 'Đồng hồ đo',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
  },
  installation: {
    label: 'Nhân công lắp đặt',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: 'bg-amber-500',
  },
};

interface PageProps {
  category: string;
  devices: Device[];
  loading: boolean;
  searchQuery: string;
  sortBy: 'az' | 'za' | 'price-asc' | 'price-desc';
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'az' | 'za' | 'price-asc' | 'price-desc') => void;
  showHero?: boolean;
  showContent?: boolean;
}

export default function EquipmentPageDesktop({ 
  category, 
  devices, 
  loading,
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
  showHero = true,
  showContent = true,
}: PageProps) {
  console.log('🖥️ EquipmentPageDesktop - category:', category, 'devices:', devices.length, 'loading:', loading);
  const meta = CATEGORY_META[category as EquipmentCategory];
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  // Filter and sort
  const filteredDevices = useMemo(() => {
    let filtered = [...devices];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(device => 
        device.model.toLowerCase().includes(query) ||
        device.brand.toLowerCase().includes(query)
      );
    }
    
    switch (sortBy) {
      case 'az':
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case 'za':
        filtered.sort((a, b) => b.model.localeCompare(a.model));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }
    
    return filtered;
  }, [devices, searchQuery, sortBy]);

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    for (const device of devices) {
      if (device.brand) brandSet.add(device.brand);
    }
    return Array.from(brandSet).sort();
  }, [devices]);

  if (!meta) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Danh mục không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex lg:flex-col">
      {/* PC Hero Section - Full Width */}
      {showHero && (
        <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316]/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                {meta.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400">Thiết bị năng lượng mặt trời</p>
                <h1 className="text-3xl font-bold">{meta.label}</h1>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">
              Cung cấp thiết bị chính hãng từ các thương hiệu Tier 1 hàng đầu thế giới, đảm bảo hiệu suất và tuổi thọ trên 25 năm.
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#F97316]">{devices.length}</span>
                <span className="text-sm text-gray-400">sản phẩm</span>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#F97316]">{brands.length}</span>
                <span className="text-sm text-gray-400">thương hiệu</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PC Content */}
      {showContent && (
        <div className="flex-1 max-w-7xl mx-auto px-6 py-4 w-full">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mx-auto" />
            <p className="text-gray-500 mt-3">Đang tải...</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
              {meta.icon}
            </div>
            <p className="text-gray-500">Không tìm thấy thiết bị phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => {
                  setSelectedDeviceId(device.id);
                  setShowModal(true);
                }}
                className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-[#F97316]"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                  {device.images?.[0] ? (
                    <Image
                      src={device.images[0]}
                      alt={device.model}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}>
                      <div className={`${meta.color} opacity-30`}>{meta.icon}</div>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${meta.bg} ${meta.color} backdrop-blur-sm`}>
                      {device.brand}
                    </span>
                  </div>
                  {device.warranty && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-gray-700">BH {device.warranty} năm</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-[#F97316] transition-colors">
                    {device.model}
                  </h3>
                  
                  {/* Specs */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(device.specs)
                      .slice(0, 3)
                      .map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{key}</span>
                          <span className="font-medium text-gray-900">{val}</span>
                        </div>
                      ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {device.price ? (
                      <div>
                        <p className="text-xs text-gray-500">Đơn giá</p>
                        <p className="text-lg font-bold text-[#F97316]">{formatCurrency(device.price)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-500">Liên hệ</p>
                        <p className="text-sm font-medium text-gray-700">Giá tốt nhất</p>
                      </div>
                    )}
                    <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#C2410C] transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Device Detail Modal */}
      {showModal && devices.find((d: Device) => d.id === selectedDeviceId) && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-x-4 top-12 bottom-8 z-50 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                  {meta.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{meta.label}</p>
                  <p className="text-xs text-gray-500">{devices.find((d: Device) => d.id === selectedDeviceId)?.brand}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              {(() => {
                const selectedDevice = devices.find((d: Device) => d.id === selectedDeviceId);
                if (!selectedDevice) return null;
                
                return (
                  <>
                    <DevicePlaceholder device={selectedDevice} />
                    <div className="p-5 space-y-5">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedDevice.brand}</h3>
                        <p className="text-sm text-gray-500 mb-3">{selectedDevice.model}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${meta.bg} ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                            Chính hãng
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Bảo hành {selectedDevice.warranty} năm
                          </span>
                        </div>
                        {selectedDevice.price && (
                          <div className="mt-3 p-3 bg-green-50 rounded-xl">
                            <p className="text-xs text-gray-500">Thành tiền</p>
                            <p className="text-xl font-bold text-green-600">
                              {formatCurrency(selectedDevice.price * selectedDevice.quantity)} VNĐ
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Specs */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Thông số kỹ thuật</h4>
                        <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                          {Object.entries(selectedDevice.specs).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between px-4 py-3">
                              <p className="text-sm text-gray-500">{key}</p>
                              <p className={`text-sm font-semibold ${
                                key === 'Bảo hành' || key.includes('Công suất') || key.includes('Dung lượng')
                                  ? 'text-[#F97316]'
                                  : 'text-gray-900'
                              }`}>
                                {val}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tính năng nổi bật</h4>
                        <ul className="space-y-2">
                          {selectedDevice.features.map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${meta.accent || 'bg-gray-500'}`} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
