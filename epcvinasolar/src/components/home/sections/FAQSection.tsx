import { useState } from 'react';
import { motion } from 'motion/react';
import { CaretDown } from '@phosphor-icons/react';

const faqData = [
  {
    question: 'Lắp điện mặt trời có cần xin phép không?',
    answer: 'Có. Theo Nghị định 135/2024/NĐ-CP, hệ thống điện mặt trời mái nhà dưới 1 MWp cần thông báo với Đọc điện lực địa phương. EPCVINA hỗ trợ toàn bộ thủ tục phép, đấu nối lưới và đăng ký bán điện dư với EVN miễn phí cho khách hàng.',
  },
  {
    question: 'Lắp điện mặt trời có thực sự tiết kiệm tiền điện không?',
    answer: 'Có. Hệ thống điện mặt trời giúp giảm 70–90% hóa đơn điện hàng tháng. Với giá điện ngày càng tăng, mức tiết kiệm sẽ càng lớn theo thời gian. Trung bình một hệ 5 kWp tiết kiệm được 1.5–2.5 triệu đồng/tháng.',
  },
  {
    question: 'Thời gian hoàn vốn là bao lâu?',
    answer: 'Thời gian hoàn vốn trung bình từ 3–5 năm cho hệ On-Grid và 5–7 năm cho hệ Hybrid. Sau khi hoàn vốn, bạn sẽ sử dụng điện miễn phí trong suốt tuổi thọ còn lại của hệ thống (20–25 năm).',
  },
  {
    question: 'Tấm pin mặt trời bền được bao lâu? Bảo hành như thế nào?',
    answer: 'Tấm pin chất lượng cao có tuổi thọ trên 25 năm với hiệu suất giảm dần khoảng 0.5%/năm. EPCVINA bảo hành tấm pin 25 năm, inverter 5–10 năm, thi công 2 năm. Hỗ trợ kỹ thuật và bảo trì định kỳ trong suốt vòng đời hệ thống.',
  },
  {
    question: 'Hệ thống có hoạt động trong ngày mưa hoặc trời âm u không?',
    answer: 'Có, hệ thống vẫn phát điện trong điều kiện ít nắng, tuy nhiên sản lượng sẽ giảm 50–80% so với ngày nắng. Hệ thống được thiết kế dựa trên sản lượng trung bình cả năm nên đã tính đến các ngày mưa.',
  },
  {
    question: 'Chi phí phát sinh sau khi lắp đặt là bao nhiêu?',
    answer: 'Chi phí bảo trì rất thấp: chủ yếu là vệ sinh tấm pin 2–4 lần/năm (có thể tự làm bằng nước sạch). Không có chi phí nhiên liệu hay phụ tùng thay thế định kỳ. Bảo trì chuyên nghiệp khoảng 500.000–1.000.000đ/năm. EPCVINA có gói bảo trì O&M dài hạn.',
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border border-gray-200 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <button
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
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="flex items-end justify-between mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">Hỏi đáp</h2>
            <p className="text-gray-500 mt-2">Những câu hỏi thường gặp về điện mặt trời</p>
          </div>
          <a href="/hoi-dap" className="text-[#DC2626] hover:text-[#B01A22] font-medium text-sm active:scale-[0.98]">
            Tìm hiểu thêm
          </a>
        </motion.div>

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
