import { Play } from '@phosphor-icons/react';

export default function VideoSection() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Giới thiệu EPCVINA</h2>
          <p className="text-gray-600">Xem video giới thiệu năng lực và các dự án đã triển khai</p>
        </div>

        {/* Video Container */}
        <a
          href="#"
          className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden block group"
        >
          <img
            src="/thumb-video.png"
            alt="EPCVINA Video Introduction"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 80vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95">
              <Play className="w-8 h-8 text-white ml-1" weight="fill" />
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white font-semibold">EPCVINA - 15+ năm kinh nghiệm MEP & Solar</p>
          </div>
        </a>
      </div>
    </section>
  );
}

