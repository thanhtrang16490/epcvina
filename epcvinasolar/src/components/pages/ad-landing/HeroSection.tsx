import { motion } from 'motion/react';
import { Phone, CheckCircle, Calculator } from '@phosphor-icons/react';

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#202124] text-white">
      {/* Background image with subtle overlay */}
      <div className="absolute inset-0 opacity-22">
        <img
          src="/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(245,130,32,.28),transparent_32%),linear-gradient(115deg,rgba(32,33,36,.98)_0%,rgba(32,33,36,.90)_46%,rgba(32,33,36,.64)_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)] gap-5 sm:gap-8 lg:gap-14 items-center">
          {/* Left: Value proposition */}
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[12px] font-bold text-orange-200 backdrop-blur">
              Khảo sát miễn phí tại Hà Nội và miền Bắc
            </div>
            <h1 className="max-w-[760px] text-[34px] sm:text-5xl lg:text-6xl font-black tracking-[-.045em] leading-[1.04]">
              Giảm tiền điện gia đình bằng hệ solar được tính theo hóa đơn thật
            </h1>

            <p className="text-[15px] sm:text-lg text-slate-200 leading-relaxed max-w-[58ch]">
              EPCVINA ước tính công suất, chi phí và thời gian hoàn vốn trước khi kỹ sư kiểm tra mái miễn phí.
            </p>

            <ul className="grid sm:grid-cols-2 gap-2.5 max-w-[720px]">
              {[
                'Ưu tiên phương án Hybrid cho nhà dùng cả ngày và đêm',
                'Tính nhanh theo hóa đơn, mái và thói quen dùng điện',
                'Thi công bởi đội ngũ 15 năm kinh nghiệm',
                'Thiết bị chính hãng, bảo hành rõ điều kiện',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className={`${i > 1 ? 'hidden sm:flex' : 'flex'} items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle className="mt-0.5 w-5 h-5 text-orange-300 flex-shrink-0" weight="fill" />
                  <span className="text-[14px] sm:text-base text-slate-200">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <a
              href="#calculator"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold px-6 py-3 rounded-xl text-[15px] sm:text-base transition-colors shadow-lg shadow-orange-500/20"
            >
              <Calculator className="w-5 h-5" weight="bold" />
              Tính chi phí cho nhà tôi
            </a>
              <a
                href="tel:0988446113"
                onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hotline_click', { event_category: 'conversion' })}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold px-6 py-3 rounded-xl text-[15px] sm:text-base transition-colors"
              >
                <Phone className="w-5 h-5" weight="bold" />
                0988 446 113
              </a>
            </div>
          </motion.div>

          {/* Right: Sample result card */}
          <motion.div
            className="bg-white/[0.09] backdrop-blur-md rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-52px_rgba(0,0,0,.9)]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[12px] sm:text-sm font-black text-orange-200 uppercase tracking-wider mb-3 sm:mb-5">Kết quả mẫu cho hóa đơn 3 triệu/tháng</p>
            <div className="space-y-3 sm:space-y-5">
              <div className="bg-white/[0.05] rounded-xl p-3 sm:p-4">
                <p className="text-xs text-slate-400 mb-1">Tiền điện hiện tại</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-300">3 triệu/tháng</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.05] rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-slate-400 mb-1">Đề xuất</p>
                  <p className="text-base sm:text-lg font-bold">Hybrid 8.8 kWp</p>
                  <p className="text-sm text-orange-200">Pin tùy nhu cầu ban đêm</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-slate-400 mb-1">Tiết kiệm</p>
                  <p className="text-base sm:text-lg font-bold text-emerald-300">2.0-2.5 tr/tháng</p>
                </div>
              </div>
              <div className="bg-white/[0.05] rounded-xl p-3 sm:p-4">
                <p className="text-xs text-slate-400 mb-1">Hoàn vốn</p>
                <p className="text-xl sm:text-2xl font-bold">5.1 năm</p>
              </div>
              <a
                href="#calculator"
                className="block w-full bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-center transition-colors"
              >
                Tự tính theo hóa đơn của tôi
              </a>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Con số là ước tính sơ bộ. EPCVINA chốt phương án sau khi kiểm tra mái, hướng nắng và phụ tải thực tế.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
