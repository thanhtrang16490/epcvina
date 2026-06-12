import { useState, useEffect } from 'react';
import { Sun, Zap, Battery, TrendingUp, Calendar, Maximize } from 'lucide-react';

interface Combo {
  id: string;
  name: string;
  power: number;
  battery: number;
  price: number;
  system_type: string;
  phase: string;
  daily_production?: number;
  monthly_savings?: number;
  payback_period?: number;
  installation_area?: number;
  inverter_brand?: string;
  panel_brand?: string;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

function ComboCard({ combo }: { combo: Combo }) {
  const dailyProduction = combo.daily_production || Math.round(combo.power * 4);
  const monthlyProduction = dailyProduction * 30;
  const paybackPeriod = combo.payback_period || (combo.price > 0 ? Math.round((combo.price / (monthlyProduction * 3500 * 12)) * 10) / 10 : 0);
  const area = combo.installation_area || Math.round(combo.power * 4.3);

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[320px] bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
        <div className="flex items-center gap-2">
          {combo.system_type === 'hybrid' ? (
            <Battery className="h-5 w-5 text-yellow-300" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-300" />
          )}
          <h3 className="text-white font-semibold text-sm">{combo.name}</h3>
        </div>
      </div>

      {/* Price */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Giá niêm yết</p>
        <p className="text-2xl font-bold text-red-600 mt-1">{formatVND(combo.price)}</p>
      </div>

      {/* Specs */}
      <div className="px-5 py-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-2">
            <Sun className="h-4 w-4 text-blue-500" />
            Tấm pin:
          </span>
          <span className="font-medium text-gray-900">{combo.panel_brand || 'Aiko'} {combo.power} kWp</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            Biến tần:
          </span>
          <span className="font-medium text-gray-900">{combo.inverter_brand || 'SAJ'} {combo.power} kW</span>
        </div>
        {combo.battery > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" />
              Lưu trữ:
            </span>
            <span className="font-medium text-gray-900">{combo.battery} kWh</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Sản lượng:
          </span>
          <span className="font-medium text-gray-900">{monthlyProduction} kWh/tháng</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            Hoàn vốn:
          </span>
          <span className="font-medium text-gray-900">{paybackPeriod} năm</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-2">
            <Maximize className="h-4 w-4 text-teal-500" />
            Diện tích:
          </span>
          <span className="font-medium text-gray-900">{area} m²</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <a
          href={`/on-grid`}
          className="flex-1 text-center py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Xem chi tiết
        </a>
        <a
          href="tel:0988446113"
          className="flex-1 text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Liên hệ
        </a>
      </div>
    </div>
  );
}

export default function ComboCardsSection() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos');
        if (res.ok) {
          const data = await res.json();
          setCombos(data.slice(0, 8)); // Show max 8 combos
        }
      } catch (e) {
        console.error('Failed to fetch combos:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCombos();
  }, []);

  // Fallback combos if API has no data
  const displayCombos = combos.length > 0 ? combos : [
    { id: '1', name: 'On-Grid 5kWp 1 Pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase' },
    { id: '2', name: 'On-Grid 10kWp 3 Pha', power: 10, battery: 0, price: 86400000, system_type: 'on-grid', phase: '3-phase' },
    { id: '3', name: 'Hybrid 5kWp + 5.12kWh', power: 5, battery: 5.12, price: 98000000, system_type: 'hybrid', phase: '1-phase' },
    { id: '4', name: 'Hybrid 10kWp + 10kWh', power: 10, battery: 10, price: 156000000, system_type: 'hybrid', phase: '3-phase' },
    { id: '5', name: 'On-Grid 15kWp 3 Pha', power: 15, battery: 0, price: 125000000, system_type: 'on-grid', phase: '3-phase' },
    { id: '6', name: 'Hybrid 8kWp + 10kWh', power: 8, battery: 10, price: 135000000, system_type: 'hybrid', phase: '1-phase' },
  ];

  return (
    <section id="combos" className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Combo điện mặt trời</h2>
            <p className="text-gray-500 mt-2">Gói trọn bộ - Giá tốt nhất thị trường</p>
          </div>
          <a href="/on-grid" className="hidden sm:inline-flex text-green-600 hover:text-green-700 font-medium text-sm">
            Xem tất cả →
          </a>
        </div>

        {/* Cards scroll container */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-[300px] h-[400px] bg-white rounded-2xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {displayCombos.map((combo) => (
              <div key={combo.id} className="snap-start">
                <ComboCard combo={combo} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile view all link */}
        <div className="sm:hidden mt-6 text-center">
          <a href="/on-grid" className="text-green-600 hover:text-green-700 font-medium text-sm">
            Xem tất cả combo →
          </a>
        </div>
      </div>
    </section>
  );
}
