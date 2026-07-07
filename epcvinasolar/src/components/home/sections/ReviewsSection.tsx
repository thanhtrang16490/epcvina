import { motion } from 'motion/react';
import { Star, ArrowRight } from '@phosphor-icons/react';

const reviews = [
  {
    name: 'Chị Hà',
    location: 'Hà Đông - Hà Nội',
    capacity: '15 kWp Hybrid',
    quote: 'Từ khi lắp điện mặt trời, hóa đơn điện giảm hẳn. Buổi tối có pin lưu trữ nên không lo mất điện. Đội ngũ thi công chuyên nghiệp, nhiệt tình.',
    rating: 5,
    aspect: 'Tiết kiệm chi phí & Dịch vụ tốt',
    completion: 'T7.2024',
  },
  {
    name: 'Anh Thắng',
    location: 'TP. Hải Dương - Hải Dương',
    capacity: '15 kWp Hybrid 3P',
    quote: 'Chất lượng thi công tuyệt vời, sơn tĩnh điện rất đẹp và bền. Hệ thống hoạt động ổn định, tiết kiệm được nhiều điện. Rất hài lòng!',
    rating: 5,
    aspect: 'Chất lượng thi công & Thẩm mỹ',
    completion: 'T6.2024',
  },
  {
    name: 'Chú Thanh',
    location: 'TP. Hải Dương - Hải Dương',
    capacity: '22 kWp Hybrid',
    quote: 'Công trình phức tạp nhưng đội ngũ thi công rất chuyên nghiệp. Lắp trên cao 6m mà vẫn an toàn, nhanh chóng. Giờ không lo mất điện với 20kWh pin lưu trữ!',
    rating: 5,
    aspect: 'Thi công phức tạp & Chuyên nghiệp',
    completion: 'T6.2024',
  },
  {
    name: 'Anh Thắng',
    location: 'Thanh Miện - Hải Dương',
    capacity: '15 kWp On-Grid',
    quote: 'Lắp trên tầng 7 mà thi công nhanh và an toàn. Giờ tiết kiệm được gần 3 triệu tiền điện mỗi tháng. Cảm ơn đội ngũ EPCVINA!',
    rating: 5,
    aspect: 'Thi công an toàn & Tiết kiệm điện',
    completion: '2024',
  },
  {
    name: 'Anh Quỳnh',
    location: 'Châu Thái - Hải Dương',
    capacity: '6.5 kWp Hybrid',
    quote: 'Diện tích mái nhỏ nhưng vẫn lắp được 6.5 kWp. Pin lưu trữ 10kWh dùng thoải mái buổi tối. Anh em thi công nhiệt tình, cẩn thận.',
    rating: 5,
    aspect: 'Tối ưu diện tích & Pin lưu trữ',
    completion: '2024',
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-gray-500 mt-2">
            Hơn 200+ công trình đã tin tưởng lắp đặt
          </p>
          <a
            href="#tu-van"
            className="inline-flex items-center gap-2 mt-4 text-[#DC2626] hover:text-[#B01A22] font-semibold text-sm active:scale-[0.98] transition-colors"
          >
            Trở thành khách hàng tiếp theo
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <p className="sm:hidden text-xs text-gray-400 text-center mb-2 animate-pulse">&larr; Vuốt để xem thêm &rarr;</p>
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10 sm:hidden" aria-hidden="true" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10 sm:hidden" aria-hidden="true" />
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-5 pb-4 touch-pan-x">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name + review.location}
              className="w-[320px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {/* Typographic quotation mark */}
              <span className="text-4xl leading-none text-orange-200 font-serif mb-2 select-none" aria-hidden="true">&ldquo;</span>

              {/* Quotes text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">
                {review.quote}
              </p>

              {/* Star rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-amber-400"
                    weight="fill"
                  />
                ))}
              </div>

              {/* Aspect tag */}
              <div className="mb-3">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {review.aspect}
                </span>
              </div>

              {/* Name & location */}
              <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
              <p className="text-gray-400 text-xs mb-2">{review.location}</p>

              {/* Capacity & completion */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="font-medium">{review.capacity}</span>
                <span>{review.completion}</span>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
