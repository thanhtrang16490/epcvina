import { ArrowRight, Calendar } from 'lucide-react';

const articles = [
  {
    title: 'Không là không (Phần 01)',
    excerpt: 'Tản mạn về hành trình khởi nghiệp và những câu chuyện thú vị trong ngành năng lượng mặt trởi.',
    date: '15/05/2025',
    slug: '#',
  },
  {
    title: 'Không là không (Phần 02)',
    excerpt: 'Tiếp nối hành trình, những bài học kinh nghiệm và câu chuyện truyền cảm hứng từ thực tế triển khai.',
    date: '10/05/2025',
    slug: '#',
  },
];

export default function BlogSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tản mạn SolarMax</h2>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Article cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <a
              key={article.title}
              href={article.slug}
              className="group block bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>{article.date}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-600">
                Đọc thêm
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
