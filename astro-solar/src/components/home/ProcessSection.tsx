import { PhoneCall, MapPin, PenTool, FileText, Wrench, BarChart2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const steps: { step: number; icon: LucideIcon; title: string; description: string }[] = [
  {
    step: 1,
    icon: PhoneCall,
    title: 'Tiếp nhận thông tin',
    description: 'Khách hàng liên hệ qua hotline, Zalo hoặc form. Đội tư vấn phản hồi trong vòng 2 giờ.',
  },
  {
    step: 2,
    icon: MapPin,
    title: 'Khảo sát thực tế',
    description: 'Kỹ sư đến tận nơi đo đạc mái nhà, phân tích phụ tải và tư vấn công suất phù hợp.',
  },
  {
    step: 3,
    icon: PenTool,
    title: 'Thiết kế giải pháp',
    description: 'Thiết kế hệ thống theo tiêu chuẩn cơ điện MEP, bao gồm sơ đồ đấu nối và vật tư chi tiết.',
  },
  {
    step: 4,
    icon: FileText,
    title: 'Báo giá',
    description: 'Gửi báo giá minh bạch, chi tiết từng hạng mục. Hỗ trợ tư vấn phương án tài chính nếu cần.',
  },
  {
    step: 5,
    icon: Wrench,
    title: 'Thi công & Nghiệm thu',
    description: 'Thi công đúng tiến độ, đảm bảo chống thấm mái. Nghiệm thu bàn giao và hướng dẫn vận hành.',
  },
  {
    step: 6,
    icon: BarChart2,
    title: 'Bảo trì & Theo dõi sản lượng',
    description: 'Bảo trì định kỳ, theo dõi sản lượng từ xa, xử lý sự cố nhanh trong 24h.',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500 mb-3">
            QUY TRÌNH TRIỂN KHAI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            6 Bước Từ Tư Vấn <span className="text-orange-500">Đến Vận Hành</span>
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Quy trình chuẩn cơ điện, minh bạch từng bước — đảm bảo an toàn và đúng tiến độ.
          </p>
        </div>

        {/* Steps grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-orange-200 transition-all duration-200 motion-reduce:transition-none"
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-orange-500" />
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
