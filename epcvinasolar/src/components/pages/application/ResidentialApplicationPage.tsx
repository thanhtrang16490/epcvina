import { Home, Check, ArrowRight, Zap, Shield, Phone, TrendingUp, Clock, DollarSign, Leaf, Sun, Battery, Wifi } from 'lucide-react';

export default function ResidentialApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#14b8a6]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')] bg-cover bg-center opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Giải Pháp Điện Mặt Trời<br className="hidden sm:block" /> Cho Hộ Gia Đình
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Điện mặt trời áp mái cho hộ gia đình đang trở thành giải pháp tối ưu giúp chủ động nguồn năng lượng và tiết kiệm chi phí lâu dài.
            </p>
            <a
              href="/bao-gia"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-teal-700 font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Phone className="h-5 w-5" />
              Yêu cầu tư vấn giải pháp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Lợi ích cho Hộ gia đình
          </h2>
        </div>
        <div className="space-y-6">
          {[
            {
              title: 'Tiết kiệm chi phí điện năng rõ rệt và ổn định lâu dài',
              description: 'Hệ thống điện mặt trời giúp hộ gia đình giảm trực tiếp sản lượng điện tiêu thụ từ lưới điện quốc gia, từ đó giảm đáng kể hóa đơn tiền điện hàng tháng.',
            },
            {
              title: 'Chủ động nguồn điện – giảm phụ thuộc vào lưới điện',
              description: 'Hệ thống điện mặt trời giúp gia đình tự sản xuất và sử dụng điện tại chỗ, giảm sự phụ thuộc vào nguồn điện truyền thống, đặc biệt trong các khung giờ cao điểm.',
            },
            {
              title: 'Hiệu quả đầu tư cao – dòng tiền tiết kiệm bền vững',
              description: 'Điện mặt trời là một khoản đầu tư dài hạn với hiệu quả sinh lời ổn định. Thời gian hoàn vốn trung bình từ 3–5 năm trong khi tuổi thọ hệ thống lên tới 25–30 năm, mang lại tỷ suất lợi nhuận nội bộ (IRR) dao động từ 15%–25% mỗi năm.',
            },
            {
              title: 'Giải pháp năng lượng xanh – giảm phát thải CO₂',
              description: 'Điện mặt trời là nguồn năng lượng sạch, không phát thải trong quá trình vận hành. Trung bình mỗi 1 kWp công suất có thể giúp giảm khoảng 1–1,2 tấn CO₂ mỗi năm; do đó, một hệ thống 5kWp có thể cắt giảm khoảng 5–6 tấn CO₂/năm, tương đương với việc trồng hàng trăm cây xanh.',
            },
            {
              title: 'Vận hành ổn định – chi phí bảo trì thấp',
              description: 'Việc bảo trì chủ yếu là vệ sinh tấm pin định kỳ, trong khi hiệu suất suy giảm rất thấp, khoảng 0,5% mỗi năm. Các thiết bị chính như tấm pin và inverter đều được bảo hành dài hạn trong 15 năm, đảm bảo độ tin cậy cao và khả năng vận hành bền bỉ trong điều kiện khí hậu tại Việt Nam.',
            },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500">
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

      {/* Financial Efficiency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-8 sm:p-10">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Hiệu quả đầu tư tài chính
            </h2>
            <p className="text-gray-600 text-base">
              Ví dụ điển hình về khả năng sinh lời của hệ thống
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Current Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hiện trạng hộ gia đình</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600">Sử dụng hàng tháng:</span>
                    <span className="font-semibold text-gray-900 ml-2">500 kWh</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600">Chi phí tiền điện:</span>
                    <span className="font-semibold text-gray-900 ml-2">~1.500.000 VNĐ</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Proposed Solution */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Giải pháp đề xuất</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600">Hệ thống:</span>
                    <span className="font-semibold text-gray-900 ml-2">5kWp</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600">Sản lượng dự kiến:</span>
                    <span className="font-semibold text-gray-900 ml-2">~600 kWh/tháng</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 text-center">
              <TrendingUp className="h-8 w-8 text-teal-500 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl font-bold text-teal-600 mb-1">
                ~15 Triệu
              </div>
              <div className="text-xs text-gray-600">Tiết kiệm/Năm</div>
              <div className="text-xs text-gray-500 mt-1">~1.260.000 VNĐ/tháng</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                2 - 4 Năm
              </div>
              <div className="text-xs text-gray-600">Thời gian hoàn vốn</div>
              <div className="text-xs text-gray-500 mt-1">Dự kiến tùy vào nhu cầu</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-lg sm:text-xl font-bold text-green-600 mb-1">
                Gần như = 0
              </div>
              <div className="text-xs text-gray-600">Chi phí điện</div>
              <div className="text-xs text-gray-500 mt-1">Trong suốt vòng đời hệ thống 25 – 30 năm</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <Leaf className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">
                5-6 tấn
              </div>
              <div className="text-xs text-gray-600">Giảm CO₂/năm</div>
              <div className="text-xs text-gray-500 mt-1">Với hệ thống 5kWp</div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            * Số liệu mang tính chất tham khảo dựa trên mức giá điện hiện hành và điều kiện bức xạ trung bình tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Specialized Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Giải pháp chuyên biệt
          </h2>
          <p className="text-gray-600 text-base">
            Lựa chọn mô hình phù hợp nhất với hạ tầng của bạn
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* On-Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Sun className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Sử dụng điện ban ngày (On-grid)
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Tiết kiệm cơ bản, chi phí đầu tư thấp nhất. Thích hợp cho gia đình dùng nhiều điện vào ban ngày.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Chi phí thấp
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Lắp đặt nhanh
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Tư vấn thêm
            </a>
          </div>

          {/* Hybrid */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-teal-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Phổ biến nhất
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500">
                <Battery className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Sử dụng điện cả ngày (Hybrid)
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Kết hợp pin lưu trữ, dự phòng khi mất điện. Tối ưu hóa việc sử dụng điện mặt trời cho cả ban đêm.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Không lo mất điện
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Tự chủ 24/7
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Giải pháp ưu tiên
            </a>
          </div>

          {/* Off-Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
                <Wifi className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Khu vực chưa có lưới (Off-grid)
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Chủ động 100% nguồn điện. Giải pháp lý tưởng cho các vùng sâu vùng xa hoặc biệt thự tách biệt.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Độc lập hoàn toàn
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500" />
                Bền bỉ mọi địa hình
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Tư vấn thêm
            </a>
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
            <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold text-xl mb-4">
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

      {/* Reference Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Gói Giải pháp Tham khảo
          </h2>
          <p className="text-gray-600 text-base">
            Tùy chọn phù hợp với nhu cầu và diện tích mái nhà của bạn.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Small Family */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <span className="text-teal-600 font-bold text-sm">3-5 kWp</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Gói Gia đình Nhỏ</h3>
              <p className="text-gray-600 text-sm mt-2">Phù hợp hộ gia đình dùng điện từ 1-2 triệu/tháng</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                6-10 Tấm pin cao cấp
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Inverter Hòa lưới 1 pha
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Lắp đặt khung giá tiêu chuẩn
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Diện tích mái: 15-25m²
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Yêu cầu báo giá
            </a>
          </div>

          {/* Large Family */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-teal-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Phổ biến nhất
              </span>
            </div>
            <div className="mb-4">
              <span className="text-teal-600 font-bold text-sm">6-10 kWp</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Gói Gia đình Lớn</h3>
              <p className="text-gray-600 text-sm mt-2">Phù hợp hộ gia đình dùng điện từ 3-5 triệu/tháng</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                12-20 Tấm pin hiệu suất cao
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Inverter Hòa lưới 3 pha
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Giám sát từ xa qua App
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Diện tích mái: 30-50m²
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Yêu cầu báo giá
            </a>
          </div>

          {/* Villa/Business */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <span className="text-teal-600 font-bold text-sm">15-20+ kWp</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">Gói Biệt thự / Doanh nghiệp</h3>
              <p className="text-gray-600 text-sm mt-2">Dành cho biệt thự cao cấp hoặc văn phòng</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                30-40+ Tấm pin N-Type hiệu suất cao
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Hệ thống Pin lưu trữ (Hybrid)
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Tư vấn kỹ thuật chuyên sâu
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                Diện tích mái: &gt;80m²
              </li>
            </ul>
            <a
              href="/bao-gia"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Yêu cầu báo giá
            </a>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Dự án tiêu biểu
          </h2>
          <p className="text-gray-600 text-base">
            Niềm tin từ hàng nghìn gia đình Việt
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Gia đình Anh Hùng, TP. HCM',
              title: 'Hệ thống 5kWp - Tiết kiệm 2.5tr/tháng',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            },
            {
              name: 'Chị Lan, Đà Nẵng',
              title: 'Hệ thống 3kWp - Tự chủ 100% điện sinh hoạt',
              image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
            },
            {
              name: 'Biệt thự Vinhome, Hà Nội',
              title: 'Hệ thống 10kWp - Giải pháp năng lượng sang trọng',
              image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            },
          ].map((project, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-teal-600 font-semibold mb-2">
                  {project.name}
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng để bắt đầu hành trình sử dụng Năng lượng Xanh?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Để lại thông tin để được tư vấn miễn phí và nhận báo giá chi tiết trong vòng 24 giờ.
          </p>
          <a
            href="/bao-gia"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-teal-700 font-semibold px-8 py-3.5 rounded-lg cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Phone className="h-5 w-5" />
            Yêu cầu tư vấn giải pháp
          </a>
        </div>
      </section>
    </div>
  );
}
