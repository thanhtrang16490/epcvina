import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

// Fallback data when API returns empty
const FALLBACK_COMBOS: ComboCardData[] = [
  { id: 'og1p-5', slug: 'og1p-5-5kw', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-8', slug: 'og1p-8-8kw', name: 'Hệ On-Grid 8.8 kWp 1 pha', power: 8.8, battery: 0, price: 86400000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-10', slug: 'og1p-10-7kw', name: 'Hệ On-Grid 10.7 kWp 1 pha', power: 10.7, battery: 0, price: 100600000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-10', slug: 'og3p-10-7kw', name: 'Hệ On-Grid 10.7 kWp 3 pha', power: 10.7, battery: 0, price: 98500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-15', slug: 'og3p-15-7kw', name: 'Hệ On-Grid 15.7 kWp 3 pha', power: 15.7, battery: 0, price: 132500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol', is_popular: true },
  { id: 'og3p-18', slug: 'og3p-18-8kw', name: 'Hệ On-Grid 18.8 kWp 3 pha', power: 18.8, battery: 0, price: 152000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-29', slug: 'og3p-29-4kw', name: 'Hệ On-Grid 29.4 kWp 3 pha', power: 29.4, battery: 0, price: 252700000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-48', slug: 'og3p-48-8kw', name: 'Hệ On-Grid 48.8 kWp 3 pha', power: 48.8, battery: 0, price: 400500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
];

export default function OnGridListingPage() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos?system_type=on-grid');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mapped: ComboCardData[] = data.map((c: any) => ({
              id: c.id,
              slug: c.slug || c.id,
              name: c.name,
              power: c.power || 0,
              battery: c.battery || 0,
              price: c.price || 0,
              system_type: 'on-grid' as const,
              phase: c.phase || '1-phase',
              panel_brand: c.panel_brand,
              inverter_brand: c.inverter_brand,
              monthly_production: c.monthly_production,
              payback_period: c.payback_period,
              installation_area: c.installation_area,
              is_popular: c.is_popular,
            }));
            setCombos(mapped);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch on-grid combos:', e);
      }
      setCombos(FALLBACK_COMBOS);
      setLoading(false);
    }
    fetchCombos();
  }, []);

  const phase1 = combos.filter(c => c.phase === '1-phase');
  const phase3 = combos.filter(c => c.phase === '3-phase');

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Sun className="h-5 w-5 text-orange-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Combo On-Grid</h1>
        </div>
        <p className="text-gray-500 text-sm sm:text-base max-w-3xl">
          Hệ thống điện mặt trời On-Grid (Không Pin lưu trữ), là hệ thống vận hành kết hợp giữa 
          điện mặt trời và nguồn điện lưới. Giải pháp phù hợp với hóa đơn tiền điện từ 1.5 triệu/tháng.
        </p>
      </div>

      {/* 1-Phase Section */}
      {phase1.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời On-Grid cho nguồn điện 1 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Bám tấm mặt trời On-Grid 1 pha bao gồm: 5 kWp, 8.8 kWp, 10 kWp
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase1.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/on-grid" />
            ))}
          </div>
        </section>
      )}

      {/* 3-Phase Section */}
      {phase3.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời On-Grid cho nguồn điện 3 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hệ thống điện mặt trời On-Grid 3 pha. Phù hợp với hộ gia đình, văn phòng, nhà xưởng, 
              nhà hàng chủ yếu dùng điện vào ban ngày. Bám tấm mặt trời On-Grid 3 pha bao gồm: 10 kWp, 
              15 kWp, 20 kWp, 30 kWp, 50 kWp và lớn hơn.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase3.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/on-grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
