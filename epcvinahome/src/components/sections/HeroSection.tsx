import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'motion/react';
import { FileText, ArrowRight, Lightning, Factory, Sun } from '@phosphor-icons/react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Typing effect with keywords
  const keywords = ['MEP', 'HVAC', 'Solar', 'BESS', 'EV Charger'];
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = keywords[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentWord.substring(0, typedText.length + 1));
        if (typedText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setTypedText(currentWord.substring(0, typedText.length - 1));
        if (typedText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % keywords.length);
        }
      }
    }, isDeleting ? 80 : 120);
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentWordIndex]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center pt-16 overflow-hidden bg-gray-50"
    >
      {/* Subtle background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image.png"
          alt=""
          className="w-full h-full object-cover opacity-[0.06]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: heroY }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text (max 4 text elements) */}
          <div className="space-y-6">
            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight leading-none">
              Nhà thầu cơ điện MEP{' '}
              <span className="text-red-600">&</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {typedText}
              </span>
              <span className="animate-pulse text-red-500 ml-0.5">|</span>
            </h1>

            {/* Subtext (max 20 words) */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-[55ch]">
              Giải pháp thiết kế, thi công và bảo trì hệ thống cơ điện cho công trình công nghiệp và thương mại.
            </p>

            {/* CTAs (1 primary + 1 secondary) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/profile"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                <FileText className="w-5 h-5" weight="duotone" />
                <span>Hồ sơ năng lực</span>
              </a>
              <a
                href="https://epcvina.com"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                <Sun className="w-5 h-5" weight="duotone" />
                <span>EPCVINA Solar</span>
              </a>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="/hero-image.png"
                alt="Công trình MEP EPCVINA"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Trust Badges - BELOW hero, not inside */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <div className="flex items-center gap-3">
              <Lightning className="w-8 h-8 text-red-600" weight="duotone" />
              <div>
                <div className="text-lg font-bold text-gray-900">15+ Năm</div>
                <div className="text-xs text-gray-500">Kinh nghiệm</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Factory className="w-8 h-8 text-red-600" weight="duotone" />
              <div>
                <div className="text-lg font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-500">Dự án</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sun className="w-8 h-8 text-red-600" weight="duotone" />
              <div>
                <div className="text-lg font-bold text-gray-900">ISO</div>
                <div className="text-xs text-gray-500">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
