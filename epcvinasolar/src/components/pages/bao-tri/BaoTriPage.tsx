import {
  Monitor,
  Drop,
  Wrench,
  ShieldWarning,
  ChartBar,
  Warning,
  TrendUp,
  Clock,
  Phone,
  CheckCircle,
  ArrowRight,
  Pulse,
  Lightning,
  Sun,
  Gauge,
  Headphones,
  Shield,
  Medal,
  Eye,
  ThumbsUp,
  File,
  ClipboardText,
  Gear,
  Radio,
  Sparkle,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { getLocaleFromPathname } from '../../../i18n/messages';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const copy: Record<Locale, any> = {
  vi: {
    badge: 'Vận Hành & Bảo Trì',
    title: ['Dịch Vụ O&M', 'Điện Mặt Trời'],
    lead: 'EPCVINA SOLAR cung cấp dịch vụ vận hành & bảo trì chuyên nghiệp — tối đa hóa hiệu suất, kéo dài tuổi thọ hệ thống, giảm thiểu rủi ro.',
    cta: 'Đăng Ký Dịch Vụ O&M',
    statsHeading: ['Hiệu Quả', 'O&M'],
    statsLead: 'Những con số chứng minh giá trị của dịch vụ vận hành & bảo trì chuyên nghiệp',
    statsTag: 'Đảm bảo hiệu suất — tối đa hóa lợi nhuận đầu tư',
    whyBadge: 'Tại sao cần O&M',
    whyTitle: ['Không Bảo Trì =', 'Lỗ Hổng Lớn'],
    whyLead: 'Những con số cho thấy rủi ro khi bỏ qua bảo trì hệ thống điện mặt trời',
    servicesBadge: 'Dịch vụ toàn diện',
    servicesTitle: ['Các Dịch Vụ', 'O&M'],
    servicesLead: 'Giải pháp bảo trì toàn diện cho hệ thống điện mặt trời',
    packagesBadge: 'Gói dịch vụ',
    packagesTitle: ['Gói Dịch Vụ', 'O&M'],
    packagesLead: 'Lựa chọn gói phù hợp với quy mô hệ thống điện mặt trời',
    packagesHeaders: ['Gói', 'Công Suất', 'Chi Phí', 'Giám Sát', 'Vệ Sinh', 'Sửa Chữa', 'Hỗ Trợ'],
    processBadge: 'Quy trình xử lý',
    processTitle: ['Quy Trình', 'Hỗ Trợ'],
    processLead: 'Quy trình xử lý sự cố nhanh chóng & chuyên nghiệp — 7 bước đảm bảo',
    ctaTitle: 'Sẵn Sàng Tối Ưu Hệ Thống Điện Mặt Trời?',
    ctaLead: 'Liên hệ ngay để được tư vấn gói O&M phù hợp với hệ thống của bạn. Đội ngũ kỹ sư EPCVINA sẵn sàng hỗ trợ 24/7.',
    ctaPrimary: 'Đăng Ký Dịch Vụ O&M',
    ctaPhone: '0988 446 113',
  },
  en: {
    badge: 'Operations & Maintenance',
    title: ['Solar O&M', 'Services'],
    lead: 'EPCVINA SOLAR delivers professional operations & maintenance services to maximize performance, extend system life, and reduce risk.',
    cta: 'Register for O&M service',
    statsHeading: ['Why O&M', 'Works'],
    statsLead: 'Numbers that prove the value of professional operations and maintenance',
    statsTag: 'Performance guaranteed - maximize investment returns',
    whyBadge: 'Why O&M matters',
    whyTitle: ['No maintenance =', 'big risk'],
    whyLead: 'These numbers show the risk of skipping solar maintenance',
    servicesBadge: 'Full service',
    servicesTitle: ['O&M', 'Services'],
    servicesLead: 'Comprehensive maintenance solutions for solar systems',
    packagesBadge: 'Service plans',
    packagesTitle: ['O&M', 'Plans'],
    packagesLead: 'Choose the right plan for your solar system size',
    packagesHeaders: ['Plan', 'Capacity', 'Cost', 'Monitoring', 'Cleaning', 'Repair', 'Support'],
    processBadge: 'Resolution flow',
    processTitle: ['Support', 'Workflow'],
    processLead: 'Fast, professional issue handling - 7 clear steps',
    ctaTitle: 'Ready to optimize your solar system?',
    ctaLead: 'Contact us to get the right O&M package for your system. EPCVINA engineers are ready 24/7.',
    ctaPrimary: 'Register for O&M service',
    ctaPhone: '0988 446 113',
  },
  zh: {
    badge: '运维与保养',
    title: ['光伏 O&M', '服务'],
    lead: 'EPCVINA Solar 提供专业的运维与保养服务，提升效率、延长寿命并降低风险。',
    cta: '申请 O&M 服务',
    statsHeading: ['运维', '价值'],
    statsLead: '专业运维保养的价值数据',
    statsTag: '保障效率，最大化投资回报',
    whyBadge: '为何需要运维',
    whyTitle: ['不保养 =', '大风险'],
    whyLead: '这些数据说明忽视运维的风险',
    servicesBadge: '全面服务',
    servicesTitle: ['O&M', '服务'],
    servicesLead: '为光伏系统提供全面保养方案',
    packagesBadge: '服务方案',
    packagesTitle: ['O&M', '方案'],
    packagesLead: '按系统规模选择合适方案',
    packagesHeaders: ['方案', '容量', '费用', '监控', '清洗', '维修', '支持'],
    processBadge: '处理流程',
    processTitle: ['支持', '流程'],
    processLead: '快速专业的故障处理流程 - 7 个步骤',
    ctaTitle: '准备好优化光伏系统了吗？',
    ctaLead: '联系我们，为您的系统选择合适的 O&M 方案。EPCVINA 工程师 24/7 待命。',
    ctaPrimary: '申请 O&M 服务',
    ctaPhone: '0988 446 113',
  },
  ja: {
    badge: '運用・保守',
    title: ['太陽光 O&M', 'サービス'],
    lead: 'EPCVINA Solar は、性能向上・長寿命化・リスク低減を実現するプロフェッショナルな O&M サービスを提供します。',
    cta: 'O&M サービスに申し込む',
    statsHeading: ['O&M の', '効果'],
    statsLead: 'プロの運用保守の価値を示す数値',
    statsTag: '性能を保証し、投資効果を最大化',
    whyBadge: 'なぜ O&M が必要か',
    whyTitle: ['保守なし =', '大きなリスク'],
    whyLead: '保守を省略した場合のリスクを示す数値',
    servicesBadge: '総合サービス',
    servicesTitle: ['O&M', 'サービス'],
    servicesLead: '太陽光システム向けの総合保守ソリューション',
    packagesBadge: 'サービスプラン',
    packagesTitle: ['O&M', 'プラン'],
    packagesLead: 'システム規模に合ったプランを選択',
    packagesHeaders: ['プラン', '容量', '費用', '監視', '清掃', '修理', 'サポート'],
    processBadge: '対応フロー',
    processTitle: ['サポート', 'フロー'],
    processLead: '迅速かつ専門的な障害対応 - 7 ステップ',
    ctaTitle: '太陽光システムを最適化しませんか？',
    ctaLead: 'システムに合った O&M プランをご案内します。EPCVINA の技術者が 24 時間対応します。',
    ctaPrimary: 'O&M サービスに申し込む',
    ctaPhone: '0988 446 113',
  },
  ko: {
    badge: '운영·유지보수',
    title: ['태양광 O&M', '서비스'],
    lead: 'EPCVINA Solar는 효율 극대화, 수명 연장, 리스크 감소를 위한 전문 운영·유지보수 서비스를 제공합니다.',
    cta: 'O&M 서비스 신청',
    statsHeading: ['O&M의', '효과'],
    statsLead: '전문 운영·유지보수의 가치를 보여주는 수치',
    statsTag: '성능 보장, 투자수익 극대화',
    whyBadge: '왜 O&M이 필요한가',
    whyTitle: ['유지보수 없음 =', '큰 위험'],
    whyLead: '유지보수를 생략했을 때의 위험을 보여주는 수치',
    servicesBadge: '종합 서비스',
    servicesTitle: ['O&M', '서비스'],
    servicesLead: '태양광 시스템을 위한 종합 유지보수 솔루션',
    packagesBadge: '서비스 패키지',
    packagesTitle: ['O&M', '패키지'],
    packagesLead: '시스템 규모에 맞는 패키지를 선택하세요',
    packagesHeaders: ['패키지', '용량', '비용', '모니터링', '청소', '수리', '지원'],
    processBadge: '처리 절차',
    processTitle: ['지원', '워크플로우'],
    processLead: '빠르고 전문적인 장애 처리 - 7단계',
    ctaTitle: '태양광 시스템을 최적화할 준비가 되셨나요?',
    ctaLead: '시스템에 맞는 O&M 패키지를 안내드립니다. EPCVINA 엔지니어가 24/7 지원합니다.',
    ctaPrimary: 'O&M 서비스 신청',
    ctaPhone: '0988 446 113',
  },
};

/* ─── Stats ─── */
const stats = [
  { icon: <TrendUp className="h-6 w-6" aria-hidden="true" />, value: '15–20%', label: 'Tăng sản lượng với O&M', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <Pulse className="h-6 w-6" aria-hidden="true" />, value: '80%', label: 'Giảm thời gian dừng hệ thống', gradient: 'from-green-600 to-green-500' },
  { icon: <Gauge className="h-6 w-6" aria-hidden="true" />, value: '60%', label: 'Giảm chi phí sửa chữa', gradient: 'from-teal-600 to-teal-500' },
  { icon: <Headphones className="h-6 w-6" aria-hidden="true" />, value: '24/7', label: 'Monitoring & support', gradient: 'from-cyan-600 to-cyan-500' },
];

/* ─── Why O&M ─── */
const whyOMItems = [
  {
    icon: <Warning className="h-6 w-6" aria-hidden="true" />,
    value: '36%',
    label: 'Output drops without panel cleaning',
    color: 'text-red-500',
    bg: 'bg-red-50',
    image: '/images/bao-tri/tam-pin-bam-bui.webp',
    alt: 'Tấm pin mặt trời bám bụi giảm hiệu suất',
  },
  {
    icon: <Clock className="h-6 w-6" aria-hidden="true" />,
    value: '10–15 năm',
    label: 'Inverter lifespan requires regular inspection',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    image: '/images/bao-tri/kiem-tra-inverter.webp',
    alt: 'Kiểm tra bảo dưỡng inverter điện mặt trời',
  },
  {
    icon: <Lightning className="h-6 w-6" aria-hidden="true" />,
    value: '500K–2 triệu/năm',
    label: 'Routine O&M vs emergency repair costs',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    image: '/images/bao-tri/bao-tri-phong-ngua.webp',
    alt: 'Kỹ thuật viên bảo trì hệ thống điện mặt trời',
  },
  {
    icon: <TrendUp className="h-6 w-6" aria-hidden="true" />,
    value: '15–20%',
    label: 'Average output increase with professional O&M',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    image: '/images/bao-tri/he-thong-hieu-suat-cao.webp',
    alt: 'Hệ thống điện mặt trời hoạt động tối ưu',
  },
];

/* ─── Services (with images) ─── */
const services = [
  {
    icon: <Monitor className="h-6 w-6" aria-hidden="true" />,
    title: '24/7 Remote Monitoring',
    subtitle: 'Remote Monitoring',
    items: [
      'Data logger records every 5 minutes',
      'Real-time web/mobile app',
      'Instant fault alerts',
      'Metrics: power, temperature, current/voltage, accumulated energy',
    ],
    image: '/images/bao-tri/giam-sat-tu-xa.webp',
    alt: 'Remote solar system monitoring dashboard',
    tag: 'Real-time',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: <Drop className="h-6 w-6" aria-hidden="true" />,
    title: 'Panel Cleaning',
    subtitle: 'Panel Cleaning',
    items: [
      '2–6 times per year depending on location',
      'Clean water + soft brush, no high pressure',
      'Boost output by 15–36%',
      'Cost: 200K–500K per visit',
    ],
    image: '/images/bao-tri/ve-sinh-tam-pin.webp',
    alt: 'Professional solar panel cleaning',
    tag: 'Tăng 36%',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    icon: <Wrench className="h-6 w-6" aria-hidden="true" />,
    title: 'Preventive Inspection & Maintenance',
    subtitle: 'Preventive Maintenance',
    items: [
      'Weekly: visual inspection',
      'Monthly: monitoring data review',
      'Quarterly: cleaning and connection checks',
      'Yearly: inverter testing, filter replacement',
      '10 years: evaluate inverter replacement',
    ],
    image: '/images/bao-tri/kiem-tra-dinh-ky.webp',
    alt: 'Technician maintaining a solar system',
    tag: 'Định kỳ',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <ShieldWarning className="h-6 w-6" aria-hidden="true" />,
    title: 'Corrective Maintenance',
    subtitle: 'Corrective Maintenance',
    items: [
      'Inverter disconnection, overheating, grounding issues',
      'Cable replacement, board repair, fan replacement',
      'Resolve within 24 hours',
    ],
    image: '/images/bao-tri/sua-chua-khan-cap.webp',
    alt: 'Rooftop solar system repair',
    tag: '24 giờ',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    icon: <ChartBar className="h-6 w-6" aria-hidden="true" />,
    title: 'Performance Analytics',
    subtitle: 'Performance Analytics',
    items: [
      'Detailed monthly and annual reports',
      'PR (Performance Ratio) > 80%',
      'Forecast vs actual comparison',
      'System upgrade recommendations',
    ],
    image: '/images/bao-tri/phan-tich-hieu-suat.webp',
    alt: 'Solar performance analytics',
    tag: 'Analytics',
    tagColor: 'bg-violet-100 text-violet-700',
  },
];

/* ─── Packages (table data) ─── */
const packages = [
  {
    name: 'Basic',
    power: '100–250kWp',
    price: '2–3 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '2 lần/năm',
    repair: '—',
    support: 'Business hours',
    highlight: false,
    tag: 'Small',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Standard',
    power: '250–500kWp',
    price: '4–6 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '4 lần/năm',
    repair: 'Minor repairs',
    support: '8/7',
    highlight: true,
    tag: 'Medium',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Premium',
    power: '500kWp+',
    price: '8–15 triệu',
    period: '/năm',
    monitoring: '24/7',
    cleaning: '6 lần/năm',
    repair: 'Thay linh kiện',
    support: '24/7 ưu tiên',
    highlight: false,
    tag: 'Lớn',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Turnkey EPC',
    power: 'Bất kỳ',
    price: 'Tùy chỉnh',
    period: '',
    monitoring: '24/7',
    cleaning: 'Không giới hạn',
    repair: 'Full coverage',
    support: '24/7 ưu tiên',
    highlight: false,
    tag: 'Turnkey',
    tagColor: 'bg-amber-100 text-amber-700',
  },
];

/* ─── Commitments ─── */
const commitments = [
  { icon: <Gauge className="h-6 w-6" aria-hidden="true" />, label: 'PR ≥ 80%', desc: 'International-standard performance ratio', gradient: 'from-emerald-600 to-emerald-500' },
  { icon: <TrendUp className="h-6 w-6" aria-hidden="true" />, label: '≤ 0.5%/year', desc: 'Output decline kept below 0.5% annually', gradient: 'from-green-600 to-green-500' },
  { icon: <Clock className="h-6 w-6" aria-hidden="true" />, label: '< 24 hours', desc: 'Emergency repair within 24 hours', gradient: 'from-teal-600 to-teal-500' },
  { icon: <Shield className="h-6 w-6" aria-hidden="true" />, label: '30 years', desc: 'Panel warranty', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Medal className="h-6 w-6" aria-hidden="true" />, label: '5–10 years', desc: 'Inverter warranty', gradient: 'from-amber-600 to-amber-500' },
];

/* ─── Process Steps ─── */
const processSteps = [
  { step: 1, title: 'Issue Detection', desc: 'Automatic alerts or customer detection', icon: <Radio className="h-6 w-6" aria-hidden="true" /> },
  { step: 2, title: 'Contact EPCVINA', desc: 'Hotline, email, or chat - immediate response', icon: <Phone className="h-6 w-6" aria-hidden="true" /> },
  { step: 3, title: 'Remote Check', desc: 'Engineers analyze monitoring data', icon: <Eye className="h-6 w-6" aria-hidden="true" /> },
  { step: 4, title: 'Classify & Assess', desc: 'Determine severity and response plan', icon: <ClipboardText className="h-6 w-6" aria-hidden="true" /> },
  { step: 5, title: 'Resolve Issue', desc: 'Remote guidance or on-site technician dispatch', icon: <Wrench className="h-6 w-6" aria-hidden="true" /> },
  { step: 6, title: 'Completion Report', desc: 'Confirm fix and provide detailed report', icon: <File className="h-6 w-6" aria-hidden="true" /> },
  { step: 7, title: 'Continuous Monitoring', desc: 'Track performance and prevent recurrence', icon: <Gear className="h-6 w-6" aria-hidden="true" /> },
];

export default function BaoTriPage({ pathname = '/' }: { pathname?: string }) {
  const locale = (['vi', 'en', 'zh', 'ja', 'ko'].includes(getLocaleFromPathname(pathname)) ? getLocaleFromPathname(pathname) : 'vi') as Locale;
  const t = copy[locale];
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with HeaderBar floating over */}
      <div className="relative">
        <HeaderBar pathname={pathname} />
        {/* ═══════════════════ Hero Section ═══════════════════ */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] sm:min-h-[70vh]">
          {/* Background image */}
          <img
            src="/images/bao-tri/hero-van-hanh-bao-tri.webp"
            alt="Hệ thống điện mặt trời được vận hành và bảo trì chuyên nghiệp"
            loading="eager"
            width={1200}
            height={675}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-emerald-400/30 mb-6">
              <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span className="text-emerald-300 font-semibold tracking-wide">{t.badge}</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              {t.title[0]}{' '}
              <span className="text-emerald-400">{t.title[1]}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        {/* ═══════════════════ Stats Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="stats-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold">
                {t.statsHeading[0]} <span className="text-emerald-400">{t.statsHeading[1]}</span> Nói Lên Tất Cả
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.statsLead}
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
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-5 py-2.5 text-base text-emerald-300 font-medium">
                <Sparkle className="h-4 w-4" aria-hidden="true" />
                {t.statsTag}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 1: Tại Sao Cần O&M ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="why-om-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Warning className="h-4 w-4" aria-hidden="true" />
                {t.whyBadge}
              </div>
              <h2 id="why-om-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.whyTitle[0]} <span className="text-emerald-600">{t.whyTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.whyLead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyOMItems.map((item) => (
                <div
                  key={item.value}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <div className={`w-12 h-12 mx-auto ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3`}>
                      {item.icon}
                    </div>
                    <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 2: Các Dịch Vụ (with images) ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Gear className="h-4 w-4" aria-hidden="true" />
                {t.servicesBadge}
              </div>
              <h2 id="services-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.servicesTitle[0]} <span className="text-emerald-600">{t.servicesTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.servicesLead}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={svc.image}
                      alt={svc.alt}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                          {svc.icon}
                        </div>
                        <span className="text-white font-bold text-sm">{svc.title}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${svc.tagColor}`}>
                        {svc.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">{svc.subtitle}</p>
                    <ul className="space-y-2.5">
                      {svc.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 3: Gói Dịch Vụ (Desktop table + Mobile cards) ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="packages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                {t.packagesBadge}
              </div>
              <h2 id="packages-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.packagesTitle[0]} <span className="text-emerald-600">{t.packagesTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.packagesLead}
              </p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    {t.packagesHeaders.map(h => <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, i) => (
                    <tr
                      key={pkg.name}
                      className={`border-t border-gray-100 hover:bg-emerald-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${pkg.highlight ? 'bg-emerald-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{pkg.name}</span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${pkg.tagColor}`}>
                            {pkg.tag}
                          </span>
                          {pkg.highlight && (
                            <span className="inline-block bg-amber-400 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full">
                              {locale === 'vi' ? 'Phổ biến' : 'Popular'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-700">{pkg.power}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{pkg.price}</span>
                        <span className="text-gray-500 text-sm">{pkg.period}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">{pkg.monitoring}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{pkg.cleaning}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.repair}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-2xl p-5 border transition-shadow duration-200 motion-reduce:transition-none hover:shadow-md ${
                    pkg.highlight
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${pkg.highlight ? 'text-emerald-800' : 'text-gray-900'}`}>{pkg.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${pkg.tagColor}`}>
                        {pkg.tag}
                      </span>
                    </div>
                    {pkg.highlight && (
                      <span className="bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                        {locale === 'vi' ? 'Phổ biến nhất' : 'Most popular'}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className={`text-2xl font-bold ${pkg.highlight ? 'text-emerald-700' : 'text-emerald-600'}`}>{pkg.price}</span>
                    <span className={`text-sm ${pkg.highlight ? 'text-emerald-600' : 'text-gray-500'}`}>{pkg.period}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{locale === 'vi' ? 'Công suất' : 'Capacity'}</span>
                      <span className={`font-medium ${pkg.highlight ? 'text-emerald-700' : 'text-gray-700'}`}>{pkg.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{locale === 'vi' ? 'Giám sát' : 'Monitoring'}</span>
                      <span className="text-gray-700">{pkg.monitoring}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{locale === 'vi' ? 'Vệ sinh' : 'Cleaning'}</span>
                      <span className="text-gray-700">{pkg.cleaning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{locale === 'vi' ? 'Sửa chữa' : 'Repair'}</span>
                      <span className="text-gray-700">{pkg.repair}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{locale === 'vi' ? 'Hỗ trợ' : 'Support'}</span>
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium">
                        <Headphones className="h-3 w-3" aria-hidden="true" />
                        {pkg.support}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 4: Cam Kết Hiệu Suất ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="commitments-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Shield className="h-4 w-4" aria-hidden="true" />
                {t.whyBadge}
              </div>
              <h2 id="commitments-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {locale === 'vi' ? 'Cam Kết' : 'Performance'} <span className="text-emerald-600">{locale === 'vi' ? 'Hiệu Suất' : 'Commitment'}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {locale === 'vi' ? 'Chỉ số hiệu suất được đảm bảo bằng hợp đồng — an tâm đầu tư dài hạn' : 'Performance metrics backed by contract - invest with confidence.'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {commitments.map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none text-center"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {c.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{c.label}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Section 5: Quy Trình Hỗ Trợ ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="process-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                <Gear className="h-4 w-4" aria-hidden="true" />
                {t.processBadge}
              </div>
              <h2 id="process-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.processTitle[0]} <span className="text-emerald-600">{t.processTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.processLead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((ps) => (
                <div
                  key={ps.step}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none relative"
                >
                  <div className="absolute top-4 right-4 text-5xl font-black text-emerald-50 select-none" aria-hidden="true">
                    {ps.step}
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                      {ps.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{ps.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{ps.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA Section ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-emerald-50" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Sun className="h-8 w-8 text-emerald-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {t.ctaTitle}
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {t.ctaLead}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/lien-he"
                    className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                  >
                    {t.ctaPrimary}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="tel:0988446113"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    0988 446 113
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
