import {
  Building,
  Factory,
  ShoppingBag,
  Buildings,
  HardDrives,
  Heartbeat,
  Drop,
  PiggyBank,
  TrendUp,
  Medal,
  Bank,
  ShieldCheck,
  Thermometer,
  Warehouse,
  HardHat,
  ClipboardText,
  Cpu,
  Sun,
  Wrench,
  File,
  Lightning,
  CheckCircle,
  ArrowRight,
  Phone,
  Gear,
  Gauge,
  Leaf,
  Clock,
  Shield,
  Globe,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const copy: Record<Locale, any> = {
  vi: {
    badge: 'Thương Mại & Công Nghiệp',
    title: ['Giải Pháp Điện Mặt Trời cho', 'Thương Mại & Công Nghiệp'],
    lead: 'EPCVINA SOLAR — Tổng thầu EPC hàng đầu cung cấp giải pháp điện mặt trời toàn diện cho nhà máy, xưởng sản xuất, trung tâm thương mại. Công suất 100kWp đến 5MWp, tối ưu ROI và tuân thủ tiêu chuẩn quốc tế.',
    primaryCta: 'Tính Nhanh Hiệu Quả Đầu Tư',
    secondaryCta: 'Xem Báo Giá Trọn Gói',
    appLink: 'Xem trang ứng dụng công nghiệp',
    provinceLink: 'Xem landing tỉnh',
    clientBadge: 'Đối tượng khách hàng',
    clientTitle: ['Giải Pháp Dành Cho', 'Mô Hình Doanh Nghiệp'],
    clientLead: 'Hệ thống điện mặt trời phù hợp mọi loại hình doanh nghiệp thương mại và công nghiệp',
    benefitBadge: 'Lợi ích vượt trội',
    benefitTitle: ['Vì Sao Doanh Nghiệp Cần', 'Điện Mặt Trời'],
    benefitLead: 'Lợi ích kinh tế và chiến lược vượt trội cho doanh nghiệp',
    tierBadge: 'Quy mô hệ thống',
    tierTitle: ['Các Cấp', 'Công Suất Phổ Biến'],
    tierLead: 'Lựa chọn công suất theo nhu cầu tiêu thụ và diện tích mái.',
    tierHeaders: ['Công Suất', 'Ứng Dụng', 'Chi Phí', 'ROI', 'Loại'],
    processBadge: 'Quy trình triển khai',
    processTitle: ['Quy Trình', 'Triển Khai EPC'],
    processLead: 'Từ khảo sát đến vận hành, EPCVINA đồng hành trọn vòng đời dự án.',
    serviceBadge: 'Dịch vụ EPC trọn gói',
    serviceTitle: ['Dịch Vụ', 'EPCVINA'],
    serviceLead: 'Tổng thầu EPC trọn gói — từ khảo sát đến vận hành dài hạn, một đầu mối duy nhất cho doanh nghiệp',
    serviceCta: 'Tính Nhanh Hiệu Quả Đầu Tư',
    whyTitle: 'Tại sao chọn EPCVINA SOLAR?',
    whyItems: ['Tổng thầu EPC — một đầu mối duy nhất', '15+ năm kinh nghiệm M&E & điện mặt trời', 'Thiết bị chính hãng — bảo hành 25 năm', 'Giám sát chất lượng ISO 9001:2015', 'Hỗ trợ thủ tục pháp lý & đấu nối EVN', 'O&M chuyên nghiệp — vận hành 30 năm'],
    statsTitle: ['Những con số', 'chứng minh hiệu quả'],
    statsLead: 'Những con số chứng minh tiềm năng và hiệu quả của điện mặt trời công nghiệp',
    greenBadge: '100% năng lượng sạch — cam kết Net-Zero',
    ctaTitle: 'Sẵn sàng tối ưu chi phí điện cho doanh nghiệp?',
    ctaLead: 'Nhận tư vấn khảo sát, báo giá và mô phỏng ROI trong 24 giờ.',
    ctaPrimary: 'Liên hệ EPCVINA',
    ctaSecondary: 'Xem dự án thực tế',
  },
  en: {
    badge: 'Commercial & Industrial',
    title: ['Solar Solutions for', 'Commercial & Industrial Sites'],
    lead: 'EPCVINA SOLAR is a leading EPC contractor delivering end-to-end solar solutions for factories, production sites, and commercial complexes. Systems from 100kWp to 5MWp, optimized for ROI and international standards.',
    primaryCta: 'Estimate ROI',
    secondaryCta: 'View Turnkey Pricing',
    appLink: 'View industrial applications',
    provinceLink: 'View provincial landing page',
    clientBadge: 'Target clients',
    clientTitle: ['Built for', 'Business Models'],
    clientLead: 'Solar systems tailored for commercial and industrial operations',
    benefitBadge: 'Key benefits',
    benefitTitle: ['Why Businesses Need', 'Solar Power'],
    benefitLead: 'Strong economic and strategic advantages for businesses',
    tierBadge: 'System scale',
    tierTitle: ['Common', 'Capacity Ranges'],
    tierLead: 'Choose the right size based on consumption and roof area.',
    tierHeaders: ['Capacity', 'Application', 'Cost', 'ROI', 'Type'],
    processBadge: 'Delivery process',
    processTitle: ['EPC', 'Delivery Workflow'],
    processLead: 'From survey to operations, EPCVINA supports the full project lifecycle.',
    serviceBadge: 'Turnkey EPC services',
    serviceTitle: ['EPCVINA', 'Services'],
    serviceLead: 'A single EPC partner from survey to long-term operations',
    serviceCta: 'Estimate ROI',
    whyTitle: 'Why choose EPCVINA SOLAR?',
    whyItems: ['Single EPC partner - one point of contact', '15+ years of M&E and solar experience', 'Genuine equipment - 25-year warranty', 'ISO 9001:2015 quality control', 'Legal procedures and EVN interconnection support', 'Professional O&M - 30 years of operation'],
    statsTitle: ['Numbers that', 'prove performance'],
    statsLead: 'Key figures demonstrating the potential and efficiency of industrial solar',
    greenBadge: '100% clean energy - Net-Zero commitment',
    ctaTitle: 'Ready to reduce business electricity costs?',
    ctaLead: 'Get a site survey, quote, and ROI simulation within 24 hours.',
    ctaPrimary: 'Contact EPCVINA',
    ctaSecondary: 'View real projects',
  },
  zh: {
    badge: '工商业',
    title: ['工商业光伏解决方案', ''],
    lead: 'EPCVINA Solar 提供面向工厂、生产车间和商业综合体的一站式交钥匙光伏方案，容量从 100kWp 到 5MWp，兼顾投资回报与国际标准。',
    primaryCta: '快速测算投资回报',
    secondaryCta: '查看整包报价',
    appLink: '查看工商业应用',
    provinceLink: '查看省份落地页',
    clientBadge: '适用客户',
    clientTitle: ['适用于', '企业模式'],
    clientLead: '适用于各类工商业场景的光伏系统',
    benefitBadge: '核心优势',
    benefitTitle: ['企业为何需要', '光伏'],
    benefitLead: '为企业带来显著的经济与战略价值',
    tierBadge: '系统规模',
    tierTitle: ['常见', '装机容量'],
    tierLead: '按用电需求与屋顶面积选择合适容量。',
    tierHeaders: ['容量', '应用', '成本', 'ROI', '类型'],
    processBadge: '实施流程',
    processTitle: ['EPC', '实施流程'],
    processLead: '从勘察到运营，EPCVINA 覆盖项目全生命周期。',
    serviceBadge: '交钥匙 EPC 服务',
    serviceTitle: ['EPCVINA', '服务'],
    serviceLead: '从勘察到长期运营的一站式 EPC 合作伙伴',
    serviceCta: '快速测算投资回报',
    whyTitle: '为什么选择 EPCVINA Solar？',
    whyItems: ['单一 EPC 总包，沟通更高效', '15年以上机电与光伏经验', '正品设备，25年质保', 'ISO 9001:2015 质量管理', '协助法务流程与并网接入', '专业运维，30年运行支持'],
    statsTitle: ['证明效率的', '核心数字'],
    statsLead: '展示工商业光伏潜力与效率的关键数据',
    greenBadge: '100% 清洁能源 - Net-Zero 承诺',
    ctaTitle: '准备好降低企业电费了吗？',
    ctaLead: '24 小时内获取勘察、报价与回报测算。',
    ctaPrimary: '联系 EPCVINA',
    ctaSecondary: '查看真实项目',
  },
  ja: {
    badge: '商業・産業向け',
    title: ['太陽光ソリューション', '商業・産業施設向け'],
    lead: 'EPCVINA Solar は、工場・生産拠点・商業施設向けに、100kWp〜5MWp のターンキー太陽光ソリューションを提供します。ROI 最適化と国際基準に対応します。',
    primaryCta: '投資回収を試算',
    secondaryCta: '一括見積を見る',
    appLink: '産業向けアプリを見る',
    provinceLink: '地域別ページを見る',
    clientBadge: '対象顧客',
    clientTitle: ['こんな', '事業形態に'],
    clientLead: '商業・産業用途に最適な太陽光システム',
    benefitBadge: '主なメリット',
    benefitTitle: ['なぜ企業に', '太陽光が必要か'],
    benefitLead: '経済性と戦略面の両方で大きな効果があります。',
    tierBadge: 'システム規模',
    tierTitle: ['一般的な', '容量帯'],
    tierLead: '消費量と屋根面積に合わせて最適な容量を選定します。',
    tierHeaders: ['容量', '用途', '費用', 'ROI', '区分'],
    processBadge: '導入プロセス',
    processTitle: ['EPC', '導入フロー'],
    processLead: '現地調査から運用まで、EPCVINA が一貫対応します。',
    serviceBadge: 'EPC一括サービス',
    serviceTitle: ['EPCVINA', 'サービス'],
    serviceLead: '調査から長期運用まで一社完結の EPC パートナー',
    serviceCta: '投資回収を試算',
    whyTitle: 'なぜ EPCVINA Solar を選ぶのか？',
    whyItems: ['EPC一括対応 - 連絡窓口を一本化', '15年以上の設備・太陽光実績', '純正機器 - 25年保証', 'ISO 9001:2015 品質管理', '法手続きとEVN連系サポート', '専門 O&M - 30年運用支援'],
    statsTitle: ['実績を示す', '数字'],
    statsLead: '産業用太陽光の可能性と効果を示す主要数値',
    greenBadge: '100% クリーンエネルギー - Net-Zero への取り組み',
    ctaTitle: '企業の電気代削減を始めませんか？',
    ctaLead: '24 時間以内に現地調査・見積・ROI試算をご案内します。',
    ctaPrimary: 'EPCVINA に相談',
    ctaSecondary: '実績を見る',
  },
  ko: {
    badge: '상업·산업용',
    title: ['태양광 솔루션', '상업·산업 시설용'],
    lead: 'EPCVINA Solar는 공장, 생산시설, 상업 복합시설을 위한 100kWp~5MWp 규모의 턴키 태양광 솔루션을 제공합니다. ROI 최적화와 국제 기준을 반영합니다.',
    primaryCta: '투자수익률 계산',
    secondaryCta: '패키지 견적 보기',
    appLink: '산업용 적용 사례 보기',
    provinceLink: '지역 랜딩 보기',
    clientBadge: '대상 고객',
    clientTitle: ['이런', '사업 형태에'],
    clientLead: '상업·산업 환경에 맞춘 태양광 시스템',
    benefitBadge: '핵심 장점',
    benefitTitle: ['왜 기업에', '태양광이 필요한가'],
    benefitLead: '기업에 경제적·전략적으로 큰 이점을 제공합니다.',
    tierBadge: '시스템 규모',
    tierTitle: ['일반적인', '용량 범위'],
    tierLead: '소비량과 지붕 면적에 맞는 적정 용량을 선택하세요.',
    tierHeaders: ['용량', '적용', '비용', 'ROI', '구분'],
    processBadge: '도입 절차',
    processTitle: ['EPC', '도입 프로세스'],
    processLead: '현장 조사부터 운영까지 EPCVINA가 전 과정을 지원합니다.',
    serviceBadge: '턴키 EPC 서비스',
    serviceTitle: ['EPCVINA', '서비스'],
    serviceLead: '조사부터 장기 운영까지 한 번에 해결하는 EPC 파트너',
    serviceCta: '투자수익률 계산',
    whyTitle: '왜 EPCVINA Solar인가요?',
    whyItems: ['EPC 일괄 대응 - 단일 창구', '15년 이상 M&E 및 태양광 경험', '정품 장비 - 25년 보증', 'ISO 9001:2015 품질 관리', '법적 절차 및 EVN 계통 연계 지원', '전문 O&M - 30년 운영 지원'],
    statsTitle: ['성과를 증명하는', '숫자'],
    statsLead: '산업용 태양광의 잠재력과 효율을 보여주는 핵심 수치',
    greenBadge: '100% 청정에너지 - Net-Zero 약속',
    ctaTitle: '기업 전기요금 절감을 시작할 준비가 되셨나요?',
    ctaLead: '24시간 내에 현장 조사, 견적, ROI 시뮬레이션을 제공합니다.',
    ctaPrimary: 'EPCVINA 문의',
    ctaSecondary: '실제 프로젝트 보기',
  },
};

/* ─── Client Types (with images) ─── */
const clientTypes = [
  { icon: <Factory className="h-6 w-6" aria-hidden="true" />, label: 'Factories & production plants', desc: '2,000–10,000 m²', image: '/images/solar-cong-nghiep/nha-may-xuong-san-xuat.webp', alt: 'Factory with rooftop solar system' },
  { icon: <ShoppingBag className="h-6 w-6" aria-hidden="true" />, label: 'Retail centers & supermarkets', desc: 'Large roof area', image: '/images/solar-cong-nghiep/trung-tam-thuong-mai.webp', alt: 'Retail center with solar panels' },
  { icon: <Buildings className="h-6 w-6" aria-hidden="true" />, label: 'Office buildings & hotels', desc: 'Lower operating costs', image: '/images/solar-cong-nghiep/van-phong-khach-san.webp', alt: 'Office building with solar power system' },
  { icon: <Warehouse className="h-6 w-6" aria-hidden="true" />, label: 'Warehouses & logistics centers', desc: 'Wide roofs, easy installation', image: '/images/solar-cong-nghiep/kho-bai-logistics.webp', alt: 'Logistics warehouse with rooftop solar' },
  { icon: <HardDrives className="h-6 w-6" aria-hidden="true" />, label: 'Data centers & server farms', desc: 'Continuous power demand', image: '/images/solar-cong-nghiep/trung-tam-du-lieu.webp', alt: 'Data center powered by solar energy' },
  { icon: <Heartbeat className="h-6 w-6" aria-hidden="true" />, label: 'Healthcare facilities & hospitals', desc: 'Energy security', image: '/images/solar-cong-nghiep/benh-vien-co-so-y-te.webp', alt: 'Hospital with solar power system' },
];

const benefits = [
  {
    icon: <PiggyBank className="h-6 w-6" aria-hidden="true" />,
    title: 'Cost Savings',
    desc: 'Reduce electricity costs by 50–90%. Example: a 500kW plant can save 200–400 million VND per year.',
    gradient: 'from-cyan-600 to-cyan-500',
  },
  {
    icon: <TrendUp className="h-6 w-6" aria-hidden="true" />,
    title: 'High ROI',
    desc: 'Payback in 4–6 years, 30+ year lifespan = 24 years of net profit',
    gradient: 'from-green-600 to-green-500',
  },
  {
    icon: <Medal className="h-6 w-6" aria-hidden="true" />,
    title: 'Increase Asset Value',
    desc: 'Green Building certification, Net-Zero commitment, and ESG support',
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    icon: <Bank className="h-6 w-6" aria-hidden="true" />,
    title: 'Policy Support',
    desc: 'Sell surplus electricity under Decree 135/2024 and benefit from tax incentives',
    gradient: 'from-cyan-500 to-cyan-400',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
    title: 'Energy Security',
    desc: 'Greater power independence and fewer unplanned outages',
    gradient: 'from-violet-600 to-violet-500',
  },
  {
    icon: <Thermometer className="h-6 w-6" aria-hidden="true" />,
    title: 'Cooler Roofs',
    desc: 'Lower roof temperature by 3–5°C and reduce cooling costs',
    gradient: 'from-cyan-600 to-cyan-500',
  },
];

const systemTiers = [
  { capacity: '100–250kWp', application: 'Nhà xưởng nhỏ, văn phòng', cost: '1.2–3.75 tỷ', roi: '5–6 năm', tag: 'Nhỏ', tagColor: 'bg-sky-100 text-sky-700' },
  { capacity: '250–500kWp', application: 'Nhà máy vừa, siêu thị', cost: '3–7.5 tỷ', roi: '4–6 năm', tag: 'Vừa', tagColor: 'bg-cyan-100 text-cyan-700' },
  { capacity: '500kWp–1MWp', application: 'Nhà máy lớn, TTTM quy mô', cost: '6–15 tỷ', roi: '4–6 năm', tag: 'Lớn', tagColor: 'bg-violet-100 text-violet-700' },
  { capacity: '1–5MWp', application: 'Dự án công nghiệp lớn', cost: '12–75 tỷ', roi: '4–6 năm', tag: 'Công nghiệp', tagColor: 'bg-red-100 text-red-700' },
];

const processSteps = [
  { step: 1, title: 'Tư Vấn & Khảo Sát', time: '1–2 tuần', icon: <ClipboardText className="h-6 w-6" aria-hidden="true" /> },
  { step: 2, title: 'Thiết Kế Kỹ Thuật', time: '2–3 tuần', icon: <Cpu className="h-6 w-6" aria-hidden="true" /> },
  { step: 3, title: 'Phê Duyệt & Cấp Phép', time: '2–4 tuần', icon: <File className="h-6 w-6" aria-hidden="true" /> },
  { step: 4, title: 'Thi Công Lắp Đặt', time: '4–8 tuần', icon: <HardHat className="h-6 w-6" aria-hidden="true" /> },
  { step: 5, title: 'Kiểm Tra & Đấu Nối', time: '1–2 tuần', icon: <Lightning className="h-6 w-6" aria-hidden="true" /> },
  { step: 6, title: 'Vận Hành & O&M', time: '30 năm', icon: <Gear className="h-6 w-6" aria-hidden="true" /> },
];

const epcServices = [
  { icon: <ClipboardText className="h-6 w-6" aria-hidden="true" />, label: 'Tư vấn & Khảo sát chi tiết' },
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, label: 'Thiết kế hệ thống PV (PVsyst, AutoCAD Solar)' },
  { icon: <HardHat className="h-6 w-6" aria-hidden="true" />, label: 'Lắp đặt, giám sát chất lượng' },
  { icon: <Lightning className="h-6 w-6" aria-hidden="true" />, label: 'Đấu nối lưới, thủ tục pháp lý' },
  { icon: <Medal className="h-6 w-6" aria-hidden="true" />, label: 'Hỗ trợ cấp chứng chỉ Green Building' },
  { icon: <Wrench className="h-6 w-6" aria-hidden="true" />, label: 'Vận hành & Bảo dưỡng 30 năm' },
];

const stats = [
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '40,000+', label: 'MWp tiềm năng khu công nghiệp VN', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <PiggyBank className="h-6 w-6" aria-hidden="true" />, value: '12–15 triệu', label: 'VNĐ/kWp chi phí hiện tại', gradient: 'from-green-600 to-green-500' },
  { icon: <TrendUp className="h-6 w-6" aria-hidden="true" />, value: '4–6 năm', label: 'Hoàn vốn', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Shield className="h-6 w-6" aria-hidden="true" />, value: '30+', label: 'Năm tuổi thọ', gradient: 'from-cyan-500 to-cyan-400' },
];

export default function SolarCIPage({ locale = 'vi', pathname = '/' }: { locale?: Locale; pathname?: string }) {
  const t = copy[locale];
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar pathname={pathname} />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section data-header-theme="dark" className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="/images/solar-cong-nghiep/hero-khu-cong-nghiep.webp"
            alt="Hệ thống điện mặt trời công nghiệp trên mái nhà xưởng"
            loading="eager"
            width={1200}
            height={675}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-cyan-400/30 mb-6">
              <Sun className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span className="text-cyan-300 font-semibold tracking-wide">{t.badge}</span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              {t.title[0]}{' '}
              <span className="text-cyan-400">{t.title[1]}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/calculator"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/bao-gia"
                className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out border border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-cyan-100/80">
              <a href="/ung-dung/dien-cong-nghiep" className="underline underline-offset-4 decoration-cyan-300/40 hover:text-white">
                {t.appLink}
              </a>
              <span className="hidden sm:inline text-cyan-300/40">•</span>
              <a href="/dien-mat-troi-bac-ninh" className="underline underline-offset-4 decoration-cyan-300/40 hover:text-white">
                {t.provinceLink}
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        {/* ═══════════════════ Section 1 — Đối Tượng Khách Hàng ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="client-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <Building className="h-4 w-4" aria-hidden="true" />
                {t.clientBadge}
              </div>
              <h2 id="client-types-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.clientTitle[0]} <span className="text-cyan-600">{t.clientTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.clientLead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTypes.map((ct) => (
                <div
                  key={ct.label}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={ct.image}
                      alt={ct.alt}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600 mb-3">
                      {ct.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ct.label}</h3>
                    <p className="text-base text-gray-500 leading-relaxed">{ct.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 2 — Vì Sao Doanh Nghiệp Cần Điện Mặt Trời ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <TrendUp className="h-4 w-4" aria-hidden="true" />
                {t.benefitBadge}
              </div>
              <h2 id="benefits-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.benefitTitle[0]} <span className="text-cyan-600">{t.benefitTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.benefitLead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${b.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{b.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 3 — Phân Loại Hệ Thống ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="system-tiers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="system-tiers-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Phân Loại <span className="text-cyan-600">Hệ Thống</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Lựa chọn công suất phù hợp với nhu cầu doanh nghiệp
              </p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-cyan-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-left font-semibold">Ứng Dụng</th>
                    <th className="px-6 py-4 text-left font-semibold">Chi Phí</th>
                    <th className="px-6 py-4 text-left font-semibold">ROI</th>
                    <th className="px-6 py-4 text-center font-semibold">Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {systemTiers.map((tier, i) => (
                    <tr
                      key={tier.capacity}
                      className={`border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-bold text-cyan-700">{tier.capacity}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{tier.application}</td>
                      <td className="px-6 py-4 text-gray-700">{tier.cost}</td>
                      <td className="px-6 py-4 text-gray-600">{tier.roi}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${tier.tagColor}`}>
                          {tier.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {systemTiers.map((tier) => (
                <div
                  key={tier.capacity}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                      <span className="font-bold text-cyan-700 text-lg">{tier.capacity}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tier.tagColor}`}>
                      {tier.tag}
                    </span>
                  </div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ứng Dụng</span>
                      <span className="text-gray-900 font-medium">{tier.application}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chi Phí</span>
                      <span className="text-gray-900 font-medium">{tier.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">ROI</span>
                      <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 rounded-full px-3 py-1 text-xs font-medium">
                        <TrendUp className="h-3 w-3" aria-hidden="true" />
                        {tier.roi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 4 — Quy Trình Triển Khai ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="process-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Quy Trình <span className="text-cyan-600">Triển Khai</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                6 bước chuyên nghiệp từ tư vấn đến vận hành dài hạn
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((ps) => (
                <div
                  key={ps.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none relative"
                >
                  <div className="absolute top-4 right-4 text-5xl font-black text-cyan-50 select-none" aria-hidden="true">
                    {ps.step}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                      {ps.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ps.title}</h3>
                    <p className="text-base text-cyan-600 font-medium">{ps.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 5 — Dịch Vụ EPCVINA ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="epc-services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: services */}
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                  <Gear className="h-4 w-4" aria-hidden="true" />
                  Dịch vụ EPC trọn gói
                </div>
                <h2 id="epc-services-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Dịch Vụ <span className="text-cyan-600">EPCVINA</span>
                </h2>
                <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-prose">
                  Tổng thầu EPC trọn gói — từ khảo sát đến vận hành dài hạn, một đầu mối duy nhất cho doanh nghiệp
                </p>
                <div className="space-y-4">
                  {epcServices.map((svc) => (
                    <div key={svc.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 flex-shrink-0 mt-0.5">
                        {svc.icon}
                      </div>
                      <span className="text-base text-gray-700 font-medium leading-relaxed">{svc.label}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/calculator"
                  className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none text-base min-h-[44px]"
                >
                  Tính Nhanh Hiệu Quả Đầu Tư
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              {/* Right: why choose EPCVINA */}
              <div className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 rounded-2xl p-8 sm:p-10 text-white">
                <h3 className="text-xl font-bold mb-6">Tại sao chọn EPCVINA SOLAR?</h3>
                <ul className="space-y-4">
                  {[
                    { icon: <CheckCircle className="h-5 w-5" aria-hidden="true" />, text: 'Tổng thầu EPC — một đầu mối duy nhất' },
                    { icon: <Clock className="h-5 w-5" aria-hidden="true" />, text: '15+ năm kinh nghiệm M&E & điện mặt trời' },
                    { icon: <Shield className="h-5 w-5" aria-hidden="true" />, text: 'Thiết bị chính hãng — bảo hành 25 năm' },
                    { icon: <Medal className="h-5 w-5" aria-hidden="true" />, text: 'Giám sát chất lượng ISO 9001:2015' },
                    { icon: <File className="h-5 w-5" aria-hidden="true" />, text: 'Hỗ trợ thủ tục pháp lý & đấu nối EVN' },
                    { icon: <Wrench className="h-5 w-5" aria-hidden="true" />, text: 'O&M chuyên nghiệp — vận hành 30 năm' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">{item.icon}</span>
                      <span className="text-base text-gray-200 leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Stats ═══════════════════ */}
        <section data-header-theme="dark" className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold">
                Thông Số <span className="text-cyan-400">Nổi Bật</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                Những con số chứng minh tiềm năng và hiệu quả của điện mặt trời công nghiệp
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-base text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-5 py-2.5 text-base text-cyan-300 font-medium">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                100% năng lượng sạch — cam kết Net-Zero
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Sun className="h-8 w-8 text-cyan-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Sẵn Sàng Tiết Kiệm Chi Phí Điện?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay để nhận tư vấn miễn phí và bản đề xuất kỹ thuật dành riêng cho doanh nghiệp của bạn.
                </p>
                <a
                  href="/calculator"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Nhận Tư Vấn Miễn Phí
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
