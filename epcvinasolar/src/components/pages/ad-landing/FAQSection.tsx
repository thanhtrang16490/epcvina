import { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FAQ_DATA } from './data';
import { trackConversionEvent } from '../../../lib/tracking';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? FAQ_DATA : FAQ_DATA.slice(0, 5);

  return (
    <section id="faq" className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-orange-600">Trước khi gửi thông tin</p>
          <h2 className="text-[26px] sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
            Những câu hỏi gia đình thường hỏi trước khi lắp solar
          </h2>
          <p className="text-[14px] sm:text-lg text-slate-600">Nếu còn điểm chưa chắc, EPCVINA sẽ kiểm tra hóa đơn và mái trước khi đề xuất cấu hình.</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {visibleFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset sm:p-6"
              >
                <span className="pr-4 text-[15px] font-semibold leading-snug text-slate-900 sm:text-lg">{faq.q}</span>
                {openIndex === i ? (
                  <CaretUp className="w-5 h-5 text-slate-500 flex-shrink-0" weight="bold" />
                ) : (
                  <CaretDown className="w-5 h-5 text-slate-500 flex-shrink-0" weight="bold" />
                )}
              </button>

              {openIndex === i && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAll && FAQ_DATA.length > visibleFaqs.length && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition-colors hover:border-orange-300 hover:text-orange-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Xem thêm {FAQ_DATA.length - visibleFaqs.length} câu hỏi
            </button>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-[0_18px_50px_-42px_rgba(15,23,42,.45)] sm:mt-10 sm:p-5">
          <p className="mb-4 text-sm leading-relaxed text-slate-600">Vẫn còn thắc mắc về mái nhà, pin lưu trữ hoặc hoàn vốn?</p>
          <div className="grid gap-2 sm:grid-cols-2">
          <a
            href="#contact"
            onClick={() => trackConversionEvent('faq_survey_click', { event_label: 'faq_section', conversion_action: 'faq_survey_click' })}
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition-colors hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Nhận khảo sát miễn phí
          </a>
          <a
            href="tel:0988446113"
            onClick={() => trackConversionEvent('hotline_click', { event_label: 'faq_section', conversion_action: 'hotline_click_faq_section' })}
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-green-600 px-5 text-sm font-black text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            Gọi 0988 446 113
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}
