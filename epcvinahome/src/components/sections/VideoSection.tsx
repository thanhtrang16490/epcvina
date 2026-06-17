import { useState } from 'react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Giới thiệu EPCVINA</h2>
          <p className="text-lg text-gray-600">Xem video giới thiệu năng lực và dự án</p>
        </div>

        {/* Video Container */}
        <div
          className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => !isPlaying && setIsPlaying(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
            alt="EPCVINA Project"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative transition-all duration-300 ${
                isHovered && !isPlaying ? 'scale-110' : 'scale-100'
              }`}
            >
              {/* Pulse Rings */}
              {!isPlaying && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
                  <div
                    className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"
                    style={{ animationDelay: '0.5s' }}
                  />
                </>
              )}

              {/* Main Play Button */}
              <div
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlaying
                    ? 'bg-white/20 scale-95'
                    : 'bg-red-600 hover:bg-red-700 shadow-2xl'
                }`}
              >
                {isPlaying ? (
                  <div className="text-white text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-sm">Loading...</p>
                  </div>
                ) : (
                  <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
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
        </div>

        {/* Video Modal */}
        {isPlaying && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsPlaying(false)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video bg-gray-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Placeholder */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-20 h-20 mx-auto mb-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <p className="text-xl font-semibold mb-2">Video Player</p>
                  <p className="text-gray-400 text-sm">
                    Embed YouTube/Vimeo video URL here
                  </p>
                  <p className="text-gray-500 text-xs mt-4">
                    Replace this with actual video embed code
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
