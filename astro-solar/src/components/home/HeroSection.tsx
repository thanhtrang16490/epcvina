import { Sun, Zap, Shield, Factory, ClipboardCheck, FileText } from 'lucide-react';

const ORANGE = '#ea580c';

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      {/* ─── Background Image + Overlay ─── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* ── Main content — vertically centered ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">

          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
              Hybrid • BESS • EV Charger
            </span>
          </div>

          {/* Brand name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none mb-4">
            EPCVINA{' '}
            <span style={{ color: ORANGE }}>Solar</span>
          </h1>

          {/* Primary descriptor */}
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 mb-3 max-w-2xl leading-snug">
            Điện mặt trời Hybrid & lưu trữ năng lượng
            <br className="hidden sm:block" />
            cho gia đình, biệt thự và doanh nghiệp
          </p>

          {/* Short description */}
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Từ nền tảng cơ điện EPCVINA, chúng tôi thiết kế, thi công và bảo trì hệ thống điện
            mặt trời mái nhà, pin lưu trữ BESS và sạc xe điện theo tiêu chuẩn an toàn, bền vững.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#tu-van"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200"
              style={{ backgroundColor: ORANGE }}
            >
              <ClipboardCheck className="w-4 h-4" />
              Đăng ký khảo sát miễn phí
            </a>
            <a
              href="#tu-van"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/60 text-white font-semibold text-sm hover:bg-white/10 hover:border-white transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              Nhận báo giá sơ bộ
            </a>
          </div>

          {/* Slogan */}
          <p className="mt-6 text-xs text-white/40 tracking-widest uppercase">
            Điện mặt trời an toàn từ chuyên gia cơ điện
          </p>
        </div>

        {/* ── Stats bar — pinned at bottom ── */}
        <div className="flex-shrink-0 px-3 sm:px-6 pb-4 md:pb-5">
          <div
            className="max-w-5xl mx-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <div className="grid grid-cols-4 divide-x divide-gray-200">
              {[
                { icon: <Sun className="w-7 h-7 md:w-9 md:h-9 text-[#ea580c]" />, value: '10+', label: 'Năm kinh nghiệm' },
                { icon: <Zap className="w-7 h-7 md:w-9 md:h-9 text-[#ea580c]" />, value: '200+', label: 'Công trình đã thi công' },
                { icon: <Factory className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" />, value: '5 MWp+', label: 'Công suất lắp đặt' },
                { icon: <Shield className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" />, value: '25 năm', label: 'Bảo hành tấm pin' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-2 md:px-4"
                >
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div>
                    <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none mb-0.5">{stat.value}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 leading-tight">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
