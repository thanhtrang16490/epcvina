/**
 * SolutionsLandingPage - Solar Home Page
 * 
 * This page has been refactored into smaller, manageable components:
 * - Data: src/components/pages/solutions/data/solar-home-data.ts
 * - Combo Cards: src/components/pages/solutions/components/OnGridCombos.tsx
 * - Combo Cards: src/components/pages/solutions/components/HybridCombos.tsx
 * 
 * Main sections (in order):
 * 1. HeroSection
 * 2. HousingTypesSection
 * 3. SolutionCardsSection + ComparisonTableSection (merged)
 * 4. ComboGridSection (On-Grid + Hybrid)
 * 5. CalculatorSection
 * 6. ProcessSection
 * 7. WhyChooseUsSection
 * 8. FinalCTASection
 */

import {
  Sun,
  TrendingUp,
  Home,
  Users,
  Headphones,
  Zap,
  ArrowRight,
  Phone,
  Clock,
  Building2,
  Battery,
  CheckCircle2,
  XCircle,
  Smartphone,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import HeaderBar from '../../home/layout/HeaderBar';
import FooterSection from '../../home/layout/FooterSection';
import { OnGridComboGrid, HybridComboGrid } from './components';
import {
  heroHighlights,
  housingTypes,
  solutionTypes,
  comparisonData,
  billToSystem,
  calculatorResults,
  implementationSteps,
  whyChooseUs,
} from './data/solar-home-data';

/* ─── Animation Wrapper ─────────────────────────────────── */

function AnimateIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Main Page Component ───────────────────────────────── */

export default function SolutionsLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <div className="relative">
        <HeaderBar />
        <section
          className="relative overflow-hidden bg-slate-900 text-white min-h-[70vh] sm:min-h-[80vh] flex items-center"
          aria-labelledby="hero-heading"
        >
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"
              alt="Ngôi nhà với hệ thống điện mặt trời trên mái"
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-amber-500/10 rounded-full translate-y-1/3 -translate-x-1/4" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-20 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Điện Mặt Trời Cho Gia Đình Hiện Đại</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Điện Mặt Trời cho{' '}
                <span className="text-emerald-400">Gia Đình Hiện Đại</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                Tiết kiệm chi phí điện hàng tháng, chủ động nguồn năng lượng và gia tăng giá trị ngôi nhà với giải pháp điện mặt trời được thiết kế riêng cho từng gia đình.
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-8">
                {heroHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={highlight.label} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-200">{highlight.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 shadow-lg shadow-orange-500/25 min-h-[44px]"
                >
                  Nhận Thiết Kế Sơ Bộ Miễn Phí
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  Tính Nhanh Hiệu Quả Đầu Tư
                  <Zap className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 – GIẢI PHÁP DÀNH CHO AI?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="housing-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="housing-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Điện Mặt Trời Phù Hợp Với Nhiều Loại Hình Nhà Ở
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Dù bạn đang sống trong loại hình nhà nào, đều có giải pháp điện mặt trời phù hợp.
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {housingTypes.map((housing, idx) => {
              const Icon = housing.icon;
              return (
                <AnimateIn key={housing.type} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {housing.type}
                    </h3>
                    <ul className="space-y-2">
                      {housing.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 – CHỌN GIẢI PHÁP PHÙ HỢP (MERGED)
          Combines: 3 Cấp Độ + So Sánh Các Giải Pháp
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="solutions-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="solutions-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Chọn Giải Pháp Phù Hợp
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                3 Cấp Độ Giải Pháp Năng Lượng Gia Đình – Lựa chọn giải pháp phù hợp nhất với nhu cầu và điều kiện của bạn.
              </p>
            </div>
          </AnimateIn>

          {/* Solution Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {solutionTypes.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <AnimateIn key={solution.name} delay={idx * 100}>
                  <div className={`relative rounded-2xl border-2 ${solution.recommended ? solution.borderColor : 'border-gray-200'} bg-white p-6 hover:shadow-xl transition-all duration-300 h-full ${solution.recommended ? 'shadow-lg' : ''}`}>
                    {solution.recommended && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${solution.gradient}`}>
                        Khuyến nghị
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.gradient} text-white flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {solution.name}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Phù hợp khi:</h4>
                      <ul className="space-y-2">
                        {solution.suitable.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Ưu điểm:</h4>
                      <ul className="space-y-2">
                        {solution.advantages.map((adv) => (
                          <li key={adv} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {solution.limitations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Hạn chế:</h4>
                        <ul className="space-y-2">
                          {solution.limitations.map((lim) => (
                            <li key={lim} className="flex items-start gap-2 text-sm text-gray-600">
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{lim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {solution.note && (
                      <div className={`rounded-xl ${solution.bgLight} ${solution.textColor} px-4 py-3 text-sm font-medium`}>
                        {solution.note}
                      </div>
                    )}
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          {/* Comparison Table */}
          <AnimateIn>
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                So Sánh Chi Tiết Các Giải Pháp
              </h3>
              <p className="text-gray-500 text-base max-w-2xl mx-auto">
                Bảng so sánh chi tiết giúp bạn lựa chọn giải pháp phù hợp nhất.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-bold text-gray-900 border-b-2 border-gray-200">Tiêu chí</th>
                      <th className="text-center p-4 font-bold text-amber-700 border-b-2 border-amber-200 bg-amber-50">
                        <Sun className="h-5 w-5 mx-auto mb-1" />
                        On-Grid Solar
                      </th>
                      <th className="text-center p-4 font-bold text-emerald-700 border-b-2 border-emerald-200 bg-emerald-50">
                        <Zap className="h-5 w-5 mx-auto mb-1" />
                        Hybrid Solar
                      </th>
                      <th className="text-center p-4 font-bold text-blue-700 border-b-2 border-blue-200 bg-blue-50">
                        <Battery className="h-5 w-5 mx-auto mb-1" />
                        Hybrid + Battery
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4 border-b border-gray-200 text-gray-900 font-medium">{row.criterion}</td>
                        <td className="p-4 border-b border-gray-200 text-center text-amber-700 bg-amber-50/30 font-semibold">{row.ongrid}</td>
                        <td className="p-4 border-b border-gray-200 text-center text-emerald-700 bg-emerald-50/30 font-semibold">{row.hybrid}</td>
                        <td className="p-4 border-b border-gray-200 text-center text-blue-700 bg-blue-50/30 font-semibold">{row.hybridBattery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3.5 – ON-GRID COMBO GRID
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50" aria-labelledby="combo-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
                <Sun className="h-4 w-4" aria-hidden="true" />
                Hệ Thống Solar
              </span>
              <h2 id="combo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Combo On-Grid & Hybrid <span className="text-emerald-600">Sẵn Sàng Lắp Đặt</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Các combo được thiết kế sẵn, tối ưu về hiệu suất và chi phí. On-Grid hoàn vốn nhanh, Hybrid có dự phòng mất điện.
              </p>
            </div>
          </AnimateIn>

          <OnGridComboGrid />

          <AnimateIn delay={100}>
            <div className="mt-16">
              <HybridComboGrid />
            </div>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">Không tìm thấy cấu hình phù hợp?</p>
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Tư vấn cấu hình riêng
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 4 – TÍNH NHANH HỆ THỐNG PHÙ HỢP
          ═══════════════════════════════════════════════════════ */}
      <section
        id="calculator"
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="calculator-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="calculator-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Tính Nhanh Hệ Thống Phù Hợp
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Dựa trên hóa đơn điện hàng tháng, chúng tôi đề xuất công suất hệ thống phù hợp.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Hóa đơn điện hàng tháng của bạn là bao nhiêu?
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {billToSystem.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">Hóa đơn</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{item.bill}</div>
                    <div className="text-xs text-gray-400 mb-1">Hệ đề xuất</div>
                    <div className="text-xl font-bold text-emerald-600">{item.system}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Kết quả hiển thị:</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {calculatorResults.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 – QUY TRÌNH TRIỂN KHAI
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-gray-50"
        aria-labelledby="process-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="process-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                5 Bước Đơn Giản Để Sở Hữu Hệ Thống Điện Mặt Trời
              </h2>
            </div>
          </AnimateIn>

          {/* Desktop: Horizontal timeline */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 relative">
            {/* Connecting line */}
            <div
              className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-emerald-200"
              aria-hidden="true"
            />
            {implementationSteps.map((step, idx) => (
              <AnimateIn key={step.step} delay={idx * 100}>
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="sm:hidden space-y-0 relative">
            {/* Vertical line */}
            <div
              className="absolute left-7 top-6 bottom-6 w-0.5 bg-emerald-200"
              aria-hidden="true"
            />
            {implementationSteps.map((step, idx) => (
              <AnimateIn key={step.step} delay={idx * 80}>
                <div className="flex items-start gap-4 py-3 relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 relative z-10">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 – TẠI SAO CHỌN EPCVINA SOLAR?
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="why-us-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2
                id="why-us-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Khác biệt với phần lớn đơn vị bán solar hiện nay, EPCVINA nhấn mạnh năng lực kỹ thuật, an toàn điện và chất lượng thi công.
              </p>
            </div>
          </AnimateIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <AnimateIn key={item.category} delay={idx * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 h-full">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {item.category}
                    </h3>
                    <ul className="space-y-3">
                      {item.items.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-gray-600">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 – CTA CUỐI TRANG
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 sm:py-24 bg-slate-900 text-white overflow-hidden"
        aria-labelledby="final-cta-heading"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full translate-y-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <h2
              id="final-cta-heading"
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Bắt Đầu Hành Trình Tự Chủ Năng Lượng
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Từ hóa đơn điện hàng tháng của bạn, EPCVINA Solar sẽ đề xuất phương án phù hợp nhất giữa On-Grid, Hybrid hoặc Solar + Battery.
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-orange-500/25 min-h-[44px]"
              >
                Nhận Thiết Kế Sơ Bộ Miễn Phí
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:0912345678"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                <Phone className="h-5 w-5" />
                Tư vấn cùng kỹ sư EPCVINA Solar
              </a>
            </div>
          </AnimateIn>

          <AnimateIn delay={300}>
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">EPCVINA Solar</span>
                {' '}– Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 – FOOTER
          ═══════════════════════════════════════════════════════ */}
      <FooterSection />
    </div>
  );
}
