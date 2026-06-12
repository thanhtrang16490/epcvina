import { MapPin, Zap, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'Hệ Hybrid 10 kWp — Biệt thự',
    location: 'Quận 9, TP. HCM',
    capacity: '10 kWp + 10 kWh BESS',
    year: '2024',
    tag: 'Hybrid',
    tagColor: 'bg-blue-600',
    // Placeholder gradient — replace with real project images
    bg: 'from-blue-900 to-blue-700',
  },
  {
    title: 'Hệ On-Grid 15 kWp — Văn phòng',
    location: 'Bình Dương',
    capacity: '15 kWp On-Grid',
    year: '2024',
    tag: 'On-Grid',
    tagColor: 'bg-[#D0202A]',
    bg: 'from-red-900 to-red-700',
  },
  {
    title: 'Hệ Hybrid 24 kWp 3 pha — Nhà xưởng',
    location: 'Long An',
    capacity: '24 kWp + 15.36 kWh BESS',
    year: '2023',
    tag: 'Hybrid 3P',
    tagColor: 'bg-indigo-600',
    bg: 'from-indigo-900 to-indigo-700',
  },
  {
    title: 'Hệ On-Grid 30 kWp — Nhà máy',
    location: 'Đồng Nai',
    capacity: '30 kWp On-Grid 3 pha',
    year: '2023',
    tag: 'Solar C&I',
    tagColor: 'bg-emerald-600',
    bg: 'from-emerald-900 to-emerald-700',
  },
];

export default function ProjectsPreviewSection() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#D0202A] mb-2">
              CÔNG TRÌNH ĐÃ TRIỂN KHAI
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Dự Án <span className="text-[#D0202A]">Thực Tế</span>
            </h2>
            <p className="mt-2 text-gray-500 text-sm max-w-lg">
              200+ công trình đã hoàn thành trên toàn quốc — từ nhà dân, biệt thự đến nhà xưởng và văn phòng.
            </p>
          </div>
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 text-[#D0202A] hover:text-[#B01A22] font-semibold text-sm transition-colors flex-shrink-0"
          >
            Xem tất cả dự án
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image placeholder — replace bg-gradient with actual <img> when photos available */}
              <div className={`bg-gradient-to-br ${p.bg} h-48 w-full flex items-end`}>
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`${p.tagColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                    {p.tag}
                  </span>
                </div>
                {/* Year badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {p.year}
                  </span>
                </div>
                {/* Capacity overlay at bottom of image */}
                <div className="w-full px-4 pb-3 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-white text-xs font-semibold">{p.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Info card below image */}
              <div className="bg-white px-4 py-3 border border-gray-100 rounded-b-2xl -mt-0">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{p.title}</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">{p.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#D0202A] text-[#D0202A] hover:bg-[#D0202A] hover:text-white font-semibold rounded-full text-sm transition-all duration-200"
          >
            Xem toàn bộ dự án đã thi công
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
