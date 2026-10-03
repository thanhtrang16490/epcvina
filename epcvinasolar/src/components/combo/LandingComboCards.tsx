import { useEffect, useState } from 'react';
import ComboListingCard, { type ComboCardData } from './ComboListingCard';

export default function LandingComboCards() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);

  useEffect(() => {
    fetch('/api/combos')
      .then((response) => response.json())
      .then((payload) => {
        const rawData = Array.isArray(payload?.data) ? payload.data : [];
        const mapped: ComboCardData[] = rawData.map((combo: any) => ({
          ...combo,
          slug: combo.slug || combo.id,
          system_type: combo.system?.technology || combo.system_type || 'on-grid',
          phase: combo.phase || (combo.system?.phase === 'three_phase' ? '3-phase' : '1-phase'),
          power_kw: combo.system?.solar_capacity?.value || combo.power_kw || 0,
          battery_kwh: combo.system?.battery_capacity?.value || combo.battery_kwh || 0,
          investment_million_vnd: combo.pricing?.total
            ? combo.pricing.total / 1000000
            : combo.investment_million_vnd || 0,
          monthly_production: combo.monthly_production || combo.system?.estimated_generation?.monthly_kwh,
          payback_period: combo.payback_period || combo.paybackYears,
          installation_area: combo.installation_area || combo.areaRequired,
          voltage: combo.voltage,
        }));
        setCombos(mapped);
      })
      .catch(() => setCombos([]));
  }, []);

  if (!combos.length) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-[1280px] px-4 xl:px-0">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-orange-600">EPCVINA Solar</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#1A365D] md:text-[32px]">Gói combo điện mặt trời</h2>
        </div>
        <a href="/goi-combo" className="whitespace-nowrap text-sm font-semibold text-red-500 underline underline-offset-2">Xem tất cả combo</a>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {combos.slice(0, 8).map((combo) => (
          <ComboListingCard key={combo.slug || combo.id} combo={combo} basePath="/goi-combo" />
        ))}
      </div>
    </section>
  );
}
