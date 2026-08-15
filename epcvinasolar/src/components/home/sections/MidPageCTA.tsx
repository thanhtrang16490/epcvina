import { Phone, ArrowRight } from '@phosphor-icons/react';
import { getLocaleFromPathname } from '../../../i18n/messages';
import { getLocalizedRoute } from '../../../i18n/routes';

interface MidPageCTAProps {
  variant: 'benefits' | 'reviews';
  pathname?: string;
}

export default function MidPageCTA({ variant, pathname = '/' }: MidPageCTAProps) {
  const locale = getLocaleFromPathname(pathname);
  const quoteHref = getLocalizedRoute(locale, 'quote');
  if (variant === 'benefits') {
    return (
      <section className="bg-gradient-to-r from-[#1a365d] to-[#0f2444] py-8 sm:py-10" data-header-theme="dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div className="text-center sm:text-left">
              <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">
                {locale === 'vi'
                  ? 'Bạn cần tư vấn giải pháp phù hợp?'
                  : locale === 'en'
                    ? 'Need the right solution advice?'
                    : locale === 'zh'
                      ? '需要合适的方案咨询吗？'
                      : locale === 'ja'
                        ? '最適なソリューションをご相談ですか？'
                        : '적합한 솔루션 상담이 필요하신가요?'}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                {locale === 'vi'
                  ? 'Kỹ sư EPCVINA khảo sát miễn phí, báo giá minh bạch trong 24h.'
                  : locale === 'en'
                    ? 'EPCVINA engineers provide a free survey and transparent quote within 24 hours.'
                    : locale === 'zh'
                      ? 'EPCVINA 工程师提供免费勘察，并在 24 小时内给出透明报价。'
                      : locale === 'ja'
                        ? 'EPCVINA の技術者が無料調査を行い、24時間以内に明確なお見積りをご案内します。'
                        : 'EPCVINA 엔지니어가 무료 현장조사와 24시간 내 투명한 견적을 제공합니다.'}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={quoteHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B01A22] text-white font-bold rounded-full text-sm transition-colors active:scale-[0.98] shadow-lg"
              >
                <Phone className="h-4 w-4" weight="bold" />
                {locale === 'vi' ? 'Nhận báo giá' : locale === 'en' ? 'Get quote' : locale === 'zh' ? '获取报价' : locale === 'ja' ? '見積を取得' : '견적 받기'}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Reviews variant — pricing teaser + social proof CTA
  return (
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-8 sm:py-10" data-header-theme="dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {locale === 'vi' ? 'Chỉ từ 65 triệu' : locale === 'en' ? 'From 65M VND' : locale === 'zh' ? '起价 6,500 万越盾' : locale === 'ja' ? '6,500万VNDから' : '6,500만 VND부터'}
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {locale === 'vi' ? 'Hoàn vốn 3–5 năm' : locale === 'en' ? 'Payback in 3–5 years' : locale === 'zh' ? '3–5 年回本' : locale === 'ja' ? '3〜5年で回収' : '3~5년 회수'}
              </span>
            </div>
            <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">
              {locale === 'vi'
                ? 'Bắt đầu tiết kiệm điện ngay hôm nay'
                : locale === 'en'
                  ? 'Start saving on electricity today'
                  : locale === 'zh'
                    ? '今天就开始节省电费'
                    : locale === 'ja'
                      ? '今日から電気代を節約しましょう'
                      : '지금 바로 전기요금 절감을 시작하세요'}
            </p>
            <p className="text-orange-100 text-sm mt-1">
              {locale === 'vi'
                ? 'Đăng ký khảo sát miễn phí — không ràng buộc, không chi phí ẩn.'
                : locale === 'en'
                  ? 'Book a free survey with no obligation and no hidden cost.'
                  : locale === 'zh'
                    ? '预约免费勘察，无任何绑定与隐藏费用。'
                    : locale === 'ja'
                      ? '無料調査を予約。縛りなし、追加費用なし。'
                      : '무료 현장조사 신청, 의무 없음, 숨은 비용 없음.'}
            </p>
          </div>
          <a
            href={quoteHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 hover:bg-orange-50 font-bold rounded-full text-sm transition-colors active:scale-[0.98] shadow-lg flex-shrink-0"
          >
            {locale === 'vi' ? 'Nhận báo giá miễn phí' : locale === 'en' ? 'Get a free quote' : locale === 'zh' ? '免费获取报价' : locale === 'ja' ? '無料見積を取得' : '무료 견적 받기'}
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
