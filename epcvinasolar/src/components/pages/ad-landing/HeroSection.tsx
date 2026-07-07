import { motion } from 'motion/react';
import { Phone, CheckCircle, Calculator } from '@phosphor-icons/react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background image with subtle overlay */}
      <div className="absolute inset-0 opacity-15">
        <img
          src="/du-an/DU-AN-DAI-SU-QUAN-HAN-QUOC.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Value proposition */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Điện Mặt Trời
              <span className="block text-orange-400 mt-1">Cho Gia Đình Bạn</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-[50ch]">
              Giảm đến 90% tiền điện. Có điện khi mất điện. Bảo hành 10 năm, hỗ trợ kỹ thuật trọn đời.
            </p>

            <ul className="space-y-2.5">
              {[
                'Giảm 50-90% tiền điện hàng tháng',
                'Có điện khi mất điện (Hybrid)',
                'Thi công bởi đội ngũ 15 năm kinh nghiệm',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" weight="fill" />
                  <span className="text-base text-slate-200">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-orange-500/20"
              >
                <Calculator className="w-5 h-5" weight="bold" />
                Thiết kế sơ bộ trong 5 phút
              </a>
              <a
                href="tel:0988446113"
                onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hotline_click', { event_category: 'conversion' })}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors"
              >
                <Phone className="w-5 h-5" weight="bold" />
                0988 446 113
              </a>
            </div>
          </motion.div>

          {/* Right: Sample result card */}
          <motion.div
            className="bg-white/[0.07] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6">Kết quả mẫu</p>
            <div className="space-y-5">
              <div className="bg-white/[0.05] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Tiền điện hiện tại</p>
                <p className="text-2xl font-bold text-amber-300">3 triệu/tháng</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.05] rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">Đề xuất</p>
                  <p className="text-lg font-bold">Hybrid 8.8 kWp</p>
                  <p className="text-sm text-emerald-400">Pin 10 kWh</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">Tiết kiệm</p>
                  <p className="text-lg font-bold text-emerald-400">2.5 tr/tháng</p>
                </div>
              </div>
              <div className="bg-white/[0.05] rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Hoàn vốn</p>
                <p className="text-2xl font-bold">5.1 năm</p>
              </div>
              <a
                href="#calculator"
                className="block w-full bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-center transition-colors"
              >
                Tính cho nhà bạn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
