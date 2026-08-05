import { Warehouse, Check, ArrowRight, Lightning, Shield, Phone, TrendUp, Clock, CurrencyDollar, ChartBar, Leaf } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

export default function IndustrialApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/generated/solar-industrial-hero.webp')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-emerald-400 text-sm sm:text-base font-medium tracking-wide">
                Năng lượng xanh - Tương lai bền vững
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Giải Pháp Điện Mặt Trời<br className="hidden sm:block" /> Cho Doanh Nghiệp
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Trong bối cảnh chi phí điện ngày càng gia tăng, điện mặt trời giúp doanh nghiệp chủ động nguồn năng lượng, giảm phụ thuộc vào lưới điện và tối ưu chi phí vận hành dài hạn. Đồng thời, đây còn là bước đi chiến lược để xây dựng hình ảnh thương hiệu xanh, đáp ứng các tiêu chuẩn ESG và nâng cao năng lực cạnh tranh trên thị trường quốc tế.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#benefits"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Khám phá giải pháp
              </a>
              <a
                href="/bao-gia"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-lg transition-all duration-200"
              >
                Xem báo giá dự kiến
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Lợi ích cho Doanh nghiệp
          </h2>
          <p className="text-gray-600 text-base">
            Chuyển đổi sang năng lượng sạch không chỉ là trách nhiệm môi trường mà còn là chiến lược tài chính thông minh.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
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
              description: 'Đây là yếu tố đặc biệt quan trọng đối với các ngành yêu cầu tính liên tục và ổn định cao như sản xuất, logistics, chế biến. Việc tích hợp hệ thống điện mặt trời (kết hợp pin lưu trữ nếu cần) giúp doanh nghiệp: Giảm phụ thuộc vào lưới điện Quốc gia; Hạn chế rủi ro gián đoạn sản xuất do mất điện và duy trì hoạt động ổn định cho dây chuyền quan trọng.',
            },
            {
              title: 'Nâng cao hình ảnh thương hiệu và đáp ứng tiêu chuẩn ESG',
              description: 'Việc sử dụng năng lượng tái tạo, đặc biệt là điện mặt trời, giúp doanh nghiệp giảm đáng kể lượng phát thải khí CO₂, qua đó thể hiện rõ cam kết phát triển bền vững và nâng cao điểm đánh giá trong các tiêu chuẩn ESG (Environmental – Social – Governance).',
            },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Hiệu quả đầu tư & Tài chính
            </h2>
            <p className="text-gray-600 text-base">
              Đầu tư điện mặt trời không chỉ là giải pháp kỹ thuật mà còn là bài toán tài chính hiệu quả.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                2 – 5 năm
              </div>
              <div className="text-sm text-gray-600">Thời gian hoàn vốn</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                25 – 30 năm
              </div>
              <div className="text-sm text-gray-600">Tuổi thọ hệ thống</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <CurrencyDollar className="h-8 w-8 text-amber-500 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                15% - 25%
              </div>
              <div className="text-sm text-gray-600">Tỷ suất sinh lời (IRR)</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <ChartBar className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <div className="text-lg sm:text-xl font-bold text-purple-600 mb-1">
                Dòng tiền ổn định
              </div>
              <div className="text-sm text-gray-600">Tạo nguồn thu nhập thụ động</div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Chart Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Dự báo lợi nhuận tích lũy
          </h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center">
            <div className="mb-4">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                DỰ KIẾN 30 NĂM
              </span>
            </div>
            <div className="flex items-end justify-center gap-2 h-64 mb-4">
              {[...Array(10)].map((_, i) => {
                const height = 20 + (i * 8);
                return (
                  <div
                    key={i}
                    className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-500"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-4">
              <span>Năm 1</span>
              <span>Năm 30</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Biểu đồ mang tính chất minh họa dựa trên công suất 1MWp tại khu vực miền Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Specialized Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Giải pháp chuyên biệt
          </h2>
          <p className="text-gray-600 text-base">
            Chúng tôi cung cấp giải pháp trọn gói – tối ưu theo từng mô hình doanh nghiệp
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Doanh nghiệp sản xuất – Nhà xưởng mái tôn, mái dốc',
              description: 'Tối đa hóa công suất lắp đặt trên diện tích lớn, phù hợp nhu cầu tiêu thụ điện cao ban ngày.',
              image: '/images/generated/solar-industrial-hero.webp',
            },
            {
              title: 'Kho vận – Logistics – Mái bằng, mái rộng',
              description: 'Tối ưu mật độ lắp đặt và khả năng chịu tải.',
              image: '/images/generated/solar-logistics.webp',
            },
            {
              title: 'Tòa nhà thương mại – Văn phòng – Trung tâm dịch vụ',
              description: 'Nâng cao hình ảnh "công trình xanh", đạt tiêu chuẩn công trình bền vững.',
              image: '/images/generated/solar-commercial.webp',
            },
          ].map((solution, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Quy trình lắp đặt chuẩn hóa
          </h2>
          <p className="text-gray-600 text-base">
            5 bước chuyên nghiệp đưa năng lượng mặt trời tới mái nhà bạn
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: 1, title: 'Tư vấn', description: 'Phân tích nhu cầu và báo giá sơ bộ dựa trên hóa đơn điện.' },
            { step: 2, title: 'Khảo sát', description: 'Đo đạc diện tích mái, hướng nắng và kết cấu hạ tầng.' },
            { step: 3, title: 'Thiết kế', description: 'Lên bản vẽ 3D và phương án kỹ thuật tối ưu hóa hiệu suất.' },
            { step: 4, title: 'Lắp đặt', description: 'Thi công nhanh chóng, an toàn và đảm bảo thẩm mỹ ngôi nhà.' },
            { step: 5, title: 'Vận hành', description: 'Bàn giao hệ thống, hướng dẫn sử dụng và hỗ trợ kỹ thuật.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Dự án tiêu biểu
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: 'Thép Hòa Phát - Bình Dương',
              title: 'Hệ thống điện mặt trời mái nhà xưởng',
              image: '/images/generated/solar-industrial-hero.webp',
              capacity: '500 kWp',
              annualProduction: '720 MWh',
              annualSaving: '~ 1.2 Tỷ VNĐ',
              co2Reduction: '450 Tấn',
            },
            {
              name: 'Logistics Hub - Long An',
              title: 'Giải pháp kho lạnh thông minh',
              image: '/images/generated/solar-logistics.webp',
              capacity: '1.2 MWp',
              annualProduction: '1,800 MWh',
              annualSaving: '~ 2.8 Tỷ VNĐ',
              co2Reduction: '1,100 Tấn',
            },
          ].map((project, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  {project.name}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Công suất</div>
                    <div className="font-semibold text-gray-900">{project.capacity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Sản lượng/Năm</div>
                    <div className="font-semibold text-gray-900">{project.annualProduction}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Tiết kiệm/Năm</div>
                    <div className="font-semibold text-green-600">{project.annualSaving}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Giảm CO2</div>
                    <div className="font-semibold text-green-600 flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      {project.co2Reduction}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng tối ưu hóa năng lượng?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để nhận khảo sát và báo cáo khả thi miễn phí cho doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/bao-gia"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-orange-700 font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Yêu Cầu Tư Vấn Giải Pháp
            </a>
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              Liên hệ ngay
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
