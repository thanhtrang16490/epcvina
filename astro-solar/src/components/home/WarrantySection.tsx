import { Shield, ShieldCheck, Battery, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WarrantyItem {
  icon: LucideIcon;
  title: string;
  duration: string;
  detail: string;
}

const warranties: WarrantyItem[] = [
  { icon: ShieldCheck, title: 'Tấm pin mặt trời', duration: '25 năm', detail: 'Hiệu suất đảm bảo trên 80% sau 25 năm' },
  { icon: Shield, title: 'Inverter (Biến tần)', duration: '10 năm', detail: 'Bảo hành chính hãng, thay mới nếu lỗi' },
  { icon: Battery, title: 'Pin lưu trữ Lithium', duration: '10 năm', detail: 'Dung lượng đảm bảo trên 70% sau 10 năm' },
  { icon: Wrench, title: 'Thi công lắp đặt', duration: '5 năm', detail: 'Bảo hành toàn bộ hệ thống điện, khung giá đỡ' },
];

export default function WarrantySection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Cam kết bảo hành hàng đầu
          </h2>
          <p className="text-gray-500 mt-2">
            An tâm sử dụng với chính sách bảo hành toàn diện
          </p>
        </div>

        {/* Warranty grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {warranties.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 mb-4">
                  <Icon className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-3xl font-bold text-orange-600 mb-2">{item.duration}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
