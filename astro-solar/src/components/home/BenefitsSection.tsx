import { Zap, ShieldCheck, Cpu, CloudRain, Wrench, Building2 } from 'lucide-react';
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
  return (
    <section className="py-14 sm:py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 mb-3">
            TẠI SAO CHỌN EPCVINA SOLAR
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Lợi Thế <span className="text-amber-400">EPCVINA Solar</span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Điện mặt trời an toàn từ chuyên gia cơ điện — không chỉ lắp đặt, chúng tôi thiết kế, thi công và bảo trì toàn diện theo tiêu chuẩn kỹ thuật.
          </p>
        </div>

        {/* Benefits grid — 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-200 motion-reduce:transition-none"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1.5 text-[15px]">{benefit.title}</h3>
                    <p className="text-[13px] text-gray-400 leading-relaxed">{benefit.description}</p>
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
