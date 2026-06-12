import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: 'Lắp điện mặt trời có thực sự tiết kiệm tiền điện không?',
    answer: 'Có. Hệ thống điện mặt trời giúp giảm 70-90% hóa đơn điện hàng tháng. Với giá điện ngày càng tăng, mức tiết kiệm sẽ càng lớn theo thời gian. Trung bình một hệ 5kWp tiết kiệm được 1.5-2.5 triệu đồng/tháng.',
  },
  {
    question: 'Thời gian hoàn vốn là bao lâu?',
    answer: 'Thời gian hoàn vốn trung bình từ 3-5 năm cho hệ On-Grid và 5-7 năm cho hệ Hybrid. Sau khi hoàn vốn, bạn sẽ sử dụng điện miễn phí trong suốt tuổi thọ còn lại của hệ thống (20-25 năm).',
  },
  {
    question: 'Tấm pin mặt trời bền được bao lâu?',
    answer: 'Tấm pin quang năng chất lượng cao có tuổi thọ trên 25 năm với hiệu suất giảm dần khoảng 0.5%/năm. Sau 25 năm, tấm pin vẫn hoạt động ở mức 80-85% công suất ban đầu. Bảo hành sản phẩm từ 12-15 năm.',
  },
  {
    question: 'Hệ thống có hoạt động trong ngày mưa hoặc trời âm u không?',
    answer: 'Có, hệ thống vẫn phát điện trong điều kiện ít nắng, tuy nhiên sản lượng sẽ giảm 50-80% so với ngày nắng. Hệ thống được thiết kế dựa trên sản lượng trung bình cả năm nên đã tính đến các ngày mưa.',
  },
  {
    question: 'Chi phí bảo trì hàng năm là bao nhiêu?',
    answer: 'Chi phí bảo trì rất thấp, chủ yếu là vệ sinh tấm pin 2-4 lần/năm (có thể tự làm bằng nước sạch). Không có chi phí nhiên liệu hay phụ tùng thay thế định kỳ. Chi phí bảo trì chuyên nghiệp khoảng 500.000-1.000.000đ/năm.',
  },
  {
    question: 'Sự khác biệt giữa On-Grid và Hybrid là gì?',
    answer: 'On-Grid (hòa lưới): Hoạt động song song với điện lưới, không lưu trữ, chi phí thấp hơn, tắt khi mất điện. Hybrid: Có pin lưu trữ, hoạt động độc lập khi mất điện, chi phí cao hơn nhưng đảm bảo nguồn điện liên tục.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
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

export default function FAQSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hỏi đáp</h2>
            <p className="text-gray-500 mt-2">Những câu hỏi thường gặp về điện mặt trời</p>
          </div>
          <a href="/faq" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            Tìm hiểu thêm
          </a>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
