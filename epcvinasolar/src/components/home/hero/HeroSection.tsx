import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ClipboardText } from '@phosphor-icons/react';

const RED = '#DC2626';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion || isMobile) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      data-header-theme="dark"
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      <picture>
        <source media="(max-width: 768px)" srcSet="/hero-bg-768.webp" />
        <source media="(max-width: 1280px)" srcSet="/hero-bg-1280.webp" />
        <source media="(min-width: 1281px)" srcSet="/hero-bg-1920.webp" />
        <img
          src="/hero-bg.webp"
          alt="EPCVINA Solar - Giải pháp điện mặt trời trọn gói"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 lg:py-0">
          <div className="w-full max-w-7xl grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-4 sm:mb-5 lg:self-start"
                initial={false}
                animate={loaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                  Hybrid &middot; BESS &middot; EV Charger
                </span>
              </motion.div>

              <motion.h1
                className="text-[28px] sm:text-3xl md:text-4xl lg:text-[2.95rem] xl:text-[3.25rem] font-extrabold text-white mb-3 sm:mb-4 max-w-2xl leading-[1.06] tracking-tight text-balance lg:self-start"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="block">Điện Mặt Trời Trọn Gói</span>
                <span className="block">Cho Nhà Ở &amp; Doanh Nghiệp</span>
                <span className="block text-amber-400">Tiết Kiệm 70–90% Chi Phí</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-3 max-w-2xl leading-snug text-pretty lg:self-start"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              >
                Giải pháp Hybrid, lưu trữ năng lượng và trạm sạc cho nhà ở, biệt thự, doanh nghiệp.
              </motion.p>

              <motion.p
                className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 mb-5 leading-relaxed lg:self-start"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              >
                EPCVINA thiết kế, thi công và bảo trì trọn gói theo tiêu chuẩn an toàn, bền vững.
              </motion.p>

              <motion.div
                className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-4xl mx-auto lg:mx-0"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  ['Khảo sát 0đ', 'Tư vấn nhanh trong 24h'],
                  ['Thi công chuẩn', 'Đội ngũ kỹ sư EPCVINA'],
                  ['Bảo hành dài hạn', 'Hỗ trợ vận hành trọn vòng đời'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 text-left flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/25">
                      <CheckCircle className="h-4.5 w-4.5 text-amber-300" weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-extrabold text-white leading-tight">{value}</p>
                      <p className="mt-1 text-[11px] sm:text-xs text-white/70 leading-tight">{label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2 sm:gap-3 w-full max-w-2xl lg:mx-0"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href="#tu-van"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-bold text-sm sm:text-[15px] shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
                  style={{ backgroundColor: RED }}
                >
                  <ClipboardText className="w-4 h-4" weight="bold" />
                  Đăng ký khảo sát miễn phí
                </a>
                <a
                  href="/calculator"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/85 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 w-full sm:w-auto py-1.5"
                >
                  Tính chi phí điện
                </a>
              </motion.div>

              <motion.p
                className="mt-4 text-[11px] sm:text-sm text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={false}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                Khảo sát 0đ | Báo giá trong 24h | Hỗ trợ kỹ thuật trọn vòng đời dự án.
              </motion.p>
            </div>

            <motion.div
              className="hidden lg:block relative"
              initial={false}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/8 backdrop-blur-md shadow-2xl shadow-black/30">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-amber-300/10" />
                <div className="relative p-6 xl:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/55">Dự Án Tối Ưu</p>
                      <p className="mt-1 text-2xl font-extrabold text-white">Thiết Kế Theo Nhu Cầu</p>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/25">
                      Đang sẵn sàng tư vấn
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Hệ Thống</p>
                      <p className="mt-2 text-lg font-bold text-white">Hybrid &amp; BESS</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">Tối ưu tự dùng, lưu trữ điện và giảm phụ thuộc lưới.</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Đối Tượng</p>
                      <p className="mt-2 text-lg font-bold text-white">Nhà ở &amp; Doanh nghiệp</p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">Phù hợp biệt thự, nhà xưởng, văn phòng và showroom.</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Quy Trình</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {['Khảo sát', 'Thiết kế', 'Thi công'].map((step) => (
                          <div
                            key={step}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center"
                          >
                            <p className="text-sm font-bold text-white">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
