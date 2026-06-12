import { Home, Building2, Factory, Hotel, UtensilsCrossed, Check, ArrowRight, Zap, Shield, Phone } from 'lucide-react';

type ApplicationType = 'nha-o' | 'van-phong' | 'nha-xuong' | 'khach-san' | 'nha-hang';

interface ApplicationPageProps {
  applicationType: ApplicationType;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  Factory,
  Hotel,
  UtensilsCrossed,
};

const applicationData: Record<ApplicationType, {
  title: string;
  subtitle: string;
  capacity: string;
  benefits: string[];
  description: string;
  systemInfo: string;
  icon: string;
}> = {
  'nha-o': {
    title: 'Điện mặt trời cho Nhà ở',
    subtitle: 'Giải pháp tiết kiệm điện và chủ động nguồn năng lượng cho gia đình',
    capacity: '5 - 15 kWp',
    benefits: [
      'Tiết kiệm 70-90% hóa đơn điện hàng tháng',
      'Không lo mất điện với pin lưu trữ Hybrid',
      'Hoàn vốn chỉ sau 4-6 năm',
      'Tăng giá trị bất động sản',
      'Bảo vệ môi trường, giảm phát thải CO2',
    ],
    description: 'Hệ thống điện mặt trời Hybrid cho nhà ở giúp gia đình bạn chủ động nguồn điện, tiết kiệm chi phí và đảm bảo luôn có điện sử dụng ngay cả khi mất điện lưới.',
    systemInfo: 'Công suất phù hợp: 5-15 kWp với pin lưu trữ 5-20 kWh. Phù hợp mái tôn, mái ngói hoặc mái bằng.',
    icon: 'Home',
  },
  'van-phong': {
    title: 'Điện mặt trời cho Văn phòng',
    subtitle: 'Giảm chi phí vận hành, nâng cao hình ảnh doanh nghiệp xanh',
    capacity: '20 - 100 kWp',
    benefits: [
      'Giảm 40-60% chi phí điện vận hành',
      'Đáp ứng tiêu chuẩn ESG và Green Building',
      'Nâng cao hình ảnh thương hiệu xanh',
      'Thu hồi vốn trong 5-7 năm',
      'Bảo hành dài hạn, vận hành ổn định',
    ],
    description: 'Hệ thống điện mặt trời cho văn phòng giúp doanh nghiệp tiết kiệm chi phí điện năng, đồng thời thể hiện cam kết phát triển bền vững.',
    systemInfo: 'Công suất: 20-100 kWp tùy diện tích mái. Thường sử dụng hệ On-Grid hoặc Hybrid tùy nhu cầu dự phòng.',
    icon: 'Building2',
  },
  'nha-xuong': {
    title: 'Điện mặt trời cho Nhà xưởng',
    subtitle: 'Giải pháp Zero-CAPEX với Quỹ đầu tư Năng lượng mặt trời',
    capacity: '100 - 1000+ kWp',
    benefits: [
      'Đầu tư 0 đồng với mô hình PPA/EMC',
      'Giảm chi phí điện ngay từ ngày đầu vận hành',
      'Đáp ứng yêu cầu Net-Zero từ đối tác FDI',
      'Hợp đồng 20 năm, sau đó sở hữu 100% hệ thống',
      'Tích hợp với hệ thống MEP sẵn có',
    ],
    description: 'EPCVINA cung cấp giải pháp điện mặt trời công nghiệp với mô hình Zero-CAPEX: Quỹ đầu tư năng lượng mặt trời đầu tư 100% vốn, nhà xưởng mua điện với giá ưu đãi.',
    systemInfo: 'Công suất: 100 kWp - 1 MWp+. Mô hình PPA/EMC/ESCO. Hợp tác với Quỹ đầu tư Solar Fund.',
    icon: 'Factory',
  },
  'khach-san': {
    title: 'Điện mặt trời cho Khách sạn',
    subtitle: 'Nâng tầm thương hiệu xanh, thu hút khách hàng quốc tế',
    capacity: '50 - 200 kWp',
    benefits: [
      'Giảm 30-50% chi phí điện năng',
      'Đạt chứng nhận Green Hotel / Eco-friendly',
      'Thu hút khách du lịch ý thức môi trường',
      'ROI hấp dẫn trong 5-7 năm',
      'Giảm phụ thuộc vào lưới điện',
    ],
    description: 'Khách sạn là ngành tiêu thụ điện lớn. Hệ thống điện mặt trời giúp giảm chi phí vận hành và nâng cao hình ảnh thương hiệu xanh.',
    systemInfo: 'Công suất: 50-200 kWp. Phù hợp mái bằng (sân thượng) hoặc mái tôn phụ trợ. Hybrid cho dự phòng.',
    icon: 'Hotel',
  },
  'nha-hang': {
    title: 'Điện mặt trời cho Nhà hàng',
    subtitle: 'Tiết kiệm chi phí năng lượng, tối ưu lợi nhuận kinh doanh',
    capacity: '10 - 50 kWp',
    benefits: [
      'Giảm 40-70% hóa đơn điện (điều hòa, bếp, chiếu sáng)',
      'Hoàn vốn nhanh trong 3-5 năm',
      'Hoạt động ổn định với pin lưu trữ khi mất điện',
      'Không gian xanh thu hút thực khách',
      'Bảo hành dài hạn, bảo trì đơn giản',
    ],
    description: 'Nhà hàng sử dụng nhiều điện cho hệ thống điều hòa, bếp và chiếu sáng. Điện mặt trời giúp cắt giảm chi phí đáng kể.',
    systemInfo: 'Công suất: 10-50 kWp. Phù hợp mái tôn hoặc mái bằng. Khuyến nghị Hybrid để dự phòng mất điện.',
    icon: 'UtensilsCrossed',
  },
};

export default function ApplicationPage({ applicationType }: ApplicationPageProps) {
  const data = applicationData[applicationType];
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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="text-white font-semibold text-lg">{data.capacity}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lợi ích nổi bật
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-5">
            {data.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <span className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Info Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-300">
              <Zap className="h-5 w-5 text-gray-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Thông số hệ thống
            </h2>
          </div>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {data.systemInfo}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng tiết kiệm điện?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Liên hệ ngay để nhận tư vấn và báo giá miễn phí từ đội ngũ chuyên gia EPC Solar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/lien-he"
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
