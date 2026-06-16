import { Home, Check, ArrowRight, Zap, Shield, Phone } from 'lucide-react';

export default function ResidentialApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400 to-green-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg mb-6 mx-auto">
              <Home className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Điện Dân Dụng
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              Giải pháp điện mặt trời cho hộ gia đình
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mt-6">
              <Zap className="h-5 w-5 text-green-300" />
              <span className="text-white font-semibold text-lg">3 - 15 kWp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Hệ thống điện mặt trời dân dụng giúp gia đình tiết kiệm chi phí điện, đảm bảo nguồn điện ổn định và thân thiện với môi trường.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lợi ích nổi bật
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              'Tiết kiệm 70-100% hóa đơn điện hàng tháng',
              'Chủ động nguồn điện với pin lưu trữ',
              'Hoàn vốn nhanh trong 4-6 năm',
              'Tăng giá trị bất động sản',
              'Góp phần bảo vệ môi trường',
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
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
            Công suất: 3-15 kWp. Phù hợp mái tôn, mái ngói, mái bằng. Khuyến nghị Hybrid có lưu trữ.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng tiết kiệm điện?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Liên hệ ngay để nhận tư vấn và báo giá miễn phí từ đội ngũ chuyên gia EPC Solar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-green-700 font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 shadow-lg"
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
