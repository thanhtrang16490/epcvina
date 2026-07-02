import { Star, MapPin } from '@phosphor-icons/react';
import { FEATURED_PROJECTS, type Project } from './data';

export default function ProjectsSection() {
  return (
    <section id="du-an" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Dự Án Thực Tế Đã Triển Khai
          </h2>
          <p className="text-xl text-slate-600">13+ dự án tại Hà Nội & Hải Dương, hiệu suất thực tế đã kiểm chứng</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {FEATURED_PROJECTS.slice(0, 4).map((project: Project, i: number) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="relative h-64">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.capacity}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>

                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" weight="fill" />
                  <span className="text-sm">{project.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200">
                  <div>
                    <p className="text-sm text-slate-500">Loại hệ thống</p>
                    <p className="font-semibold text-slate-900">{project.system_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Hoàn thành</p>
                    <p className="font-semibold text-slate-900">{project.completion_date}</p>
                  </div>
                </div>

                {project.annual_savings_vnd && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-1">Tiết kiệm hàng năm</p>
                    <p className="text-xl font-bold text-green-600">
                      {(project.annual_savings_vnd / 1000000).toFixed(0)} triệu VNĐ
                    </p>
                  </div>
                )}

                {project.testimonial && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(project.testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400" weight="fill" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 italic mb-2">"{project.testimonial.quote}"</p>
                    <p className="text-xs text-slate-500">- {project.customer}, {project.testimonial.aspect}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/du-an" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-lg transition-all">
            Xem Tất Cả Dự Án →
          </a>
        </div>
      </div>
    </section>
  );
}
