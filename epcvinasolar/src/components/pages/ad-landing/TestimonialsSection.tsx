import { Star } from 'lucide-react';
import { FEATURED_PROJECTS } from './data';

const testimonials = FEATURED_PROJECTS.filter(p => p.testimonial);

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Khách Hàng Nói Gì Về EPCVINA
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((project, i) => (
            <div key={i} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 relative">
              <div className="absolute top-6 right-6 text-6xl font-serif text-orange-300 opacity-50">"</div>
              
              <div className="relative">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(project.testimonial!.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-lg text-slate-800 italic mb-6 leading-relaxed">
                  {project.testimonial!.quote}
                </p>

                <div className="border-t border-orange-200 pt-4">
                  <p className="font-bold text-slate-900">{project.customer}</p>
                  <p className="text-sm text-slate-600">
                    {project.capacity} • {project.location}
                  </p>
                  <p className="text-sm text-orange-600 font-semibold mt-2">
                    Đánh giá: {project.testimonial!.aspect}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
