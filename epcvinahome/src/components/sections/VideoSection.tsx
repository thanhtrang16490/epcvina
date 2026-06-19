import { useState } from 'react';

export default function VideoSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Giới thiệu EPCVINA</h2>
          <p className="text-lg text-gray-600">Xem video giới thiệu năng lực và dự án</p>
        </div>

        {/* Video Container */}
        <a
          href="#"
          className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl block group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <img
            src="/thumb-video.png"
            alt="EPCVINA Video Introduction"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 80vw"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            >
              {/* Pulse Rings */}
              <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
              <div
                className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"
                style={{ animationDelay: '0.5s' }}
              />

              {/* Main Play Button */}
              <div className="relative w-24 h-24 rounded-full bg-red-600 group-hover:bg-red-700 shadow-2xl flex items-center justify-center transition-colors">
                <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Overlay Text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-lg font-semibold mb-1">
              EPCVINA - 15+ năm kinh nghiệm MEP & Solar
            </p>
            <p className="text-gray-300 text-sm">
              500+ dự án đã hoàn thành trên toàn quốc
            </p>
          </div>

          {/* Featured Stats */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-lg font-bold text-red-600">500+</div>
              <div className="text-xs text-gray-600">Projects</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="text-lg font-bold text-orange-600">15+</div>
              <div className="text-xs text-gray-600">Years</div>
            </div>
          </div>
        </a>


        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600 mb-1">100+</div>
            <div className="text-sm text-gray-600">Videos & Tutorials</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">4K</div>
            <div className="text-sm text-gray-600">Quality Production</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
