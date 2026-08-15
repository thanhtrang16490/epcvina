import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';

const faqDataByLocale: Record<string, { question: string; answer: string }[]> = {
  vi: [
    { question: 'Lắp điện mặt trời có cần xin phép không?', answer: 'Có. Theo Nghị định 135/2024/NĐ-CP, hệ thống điện mặt trời mái nhà dưới 1 MWp cần thông báo với Đọc điện lực địa phương. EPCVINA hỗ trợ toàn bộ thủ tục phép, đấu nối lưới và đăng ký bán điện dư với EVN miễn phí cho khách hàng.' },
    { question: 'Lắp điện mặt trời có thực sự tiết kiệm tiền điện không?', answer: 'Có. Hệ thống điện mặt trời giúp giảm 70–90% hóa đơn điện hàng tháng. Với giá điện ngày càng tăng, mức tiết kiệm sẽ càng lớn theo thời gian. Trung bình một hệ 5 kWp tiết kiệm được 1.5–2.5 triệu đồng/tháng.' },
    { question: 'Thời gian hoàn vốn là bao lâu?', answer: 'Thời gian hoàn vốn trung bình từ 3–5 năm cho hệ On-Grid và 5–7 năm cho hệ Hybrid. Sau khi hoàn vốn, bạn sẽ sử dụng điện miễn phí trong suốt tuổi thọ còn lại của hệ thống (20–25 năm).' },
    { question: 'Tấm pin mặt trời bền được bao lâu? Bảo hành như thế nào?', answer: 'Tấm pin chất lượng cao có tuổi thọ trên 25 năm với hiệu suất giảm dần khoảng 0.5%/năm. EPCVINA bảo hành tấm pin 25 năm, inverter 5–10 năm, thi công 2 năm. Hỗ trợ kỹ thuật và bảo trì định kỳ trong suốt vòng đời hệ thống.' },
    { question: 'Hệ thống có hoạt động trong ngày mưa hoặc trời âm u không?', answer: 'Có, hệ thống vẫn phát điện trong điều kiện ít nắng, tuy nhiên sản lượng sẽ giảm 50–80% so với ngày nắng. Hệ thống được thiết kế dựa trên sản lượng trung bình cả năm nên đã tính đến các ngày mưa.' },
    { question: 'Chi phí phát sinh sau khi lắp đặt là bao nhiêu?', answer: 'Chi phí bảo trì rất thấp: chủ yếu là vệ sinh tấm pin 2–4 lần/năm (có thể tự làm bằng nước sạch). Không có chi phí nhiên liệu hay phụ tùng thay thế định kỳ. Bảo trì chuyên nghiệp khoảng 500.000–1.000.000đ/năm. EPCVINA có gói bảo trì O&M dài hạn.' },
  ],
  en: [
    { question: 'Do I need a permit to install solar?', answer: 'Yes. For rooftop systems under 1 MWp, local utility notification is typically required. EPCVINA supports permitting, grid connection, and surplus power registration so customers do not need to manage the process alone.' },
    { question: 'Will solar really reduce my electricity bill?', answer: 'Yes. A solar system can reduce monthly electricity costs by 70-90%. As electricity prices rise over time, the savings become even more significant. A typical 5 kWp system can save about 1.5-2.5 million VND per month.' },
    { question: 'How long is the payback period?', answer: 'The average payback period is 3-5 years for On-Grid systems and 5-7 years for Hybrid systems. After payback, you continue using electricity with very low operating cost for the remaining system lifespan of 20-25 years.' },
    { question: 'How durable are the solar panels, and what warranty is provided?', answer: 'High-quality solar panels last over 25 years with performance degradation of around 0.5% per year. EPCVINA provides a 25-year panel warranty, 5-10 years for inverters, and 2 years for installation workmanship, plus ongoing support.' },
    { question: 'Does the system work on rainy or cloudy days?', answer: 'Yes, the system still generates power under low-sun conditions, though output may drop 50-80% compared to sunny days. The design already factors in annual average production, including rainy periods.' },
    { question: 'What are the ongoing costs after installation?', answer: 'Maintenance costs are very low: mainly panel cleaning 2-4 times per year, which can often be done with clean water. There is no fuel cost or regular replacement of consumables. Professional maintenance is modest and long-term O&M packages are available.' },
  ],
  zh: [
    { question: '安装太阳能需要办理许可吗？', answer: '需要。屋顶系统通常需要向当地电力部门报备。EPCVINA 可协助办理报备、并网及余电上网手续，客户无需自行处理繁琐流程。' },
    { question: '太阳能真的能节省电费吗？', answer: '可以。太阳能系统通常可将每月电费降低 70-90%。随着电价上涨，长期节省会更加明显。一个 5 kWp 系统平均每月可节省约 150 万至 250 万越盾。' },
    { question: '投资回收期多久？', answer: '并网系统平均回收期为 3-5 年，混合系统约 5-7 年。回本后，系统在剩余 20-25 年寿命周期内可持续低成本用电。' },
    { question: '太阳能板耐用吗？保修如何？', answer: '高品质组件可使用 25 年以上，性能年衰减约 0.5%。EPCVINA 提供组件 25 年、逆变器 5-10 年、安装 2 年的保修，并提供持续支持。' },
    { question: '阴雨天系统还能工作吗？', answer: '可以。即使在弱光条件下系统仍会发电，但与晴天相比产量可能下降 50-80%。设计时已考虑全年平均发电量和雨天情况。' },
    { question: '安装后还会产生哪些费用？', answer: '维护成本很低，主要是每年 2-4 次组件清洗。没有燃料费，也无需定期更换耗材。专业维护费用较低，并可提供长期运维方案。' },
  ],
  ja: [
    { question: '太陽光発電の設置に許可は必要ですか？', answer: 'はい。屋根設置型は通常、地域の電力会社への届出が必要です。EPCVINA が申請、連系、余剰電力の手続きまでサポートします。' },
    { question: '本当に電気代は下がりますか？', answer: 'はい。太陽光発電により月々の電気代を 70〜90% 削減できる場合があります。電気料金の上昇に伴い、長期的な節約効果はさらに大きくなります。' },
    { question: '投資回収期間はどのくらいですか？', answer: '平均回収期間はオン・グリッドで 3〜5 年、ハイブリッドで 5〜7 年です。回収後は、残りの寿命期間 20〜25 年にわたり低コストで利用できます。' },
    { question: 'パネルの耐久性と保証は？', answer: '高品質パネルは 25 年以上使用でき、性能劣化は年約 0.5% です。EPCVINA はパネル 25 年、インバーター 5〜10 年、施工 2 年の保証と継続サポートを提供します。' },
    { question: '雨や曇りの日でも発電しますか？', answer: 'はい。日照が弱い条件でも発電しますが、晴天時に比べて出力は 50〜80% ほど低下します。年間平均発電量を前提に設計しています。' },
    { question: '設置後の追加費用はありますか？', answer: '保守費用は非常に低く、主に年 2〜4 回のパネル清掃です。燃料費や定期交換部品は不要で、長期保守プランもご用意しています。' },
  ],
  ko: [
    { question: '태양광 설치에 허가가 필요한가요?', answer: '네. 옥상형 시스템은 보통 지역 전력회사 신고가 필요합니다. EPCVINA는 신고, 계통 연계, 잉여전력 절차까지 지원합니다.' },
    { question: '정말 전기요금이 절감되나요?', answer: '네. 태양광 시스템은 월 전기요금을 70~90%까지 줄일 수 있습니다. 전기요금이 계속 오를수록 장기 절감 효과는 더 커집니다.' },
    { question: '투자 회수 기간은 얼마나 되나요?', answer: '평균 회수 기간은 On-Grid 기준 3~5년, Hybrid 기준 5~7년입니다. 회수 후에는 시스템 수명인 20~25년 동안 낮은 운영비로 사용하실 수 있습니다.' },
    { question: '패널은 얼마나 오래가며 보증은 어떻게 되나요?', answer: '고품질 패널은 25년 이상 사용할 수 있으며 성능 저하는 연 0.5% 수준입니다. EPCVINA는 패널 25년, 인버터 5~10년, 시공 2년 보증과 지속 지원을 제공합니다.' },
    { question: '비 오거나 흐린 날에도 작동하나요?', answer: '네. 일조가 적은 날에도 발전하지만 맑은 날보다 출력은 50~80% 감소할 수 있습니다. 설계 시 연간 평균 발전량을 반영합니다.' },
    { question: '설치 후 추가 비용이 있나요?', answer: '유지보수 비용은 매우 낮으며 주로 연 2~4회 패널 청소가 필요합니다. 연료비나 정기 교체 소모품은 없고 장기 O&M도 가능합니다.' },
  ],
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors active:scale-[0.99]"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <CaretDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          weight="bold"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const faqData = faqDataByLocale[locale] ?? faqDataByLocale.vi;
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">{t.faqTitle}</h2>
            <p className="text-gray-500 mt-2">{t.faqLead}</p>
          </div>
          <a href={locale === 'vi' ? '/hoi-dap' : `/${locale}/faq`} className="text-[#DC2626] hover:text-[#B01A22] font-medium text-sm active:scale-[0.98]">
            {t.faqMore}
          </a>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((item, i) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
