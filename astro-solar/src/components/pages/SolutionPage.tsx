import { Home, Building2, Factory, Check, ArrowRight, Zap, AlertTriangle, Wrench, Phone } from 'lucide-react';

type RoofType = 'mai-ton' | 'mai-ngoi' | 'mai-bang';

interface SolutionPageProps {
  roofType: RoofType;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  Factory,
};

const solutionData: Record<RoofType, {
  title: string;
  subtitle: string;
  icon: string;
  method: string;
  advantages: string[];
  suitableSystems: string;
  considerations: string;
}> = {
  'mai-ton': {
    title: 'Lắp điện mặt trời trên Mái tôn',
    subtitle: 'Giải pháp phổ biến nhất cho nhà xưởng và nhà ở',
    icon: 'Factory',
    method: 'Sử dụng hệ thống ray (rail) kẹp trực tiếp lên mái tôn, không cần khoan lỗ mái. Tấm pin được gắn chắc chắn bằng kẹp chuyên dụng.',
    advantages: [
      'Lắp đặt nhanh chóng (1-2 ngày cho hộ gia đình)',
      'Không khoan lỗ mái, không gây dột',
      'Chi phí khung giá đỡ thấp nhất',
      'Phù hợp hầu hết mái tôn (sóng vuông, sóng tròn, standing seam)',
      'Tản nhiệt tốt nhờ khoảng cách giữa pin và mái',
      'Dễ bảo trì và vệ sinh',
    ],
    suitableSystems: 'Phù hợp mọi công suất từ 5 kWp (hộ gia đình) đến 1 MWp+ (nhà xưởng công nghiệp)',
    considerations: 'Cần kiểm tra khả năng chịu tải của mái. Mái cũ hoặc yếu cần gia cố trước khi lắp đặt.',
  },
  'mai-ngoi': {
    title: 'Lắp điện mặt trời trên Mái ngói',
    subtitle: 'Giải pháp thẩm mỹ cho nhà phố và biệt thự',
    icon: 'Home',
    method: 'Sử dụng móc ngói (tile hooks) chuyên dụng luồn dưới viên ngói, kết nối với ray nhôm. Tấm pin gắn lên ray, giữ nguyên lớp ngói bên dưới.',
    advantages: [
      'Giữ nguyên thẩm mỹ mái nhà',
      'Không ảnh hưởng đến chống thấm',
      'Phù hợp mọi loại ngói (ngói sóng, ngói phẳng, ngói xi măng)',
      'Kết cấu chắc chắn, chịu được gió bão',
      'Lắp đặt không cần tháo ngói toàn bộ',
      'Tăng giá trị bất động sản',
    ],
    suitableSystems: 'Phù hợp hệ thống 5-20 kWp cho nhà phố, biệt thự. Hybrid được khuyến nghị.',
    considerations: 'Cần thợ có kinh nghiệm để không làm vỡ ngói. Góc nghiêng mái ảnh hưởng đến hiệu suất phát điện.',
  },
  'mai-bang': {
    title: 'Lắp điện mặt trời trên Mái bằng',
    subtitle: 'Tối ưu góc nghiêng, hiệu suất cao nhất',
    icon: 'Building2',
    method: 'Sử dụng khung giá đỡ tam giác (tilt brackets) đặt trên sàn mái, tạo góc nghiêng tối ưu 10-15 độ hướng Nam. Khung được cố định bằng tải trọng bê tông hoặc bắt vít vào sàn.',
    advantages: [
      'Tự do chọn góc nghiêng tối ưu cho hiệu suất cao nhất',
      'Dễ vệ sinh và bảo trì (tiếp cận dễ dàng)',
      'Phù hợp sân thượng chung cư, khách sạn, trung tâm thương mại',
      'Có thể kết hợp không gian sử dụng bên dưới (che nắng, mái che)',
      'Lắp đặt linh hoạt, mở rộng dễ dàng',
      'Không ảnh hưởng kết cấu mái',
    ],
    suitableSystems: 'Phù hợp 20-500+ kWp. Lý tưởng cho tòa nhà thương mại, khách sạn, chung cư.',
    considerations: 'Cần đảm bảo chống thấm sàn mái. Khung cao hơn có thể bị ảnh hưởng bởi gió. Kiểm tra tải trọng sàn.',
  },
};

export default function SolutionPage({ roofType }: SolutionPageProps) {
  const data = solutionData[roofType];
  if (!data) return null;

  const IconComponent = ICON_MAP[data.icon] || Home;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#7C2D12]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {data.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                {data.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Method */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Phương pháp lắp đặt
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-lg">
                1
              </div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed pt-2">
                {data.method}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Ưu điểm
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.advantages.map((advantage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {advantage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suitable Systems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-300">
              <Zap className="h-5 w-5 text-gray-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hệ thống phù hợp
            </h2>
          </div>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {data.suitableSystems}
          </p>
        </div>
      </section>

      {/* Important Considerations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400">
              <AlertTriangle className="h-5 w-5 text-amber-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900">
              Lưu ý quan trọng
            </h2>
          </div>
          <p className="text-amber-800 text-base sm:text-lg leading-relaxed">
            {data.considerations}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Cần tư vấn giải pháp lắp đặt?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Liên hệ ngay để chuyên gia EPC Solar khảo sát và tư vấn giải pháp tối ưu cho mái nhà bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-orange-700 font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Nhận báo giá miễn phí
            </a>
            <a
              href="/hybrid"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              Xem combo Hybrid
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
