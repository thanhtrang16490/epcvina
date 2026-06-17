import { useState, useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Năm kinh nghiệm', color: 'text-red-600' },
  { value: 500, suffix: '+', label: 'Dự án hoàn thành', color: 'text-orange-600' },
  { value: 200, suffix: '+', label: 'MWp đã lắp đặt', color: 'text-yellow-600' },
  { value: 50, suffix: '+', label: 'Khách hàng FDI', color: 'text-green-600' },
];

export default function AnimatedStatsCounter() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounts(
        stats.map((stat) => Math.floor(stat.value * easeOutQuart))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(stats.map((stat) => stat.value));
      }
    }, interval);
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white relative overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Counter */}
              <div className="relative mb-4">
                <div
                  className={`text-5xl lg:text-6xl font-bold ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  {counts[index]}
                  {stat.suffix}
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Label */}
              <div className="text-red-100 text-lg font-medium">
                {stat.label}
              </div>

              {/* Underline Animation */}
              <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: hasAnimated ? '100%' : '0%',
                    transitionDelay: `${index * 200}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-red-100 text-lg mb-4">
            Tự hào đồng hành cùng doanh nghiệp Việt Nam
          </p>
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition-all hover:shadow-lg"
          >
            Xem dự án tiêu biểu
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
