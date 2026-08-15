import { Star, ArrowRight } from '@phosphor-icons/react';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';

const reviewsByLocale: Record<string, {
  name: string;
  location: string;
  capacity: string;
  quote: string;
  rating: number;
  aspect: string;
  completion: string;
}[]> = {
  vi: [
    { name: 'Chị Hà', location: 'Hà Đông - Hà Nội', capacity: '15 kWp Hybrid', quote: 'Từ khi lắp điện mặt trời, hóa đơn điện giảm hẳn. Buổi tối có pin lưu trữ nên không lo mất điện. Đội ngũ thi công chuyên nghiệp, nhiệt tình.', rating: 5, aspect: 'Tiết kiệm chi phí & Dịch vụ tốt', completion: 'T7.2024' },
    { name: 'Anh Thắng', location: 'TP. Hải Dương - Hải Dương', capacity: '15 kWp Hybrid 3P', quote: 'Chất lượng thi công tuyệt vời, sơn tĩnh điện rất đẹp và bền. Hệ thống hoạt động ổn định, tiết kiệm được nhiều điện. Rất hài lòng!', rating: 5, aspect: 'Chất lượng thi công & Thẩm mỹ', completion: 'T6.2024' },
    { name: 'Chú Thanh', location: 'TP. Hải Dương - Hải Dương', capacity: '22 kWp Hybrid', quote: 'Công trình phức tạp nhưng đội ngũ thi công rất chuyên nghiệp. Lắp trên cao 6m mà vẫn an toàn, nhanh chóng. Giờ không lo mất điện với 20kWh pin lưu trữ!', rating: 5, aspect: 'Thi công phức tạp & Chuyên nghiệp', completion: 'T6.2024' },
    { name: 'Anh Thắng', location: 'Thanh Miện - Hải Dương', capacity: '15 kWp On-Grid', quote: 'Lắp trên tầng 7 mà thi công nhanh và an toàn. Giờ tiết kiệm được gần 3 triệu tiền điện mỗi tháng. Cảm ơn đội ngũ EPCVINA!', rating: 5, aspect: 'Thi công an toàn & Tiết kiệm điện', completion: '2024' },
    { name: 'Anh Quỳnh', location: 'Châu Thái - Hải Dương', capacity: '6.5 kWp Hybrid', quote: 'Diện tích mái nhỏ nhưng vẫn lắp được 6.5 kWp. Pin lưu trữ 10kWh dùng thoải mái buổi tối. Anh em thi công nhiệt tình, cẩn thận.', rating: 5, aspect: 'Tối ưu diện tích & Pin lưu trữ', completion: '2024' },
  ],
  en: [
    { name: 'Ms. Ha', location: 'Ha Dong, Hanoi', capacity: '15 kWp Hybrid', quote: 'Since the solar system was installed, our electricity bill has dropped significantly. The battery keeps us covered in the evening, and the installation team was professional and responsive.', rating: 5, aspect: 'Cost savings & service', completion: 'Jul 2024' },
    { name: 'Mr. Thang', location: 'Hai Duong City', capacity: '15 kWp Hybrid 3P', quote: 'Excellent workmanship, durable powder-coated finish, and stable system performance. We are very satisfied with the savings and overall result.', rating: 5, aspect: 'Build quality & aesthetics', completion: 'Jun 2024' },
    { name: 'Mr. Thanh', location: 'Hai Duong City', capacity: '22 kWp Hybrid', quote: 'A complex project, but the crew handled it professionally. Even at a 6m height, the work was safe and fast. No more worry about outages thanks to 20 kWh storage.', rating: 5, aspect: 'Complex installation & professionalism', completion: 'Jun 2024' },
    { name: 'Mr. Thang', location: 'Thanh Mien, Hai Duong', capacity: '15 kWp On-Grid', quote: 'Fast and safe installation on the 7th floor. We are now saving almost 3 million VND every month. Thanks to the EPCVINA team!', rating: 5, aspect: 'Safe installation & bill savings', completion: '2024' },
    { name: 'Mr. Quynh', location: 'Chau Thai, Hai Duong', capacity: '6.5 kWp Hybrid', quote: 'Even with a small roof area, they still fit 6.5 kWp. The 10 kWh battery is very convenient in the evening, and the installers were careful and friendly.', rating: 5, aspect: 'Space optimization & storage', completion: '2024' },
  ],
  zh: [
    { name: 'Ha 女士', location: '河东 - 河内', capacity: '15 kWp 混合系统', quote: '安装后电费明显下降，晚上有储能电池也不担心停电。施工团队专业又负责。', rating: 5, aspect: '节省成本与服务', completion: '2024年7月' },
    { name: 'Thang 先生', location: '海阳市', capacity: '15 kWp 三相混合', quote: '施工质量很棒，喷涂工艺漂亮且耐用。系统运行稳定，节省了很多电费，非常满意。', rating: 5, aspect: '施工质量与美观', completion: '2024年6月' },
    { name: 'Thanh 先生', location: '海阳市', capacity: '22 kWp 混合系统', quote: '项目很复杂，但施工团队非常专业。即使在 6 米高处也安全快捷，现在有 20kWh 储能，不再担心停电。', rating: 5, aspect: '复杂施工与专业性', completion: '2024年6月' },
    { name: 'Thang 先生', location: '青眠 - 海阳', capacity: '15 kWp 并网系统', quote: '在七楼施工也很快很安全。现在每月节省将近 300 万越盾电费。感谢 EPCVINA 团队！', rating: 5, aspect: '安全施工与省电', completion: '2024' },
    { name: 'Quynh 先生', location: '周泰 - 海阳', capacity: '6.5 kWp 混合系统', quote: '屋顶面积不大，但还是装下了 6.5 kWp。10kWh 储能晚上使用很方便，施工人员也很细心。', rating: 5, aspect: '空间优化与储能', completion: '2024' },
  ],
  ja: [
    { name: 'Ha 様', location: 'ハドン区・ハノイ', capacity: '15 kWp ハイブリッド', quote: '導入後は電気代が大きく下がりました。夜間も蓄電池で安心でき、施工チームもとても丁寧でした。', rating: 5, aspect: 'コスト削減とサービス', completion: '2024年7月' },
    { name: 'Thang 様', location: 'ハイズオン市', capacity: '15 kWp ハイブリッド3相', quote: '施工品質が素晴らしく、仕上がりも美しく長持ちします。発電も安定していて大変満足しています。', rating: 5, aspect: '施工品質と外観', completion: '2024年6月' },
    { name: 'Thanh 様', location: 'ハイズオン市', capacity: '22 kWp ハイブリッド', quote: '難しい案件でしたが、施工チームが非常にプロフェッショナルでした。6mの高所でも安全かつ迅速で、20kWh蓄電で停電の心配もありません。', rating: 5, aspect: '複雑施工と専門性', completion: '2024年6月' },
    { name: 'Thang 様', location: 'タンミエン・ハイズオン', capacity: '15 kWp オングリッド', quote: '7階での施工でしたが、早くて安全でした。今では毎月約300万VNDの電気代を節約できています。', rating: 5, aspect: '安全施工と節電', completion: '2024' },
    { name: 'Quynh 様', location: 'チャウタイ・ハイズオン', capacity: '6.5 kWp ハイブリッド', quote: '屋根面積が小さくても6.5 kWpを設置できました。10kWh蓄電池で夜も快適です。施工もとても丁寧でした。', rating: 5, aspect: '面積最適化と蓄電', completion: '2024' },
  ],
  ko: [
    { name: '하 씨', location: '하동 - 하노이', capacity: '15 kWp 하이브리드', quote: '설치 후 전기요금이 크게 줄었습니다. 저녁에는 배터리 덕분에 걱정 없고, 시공팀도 매우 전문적이었습니다.', rating: 5, aspect: '비용 절감 & 서비스', completion: '2024년 7월' },
    { name: '탕 씨', location: '하이즈엉시', capacity: '15 kWp 하이브리드 3상', quote: '시공 품질이 훌륭하고 마감도 매우 깔끔하고 내구성이 좋습니다. 시스템도 안정적으로 잘 작동해서 매우 만족합니다.', rating: 5, aspect: '시공 품질 & 미관', completion: '2024년 6월' },
    { name: '탄 씨', location: '하이즈엉시', capacity: '22 kWp 하이브리드', quote: '복잡한 프로젝트였지만 시공팀이 매우 전문적으로 처리했습니다. 6m 높이에서도 안전하고 빠르게 시공했고, 20kWh 저장장치 덕분에 정전 걱정이 없습니다.', rating: 5, aspect: '복잡 시공 & 전문성', completion: '2024년 6월' },
    { name: '탕 씨', location: '탄미엔 - 하이즈엉', capacity: '15 kWp 온그리드', quote: '7층에서도 시공이 빠르고 안전했습니다. 지금은 매달 전기요금을 거의 300만 VND 절약하고 있습니다.', rating: 5, aspect: '안전 시공 & 절감', completion: '2024' },
    { name: '꿘 씨', location: '쩌우타이 - 하이즈엉', capacity: '6.5 kWp 하이브리드', quote: '지붕 면적이 작아도 6.5 kWp를 설치할 수 있었습니다. 10kWh 배터리는 저녁에 정말 편리했고, 시공도 꼼꼼했습니다.', rating: 5, aspect: '면적 최적화 & 저장장치', completion: '2024' },
  ],
};

export default function ReviewsSection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const reviews = reviewsByLocale[locale] ?? reviewsByLocale.vi;
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
            {t.reviewsTitle}
          </h2>
          <p className="text-gray-500 mt-2">
            {t.reviewsLead}
          </p>
          <a
            href="#tu-van"
            className="inline-flex items-center gap-2 mt-4 text-[#DC2626] hover:text-[#B01A22] font-semibold text-sm active:scale-[0.98] transition-colors"
          >
            {t.reviewsCta}
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>

        {/* Horizontal scroll carousel */}
        <p className="sm:hidden text-xs text-gray-600 text-center mb-2 animate-pulse">
          {locale === 'vi' ? '&larr; Vuốt để xem thêm &rarr;' : locale === 'en' ? '&larr; Swipe to see more &rarr;' : locale === 'zh' ? '&larr; 左右滑动查看更多 &rarr;' : locale === 'ja' ? '&larr; スワイプして続きを見る &rarr;' : '&larr; 좌우로 밀어 더 보기 &rarr;'}
        </p>
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10 sm:hidden" aria-hidden="true" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10 sm:hidden" aria-hidden="true" />
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-5 pb-4 touch-pan-x">
          {reviews.map((review, i) => (
            <div
              key={review.name + review.location}
              className="w-[320px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
            >
              {/* Typographic quotation mark */}
              <span className="text-4xl leading-none text-orange-200 font-serif mb-2 select-none" aria-hidden="true">&ldquo;</span>

              {/* Quotes text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">
                {review.quote}
              </p>

              {/* Star rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-amber-400"
                    weight="fill"
                  />
                ))}
              </div>

              {/* Aspect tag */}
              <div className="mb-3">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {review.aspect}
                </span>
              </div>

              {/* Name & location */}
              <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
              <p className="text-gray-400 text-xs mb-2">{review.location}</p>

              {/* Capacity & completion */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="font-medium">{review.capacity}</span>
                <span>{review.completion}</span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
