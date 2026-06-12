import {
  Zap,
  Battery,
  Factory,
  Building2,
  Home,
  Car,
  Building,
  Wrench,
  ArrowRight,
  Check,
  Sun,
  Shield,
  Clock,
  TrendingDown,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

interface SolutionCard {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  benefits?: string[];
}

const solutions: SolutionCard[] = [
  {
    title: 'Hệ Thống Hòa Lưới (On-Grid)',
    href: '/on-grid',
    icon: Zap,
    description:
      'Kết nối trực tiếp với lưới điện EVN, tiết kiệm 50-90% chi phí điện. Chi phí đầu tư thấp nhất, tuổi thọ trên 30 năm.',
    benefits: ['Tiết kiệm chi phí', 'Không cần pin lưu trữ', 'EVN mua lại điện dư'],
  },
  {
    title: 'Hybrid & BESS',
    href: '/hybrid',
    icon: Battery,
    description:
      'Kết hợp điện mặt trời + pin lưu trữ + hòa lưới. An ninh năng lượng 24/7, tối ưu ROI với giá điện 3 mức.',
    benefits: ['Dự phòng khi mất điện', 'Tối ưu giờ cao/thấp điểm', 'Tự chủ năng lượng'],
  },
  {
    title: 'Giải Pháp Mái Tôn',
    href: '/solutions/mai-ton',
    icon: Factory,
    description:
      'Phổ biến nhất ở nhà xưởng, dễ lắp đặt, ít cần cải tạo. Thích hợp cho nhà máy, kho bãi.',
  },
  {
    title: 'Giải Pháp Mái Bằng',
    href: '/solutions/mai-bang',
    icon: Building2,
    description:
      'Thích hợp cho tòa nhà hiện đại, văn phòng, trung tâm thương mại. Diện tích lắp lớn.',
  },
  {
    title: 'Giải Pháp Mái Ngói',
    href: '/solutions/mai-ngoi',
    icon: Home,
    description:
      'Lắp đặt trên mái ngói truyền thống, bảo tồn kiến trúc cho khu dân cư, biệt thự.',
  },
  {
    title: 'EV Charger',
    href: '/ev-charger',
    icon: Car,
    description:
      'Trạm sạc xe điện tích hợp năng lượng mặt trời, tiết kiệm 60-80% chi phí sạc.',
  },
  {
    title: 'Solar C&I',
    href: '/solar-ci',
    icon: Building,
    description:
      'Giải pháp quy mô 100kWp - 5MWp cho nhà máy, xưởng sản xuất, trung tâm thương mại.',
  },
  {
    title: 'Bảo Trì O&M',
    href: '/bao-tri',
    icon: Wrench,
    description:
      'Dịch vụ vận hành & bảo trì chuyên nghiệp, giám sát 24/7, đảm bảo hiệu suất tối ưu 30 năm.',
  },
];

const stats = [
  { value: '30+', label: 'Năm tuổi thọ hệ thống', icon: Clock },
  { value: '50-90%', label: 'Tiết kiệm chi phí điện', icon: TrendingDown },
  { value: '4-6', label: 'Năm hoàn vốn', icon: Sun },
  { value: '24/7', label: 'Giám sát & hỗ trợ', icon: Shield },
];

export default function SolutionsLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      <div className="md:pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20 mb-6">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Giải pháp năng lượng xanh</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Các Giải Pháp Năng Lượng Mặt Trời{' '}
              <span className="text-emerald-400">Toàn Diện</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              EPCVINA SOLAR cung cấp các giải pháp điện mặt trời tích hợp cho hộ gia đình, doanh
              nghiệp và công nghiệp. Từ hệ thống hòa lưới, hybrid đến các ứng dụng đặc biệt, chúng
              tôi là đối tác năng lượng xanh tin cậy của bạn.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Danh mục giải pháp
              </h2>
              <p className="text-gray-500 mt-2">
                Chọn giải pháp phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <a
                    key={solution.href}
                    href={solution.href}
                    className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-200 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {solution.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {solution.description}
                    </p>
                    {solution.benefits && solution.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {solution.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 font-medium"
                          >
                            <Check className="h-3 w-3" />
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
                      Tìm hiểu thêm
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label}>
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <StatIcon className="h-5 w-5 text-emerald-300" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Cần tư vấn giải pháp phù hợp?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Liên hệ ngay để chuyên gia EPC Solar khảo sát và tư vấn giải pháp năng lượng mặt trời
              tối ưu cho bạn.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-lg shadow-emerald-500/20"
            >
              Nhận tư vấn miễn phí
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
