import { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { FAQ_DATA } from './data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-xl text-slate-600">Giải đáp mọi thắc mắc về điện mặt trời</p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-all"
              >
                <span className="text-lg font-semibold text-slate-900 pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <CaretUp className="w-5 h-5 text-slate-500 flex-shrink-0" weight="bold" />
                ) : (
                  <CaretDown className="w-5 h-5 text-slate-500 flex-shrink-0" weight="bold" />
                )}
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6">
                  <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
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
