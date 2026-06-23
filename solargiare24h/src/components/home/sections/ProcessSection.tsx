import { PhoneCall, MapPin, PenTool, FileText, Wrench, BarChart2 } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import type { LucideIcon } from 'lucide-react';

const steps: { step: number; icon: LucideIcon; title: string; description: string }[] = [
  {
    step: 1,
    icon: PhoneCall,
    title: 'Tiếp nhận thông tin',
    description: 'Khách hàng liên hệ qua hotline, Zalo hoặc form đăng ký trên website. Đội ngũ tư vấn phản hồi trong vòng 2 giờ làm việc, thu thập thông tin về nhu cầu sử dụng điện, hóa đơn điện hàng tháng và diện tích mái khả dụng.',
  },
  {
    step: 2,
    icon: MapPin,
    title: 'Khảo sát thực tế',
    description: 'Kỹ sư có chứng chỉ hành nghề đến tận nơi đo đạc kích thước mái, hướng nắng, phân tích phụ tải điện, kiểm tra kết cấu mái và đường điện hiện tại. Tư vấn trực tiếp công suất phù hợp và loại hệ thống (On-Grid hoặc Hybrid).',
  },
  {
    step: 3,
    icon: PenTool,
    title: 'Thiết kế giải pháp',
    description: 'Đội ngũ kỹ thuật thiết kế hệ thống chuyên nghiệp, bao gồm: bản vẽ bố trí tấm pin, sơ đồ đấu nối điện, tính toán kết cấu khung đỡ, giải pháp chống thấm, tiếp địa và chống sét lan truyền. Gửi khách hàng xem xét và phê duyệt.',
  },
  {
    step: 4,
    icon: FileText,
    title: 'Báo giá',
    description: 'Gửi báo giá chi tiết minh bạch từng hạng mục: thiết bị (tấm pin, inverter, khung đỡ, dây dẫn, tủ điện), nhân công lắp đặt, vật tư phụ và phí vận chuyển. Hỗ trợ tư vấn phương án tài chính, trả góp nếu khách hàng có nhu cầu.',
  },
  {
    step: 5,
    icon: Wrench,
    title: 'Thi công & Nghiệm thu',
    description: 'Đội thi công có kinh nghiệm triển khai đúng tiến độ 3-7 ngày. Đảm bảo vệ sinh công trình, xử lý chống thấm mái 100% trước và sau khi lắp đặt. Nghiệm thu bàn giao, hướng dẫn vận hành hệ thống và cách theo dõi sản lượng qua ứng dụng điện thoại.',
  },
  {
    step: 6,
    icon: BarChart2,
    title: 'Bảo trì & Theo dõi sản lượng',
    description: 'EPCVINA theo dõi sản lượng hệ thống từ xa qua nền tảng giám sát. Bảo trì định kỳ 6 tháng/lần: vệ sinh tấm pin, kiểm tra đấu nối, siết chặt khung đỡ. Xử lý sự cố trong vòng 24h. Hỗ trợ kỹ thuật trọn đời hệ thống.',
  },
];

export default function ProcessSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-3">
            QUY TRÌNH TRIỂN KHAI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            6 Bước Từ Tư Vấn <span className="text-[#DC2626]">Đến Vận Hành</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Quy trình làm việc chuyên nghiệp, minh bạch — từ lần liên hệ đầu tiên đến khi hệ thống vận hành ổn định.
            Mỗi bước đều được thực hiện bởi đội ngũ kỹ thuật có kinh nghiệm, đảm bảo chất lượng và an toàn tuyệt đối.
          </p>
          <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
            Thời gian triển khai trung bình từ 3-7 ngày tùy công suất. Chúng tôi cam kết đúng tiến độ, 
            đảm bảo vệ sinh công trình và xử lý chống thấm mái 100% trước khi bàn giao.
          </p>
        </div>

        {/* Steps grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`group relative bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-200 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#DC2626] text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none">
                  <Icon className="h-5 w-5 text-[#DC2626]" />
                </div>

                <h3 className="font-bold text-gray-900 mb-1.5 text-[15px]">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
