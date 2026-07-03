import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Năm kinh nghiệm' },
  { value: 500, suffix: '+', label: 'Dự án hoàn thành' },
  { value: 200, suffix: '+', label: 'MWp đã lắp đặt' },
  { value: 50, suffix: '+', label: 'Khách hàng FDI' },
];

function CounterStat({ stat, index }: { stat: Stat; index: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          if (reduce) {
            count.set(stat.value);
          } else {
            const controls = animate(count, stat.value, {
              duration: 2,
              ease: [0.25, 0.1, 0.25, 1],
              delay: index * 0.15,
            });
            return () => controls.stop();
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated, reduce]);

  return (
    <div ref={ref} className="text-center group">
      <motion.div className="text-5xl lg:text-6xl font-bold text-white mb-2 tabular-nums">
        <motion.span>{rounded}</motion.span>
        {stat.suffix}
      </motion.div>
      <div className="text-red-100 text-base font-medium">{stat.label}</div>
    </div>
  );
}

export default function AnimatedStatsCounter() {
  return (
    <section className="py-16 lg:py-20 bg-red-600 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <CounterStat key={index} stat={stat} index={index} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all hover:-translate-y-[1px] active:translate-y-[1px]"
          >
            Xem dự án tiêu biểu
          </a>
        </div>
      </div>
    </section>
  );
}
