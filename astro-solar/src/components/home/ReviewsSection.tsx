import { Quote, Star } from 'lucide-react';

const reviews = [
  { name: 'Anh Minh', location: 'Quận 7, TP.HCM', quote: 'Lắp hệ 10kWp được 6 tháng, tiền điện giảm từ 3 triệu còn 200k/tháng. Rất hài lòng với dịch vụ!', rating: 5 },
  { name: 'Chị Hương', location: 'Bình Dương', quote: 'Nhà hay bị cúp điện, từ khi lắp Hybrid có pin lưu trữ không còn lo mất điện nữa.', rating: 5 },
  { name: 'Anh Tuấn', location: 'Đồng Nai', quote: 'Đội ngũ tư vấn nhiệt tình, lắp đặt nhanh trong 1 ngày. Hệ thống chạy ổn định.', rating: 5 },
  { name: 'Chị Mai', location: 'Quận 2, TP.HCM', quote: 'Đầu tư 150 triệu, mỗi tháng tiết kiệm 2.5 triệu tiền điện. Hoàn vốn nhanh hơn dự kiến!', rating: 5 },
  { name: 'Anh Phong', location: 'Long An', quote: 'Bảo hành tốt, có vấn đề gì gọi là có người đến kiểm tra ngay. Yên tâm sử dụng.', rating: 5 },
];

export default function ReviewsSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <p className="text-gray-500 mt-2">
            Hơn 500+ khách hàng đã tin tưởng lắp đặt
          </p>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-5 pb-4 touch-pan-x">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="w-[320px] flex-shrink-0 snap-start bg-white shadow-md rounded-xl p-6 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none"
            >
              {/* Quotation mark */}
              <Quote className="h-8 w-8 text-emerald-200 mb-3 flex-shrink-0" />

              {/* Quote text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-4">
                {review.quote}
              </p>

              {/* Star rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Name & location */}
              <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
              <p className="text-gray-400 text-xs">{review.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
