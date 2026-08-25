/**
 * SolutionsLandingPage - Solar House Page
 * 
 * This page has been refactored into smaller, manageable components:
 * - Data: src/components/pages/solar-home/data/solar-home-data.ts
 * - Combo Cards: src/components/pages/solar-home/components/OnGridCombos.tsx
 * - Combo Cards: src/components/pages/solar-home/components/HybridCombos.tsx
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
  TrendUp,
  House,
  Users,
  Headphones,
  Lightning,
  ArrowRight,
  Phone,
  Clock,
  Building,
  BatteryHigh,
  CheckCircle,
  XCircle,
  DeviceMobile,
  ChartBar,
  Calendar,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { OnGridComboGrid, HybridComboGrid } from './components';
import ComboGridWithTabs from './components/ComboGridWithTabs';
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
import { getLocaleFromPathname } from '../../../i18n/messages';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const copy = {
  vi: {
    heroBadge: 'Điện Mặt Trời Cho Gia Đình Hiện Đại',
    heroTitle: ['Điện Mặt Trời cho', 'Gia Đình Hiện Đại'],
    heroLead:
      'Tiết kiệm chi phí điện hàng tháng, chủ động nguồn năng lượng và gia tăng giá trị ngôi nhà với giải pháp điện mặt trời được thiết kế riêng cho từng gia đình.',
    heroCta1: 'Nhận Thiết Kế Sơ Bộ Miễn Phí',
    heroCta2: 'Tính Nhanh Hiệu Quả Đầu Tư',
    housingTitle: 'Điện Mặt Trời Phù Hợp Với Nhiều Loại Hình Nhà Ở',
    housingLead: 'Dù bạn đang sống trong loại hình nhà nào, đều có giải pháp điện mặt trời phù hợp.',
    solutionsPill: 'Giải Pháp Solar House',
    solutionsTitle: '3 Giải Pháp Năng Lượng Cho Gia Đình',
    solutionsLead: 'Từ cơ bản đến nâng cao – Chọn giải pháp phù hợp với nhu cầu và ngân sách của bạn.',
    recommended: 'Được khuyến nghị',
    comparisonTitle: 'So Sánh Nhanh Các Giải Pháp',
    comparisonLead: 'Bảng so sánh giúp bạn đưa ra quyết định đúng đắn.',
    comparisonCtaLead: 'Không chắc giải pháp nào phù hợp?',
    comparisonCta: 'Tư vấn miễn phí với kỹ sư EPCVINA',
    comboPill: 'Hệ Thống Solar',
    comboTitle: 'Combo On-Grid & Hybrid Sẵn Sàng Lắp Đặt',
    comboLead: 'Các combo được thiết kế sẵn, tối ưu về hiệu suất và chi phí. On-Grid hoàn vốn nhanh, Hybrid có dự phòng mất điện.',
    calculatorTitle: 'Tính Nhanh Hệ Thống Phù Hợp',
    calculatorLead: 'Dựa trên hóa đơn điện hàng tháng, chúng tôi đề xuất công suất hệ thống phù hợp.',
    processTitle: '5 Bước Đơn Giản Để Sở Hữu Hệ Thống Điện Mặt Trời',
    whyTitle: 'Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện',
    whyLead: 'Khác biệt với phần lớn đơn vị bán solar hiện nay, EPCVINA nhấn mạnh năng lực kỹ thuật, an toàn điện và chất lượng thi công.',
    finalTitle: 'Bắt Đầu Hành Trình Tự Chủ Năng Lượng',
    finalLead: 'Từ hóa đơn điện hàng tháng của bạn, EPCVINA Solar sẽ đề xuất phương án phù hợp nhất giữa On-Grid, Hybrid hoặc Solar + BatteryHigh.',
    finalPhone: 'Tư vấn cùng kỹ sư EPCVINA Solar',
    section2: 'Giải Pháp Dành Cho Ai?',
    section3: 'Giải Pháp & So Sánh',
    section4: 'Tính Nhanh Hệ Thống Phù Hợp',
    section5: 'Quy Trình Triển Khai',
    section6: 'Tại Sao Chọn EPCVINA Solar?',
    section7: 'CTA Cuối Trang',
    criterion: 'Tiêu chí',
    noConfig: 'Không tìm thấy cấu hình phù hợp?',
    customSetup: 'Tư vấn cấu hình riêng',
    monthlyBill: 'Hóa đơn điện hàng tháng của bạn là bao nhiêu?',
    bill: 'Hóa đơn',
    suggestedSystem: 'Hệ đề xuất',
    displayedResults: 'Kết quả hiển thị:',
  },
  en: {
    heroBadge: 'Solar for Modern Families',
    heroTitle: ['Solar Power for', 'Modern Families'],
    heroLead:
      'Reduce your monthly electricity bill, gain energy independence, and add long-term value to your home with a solar solution designed around each household.',
    heroCta1: 'Get a Free Preliminary Design',
    heroCta2: 'Estimate Your ROI',
    housingTitle: 'Solar Solutions for Many Home Types',
    housingLead: 'No matter what type of home you live in, there is a solar solution that fits.',
    solutionsPill: 'Solar Home Solutions',
    solutionsTitle: '3 Energy Solutions for Families',
    solutionsLead: 'From entry-level to advanced, choose the option that matches your needs and budget.',
    recommended: 'Recommended',
    comparisonTitle: 'Quick Solution Comparison',
    comparisonLead: 'This comparison helps you make the right decision.',
    comparisonCtaLead: 'Not sure which solution fits best?',
    comparisonCta: 'Talk to EPCVINA engineers for free',
    comboPill: 'Solar Systems',
    comboTitle: 'Ready-to-Install On-Grid & Hybrid Combos',
    comboLead: 'Pre-built combos are optimized for performance and cost. On-Grid pays back fast, while Hybrid adds backup power.',
    calculatorTitle: 'Quick System Sizing',
    calculatorLead: 'Based on your monthly electricity bill, we suggest the right system capacity.',
    processTitle: '5 Simple Steps to Own a Solar System',
    whyTitle: 'Safe Solar from MEP Experts',
    whyLead: 'Unlike most solar resellers, EPCVINA focuses on engineering capability, electrical safety, and installation quality.',
    finalTitle: 'Start Your Energy Independence Journey',
    finalLead: 'Based on your monthly electricity bill, EPCVINA Solar will recommend the best fit between On-Grid, Hybrid, or Solar + BatteryHigh.',
    finalPhone: 'Talk to an EPCVINA Solar engineer',
    section2: 'Who Is This For?',
    section3: 'Solutions & Comparison',
    section4: 'Quick System Sizing',
    section5: 'Implementation Process',
    section6: 'Why Choose EPCVINA Solar?',
    section7: 'Final CTA',
    criterion: 'Criterion',
    noConfig: 'Could not find a suitable configuration?',
    customSetup: 'Talk to us about a custom setup',
    monthlyBill: 'What is your monthly electricity bill?',
    bill: 'Bill',
    suggestedSystem: 'Suggested system',
    displayedResults: 'Displayed results:',
  },
  zh: {
    heroBadge: '现代家庭太阳能',
    heroTitle: ['面向', '现代家庭的太阳能'],
    heroLead: '降低每月电费，获得能源自主，并通过专为家庭设计的太阳能方案提升住宅长期价值。',
    heroCta1: '获取免费初步设计',
    heroCta2: '快速估算投资回报',
    housingTitle: '适用于多种住宅类型的太阳能方案',
    housingLead: '无论您居住在何种住宅，都能找到合适的太阳能方案。',
    solutionsPill: '住宅太阳能方案',
    solutionsTitle: '面向家庭的 3 种能源方案',
    solutionsLead: '从基础到进阶，选择符合需求与预算的方案。',
    recommended: '推荐',
    comparisonTitle: '方案快速对比',
    comparisonLead: '这张对比表帮助您做出正确选择。',
    comparisonCtaLead: '还不确定哪种方案最适合？',
    comparisonCta: '免费咨询 EPCVINA 工程师',
    comboPill: '太阳能系统',
    comboTitle: '可直接安装的并网与混合方案',
    comboLead: '预设组合针对性能和成本进行了优化。并网回本快，混合方案可提供停电备用。',
    calculatorTitle: '快速系统估算',
    calculatorLead: '根据您的月度电费，我们会建议合适的系统容量。',
    processTitle: '拥有太阳能系统的 5 个简单步骤',
    whyTitle: '来自机电专家的安全太阳能',
    whyLead: '不同于大多数太阳能销售商，EPCVINA 更重视工程能力、电气安全和施工质量。',
    finalTitle: '开始您的能源自主之旅',
    finalLead: '根据您的月度电费，EPCVINA Solar 将为您推荐并网、混合或 Solar + BatteryHigh 的最佳方案。',
    finalPhone: '联系 EPCVINA Solar 工程师',
    section2: '适用于谁？',
    section3: '方案与对比',
    section4: '快速系统估算',
    section5: '实施流程',
    section6: '为什么选择 EPCVINA Solar？',
    section7: '页尾 CTA',
    criterion: '标准',
    noConfig: '当前没有找到合适的配置？',
    customSetup: '咨询定制方案',
    monthlyBill: '您的月度电费是多少？',
    bill: '电费',
    suggestedSystem: '建议系统',
    displayedResults: '显示结果：',
  },
  ja: {
    heroBadge: '現代家庭向け太陽光',
    heroTitle: ['現代家庭のための', '太陽光発電'],
    heroLead: '毎月の電気代を削減し、エネルギーの自立を実現し、家庭向けに設計された太陽光ソリューションで住まいの価値を高めます。',
    heroCta1: '無料の初期設計を دریافت',
    heroCta2: '投資回収を簡単に試算',
    housingTitle: 'さまざまな住宅タイプに対応する太陽光ソリューション',
    housingLead: 'どのような住宅にお住まいでも、適した太陽光ソリューションがあります。',
    solutionsPill: '住宅向けソリューション',
    solutionsTitle: '家族向けの 3 つのエネルギー方案',
    solutionsLead: '基本から上級まで、ニーズと予算に合うプランを選べます。',
    recommended: 'おすすめ',
    comparisonTitle: 'ソリューション比較',
    comparisonLead: 'この比較表で最適な選択をしやすくなります。',
    comparisonCtaLead: 'どのプランが合うか迷っていますか？',
    comparisonCta: 'EPCVINA の技術者に無料相談',
    comboPill: '太陽光システム',
    comboTitle: 'そのまま導入できるオン・グリッドとハイブリッド',
    comboLead: 'あらかじめ設計された組み合わせで、性能とコストを最適化しています。オン・グリッドは回収が早く、ハイブリッドは停電時の備えになります。',
    calculatorTitle: '簡単システム試算',
    calculatorLead: '月々の電気代をもとに、最適なシステム容量をご提案します。',
    processTitle: '太陽光システム導入までの 5 ステップ',
    whyTitle: '機電専門家による安全な太陽光',
    whyLead: '多くの太陽光販売会社とは異なり、EPCVINA は技術力・電気安全・施工品質を重視しています。',
    finalTitle: 'エネルギー自立への第一歩を',
    finalLead: '月々の電気代をもとに、EPCVINA Solar がオン・グリッド、ハイブリッド、または Solar + BatteryHigh の最適案をご提案します。',
    finalPhone: 'EPCVINA Solar の技術者に相談',
    section2: '対象となる方',
    section3: 'ソリューション比較',
    section4: '簡単システム試算',
    section5: '導入ステップ',
    section6: 'EPCVINA Solar を選ぶ理由',
    section7: '最後のCTA',
    criterion: '項目',
    noConfig: '適した構成が見つかりませんか？',
    customSetup: 'カスタム構成を相談する',
    monthlyBill: '月々の電気代はいくらですか？',
    bill: '電気代',
    suggestedSystem: '推奨システム',
    displayedResults: '表示結果：',
  },
  ko: {
    heroBadge: '현대 가정을 위한 태양광',
    heroTitle: ['현대 가정을 위한', '태양광 발전'],
    heroLead: '매월 전기요금을 줄이고, 에너지 자립을 높이며, 가정용으로 설계된 태양광 솔루션으로 집의 가치를 높입니다.',
    heroCta1: '무료 초기 설계 받기',
    heroCta2: '투자수익률 빠르게 계산',
    housingTitle: '다양한 주택 유형에 맞는 태양광 솔루션',
    housingLead: '어떤 주택에 거주하든, 적합한 태양광 솔루션이 있습니다.',
    solutionsPill: '주택용 솔루션',
    solutionsTitle: '가정을 위한 3가지 에너지 솔루션',
    solutionsLead: '기본형부터 고급형까지, 필요와 예산에 맞는 구성을 선택하세요.',
    recommended: '추천',
    comparisonTitle: '솔루션 비교',
    comparisonLead: '이 비교표로 올바른 선택을 도와드립니다.',
    comparisonCtaLead: '어떤 솔루션이 맞는지 고민되시나요?',
    comparisonCta: 'EPCVINA 엔지니어에게 무료 상담',
    comboPill: '태양광 시스템',
    comboTitle: '바로 설치 가능한 온그리드 및 하이브리드 조합',
    comboLead: '사전 구성된 조합은 성능과 비용을 최적화했습니다. 온그리드는 회수가 빠르고, 하이브리드는 정전 시 백업 전원을 제공합니다.',
    calculatorTitle: '빠른 시스템 산정',
    calculatorLead: '월 전기요금을 기준으로 적합한 시스템 용량을 제안합니다.',
    processTitle: '태양광 시스템을 갖추는 5단계',
    whyTitle: '기계전기 전문가가 만든 안전한 태양광',
    whyLead: '대부분의 태양광 판매업체와 달리, EPCVINA는 기술 역량, 전기 안전, 시공 품질을 중시합니다.',
    finalTitle: '에너지 자립 여정을 시작하세요',
    finalLead: '월 전기요금을 바탕으로 EPCVINA Solar가 온그리드, 하이브리드 또는 Solar + BatteryHigh 중 최적안을 제안합니다.',
    finalPhone: 'EPCVINA Solar 엔지니어와 상담',
    section2: '누구를 위한 솔루션인가요?',
    section3: '솔루션 및 비교',
    section4: '빠른 시스템 산정',
    section5: '도입 절차',
    section6: '왜 EPCVINA Solar인가요?',
    section7: '마지막 CTA',
    criterion: '기준',
    noConfig: '적합한 구성을 찾지 못하셨나요?',
    customSetup: '맞춤 구성 상담',
    monthlyBill: '월 전기요금은 얼마인가요?',
    bill: '전기요금',
    suggestedSystem: '추천 시스템',
    displayedResults: '표시 결과:',
  },
} as const;

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
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Page Component ───────────────────────────────── */

export default function SolutionsLandingPage({ pathname = '/' }: { pathname?: string }) {
  const localeFromPath = getLocaleFromPathname(pathname);
  const locale: Locale = (['vi', 'en', 'zh', 'ja', 'ko'].includes(localeFromPath) ? localeFromPath : 'vi') as Locale;
  const text = copy[locale];
  const translatedHeroHighlights =
    locale === 'en'
        ? [
          { label: 'Reduce electricity bills by 50–90%', icon: heroHighlights[0].icon },
          { label: 'Payback in 4–7 years', icon: heroHighlights[1].icon },
          { label: 'System lifespan over 25 years', icon: heroHighlights[2].icon },
          { label: 'Track production on your phone', icon: heroHighlights[3].icon },
          { label: 'Optional battery storage support', icon: heroHighlights[4].icon },
        ]
      : heroHighlights;
  const translatedHousingTypes =
    locale === 'en'
      ? [
          { type: 'Townhouse', icon: housingTypes[0].icon, features: ['Concrete or metal roof', 'Electricity bill from $40+/month', 'Want lower long-term energy cost'] },
          { type: 'Villa', icon: housingTypes[1].icon, features: ['Large roof area', 'Multiple high-power appliances', 'Prefer green energy solutions'] },
          { type: 'Apartment', icon: housingTypes[2].icon, features: ['Balcony or dedicated install area', 'Compact system for limited usage needs'] },
          { type: 'Household', icon: housingTypes[3].icon, features: ['2-8 family members', 'Air conditioners, water heaters, induction cookers, EVs'] },
        ]
      : housingTypes;
  const translatedSolutions =
    locale === 'en'
      ? [
          { ...solutionTypes[0], suitable: ['Stable grid area', 'Primary goal is bill savings'], advantages: ['Lowest upfront cost', 'Strong economics', 'Fast payback', 'No battery needed'], limitations: ['The system stops during a grid outage'] },
          { ...solutionTypes[1], suitable: ['Want to save money and keep backup power'], advantages: ['Works during outages', 'Automatically prioritizes solar power', 'More resilient to future electricity prices', 'Expandable with battery later'], limitations: [], note: 'The option EPCVINA recommends most often for new homes.' },
          { ...solutionTypes[2], suitable: ['Frequent outages', 'Premium villas', 'Homes with EVs', 'Want maximum energy independence'], advantages: ['Stores excess daytime power', 'Uses energy at night', 'Backup power during outages', 'Higher self-consumption rate'], limitations: [] },
        ]
      : solutionTypes;
  const translatedComparison =
    locale === 'en'
      ? comparisonData.map((row) => ({
          ...row,
          criterion:
            ({
              'Tấm pin mặt trời': 'Solar panels',
              'Inverter Hybrid': 'Hybrid inverter',
              'Pin lưu trữ (Battery)': 'Battery storage',
              'Kết nối điện lưới': 'Grid connection',
              'Hoạt động khi mất điện': 'Works during outage',
              'Dự phòng mất điện': 'Outage backup',
              'Sử dụng điện mặt trời ban ngày': 'Solar power by day',
              'Sử dụng điện mặt trời ban đêm': 'Solar power at night',
              'Lưu trữ điện dư': 'Store excess energy',
              'Tỷ lệ tự dùng điện mặt trời': 'Solar self-consumption rate',
            }[row.criterion] ?? row.criterion),
          ongrid: row.ongrid,
          hybrid: row.hybrid,
          hybridBattery: row.hybridBattery,
        }))
      : comparisonData;
  const translatedBillToSystem =
    locale === 'en'
      ? [
          { bill: '$40-$80', system: '3-5 kWp' },
          { bill: '$80-$160', system: '5-8 kWp' },
          { bill: '$160-$320', system: '8-12 kWp' },
          { bill: 'Above $320', system: 'Custom quote' },
        ]
      : billToSystem;
  const translatedCalculatorResults =
    locale === 'en'
      ? ['System capacity', 'Estimated energy output', 'Investment cost', 'Monthly savings', 'Payback period']
      : calculatorResults;
  const translatedSteps =
    locale === 'en'
      ? [
          { step: '01', title: 'Needs assessment', description: 'Collect electricity usage and roof conditions.' },
          { step: '02', title: 'Preliminary design', description: 'Simulate production and investment efficiency.' },
          { step: '03', title: 'Detailed quotation', description: 'Select the most suitable solution.' },
          { step: '04', title: 'Installation', description: 'EPCVINA engineers carry out the build.' },
          { step: '05', title: 'Operation & monitoring', description: 'Track performance remotely on your phone.' },
        ]
      : implementationSteps;
  const translatedWhyChooseUs =
    locale === 'en'
      ? [
          { category: 'EPC capability', icon: whyChooseUs[0].icon, items: ['Experience with MEP projects', 'Design based on technical standards', 'Focus on electrical and roof safety'] },
          { category: 'Optimized solution', icon: whyChooseUs[1].icon, items: ['No fixed-size sales package', 'Tailored for each household', 'Optimized for ROI'] },
          { category: 'Long-term support', icon: whyChooseUs[2].icon, items: ['Operations support', 'Remote monitoring', 'Scheduled maintenance', 'Future battery and EV charger expansion'] },
        ]
      : whyChooseUs;
  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <div className="relative">
        <HeaderBar pathname={pathname} />
        <section
          className="relative overflow-hidden bg-slate-900 text-white min-h-[70vh] sm:min-h-[80vh] flex items-center"
          aria-labelledby="hero-heading"
        >
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
              <img
              src="/images/solar-home/epcvinasolar-solar-home-hero.webp"
              alt={locale === 'vi' ? 'Ngôi nhà với hệ thống điện mặt trời trên mái' : 'House with rooftop solar system'}
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              width={1774}
              height={887}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-slate-900/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-900/20" />
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
                <span>{text.heroBadge}</span>
              </div>

              {/* H1 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                {text.heroTitle[0]}{' '}
                <span className="text-emerald-400">{text.heroTitle[1]}</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
                {text.heroLead}
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-8">
                {translatedHeroHighlights.map((highlight) => {
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
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 shadow-lg shadow-orange-500/25 min-h-[44px]"
                >
                  {text.heroCta1}
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-h-[44px]"
                >
                  {text.heroCta2}
                  <Lightning className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 – {text.section2}
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
                {text.housingTitle}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {text.housingLead}
              </p>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {translatedHousingTypes.map((housing, idx) => {
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
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
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
          SECTION 3 – {text.section3}
          Unified: Solution Cards + Comparison Table
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-white"
        aria-labelledby="solutions-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimateIn>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
                <Lightning className="h-4 w-4" aria-hidden="true" />
                {text.solutionsPill}
              </span>
              <h2
                id="solutions-heading"
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                {text.solutionsTitle}
              </h2>
              <p className="text-gray-500 text-lg max-w-3xl mx-auto">
                {text.solutionsLead}
              </p>
            </div>
          </AnimateIn>

          {/* Solution Cards */}
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {translatedSolutions.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <AnimateIn key={solution.name} delay={idx * 100}>
                  <div className={`relative rounded-2xl border-2 ${solution.recommended ? solution.borderColor : 'border-gray-200'} bg-white p-6 hover:shadow-xl transition-all duration-300 h-full ${solution.recommended ? 'shadow-lg' : ''}`}>
                    {solution.recommended && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${solution.gradient}`}>
                        {text.recommended}
                      </div>
                    )}
                    
                    <div className="text-center mb-5">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.gradient} text-white flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {solution.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {solution.suitable[0]}
                      </p>
                    </div>

                    <div className="space-y-3 mb-5">
                      {solution.advantages.slice(0, 3).map((adv) => (
                        <div key={adv} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{adv}</span>
                        </div>
                      ))}
                    </div>

                    {solution.limitations.length > 0 && (
                      <div className="mb-5 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-red-700 text-xs">{solution.limitations[0]}</span>
                        </div>
                      </div>
                    )}

                    {solution.note && (
                      <div className={`rounded-lg ${solution.bgLight} ${solution.textColor} px-3 py-2 text-xs font-medium`}>
                        {solution.note}
                      </div>
                    )}
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          {/* Comparison Table - Condensed */}
          <AnimateIn>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {text.comparisonTitle}
                </h3>
                <p className="text-gray-500 text-sm">
                  {text.comparisonLead}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white rounded-lg overflow-hidden">
                      <th className="text-left p-3 font-semibold text-gray-900 text-sm">{text.criterion}</th>
                      <th className="text-center p-3 font-semibold text-amber-700 text-sm bg-amber-50">
                        <div className="flex items-center justify-center gap-1">
                          <Sun className="h-4 w-4" />
                          On-Grid
                        </div>
                      </th>
                      <th className="text-center p-3 font-semibold text-emerald-700 text-sm bg-emerald-50">
                        <div className="flex items-center justify-center gap-1">
                          <Lightning className="h-4 w-4" />
                          Hybrid
                        </div>
                      </th>
                      <th className="text-center p-3 font-semibold text-blue-700 text-sm bg-blue-50">
                        <div className="flex items-center justify-center gap-1">
                          <BatteryHigh className="h-4 w-4" />
                          Hybrid + BatteryHigh
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-3 border-b border-gray-200 text-gray-900 text-sm">{row.criterion}</td>
                        <td className="p-3 border-b border-gray-200 text-center text-amber-700 bg-amber-50/30 text-sm font-medium">{row.ongrid}</td>
                        <td className="p-3 border-b border-gray-200 text-center text-emerald-700 bg-emerald-50/30 text-sm font-medium">{row.hybrid}</td>
                        <td className="p-3 border-b border-gray-200 text-center text-blue-700 bg-blue-50/30 text-sm font-medium">{row.hybridBattery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  {locale === 'en'
                    ? 'Showing the 10 most important criteria. Contact us for the full comparison sheet.'
                    : (locale === 'vi'
                      ? 'Hiển thị 10/16 tiêu chí quan trọng nhất. Liên hệ để nhận bảng so sánh đầy đủ.'
                      : 'Showing 10 of 16 key criteria. Contact us for the full comparison sheet.')}
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* CTA */}
          <AnimateIn delay={200}>
            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">{text.comparisonCtaLead}</p>
              <a
                href="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                <Phone className="h-4 w-4" />
                {text.comparisonCta}
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3.5 – COMBO GRID WITH TABS
          3 Rows: On-Grid, Hybrid, Hybrid + BatteryHigh
          Each row has tabs: 1-Phase, 3-Phase, 3-Phase Low, 3-Phase High
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="combo-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
                <Sun className="h-4 w-4" aria-hidden="true" />
                {text.comboPill}
              </span>
              <h2 id="combo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {text.comboTitle}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {text.comboLead}
              </p>
            </div>
          </AnimateIn>

          <ComboGridWithTabs />

          <AnimateIn delay={200}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">{text.noConfig}</p>
              <a
                href="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-colors min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {text.customSetup}
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 4 – {text.section4}
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
                {text.calculatorTitle}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {text.calculatorLead}
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {text.monthlyBill}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {billToSystem.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-500 mb-2">{text.bill}</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{item.bill}</div>
                    <div className="text-xs text-gray-400 mb-1">{text.suggestedSystem}</div>
                    <div className="text-xl font-bold text-emerald-600">{item.system}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{text.displayedResults}</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {translatedCalculatorResults.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
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
          SECTION 5 – {text.section5}
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
                {text.processTitle}
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
            {translatedSteps.map((step, idx) => (
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
            {translatedSteps.map((step, idx) => (
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
          SECTION 6 – {text.section6}
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
                {text.whyTitle}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {text.whyLead}
              </p>
            </div>
          </AnimateIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {translatedWhyChooseUs.map((item, idx) => {
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
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
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
          SECTION 7 – {text.section7}
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
              {text.finalTitle}
            </h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {text.finalLead}
            </p>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-lg shadow-orange-500/25 min-h-[44px]"
              >
                {text.heroCta1}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:0988446113"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl cursor-pointer transition-all duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px]"
              >
                <Phone className="h-5 w-5" />
                {text.finalPhone}
              </a>
            </div>
          </AnimateIn>

          <AnimateIn delay={300}>
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">EPCVINA Solar</span>
                {' '}{locale === 'vi' ? '– Điện Mặt Trời An Toàn Từ Chuyên Gia Cơ Điện' : ' - Safe solar from MEP experts'}
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 – FOOTER
          ═══════════════════════════════════════════════════════ */}
    </div>
  );
}
