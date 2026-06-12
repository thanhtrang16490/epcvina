

import Image from './Image';
import { Battery, Sun } from 'lucide-react';
import type { SolarCombo } from '../../lib/types';
import SolarImage from './SolarImage';

interface SolarComboCardProps {
  combo: SolarCombo;
  onClick?: () => void;
}

export default function SolarComboCard({ combo, onClick }: SolarComboCardProps) {
  const isHybrid = combo.systemType === 'hybrid';
  
  // Get first device image for each category
  const panelImg = combo.equipment.find(e => e.category === 'panel')?.images[0];
  const inverterImg = combo.equipment.find(e => e.category === 'inverter')?.images[0];
  const batteryImg = combo.equipment.find(e => e.category === 'battery')?.images[0];

  return (
    <div 
      className="flex-shrink-0 w-[85vw] max-w-md snap-start cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Split Layout: Left images, Right text */}
        <div className="flex h-64">
          {/* Left Side - Device Images (50%) */}
          <div className="w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-50 p-3 space-y-2">
            {/* Panel Image */}
            {panelImg ? (
              <SolarImage 
                src={panelImg}
                alt="Tấm quang năng"
                width={120}
                height={80}
                className="rounded-lg shadow-sm mb-2"
              />
            ) : (
              <div className="w-full h-20 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                <Sun className="h-8 w-8 text-amber-600" />
              </div>
            )}
            
            {/* Inverter Image */}
            {inverterImg ? (
              <SolarImage 
                src={inverterImg}
                alt="Biến tần"
                width={120}
                height={80}
                className="rounded-lg shadow-sm mb-2"
              />
            ) : (
              <div className="w-full h-20 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <div className="text-blue-600 font-semibold text-xs">Inverter</div>
              </div>
            )}
            
            {/* Battery Image (if hybrid) */}
            {isHybrid && batteryImg && (
              <SolarImage 
                src={batteryImg}
                alt="Pin lưu trữ"
                width={120}
                height={80}
                className="rounded-lg shadow-sm"
              />
            )}
            {isHybrid && !batteryImg && (
              <div className="w-full h-20 bg-green-100 rounded-lg flex items-center justify-center">
                <Battery className="h-8 w-8 text-green-600" />
              </div>
            )}
          </div>
          
          {/* Right Side - System Info (50%) */}
          <div className="w-1/2 relative bg-gradient-to-br from-gray-50 to-white p-4 flex flex-col justify-center">
            {/* System Name */}
            <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">
              {combo.name.replace('Hệ ', '').replace(' kWp', ' kWp')}
            </h3>
            
            {/* Device List - Left aligned, separate lines */}
            <div className="space-y-2 text-sm">
              {/* Panel */}
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="text-gray-700">
                  Tấm {combo.panelBrand} {combo.panelModel?.replace('Aiko ', '').replace(' Wp', 'Wp')}
                </span>
              </div>
              
              {/* Inverter */}
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span className="text-gray-700">
                  {combo.inverterBrand.includes('Hybrid') ? 'Inverter Hybrid' : 'Inverter'} {combo.inverterModel?.replace(/.*\s/, '')}
                </span>
              </div>
              
              {/* Battery (if hybrid) */}
              {isHybrid && combo.batteryCapacity && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Pin {combo.equipment.find(e => e.category === 'battery')?.brand || 'Lưu trữ'} {combo.batteryCapacity} kWh
                  </span>
                </div>
              )}
            </div>
            
            {/* Type Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                isHybrid
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {isHybrid ? 'Hy-Brid' : 'On-Grid'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Price & Capacity */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">Công suất</div>
              <div className="text-lg font-bold text-gray-900">{combo.capacity} kWp</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Đơn giá</div>
              <div className="text-lg font-bold text-[#1a73e8]">
                {(combo.price / 1000000).toFixed(0)} triệu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
