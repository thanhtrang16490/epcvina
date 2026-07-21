import { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FAQ_DATA } from './data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? FAQ_DATA : FAQ_DATA.slice(0, 5);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-xl text-slate-600">Giải đáp mọi thắc mắc về điện mặt trời</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {visibleFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left transition-all hover:bg-slate-50 sm:p-6"
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
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition-all hover:border-orange-300 hover:text-orange-700"
            >
              Xem thêm {FAQ_DATA.length - visibleFaqs.length} câu hỏi
            </button>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-slate-600 mb-4">Vẫn còn thắc mắc?</p>
          <a
            href="tel:0988446113"
            onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'faq_hotline_click', { event_category: 'conversion' })}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
          >
            Gọi Tư Vấn Ngay: 0988 446 113
          </a>
          <a
            href="/calculator"
            className="ml-3 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-lg transition-all"
          >
            Mở máy tính
          </a>
        </div>
      </div>
    </section>
  );
}
