import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardText } from '@phosphor-icons/react';

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
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-5"
            initial={false}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
              Hybrid &middot; BESS &middot; EV Charger
            </span>
          </motion.div>

          <motion.div
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/logo-epcvina-solar-white.png"
              alt="EPCVINA Solar - Chuyên lắp đặt điện mặt trời Hybrid & On-Grid"
              className="w-full max-w-[410px] sm:max-w-[514px] md:max-w-[616px] lg:max-w-[719px] h-auto mx-auto drop-shadow-2xl"
              width="1024"
              height="159"
            />
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 max-w-4xl leading-tight tracking-tight text-balance"
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">Lắp Đặt Điện Mặt Trời Trọn Gói Tại Hà Nội</span>
            <span className="block text-amber-400">Tiết Kiệm 70–90% Hóa Đơn Điện</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 mb-3 max-w-2xl leading-snug text-pretty"
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Điện mặt trời Hybrid & lưu trữ năng lượng
            <br className="hidden sm:block" />
            cho gia đình, biệt thự và doanh nghiệp
          </motion.p>

          <motion.p
            className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed"
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Từ nền tảng cơ điện EPCVINA, chúng tôi thiết kế, thi công và bảo trì hệ thống điện
            mặt trời mái nhà, pin lưu trữ BESS và sạc xe điện theo tiêu chuẩn an toàn, bền vững.
          </motion.p>

          <motion.div
            className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-4xl mx-auto"
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              ['10+', 'Năm kinh nghiệm'],
              ['200+', 'Công trình đã thi công'],
              ['5 MWp+', 'Công suất lắp đặt'],
              ['25 năm', 'Bảo hành tấm pin'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 text-left"
              >
                <p className="text-base sm:text-lg font-extrabold text-white leading-none">{value}</p>
                <p className="mt-1 text-[11px] sm:text-xs text-white/70 leading-tight">{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={false}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#tu-van"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              style={{ backgroundColor: RED }}
            >
              <ClipboardText className="w-4 h-4" weight="bold" />
              Đăng ký khảo sát miễn phí
            </a>
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70"
            >
              Tính chi phí điện
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
