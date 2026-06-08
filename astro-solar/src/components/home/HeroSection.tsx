import { Zap, Shield, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Giải pháp điện mặt trời Hybrid cho gia đình</span>
            </div>

            <a href="/" className="inline-block mb-2 cursor-pointer">
              <img src="/logo-epc-solar.png" alt="EPC Solar" className="h-10 sm:h-12 w-auto" />
            </a>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Tiết kiệm điện với{' '}
              <span className="text-amber-400">EPC Solar</span>
              {' '}Hybrid
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-lg leading-relaxed">
              Giải pháp điện mặt trời Hybrid cho gia đình - Không lo mất điện, tiết kiệm đến 90%.
              Hoàn vốn chỉ từ 3-4 năm.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-white/10">
                <Shield className="h-4 w-4 text-amber-400" />
                <span>Bảo hành 25 năm</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-white/10">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span>Không lo mất điện</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-white/10">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Lắp đặt 1-2 ngày</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href="#combos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-amber-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
              >
                Xem combo Hybrid
              </a>
              <a
                href="tel:0909123456"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-full transition-all backdrop-blur-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
              >
                Nhận báo giá miễn phí
              </a>
            </div>
          </div>

          {/* Right - Video / Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-white/10">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto aspect-video object-cover"
              >
                <source src="/home_image.mp4" type="video/mp4" />
              </video>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tiết kiệm trung bình</p>
                  <p className="text-sm font-bold text-gray-900">2-5 triệu/tháng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
