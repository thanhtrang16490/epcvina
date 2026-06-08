

import { Sun, Battery, Zap } from 'lucide-react';

interface ComboPlaceholderProps {
  systemName: string;
  phase?: '1-phase' | '3-phase';
  panelCount?: number;
  panelBrand?: string;
  inverterCount?: number;
  inverterBrand?: string;
  hasBattery?: boolean;
}

export default function ComboPlaceholder({
  systemName,
  phase = '1-phase',
  panelCount = 8,
  panelBrand = 'JA SOLAR',
  inverterCount = 1,
  inverterBrand = 'AUXSOL',
  hasBattery = false,
}: ComboPlaceholderProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden font-['Roboto_Flex',sans-serif]">
      {/* Split Layout Container */}
      <div className="absolute inset-0 flex">
        
        {/* Left Side - Product Stack (~60%) */}
        <div className="w-[60%] relative p-4">
          {/* Background Elements - Soft shadows for depth */}
          
          {/* Layer 1 (Back): Inverter Box */}
          <div 
            className="absolute bottom-8 left-4 right-8 h-32 bg-white rounded-2xl shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              zIndex: 10,
            }}
          >
            {/* Inverter Details */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200" />
            <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-200 rounded-full" />
            <div className="absolute bottom-6 left-4 right-4 h-1 bg-gray-100 rounded-full" />
          </div>
          
          {/* Layer 2 (Middle): Solar Panel (rotated ~10 degrees) */}
          <div 
            className="absolute top-12 left-2 right-12 h-40 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-xl"
            style={{
              transform: 'rotate(-10deg)',
              boxShadow: '0 15px 40px rgba(59,130,246,0.3)',
              zIndex: 20,
            }}
          >
            {/* Panel Grid Pattern */}
            <div className="absolute inset-2 grid grid-cols-2 gap-1 opacity-30">
              <div className="bg-white/20 rounded" />
              <div className="bg-white/20 rounded" />
              <div className="bg-white/20 rounded" />
              <div className="bg-white/20 rounded" />
            </div>
            
            {/* Panel Frame */}
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-xl" />
          </div>
          
          {/* Layer 3 (Front): Electrical Cabinet with Open Door */}
          <div 
            className="absolute top-8 left-8 w-24 h-36 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-2xl"
            style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              zIndex: 30,
            }}
          >
            {/* Cabinet Door (Open) */}
            <div 
              className="absolute -left-8 top-0 w-8 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-l-lg origin-right"
              style={{
                transform: 'perspective(200px) rotateY(-45deg)',
                boxShadow: '-5px 5px 15px rgba(0,0,0,0.2)',
              }}
            />
            
            {/* Cabinet Interior (Green Components) */}
            <div className="absolute inset-2 bg-gradient-to-b from-green-50 to-green-100 rounded">
              {/* Circuit Breakers */}
              <div className="grid grid-cols-2 gap-1 p-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-green-600 rounded-sm" />
                ))}
              </div>
              {/* Wiring */}
              <div className="absolute bottom-2 left-2 right-2 h-8">
                <div className="flex gap-1 justify-center">
                  <div className="w-1 h-6 bg-yellow-600 rounded-full" />
                  <div className="w-1 h-6 bg-red-600 rounded-full" />
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Battery (if hybrid) */}
          {hasBattery && (
            <div 
              className="absolute bottom-4 right-4 w-16 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg"
              style={{
                boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
                zIndex: 25,
              }}
            >
              <Battery className="absolute inset-0 m-auto h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Right Side - Content (~40%) */}
        <div className="w-[40%] relative p-3 flex flex-col justify-center">
          {/* Phase Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {phase === '1-phase' ? '1 pha' : '3 pha'}
            </span>
          </div>
          
          {/* Content Blocks */}
          <div className="mt-8 space-y-4">
            
            {/* Block 1: Solar Panels */}
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-extrabold text-green-600 leading-none w-12 text-right">
                {String(panelCount).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700 leading-tight">Tấm 640 Wp</div>
                <div className="text-xs font-bold text-blue-700 leading-tight mt-0.5">{panelBrand}</div>
              </div>
            </div>
            
            {/* Block 2: Inverter */}
            <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200">
              <span className="text-3xl font-extrabold text-green-600 leading-none w-12 text-right">
                {String(inverterCount).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700 leading-tight">Biến tần</div>
                <div className="text-xs font-bold text-blue-700 leading-tight mt-0.5">{inverterBrand}</div>
              </div>
            </div>
            
            {/* Battery Info (if hybrid) */}
            {hasBattery && (
              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200">
                <span className="text-3xl font-extrabold text-green-600 leading-none w-12 text-right">
                  01
                </span>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-700 leading-tight">Pin lưu trữ</div>
                  <div className="text-xs font-bold text-green-700 leading-tight mt-0.5">LiFePO4</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Effect - Subtle Elevation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
