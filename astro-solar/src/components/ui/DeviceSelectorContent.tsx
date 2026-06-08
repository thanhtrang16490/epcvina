

import { useState, useEffect } from 'react';
import type { Device, EquipmentCategory } from '../../lib/types';

// Import CATEGORY_META from page.tsx - we'll need to pass it as prop instead
const CATEGORY_META_LOCAL: Record<string, any> = {
  panel: { label: 'Tấm pin', icon: '☀️' },
  inverter: { label: 'Biến tần', icon: '⚡' },
  battery: { label: 'Pin lưu trữ', icon: '🔋' },
};

interface DeviceSelectorContentProps {
  category: string;
  currentDevice?: Device;
  onSelect: (device: Device) => void;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export default function DeviceSelectorContent({ 
  category, 
  currentDevice, 
  onSelect, 
  onClose 
}: DeviceSelectorContentProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
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
          quantity: currentDevice?.quantity || 1,
          unit: currentDevice?.unit || 'bộ',
          specs: product.specifications || {},
          features: [],
          warranty: 0,
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
  }, [category, currentDevice]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <button
          key={device.id}
          onClick={() => onSelect(device)}
          className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
        >
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            {device.images?.[0] ? (
              <img
                src={device.images[0]}
                alt={device.model}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {CATEGORY_META_LOCAL[category]?.icon}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{device.brand}</p>
            <p className="text-xs text-gray-500 truncate">{device.model}</p>
            <p className="text-xs text-gray-600 mt-1">×{device.quantity} {device.unit}</p>
          </div>

          {/* Price */}
          {device.price && (
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">{formatCurrency(device.price)}</p>
            </div>
          )}
        </button>
      ))}

      {devices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Không có thiết bị nào</p>
        </div>
      )}
    </div>
  );
}
