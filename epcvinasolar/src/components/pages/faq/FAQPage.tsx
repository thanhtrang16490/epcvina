import { useState } from 'react';
import { CaretDown, CaretUp, Phone, ChatCircle } from '@phosphor-icons/react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageProps {
  generalFAQ: FAQItem[];
  productFAQ: Record<string, FAQItem[]>;
}

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-200 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{item.question}</span>
        {isOpen ? (
          <CaretUp className="w-5 h-5 text-blue-500 flex-shrink-0" weight="bold" />
        ) : (
          <CaretDown className="w-5 h-5 text-gray-400 flex-shrink-0" weight="bold" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage({ generalFAQ, productFAQ }: FAQPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Object.keys(productFAQ)];

  const categoryLabels: Record<string, string> = {
    all: 'Tất cả',
    ...Object.fromEntries(categories.slice(1).map(c => [c, c])),
  };

  // Filter FAQs based on active category
  const filteredFAQs: Array<{ item: FAQItem; category: string }> = [];
  if (activeCategory === 'all') {
    generalFAQ.forEach(item => filteredFAQs.push({ item, category: 'Chung' }));
    Object.entries(productFAQ).forEach(([cat, items]) => {
      items.forEach(item => filteredFAQs.push({ item, category: cat }));
    });
  } else {
    if (activeCategory === 'Chung') {
      generalFAQ.forEach(item => filteredFAQs.push({ item, category: 'Chung' }));
    } else {
      (productFAQ[activeCategory] || []).forEach(item =>
        filteredFAQs.push({ item, category: activeCategory })
      );
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((entry, i) => (
            <div key={i}>
              {/* Category label for "all" view */}
              {activeCategory === 'all' && (
                i === 0 || filteredFAQs[i - 1].category !== entry.category
              ) && (
                <div className="flex items-center gap-2 mt-8 mb-4 first:mt-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">
                      {entry.category.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{entry.category}</h2>
                </div>
              )}
              <FAQAccordion item={entry.item} index={i} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 sm:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vẫn còn thắc mắc?</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
            Đội ngũ kỹ sư EPCVINA Solar sẵn sàng tư vấn miễn phí và giải đáp mọi thắc mắc về điện mặt trời.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:0988446113"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm"
            >
              <Phone className="w-4 h-4" weight="fill" />
              Gọi tư vấn: 0988 446 113
            </a>
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all text-sm"
            >
              <ChatCircle className="w-4 h-4" weight="fill" />
              Chat Zalo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
