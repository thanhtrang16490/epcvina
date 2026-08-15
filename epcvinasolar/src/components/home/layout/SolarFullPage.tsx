import HeaderBar from './HeaderBar';
import HeroSection from '../hero/HeroSection';
import ComparisonSection from '../combos/ComparisonSection';
import SolarSolutionFinder from '../tools/SolarSolutionFinder';
import BenefitsSection from '../sections/BenefitsSection';
import MidPageCTA from '../sections/MidPageCTA';
import ProcessSection from '../sections/ProcessSection';
import ProjectsPreviewSection from '../sections/ProjectsPreviewSection';
import ReviewsSection from '../sections/ReviewsSection';
import FAQSection from '../sections/FAQSection';
import CTASection from '../contact/CTASection';
import FooterSection from './FooterSection';

export default function SolarFullPage({ pathname = '/' }: { pathname?: string }) {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <HeaderBar pathname={pathname} />
      <div>
      {/* 1. Hero — EPCVINA Solar brand, CTA, stats bar */}
      <div className="lg:-ml-16 lg:w-[calc(100%+4rem)]">
        <HeroSection pathname={pathname} />
      </div>

      {/* 2. So sánh Hybrid vs On-Grid — context trước khi dùng tool */}
      <ComparisonSection pathname={pathname} />

      {/* 3. Gói giải pháp — SolarSolutionFinder */}
      <SolarSolutionFinder pathname={pathname} />

      {/* 4. Lợi thế EPCVINA — 6 điểm cơ điện */}
      <BenefitsSection pathname={pathname} />

      {/* 4.5 Mid-page CTA — after Benefits */}
      <MidPageCTA variant="benefits" pathname={pathname} />

      {/* 5. Quy trình triển khai — 6 bước theo PDF */}
      <ProcessSection pathname={pathname} />

      {/* 6. Dự án thực tế — portfolio */}
      <ProjectsPreviewSection pathname={pathname} />

      {/* 7. Đánh giá khách hàng */}
      <ReviewsSection pathname={pathname} />

      {/* 7.5 Pricing teaser CTA — after Reviews */}
      <MidPageCTA variant="reviews" pathname={pathname} />

      {/* 8. FAQ */}
      <FAQSection pathname={pathname} />

      {/* 9. CTA — Form thu lead */}
      <CTASection pathname={pathname} />

      <FooterSection pathname={pathname} />
      </div>
    </div>
  );
}
