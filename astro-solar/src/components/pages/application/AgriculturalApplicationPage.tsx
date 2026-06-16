import { Wheat, Check, ArrowRight, Zap, Shield, Phone } from 'lucide-react';

export default function AgriculturalApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-yellow-600 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-400 to-yellow-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg mb-6 mx-auto">
              <Wheat className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Điện Sản Xuất Nông Nghiệp
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto">
              Giải pháp điện mặt trời kết hợp nông nghiệp thông minh
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mt-6">
              <Zap className="h-5 w-5 text-amber-300" />
              <span className="text-white font-semibold text-lg">10 - 500 kWp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Điện mặt trời ứng dụng trong nông nghiệp giúp giảm chi phí sản xuất, cung cấp điện cho hệ thống tưới tiêu, nhà kính và các thiết bị nông nghiệp.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lợi ích nổi bật
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              'Giảm chi phí điện cho tưới tiêu, nhà kính',
              'Tận dụng đất nông nghiệp hiệu quả',
              'Kết hợp sản xuất nông nghiệp và phát điện',
              'Hỗ trợ chính sách phát triển nông nghiệp xanh',
              'Ổn định nguồn điện vùng sâu vùng xa',
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
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

      {/* System Info */}
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
            Công suất: 10-500 kWp. Phù hợp trang trại, nhà kính, vùng nông thôn. Kết hợp điện lưới hoặc độc lập.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-amber-600 to-yellow-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng ứng dụng điện mặt trời?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Liên hệ ngay để nhận tư vấn và báo giá miễn phí từ đội ngũ chuyên gia EPC Solar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-amber-700 font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Xem chi tiết miễn phí
            </a>
            <a
              href="/solar-home"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              Xem giải pháp thi công
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
