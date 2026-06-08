

import { useState, useEffect, useRef } from 'react';
import Image from './Image';
import type { Device, EquipmentCategory } from '../../lib/types';

interface HomeEquipmentSectionProps {
  category: string;
}

const CATEGORY_META: Record<string, any> = {
  panel: { 
    label: 'Tấm pin năng lượng mặt trời', 
    icon: '☀️',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  inverter: { 
    label: 'Biến tần', 
    icon: '⚡',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  battery: { 
    label: 'Pin lưu trữ', 
    icon: '🔋',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export default function HomeEquipmentSection({ category }: HomeEquipmentSectionProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Map category to database slug(s)
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
        
        // Fetch from all relevant categories
        const allProducts: any[] = [];
        for (const categorySlug of categorySlugs) {
          const response = await fetch(`/api/products?category=${categorySlug}&show_on_homepage=true`);
          const data = await response.json();
          
          if (data.success && data.data) {
            allProducts.push(...data.data);
          }
        }
        
        // Convert to Device format
        const deviceList: Device[] = allProducts.map((product: any) => ({
          id: product.id,
          category: category as EquipmentCategory,
          brand: product.brands?.name || product.brand || 'Unknown',
          model: product.name || 'Unknown Product',
          quantity: 1,
          unit: 'bộ',
          specs: product.specifications || {},
          features: [],
          warranty: product.warranty || 0,
          images: product.image_url ? [product.image_url] : [],
          price: product.unit_price || 0,
        }));
        
        setDevices(deviceList);
      } catch (error) {
        console.error(`Error fetching ${category} devices:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [category]);

  if (loading) {
    return (
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${CATEGORY_META[category]?.bg || 'bg-gray-50'} flex items-center justify-center`}>
            <span className="text-xl">{CATEGORY_META[category]?.icon || '📦'}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {CATEGORY_META[category]?.label || 'Thiết bị'}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return null;
  }

  // Group by brand
  const brandMap = new Map<string, Device[]>();
  devices.forEach(device => {
    if (!brandMap.has(device.brand)) {
      brandMap.set(device.brand, []);
    }
    brandMap.get(device.brand)!.push(device);
  });

  const brands = Array.from(brandMap.entries());

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 px-4">
        <div className={`w-10 h-10 rounded-xl ${CATEGORY_META[category]?.bg || 'bg-gray-50'} flex items-center justify-center`}>
          <span className="text-xl">{CATEGORY_META[category]?.icon || '📦'}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {CATEGORY_META[category]?.label || 'Thiết bị'}
        </h2>
      </div>

      {/* Brand Groups */}
      {brands.map(([brand, brandDevices]) => (
        <div key={brand} className="mb-6">
          {/* Brand Header */}
          <h3 className="text-base font-semibold text-gray-800 mb-3 px-4">
            {brand}
          </h3>

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brandDevices.map((device) => (
              <div
                key={device.id}
                className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-50">
                  {device.images?.[0] ? (
                    <Image
                      src={device.images[0]}
                      alt={device.model}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">{CATEGORY_META[category]?.icon || '📦'}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {device.model}
                  </h4>
                  
                  {/* Specs */}
                  {device.specs && Object.keys(device.specs).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(device.specs).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-500">{key}</span>
                          <span className="font-medium text-gray-700">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  {device.price && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(device.price)}₫
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
