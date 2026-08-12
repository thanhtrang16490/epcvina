import { useMemo, useState, useEffect, useRef } from 'react';
import { Shield, X, MagnifyingGlass, CaretRight, List, GridNine, GridFour, SortAscending, SortDescending, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import Image from '../../ui/Image';
import DevicePlaceholder from '../../shared/selectors/DevicePlaceholder';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { formatCurrency, CATEGORY_META } from './shared-equipment';

function CardImagePlaceholder({ category, label }: { category: EquipmentCategory; label: string }) {
  const meta = CATEGORY_META[category];

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${meta.gradient} p-5`}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/85 text-center shadow-sm backdrop-blur-sm">
        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${meta.bg} ${meta.color}`}>
          {meta.icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Chưa có ảnh</p>
        <p className="mt-1 max-w-[10rem] text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
          {label}
        </p>
      </div>
    </div>
  );
}

interface PageProps {
  category: string;
  brand?: string;
  brandName?: string;
  devices: Device[];
  loading: boolean;
  searchQuery: string;
  sortBy: 'az' | 'za' | 'price-asc' | 'price-desc';
  gridColumns?: number;
  itemsPerPage?: number;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'az' | 'za' | 'price-asc' | 'price-desc') => void;
  onGridColumnsChange?: (columns: number) => void;
  onItemsPerPageChange?: (count: number) => void;
  showHero?: boolean;
  showContent?: boolean;
}

export default function EquipmentPageDesktop({ 
  category, 
  brand,
  brandName,
  devices, 
  loading,
  searchQuery,
  sortBy,
  gridColumns = 5,
  itemsPerPage = 20,
  onSearchChange,
  onSortChange,
  onGridColumnsChange,
  onItemsPerPageChange,
  showHero = true,
  showContent = true,
}: PageProps) {
  // Use brand metadata if in brand mode, otherwise use category metadata
  const meta = brand ? {
    label: `Thương hiệu ${brandName || brand}`,
    icon: <Shield className="h-5 w-5"/>,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    description: `Sản phẩm chính hãng ${brandName || brand} - Bảo hành chính hãng, hỗ trợ kỹ thuật 24/7`,
  } : CATEGORY_META[category as EquipmentCategory];
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const searchRef = useRef<HTMLDivElement>(null);
  // Auto-collapse search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        onSearchChange('');
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch, onSearchChange]);

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

  const visibleDevices = useMemo(() => {
    return filteredDevices.slice(0, visibleCount);
  }, [filteredDevices, visibleCount]);

  // Reset visible count when search/sort changes
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [searchQuery, sortBy, itemsPerPage]);

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
    <div className="hidden md:flex md:flex-col">
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
                <h2 className="text-3xl font-bold">{meta.label}</h2>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">{meta?.description}</p>
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
        <div className="flex-1 w-full">
        <div className="w-full">
        {/* Horizontal MagnifyingGlass & Filter Bar with Breadcrumbs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Breadcrumbs - Left Side */}
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1">
              <a href="/" className="hover:text-[#F97316] transition-colors">Trang chủ</a>
              <CaretRight className="h-3 w-3" />
              <a href="/thiet-bi/panel" className="hover:text-[#F97316] transition-colors">Thiết bị</a>
              <CaretRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium">{meta?.label || 'Danh mục'}</span>
            </div>

            {/* Filter Options - Right Side */}
            <div className="flex items-center gap-3">
              {/* Collapsible MagnifyingGlass */}
              <div ref={searchRef}>
                {showSearch ? (
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Tìm thiết bị..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        onSearchChange('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#F97316] transition-colors"
                    title="Tìm kiếm"
                  >
                    <MagnifyingGlass className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Layout View Icons */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => onGridColumnsChange?.(1)}
                  className={`p-2 rounded transition-colors ${
                    gridColumns === 1
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Danh sách 1 cột"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onGridColumnsChange?.(3)}
                  className={`p-2 rounded transition-colors ${
                    gridColumns === 3
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Lưới 3 cột"
                >
                  <GridNine className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onGridColumnsChange?.(5)}
                  className={`p-2 rounded transition-colors ${
                    gridColumns === 5
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Lưới 5 cột"
                >
                  <GridNine className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onGridColumnsChange?.(4)}
                  className={`p-2 rounded transition-colors ${
                    gridColumns === 4
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Lưới 4 cột"
                >
                  <GridFour className="h-4 w-4" />
                </button>
              </div>
              
              {/* Items per page */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                {[20, 40, 60].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => onItemsPerPageChange?.(limit)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
                      itemsPerPage === limit
                        ? 'bg-[#F97316] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={`Hiển thị ${limit}`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => onSortChange('az')}
                  className={`p-2 rounded transition-colors ${
                    sortBy === 'az'
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Sắp xếp A-Z"
                >
                  <SortAscending className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onSortChange('za')}
                  className={`p-2 rounded transition-colors ${
                    sortBy === 'za'
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Sắp xếp Z-A"
                >
                  <SortDescending className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onSortChange('price-asc')}
                  className={`p-2 rounded transition-colors ${
                    sortBy === 'price-asc'
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Giá tăng dần"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onSortChange('price-desc')}
                  className={`p-2 rounded transition-colors ${
                    sortBy === 'price-desc'
                      ? 'bg-[#F97316] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Giá giảm dần"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
          <div>
          <div className={`${
            gridColumns === 1 
              ? 'flex flex-col gap-4' 
              : `grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 3 ? 'lg:grid-cols-3' : gridColumns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
                } gap-4 lg:gap-5`
          }`}>
            {visibleDevices.map((device) => (
              <a
                key={device.id}
                href={`/thiet-bi/${device.id}`}
                className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#0B63CE] cursor-pointer block ${
                  gridColumns === 1
                    ? 'flex flex-row hover:translate-x-2'
                    : 'hover:-translate-y-2'
                }`}
                aria-label={device.model}
              >
                {/* Product Image */}
                <div className={`relative bg-white overflow-hidden ${
                  gridColumns === 1 ? 'w-48 flex-shrink-0' : 'w-full aspect-square'
                }`}>
                  {device.images?.[0] ? (
                    <Image
                      src={device.images[0]}
                      alt={device.model}
                      fill
                      className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <CardImagePlaceholder category={device.category} label={device.name} />
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-4 space-y-3 ${gridColumns === 1 ? 'flex-1 min-w-0 flex flex-col justify-between' : ''}`}>
                  <a href={`/thiet-bi/${device.id}`} className="block">
                    <h3 className="font-semibold text-gray-900 text-[14px] leading-snug line-clamp-2 hover:text-[#0B63CE] transition-colors duration-300">
                      {device.name}
                    </h3>
                  </a>
                  
                  {/* Specs */}
                  <div className="space-y-2">
                    {Object.entries(device.specs)
                      .filter(([, val]) => {
                        const normalized = String(val).trim();
                        return !/^0(\s|$|~)/.test(normalized);
                      })
                      .slice(0, 3)
                      .map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
                          <span className="text-gray-500 text-[10px] leading-none">{key}</span>
                          <span className="font-semibold text-gray-900 text-[11px] text-right leading-none">{val}</span>
                        </div>
                      ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100" />
                </div>
              </a>
            ))}
          </div>

          {/* Load more */}
          {visibleCount < filteredDevices.length && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + itemsPerPage, filteredDevices.length))}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-[#0B63CE] hover:text-[#0B63CE] hover:bg-blue-50"
              >
                Xem thêm
                <CaretRight className="h-4 w-4" />
              </button>
            </div>
          )}
          </div>
        )}
        </div>
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
                        <div className="mt-3 p-3 bg-orange-50 rounded-xl">
                          <p className="text-xs text-gray-500">Báo giá</p>
                          <p className="text-base font-semibold text-orange-700">
                            Liên hệ để nhận báo giá tốt nhất
                          </p>
                        </div>
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
