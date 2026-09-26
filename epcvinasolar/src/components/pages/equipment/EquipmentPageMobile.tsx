

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Shield, X, CaretRight, SlidersHorizontal, Eye, ArrowRight, Check, CaretLeft } from '@phosphor-icons/react';
import Image from '../../ui/Image';
import DevicePlaceholder from '../../shared/selectors/DevicePlaceholder';
import type { Device, EquipmentCategory } from '../../../lib/types';
import { useScrollContext } from '../../layout/dashboardShellContext';
import { formatCurrency, CATEGORY_META, getCategoryMeta } from './shared-equipment';

function CardImagePlaceholder({ category, label }: { category: EquipmentCategory; label: string }) {
  const meta = getCategoryMeta(category);

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${meta.gradient} p-4`}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/85 text-center shadow-sm backdrop-blur-sm">
        <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl ${meta.bg} ${meta.color}`}>
          {meta.icon}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Chưa có ảnh</p>
        <p className="mt-1 max-w-[9rem] text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
          {label}
        </p>
      </div>
    </div>
  );
}
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
      <p className={`text-sm font-semibold ${highlight ? 'text-[#F97316]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
interface PageProps {
  category: string;
  brand?: string;
  audienceMode?: 'b2b' | 'b2c';
}

export default function EquipmentCategoryPage({ category, brand, audienceMode = 'b2b' }: PageProps) {
  // Use brand metadata if in brand mode, otherwise use category metadata
  const meta = brand ? {
    label: `Thương hiệu ${brand}`,
    icon: <Shield className="h-5 w-5"/>,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
    description: `Thiết bị chính hãng ${brand} cho EPC, đại lý và nhà thầu - hỗ trợ BOM, CO/CQ, báo giá dự án và giao hàng toàn quốc`,
  } : getCategoryMeta(category);
  const isB2C = audienceMode === 'b2c';
  const heroLead = isB2C
    ? 'Xem nhanh cấu hình phù hợp cho nhà phố, biệt thự hoặc hộ gia đình và nhận tư vấn theo nhu cầu thực tế.'
    : 'Xem nhanh thiết bị sẵn hàng cho EPC, đại lý và nhà thầu. Hỗ trợ BOM, CO/CQ và báo giá theo dự án.';
  const ITEMS_PER_PAGE = 20;
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('az');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
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
        // Use category directly - no mapping needed
        const categorySlug = category;
        
        const response = await fetch(`/api/products?category=${categorySlug}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const devices: Device[] = data.data.map((product: any) => ({
            id: product.id,
            category: category as EquipmentCategory,
            brand: product.brand || 'Unknown',
            name: product.name || product.model || 'Unknown',
            model: product.model || product.name,
            quantity: 1,
            unit: 'sản phẩm',
            price: product.price || 0,
            specs: {
              'Thương hiệu': product.brand || '',
              ...(product.specifications || {}),
            },
            features: product.features || [],
            warranty: parseInt(product.warranty || '0') || 0,
            images: product.main_image ? [product.main_image] : [],
            image_url: product.main_image,
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

  // Reset visible count when search/sort changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, sortBy]);

  // Load-more devices for the grid
  const visibleDevices = useMemo(() => {
    return filteredDevices.slice(0, visibleCount);
  }, [filteredDevices, visibleCount]);

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
    <div className="flex-1 flex flex-col min-h-screen md:hidden">
      {/* ===== MOBILE: Sticky Header (giữ nguyên) ===== */}
      <header className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-all duration-200 md:hidden ${
        isFirstCardVisible ? 'shadow-sm' : ''
      }`}>
        {/* Title Row */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {meta?.label || 'Thiết bị'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {allDevices.length} sản phẩm {isB2C ? 'phù hợp mua lẻ' : 'cho EPC và nhà thầu'}
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
                  ? 'bg-[#F97316] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* MagnifyingGlass and Filter Row */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex gap-3">
            {/* MagnifyingGlass Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm thiết bị / model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
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
              className="px-4 py-2 bg-[#F97316] text-white rounded-lg flex items-center gap-2 hover:bg-[#C2410C] transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Lọc nhanh</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <a href="#lead-b2b-mobile" className="block rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 p-4 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200">Lead nhanh cho EPC</p>
            <p className="mt-1 text-base font-black">Nhận báo giá sỉ, kiểm tra tồn kho, xin BOM</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{heroLead}</p>
          </a>
        </div>
      </header>

      <section id="lead-b2b-mobile" className="mx-4 mt-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">{isB2C ? 'Khách mua lẻ' : 'EPC / nhà thầu'}</p>
        <h3 className="mt-2 text-lg font-black text-gray-900">
          {isB2C ? 'Nhận tư vấn cấu hình cho nhà mình' : 'Nhận báo giá sỉ, BOM, CO/CQ'}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {isB2C
            ? 'Gửi diện tích mái, hóa đơn điện hoặc nhu cầu dùng ban ngày/ban đêm, EPCVINA sẽ gợi ý cấu hình phù hợp.'
            : 'Gửi model hoặc số lượng cần mua, EPCVINA sẽ phản hồi theo dự án và tình trạng tồn kho.'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href="tel:0988446113" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-sm font-bold text-white">
            {isB2C ? 'Gọi tư vấn' : 'Gọi ngay'}
          </a>
          <a href="https://zalo.me/0368927332" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
            {isB2C ? 'Zalo tư vấn' : 'Zalo EPC'}
          </a>
        </div>
      </section>

      {/* ===== PC: Header + Filter Bar ===== */}
      <header className="hidden md:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {meta?.label || 'Thiết bị'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {allDevices.length} sản phẩm từ {brands.length} thương hiệu
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* MagnifyingGlass */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
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
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-white"
              >
                <option value="az">Tên A-Z</option>
                <option value="za">Tên Z-A</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE: Device List (giữ nguyên) ===== */}
      <div className="md:hidden space-y-6 pb-4">
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
            <p className="font-semibold text-gray-800">Danh mục này hiện chưa có sản phẩm</p>
            <p className="mt-1 text-sm text-gray-500">Gửi nhu cầu để nhận cấu hình và báo giá tương đương.</p>
            <a href="/bao-gia" className="mt-4 inline-flex rounded-lg bg-[#F97316] px-4 py-2 text-sm font-semibold text-white">Nhận tư vấn / báo giá</a>
          </div>
        ) : (
          Object.entries(devicesByBrand).map(([brand, devices]) => (
            <div key={brand} ref={(el) => { brandRefs.current[brand] = el; }} data-brand={brand}>
              {/* Brand Header */}
              <div className="sticky top-14 z-10 bg-gray-50 px-4 py-2 border-y border-gray-200">
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
                          <h3 className="font-semibold text-gray-900">{device.name}</h3>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{device.unit}</p>
                      </div>

                      {/* Right: Price */}
                      {device.price && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-0.5">Đơn giá</p>
                          <p className="text-base font-semibold text-[#F97316]">{formatCurrency(device.price)}</p>
                        </div>
                      )}

                      {/* Chevron */}
                      <CaretRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== PC: Product Grid ===== */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {visibleDevices.map((device) => {
              return (
                <a
                  key={device.id}
                  href={`/thiet-bi/${device.id}`}
                  className={`group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 block border-gray-200 hover:border-[#0B63CE]`}
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-white overflow-hidden">
                    {device.images?.[0] ? (
                      <Image
                        src={device.images[0]}
                        alt={device.model}
                        fill
                        className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <CardImagePlaceholder category={device.category} label={device.name} />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#0B63CE] transition-colors">
                      {device.name}
                    </h3>
                    
                    {/* Specs */}
                    <div className="space-y-2 mb-3">
                      {Object.entries(device.specs)
                        .filter(([, val]) => {
                          const normalized = String(val).trim();
                          return !/^0(\s|$|~)/.test(normalized);
                        })
                        .slice(0, 3)
                        .map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
                            <span className="text-gray-500 text-[10px] leading-none">{key}</span>
                            <span className="font-medium text-gray-900 text-[11px] text-right leading-none">{val}</span>
                          </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-3 border-t border-gray-100" />
                  </div>
                </a>
              );
            })}
          </div>

          {visibleCount < filteredDevices.length && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + ITEMS_PER_PAGE, filteredDevices.length))}
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
                  </div>
                  <div className="mt-3 p-3 bg-orange-50 rounded-xl">
                    <p className="text-xs text-gray-500">Báo giá</p>
                    <p className="text-base font-semibold text-orange-700">Liên hệ để nhận báo giá tốt nhất</p>
                  </div>
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
              
              {/* Action Buttons */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Đóng
                </button>
                <a
                  href={`/thiet-bi/${selectedDevice.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#F97316] text-white rounded-xl text-sm font-medium hover:bg-[#C2410C] transition-colors"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </>
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
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        sortBy === option.value ? 'text-[#F97316]' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                      {sortBy === option.value && (
                        <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center">
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
                className="w-full py-3 px-4 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#C2410C] transition-colors"
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
