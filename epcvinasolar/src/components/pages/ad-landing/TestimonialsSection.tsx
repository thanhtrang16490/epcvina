import { motion } from 'motion/react';
import { Star } from '@phosphor-icons/react';
import { FEATURED_PROJECTS } from './data';

const testimonials = FEATURED_PROJECTS.filter(p => p.testimonial);

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Khách Hàng Nói Về EPCVINA
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((project, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(project.testimonial!.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400" weight="fill" />
                ))}
              </div>

              {/* Quotes */}
              <blockquote className="text-base text-slate-700 leading-relaxed mb-6">
                &ldquo;{project.testimonial!.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="border-t border-slate-100 pt-4">
                <p className="font-bold text-slate-900 text-sm">{project.customer}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {project.capacity} &middot; {project.location}
                </p>
                <p className="text-xs text-orange-600 font-semibold mt-1.5">
                  {project.testimonial!.aspect}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
