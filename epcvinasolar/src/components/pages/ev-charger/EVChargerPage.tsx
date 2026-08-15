import {
  Sun,
  BatteryHigh,
  Lightning,
  Leaf,
  Clock,
  TrendUp,
  Building,
  ShoppingBag,
  Car,
  MapPin,
  CheckCircle,
  ArrowRight,
  Cpu,
  Pulse,
  Shield,
  WifiHigh,
  CurrencyDollar,
  Timer,
  Handshake,
  Plug,
  DeviceMobile,
  Globe,
  GasPump,
  Buildings,
  House,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const copy: Record<Locale, any> = {
  vi: {
    badge: 'EPCVINA Charging',
    title: ['Trạm Sạc Xe Điện', 'Năng Lượng Mặt Trời'],
    lead: 'EPCVINA — Giải pháp trạm sạc xe điện tích hợp năng lượng mặt trời. Solar + BESS + Trạm sạc = Hệ sinh thái xanh hoàn chỉnh.',
    cta: 'Liên hệ tư vấn lắp đặt trạm sạc EPCVINA',
    networkBadge: 'Mạng lưới EPCVINA',
    networkTitle: ['Mạng Lưới Sạc Lớn Nhất', 'Việt Nam'],
    networkLead: 'Hạ tầng sạc điện toàn quốc do EPCVINA vận hành, cung cấp năng lượng tái tạo cho mọi hành trình',
    greenBadge: '100% năng lượng tái tạo — Solar + Wind + BESS',
    featuredTitle: ['Sản Phẩm', 'Nổi Bật'],
    featuredLead: 'Giải pháp sạc toàn diện — từ nhà ở đến trạm trọng điểm',
    lineupTitle: ['Dòng Sản Phẩm', 'Trụ Sạc EPCVINA'],
    lineupLead: 'Phủ sóng mọi nhu cầu sạc — từ xe máy điện đến xe hơi cao cấp',
    pricingTitle: ['Giá', 'Dịch Vụ Sạc'],
    pricingLead: 'Bảng giá minh bạch — thanh toán tiện lợi qua app EPCVINA',
    franchiseBadge: 'Nhượng Quyền EPCVINA',
    franchiseTitle: ['Mô Hình', 'Nhượng Quyền'],
    franchiseLead: '"Doanh nghiệp và nhân dân cùng làm" — Cơ hội kinh doanh trạm sạc EPCVINA với cam kết doanh thu ổn định 10 năm.',
    integrationTitle: ['EPCVINA Solar', 'Integration'],
    integrationLead: 'Trạm sạc kết hợp điện mặt trời, BESS và lưới điện để đảm bảo chi phí vận hành tối ưu.',
    statsBadge: 'Dự án trọng điểm 2026',
    statsTitle: ['99', 'Siêu Trạm Sạc'],
    statsLead: 'Đầu tư 10,000 tỷ VNĐ — 99 siêu trạm sạc phủ sóng 34 tỉnh/thành, mỗi trạm phục vụ 100 xe sạc đồng thời',
    ctaTitle: ['Sẵn sàng triển khai', 'trạm sạc?'],
    ctaLead: 'Nhận tư vấn miễn phí, khảo sát vị trí và phương án đầu tư phù hợp.',
    ctaPrimary: 'Nhận tư vấn miễn phí',
  },
  en: {
    badge: 'EPCVINA Charging',
    title: ['EV Charging', 'Solar Powered'],
    lead: 'EPCVINA delivers solar-integrated EV charging solutions. Solar + BESS + charging stations = a complete green ecosystem.',
    cta: 'Contact EPCVINA for charging station consultation',
    networkBadge: 'EPCVINA network',
    networkTitle: ['Largest EV Charging Network in', 'Vietnam'],
    networkLead: 'Nationwide charging infrastructure operated by EPCVINA, powered by renewable energy for every journey',
    greenBadge: '100% renewable energy — Solar + Wind + BESS',
    featuredTitle: ['Featured', 'Products'],
    featuredLead: 'End-to-end charging solutions from residential to flagship sites',
    lineupTitle: ['EV Charger', 'Product Lineup'],
    lineupLead: 'Covering every charging need from e-bikes to premium EVs',
    pricingTitle: ['Charging', 'Service Pricing'],
    pricingLead: 'Transparent pricing with convenient EPCVINA app payments',
    franchiseBadge: 'EPCVINA Franchise',
    franchiseTitle: ['Franchise', 'Model'],
    franchiseLead: 'A shared business opportunity for charging stations with a stable 10-year revenue commitment.',
    integrationTitle: ['EPCVINA Solar', 'Integration'],
    integrationLead: 'Charging stations integrated with solar, BESS, and the grid for optimal operating cost.',
    statsBadge: 'Key project 2026',
    statsTitle: ['99', 'Supercharging Hubs'],
    statsLead: 'VND 10,000 billion investment - 99 supercharging hubs across 34 provinces, each serving 100 vehicles at once',
    ctaTitle: ['Ready to deploy', 'a charging station?'],
    ctaLead: 'Get a free consultation, site survey, and investment plan tailored to your needs.',
    ctaPrimary: 'Get free consultation',
  },
  zh: {
    badge: 'EPCVINA 充电',
    title: ['电动汽车充电', '太阳能方案'],
    lead: 'EPCVINA 提供太阳能一体化电动汽车充电解决方案。Solar + BESS + 充电桩 = 完整绿色生态。',
    cta: '联系 EPCVINA 咨询充电桩方案',
    networkBadge: 'EPCVINA 网络',
    networkTitle: ['越南最大的', '充电网络'],
    networkLead: '由 EPCVINA 运营的全国充电基础设施，为每一段旅程提供可再生能源',
    greenBadge: '100% 可再生能源 — Solar + Wind + BESS',
    featuredTitle: ['精选', '产品'],
    featuredLead: '从住宅到旗舰站点的一体化充电方案',
    lineupTitle: ['充电桩', '产品系列'],
    lineupLead: '覆盖从电动两轮车到高端电动车的全部充电需求',
    pricingTitle: ['充电', '服务价格'],
    pricingLead: '价格透明，支持 EPCVINA App 便捷支付',
    franchiseBadge: 'EPCVINA 加盟',
    franchiseTitle: ['加盟', '模式'],
    franchiseLead: '共享充电站商业机会，并提供稳定的 10 年收益承诺。',
    integrationTitle: ['EPCVINA Solar', '集成方案'],
    integrationLead: '充电站与光伏、BESS 和电网联动，优化运营成本。',
    statsBadge: '2026 重点项目',
    statsTitle: ['99', '超级充电站'],
    statsLead: '投资 10000 亿越南盾，在 34 个省份布局 99 座超级充电站，每站可同时服务 100 辆车',
    ctaTitle: ['准备好部署', '充电站了吗？'],
    ctaLead: '获取免费咨询、现场勘察和定制投资方案。',
    ctaPrimary: '免费咨询',
  },
  ja: {
    badge: 'EPCVINA Charging',
    title: ['EV充電', '太陽光ソリューション'],
    lead: 'EPCVINA は、太陽光と連携したEV充電ソリューションを提供します。Solar + BESS + 充電ステーションで、完全なグリーンエコシステムを実現します。',
    cta: '充電ステーションのご相談',
    networkBadge: 'EPCVINA ネットワーク',
    networkTitle: ['ベトナム最大の', 'EV充電ネットワーク'],
    networkLead: 'EPCVINA が運営する全国充電インフラ。再生可能エネルギーであらゆる移動を支えます。',
    greenBadge: '100% 再生可能エネルギー — Solar + Wind + BESS',
    featuredTitle: ['注目', '製品'],
    featuredLead: '住宅から旗艦拠点まで対応する総合充電ソリューション',
    lineupTitle: ['EV充電器', 'ラインナップ'],
    lineupLead: '電動二輪車から高級EVまで、あらゆる充電ニーズをカバーします。',
    pricingTitle: ['充電', '料金プラン'],
    pricingLead: '料金は明確で、EPCVINA アプリで簡単に決済できます。',
    franchiseBadge: 'EPCVINA フランチャイズ',
    franchiseTitle: ['フランチャイズ', 'モデル'],
    franchiseLead: '安定した10年収益を前提とした充電ステーション事業の共同機会です。',
    integrationTitle: ['EPCVINA Solar', '統合'],
    integrationLead: '充電ステーションを太陽光・BESS・系統と統合し、運用コストを最適化します。',
    statsBadge: '2026重点案件',
    statsTitle: ['99', 'スーパーチャージ拠点'],
    statsLead: '34省に99拠点を展開する総額10000億VNDの大型投資。各拠点で同時に100台を充電可能です。',
    ctaTitle: ['充電拠点の', '導入準備はできていますか？'],
    ctaLead: '無料相談、現地調査、投資計画をご案内します。',
    ctaPrimary: '無料相談を受ける',
  },
  ko: {
    badge: 'EPCVINA Charging',
    title: ['전기차 충전', '태양광 솔루션'],
    lead: 'EPCVINA는 태양광과 연계된 전기차 충전 솔루션을 제공합니다. Solar + BESS + 충전소로 완전한 친환경 생태계를 구축합니다.',
    cta: '충전소 상담 문의',
    networkBadge: 'EPCVINA 네트워크',
    networkTitle: ['베트남 최대', '전기차 충전망'],
    networkLead: 'EPCVINA가 운영하는 전국 충전 인프라로, 모든 여정에 재생에너지를 제공합니다.',
    greenBadge: '100% 재생에너지 — Solar + Wind + BESS',
    featuredTitle: ['주요', '제품'],
    featuredLead: '주거용부터 핵심 거점까지 아우르는 충전 솔루션',
    lineupTitle: ['충전기', '제품 라인업'],
    lineupLead: '전동 이륜차부터 고급 EV까지 모든 충전 수요를 커버합니다.',
    pricingTitle: ['충전', '서비스 요금'],
    pricingLead: '투명한 요금과 EPCVINA 앱 결제 지원',
    franchiseBadge: 'EPCVINA 프랜차이즈',
    franchiseTitle: ['프랜차이즈', '모델'],
    franchiseLead: '안정적인 10년 수익을 전제로 한 충전소 비즈니스 기회입니다.',
    integrationTitle: ['EPCVINA Solar', '통합'],
    integrationLead: '충전소를 태양광, BESS, 전력망과 통합해 운영 비용을 최적화합니다.',
    statsBadge: '2026 핵심 프로젝트',
    statsTitle: ['99', '슈퍼충전 허브'],
    statsLead: '34개 성에 99개의 슈퍼충전 허브를 구축하는 1조 VND 규모의 투자로, 각 허브는 동시에 100대를 서비스합니다.',
    ctaTitle: ['충전소', '도입을 준비하셨나요?'],
    ctaLead: '무료 상담, 현장 조사, 맞춤 투자안을 받아보세요.',
    ctaPrimary: '무료 상담 받기',
  },
};

/* ─── EPCVINA Charging Network Stats ─── */
const epcvinaStats = [
  { icon: <Plug className="h-6 w-6" aria-hidden="true" />, value: '150,000+', label: 'Cổng sạc trên toàn quốc', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '63', label: 'Tỉnh/Thành phủ sóng', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Lightning className="h-6 w-6" aria-hidden="true" />, value: '18 triệu+', label: 'Phiên sạc hoàn thành', gradient: 'from-cyan-500 to-cyan-400' },
  { icon: <BatteryHigh className="h-6 w-6" aria-hidden="true" />, value: '400 triệu kWh', label: 'Tổng điện năng cung cấp', gradient: 'from-violet-600 to-violet-500' },
];

/* ─── Featured Charger Products (with images) ─── */
const featuredChargers = [
  {
    name: 'DC Fast Charger',
    power: '60–300kW',
    desc: 'Sạc siêu nhanh cho mọi dòng xe điện',
    image: '/images/sac-ev/dc-fast-charger.webp',
    alt: 'Trụ sạc nhanh DC cho xe điện',
    tag: 'Siêu nhanh',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    name: 'AC Charger Station',
    power: '7–22kW',
    desc: 'Sạc tiêu chuẩn cho khu thương mại, nhà ở',
    image: '/images/sac-ev/ac-charger-station.webp',
    alt: 'Trạm sạc AC tiêu chuẩn',
    tag: 'Chuẩn',
    tagColor: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Super Charging Station',
    power: '150–300kW',
    desc: 'Siêu trạm sạc phục vụ cao tốc, trạm trọng điểm',
    image: '/images/sac-ev/super-charging-station.webp',
    alt: 'Siêu trạm sạc công suất lớn',
    tag: 'Siêu trạm',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'House Charger',
    power: '7–22kW',
    desc: 'Giải pháp sạc tại nhà tiện lợi, an toàn',
    image: '/images/sac-ev/house-charger.webp',
    alt: 'Sạc xe điện tại nhà',
    tag: 'Gia đình',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'EV Charging Network',
    power: 'Toàn quốc',
    desc: 'Mạng lưới phủ sóng 63 tỉnh thành trên cả nước',
    image: '/images/sac-ev/mang-luoi-tram-sac.webp',
    alt: 'Mạng lưới trạm sạc xe điện EPCVINA',
    tag: 'Phủ sóng',
    tagColor: 'bg-cyan-100 text-cyan-700',
  },
];

/* ─── EPCVINA Product Lineup ─── */
const chargerLineup = [
  { type: 'DC Superfast', power: '300kW', ports: '1', use: 'Sạc siêu nhanh', tag: 'Supercar', tagColor: 'bg-red-100 text-red-700' },
  { type: 'DC Ultrafast', power: '120–150kW', ports: '2', use: 'Sạc nhanh cao tốc', tag: 'Siêu nhanh', tagColor: 'bg-violet-100 text-violet-700' },
  { type: 'DC Fast', power: '60–80kW', ports: '2', use: 'Sạc nhanh + AC tích hợp', tag: 'Nhanh', tagColor: 'bg-cyan-100 text-cyan-700' },
  { type: 'DC Fast', power: '30–40kW', ports: '1', use: 'Lắp tường/trụ', tag: 'Tiết kiệm', tagColor: 'bg-teal-100 text-teal-700' },
  { type: 'DC Fast', power: '20kW', ports: '1', use: 'Sạc trung bình', tag: 'Phổ biến', tagColor: 'bg-blue-100 text-blue-700' },
  { type: 'AC Standard', power: '22kW', ports: '1', use: 'Sạc qua đêm, thương mại', tag: 'Chuẩn', tagColor: 'bg-sky-100 text-sky-700' },
  { type: 'AC Standard', power: '7kW', ports: '1', use: 'Sạc tại nhà', tag: 'Gia đình', tagColor: 'bg-teal-100 text-teal-700' },
  { type: 'Xe máy điện', power: '1.2kW+', ports: '2–4', use: 'Xe máy, xe tay ga', tag: '2 bánh', tagColor: 'bg-orange-100 text-orange-700' },
];

/* ─── 99 Siêu Trạm Stats ─── */
const superStationStats = [
  { icon: <Building className="h-6 w-6" aria-hidden="true" />, value: '99', label: 'Siêu trạm sạc', color: 'text-cyan-400' },
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, value: '34', label: 'Tỉnh/Thành', color: 'text-cyan-300' },
  { icon: <Car className="h-6 w-6" aria-hidden="true" />, value: '100', label: 'Xe sạc đồng thời/trạm', color: 'text-blue-400' },
  { icon: <Timer className="h-6 w-6" aria-hidden="true" />, value: '15 phút', label: 'Sạc nhanh từ NLTT', color: 'text-violet-400' },
];

/* ─── Pricing ─── */
const pricingItems = [
  { icon: <Lightning className="h-5 w-5" aria-hidden="true" />, label: 'Giá sạc', value: '3,858 VNĐ/kWh', note: '(đã VAT)', color: 'bg-cyan-50 text-cyan-600' },
  { icon: <Timer className="h-5 w-5" aria-hidden="true" />, label: 'Phí giữ chỗ', value: 'Miễn phí 10 phút đầu', note: 'Sau đó 1,000–4,000 VNĐ/phút', color: 'bg-cyan-50 text-cyan-600' },
  { icon: <CurrencyDollar className="h-5 w-5" aria-hidden="true" />, label: 'Tối đa', value: '1 triệu VNĐ/phiên', note: '', color: 'bg-blue-50 text-blue-600' },
  { icon: <DeviceMobile className="h-5 w-5" aria-hidden="true" />, label: 'Thanh toán', value: 'App EPCVINA', note: 'Nhanh chóng, tiện lợi', color: 'bg-violet-50 text-violet-600' },
];

/* ─── Application images ─── */
const applicationCards = [
  {
    image: '/images/sac-ev/bai-do-xe-trung-tam-thuong-mai.webp',
    alt: 'Bãi đỗ xe có trạm sạc điện',
    title: 'Bãi đỗ xe & TTTM',
  },
  {
    image: '/images/sac-ev/tram-dung-cao-toc.webp',
    alt: 'Trạm sạc xe điện trên cao tốc',
    title: 'Trạm dừng cao tốc',
  },
];

/* ─── Franchise Venues ─── */
const franchiseVenues = [
  { icon: <Car className="h-6 w-6" aria-hidden="true" />, label: 'Bãi đỗ xe' },
  { icon: <GasPump className="h-6 w-6" aria-hidden="true" />, label: 'Trạm xăng' },
  { icon: <Building className="h-6 w-6" aria-hidden="true" />, label: 'Bến xe' },
  { icon: <ShoppingBag className="h-6 w-6" aria-hidden="true" />, label: 'TTTM' },
  { icon: <Buildings className="h-6 w-6" aria-hidden="true" />, label: 'Khách sạn' },
  { icon: <Building className="h-6 w-6" aria-hidden="true" />, label: 'Chung cư' },
  { icon: <House className="h-6 w-6" aria-hidden="true" />, label: 'Văn phòng' },
];

/* ─── LINK Platform Features ─── */
const linkFeatures = [
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, title: 'Hệ thống quản lý LINK', desc: 'Giám sát và điều phối toàn bộ mạng lưới trạm sạc thông minh' },
  { icon: <WifiHigh className="h-6 w-6" aria-hidden="true" />, title: 'Giám sát real-time', desc: 'Theo dõi tình trạng hoạt động qua cloud 24/7' },
  { icon: <DeviceMobile className="h-6 w-6" aria-hidden="true" />, title: 'App EPCVINA', desc: 'Tìm trạm, thanh toán, xem lịch sử sạc trong một ứng dụng' },
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, title: 'Phủ sóng dày đặc', desc: '3.5km (nội đô) · 65km (cao tốc) — luôn có trạm gần bạn' },
];

/* ─── EPCVINA Services ─── */
const epcvinaServices = [
  { icon: <MapPin className="h-6 w-6" aria-hidden="true" />, title: 'Khảo sát', desc: 'Đánh giá vị trí, điều kiện lắp đặt hệ thống solar cho trạm sạc' },
  { icon: <Cpu className="h-6 w-6" aria-hidden="true" />, title: 'Thiết kế', desc: 'Thiết kế hệ thống điện mặt trời + BESS tối ưu cho trạm sạc EPCVINA' },
  { icon: <Building className="h-6 w-6" aria-hidden="true" />, title: 'Thi công', desc: 'Lắp đặt chuyên nghiệp, đúng tiến độ, đảm bảo chất lượng' },
  { icon: <Pulse className="h-6 w-6" aria-hidden="true" />, title: 'Vận hành O&M', desc: 'Bảo trì định kỳ, giám sát hiệu suất, xử lý sự cố 24/7' },
];

/* ─── EPCVINA Value Props ─── */
const epcvinaValues = [
  { icon: <TrendUp className="h-7 w-7" aria-hidden="true" />, title: 'Giảm chi phí điện sạc', value: '60–80%', desc: 'So với sử dụng điện lưới thông thường', gradient: 'from-cyan-600 to-cyan-500' },
  { icon: <Leaf className="h-7 w-7" aria-hidden="true" />, title: 'Năng lượng sạch', value: '100%', desc: 'Solar + Wind + BESS — không phát thải', gradient: 'from-green-600 to-green-500' },
  { icon: <Clock className="h-7 w-7" aria-hidden="true" />, title: 'Vận hành liên tục', value: '24/7', desc: 'Hoạt động không gián đoạn với pin dự phòng', gradient: 'from-blue-600 to-blue-500' },
  { icon: <Shield className="h-7 w-7" aria-hidden="true" />, title: 'Bảo hành dài hạn', value: 'ISO 9001', desc: 'Chứng nhận chất lượng quốc tế', gradient: 'from-cyan-500 to-cyan-400' },
];

export default function EVChargerPage({ locale = 'vi', pathname = '/' }: { locale?: Locale; pathname?: string }) {
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
            src="/images/sac-ev/hero-tram-sac-nang-luong-mat-troi.webp"
            alt="Trạm sạc xe điện năng lượng mặt trời"
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
            {/* EPCVINA badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-cyan-400/30 mb-6">
              <Lightning className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span className="text-cyan-300 font-semibold tracking-wide">{t.badge}</span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              {t.title[0]}{' '}
              <span className="text-cyan-400">EPCVINA</span>
              <br className="hidden sm:block" />
              {' '}×{' '}
              <span className="text-green-400">{t.title[1]}</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="/lien-he"
                className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
              >
                {t.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Content below hero */}
      <div>
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="epcvina-network-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                <Globe className="h-4 w-4" aria-hidden="true" />
                {t.networkBadge}
              </div>
              <h2 id="epcvina-network-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t.networkTitle[0]} <span className="text-cyan-600">{t.networkTitle[1]}</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                {t.networkLead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {epcvinaStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {s.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                  <div className="text-base text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-5 py-2.5 text-base text-cyan-700">
                <Leaf className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{t.greenBadge}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ Featured Products with Images ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-cyan-50" aria-labelledby="featured-chargers-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="featured-chargers-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Sản Phẩm <span className="text-cyan-600">Nổi Bật</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
                Giải pháp sạc toàn diện — từ nhà ở đến trạm trọng điểm
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredChargers.map((product) => (
                <div
                  key={product.name}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.tagColor}`}>
                        {product.tag}
                      </span>
                    </div>
                    <p className="text-base text-cyan-700 font-semibold mb-1">{product.power}</p>
                    <p className="text-base text-gray-500 leading-relaxed">{product.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Product Lineup Table ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="product-lineup-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="product-lineup-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dòng Sản Phẩm <span className="text-cyan-600">Trụ Sạc EPCVINA</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Phủ sóng mọi nhu cầu sạc — từ xe máy điện đến xe hơi cao cấp</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-cyan-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Loại Trụ Sạc</th>
                    <th className="px-6 py-4 text-left font-semibold">Công Suất</th>
                    <th className="px-6 py-4 text-center font-semibold">Cổng</th>
                    <th className="px-6 py-4 text-left font-semibold">Ứng Dụng</th>
                    <th className="px-6 py-4 text-center font-semibold">Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {chargerLineup.map((row, i) => (
                    <tr
                      key={`${row.type}-${row.power}`}
                      className={`border-t border-gray-100 hover:bg-cyan-50 transition-colors duration-200 motion-reduce:transition-none ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">{row.type}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{row.power}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.ports}</td>
                      <td className="px-6 py-4 text-gray-600">{row.use}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.tagColor}`}>
                          {row.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {chargerLineup.map((row) => (
                <div
                  key={`${row.type}-${row.power}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">{row.type}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.tagColor}`}>
                      {row.tag}
                    </span>
                  </div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Công suất:</span>
                      <span className="font-semibold text-cyan-700">{row.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cổng sạc:</span>
                      <span className="font-medium text-gray-700">{row.ports}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 text-gray-600 leading-relaxed">{row.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 99 Siêu Trạm Sạc ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white" aria-labelledby="super-station-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-base font-semibold text-cyan-300 mb-4 border border-cyan-400/30">
                <Lightning className="h-4 w-4" aria-hidden="true" />
                Dự án trọng điểm 2026
              </div>
              <h2 id="super-station-heading" className="text-2xl sm:text-3xl font-bold">
                99 <span className="text-cyan-400">Siêu Trạm Sạc</span>
              </h2>
              <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto leading-relaxed">
                Đầu tư 10,000 tỷ VNĐ — 99 siêu trạm sạc phủ sóng 34 tỉnh/thành, mỗi trạm phục vụ 100 xe sạc đồng thời
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {superStationStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`${s.color} mb-3 flex justify-center`}>{s.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-base text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <CurrencyDollar className="h-5 w-5" aria-hidden="true" />, text: 'Đầu tư 10,000 tỷ VNĐ' },
                { icon: <Timer className="h-5 w-5" aria-hidden="true" />, text: 'Sạc nhanh 15 phút từ NLTT' },
                { icon: <Leaf className="h-5 w-5" aria-hidden="true" />, text: '100% Solar + Wind + BESS' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-cyan-400">{item.icon}</span>
                  <span className="text-base text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Giá Dịch Vụ ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="pricing-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="pricing-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Giá <span className="text-cyan-600">Dịch Vụ Sạc</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Bảng giá minh bạch — thanh toán tiện lợi qua app EPCVINA</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingItems.map((p) => (
                <div
                  key={p.label}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-12 h-12 ${p.color.split(' ')[0]} rounded-xl flex items-center justify-center mb-4`}>
                    <span className={p.color.split(' ')[1]}>{p.icon}</span>
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">{p.label}</div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{p.value}</div>
                  {p.note && <div className="text-base text-gray-500 leading-relaxed">{p.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ Mô Hình Nhượng Quyền ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="franchise-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: franchise info */}
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-1.5 text-base font-semibold text-cyan-700 mb-4">
                  <Handshake className="h-4 w-4" aria-hidden="true" />
                  Nhượng Quyền EPCVINA
                </div>
                <h2 id="franchise-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Mô Hình <span className="text-cyan-600">Nhượng Quyền</span>
                </h2>
                <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-prose">
                  "Doanh nghiệp và nhân dân cùng làm" — Cơ hội kinh doanh trạm sạc EPCVINA với cam kết doanh thu ổn định 10 năm.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: <CurrencyDollar className="h-4 w-4" aria-hidden="true" />, text: 'Doanh thu đảm bảo: 750 VNĐ/kWh cho đối tác' },
                    { icon: <Clock className="h-4 w-4" aria-hidden="true" />, text: 'Cam kết hợp đồng 10 năm' },
                    { icon: <Shield className="h-4 w-4" aria-hidden="true" />, text: 'EPCVINA cung cấp: công nghệ, đào tạo, hỗ trợ, marketing' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-600">{item.icon}</span>
                      </div>
                      <span className="text-base text-gray-700 leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: application images + venue cards */}
              <div>
                {/* Application images */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {applicationCards.map((app) => (
                    <div key={app.title} className="aspect-square overflow-hidden rounded-xl border border-gray-100">
                      <img
                        src={app.image}
                        alt={app.alt}
                        loading="lazy"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Vị trí phù hợp lắp đặt trạm sạc</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {franchiseVenues.map((v) => (
                    <div
                      key={v.label}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-cyan-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none flex flex-col items-center gap-2 text-center min-h-[44px] justify-center"
                    >
                      <span className="text-cyan-600">{v.icon}</span>
                      <span className="text-base font-medium text-gray-700">{v.label}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/lien-he"
                  className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none text-base min-h-[44px]"
                >
                  Tư vấn nhượng quyền trạm sạc
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ EPCVINA Solar Integration ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 to-gray-900" aria-labelledby="epcvina-integration-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="epcvina-integration-heading" className="text-2xl sm:text-3xl font-bold text-white">
                Trạm Sạc EPCVINA
              </h2>
              <p className="text-cyan-300 mt-2 max-w-2xl mx-auto text-base leading-relaxed">
                Giải pháp Solar EPC cho trạm sạc — Biến mỗi trạm sạc thành nhà máy điện mặt trời
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {epcvinaValues.map((v) => (
                <div
                  key={v.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${v.gradient} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    {v.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{v.value}</div>
                  <div className="text-base font-semibold text-cyan-300 mb-2">{v.title}</div>
                  <p className="text-base text-gray-300 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* EPCVINA services row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {epcvinaServices.map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="text-cyan-400 mb-3">{svc.icon}</div>
                  <h3 className="font-bold text-white text-base mb-1">{svc.title}</h3>
                  <p className="text-base text-gray-400 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>

            {/* Bundle highlight */}
            <div className="mt-10 bg-gradient-to-r from-cyan-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-400/30 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sun className="h-6 w-6 text-amber-400" aria-hidden="true" />
                <span className="text-xl font-bold text-white" aria-hidden="true">+</span>
                <BatteryHigh className="h-6 w-6 text-cyan-400" aria-hidden="true" />
                <span className="text-xl font-bold text-white" aria-hidden="true">+</span>
                <Lightning className="h-6 w-6 text-violet-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Solar + BESS + Trạm Sạc = Hệ Sinh Thái Xanh Hoàn Chỉnh
              </h3>
              <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                EPCVINA cung cấp giải pháp trọn gói: lắp đặt hệ thống điện mặt trời cho trạm sạc,
                tích hợp pin lưu trữ BESS, giúp giảm 60–80% chi phí điện sạc với nguồn năng lượng sạch 100%.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ LINK Platform ═══════════════════ */}
        <section className="py-12 sm:py-16 bg-white" aria-labelledby="link-platform-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="link-platform-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
                Công Nghệ <span className="text-cyan-600">LINK Platform</span>
              </h2>
              <p className="text-base text-gray-500 mt-2 leading-relaxed">Hệ thống quản lý thông minh — giám sát real-time qua cloud</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {linkFeatures.map((f) => (
                <div
                  key={f.title}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
                >
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
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
                  <Lightning className="h-8 w-8 text-cyan-300" aria-hidden="true" />
                </div>
                <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Sẵn sàng lắp đặt trạm sạc EPCVINA?
                </h2>
                <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Liên hệ ngay với EPCVINA để được tư vấn miễn phí về giải pháp
                  Solar + BESS cho trạm sạc phù hợp nhất cho dự án của bạn.
                </p>
                <a
                  href="/lien-he"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  Liên hệ tư vấn lắp đặt trạm sạc EPCVINA
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
