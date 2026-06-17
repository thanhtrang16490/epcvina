import { useState, useRef, useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'EPCVINA cung cấp những dịch vụ gì?',
    answer: 'EPCVINA cung cấp giải pháp tổng thể về cơ điện MEP (HVAC, điện, cấp thoát nước, PCCC, utility), năng lượng mặt trời (Solar Home, Solar C&I, Hybrid, BESS, EV Charger), và dịch vụ vận hành bảo trì (O&M) cho hệ thống cơ điện và năng lượng.',
    category: 'Dịch vụ',
  },
  {
    question: 'Mô hình ZERO-CAPEX là gì?',
    answer: 'ZERO-CAPEX là mô hình hợp tác mà Quỹ Đầu Tư Solar sẽ đầu tư 100% vốn cho hệ thống điện mặt trời. Nhà máy chỉ mua điện với giá cạnh tranh, không cần vốn ban đầu. Sau ~20 năm, nhà máy sẽ nhận quyền sở hữu hệ thống.',
    category: 'Đầu tư',
  },
  {
    question: 'EPCVINA đã thực hiện những dự án lớn nào?',
    answer: 'EPCVINA đã thực hiện 500+ dự án cho các khách hàng lớn như Samsung SEVT (Thái Nguyên), VinFast (Hải Phòng), Lotte Mall (Hà Nội), Vinhomes, Keangnam, Shilla Hotel và nhiều doanh nghiệp FDI khác.',
    category: 'Dự án',
  },
  {
    question: 'Thời gian thi công trung bình là bao lâu?',
    answer: 'Tùy thuộc vào quy mô dự án: Dự án MEP nhà máy công nghiệp thường từ 3-6 tháng, hệ thống điện mặt trời mái nhà từ 1-3 tháng, dự án lớn có thể kéo dài 6-12 tháng. EPCVINA cam kết đúng tiến độ đã ký kết.',
    category: 'Thi công',
  },
  {
    question: 'Chính sách bảo hành của EPCVINA như thế nào?',
    answer: 'EPCVINA cung cấp bảo hành 12-24 tháng cho công trình MEP, bảo hành 5-12 năm cho tấm pin mặt trời (tùy hãng), và hỗ trợ kỹ thuật 24/7 trong suốt thời gian bảo hành. Chúng tôi cũng cung cấp gói O&M dài hạn sau khi hết bảo hành.',
    category: 'Bảo hành',
  },
  {
    question: 'Làm sao để nhận tư vấn và báo giá?',
    answer: 'Bạn có thể liên hệ qua hotline 0988 446 113 (Mrs. Giang), email epcvina@hotmail.com, hoặc để lại thông tin trên website. Đội ngũ chuyên gia sẽ liên hệ tư vấn trong vòng 24 giờ.',
    category: 'Liên hệ',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Tất cả');
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categories = ['Tất cả', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

  const filteredFaqs =
    filterCategory === 'Tất cả'
      ? faqs
      : faqs.filter((faq) => faq.category === filterCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, filteredFaqs.length);
  }, [filteredFaqs]);

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
          <p className="text-lg text-gray-600">Giải đáp thắc mắc của khách hàng</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setFilterCategory(category);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filterCategory === category
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 ${
                openIndex === index ? 'border-red-200 shadow-md' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>

                <svg
                  className={`w-6 h-6 text-red-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === index ? contentRefs.current[index]?.scrollHeight || 0 : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
          <p className="text-gray-900 font-semibold mb-4">
            Vẫn còn thắc mắc? Liên hệ với chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0988446113"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0988 446 113
            </a>
            <a
              href="mailto:epcvina@hotmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full transition-all hover:shadow-lg border-2 border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              epcvina@hotmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
