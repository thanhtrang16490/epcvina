import { motion } from 'motion/react';
import { MapPin, Lightning, ArrowRight } from '@phosphor-icons/react';

const projects = [
  {
    slug: 'chi-ha-ha-dong-15kwp',
    title: 'Hệ Hybrid 15 kWp — Chị Hà Hà Đông',
    location: 'Hà Đông - Hà Nội',
    capacity: '15 kWp + 10 kWh BESS',
    completion: 'T7.2024',
    system_type: 'On Grid / Hybrid',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    tag: 'Hybrid',
    tagColor: 'bg-blue-600',
  },
  {
    slug: 'anh-thanh-hai-duong-15kwp',
    title: 'Hệ Hybrid 15 kWp 3 Pha — Anh Thắng Hải Dương',
    location: 'TP. Hải Dương - Hải Dương',
    capacity: '15 kWp + Battery',
    completion: 'T6.2024',
    system_type: 'Hybrid có lưu trữ',
    image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80',
    tag: 'Hybrid 3P',
    tagColor: 'bg-indigo-600',
  },
  {
    slug: 'chu-thanh-hai-duong-22kwp',
    title: 'Hệ Hybrid 22 kWp Công Suất Lớn — Chú Thanh Hải Dương',
    location: 'TP. Hải Dương - Hải Dương',
    capacity: '22 kWp + 20 kWh BESS',
    completion: 'T6.2024',
    system_type: 'Hybrid có lưu trữ',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    tag: 'Hybrid',
    tagColor: 'bg-blue-600',
  },
  {
    slug: 'anh-trung-bac-tu-liem-15kwp',
    title: 'Hệ On-Grid 15 kWp — Anh Trung Bắc Từ Liêm',
    location: 'Bắc Từ Liêm - Hà Nội',
    capacity: '15 kWp On-Grid',
    completion: '2024',
    system_type: 'Hòa Lưới bám tải',
    image: 'https://images.unsplash.com/photo-1611365813446-82a78c468a1d?w=800&q=80',
    tag: 'On-Grid',
    tagColor: 'bg-[#DC2626]',
  },
];

export default function ProjectsPreviewSection() {
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#DC2626] mb-2">
              CÔNG TRÌNH ĐÃ TRIỂN KHAI
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Dự Án <span className="text-[#DC2626]">Thực Tế</span>
            </h2>
            <p className="mt-2 text-gray-500 text-sm max-w-lg">
              200+ công trình đã hoàn thành trên toàn quốc — từ nhà dân, biệt thự đến nhà xưởng và văn phòng.
            </p>
          </div>
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 text-[#DC2626] hover:text-[#B01A22] font-semibold text-sm transition-colors flex-shrink-0 active:scale-[0.98]"
          >
            Xem tất cả dự án
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {/* Project Image */}
              <a href={`/du-an/${p.slug}`} className="block relative h-48 w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`${p.tagColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full`}>
                    {p.tag}
                  </span>
                </div>

                {/* Completion date badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {p.completion}
                  </span>
                </div>

                {/* Capacity overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1.5">
                    <Lightning className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" weight="fill" />
                    <span className="text-white text-xs font-semibold">{p.capacity}</span>
                  </div>
                </div>
              </a>

              {/* Info card below image */}
              <a href={`/du-an/${p.slug}`} className="block bg-white px-4 py-3 border border-gray-100 rounded-b-2xl -mt-0 hover:bg-gray-50 transition-colors">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-[#DC2626] transition-colors">{p.title}</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" weight="fill" />
                  <span className="text-xs text-gray-500">{p.location}</span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-semibold rounded-full text-sm active:scale-[0.98] transition-all duration-200"
          >
            Xem toàn bộ dự án đã thi công
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
