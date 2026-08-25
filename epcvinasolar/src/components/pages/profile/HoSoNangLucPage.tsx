import { useEffect, useState } from 'react';
import {
  Sun,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  Phone,
  Lightning,
  Medal,
  ShieldCheck,
  CheckCircle,
  Handshake,
  Factory,
  Gauge,
  TrendUp,
  Globe,
  FileText,
  ClipboardText,
  Wrench,
  Users,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { getLocaleFromPathname } from '../../../i18n/messages';

type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

const text = {
  vi: {
    badge: 'Hồ sơ năng lực EPCVINA Solar',
    title: ['Hồ sơ năng lực cho', 'doanh nghiệp', 'và', 'nhà dân'],
    lead:
      'Trang này được viết để phục vụ cả hai nhóm khách chính của EPCVINA Solar: doanh nghiệp cần hồ sơ tin cậy để đánh giá nhà thầu, và hộ gia đình cần xem nhanh giải pháp, dự án thật và tài liệu dễ hiểu trước khi liên hệ.',
    downloadBtn: 'Tải hồ sơ năng lực',
    homeBtn: 'Tư vấn cho nhà dân',
    docsTitle: 'Tài liệu chính thức dành cho đối tác và chủ đầu tư',
    docsLead:
      'Bạn có thể tải brochure tổng quan hoặc hồ sơ năng lực solar chuyên sâu để gửi nội bộ, làm pre-qualify, hoặc chuyển cho gia đình khi cần xem kỹ hơn trước khi quyết định.',
    coreTitle: 'Năng lực cốt lõi',
    coreLead: 'Khung năng lực dùng để thẩm định nhà thầu, đồng thời đủ rõ để nhà dân dễ hiểu',
    certTitle: 'Chứng nhận & hệ thống quản lý',
    certLead:
      'Những tài liệu này hỗ trợ bộ phận mua hàng, chủ đầu tư và tư vấn kỹ thuật khi cần xác minh năng lực trước khi mời EPCVINA vào vòng chào giá hoặc đấu thầu.',
    clientTitle: 'Khách hàng và đối tác',
    clientLead: 'Danh sách dưới đây thể hiện nhóm khách hàng doanh nghiệp và đối tác tiêu biểu đã hợp tác cùng EPCVINA.',
    finalTitle: 'Cần hồ sơ năng lực cho khách hàng hoặc muốn lắp cho nhà mình?',
    finalLead: 'EPCVINA có thể cung cấp bộ tài liệu giới thiệu doanh nghiệp, profile solar và thông tin tham chiếu theo từng nhu cầu.',
    ready: 'Sẵn sàng phục vụ giai đoạn pre-sales, tender và tư vấn cho nhà dân',
    downloadTitle: 'Tài liệu tải xuống',
    viewFile: 'Xem file',
    download: 'Tải xuống',
    input: 'Đầu vào',
    process: 'Xử lý',
    output: 'Đầu ra',
    callConsult: 'Gọi tư vấn',
    technicalSupport: 'Kỹ thuật hỗ trợ',
    clientTitle2: 'Khách hàng và đối tác',
  },
  en: {
    badge: 'EPCVINA Solar profile',
    title: ['Company profile for', 'businesses', 'and', 'homeowners'],
    lead:
      'This page serves EPCVINA Solar’s two core audiences: companies that need a reliable capability profile to evaluate contractors, and homeowners who want to quickly understand the solutions, real projects, and supporting documents before reaching out.',
    downloadBtn: 'Download profile',
    homeBtn: 'Homeowner consultation',
    docsTitle: 'Official documents for partners and project owners',
    docsLead:
      'Download our overview brochure or the in-depth solar capability profile to share internally, use for pre-qualification, or review with your family before making a decision.',
    coreTitle: 'Core capabilities',
    coreLead: 'A capability framework that works for contractor assessment and is still easy for homeowners to understand',
    certTitle: 'Certifications and management systems',
    certLead:
      'These documents help procurement teams, investors, and technical advisors verify capability before inviting EPCVINA into a quote or tender round.',
    clientTitle: 'Clients and partners',
    clientLead: 'The list below highlights representative corporate clients and partners we have worked with.',
    finalTitle: 'Need a capability profile for a client, or planning a solar project at home?',
    finalLead: 'EPCVINA can provide company introduction materials, solar profiles, and reference information tailored to each need.',
    ready: 'Ready for pre-sales, tender, and homeowner consultation',
    downloadTitle: 'Downloads',
    viewFile: 'Preview',
    download: 'Download',
    input: 'Input',
    process: 'Process',
    output: 'Output',
    callConsult: 'Call for consultation',
    technicalSupport: 'Technical support',
    clientTitle2: 'Clients and partners',
  },
  zh: {
    badge: 'EPCVINA Solar 公司简介',
    title: ['面向', '企业', '与', '家庭用户的能力介绍'],
    lead: '本页面同时服务 EPCVINA Solar 的两类核心客户：需要可信资质资料来评估承包商的企业，以及希望在联系前快速了解方案、真实项目与资料的家庭用户。',
    downloadBtn: '下载资料',
    homeBtn: '家庭咨询',
    docsTitle: '面向合作伙伴与业主的正式资料',
    docsLead: '您可以下载概览手册或更深入的太阳能能力资料，用于内部分享、预审，或在与家人决定前进一步查看。',
    coreTitle: '核心能力',
    coreLead: '既适合承包商评估，也便于家庭用户理解的能力框架',
    certTitle: '认证与管理体系',
    certLead: '这些资料有助于采购、投资方和技术顾问在邀请 EPCVINA 进入报价或投标前确认能力。',
    clientTitle: '客户与合作伙伴',
    clientLead: '下方列表展示了 EPCVINA 合作过的代表性企业客户与合作伙伴。',
    finalTitle: '需要给客户看的能力资料，或者想为自家安装太阳能？',
    finalLead: 'EPCVINA 可根据不同需求提供企业介绍、太阳能资料与参考信息。',
    ready: '适用于售前、投标及家庭咨询',
    downloadTitle: '下载资料',
    viewFile: '预览',
    download: '下载',
    input: '输入',
    process: '处理',
    output: '输出',
    callConsult: '电话咨询',
    technicalSupport: '技术支持',
    clientTitle2: '客户与合作伙伴',
  },
  ja: {
    badge: 'EPCVINA Solar 会社案内',
    title: ['企業向け・', 'ご家庭向けの', '会社・能力紹介'],
    lead: 'このページは、信頼できる施工能力資料を必要とする企業と、導入前にソリューション・実績・資料を素早く確認したいご家庭の両方に向けています。',
    downloadBtn: '資料をダウンロード',
    homeBtn: 'ご家庭向け相談',
    docsTitle: 'パートナーおよび施主向け公式資料',
    docsLead: '概要パンフレットまたは詳細なソーラー能力資料をダウンロードして、社内共有や事前確認にご利用いただけます。',
    coreTitle: 'コア能力',
    coreLead: '施工会社評価にも、ご家庭にも分かりやすい能力フレーム',
    certTitle: '認証・管理体制',
    certLead: '見積や入札前に、調達担当や技術顧問が EPCVINA の能力を確認するのに役立つ資料です。',
    clientTitle: '顧客・パートナー',
    clientLead: '以下は EPCVINA と協業した代表的な法人顧客・パートナーです。',
    finalTitle: '施主向けの会社資料が必要ですか？それともご自宅への導入をお考えですか？',
    finalLead: 'EPCVINA は、会社紹介資料、ソーラープロフィール、参考情報を用途に合わせて提供できます。',
    ready: '営業前、入札、ご家庭向け相談に対応',
    downloadTitle: 'ダウンロード',
    viewFile: 'プレビュー',
    download: 'ダウンロード',
    input: '入力',
    process: '処理',
    output: '出力',
    callConsult: '相談する',
    technicalSupport: '技術サポート',
    clientTitle2: '顧客・パートナー',
  },
  ko: {
    badge: 'EPCVINA Solar 회사 소개',
    title: ['기업과', '가정을 위한', '역량 소개'],
    lead: '이 페이지는 신뢰할 수 있는 시공 역량 자료가 필요한 기업 고객과, 상담 전 솔루션과 실제 프로젝트, 자료를 빠르게 확인하고 싶은 가정을 모두 위한 페이지입니다.',
    downloadBtn: '프로필 다운로드',
    homeBtn: '가정용 상담',
    docsTitle: '파트너와 발주처를 위한 공식 자료',
    docsLead: '개요 브로셔 또는 상세 태양광 역량 자료를 내려받아 내부 공유, 사전 검토, 가족과의 상의에 활용할 수 있습니다.',
    coreTitle: '핵심 역량',
    coreLead: '시공사 평가에도, 일반 고객 이해에도 적합한 역량 구조',
    certTitle: '인증 및 관리 체계',
    certLead: '이 자료는 구매팀, 투자자, 기술 자문가가 EPCVINA의 역량을 입찰이나 견적 전에 확인하는 데 도움이 됩니다.',
    clientTitle: '고객과 파트너',
    clientLead: '아래는 EPCVINA와 협업한 대표적인 기업 고객과 파트너 목록입니다.',
    finalTitle: '고객에게 보여줄 역량 자료가 필요하신가요, 또는 자택 설치를 고려 중이신가요?',
    finalLead: 'EPCVINA는 기업 소개서, 태양광 프로필, 참고 자료를 필요에 맞게 제공할 수 있습니다.',
    ready: '사전 영업, 입찰, 가정 상담에 대응',
    downloadTitle: '다운로드',
    viewFile: '미리보기',
    download: '다운로드',
    input: '입력',
    process: '처리',
    output: '출력',
    callConsult: '상담 전화',
    technicalSupport: '기술 지원',
    clientTitle2: '고객과 파트너',
  },
} as const;

const heroStats = [
  { icon: <Globe className="h-6 w-6" aria-hidden="true" />, value: '100+', label: 'Công trình' },
  { icon: <Lightning className="h-6 w-6" aria-hidden="true" />, value: '42 MWp', label: 'Công suất lớn nhất' },
  { icon: <Medal className="h-6 w-6" aria-hidden="true" />, value: '15+', label: 'Năm kinh nghiệm' },
  { icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />, value: 'ISO 9001', label: 'Quản lý chất lượng' },
];

const documents = [
  {
    title: 'Brochure EPCVINA',
    desc: 'Bản giới thiệu tổng quan về doanh nghiệp, dịch vụ và năng lực triển khai.',
    href: '/documents/brochure-epcvina-vn.pdf',
    pages: '6 trang',
  },
  {
    title: 'Profile EPCVINA Solar 2026',
    desc: 'Hồ sơ năng lực chuyên sâu cho mảng solar với công trình, đối tác và phạm vi dịch vụ.',
    href: '/documents/profile-epcvina-vn-solar-2026.pdf',
    pages: '16 trang',
  },
];

const b2bUseCases = [
  'Hồ sơ mời thầu và pre-qualify nhà thầu',
  'Gửi cho bộ phận mua hàng / kỹ thuật để đánh giá nhanh',
  'Giới thiệu năng lực khi gặp chủ đầu tư hoặc đối tác',
  'Tài liệu tham chiếu cho giai đoạn chào giá và làm proposal',
];

const householdUseCases = [
  'Xem nhanh có phù hợp cho nhà phố, biệt thự, mái tôn hay mái ngói không',
  'Tham khảo dự án thực tế để ước lượng hiệu quả và độ tin cậy',
  'Xem cách EPCVINA triển khai, bảo hành và bảo trì cho hộ gia đình',
  'Tải file để gửi cho người nhà / ban quản lý trước khi quyết định',
];

const capabilityCards = [
  { icon: <ClipboardText className="h-6 w-6" />, title: 'Khảo sát & thiết kế', desc: 'Tư vấn kỹ thuật, đo đạc hiện trạng, bóc tách khối lượng và đề xuất giải pháp.' },
  { icon: <Wrench className="h-6 w-6" />, title: 'EPC trọn gói', desc: 'Thiết kế, cung ứng, thi công, đấu nối và bàn giao vận hành.' },
  { icon: <ShieldCheck className="h-6 w-6" />, title: 'Bảo hành & bảo trì', desc: 'Giám sát hiệu suất, bảo trì định kỳ, hỗ trợ vận hành dài hạn.' },
  { icon: <Users className="h-6 w-6" />, title: 'Đội ngũ kỹ sư', desc: 'Kỹ sư MEP và solar có kinh nghiệm dự án công nghiệp và dân dụng.' },
];

const certifications = [
  { icon: <Medal className="h-7 w-7" />, title: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
  { icon: <Factory className="h-7 w-7" />, title: 'Năng lực MEP', desc: 'Thi công công trình công nghiệp' },
  { icon: <ShieldCheck className="h-7 w-7" />, title: 'An toàn lao động', desc: 'Quy trình an toàn thi công' },
  { icon: <FileText className="h-7 w-7" />, title: 'Hồ sơ pháp lý', desc: 'Đầy đủ năng lực và hồ sơ dự án' },
];

const clientNames = ['Samsung', 'VinFast', 'Vinhomes', 'Lotte', 'Keangnam', 'Đại sứ quán HQ', 'Coteccons'];

const clientLogos: Record<string, { src: string; alt: string }> = {
  Samsung: { src: '/partners/samsung.svg', alt: 'Samsung logo' },
  VinFast: { src: '/partners/vinfast.png', alt: 'VinFast logo' },
  Vinhomes: { src: '/partners/vincom.webp', alt: 'Vinhomes logo' },
  Lotte: { src: '/partners/lotte.jpg', alt: 'Lotte logo' },
  Keangnam: { src: '/partners/keangnam.png', alt: 'Keangnam logo' },
  Coteccons: { src: '/partners/coteccons.png', alt: 'Coteccons logo' },
  'Đại sứ quán HQ': { src: '/partners/korea-embassy.svg', alt: 'Đại sứ quán Hàn Quốc logo' },
};

const contactChannels = [
  {
    label: 'Hotline tư vấn',
    value: '0988 446 113',
    href: 'tel:0988446113',
    note: 'Tư vấn hồ sơ năng lực, báo giá, chốt giải pháp cho doanh nghiệp và nhà dân.',
  },
  {
    label: 'Kỹ thuật / bảo trì',
    value: '0368 927 332',
    href: 'tel:0368927332',
    note: 'Hỗ trợ khảo sát, kỹ thuật hiện trường, bảo trì và xử lý sự cố.',
  },
  {
    label: 'Zalo nhanh',
    value: '0368 927 332',
    href: 'https://zalo.me/0368927332',
    note: 'Gửi file, ảnh mái, bản vẽ hoặc hồ sơ để được phản hồi nhanh.',
  },
];

const highlightProjects = [
  { name: 'Keangnam Bank Tower', location: 'Hà Nội', year: '2011-2012', scale: 'MEP cao tầng', image: '/du-an/DU-AN-KEANG-NAM-LAND-MARK-TOWER.jpg' },
  { name: 'Samsung SEVT Thái Nguyên', location: 'Thái Nguyên', year: '2014', scale: 'HVAC & Utility', image: '/du-an/DU-AN-SAMSUNG---SEVT-THAI-NGUYEN.jpg' },
  { name: 'VinFast Factory', location: 'Hải Phòng', year: '2018-2019', scale: 'Nhà máy sản xuất', image: '/du-an/DU-AN-XUONG-SAN-XUAT-THAN-VO-NHA-MAY-O-TO-VINFAST.jpg' },
  { name: 'Lotte Center Hanoi', location: 'Hà Nội', year: '2012-2014', scale: 'Tòa nhà 65 tầng', image: '/du-an/DU-ANLOTTE-CENTER-HANOI.jpg' },
];

export default function HoSoNangLucPage({ pathname = '/' }: { pathname?: string }) {
  const locale = (['vi', 'en', 'zh', 'ja', 'ko'].includes(getLocaleFromPathname(pathname)) ? getLocaleFromPathname(pathname) : 'vi') as Locale;
  const t = text[locale];
  const [previewDoc, setPreviewDoc] = useState<(typeof documents)[number] | null>(null);

  useEffect(() => {
    if (!previewDoc) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewDoc(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewDoc]);

  return (
    <div className="min-h-screen bg-white">
      <HeaderBar pathname={pathname} />
      <div className="md:pt-16">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <img
              src="/images/generated/ho-so-nang-luc-hero.png"
              alt=""
              className="h-full w-full object-cover object-center opacity-18"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/78 to-slate-950/50" />
          </div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
                <ClipboardText className="h-4 w-4 text-emerald-300" />
                <span>{t.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {t.title[0]} <span className="text-emerald-400">{t.title[1]}</span> {t.title[2]} <span className="text-orange-300">{t.title[3]}</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
                {t.lead}
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-3xl">
                <a href="#tai-lieu" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[44px]">
                  <FileText className="h-4 w-4" />
                  {t.downloadBtn}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="tel:0988446113" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-colors min-h-[44px]">
                  <Phone className="h-4 w-4" />
                  {t.homeBtn}
                </a>
              </div>
              <div className="mt-5 grid sm:grid-cols-3 gap-3 max-w-3xl">
                {contactChannels.map((contact) => (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">{contact.label}</p>
                    <p className="text-lg font-bold text-white">{contact.value}</p>
                    <p className="mt-2 text-xs text-gray-300 leading-relaxed">{contact.note}</p>
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">B2B / Tender / Pre-qualify</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Solar & MEP</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{locale === 'vi' ? 'Nhà phố / Biệt thự / Mái tôn' : 'Home / Villa / Metal roof'}</span>
              </div>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm max-w-3xl">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-3">{locale === 'vi' ? 'Dùng khi nào' : 'When to use'}</p>
                <div className="grid md:grid-cols-2 gap-5 text-sm text-gray-200">
                  <div>
                    <p className="font-semibold text-white mb-2">{locale === 'vi' ? 'Doanh nghiệp' : locale === 'en' ? 'Business' : locale === 'zh' ? '企业' : locale === 'ja' ? '企業' : '기업'}</p>
                    <div className="space-y-2">
                      {b2bUseCases.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-2">{locale === 'vi' ? 'Nhà dân' : locale === 'en' ? 'Homeowners' : locale === 'zh' ? '家庭用户' : locale === 'ja' ? 'ご家庭' : '가정'}</p>
                    <div className="space-y-2">
                      {householdUseCases.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-orange-300 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
              {heroStats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 text-emerald-300">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tai-lieu" className="py-12 sm:py-16 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm border border-white/10 mb-4">
                  <FileText className="h-4 w-4 text-emerald-300" />
                  {t.downloadTitle}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">{t.docsTitle}</h2>
                <p className="text-gray-300 mt-2 max-w-2xl">
                  {t.docsLead}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                File gốc đã được đồng bộ từ `epcvinahome`
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {documents.map((doc) => (
                <div key={doc.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-2">{doc.pages}</p>
                      <h3 className="text-xl font-bold text-white">{doc.title}</h3>
                      <p className="text-sm text-gray-300 mt-2 leading-relaxed">{doc.desc}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-emerald-300" />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:bg-gray-100 transition-colors min-h-[44px]"
                    >
                      {t.viewFile}
                    </button>
                    <a href={doc.href} download className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/15 transition-colors min-h-[44px]">
                      {t.download}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-500/10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{locale === 'vi' ? 'Cần bản PDF cho hồ sơ thầu hoặc để gửi cho gia đình xem trước?' : 'Need a PDF for tender or for family review?'}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {locale === 'vi' ? 'Nếu bạn cần file theo format nhà thầu hoặc tài liệu rút gọn, dễ hiểu cho chủ nhà, EPCVINA có thể chuẩn bị bản phù hợp.' : 'If you need a contractor-format file or a shorter homeowner-friendly version, EPCVINA can prepare the right one.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:0988446113"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-gray-100 transition-colors min-h-[44px]"
                >
                  <Phone className="h-4 w-4" />
                  {t.callConsult}
                </a>
                <a
                  href="tel:0368927332"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/15 transition-colors min-h-[44px]"
                >
                  <Wrench className="h-4 w-4" />
                  {t.technicalSupport}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.coreTitle}</h2>
              <p className="text-gray-500 mt-2">{t.coreLead}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {capabilityCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">{card.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-100 p-5 bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-2">{t.input}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{locale === 'vi' ? 'Khảo sát hiện trạng, phân tích tải điện, kiểm tra mái và nhu cầu đầu tư.' : 'Site survey, load analysis, roof inspection, and investment requirements.'}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-5 bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-2">{t.process}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{locale === 'vi' ? 'Thiết kế giải pháp, lập dự toán, chuẩn bị hồ sơ kỹ thuật và triển khai EPC.' : 'Solution design, cost estimation, technical documentation, and EPC delivery.'}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-5 bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mb-2">{t.output}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{locale === 'vi' ? 'Hệ thống vận hành ổn định, hồ sơ bàn giao rõ ràng và kế hoạch bảo trì dài hạn.' : 'Stable operation, clear handover documents, and a long-term maintenance plan.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.certTitle}</h2>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  {t.certLead}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {certifications.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-gray-100 p-4">
                      <div className="text-emerald-600 mb-3">{item.icon}</div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">{t.clientTitle2}</h2>
                <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                  {t.clientLead}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {clientNames.map((name) => (
                    <div key={name} className="rounded-2xl bg-white/10 border border-white/10 p-4 flex flex-col items-center justify-center gap-3 min-h-[110px] text-center">
                      {clientLogos[name] ? (
                        <img src={clientLogos[name].src} alt={clientLogos[name].alt} className="h-10 w-auto object-contain" loading="lazy" />
                      ) : (
                        <Handshake className="h-8 w-8 text-emerald-300" />
                      )}
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-950 to-slate-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-2 border border-emerald-400/20 mb-5">
              <CheckCircle className="h-4 w-4 text-emerald-300" />
              {t.ready}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.finalTitle}</h2>
            <p className="text-gray-300 mb-8">
              {t.finalLead}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/lien-he" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl min-h-[44px]">
                <Phone className="h-5 w-5" />
                {locale === 'vi' ? 'Liên hệ ngay' : 'Contact now'}
              </a>
              <a href="/du-an" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 min-h-[44px]">
                <TrendUp className="h-5 w-5" />
                {locale === 'vi' ? 'Xem dự án thực tế' : 'View real projects'}
              </a>
              <a href="/dien-mat-troi-gia-dinh" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 min-h-[44px]">
                <Sun className="h-5 w-5" />
                {locale === 'vi' ? 'Xem cho nhà dân' : 'Homeowner view'}
              </a>
              <a href="/bao-gia" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 min-h-[44px]">
                <FileText className="h-5 w-5" />
                {locale === 'vi' ? 'Xem báo giá' : 'View quote'}
              </a>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-left">
              {contactChannels.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-1">{contact.label}</p>
                  <p className="text-lg font-bold text-white">{contact.value}</p>
                  <p className="mt-1 text-xs text-gray-300 leading-relaxed">{contact.note}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {previewDoc && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-preview-title"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative flex h-[90dvh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Xem trước PDF</p>
                <h3 id="pdf-preview-title" className="text-lg font-semibold text-gray-900">
                  {previewDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.href}
                  download
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Tải xuống
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Đóng xem trước"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100">
              <iframe
                src={previewDoc.href}
                title={previewDoc.title}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
