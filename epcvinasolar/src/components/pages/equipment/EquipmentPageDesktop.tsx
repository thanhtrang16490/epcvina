import { useMemo, useState, useEffect, useRef } from 'react';
import { Shield, X, Eye, MagnifyingGlass, CaretRight, List, GridNine, GridFour, SortAscending, SortDescending, ArrowUp, ArrowDown, ShoppingCart } from '@phosphor-icons/react';
import Image from '../../ui/Image';
import DevicePlaceholder from '../../shared/selectors/DevicePlaceholder';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { useCart } from '../../../hooks/useCart';
import { formatCurrency, CATEGORY_META } from './shared-equipment';

interface PageProps {
  category: string;
  brand?: string;
  brandName?: string;
  devices: Device[];
  loading: boolean;
  searchQuery: string;
  sortBy: 'az' | 'za' | 'price-asc' | 'price-desc';
  gridColumns?: number;
  productLimit?: number;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'az' | 'za' | 'price-asc' | 'price-desc') => void;
  onGridColumnsChange?: (columns: number) => void;
  onProductLimitChange?: (limit: number) => void;
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
  gridColumns = 4,
  productLimit = 24,
  onSearchChange,
  onSortChange,
  onGridColumnsChange,
  onProductLimitChange,
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
  const searchRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

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
    
    // Apply product limit
    if (productLimit > 0) {
      filtered = filtered.slice(0, productLimit);
    }
    
    return filtered;
  }, [devices, searchQuery, sortBy, productLimit]);

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
                <h1 className="text-3xl font-bold">{meta.label}</h1>
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
              <a href="/thiet-bi/danh-sach/panel" className="hover:text-[#F97316] transition-colors">Thiết bị</a>
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
              
              {/* Product Limit */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                {[16, 24, 32, 40].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => onProductLimitChange?.(limit)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
                      productLimit === limit
                        ? 'bg-[#F97316] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={`${limit} sản phẩm`}
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
          <div className={`${
            gridColumns === 1 
              ? 'flex flex-col gap-4' 
              : `grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                } gap-6`
          }`}>
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-orange-300 cursor-pointer ${
                  gridColumns === 1
                    ? 'flex flex-row hover:translate-x-2'
                    : 'hover:-translate-y-2'
                }`}
                role="article"
                aria-label={device.model}
              >
                {/* Product Image */}
                <div className={`relative bg-gray-50 overflow-hidden ${
                  gridColumns === 1 ? 'w-48 flex-shrink-0' : 'w-full aspect-square'
                }`}>
                  {device.images?.[0] ? (
                    <Image
                      src={device.images[0]}
                      alt={device.model}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}>
                      <div className={`${meta.color} opacity-30 scale-150`}>{meta.icon}</div>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${meta.bg} ${meta.color} backdrop-blur-sm shadow-sm`}>
                      {device.brand}
                    </span>
                  </div>
                  {device.warranty && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                      <span className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Shield weight="fill" className="w-3.5 h-3.5 text-emerald-600" /> {device.warranty} năm</span>
                    </div>
                  )}
                  {/* Hover overlay with eye icon for quick view */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeviceId(device.id);
                        setShowModal(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm rounded-full p-3 hover:bg-white hover:scale-110 transform transition-all duration-200 cursor-pointer shadow-lg"
                      aria-label={`Xem nhanh ${device.model}`}
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className={`p-5 space-y-4 ${gridColumns === 1 ? 'flex-1 min-w-0 flex flex-col justify-between' : ''}`}>
                  <a href={`/thiet-bi/${device.id}`} className="block">
                    <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-orange-600 transition-colors duration-300">
                      {device.name}
                    </h3>
                  </a>
                  
                  {/* Specs */}
                  <div className="space-y-2.5">
                    {Object.entries(device.specs)
                      .slice(0, 3)
                      .map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 text-xs">{key}</span>
                          <span className="font-semibold text-gray-900 text-xs">{val}</span>
                        </div>
                      ))}
                  </div>

                  {/* Price + Add to Cart */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    {device.price ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Đơn giá</p>
                        <p className="text-lg font-bold text-orange-600">{formatCurrency(device.price)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Liên hệ</p>
                        <p className="text-sm font-semibold text-orange-600">Giá tốt nhất</p>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({
                          id: device.id,
                          name: device.name,
                          brand: device.brand,
                          price: device.price || 0,
                          image: device.images?.[0] || device.image_url,
                          category: device.category,
                        });
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
