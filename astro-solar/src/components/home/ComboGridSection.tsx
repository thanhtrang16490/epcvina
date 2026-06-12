import { Battery, Sun, ArrowRight } from 'lucide-react';
import ComboListingCard, { type ComboCardData } from '../combo/ComboListingCard';

interface ComboGridSectionProps {
  title: string;
  description: string;
  systemType: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  combos: ComboCardData[];
}

export default function ComboGridSection({ title, description, systemType, phase, combos }: ComboGridSectionProps) {
  if (!combos || combos.length === 0) {
    return null;
  }

  const isHybrid = systemType === 'hybrid';
  const basePath = isHybrid ? '/hybrid-bess' : '/on-grid';

  const IconComponent = isHybrid ? Battery : Sun;

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isHybrid ? 'bg-orange-100' : 'bg-orange-100'}`}>
              <IconComponent className={`h-5 w-5 ${isHybrid ? 'text-orange-600' : 'text-orange-600'}`} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl">{description}</p>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {combos.map((combo) => (
            <div key={combo.id} className="group snap-start flex-shrink-0 w-[300px] sm:w-[320px] lg:w-[340px] transition-transform duration-200 hover:scale-[1.02]">
              <ComboListingCard
                combo={combo}
                basePath={basePath}
              />
            </div>
          ))}
        </div>

        {/* Scrollbar hide styles */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* View All Link */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href={basePath}
            className={`inline-flex items-center gap-2 font-medium text-sm cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${isHybrid ? 'text-orange-600 hover:text-orange-700' : 'text-orange-600 hover:text-orange-700'}`}
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
