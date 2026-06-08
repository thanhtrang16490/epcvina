import { useState, useEffect, useMemo } from 'react';
import HeaderBar from './HeaderBar';
import HeroSection from './HeroSection';
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
  // Combo data fetching
  const [allCombos, setAllCombos] = useState<ComboCardData[]>([]);
  const [combosLoading, setCombosLoading] = useState(true);

  // Fallback combos per hybrid category
  const fallbackHybridOnePhase: ComboCardData[] = [
    { id: 'fb-h1-1', slug: 'hybrid-5kwp-1pha', name: 'Hybrid 5kWp + 5.12kWh', power: 5, battery: 5.12, price: 98000000, system_type: 'hybrid', phase: '1-phase' },
    { id: 'fb-h1-2', slug: 'hybrid-8kwp-1pha', name: 'Hybrid 8kWp + 10kWh', power: 8, battery: 10, price: 135000000, system_type: 'hybrid', phase: '1-phase' },
  ];
  const fallbackHybridThreePhaseLow: ComboCardData[] = [
    { id: 'fb-h3l-1', slug: 'hybrid-10kwp-3pha-at', name: 'Hybrid 10kWp + 10kWh Áp Thấp', power: 10, battery: 10, price: 156000000, system_type: 'hybrid', phase: '3-phase', voltage: 'low' },
    { id: 'fb-h3l-2', slug: 'hybrid-8kwp-3pha-at', name: 'Hybrid 8kWp + 5.12kWh Áp Thấp', power: 8, battery: 5.12, price: 118000000, system_type: 'hybrid', phase: '3-phase', voltage: 'low' },
  ];
  const fallbackHybridThreePhaseHigh: ComboCardData[] = [
    { id: 'fb-h3h-1', slug: 'hybrid-15kwp-3pha-ac', name: 'Hybrid 15kWp + 20kWh Áp Cao', power: 15, battery: 20, price: 235000000, system_type: 'hybrid', phase: '3-phase', voltage: 'high' },
    { id: 'fb-h3h-2', slug: 'hybrid-20kwp-3pha-ac', name: 'Hybrid 20kWp + 30kWh Áp Cao', power: 20, battery: 30, price: 310000000, system_type: 'hybrid', phase: '3-phase', voltage: 'high' },
  ];

  // Fetch all combos from API
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

  // Split combos into hybrid categories only
  const { hybridOnePhase, hybridThreePhase } = useMemo(() => {
    const h1 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '1-phase');
    const h3 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '3-phase');

    return {
      hybridOnePhase: h1.length > 0 ? h1 : fallbackHybridOnePhase,
      hybridThreePhase: h3.length > 0 ? h3 : [...fallbackHybridThreePhaseLow, ...fallbackHybridThreePhaseHigh],
    };
  }, [allCombos, fallbackHybridOnePhase, fallbackHybridThreePhaseLow, fallbackHybridThreePhaseHigh]);

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <HeaderBar />
      <div className="md:pt-16">
      <HeroSection />
      <StatsSection />
      <PartnersSection />
      <BenefitsSection />
      {/* Hybrid Combo Sections */}
      <ComboGridSection
        title="Điện mặt trời Hybrid (Có pin lưu trữ) - Nguồn điện 1 pha"
        description="Hệ thống điện mặt trời Hybrid với pin lưu trữ Lithium, tự động chuyển đổi khi mất điện lưới, sử dụng điện ban đêm."
        systemType="hybrid"
        phase="1-phase"
        combos={hybridOnePhase}
      />
      <ComboGridSection
        title="Điện mặt trời Hybrid (Có pin lưu trữ) - Nguồn điện 3 pha"
        description="Hệ thống Hybrid 3 pha với pin lưu trữ Lithium, phù hợp hộ gia đình công suất lớn và doanh nghiệp vừa."
        systemType="hybrid"
        phase="3-phase"
        combos={hybridThreePhase}
      />
      <ProcessSection />
      <WarrantySection />
      <ReviewsSection />
      <CTASection />
      <FAQSection />
      <FooterSection />
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
