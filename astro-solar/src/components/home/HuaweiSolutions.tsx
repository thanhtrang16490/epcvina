import { Shield, Zap, Phone, ArrowRight } from 'lucide-react';

const huaweiProducts = [
  {
    name: 'Hệ Hybrid 10 kWp 3 pha - Huawei',
    inverter: 'SUN2000-10KTL',
    battery: 'LUNA2000 15 kWh',
    warranty: 'Bảo hành 10 năm',
  },
  {
    name: 'Hệ Hybrid 15 kWp 3 pha - Huawei',
    inverter: 'SUN2000-15KTL',
    battery: 'LUNA2000 20 kWh',
    warranty: 'Bảo hành 10 năm',
  },
];

export default function HuaweiSolutions() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gói giải pháp điện mặt trởi mang đẳng cấp Huawei
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Văn phòng Huawei Việt Nam thành lập năm 1998, đến nay đã gần 30 năm. Chính sách Huawei là bảo hành 10 năm, 1 đổi 1 đối với pin lưu trữ và biến tần. Solarmax tin điều đó vì Huawei có bề dày lịch sử và là thương hiệu số 1 toàn cầu.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {huaweiProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Biến tần:</span>
                  <span className="font-medium text-gray-900">{product.inverter}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lưu trữ:</span>
                  <span className="font-medium text-gray-900">{product.battery}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-600">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">{product.warranty}</span>
                </div>
              </div>

              <a
                href="tel:0988446113"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
                Liên hệ tư vấn
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/equipment/inverter"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            Tìm hiểu thêm về giải pháp Huawei
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
