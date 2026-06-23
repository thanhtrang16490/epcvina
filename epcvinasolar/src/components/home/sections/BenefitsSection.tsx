import { Zap, ShieldCheck, Cpu, CloudRain, Wrench, Building2 } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import type { LucideIcon } from 'lucide-react';

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: 'Thiết kế chuẩn cơ điện',
    description: 'Mọi hệ thống đều được thiết kế theo tiêu chuẩn cơ điện MEP bởi kỹ sư có chứng chỉ hành nghề, đảm bảo tính kỹ thuật và pháp lý.',
  },
  {
    icon: ShieldCheck,
    title: 'An toàn điện, chống sét, tiếp địa',
    description: 'Hệ thống tiếp địa, chống sét lan truyền và bảo vệ quá áp được thi công đồng bộ theo tiêu chuẩn IEC — bảo vệ thiết bị và người dùng.',
  },
  {
    icon: Cpu,
    title: 'Kiểm soát tải, inverter, pin lưu trữ',
    description: 'Tích hợp giải pháp quản lý năng lượng thông minh: tự động ưu tiên pin ban đêm, tối ưu nguồn điện mặt trời ban ngày, giảm tối đa tiền điện.',
  },
  {
    icon: CloudRain,
    title: 'Thi công đảm bảo chống thấm mái',
    description: 'Đội ngũ thi công có kinh nghiệm xử lý chống thấm mái trước và sau khi lắp đặt tấm pin, đảm bảo kết cấu mái không bị ảnh hưởng.',
  },
  {
    icon: Wrench,
    title: 'Bảo trì dài hạn',
    description: 'Cam kết bảo trì định kỳ, theo dõi sản lượng từ xa, xử lý sự cố nhanh trong 24h — đồng hành cùng khách hàng trong suốt vòng đời hệ thống.',
  },
  {
    icon: Zap,
    title: 'Nền tảng nhà thầu MEP toàn diện',
    description: 'EPCVINA có nền tảng từ nhà thầu cơ điện MEP, HVAC, PCCC, Electrical, Plumbing — đảm bảo thi công Solar tích hợp hoàn chỉnh trong một dự án.',
  },
];

export default function BenefitsSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-red-600 mb-3">
            TẠI SAO CHỌN EPCVINA SOLAR
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Lợi Thế <span className="text-red-600">EPCVINA Solar</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Khác với các đơn vị lắp đặt thông thường, EPCVINA xuất phát từ nền tảng nhà thầu cơ điện (MEP) với hơn 10 năm kinh nghiệm trong lĩnh vực điện, nước, phòng cháy chữa cháy và điều hòa không khí. 
            Chúng tôi không chỉ lắp đặt điện mặt trời — chúng tôi <strong>thiết kế, tính toán kỹ thuật, thi công an toàn và bảo trì dài hạn</strong> theo tiêu chuẩn cơ điện chuyên nghiệp.
          </p>
          <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
            Mỗi công trình điện mặt trời đều được đội ngũ kỹ sư có chứng chỉ hành nghề khảo sát thực tế, thiết kế bản vẽ kỹ thuật, tính toán kết cấu mái, 
            giải pháp chống thấm, tiếp địa, chống sét và bảo vệ quá áp — đảm bảo hệ thống hoạt động ổn định 25-30 năm.
          </p>
        </div>

        {/* Benefits grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-red-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 before:content-[''] before:absolute before:top-0 before:left-6 before:right-6 before:h-0.5 before:rounded-full before:bg-gradient-to-r before:from-red-400/0 before:via-red-400/60 before:to-red-400/0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}
              >

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none">
                    <Icon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5 text-[15px]">{benefit.title}</h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
