import { Grains, Check, ArrowRight, Lightning, Shield, Phone, TrendUp, Clock, CurrencyDollar, Leaf, Sun, Drop, Factory, Warehouse, Plant } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

export default function AgriculturalApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#065f46] via-[#047857] to-[#059669]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/generated/solar-agriculture-hero.webp')] bg-cover bg-center opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-emerald-300 text-sm sm:text-base font-medium tracking-wide">
                Tương lai năng lượng nông nghiệp
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Giải Pháp Điện Mặt Trời<br className="hidden sm:block" /> Cho Sản Xuất Nông Nghiệp
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Điện năng là yếu tố then chốt trong sản xuất nông nghiệp, phục vụ các hoạt động từ tưới tiêu đến vận hành máy móc. Giải pháp điện mặt trời giúp tận dụng nguồn năng lượng tự nhiên, giảm phụ thuộc điện lưới, tiết kiệm chi phí và nâng cao hiệu quả sản xuất lâu dài.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/calculator"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Phone className="h-5 w-5" />
                Nhận tư vấn ngay
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
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Giá trị thực tế cho nhà nông
          </h2>
          <p className="text-gray-600 text-base">
            Giải pháp điện giúp giảm chi phí, chủ động nguồn năng lượng và nâng cao hiệu quả sản xuất, hướng tới nông nghiệp bền vững và lợi nhuận lâu dài.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: CurrencyDollar,
              title: 'Giảm chi phí vận hành dài hạn',
              description: 'Cắt giảm đáng kể chi phí điện cho hệ thống tưới tiêu, quạt thông gió, chiếu sáng và máy móc sản xuất.',
            },
            {
              icon: Lightning,
              title: 'Chủ động nguồn điện',
              description: 'Hạn chế phụ thuộc vào điện lưới, đặc biệt tại các khu vực vùng sâu, vùng xa, ngoài khơi, biển đảo… hoặc điện không ổn định.',
            },
            {
              icon: TrendUp,
              title: 'Tối ưu diện tích sử dụng',
              description: 'Lắp đặt trên mái chuồng trại, nhà kính, mặt nước nuôi trồng thủy sản hoặc kết hợp mô hình nông nghiệp – điện mặt trời (agrivoltaics).',
            },
            {
              icon: Shield,
              title: 'Gia tăng giá trị thương hiệu',
              description: 'Thể hiện cam kết phát triển bền vững, nâng cao uy tín với đối tác và thị trường xuất khẩu.',
            },
            {
              icon: Leaf,
              title: 'Thân thiện môi trường',
              description: 'Giảm phát thải CO₂, phù hợp với xu hướng nông nghiệp xanh và tiêu chuẩn ESG.',
            },
          ].map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                      <Icon className="h-6 w-6 text-white" />
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
            );
          })}
        </div>
      </section>

      {/* Investment Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-8 sm:p-10">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Đầu tư thông minh
            </h2>
            <p className="text-emerald-700 text-lg font-semibold">
              Tăng trưởng bền vững
            </p>
            <p className="text-gray-600 text-base mt-4">
              Đầu tư điện mặt trời cho nông nghiệp không chỉ là giải pháp kỹ thuật mà còn là bài toán tài chính hiệu quả.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Clock className="h-10 w-10 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold text-emerald-600 mb-2">2-5</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Thời gian hoàn vốn nhanh</div>
              <div className="text-xs text-gray-600">Trung bình từ 2 – 5 năm tùy vị trí địa lý, quy mô và mức tiêu thụ điện.</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Shield className="h-10 w-10 text-blue-500 mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Tuổi thọ hệ thống cao</div>
              <div className="text-xs text-gray-600">Tuổi thọ hệ thống đảm bảo lợi nhuận dài hạn.</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TrendUp className="h-10 w-10 text-purple-500 mb-4" />
              <div className="text-lg font-bold text-purple-600 mb-2">Giảm rủi ro tăng giá điện</div>
              <div className="text-xs text-gray-600">Chủ động chi phí, không bị ảnh hưởng bởi biến động giá điện theo bậc thang.</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <CurrencyDollar className="h-10 w-10 text-amber-500 mb-4" />
              <div className="text-lg font-bold text-amber-600 mb-2">Tăng lợi nhuận sản xuất</div>
              <div className="text-xs text-gray-600">Giảm chi phí đầu vào → tăng biên lợi nhuận cho sản phẩm nông nghiệp.</div>
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white rounded-xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Dẫn chứng cụ thể
            </h3>
            <p className="text-gray-600 mb-6">
              Đối với các mô hình trang trại quy mô lớn, hệ thống điện mặt trời GPG SOLAR giúp:
            </p>
            <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-white font-bold text-2xl">
                  10-50
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Triệu VNĐ</div>
                <div className="text-sm text-gray-600">Tiết kiệm chi phí điện năng mỗi tháng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
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
            <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold text-xl mb-4">
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

      {/* Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Hệ sinh thái nông nghiệp năng lượng sạch
          </h2>
          <p className="text-gray-600 text-base">
            Tích hợp giải pháp năng lượng vào mọi công đoạn sản xuất, từ gieo trồng đến hậu cần.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Greenhouse */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-greenhouse.webp"
                alt="Nhà kính công nghệ cao"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                  <Sun className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Trang trại trồng trọt (nhà kính, nhà lưới)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Với mô hình trồng trọt công nghệ cao, hệ thống điện mặt trời được triển khai trên mái nhà kính hoặc khung giàn chuyên dụng, vừa tạo ra điện năng vừa góp phần điều tiết ánh sáng và nhiệt độ bên trong.
              </p>
            </div>
          </div>

          {/* Livestock */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-livestock.webp"
                alt="Trang trại chăn nuôi"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                  <Factory className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Trang trại chăn nuôi
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Điện năng tạo ra từ hệ thống điện mặt trời phục vụ cho hệ thống quạt thông gió, làm mát, chiếu sáng và vận hành thiết bị chăn nuôi.
              </p>
            </div>
          </div>

          {/* Aquaculture */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-aquaculture.webp"
                alt="Nuôi trồng thủy sản"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                  <Drop className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nuôi trồng thủy sản
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Điện mặt trời có thể triển khai dưới dạng hệ thống nổi trên mặt ao, hồ, biển hoặc lắp đặt tại khu vực đất trống xung quanh.
              </p>
            </div>
          </div>

          {/* Agrivoltaics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-agriculture-hero.webp"
                alt="Mô hình nông nghiệp kết hợp điện mặt trời"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                  <Plant className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mô hình nông nghiệp kết hợp điện mặt trời (Agrivoltaics)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Kết hợp sản xuất nông nghiệp trực tiếp bên dưới các tấm pin, tối ưu hóa 100% hiệu suất sử dụng đất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Dự án tiêu biểu
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Project 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-greenhouse.webp"
                alt="Trang trại rau thủy canh"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Trang Trại Rau Thủy Canh 120kWp
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cung cấp năng lượng cho hệ thống hồi lưu dinh dưỡng và kiểm soát khí hậu tự động hoàn toàn.
              </p>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src="/images/generated/solar-logistics.webp"
                alt="Kho lạnh trái cây"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Kho Lạnh Trái Cây Xuất Khẩu 250kWp
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Giải pháp tích hợp lưu trữ năng lượng giúp duy trì nhiệt độ kho lạnh ổn định 24/7 kể cả khi mất lưới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng đầu tư hiệu quả - Hiện đại hóa mô hình sản xuất nông trại của bạn?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Tối ưu chi phí vận hành – Gia tăng hiệu quả sản xuất – Chủ động nguồn năng lượng cho nông trại của bạn ngay từ hôm nay.
          </p>
          <a
            href="/calculator"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-emerald-700 font-semibold px-8 py-3.5 rounded-lg cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Phone className="h-5 w-5" />
            Yêu Cầu Tư Vấn Giải Pháp
          </a>
        </div>
      </section>
    </div>
  );
}
