import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: '500+', label: 'Hệ thống đã lắp đặt' },
  { value: '98%', label: 'Khách hàng hài lòng' },
  { value: '10+', label: 'Năm kinh nghiệm' },
  { value: '25 năm', label: 'Bảo hành tấm pin' },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900 to-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <span
                className={`text-4xl sm:text-5xl font-bold text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {stat.value}
              </span>
              <div className={`text-sm text-gray-300 mt-2 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
