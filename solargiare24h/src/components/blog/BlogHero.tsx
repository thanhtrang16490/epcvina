import { BookOpen } from 'lucide-react';

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

export default function BlogHero({ title, subtitle }: BlogHeroProps) {
  const displayTitle = title ?? 'Blog Điện Mặt Trời';
  const displaySubtitle = subtitle ?? 'Kiến thức, hướng dẫn và tin tức mới nhất về năng lượng mặt trời';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#7C2D12]">
      {/* Decorative blurred circles */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-5">
          {/* Icon badge */}
          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
            <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {displayTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {displaySubtitle}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-2 mt-1">
            <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-amber-400/60 rounded-full" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-amber-400/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
