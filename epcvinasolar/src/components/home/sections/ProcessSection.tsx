import { PhoneCall, MapPin, PencilSimple, FileText, Wrench, ChartBar } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';

const stepsByLocale: Record<string, { step: number; icon: Icon; title: string; description: string }[]> = {
  vi: [
    {
      step: 1,
      icon: PhoneCall,
      title: 'Tiếp nhận thông tin',
      description: 'Khách hàng liên hệ qua hotline, Zalo hoặc form đăng ký trên website. Đội ngũ tư vấn phản hồi trong vòng 2 giờ làm việc, thu thập thông tin về nhu cầu sử dụng điện, hóa đơn điện hàng tháng và diện tích mái khả dụng.',
    },
    {
      step: 2,
      icon: MapPin,
      title: 'Khảo sát thực tế',
      description: 'Kỹ sư có chứng chỉ hành nghề đến tận nơi đo đạc kích thước mái, hướng nắng, phân tích phụ tải điện, kiểm tra kết cấu mái và đường điện hiện tại. Tư vấn trực tiếp công suất phù hợp và loại hệ thống (On-Grid hoặc Hybrid).',
    },
    {
      step: 3,
      icon: PencilSimple,
      title: 'Thiết kế giải pháp',
      description: 'Đội ngũ kỹ sư MEP thiết kế hệ thống theo tiêu chuẩn cơ điện, bao gồm: bản vẽ bố trí tấm pin, sơ đồ đấu nối điện, tính toán kết cấu khung đỡ, giải pháp chống thấm, tiếp địa và chống sét lan truyền. Gửi khách hàng xem xét và phê duyệt.',
    },
    {
      step: 4,
      icon: FileText,
      title: 'Báo giá',
      description: 'Gửi báo giá chi tiết minh bạch từng hạng mục: thiết bị (tấm pin, inverter, khung đỡ, dây dẫn, tủ điện), nhân công lắp đặt, vật tư phụ và phí vận chuyển. Hỗ trợ tư vấn phương án tài chính, trả góp nếu khách hàng có nhu cầu.',
    },
    {
      step: 5,
      icon: Wrench,
      title: 'Thi công & Nghiệm thu',
      description: 'Đội thi công có kinh nghiệm triển khai đúng tiến độ 3–7 ngày. Đảm bảo vệ sinh công trình, xử lý chống thấm mái 100% trước và sau khi lắp đặt. Nghiệm thu bàn giao, hướng dẫn vận hành hệ thống và cách theo dõi sản lượng qua ứng dụng điện thoại.',
    },
    {
      step: 6,
      icon: ChartBar,
      title: 'Bảo trì & Theo dõi sản lượng',
      description: 'EPCVINA theo dõi sản lượng hệ thống từ xa qua nền tảng giám sát. Bảo trì định kỳ 6 tháng/lần: vệ sinh tấm pin, kiểm tra đấu nối, siết chặt khung đỡ. Xử lý sự cố trong vòng 24h. Hỗ trợ kỹ thuật trọn đời hệ thống.',
    },
  ],
  en: [
    { step: 1, icon: PhoneCall, title: 'Initial intake', description: 'Customers reach us via hotline, Zalo, or the website form. Our team responds within 2 business hours and collects usage needs, monthly electricity bills, and usable roof area.' },
    { step: 2, icon: MapPin, title: 'On-site survey', description: 'Certified engineers visit the site to measure the roof, assess sunlight, analyze electrical load, and inspect roof structure and existing wiring. We recommend the right capacity and system type (On-Grid or Hybrid).' },
    { step: 3, icon: PencilSimple, title: 'Solution design', description: 'Our MEP engineers design the system to electrical-mechanical standards, including array layout, wiring diagrams, frame calculations, waterproofing, grounding, and surge protection. The draft is sent for review and approval.' },
    { step: 4, icon: FileText, title: 'Quotation', description: 'We provide a transparent itemized quotation: equipment (modules, inverter, mounting, cabling, distribution boards), installation labor, accessories, and delivery. Financing or installment support is available on request.' },
    { step: 5, icon: Wrench, title: 'Installation & handover', description: 'Our experienced crew completes the work in about 3-7 days. We keep the site clean, fully address roof waterproofing before and after installation, and hand over with operating guidance and app monitoring instructions.' },
    { step: 6, icon: ChartBar, title: 'Maintenance & monitoring', description: 'EPCVINA monitors system output remotely through our monitoring platform. Scheduled maintenance every 6 months includes panel cleaning, connection checks, and frame tightening. Issues are handled within 24 hours.' },
  ],
  zh: [
    { step: 1, icon: PhoneCall, title: '信息接收', description: '客户可通过热线、Zalo 或网站表单联系我们。团队将在 2 个工作小时内回复，并收集用电需求、月电费和可用屋顶面积。' },
    { step: 2, icon: MapPin, title: '现场勘察', description: '持证工程师到现场测量屋顶尺寸、日照条件、电力负载，并检查屋顶结构与现有电路。我们将推荐合适的容量和系统类型（并网或混合）。' },
    { step: 3, icon: PencilSimple, title: '方案设计', description: 'MEP 工程团队按机电标准进行系统设计，包括组件布局、接线图、支架计算、防水、接地和防浪涌方案，并提交客户审核。' },
    { step: 4, icon: FileText, title: '报价', description: '提供透明的明细报价：设备（组件、逆变器、支架、线缆、配电柜）、安装人工、辅材与运输费用。可按需提供金融或分期方案。' },
    { step: 5, icon: Wrench, title: '施工与验收', description: '经验丰富的施工团队通常在 3-7 天内完成。施工前后均重视屋面防水与现场清洁，并交付运行指导与 APP 监控说明。' },
    { step: 6, icon: ChartBar, title: '维护与监控', description: 'EPCVINA 通过监控平台远程跟踪系统发电量。每 6 个月进行一次定期维护：清洗组件、检查连接、紧固支架。故障一般在 24 小时内处理。' },
  ],
  ja: [
    { step: 1, icon: PhoneCall, title: '受付', description: 'お客様はホットライン、Zalo、またはWebフォームからお問い合わせいただけます。2営業時間以内にご返信し、使用状況、月額電気料金、設置可能な屋根面積を確認します。' },
    { step: 2, icon: MapPin, title: '現地調査', description: '有資格エンジニアが現地で屋根寸法、日射条件、電気負荷、屋根構造と既存配線を確認します。適切な容量とシステム種別（オン-grid / ハイブリッド）を提案します。' },
    { step: 3, icon: PencilSimple, title: '設計', description: 'MEPエンジニアが機電基準に沿って、配置図、配線図、架台計算、防水、接地、避雷対策まで含めた設計を行い、ご確認へ回します。' },
    { step: 4, icon: FileText, title: '見積', description: '設備費、施工費、付帯資材、配送費まで明細化した透明な見積をご提示します。必要に応じて分割払いなどのご相談にも対応します。' },
    { step: 5, icon: Wrench, title: '施工・引き渡し', description: '経験豊富な施工チームが通常 3〜7 日で対応します。施工前後の防水と現場清掃を徹底し、運用説明とアプリ監視の案内を行って引き渡します。' },
    { step: 6, icon: ChartBar, title: '保守・監視', description: 'EPCVINA は監視プラットフォームで発電量を遠隔監視します。6 か月ごとの定期保守では、パネル清掃、接続確認、架台増し締めを実施し、異常は 24 時間以内に対応します。' },
  ],
  ko: [
    { step: 1, icon: PhoneCall, title: '문의 접수', description: '고객은 핫라인, Zalo 또는 웹 폼으로 문의하실 수 있습니다. 2영업시간 이내에 회신드리며, 사용 목적, 월 전기요금, 사용 가능한 지붕 면적을 확인합니다.' },
    { step: 2, icon: MapPin, title: '현장 조사', description: '자격을 갖춘 엔지니어가 현장을 방문해 지붕 크기, 일사 조건, 전기 부하, 구조와 기존 배선을 점검합니다. 적합한 용량과 시스템 유형(On-Grid 또는 Hybrid)을 제안합니다.' },
    { step: 3, icon: PencilSimple, title: '솔루션 설계', description: 'MEP 엔지니어가 기계·전기 기준에 따라 배치도, 배선도, 구조 계산, 방수, 접지, 서지 보호까지 포함해 설계하고 고객 검토를 진행합니다.' },
    { step: 4, icon: FileText, title: '견적', description: '장비(모듈, 인버터, 구조물, 배선, 배전반), 설치 인건비, 부자재, 운송비까지 투명하게 세부 견적을 제공합니다. 필요 시 금융/할부 상담도 가능합니다.' },
    { step: 5, icon: Wrench, title: '시공 및 인수', description: '경험 있는 시공팀이 보통 3~7일 내에 작업을 완료합니다. 시공 전후 지붕 방수와 현장 정리를 철저히 하고, 운영 안내와 앱 모니터링 방법을 전달합니다.' },
    { step: 6, icon: ChartBar, title: '유지보수 및 모니터링', description: 'EPCVINA는 모니터링 플랫폼으로 발전량을 원격 확인합니다. 6개월마다 패널 청소, 연결 점검, 구조물 재조임을 포함한 정기 유지보수를 진행하며 이상은 24시간 내 대응합니다.' },
  ],
};

export default function ProcessSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const steps = stepsByLocale[locale] ?? stepsByLocale.vi;
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-3 font-display">
            {t.processLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight font-display">
            {t.processTitle}
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t.processLead}
          </p>
          <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Thời gian triển khai trung bình từ 3–7 ngày tùy công suất. Chúng tôi cam kết đúng tiến độ, đảm bảo vệ sinh công trình và xử lý chống thấm mái 100% trước khi bàn giao.'
              : locale === 'en'
                ? 'Average implementation time is 3-7 days depending on system size. We commit to schedule, site cleanliness, and full roof waterproofing before handover.'
                : locale === 'zh'
                  ? '平均施工周期为 3-7 天，视系统规模而定。我们确保按期交付、现场整洁，并在移交前完成屋面防水处理。'
                  : locale === 'ja'
                    ? '工期は容量に応じて平均 3〜7 日です。工程遵守、現場清掃、引き渡し前の防水処理を徹底します。'
                    : '시스템 규모에 따라 평균 3~7일이 소요됩니다. 일정 준수, 현장 정리, 인수 전 지붕 방수 처리를 보장합니다.'}
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group relative bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#DC2626] text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:-translate-y-0.5 transition-transform duration-200">
                  <Icon className="h-5 w-5 text-[#DC2626]" weight="duotone" />
                </div>

                <h3 className="font-bold text-gray-900 mb-1.5 text-[15px]">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
