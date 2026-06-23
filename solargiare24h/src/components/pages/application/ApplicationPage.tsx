import { Home, Building2, Factory, Hotel, UtensilsCrossed, Check, ArrowRight, Zap, Shield, Phone, Warehouse, Wheat, Plug, TrendingUp, Clock, DollarSign, BarChart3, Leaf } from 'lucide-react';
import HeaderBar from '../../home/layout/HeaderBar';

interface Benefit {
  title: string;
  description: string;
}

interface FinancialMetrics {
  paybackPeriod: string;
  lifespan: string;
  irr: string;
  cashflow: string;
}

interface Solution {
  title: string;
  description: string;
  image: string;
}

interface InstallationStep {
  step: number;
  title: string;
  description: string;
}

interface Project {
  name: string;
  title: string;
  image: string;
  capacity: string;
  annualProduction: string;
  annualSaving: string;
  co2Reduction: string;
}

type ApplicationType = 'nha-o' | 'van-phong' | 'nha-xuong' | 'khach-san' | 'nha-hang' | 'dien-cong-nghiep' | 'dien-dan-dung' | 'dien-nong-nghiep';

interface ApplicationPageProps {
  applicationType: ApplicationType;
}

interface ApplicationData {
  title: string;
  subtitle: string;
  capacity: string;
  benefits: string[] | Benefit[];
  description: string;
  systemInfo: string;
  icon: string;
  financialMetrics?: FinancialMetrics;
  solutions?: Solution[];
  installationProcess?: InstallationStep[];
  projects?: Project[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  Factory,
  Hotel,
  UtensilsCrossed,
  Warehouse,
  Wheat,
  Plug,
};

const applicationData: Record<ApplicationType, ApplicationData> = {
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
    description: 'Solar Giá Rẻ 24h cung cấp giải pháp điện mặt trời công nghiệp với mô hình Zero-CAPEX: Quỹ đầu tư năng lượng mặt trời đầu tư 100% vốn, nhà xưởng mua điện với giá ưu đãi.',
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
  'dien-cong-nghiep': {
    title: 'Giải Pháp Điện Mặt Trời Cho Doanh Nghiệp',
    subtitle: 'Trong bối cảnh chi phí điện ngày càng gia tăng, điện mặt trời giúp doanh nghiệp chủ động nguồn năng lượng, giảm phụ thuộc vào lưới điện và tối ưu chi phí vận hành dài hạn. Đồng thời, đây còn là bước đi chiến lược để xây dựng hình ảnh thương hiệu xanh, đáp ứng các tiêu chuẩn ESG và nâng cao năng lực cạnh tranh trên thị trường quốc tế.',
    capacity: '100 kWp - 10+ MWp',
    benefits: [
      {
        title: 'Giảm chi phí điện năng và tối ưu chi phí vận hành',
        description: 'Hệ thống điện mặt trời áp mái giúp doanh nghiệp giảm từ 30% đến 70% chi phí điện năng tiêu thụ, đặc biệt hiệu quả đối với các mô hình sản xuất hoạt động ban ngày.',
      },
      {
        title: 'Gia tăng hiệu quả đầu tư và tạo dòng tiền dài hạn',
        description: 'Điện mặt trời không chỉ là chi phí đầu tư mà còn là tài sản sinh lời dài hạn. Với tuổi thọ hệ thống từ 25 – 30 năm, doanh nghiệp có thời gian hoàn vốn trung bình từ 3 – 5 năm.',
      },
      {
        title: 'Chủ động nguồn năng lượng – giảm thiểu rủi ro vận hành',
        description: 'Giảm phụ thuộc vào lưới điện Quốc gia. Hạn chế rủi ro gián đoạn sản xuất do mất điện và duy trì hoạt động ổn định cho dây chuyền quan trọng.',
      },
      {
        title: 'Nâng cao hình ảnh thương hiệu và đáp ứng tiêu chuẩn ESG',
        description: 'Giảm đáng kể lượng phát thải khí CO₂, thể hiện rõ cam kết phát triển bền vững và nâng cao điểm đánh giá trong các tiêu chuẩn ESG.',
      },
    ],
    description: 'Giải pháp điện mặt trời công nghiệp dành cho nhà máy, khu công nghiệp với quy mô lớn, giúp giảm chi phí sản xuất và đáp ứng yêu cầu phát triển bền vững.',
    systemInfo: 'Công suất: 100 kWp đến 10+ MWp. Phù hợp mái nhà xưởng, diện tích đất trống. Mô hình On-Grid hoặc Hybrid.',
    icon: 'Warehouse',
    financialMetrics: {
      paybackPeriod: '2 – 5 năm',
      lifespan: '25 – 30 năm',
      irr: '15% - 25%',
      cashflow: 'Dòng tiền ổn định',
    },
    solutions: [
      {
        title: 'Doanh nghiệp sản xuất – Nhà xưởng mái tôn, mái dốc',
        description: 'Tối đa hóa công suất lắp đặt trên diện tích lớn, phù hợp nhu cầu tiêu thụ điện cao ban ngày.',
        image: '/images/products/260605.jpeg',
      },
      {
        title: 'Kho vận – Logistics – Mái bằng, mái rộng',
        description: 'Tối ưu mật độ lắp đặt và khả năng chịu tải.',
        image: '/images/products/260605(1).png',
      },
      {
        title: 'Tòa nhà thương mại – Văn phòng – Trung tâm dịch vụ',
        description: 'Nâng cao hình ảnh "công trình xanh", đạt tiêu chuẩn công trình bền vững.',
        image: '/images/products/260605(2).png',
      },
    ],
    installationProcess: [
      { step: 1, title: 'Tư vấn', description: 'Phân tích nhu cầu và báo giá sơ bộ dựa trên hóa đơn điện.' },
      { step: 2, title: 'Khảo sát', description: 'Đo đạc diện tích mái, hướng nắng và kết cấu hạ tầng.' },
      { step: 3, title: 'Thiết kế', description: 'Lên bản vẽ 3D và phương án kỹ thuật tối ưu hóa hiệu suất.' },
      { step: 4, title: 'Lắp đặt', description: 'Thi công nhanh chóng, an toàn và đảm bảo thẩm mỹ ngôi nhà.' },
      { step: 5, title: 'Vận hành', description: 'Bàn giao hệ thống, hướng dẫn sử dụng và hỗ trợ kỹ thuật.' },
    ],
    projects: [
      {
        name: 'Thép Hòa Phát - Bình Dương',
        title: 'Hệ thống điện mặt trời mái nhà xưởng',
        image: '/images/products/260605(3).png',
        capacity: '500 kWp',
        annualProduction: '720 MWh',
        annualSaving: '~ 1.2 Tỷ VNĐ',
        co2Reduction: '450 Tấn',
      },
      {
        name: 'Logistics Hub - Long An',
        title: 'Giải pháp kho lạnh thông minh',
        image: '/images/products/260605(4).png',
        capacity: '1.2 MWp',
        annualProduction: '1,800 MWh',
        annualSaving: '~ 2.8 Tỷ VNĐ',
        co2Reduction: '1,100 Tấn',
      },
    ],
  },
  'dien-dan-dung': {
    title: 'Điện dân dụng',
    subtitle: 'Giải pháp điện mặt trời cho hộ gia đình',
    capacity: '3 - 15 kWp',
    benefits: [
      'Tiết kiệm 70-100% hóa đơn điện hàng tháng',
      'Chủ động nguồn điện với pin lưu trữ',
      'Hoàn vốn nhanh trong 4-6 năm',
      'Tăng giá trị bất động sản',
      'Góp phần bảo vệ môi trường',
    ],
    description: 'Hệ thống điện mặt trời dân dụng giúp gia đình tiết kiệm chi phí điện, đảm bảo nguồn điện ổn định và thân thiện với môi trường.',
    systemInfo: 'Công suất: 3-15 kWp. Phù hợp mái tôn, mái ngói, mái bằng. Khuyến nghị Hybrid có lưu trữ.',
    icon: 'Home',
  },
  'dien-nong-nghiep': {
    title: 'Điện sản xuất nông nghiệp',
    subtitle: 'Giải pháp điện mặt trời kết hợp nông nghiệp thông minh',
    capacity: '10 - 500 kWp',
    benefits: [
      'Giảm chi phí điện cho tưới tiêu, nhà kính',
      'Tận dụng đất nông nghiệp hiệu quả',
      'Kết hợp sản xuất nông nghiệp và phát điện',
      'Hỗ trợ chính sách phát triển nông nghiệp xanh',
      'Ổn định nguồn điện vùng sâu vùng xa',
    ],
    description: 'Điện mặt trời ứng dụng trong nông nghiệp giúp giảm chi phí sản xuất, cung cấp điện cho hệ thống tưới tiêu, nhà kính và các thiết bị nông nghiệp.',
    systemInfo: 'Công suất: 10-500 kWp. Phù hợp trang trại, nhà kính, vùng nông thôn. Kết hợp điện lưới hoặc độc lập.',
    icon: 'Wheat',
  },
};

export default function ApplicationPage({ applicationType }: ApplicationPageProps) {
  const data = applicationData[applicationType];
  if (!data) return null;

  const IconComponent = ICON_MAP[data.icon] || Home;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lợi ích cho Doanh nghiệp
            </h2>
          </div>
          <div className="grid gap-6 sm:gap-8">
            {data.benefits.map((benefit, idx) => {
              // Handle both string and object benefits
              if (typeof benefit === 'string') {
                return (
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
                );
              }
              // Handle object benefits with title and description
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors duration-200"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
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
              Xem chi tiết miễn phí
            </a>
            <a
              href="/hybrid-bess"
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
