import { Lightning, ShieldCheck, Cpu, CloudRain, Wrench, Building } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';

const benefitsByLocale: Record<string, { icon: Icon; title: string; description: string }[]> = {
  vi: [
  {
    icon: Building,
    title: 'Thiết kế chuẩn cơ điện',
    description: 'Mọi hệ thống đều được thiết kế theo tiêu chuẩn cơ điện MEP bởi kỹ sư có chứng chỉ hành nghề, đảm bảo tính kỹ thuật và pháp lý.',
  },
  {
    icon: ShieldCheck,
    title: 'An toàn điện, chống sét, tiếp địa',
    description: 'Hệ thống tiếp địa, chống sét lan truyền và bảo vệ quá áp được thi công đồng bộ theo tiêu chuẩn IEC — bảo vệ thiết bị và người dùng.',
  },
  {
    icon: Cpu,
    title: 'Kiểm soát tải, inverter, pin lưu trữ',
    description: 'Tích hợp giải pháp quản lý năng lượng thông minh: tự động ưu tiên pin ban đêm, tối ưu nguồn điện mặt trời ban ngày, giảm tối đa tiền điện.',
  },
  {
    icon: CloudRain,
    title: 'Thi công đảm bảo chống thấm mái',
    description: 'Đội ngũ thi công có kinh nghiệm xử lý chống thấm mái trước và sau khi lắp đặt tấm pin, đảm bảo kết cấu mái không bị ảnh hưởng.',
  },
  {
    icon: Wrench,
    title: 'Bảo trì dài hạn',
    description: 'Cam kết bảo trì định kỳ, theo dõi sản lượng từ xa, xử lý sự cố nhanh trong 24h — đồng hành cùng khách hàng trong suốt vòng đời hệ thống.',
  },
  {
    icon: Lightning,
    title: 'Nền tảng nhà thầu MEP toàn diện',
    description: 'EPCVINA có nền tảng từ nhà thầu cơ điện MEP, HVAC, PCCC, Electrical, Plumbing — đảm bảo thi công Solar tích hợp hoàn chỉnh trong một dự án.',
  },
  ],
  en: [
    { icon: Building, title: 'MEP-grade design', description: 'Every system is engineered to MEP standards by licensed engineers for technical and legal compliance.' },
    { icon: ShieldCheck, title: 'Electrical safety, lightning and grounding', description: 'Grounding, surge protection, and overvoltage safety are built to IEC standards to protect equipment and people.' },
    { icon: Cpu, title: 'Load, inverter, and battery control', description: 'Smart energy management prioritizes battery use at night and solar use during the day to minimize bills.' },
    { icon: CloudRain, title: 'Roof waterproofing protection', description: 'Our crews protect roof waterproofing before and after installation so the roof structure is not affected.' },
    { icon: Wrench, title: 'Long-term maintenance', description: 'Scheduled O&M, remote monitoring, and fast issue handling within 24 hours throughout the system lifecycle.' },
    { icon: Lightning, title: 'Full MEP contractor foundation', description: 'EPCVINA brings electrical, HVAC, fire protection, and plumbing expertise into a complete solar delivery model.' },
  ],
  zh: [
    { icon: Building, title: '符合机电标准的设计', description: '所有系统均由持证工程师按 MEP 标准设计，兼顾技术与合规。' },
    { icon: ShieldCheck, title: '电气安全、防雷与接地', description: '接地、防雷与过压保护按照 IEC 标准实施，保护设备与人员安全。' },
    { icon: Cpu, title: '负载、逆变器与电池控制', description: '智能能源管理在夜间优先使用电池，白天优先使用太阳能，降低电费。' },
    { icon: CloudRain, title: '屋面防水保障', description: '安装前后都进行屋面防水处理，确保结构不受影响。' },
    { icon: Wrench, title: '长期维护支持', description: '定期维保、远程监控与 24 小时内快速响应，覆盖系统全生命周期。' },
    { icon: Lightning, title: '完整 MEP 总包背景', description: 'EPCVINA 将电气、暖通、消防与给排水经验整合进太阳能交付流程。' },
  ],
  ja: [
    { icon: Building, title: 'MEP基準の設計', description: '有資格技術者が MEP 基準で設計し、技術面と法令面の両方を満たします。' },
    { icon: ShieldCheck, title: '電気安全・雷保護・接地', description: '接地、サージ保護、過電圧保護を IEC 基準で実装し、機器と利用者を守ります。' },
    { icon: Cpu, title: '負荷・インバーター・蓄電制御', description: '昼は太陽光、夜は蓄電池を優先するエネルギー管理で電気代を抑えます。' },
    { icon: CloudRain, title: '屋根防水の保全', description: '設置前後に防水処理を行い、屋根構造への影響を最小化します。' },
    { icon: Wrench, title: '長期保守', description: '定期保守、遠隔監視、24時間以内の迅速対応で運用を支えます。' },
    { icon: Lightning, title: 'MEP総合工事の基盤', description: '電気・空調・防災・給排水の経験を統合した太陽光提供体制です。' },
  ],
  ko: [
    { icon: Building, title: 'MEP 기준 설계', description: '자격을 갖춘 엔지니어가 MEP 기준으로 설계하여 기술과 법적 요건을 모두 충족합니다.' },
    { icon: ShieldCheck, title: '전기 안전, 피뢰, 접지', description: '접지, 서지 보호, 과전압 보호를 IEC 기준으로 시공해 장비와 사용자를 보호합니다.' },
    { icon: Cpu, title: '부하·인버터·배터리 제어', description: '야간에는 배터리를, 낮에는 태양광을 우선하는 지능형 에너지 관리로 요금을 줄입니다.' },
    { icon: CloudRain, title: '지붕 방수 보호', description: '설치 전후로 방수 처리를 진행해 지붕 구조에 영향을 주지 않도록 합니다.' },
    { icon: Wrench, title: '장기 유지보수', description: '정기 O&M, 원격 모니터링, 24시간 내 빠른 대응으로 전 생애를 지원합니다.' },
    { icon: Lightning, title: 'MEP 종합공사 기반', description: '전기, 공조, 소방, 배관 경험을 태양광 사업 전반에 통합합니다.' },
  ],
};

export default function BenefitsSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const benefits = benefitsByLocale[locale] ?? benefitsByLocale.vi;
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center mb-12"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-red-600 mb-3 font-display">
            {t.benefitsLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight font-display">
            {t.benefitsTitle.split(' ').slice(0, -1).join(' ')} <span className="text-red-600">EPCVINA Solar</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t.benefitsLead}
          </p>
          <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Mỗi công trình điện mặt trời đều được đội ngũ kỹ sư có chứng chỉ hành nghề khảo sát thực tế, thiết kế bản vẽ kỹ thuật, tính toán kết cấu mái, giải pháp chống thấm, tiếp địa, chống sét và bảo vệ quá áp — đảm bảo hệ thống hoạt động ổn định 25–30 năm.'
              : locale === 'en'
                ? 'Every solar project is surveyed in person by licensed engineers, with technical drawings, roof-load calculations, waterproofing, grounding, lightning protection, and overvoltage protection for 25–30 years of stable operation.'
                : locale === 'zh'
                  ? '每个项目都由持证工程师现场勘察，完成技术图纸、屋顶承载计算、防水、接地、防雷与过压保护，确保系统稳定运行 25–30 年。'
                  : locale === 'ja'
                    ? '各案件は有資格技術者が現地調査を行い、技術図面、屋根荷重計算、防水、接地、雷保護、過電圧保護まで含めて 25〜30 年の安定稼働を目指します。'
                    : '각 프로젝트는 자격을 갖춘 엔지니어가 현장 조사, 기술 도면, 지붕 하중 계산, 방수, 접지, 피뢰, 과전압 보호까지 수행해 25~30년 안정 운영을 목표로 합니다.'}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-red-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform duration-200">
                    <Icon className="h-5 w-5 text-red-600" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5 text-[15px]">{benefit.title}</h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
