

import { useMemo, useState, useRef, useEffect } from 'react';
import { Zap, TrendingUp, Battery, Layers, Cable, Shield, Plug, Wrench, X, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Image from '../ui/Image';
import DevicePlaceholder from '../ui/DevicePlaceholder';
import type { Device, EquipmentCategory } from '../../lib/types';
import { useScrollContext } from '../layout/DashboardShell';

// Format currency helper
function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' tỷ';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' triệu';
  if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
  return value.toString();
}

// ── Category metadata ──────────────────────────────────────────
const CATEGORY_META: Record<EquipmentCategory, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <Battery className="h-5 w-5" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    accent: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Layers className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <Cable className="h-5 w-5" />,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    accent: 'bg-gray-500',
    gradient: 'from-gray-400 to-gray-600',
  },
  cabinet: {
    label: 'Tủ điện',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  grounding: {
    label: 'Hệ tiếp địa',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    accent: 'bg-teal-500',
    gradient: 'from-teal-400 to-teal-600',
  },
  meter: {
    label: 'Đồng hồ đo',
    icon: <Plug className="h-5 w-5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  installation: {
    label: 'Nhân công lắp đặt',
    icon: <Wrench className="h-5 w-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
  },
};
function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX.current) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activeIdx < images.length - 1) setActiveIdx(i => i + 1);
      if (diff < 0 && activeIdx > 0) setActiveIdx(i => i - 1);
    }
    startX.current = null;
  };

  return (
    <div 
      className="relative w-full aspect-square overflow-hidden bg-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${activeIdx * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ width: `${100 / images.length}%` }}>
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIdx ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
          {activeIdx + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

// ── Spec Row ───────────────────────────────────────────────────
function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-[#1a73e8]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
interface PageProps {
  category: string;
}

export default function EquipmentCategoryPage({ category }: PageProps) {
  const meta = CATEGORY_META[category as EquipmentCategory];
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const { isHeaderVisible } = useScrollContext();
  const [isFirstCardVisible, setIsFirstCardVisible] = useState(true);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const brandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Dynamic sticky top: below header when visible, otherwise at top
  const stickyTop = isHeaderVisible 
    ? 'top-[56px] lg:top-16'
    : 'top-0';

  // Fetch products from Supabase API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // Map URL category to database category slug
        const categorySlug = category === 'panel' ? 'panel' : 
                            category === 'mounting' ? 'mounting' :
                            category === 'wiring' ? 'wiring' :
                            category === 'cabinet' ? 'cabinet' :
                            category === 'grounding' ? 'grounding' :
                            category; // Use category as-is for others
        
        const response = await fetch(`/api/products?category=${categorySlug}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const devices: Device[] = data.data.map((product: any) => ({
            id: product.id,
            category: category as EquipmentCategory,
            brand: product.brands?.name || product.brand || 'Unknown',
            model: product.name,
            quantity: 1,
            unit: 'sản phẩm',
            price: product.unit_price || product.price || 0,
            specs: {
              'Danh mục': product.categories?.name || category,
              'Thương hiệu': product.brands?.name || product.brand || '',
              ...(product.specifications || {}),
            },
            features: product.features || [],
            warranty: product.warranty_years || product.warranty || 0,
            images: product.main_image || product.image_url ? [product.main_image || product.image_url] : [],
            image_url: product.image_url || product.main_image,
          }));
          
          setAllDevices(devices);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        setAllDevices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [category]);

  // Filter and sort devices
  const filteredDevices = useMemo(() => {
    let devices = [...allDevices];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      devices = devices.filter(device => 
        device.model.toLowerCase().includes(query) ||
        device.brand.toLowerCase().includes(query)
      );
    }
    
    switch (sortBy) {
      case 'az':
        devices.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case 'za':
        devices.sort((a, b) => b.model.localeCompare(a.model));
        break;
      case 'price-asc':
        devices.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        devices.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }
    
    return devices;
  }, [allDevices, searchQuery, sortBy]);

  // Extract unique brands
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    for (const device of allDevices) {
      if (device.brand) brandSet.add(device.brand);
    }
    return Array.from(brandSet).sort();
  }, [allDevices]);

  // Auto-select first brand on mount
  useMemo(() => {
    if (!selectedBrand && brands.length > 0) {
      setSelectedBrand(brands[0]);
    }
  }, [brands, selectedBrand]);

  // Group ALL devices by brand (alphabetically) - no filtering
  const devicesByBrand = useMemo(() => {
    const grouped: Record<string, Device[]> = {};
    allDevices.forEach(device => {
      if (!grouped[device.brand]) {
        grouped[device.brand] = [];
      }
      grouped[device.brand].push(device);
    });
    // Sort brands alphabetically
    const sortedBrands = Object.keys(grouped).sort();
    const result: Record<string, Device[]> = {};
    sortedBrands.forEach(brand => {
      result[brand] = grouped[brand];
    });
    return result;
  }, [allDevices]);

  // Scroll to brand section
  const scrollToBrand = (brand: string) => {
    setSelectedBrand(brand);
    const element = brandRefs.current[brand];
    if (element) {
      const yOffset = -60; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Initialize/reset selected device when all devices change
  useMemo(() => {
    if (allDevices.length > 0) {
      const stillValid = allDevices.some(d => d.id === selectedDeviceId);
      if (!stillValid) {
        setSelectedDeviceId('');
      }
    }
  }, [allDevices, selectedDeviceId]);

  const selectedDevice = useMemo(
    () => allDevices.find(d => d.id === selectedDeviceId) || allDevices[0],
    [allDevices, selectedDeviceId]
  );

  // Track first card visibility with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFirstCardVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
    );
    
    if (firstCardRef.current) {
      observer.observe(firstCardRef.current);
    }
    
    return () => observer.disconnect();
  }, [selectedDevice?.id]);

  // Auto-update selected brand when scrolling to brand sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible brand section (highest intersection ratio)
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Get the entry with the highest intersection ratio
          const mostVisible = visibleEntries.reduce((max, entry) => 
            entry.intersectionRatio > max.intersectionRatio ? entry : max
          );
          
          const brand = mostVisible.target.getAttribute('data-brand');
          if (brand && brands.includes(brand)) {
            setSelectedBrand(brand);
          }
        }
      },
      { 
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-100px 0px -50% 0px' // Trigger when brand header enters top portion
      }
    );
    
    // Observe all brand sections
    const observedElements = [];
    Object.keys(brandRefs.current).forEach((brand) => {
      const element = brandRefs.current[brand];
      if (element) {
        observer.observe(element);
        observedElements.push(element);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, [brands]);

  // Get device label for pills (remove brand prefix to avoid redundancy)
  const getDeviceLabel = (device: Device) => {
    const capacityKey = category === 'battery' ? 'Dung lượng' : 'Công suất';
    const specValue = device.specs[capacityKey] || device.specs['Công suất/tấm'] || device.specs['Công suất định mức'];
    if (specValue) return specValue;
    
    // Fallback: remove brand name from model
    if (device.brand && device.model.startsWith(device.brand)) {
      return device.model.slice(device.brand.length).trim();
    }
    return device.model;
  };

  if (!meta) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Danh mục không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen lg:ml-[64px] lg:pl-0">
      {/* Sticky Header */}
      <header className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-all duration-200 ${
        isFirstCardVisible ? 'shadow-sm' : ''
      }`}>
        {/* Title Row */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">
            {meta?.label || 'Thiết bị'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {allDevices.length} sản phẩm
          </p>
        </div>

        {/* Brand Tabs */}
        <div className={`px-4 py-2 overflow-x-auto scrollbar-hide ${stickyTop} z-20 bg-white border-b border-gray-200`}>
          <div className="flex gap-2 min-w-max">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => scrollToBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedBrand === brand
                    ? 'bg-[#1a73e8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm thiết bị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg flex items-center gap-2 hover:bg-[#1557b0] transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>
      </header>

      {/* Empty state - All devices removed */}
      {allDevices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
            {meta.icon}
          </div>
          <p className="text-gray-500">Không tìm thấy thiết bị phù hợp</p>
        </div>
      )}

      {/* Device List - All Devices Grouped by Brand */}
      <div className="space-y-6 pb-4">
        {Object.entries(devicesByBrand).map(([brand, devices]) => (
          <div key={brand} ref={(el) => { brandRefs.current[brand] = el; }} data-brand={brand}>
            {/* Brand Header */}
            <div className="sticky top-14 lg:top-16 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{brand}</h2>
              <p className="text-xs text-gray-500">{devices.length} sản phẩm</p>
            </div>
            
            {/* Device List */}
            <div className="divide-y divide-gray-100 bg-white">
              {devices.map((device) => {
                const isSelected = selectedDeviceId === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setShowModal(true);
                    }}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${meta.bg}`}>
                      {device.images?.[0] ? (
                        <Image
                          src={device.images[0]}
                          alt={device.model}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${meta.color}`}>
                          {meta.icon}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-900 truncate">{device.model}</h3>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#1a73e8] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{device.unit}</p>
                    </div>

                    {/* Right: Price */}
                    {device.price && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-0.5">Đơn giá</p>
                        <p className="text-base font-semibold text-[#1a73e8]">{formatCurrency(device.price)}</p>
                      </div>
                    )}

                    {/* Chevron */}
                    <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Device Detail Modal */}
      {showModal && selectedDevice && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-x-4 top-12 bottom-8 z-50 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px]">
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                  {meta.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{meta.label}</p>
                  <p className="text-xs text-gray-500">{selectedDevice.brand}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Device Placeholder Image (same as homepage cards) */}
              <DevicePlaceholder device={selectedDevice} />

              <div className="p-5 space-y-5">
                {/* Title + Badges */}
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
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      ×{selectedDevice.quantity} {selectedDevice.unit}
                    </span>
                    {selectedDevice.price && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#1a73e8]/10 text-[#1a73e8]">
                        {formatCurrency(selectedDevice.price)}/{selectedDevice.unit}
                      </span>
                    )}
                  </div>
                  {selectedDevice.price && (
                    <div className="mt-3 p-3 bg-green-50 rounded-xl">
                      <p className="text-xs text-gray-500">Thành tiền</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(selectedDevice.price * selectedDevice.quantity)} VNĐ</p>
                    </div>
                  )}
                </div>

                {/* Technical Specs */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Thông số kỹ thuật</h4>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {Object.entries(selectedDevice.specs).map(([key, val]) => (
                      <SpecRow key={key} label={key} value={val}
                        highlight={key === 'Bảo hành' || key.includes('Công suất') || key.includes('Tổng') || key.includes('Dung lượng')}
                      />
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tính năng nổi bật</h4>
                  <ul className="space-y-2">
                    {selectedDevice.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${meta.accent}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {allDevices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
            {meta.icon}
          </div>
          <p className="text-gray-500">Không tìm thấy thiết bị phù hợp</p>
        </div>
      )}

      {/* Filter Drawer - Bottom Sheet */}
      {showFilterDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowFilterDrawer(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Bộ lọc thiết bị</h2>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Sắp xếp theo</h3>
                <div className="space-y-2">
                  {[
                    { value: 'az', label: 'Tên A-Z' },
                    { value: 'za', label: 'Tên Z-A' },
                    { value: 'price-asc', label: 'Giá tăng dần' },
                    { value: 'price-desc', label: 'Giá giảm dần' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as typeof sortBy)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        sortBy === option.value
                          ? 'border-[#1a73e8] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        sortBy === option.value ? 'text-[#1a73e8]' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                      {sortBy === option.value && (
                        <div className="w-5 h-5 rounded-full bg-[#1a73e8] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Giá được hiển thị cho mỗi thiết bị</p>
                <p className="text-sm text-gray-600">Áp dụng cho tất cả thương hiệu trong danh mục này</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                onClick={() => {
                  setSortBy('az');
                  setShowFilterDrawer(false);
                }}
                className="w-full py-3 px-4 bg-[#1a73e8] text-white rounded-xl font-semibold hover:bg-[#1557b0] transition-colors"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
