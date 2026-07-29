import { useState, useEffect } from 'react';
import { BatteryHigh, Lightning, Shield, Clock } from '@phosphor-icons/react';
import HeaderBar from '../home/layout/HeaderBar';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

// Fallback data when API returns empty
const FALLBACK_COMBOS: ComboCardData[] = [
  { id: 'hyb-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hybrid 5 kWp 1 pha – 5 kWh', power: 5, battery: 5.12, price: 100500000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hybrid 5 kWp 1 pha – 10 kWh', power: 5, battery: 10.24, price: 125000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-5', slug: 'hybrid-88kw-1pha-5kwh', name: 'Hybrid 8.8 kWp 1 pha – 5 kWh', power: 8.75, battery: 5.12, price: 145000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-88-10', slug: 'hybrid-88kw-1pha-10kwh', name: 'Hybrid 8.8 kWp 1 pha – 10 kWh', power: 8.75, battery: 10.24, price: 168000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-16', slug: 'hybrid-88kw-1pha-16kwh', name: 'Hybrid 8.8 kWp 1 pha – 16 kWh', power: 8.75, battery: 16.38, price: 195000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-10', slug: 'hybrid-107kw-1pha-10kwh', name: 'Hybrid 10.7 kWp 1 pha – 10 kWh', power: 10.63, battery: 10.24, price: 185000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-16', slug: 'hybrid-107kw-1pha-16kwh', name: 'Hybrid 10.7 kWp 1 pha – 16 kWh', power: 10.63, battery: 16.38, price: 215000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-157-16', slug: 'hybrid-157kw-1pha-16kwh', name: 'Hybrid 15.7 kWp 1 pha – 16 kWh', power: 15.63, battery: 16.38, price: 285000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
];

export default function HybridListingPage() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos?systemType=hybrid');
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json;
          if (Array.isArray(data) && data.length > 0) {
            const mapped: ComboCardData[] = data.map((c: any) => ({
              id: c.slug || c.id,
              slug: c.slug || c.id,
              name: c.name,
              power: c.power || c.power_kw || 0,
              battery: c.battery || c.battery_kwh || 0,
              price: c.price || c.investment_million_vnd * 1000000 || 0,
              system_type: 'hybrid' as const,
              phase: c.phase || '1-phase',
              panel_brand: c.panel_brand || c.panelBrand,
              inverter_brand: c.inverter_brand || c.inverterBrand,
              monthly_production: c.monthly_production,
              payback_period: c.payback_period || c.payback_years,
              installation_area: c.installation_area || c.roof_area_m2,
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
              <div key={i} className="h-[400px] bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pt-14 md:pt-0">
      <div
        className="absolute inset-x-0 top-0 h-14 md:hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800"
        aria-hidden="true"
      />
      {/* Hero Section with Header - PC only */}
      <div className="relative hidden md:block">
        <HeaderBar />
        <section className="relative overflow-hidden bg-slate-900 text-white py-20">
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"
              alt="Hệ thống điện mặt trời Hybrid với pin lưu trữ"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-emerald-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <BatteryHigh className="h-4 w-4 text-blue-400" />
              <span>Giải Pháp Điện Độc Lập 24/7</span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Điện Mặt Trời{' '}
              <span className="text-blue-400">Hybrid</span> Có Pin Lưu Trữ
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Hệ thống Hybrid kết hợp điện mặt trời và pin lưu trữ, đảm bảo nguồn điện liên tục 24/7, 
              ngay cả khi mất điện lưới. Tối ưu tự dùng, giảm phụ thuộc vào điện lưới.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <Shield className="h-8 w-8 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Điện 24/7</p>
                  <p className="text-xs text-gray-400">Có pin lưu trữ dự phòng</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <Lightning className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Tối ưu tự dùng</p>
                  <p className="text-xs text-gray-400">Giảm 90% tiền điện</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <Clock className="h-8 w-8 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Hoàn vốn 4-6 năm</p>
                  <p className="text-xs text-gray-400">Bảo hành 25 năm</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Content */}
      <div className="relative z-[1] max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Mobile Page Header */}
        <div className="md:hidden mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BatteryHigh className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Combo Hybrid</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base max-w-3xl">
            Hệ thống điện mặt trời Hybrid có pin lưu trữ, đảm bảo nguồn điện liên tục 24/7, 
            ngay cả khi mất điện lưới. Phù hợp với gia đình cần nguồn điện ổn định và độc lập.
          </p>
        </div>

      {/* 1-Phase Section */}
      {phase1.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời Hybrid 1 pha cho nguồn điện 1 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hệ thống Hybrid 1 pha với pin lưu trữ, phù hợp cho gia đình. Bao gồm: 5 kWp, 8.8 kWp, 10.7 kWp, 15.7 kWp
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase1.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/solar-home/he-thong" />
            ))}
          </div>
        </section>
      )}

      {/* 3-Phase Section */}
      {phase3.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Điện mặt trời Hybrid 3 pha cho nguồn điện 3 pha
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hệ thống Hybrid 3 pha với pin lưu trữ, phù hợp cho gia đình lớn, văn phòng, nhà xưởng.
              Bao gồm: 10 kWp, 15 kWp, 20 kWp, 30 kWp và lớn hơn.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phase3.map(combo => (
              <ComboListingCard key={combo.id} combo={combo} basePath="/solar-home/he-thong" />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
