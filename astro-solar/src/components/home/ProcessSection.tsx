import { Search, PenTool, Wrench, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const steps: { step: number; icon: LucideIcon; title: string; description: string }[] = [
  {
    step: 1,
    icon: Search,
    title: 'Khảo sát miễn phí',
    description: 'Kỹ sư đến tận nơi khảo sát mái nhà và tư vấn công suất phù hợp.',
  },
  {
    step: 2,
    icon: PenTool,
    title: 'Thiết kế hệ thống',
    description: 'Thiết kế hệ thống tối ưu, báo giá chi tiết minh bạch.',
  },
  {
    step: 3,
    icon: Wrench,
    title: 'Lắp đặt chuyên nghiệp',
    description: 'Đội ngũ kỹ thuật thi công nhanh chóng, an toàn trong 1-2 ngày.',
  },
  {
    step: 4,
    icon: CheckCircle,
    title: 'Nghiệm thu & Bảo hành',
    description: 'Nghiệm thu, hướng dẫn sử dụng và bảo hành dài hạn.',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quy trình lắp đặt đơn giản
          </h2>
        </div>

        {/* Steps - vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex-1 flex flex-col items-center text-center">
                {/* Connecting dashed line between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full border-t-2 border-dashed border-emerald-300 z-0" />
                )}

                {/* Connecting vertical dashed line on mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute top-12 left-1/2 -translate-x-1/2 h-[calc(100%-0.5rem)] border-l-2 border-dashed border-emerald-300 z-0" />
                )}

                {/* Step number circle + icon */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold mb-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="mb-3">
                  <Icon className="h-7 w-7 text-amber-400" />
                </div>

                {/* Title & description */}
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
