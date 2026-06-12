import { useState, useEffect, useMemo } from 'react';
import HeaderBar from './HeaderBar';
import HeroSection from './HeroSection';
import SolarSolutionFinder from './SolarSolutionFinder';
import ComboGridSection from './ComboGridSection';
import HuaweiSolutions from './HuaweiSolutions';
import IndustrialSolutions from './IndustrialSolutions';
import ContactConsultation from './ContactConsultation';
import BlogSection from './BlogSection';
import FAQSection from './FAQSection';
import FooterSection from './FooterSection';
import type { ComboCardData } from '../combo/ComboListingCard';

export default function SolarFullPage() {
  // Combo data fetching
  const [allCombos, setAllCombos] = useState<ComboCardData[]>([]);
  const [combosLoading, setCombosLoading] = useState(true);

  // Fallback combos
  const fallbackHybridOnePhase: ComboCardData[] = [
    { id: 'fb-h1-1', slug: 'hybrid-5kwp-1pha', name: 'Hệ Hy-Brid 5 kWp 1 pha - Lưu trữ 5.12 kWh', power: 5, battery: 5.12, price: 91400000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
    { id: 'fb-h1-2', slug: 'hybrid-8kwp-1pha', name: 'Hệ Hy-Brid 8 kWp 1 pha - Lưu trữ 10.24 kWh', power: 8, battery: 10.24, price: 135000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
  ];
  const fallbackHybridThreePhase: ComboCardData[] = [
    { id: 'fb-h3-1', slug: 'hybrid-10kwp-3pha-at', name: 'Hệ Hy-Brid 10 kWp 3 pha - Lưu trữ 10 kWh', power: 10, battery: 10, price: 156000000, system_type: 'hybrid', phase: '3-phase', voltage: 'low', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
    { id: 'fb-h3-2', slug: 'hybrid-15kwp-3pha-ac', name: 'Hệ Hy-Brid 15 kWp 3 pha - Lưu trữ 20 kWh', power: 15, battery: 20, price: 235000000, system_type: 'hybrid', phase: '3-phase', voltage: 'high', panel_brand: 'JA Solar', inverter_brand: 'Solis', battery_brand: 'Dyness' },
  ];
  const fallbackOnGridOnePhase: ComboCardData[] = [
    { id: 'fb-o1-1', slug: 'on-grid-5kwp-1pha', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
    { id: 'fb-o1-2', slug: 'on-grid-8kwp-1pha', name: 'Hệ On-Grid 8 kWp 1 pha', power: 8, battery: 0, price: 72000000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
  ];
  const fallbackOnGridThreePhase: ComboCardData[] = [
    { id: 'fb-o3-1', slug: 'on-grid-10kwp-3pha', name: 'Hệ On-Grid 10 kWp 3 pha', power: 10, battery: 0, price: 98000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
    { id: 'fb-o3-2', slug: 'on-grid-15kwp-3pha', name: 'Hệ On-Grid 15 kWp 3 pha', power: 15, battery: 0, price: 138000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'JA Solar', inverter_brand: 'Auxsol' },
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

  // Split combos into categories
  const { hybridOnePhase, hybridThreePhase, onGridOnePhase, onGridThreePhase } = useMemo(() => {
    const h1 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '1-phase');
    const h3 = allCombos.filter(c => c.system_type === 'hybrid' && c.phase === '3-phase');
    const o1 = allCombos.filter(c => c.system_type === 'on-grid' && c.phase === '1-phase');
    const o3 = allCombos.filter(c => c.system_type === 'on-grid' && c.phase === '3-phase');

    return {
      hybridOnePhase: h1.length > 0 ? h1 : fallbackHybridOnePhase,
      hybridThreePhase: h3.length > 0 ? h3 : fallbackHybridThreePhase,
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

        {/* Hybrid Products */}
        <ComboGridSection
          title="Điện mặt trởi Hy-Brid (Có pin lưu trữ) cho nguồn điện 1 pha"
          description="Hệ thống điện mặt trởi Hy-Brid, có bao gồm Pin lưu trữ Lithium, nên có thể vận hành độc lập với nguồn lưới điện. Giải pháp phù hợp với hóa đơn tiền điện trên 1.5 triệu/tháng. Biến tần mặt trởi Hy-Brid 1 pha bao gồm: 5 kW, 6 kW, 8  kW, 12 kW, 14 kW, 16kW"
          systemType="hybrid"
          phase="1-phase"
          combos={hybridOnePhase}
        />
        <ComboGridSection
          title="Điện mặt trởi Hy-Brid (Có pin lưu trữ) cho nguồn điện 3 pha"
          description="Hệ thống điện mặt trởi Hy-Brid, có bao gồm lithium nên có thể vận hành độc lập với nguồn lưới điện. Giải pháp phù hợp với hóa đơn tiền điện trên 3 triệu/tháng. Đối với nguồn điện 3 pha, SolarMax cung cấp giải pháp biến tần và pin lưu trữ điện áp thấp và áp cao"
          systemType="hybrid"
          phase="3-phase"
          combos={hybridThreePhase}
        />

        {/* On-Grid Products */}
        <ComboGridSection
          title="Điện mặt trởi On-Grid (Không Pin lưu trữ) cho nguồn điện 1 pha"
          description="Hệ thống điện mặt trởi On-Grid, là hệ thống vận hành kết hợp giữa nguồn điện mặt trởi, và nguồn điện lưới, không bao gồm Pin lưu trữ Lithium. Giải pháp phù hợp với hóa đơn tiền điện trên 1.5 triệu/tháng. Biến tần mặt trởi On-Grid 1 pha bao gồm: 5 kW, 10 kW"
          systemType="on-grid"
          phase="1-phase"
          combos={onGridOnePhase}
        />
        <ComboGridSection
          title="Điện mặt trởi On-Grid (Không Pin lưu trữ) cho nguồn điện 3 pha"
          description="Hệ thống điện mặt trởi On-Grid 3 pha là hệ thống vận hành kết hợp giữa nguồn điện mặt trởi và nguồn điện lưới, không bao gồm Pin lithium. Do vậy khi mất điện lưới hệ thống sẽ không sử dụng được. Phù hợp với hộ gia đình, văn phòng, nhà xưởng, nhà hàng chủ yếu dùng điện ban ngày và có hóa đơn trên 5 triệu/tháng. Biến tần mặt trởi - On-Grid 3 pha bao gồm: 10 kW, 15 kW, 20 kW, 30 kW, 40 kW, 50 kW, 60 kW, 75 kW, 80 kW, 100 kW, 110 kW."
          systemType="on-grid"
          phase="3-phase"
          combos={onGridThreePhase}
        />

        {/* Other sections */}
        <HuaweiSolutions />
        <IndustrialSolutions />
        <ContactConsultation />
        <BlogSection />
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
