import { useState, useEffect } from 'react';
import { Sun, Lightning, TrendUp, Shield } from '@phosphor-icons/react';
import HeaderBar from '../home/layout/HeaderBar';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

// Fallback data when API returns empty
const FALLBACK_COMBOS: ComboCardData[] = [
  { id: 'on-grid-5kw-1pha', slug: 'on-grid-5kw-1pha', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 60000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-8.8kw-1pha', slug: 'on-grid-8.8kw-1pha', name: 'Hệ On-Grid 8.8 kWp 1 pha', power: 8.8, battery: 0, price: 95000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-10.7kw-1pha', slug: 'on-grid-10.7kw-1pha', name: 'Hệ On-Grid 10.7 kWp 1 pha', power: 10.7, battery: 0, price: 115000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-10.7kw-3pha', slug: 'on-grid-10.7kw-3pha', name: 'Hệ On-Grid 10.7 kWp 3 pha', power: 10.7, battery: 0, price: 110000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-15.7kw-3pha', slug: 'on-grid-15.7kw-3pha', name: 'Hệ On-Grid 15.7 kWp 3 pha', power: 15.7, battery: 0, price: 150000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'on-grid-18.8kw-3pha', slug: 'on-grid-18.8kw-3pha', name: 'Hệ On-Grid 18.8 kWp 3 pha', power: 18.8, battery: 0, price: 180000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-29.4kw-3pha', slug: 'on-grid-29.4kw-3pha', name: 'Hệ On-Grid 29.4 kWp 3 pha', power: 29.4, battery: 0, price: 280000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'on-grid-48.8kw-3pha', slug: 'on-grid-48.8kw-3pha', name: 'Hệ On-Grid 48.8 kWp 3 pha', power: 48.8, battery: 0, price: 450000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
];

export default function OnGridListingPage() {
  const [combos, setCombos] = useState<ComboCardData[]>(FALLBACK_COMBOS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos?systemType=on-grid');
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
              system_type: 'on-grid' as const,
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
              src="/images/generated/solar-residential-hero.webp"
              alt="Hệ thống điện mặt trời On-Grid hòa lưới"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <Lightning className="h-4 w-4 text-orange-400" />
              <span>Giải Pháp Tiết Kiệm Điện 70-90%</span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Điện Mặt Trời{' '}
              <span className="text-orange-400">On-Grid</span> Hòa Lưới
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Hệ thống điện mặt trời On-Grid kết hợp với điện lưới, giúp tiết kiệm 70-90% hóa đơn điện. 
              Hoàn vốn nhanh 3-5 năm, bảo hành 25 năm.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <TrendUp className="h-8 w-8 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Tiết kiệm 70-90%</p>
                  <p className="text-xs text-gray-400">Hóa đơn điện hàng tháng</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <Shield className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Bảo hành 25 năm</p>
                  <p className="text-xs text-gray-400">Tấm pin Tier 1</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <Lightning className="h-8 w-8 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Hoàn vốn 3-5 năm</p>
                  <p className="text-xs text-gray-400">Hiệu suất cao</p>
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
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Sun className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Combo On-Grid</h2>
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
              <ComboListingCard key={combo.id} combo={combo} basePath="/solar-home/he-thong" />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
