

import Image from './Image';
import { Sun, Zap, Battery, Gauge, Shield, TrendingUp } from 'lucide-react';
import type { Device } from '../../lib/types';

interface DevicePlaceholderProps {
  device: Device;
}

export default function DevicePlaceholder({ device }: DevicePlaceholderProps) {
  // Get category-specific icon and color
  const getCategoryIcon = () => {
    switch (device.category) {
      case 'panel':
        return { icon: Sun, bg: 'bg-amber-100', color: 'text-amber-600' };
      case 'inverter':
        return { icon: Zap, bg: 'bg-blue-100', color: 'text-blue-600' };
      case 'battery':
        return { icon: Battery, bg: 'bg-green-100', color: 'text-green-600' };
      case 'mounting':
        return { icon: Shield, bg: 'bg-red-100', color: 'text-red-600' };
      case 'wiring':
        return { icon: Gauge, bg: 'bg-indigo-100', color: 'text-indigo-600' };
      case 'cabinet':
        return { icon: Shield, bg: 'bg-purple-100', color: 'text-purple-600' };
      case 'grounding':
        return { icon: Zap, bg: 'bg-teal-100', color: 'text-teal-600' };
      default:
        return { icon: Sun, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const { icon: Icon, bg, color } = getCategoryIcon();

  // Check if device has real image
  const hasImage = device.image_url || (device.images && device.images.length > 0);
  const imageUrl = device.image_url || device.images?.[0];

  // Debug log
  if (typeof window !== 'undefined') {
    console.log('=== DevicePlaceholder Debug ===');
    console.log('Device:', device.model);
    console.log('device.image_url:', device.image_url);
    console.log('device.images:', device.images);
    console.log('hasImage:', hasImage);
    console.log('imageUrl:', imageUrl);
    console.log('=============================');
  }

  // Extract key specs based on category
  const getKeySpecs = () => {
    const specs: Array<{ label: string; value: string; highlight?: boolean }> = [];

    if (device.category === 'panel') {
      // Solar Panel specs
      if (device.specs['Công suất']) {
        specs.push({
          label: 'Công suất',
          value: device.specs['Công suất'],
          highlight: true,
        });
      }
      if (device.specs['Hiệu suất']) {
        specs.push({
          label: 'Hiệu suất',
          value: device.specs['Hiệu suất'],
        });
      }
      if (device.specs['Bảo hành']) {
        specs.push({
          label: 'Bảo hành',
          value: `${device.specs['Bảo hành']} năm`,
        });
      }
    } else if (device.category === 'inverter') {
      // Inverter specs
      if (device.specs['Công suất']) {
        specs.push({
          label: 'Công suất',
          value: device.specs['Công suất'],
          highlight: true,
        });
      }
      if (device.specs['Số pha']) {
        specs.push({
          label: 'Pha',
          value: device.specs['Số pha'],
        });
      }
      if (device.specs['Bảo hành']) {
        specs.push({
          label: 'Bảo hành',
          value: `${device.specs['Bảo hành']} năm`,
        });
      }
    } else if (device.category === 'battery') {
      // Battery specs
      if (device.specs['Dung lượng']) {
        specs.push({
          label: 'Dung lượng',
          value: device.specs['Dung lượng'],
          highlight: true,
        });
      }
      if (device.specs['Điện áp']) {
        specs.push({
          label: 'Điện áp',
          value: device.specs['Điện áp'],
        });
      }
      if (device.specs['Chu kỳ']) {
        specs.push({
          label: 'Chu kỳ',
          value: device.specs['Chu kỳ'],
        });
      }
    } else {
      // Generic specs for other categories
      const entries = Object.entries(device.specs).slice(0, 3);
      entries.forEach(([key, value]) => {
        specs.push({
          label: key,
          value: String(value),
          highlight: specs.length === 0,
        });
      });
    }

    return specs;
  };

  const keySpecs = getKeySpecs();

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden font-['Roboto_Flex',sans-serif]">
      {/* Split Layout Container */}
      <div className="absolute inset-0 flex">
        
        {/* Left Side - Product Visual (~60%) */}
        <div className="w-[60%] relative p-4 flex items-center justify-center">
          {hasImage && imageUrl ? (
            /* Real Product Image */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={imageUrl}
                alt={device.model}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('❌ Image failed to load:', imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', imageUrl);
                }}
              />
            </div>
          ) : (
            /* Category Icon Placeholder */
            <div className={`relative w-32 h-32 ${bg} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className={`h-16 w-16 ${color}`} />
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
                <TrendingUp className={`h-4 w-4 ${color}`} />
              </div>
              
              {/* Bottom accent */}
              <div className={`absolute bottom-2 left-4 right-4 h-1 ${color.replace('text-', 'bg-')} rounded-full opacity-50`} />
            </div>
          )}
          
          {/* Floating spec badges */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {keySpecs.slice(0, 2).map((spec, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md shadow-sm border border-gray-200"
              >
                <div className="text-xs font-semibold text-gray-700">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side - Key Specs (~40%) */}
        <div className="w-[40%] relative p-3 flex flex-col justify-center">
          {/* Brand Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${bg} ${color}`}>
              {device.brand}
            </span>
          </div>
          
          {/* Key Specifications - No model name */}
          <div className="mt-8 space-y-3">
            {keySpecs.map((spec, index) => (
              <div key={index} className="space-y-0.5">
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-extrabold leading-none ${
                    spec.highlight ? 'text-green-600' : 'text-gray-700'
                  }`}>
                    {spec.value.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {spec.label}
                </div>
                {index < keySpecs.length - 1 && (
                  <div className="pt-2 border-t border-gray-100" />
                )}
              </div>
            ))}
          </div>
          
          {/* Price at Bottom */}
          <div className="absolute bottom-3 left-3 right-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-bold text-[#1a73e8]">
              {device.price ? `${(device.price / 1000000).toLocaleString('vi-VN')} triệu` : 'Liên hệ'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover Effect - Subtle Elevation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
