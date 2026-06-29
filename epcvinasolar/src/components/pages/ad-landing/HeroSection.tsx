import { Phone, CheckCircle, Calculator } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80" alt="Solar panels" className="w-full h-full object-cover" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Điện Mặt Trời Được Thiết Kế
              <span className="block text-yellow-400 mt-2">Theo Chính Ngôi Nhà Của Bạn</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300">Thiết kế dựa trên:</p>

            <div className="space-y-3">
              {['Hóa đơn điện hàng tháng', 'Diện tích mái thực tế', 'Ngân sách đầu tư', 'Nhu cầu dùng điện khi mất điện', 'Kế hoạch sử dụng xe điện'].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#calculator" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                <Calculator className="w-5 h-5" />
                Nhận Thiết Kế Sơ Bộ
              </a>
              <a href="tel:0988446113" onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hotline_click', { event_category: 'conversion' })} className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
                <Phone className="w-5 h-5" />
                Gọi Ngay: 0988 446 113
              </a>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
            <h3 className="text-xl font-bold mb-6 text-center">Kết Quả Mẫu</h3>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-1">Tiền điện</p>
                <p className="text-3xl font-bold text-yellow-400">3 triệu/tháng</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-slate-300 mb-1">Đề xuất</p>
                  <p className="text-xl font-bold">Hybrid 8.8 kWp</p>
                  <p className="text-sm text-green-400">Pin 10 kWh</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-slate-300 mb-1">Tiết kiệm</p>
                  <p className="text-xl font-bold text-green-400">2.5 triệu/tháng</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-1">Hoàn vốn</p>
                <p className="text-3xl font-bold">5.1 năm</p>
              </div>
              <a href="#calculator" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-center transition-all">
                Tính Cho Nhà Bạn →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
