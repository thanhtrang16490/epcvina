import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Zap, DollarSign, Wrench, FileText, Shield, Sun } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Chi phí & Thanh toán
  {
    category: '💰 Chi phí & Thanh toán',
    question: 'Lắp điện mặt trời hết bao nhiêu tiền?',
    answer: 'Chi phí phụ thuộc vào công suất và loại hệ thống. Trung bình:\n• On-Grid 5kWp: 70-90 triệu\n• On-Grid 10kWp: 130-160 triệu\n• Hybrid 5kWp + pin: 120-150 triệu\n• Hybrid 10kWp + pin: 200-250 triệu\nSolar Giá Rẻ 24h báo giá chi tiết sau khi khảo sát miễn phí.',
  },
  {
    category: '💰 Chi phí & Thanh toán',
    question: 'Bao lâu hoàn vốn?',
    answer: 'Thời gian hoàn vốn trung bình:\n• On-Grid: 3-5 năm\n• Hybrid: 5-7 năm\nSau khi hoàn vốn, bạn sử dụng điện miễn phí trong 25-30 năm. Với giá điện tăng 10-15%/năm, lợi ích sẽ càng lớn.',
  },
  {
    category: '💰 Chi phí & Thanh toán',
    question: 'Tiết kiệm được bao nhiêu tiền điện?',
    answer: 'Hệ thống điện mặt trời giúp giảm 70-90% hóa đơn điện hàng tháng. Ví dụ:\n• Hệ 5kWp: tiết kiệm 1.5-2.5 triệu/tháng\n• Hệ 10kWp: tiết kiệm 3-5 triệu/tháng\n• Hệ 15kWp: tiết kiệm 4.5-7 triệu/tháng',
  },

  // Kỹ thuật & Lắp đặt
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Lắp điện mặt trời có cần xin phép không?',
    answer: 'Theo Nghị định 135/2024/NĐ-CP, hệ thống dưới 1MWp cần thông báo với Điện lực địa phương. Solar Giá Rẻ 24h hỗ trợ toàn bộ thủ tục:\n• Đăng ký đấu nối\n• Lắp đồng hồ 2 chiều\n• Ký hợp đồng mua bán điện với EVN\n• Hoàn toàn miễn phí',
  },
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Lắp đặt mất bao lâu?',
    answer: 'Thời gian lắp đặt tùy công suất:\n• 5kWp: 1-2 ngày\n• 10kWp: 2-3 ngày\n• 15-20kWp: 3-5 ngày\n• >20kWp: 5-7 ngày\nBao gồm: lắp khung, tấm pin, biến tần, đấu nối, nghiệm thu.',
  },
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Mái nhà nào lắp được?',
    answer: 'Hầu hết các loại mái đều lắp được:\n• Mái tôn (phổ biến nhất)\n• Mái ngói\n• Mái bê tông\n• Mái bằng\n• Mái dốc\nYêu cầu: diện tích 8-10m2/kWp, không bị che bóng, hướng Nam/Tây Nam là tốt nhất.',
  },
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Tấm pin mặt trời bền bao lâu?',
    answer: 'Tấm pin chất lượng cao (Longi, Aiko, Canadian) có:\n• Tuổi thọ: 25-30 năm\n• Bảo hành hiệu suất: 25 năm (vẫn đạt 80-85% sau 25 năm)\n• Suy giảm: 0.5-0.7%/năm\n• Chịu được mưa đá, gió bão, nhiệt độ -40°C đến 85°C',
  },
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Hệ thống có hoạt động khi mất điện không?',
    answer: '• On-Grid: KHÔNG hoạt động khi mất điện (an toàn cho kỹ thuật viên sửa chữa)\n• Hybrid: CÓ hoạt động nhờ pin lưu trữ, cung cấp điện cho tải quan trọng\nNếu khu vực hay mất điện, nên chọn hệ Hybrid.',
  },
  {
    category: '🔧 Kỹ thuật & Lắp đặt',
    question: 'Ngày mưa có điện không?',
    answer: 'Có, hệ thống vẫn phát điện trong ngày mưa/am, nhưng sản lượng giảm 50-80% so với ngày nắng. Hệ thống được thiết kế dựa trên sản lượng trung bình cả năm (bao gồm cả ngày mưa) nên vẫn đảm bảo hiệu quả.',
  },

  // Bảo hành & Bảo trì
  {
    category: '🛡️ Bảo hành & Bảo trì',
    question: 'Bảo hành các thiết bị bao lâu?',
    answer: 'Solar Giá Rẻ 24h cung cấp chế độ bảo hành:\n• Tấm pin: 15 năm bảo hành vật liệu, 25 năm bảo hành hiệu suất\n• Biến tần: 5-10 năm (tùy hãng)\n• Pin lưu trữ: 5 năm\n• Khung giàn: 10 năm\n• Thi công: 2 năm\nHỗ trợ kỹ thuật trọn đời.',
  },
  {
    category: '🛡️ Bảo hành & Bảo trì',
    question: 'Bảo trì có tốn kém không?',
    answer: 'Chi phí bảo trì rất thấp:\n• Tự vệ sinh: 0đ (dùng nước sạch, 2-4 lần/năm)\n• Dịch vụ chuyên nghiệp: 500K-1 triệu/năm\n• Kiểm tra kỹ thuật: 1-2 triệu/năm\nKhông có chi phí nhiên liệu hay phụ tùng thay thế định kỳ.',
  },
  {
    category: '🛡️ Bảo hành & Bảo trì',
    question: 'Pin lưu trữ có cần thay không?',
    answer: 'Pin lưu trữ lithium có tuổi thọ 10-15 năm (6000-8000 chu kỳ). Sau thời gian này, dung lượng còn 80%, vẫn dùng được nhưng cần thay mới nếu muốn hiệu suất tối đa. Chi phí thay: 50-100 triệu tùy dung lượng.',
  },

  // Thủ tục & Pháp lý
  {
    category: '📋 Thủ tục & Pháp lý',
    question: 'Cần giấy tờ gì để lắp đặt?',
    answer: 'Hồ sơ cần thiết:\n• Sổ đỏ/sổ hồng (photo công chứng)\n• CMND/CCCD chủ hộ\n• Hóa đơn điện gần nhất\n• Giấy phép xây dựng (nếu có)\nSolar Giá Rẻ 24h hỗ trợ toàn bộ thủ tục pháp lý.',
  },
  {
    category: '📋 Thủ tục & Pháp lý',
    question: 'Bán điện dư cho EVN giá bao nhiêu?',
    answer: 'Theo Quyết định 29/2021/QĐ-TTg:\n• Giá mua điện mặt trời: 1.866 đồng/kWh (chưa VAT)\n• Áp dụng cho hệ On-Grid\n• Hợp đồng mua bán điện 20 năm\n• Thanh toán hàng tháng\nĐây là nguồn thu thụ động hấp dẫn.',
  },
  {
    category: '📋 Thủ tục & Pháp lý',
    question: 'Có được lắp vượt công suất đồng hồ không?',
    answer: 'Có, nhưng cần:\n• Đề xuất tăng công suất với EVN\n• Thay đồng hồ/cáp nếu cần\n• Đóng phí nâng công suất\nSolar Giá Rẻ 24h tư vấn công suất tối ưu dựa trên hóa đơn điện và khả năng của lưới.',
  },

  // Hiệu suất & Tiết kiệm
  {
    category: '⚡ Hiệu suất & Tiết kiệm',
    question: '1kWp tạo ra bao nhiêu điện?',
    answer: 'Tại miền Bắc Việt Nam:\n• 1kWp tạo ra: 1.200-1.400 kWh/năm\n• Trung bình: 3.3-3.8 kWh/ngày\n• Mùa hè: 4-5 kWh/ngày\n• Mùa đông: 2.5-3 kWh/ngày\nMiền Nam/Nam Trung Bộ cao hơn 10-20%.',
  },
  {
    category: '⚡ Hiệu suất & Tiết kiệm',
    question: 'Nên lắp On-Grid hay Hybrid?',
    answer: 'Chọn On-Grid nếu:\n• Chỉ muốn tiết kiệm tiền điện\n• Khu vực ít mất điện\n• Ngân sách hạn chế\n\nChọn Hybrid nếu:\n• Muốn dự phòng khi mất điện\n• Khu vực hay cúp điện\n• Muốn sử dụng điện buổi tối\n• Ngân sách dồi dào',
  },
  {
    category: '⚡ Hiệu suất & Tiết kiệm',
    question: 'Pin lưu trữ có đáng đầu tư?',
    answer: 'Pin lưu trữ đáng đầu tư khi:\n• Khu vực hay mất điện (3-5 lần/tháng)\n• Cần điện cho tải quan trọng (tủ lạnh, máy tính, đèn)\n• Muốn tự chủ năng lượng\n• Có ngân sách dư\nKhông cần thiết nếu: lưới điện ổn định, chỉ muốn tiết kiệm tiền.',
  },

  // Khác
  {
    category: '🌟 Dịch vụ Solar Giá Rẻ 24h',
    question: 'Solar Giá Rẻ 24h có gì khác biệt?',
    answer: 'Solar Giá Rẻ 24h là công ty CP Xây lắp EPC Việt Nam với:\n• Đội ngũ kỹ sư cơ điện chuyên nghiệp\n• Thiết bị Tier 1 chính hãng\n• Bảo hành nhanh 24-48h\n• Hỗ trợ trọn đời\n• Tư vấn trung thực, không over-sell',
  },
  {
    category: '🌟 Dịch vụ Solar Giá Rẻ 24h',
    question: 'Quy trình lắp đặt như thế nào?',
    answer: '6 bước chuẩn EPC:\n1. Khảo sát miễn phí (1-2 ngày)\n2. Thiết kế & báo giá (2-3 ngày)\n3. Ký hợp đồng & đặt cọc\n4. Lắp đặt (1-7 ngày tùy công suất)\n5. Nghiệm thu & bàn giao\n6. Đấu lưới & kích hoạt\nBảo trì định kỳ hàng năm.',
  },
  {
    category: '🌟 Dịch vụ Solar Giá Rẻ 24h',
    question: 'Solar Giá Rẻ 24h bảo hành như thế nào?',
    answer: 'Chế độ bảo hành:\n• Hotline hỗ trợ 24/7\n• Kỹ thuật đến tận nơi trong 24-48h\n• Remote support qua Zalo/phone\n• Bảo trì định kỳ 6 tháng/lần\n• Vệ sinh tấm pin theo yêu cầu\n• Thay thế thiết bị lỗi miễn phí trong BH',
  },
];

const categories = [
  { name: 'Tất cả', icon: <MessageCircle className="w-5 h-5" /> },
  { name: '💰 Chi phí & Thanh toán', icon: <DollarSign className="w-5 h-5" /> },
  { name: '🔧 Kỹ thuật & Lắp đặt', icon: <Wrench className="w-5 h-5" /> },
  { name: '🛡️ Bảo hành & Bảo trì', icon: <Shield className="w-5 h-5" /> },
  { name: '📋 Thủ tục & Pháp lý', icon: <FileText className="w-5 h-5" /> },
  { name: '⚡ Hiệu suất & Tiết kiệm', icon: <Zap className="w-5 h-5" /> },
  { name: '🌟 Dịch vụ Solar Giá Rẻ 24h', icon: <Sun className="w-5 h-5" /> },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = activeCategory === 'Tất cả'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              ❓ Câu Hỏi Thường Gặp
            </h1>
            <p className="text-xl sm:text-2xl text-emerald-100 mb-4">
              Giải đáp mọi thắc mắc về điện mặt trời
            </p>
            <p className="text-lg text-emerald-50">
              30+ câu hỏi • 6 danh mục • Cập nhật 2024
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                <span>{cat.name.replace(/[💰🔧🛡️📋⚡🌟]\s?/, '')}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4 flex-1">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-emerald-600">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    {faq.answer.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không có câu hỏi nào
            </h3>
            <p className="text-gray-600">
              Hãy chọn danh mục khác hoặc liên hệ chúng tôi
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Vẫn còn thắc mắc?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Liên hệ ngay để được tư vấn miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0947776662"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <Phone className="w-6 h-6" />
              <span>0947 776 662</span>
            </a>
            <a
              href="/lien-he"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors border-2 border-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Gửi câu hỏi</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
