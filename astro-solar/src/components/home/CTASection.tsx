import { Phone, MessageCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Sẵn sàng tiết kiệm điện với năng lượng mặt trời?
        </h2>
        <p className="text-emerald-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
          Tư vấn miễn phí - Khảo sát tận nơi - Báo giá trong 24h
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:0909123456"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-full transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-lg motion-reduce:transition-none motion-reduce:transform-none"
          >
            <Phone className="h-5 w-5" />
            Gọi ngay: 0909 123 456
          </a>
          <a
            href="https://zalo.me/0909123456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-full transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-lg motion-reduce:transition-none motion-reduce:transform-none"
          >
            <MessageCircle className="h-5 w-5" />
            Chat qua Zalo
          </a>
        </div>
      </div>
    </section>
  );
}
