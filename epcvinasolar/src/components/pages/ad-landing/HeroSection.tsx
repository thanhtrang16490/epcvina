import { motion } from 'motion/react';
import { Phone, CheckCircle, Calculator, ShieldCheck, TrendDown, HouseLine } from '@phosphor-icons/react';

const proofPoints = [
  '15 năm kinh nghiệm cơ điện',
  '13+ công trình nhà dân đã triển khai',
  'Khảo sát mái miễn phí trước báo giá',
];

const sampleStats = [
  { label: 'Hóa đơn hiện tại', value: '3 triệu/tháng', tone: 'text-amber-300' },
  { label: 'Hệ đề xuất', value: 'Hybrid 8.8 kWp', tone: 'text-white' },
  { label: 'Tiết kiệm dự kiến', value: '2.0-2.5 tr/tháng', tone: 'text-emerald-300' },
  { label: 'Hoàn vốn tham chiếu', value: '5.1 năm', tone: 'text-white' },
];

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#202124] text-white">
      {/* Background image with subtle overlay */}
      <div className="absolute inset-0 opacity-[0.22]">
        <img
          src="/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          width="1440"
          height="960"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(245,130,32,.34),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(21,128,61,.24),transparent_30%),linear-gradient(115deg,rgba(32,33,36,.98)_0%,rgba(32,33,36,.91)_48%,rgba(32,33,36,.68)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/8 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[minmax(0,1.02fr)_minmax(380px,.98fr)] gap-5 sm:gap-8 lg:gap-14 items-center">
          {/* Left: Value proposition */}
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[12px] font-bold text-orange-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-orange-300" weight="fill" />
              EPCVINA Solar khảo sát 0đ tại Hà Nội và miền Bắc
            </div>
            <h1 className="max-w-[780px] text-[33px] sm:text-5xl lg:text-[64px] font-black tracking-[-.05em] leading-[1.03]">
              Biết nhà mình lắp solar bao nhiêu kWp trước khi gọi thợ khảo sát
            </h1>

            <p className="text-[15px] sm:text-lg text-slate-200 leading-relaxed max-w-[60ch]">
              Nhập hóa đơn điện, diện tích mái và thói quen dùng điện để EPCVINA ước tính cấu hình, chi phí và thời gian hoàn vốn trước khi kỹ sư kiểm tra mái.
            </p>

            <ul className="grid gap-2.5 max-w-[740px] sm:grid-cols-3">
              {proofPoints.map((item, i) => (
                <motion.li
                  key={i}
                  className={`${i > 1 ? 'hidden sm:flex' : 'flex'} items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle className="mt-0.5 w-4 h-4 text-orange-300 flex-shrink-0" weight="fill" />
                  <span className="text-[13px] sm:text-sm text-slate-200">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <a
                href="#calculator"
                onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hero_calculator_click', { event_category: 'conversion' })}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-[15px] font-black text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-400 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#202124] sm:text-base"
              >
                <Calculator className="w-5 h-5" weight="bold" />
                Tính ngay theo hóa đơn
              </a>
              <a
                href="tel:0988446113"
                onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hotline_click', { event_category: 'conversion' })}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-600 px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-emerald-500 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#202124] sm:text-base"
              >
                <Phone className="w-5 h-5" weight="bold" />
                Gọi 0988 446 113
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center sm:max-w-[560px]">
              {[
                { value: '0đ', label: 'khảo sát ban đầu' },
                { value: '10 năm', label: 'bảo hành rõ điều kiện' },
                { value: '24h', label: 'gọi lại tư vấn' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-2.5">
                  <p className="text-[17px] font-black text-white sm:text-xl">{item.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium leading-tight text-slate-300 sm:text-[11px]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Sample result card */}
          <motion.div
            className="relative overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.09] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-52px_rgba(0,0,0,.9)] backdrop-blur-md sm:rounded-[28px] sm:p-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[48px] bg-orange-500/15" aria-hidden="true" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
                <p className="text-[12px] sm:text-sm font-black text-orange-200 uppercase tracking-wider">Kết quả mẫu</p>
                <span className="rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[11px] font-bold text-slate-200">Hóa đơn 3 triệu</span>
              </div>

              <div className="mb-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 sm:mb-4 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                    <HouseLine className="h-5 w-5" weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Phương án tham chiếu cho nhà dùng cả ngày và đêm</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">Hybrid dễ lắp thêm pin lưu trữ sau khi xác định tải ban đêm.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {sampleStats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/[0.055] p-3 sm:p-4">
                    <p className="mb-1 text-[11px] text-slate-400 sm:text-xs">{stat.label}</p>
                    <p className={`text-[16px] font-black leading-tight sm:text-lg ${stat.tone}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <a
                href="#calculator"
                onClick={() => typeof window !== 'undefined' && window.gtag && window.gtag('event', 'hero_sample_calculator_click', { event_category: 'conversion' })}
                className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-center font-black text-white transition-colors hover:bg-orange-400 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#202124] sm:mt-4"
              >
                Tự tính theo hóa đơn của tôi
              </a>
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                <TrendDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" weight="duotone" />
                Con số chỉ là ước tính sơ bộ. EPCVINA chốt phương án sau khi kiểm tra mái, hướng nắng, biểu giá điện và phụ tải thực tế.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
