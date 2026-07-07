import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Lightning, Shield, Factory, ClipboardText } from '@phosphor-icons/react';
import { useCountUp } from '../../../hooks/useScrollAnimation';

const RED = '#DC2626';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  // Parallax scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion || isMobile) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Stats counter animation
  const count10 = useCountUp(10, 800, statsVisible);
  const count200 = useCountUp(200, 800, statsVisible);
  const count5 = useCountUp(5, 800, statsVisible);
  const count25 = useCountUp(25, 800, statsVisible);

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      {/* Background Image - Responsive with WebP */}
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
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Main content — vertically centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">

          {/* Tagline pill */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
              Hybrid &middot; BESS &middot; EV Charger
            </span>
          </motion.div>

          {/* Brand logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/logo-epcvina-solar-white.png"
              alt="EPCVINA Solar - Chuyên lắp đặt điện mặt trời Hybrid & On-Grid"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto mx-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* H1 - Main heading for SEO */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 max-w-4xl leading-tight tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Lắp Đặt Điện Mặt Trời Trọn Gói Tại Hà Nội
            <br className="hidden sm:block" />
            <span className="text-amber-400">Tiết Kiệm 70–90% Hóa Đơn Điện</span>
          </motion.h1>

          {/* Primary descriptor */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 mb-3 max-w-2xl leading-snug"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Điện mặt trời Hybrid & lưu trữ năng lượng
            <br className="hidden sm:block" />
            cho gia đình, biệt thự và doanh nghiệp
          </motion.p>

          {/* Short description */}
          <motion.p
            className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Từ nền tảng cơ điện EPCVINA, chúng tôi thiết kế, thi công và bảo trì hệ thống điện
            mặt trời mái nhà, pin lưu trữ BESS và sạc xe điện theo tiêu chuẩn an toàn, bền vững.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/60 text-white font-semibold text-sm hover:bg-white/10 hover:border-white active:scale-[0.98] transition-all duration-200"
            >
              <Lightning className="w-4 h-4" weight="bold" />
              Tính chi phí & sản lượng
            </a>
          </motion.div>

          {/* Slogan */}
          <p className="mt-6 text-xs text-white tracking-widest uppercase">
            Điện mặt trời an toàn từ chuyên gia cơ điện
          </p>
        </div>

        {/* Stats bar — pinned at bottom */}
        <motion.div
          className="flex-shrink-0 px-3 sm:px-6 pb-4 md:pb-5"
          onViewportEnter={() => setStatsVisible(true)}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div
            className="max-w-5xl mx-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[
                { icon: <Sun className="w-7 h-7 md:w-9 md:h-9 text-[#DC2626]" weight="duotone" />, value: `${count10}+`, label: 'Năm kinh nghiệm' },
                { icon: <Lightning className="w-7 h-7 md:w-9 md:h-9 text-[#DC2626]" weight="duotone" />, value: `${count200}+`, label: 'Công trình đã thi công' },
                { icon: <Factory className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" weight="duotone" />, value: `${count5} MWp+`, label: 'Công suất lắp đặt' },
                { icon: <Shield className="w-7 h-7 md:w-9 md:h-9 text-[#1a365d]" weight="duotone" />, value: `${count25} năm`, label: 'Bảo hành tấm pin' },
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
        </motion.div>
      </div>
    </section>
  );
}
