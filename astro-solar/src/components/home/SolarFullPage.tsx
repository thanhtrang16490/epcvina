import { useState, useEffect, useMemo } from 'react';
import HeaderBar from './HeaderBar';
import HeroSection from './HeroSection';
import SolarSolutionFinder from './SolarSolutionFinder';
import ComboGridSection from './ComboGridSection';
import StatsSection from './StatsSection';
import BenefitsSection from './BenefitsSection';
import ProcessSection from './ProcessSection';
import WarrantySection from './WarrantySection';
import ReviewsSection from './ReviewsSection';
import PartnersSection from './PartnersSection';
import CTASection from './CTASection';
import FAQSection from './FAQSection';
import FooterSection from './FooterSection';
import type { ComboCardData } from '../combo/ComboListingCard';

export default function SolarFullPage() {
  const [allCombos, setAllCombos] = useState<ComboCardData[]>([]);
  const [combosLoading, setCombosLoading] = useState(true);

  const fallbackHybridOnePhase: ComboCardData[] = [
    { id: 'fb-h1-1', slug: 'hybrid-5kwp-1pha', name: 'Hệ Hy-Brid 5 kWp 1 pha - Lưu trữ 5.12 kWh', power: 5, battery: 5.12, price: 91400000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
    { id: 'fb-h1-2', slug: 'hybrid-8kwp-1pha', name: 'Hệ Hy-Brid 8 kWp 1 pha - Lưu trữ 10.24 kWh', power: 8, battery: 10.24, price: 135000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
  ];
  const fallbackHybridThreePhaseLow: ComboCardData[] = [
    { id: 'fb-h3l-1', slug: 'hybrid-10kwp-3pha-at', name: 'Hệ Hy-Brid 10 kWp 3 pha AT - Lưu trữ 10 kWh', power: 10, battery: 10, price: 156000000, system_type: 'hybrid', phase: '3-phase', voltage: 'low', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
    { id: 'fb-h3l-2', slug: 'hybrid-15kwp-3pha-at', name: 'Hệ Hy-Brid 15 kWp 3 pha AT - Lưu trữ 16 kWh', power: 15, battery: 16, price: 224500000, system_type: 'hybrid', phase: '3-phase', voltage: 'low', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
  ];
  const fallbackHybridThreePhaseHigh: ComboCardData[] = [
    { id: 'fb-h3h-1', slug: 'hybrid-15kwp-3pha-ac', name: 'Hệ Hy-Brid 15 kWp 3 pha AC - Lưu trữ 15.36 kWh', power: 15, battery: 15.36, price: 247000000, system_type: 'hybrid', phase: '3-phase', voltage: 'high', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
    { id: 'fb-h3h-2', slug: 'hybrid-24kwp-3pha-ac', name: 'Hệ Hy-Brid 24 kWp 3 pha AC - Lưu trữ 15.36 kWh', power: 24, battery: 15.36, price: 313800000, system_type: 'hybrid', phase: '3-phase', voltage: 'high', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
  ];
  const fallbackOnGridOnePhase: ComboCardData[] = [
    { id: 'fb-o1-1', slug: 'on-grid-5kwp-1pha', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
    { id: 'fb-o1-2', slug: 'on-grid-8kwp-1pha', name: 'Hệ On-Grid 8.8 kWp 1 pha', power: 8.75, battery: 0, price: 86400000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
  ];
  const fallbackOnGridThreePhase: ComboCardData[] = [
    { id: 'fb-o3-1', slug: 'on-grid-10kwp-3pha', name: 'Hệ On-Grid 10 kWp 3 pha', power: 10, battery: 0, price: 98500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
    { id: 'fb-o3-2', slug: 'on-grid-15kwp-3pha', name: 'Hệ On-Grid 15 kWp 3 pha', power: 15, battery: 0, price: 132500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
  ];

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos');
        if (res.ok) {
          const data = await res.json();
          setAllCombos(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
        }
      } catch (e) {
        console.error('Failed to fetch combos:', e);
      } finally {
        setCombosLoading(false);
      }
    }
    fetchCombos();
  }, []);

  const { hybridOnePhase, hybridThreePhase, onGridOnePhase, onGridThreePhase } = useMemo(() => {
    const h1 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '1-phase');
    const h3 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '3-phase');
    const o1 = allCombos.filter(c => c.system_type === 'on-grid' && c.phase === '1-phase');
    const o3 = allCombos.filter(c => c.system_type === 'on-grid' && c.phase === '3-phase');
    return {
      hybridOnePhase: h1.length > 0 ? h1 : fallbackHybridOnePhase,
      hybridThreePhase: h3.length > 0 ? h3 : [...fallbackHybridThreePhaseLow, ...fallbackHybridThreePhaseHigh],
      onGridOnePhase: o1.length > 0 ? o1 : fallbackOnGridOnePhase,
      onGridThreePhase: o3.length > 0 ? o3 : fallbackOnGridThreePhase,
    };
  }, [allCombos]);

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <HeaderBar />
      <div>
        {/* Hero: break out of sidebar offset to be truly full-viewport-width */}
        <div className="lg:-ml-16 lg:w-[calc(100%+4rem)]">
          <HeroSection />
        </div>

        <SolarSolutionFinder />
        <StatsSection />
        <PartnersSection />
        <BenefitsSection />

        

        <ProcessSection />
        <WarrantySection />
        <ReviewsSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
