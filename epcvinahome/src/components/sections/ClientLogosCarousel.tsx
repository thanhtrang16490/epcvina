import { useState, useEffect, useRef } from 'react';

interface Client {
  name: string;
  industry: string;
  projects: string;
  color: string;
  logo: string;
}

const clients: Client[] = [
  { 
    name: 'Samsung', 
    industry: 'Electronics', 
    projects: '20+ dự án', 
    color: 'red',
    logo: 'https://logo.clearbit.com/samsung.com'
  },
  { 
    name: 'VinFast', 
    industry: 'Automotive', 
    projects: '5 dự án', 
    color: 'orange',
    logo: 'https://logo.clearbit.com/vinfastauto.com'
  },
  { 
    name: 'Lotte', 
    industry: 'Retail', 
    projects: '8 dự án', 
    color: 'purple',
    logo: 'https://logo.clearbit.com/lotte.com'
  },
  { 
    name: 'Vinhomes', 
    industry: 'Real Estate', 
    projects: '12 dự án', 
    color: 'green',
    logo: 'https://logo.clearbit.com/vinhomes.com'
  },
  { 
    name: 'Keangnam', 
    industry: 'Landmark', 
    projects: '3 dự án', 
    color: 'blue',
    logo: 'https://logo.clearbit.com/keangnam.com'
  },
  { 
    name: 'Shilla', 
    industry: 'Hotel', 
    projects: '2 dự án', 
    color: 'yellow',
    logo: 'https://logo.clearbit.com/shilla.net'
  },
];

export default function ClientLogosCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const scroll = () => {
      scrollContainer.scrollLeft += 1;
      
      // Reset scroll for infinite loop
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Duplicate clients for infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Khách hàng tin tưởng</h2>
          <p className="text-gray-600">Đối tác của các doanh nghiệp hàng đầu Việt Nam</p>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="overflow-x-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 animate-scroll" style={{ width: 'max-content' }}>
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="group flex-shrink-0 flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-gray-200 w-64"
              >
                {/* Client Logo */}
                <div className="w-20 h-20 mb-4 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `
                        <div class="text-2xl font-bold text-gray-400">${client.name.charAt(0)}</div>
                      `;
                    }}
                  />
                </div>

                {/* Client Name */}
                <div
                  className={`text-2xl font-bold mb-2 transition-all duration-300 ${
                    client.color === 'red'
                      ? 'text-gray-400 group-hover:text-red-600'
                      : client.color === 'orange'
                      ? 'text-gray-400 group-hover:text-orange-600'
                      : client.color === 'purple'
                      ? 'text-gray-400 group-hover:text-purple-600'
                      : client.color === 'green'
                      ? 'text-gray-400 group-hover:text-green-600'
                      : client.color === 'blue'
                      ? 'text-gray-400 group-hover:text-blue-600'
                      : 'text-gray-400 group-hover:text-yellow-600'
                  }`}
                >
                  {client.name}
                </div>

                {/* Industry */}
                <div className="text-sm text-gray-500 mb-3">{client.industry}</div>

                {/* Project Count Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    client.color === 'red'
                      ? 'bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white'
                      : client.color === 'orange'
                      ? 'bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white'
                      : client.color === 'purple'
                      ? 'bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white'
                      : client.color === 'green'
                      ? 'bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white'
                      : client.color === 'blue'
                      ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                      : 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-600 group-hover:text-white'
                  }`}
                >
                  {client.projects}
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">Khách hàng FDI</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-1">500+</div>
            <div className="text-sm text-gray-600">Dự án hoàn thành</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-sm text-gray-600">Hài lòng</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
            <div className="text-sm text-gray-600">Quốc gia</div>
          </div>
        </div>
      </div>
    </section>
  );
}
