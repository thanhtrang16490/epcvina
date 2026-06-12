import { BatteryCharging, Banknote, TrendingUp, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BatteryCharging,
    title: 'Không lo mất điện',
    description: 'Tự động chuyển sang pin khi mất điện lưới. Gia đình luôn có điện 24/7.',
  },
  {
    icon: Banknote,
    title: 'Tiết kiệm 70-90% hóa đơn',
    description: 'Sử dụng năng lượng mặt trời ban ngày, pin lưu trữ ban đêm.',
  },
  {
    icon: TrendingUp,
    title: 'Hoàn vốn 4-6 năm',
    description: 'Lợi nhuận ổn định trong 25+ năm. Đầu tư sinh lời bền vững.',
  },
  {
    icon: Home,
    title: 'Tăng giá trị nhà',
    description: 'Nâng cấp nhà thông minh, thân thiện môi trường, tăng giá trị bất động sản.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tại sao chọn điện mặt trời Hybrid?
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
