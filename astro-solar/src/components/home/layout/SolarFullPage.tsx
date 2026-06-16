import HeaderBar from './HeaderBar';
import HeroSection from '../hero/HeroSection';
import ComparisonSection from '../combos/ComparisonSection';
import SolarSolutionFinder from '../tools/SolarSolutionFinder';
import BenefitsSection from '../sections/BenefitsSection';
import ProcessSection from '../sections/ProcessSection';
import ProjectsPreviewSection from '../sections/ProjectsPreviewSection';
import ReviewsSection from '../sections/ReviewsSection';
import FAQSection from '../sections/FAQSection';
import CTASection from '../contact/CTASection';
import FooterSection from './FooterSection';

export default function SolarFullPage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <HeaderBar />
      <div>
      {/* 1. Hero — EPCVINA Solar brand, CTA, stats bar */}
      <div className="lg:-ml-16 lg:w-[calc(100%+4rem)]">
        <HeroSection />
      </div>

      {/* 2. So sánh Hybrid vs On-Grid — context trước khi dùng tool */}
      <ComparisonSection />

      {/* 3. Gói giải pháp — SolarSolutionFinder */}
      <SolarSolutionFinder />

      {/* 4. Lợi thế EPCVINA — 6 điểm cơ điện */}
      <BenefitsSection />

      {/* 5. Quy trình triển khai — 6 bước theo PDF */}
      <ProcessSection />

      {/* 6. Dự án thực tế — portfolio */}
      <ProjectsPreviewSection />

      {/* 7. Đánh giá khách hàng */}
      <ReviewsSection />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. CTA — Form thu lead */}
      <CTASection />

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
