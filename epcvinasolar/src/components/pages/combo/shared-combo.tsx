import { useState, useRef } from 'react';
import { Lightning, TrendUp, BatteryHigh, Stack, Plug, CableCar, Shield, Wrench, CaretRight, CaretLeft } from '@phosphor-icons/react';
import type { Device, EquipmentCategory } from '../../../lib/types';

export function formatCurrency(value: number): string {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' tỷ';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' triệu';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return value.toString();
}

export const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  accent: string;
  gradient: string;
}> = {
  panel: {
    label: 'Tấm quang năng',
    icon: <Lightning className="h-5 w-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    accent: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  inverter: {
    label: 'Biến tần (Inverter)',
    icon: <TrendUp className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  battery: {
    label: 'Pin lưu trữ',
    icon: <BatteryHigh className="h-5 w-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  mounting: {
    label: 'Hệ khung nhôm',
    icon: <Stack className="h-5 w-5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    accent: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
  },
  wiring: {
    label: 'Hệ dây điện',
    icon: <CableCar className="h-5 w-5" />,
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

export const CATEGORY_ORDER: string[] = ['panel', 'inverter', 'battery', 'mounting', 'wiring', 'cabinet', 'grounding'];
export const ACCESSORY_ORDER: string[] = ['mounting', 'wiring', 'cabinet', 'grounding', 'installation'];

export async function getAvailableDevicesByCategory(
  category: string, 
  allCombos: any[],
  targetPhase?: string,
  targetSystemType?: string
): Promise<Device[]> {
  const allDevices: Device[] = [];
  
  try {
    let categorySlugs: string[] = [];
    
    if (category === 'inverter') {
      categorySlugs = ['on-grid-1phase', 'on-grid-3phase-lv'];
    } else if (category === 'battery') {
      categorySlugs = ['hv-battery', 'lv-battery'];
    } else if (category === 'panel') {
      categorySlugs = ['panel'];
    } else {
      categorySlugs = [category];
    }
    
    for (const categorySlug of categorySlugs) {
      const response = await fetch(`/api/products?category=${categorySlug}&show_on_homepage=true`);
      const data = await response.json();
      
      if (data.success && data.data) {
        data.data.forEach((product: any) => {
          if (allDevices.some(d => d.id === product.id)) return;
          
          const device: Device = {
            id: product.id,
            category: (category as EquipmentCategory),
            brand: product.brands?.name || product.brand || 'Unknown',
            name: product.name,
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
          };
          
          allDevices.push(device);
        });
      }
    }
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
  }
  
  return allDevices;
}

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setActiveIdx(prev => Math.min(prev + 1, images.length - 1));
      else setActiveIdx(prev => Math.max(prev - 1, 0));
    }
    startX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <img src={images[activeIdx]} alt={`${alt} - ảnh ${activeIdx + 1}`} className="w-full h-full object-cover" loading="lazy" />
      {images.length > 1 && (
        <>
          <button onClick={() => setActiveIdx(prev => Math.max(prev - 1, 0))} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm" aria-label="Ảnh trước">
            <CaretLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveIdx(prev => Math.min(prev + 1, images.length - 1))} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm" aria-label="Ảnh sau">
            <CaretRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeIdx ? 'bg-white scale-125' : 'bg-white/50'}`} aria-label={`Ảnh ${i + 1}`} />
            ))}
          </div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">{activeIdx + 1}/{images.length}</div>
        </>
      )}
    </div>
  );
}

export function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-[#F97316]' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
