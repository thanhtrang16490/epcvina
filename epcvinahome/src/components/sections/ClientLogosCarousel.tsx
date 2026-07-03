import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from '@phosphor-icons/react';

interface Client {
  name: string;
  industry: string;
  projects: string;
  logo: string;
}

const clients: Client[] = [
  { name: 'Samsung', industry: 'Electronics', projects: '20+ dự án', logo: 'https://logo.clearbit.com/samsung.com' },
  { name: 'VinFast', industry: 'Automotive', projects: '5 dự án', logo: 'https://logo.clearbit.com/vinfastauto.com' },
  { name: 'Lotte', industry: 'Retail', projects: '8 dự án', logo: 'https://logo.clearbit.com/lotte.com' },
  { name: 'Vinhomes', industry: 'Real Estate', projects: '12 dự án', logo: 'https://logo.clearbit.com/vinhomes.com' },
  { name: 'Keangnam', industry: 'Landmark', projects: '3 dự án', logo: 'https://logo.clearbit.com/keangnam.com' },
  { name: 'Shilla', industry: 'Hotel', projects: '2 dự án', logo: 'https://logo.clearbit.com/shilla.net' },
];

export default function ClientLogosCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;
    const scroll = () => {
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
    };
    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [isPaused]);

  const duplicated = [...clients, ...clients];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Khách hàng tin tưởng</h2>
          <p className="text-gray-600">Đối tác của các doanh nghiệp hàng đầu Việt Nam</p>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {duplicated.map((client, i) => (
              <div
                key={i}
                className="group flex-shrink-0 flex items-center gap-4 p-5 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all w-56"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      if (el.parentElement) {
                        el.parentElement.innerHTML = `<span class="text-lg font-bold text-gray-400">${client.name[0]}</span>`;
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{client.name}</div>
                  <div className="text-xs text-gray-500">{client.projects}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
