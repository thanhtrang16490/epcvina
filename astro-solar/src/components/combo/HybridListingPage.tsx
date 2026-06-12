import { useState, useEffect } from 'react';
import { Battery } from 'lucide-react';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

// Fallback data when API returns empty
const FALLBACK_COMBOS: ComboCardData[] = [
  { id: 'hb1p-5-5', slug: 'hb1p-5kw-5kwh', name: 'Hệ Hy-Brid 5 kWp 1 pha - Lưu trữ 5.12 kWh', power: 5, battery: 5.12, price: 91400000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb1p-5-10', slug: 'hb1p-5kw-10kwh', name: 'Hệ Hy-Brid 5 kWp 1 pha - Lưu trữ 10.24 kWh', power: 5, battery: 10.24, price: 112400000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen', is_popular: true },
  { id: 'hb1p-8-5', slug: 'hb1p-8kw-5kwh', name: 'Hệ Hy-Brid 8.8 kWp 1 pha - Lưu trữ 5.12 kWh', power: 8.8, battery: 5.12, price: 130000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb1p-8-10', slug: 'hb1p-8kw-10kwh', name: 'Hệ Hy-Brid 8.8 kWp 1 pha - Lưu trữ 10.24 kWh', power: 8.8, battery: 10.24, price: 134800000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb1p-10-5', slug: 'hb1p-10kw-5kwh', name: 'Hệ Hy-Brid 10.7 kWp 1 pha - Lưu trữ 5.12 kWh', power: 10.7, battery: 5.12, price: 137000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb1p-10-10', slug: 'hb1p-10kw-10kwh', name: 'Hệ Hy-Brid 10.7 kWp 1 pha - Lưu trữ 10.24 kWh', power: 10.7, battery: 10.24, price: 148000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb3p-10-5', slug: 'hb3p-10kw-5kwh', name: 'Hệ Hy-Brid 10.7 kWp 3 pha - Lưu trữ 5.12 kWh', power: 10.7, battery: 5.12, price: 161000000, system_type: 'hybrid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb3p-10-16', slug: 'hb3p-10kw-16kwh', name: 'Hệ Hy-Brid 11.7 kWp 3 pha - Lưu trữ 16 kWh', power: 11.7, battery: 16, price: 190000000, system_type: 'hybrid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb3p-15-16', slug: 'hb3p-15kw-16kwh', name: 'Hệ Hy-Brid 15.7 kWp 3 pha - Lưu trữ 16 kWh', power: 15.7, battery: 16, price: 224500000, system_type: 'hybrid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
  { id: 'hb3p-15-30', slug: 'hb3p-15kw-30kwh', name: 'Hệ Hy-Brid 15.7 kWp 3 pha - Lưu trữ 30.5 kWh', power: 15.7, battery: 30.5, price: 247000000, system_type: 'hybrid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', battery_brand: 'Genxgreen' },
];

export default function HybridListingPage() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos?system_type=hybrid');
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
              system_type: 'hybrid' as const,
              phase: c.phase || '1-phase',
              panel_brand: c.panel_brand,
              inverter_brand: c.inverter_brand,
              battery_brand: c.battery_brand,
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
        console.error('Failed to fetch hybrid combos:', e);
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
              <div key={i} className="h-[450px] bg-gray-100 rounded-xl" />
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Battery className="h-5 w-5 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Combo Hy-Brid</h1>
        </div>
        <p className="text-gray-500 text-sm sm:text-base max-w-3xl">
          Hệ thống điện mặt trời Hy-Brid (Có Pin lưu trữ), có bao gồm Pin lưu trữ Lithium, 
          nên vẫn sản sinh điện dù có mất nguồn lưới điện. Giải pháp phù hợp với những khu vực thường mất điện,
          nhu cầu sử dụng điện ban đêm cao.
        </p>
      </div>

      {/* 1-Phase Section */}
      {phase1.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời Hy-Brid (Có Pin lưu trữ) cho nguồn điện 1 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hệ Hy-Brid 1 pha phù hợp cho hộ gia đình sử dụng nguồn điện 1 pha, có nhu cầu 
              lưu trữ điện và sử dụng khi mất điện lưới.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase1.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/hybrid-bess" />
            ))}
          </div>
        </section>
      )}

      {/* 3-Phase Section */}
      {phase3.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời Hy-Brid (Có Pin lưu trữ) cho nguồn điện 3 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hệ thống Hy-Brid 3 pha với công suất lớn. Sử dụng công nghệ 3 pha áp thấp hoặc áp cao, 
              phù hợp với gia đình, văn phòng, nhà xưởng, nhà hàng chủ yếu dùng điện ban ngày 
              và cần dự phòng nguồn điện khi mất điện.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase3.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/hybrid-bess" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
