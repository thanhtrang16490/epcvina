import { BookOpen, Sun, BatteryHigh, Lightning, Calculator, Shield, Wrench, CaretRight, Phone, ArrowRight } from '@phosphor-icons/react';

const contentHubs = [
  {
    title: 'So sánh giải pháp',
    desc: 'So sánh On-Grid, Hybrid, BESS, pin lưu trữ và combo theo nhu cầu thực tế.',
    href: '/hybrid-bess',
    tag: 'Compare',
  },
  {
    title: 'Hướng dẫn triển khai',
    desc: 'Quy trình thi công, checklist khảo sát và các bước vận hành sau lắp đặt.',
    href: '/tin-tuc/quy-trinh-lap-dat-solar',
    tag: 'Setup',
  },
  {
    title: 'Thương hiệu & thiết bị',
    desc: 'Tổng hợp inverter, tấm pin, pin lưu trữ và nhãn hàng theo từng nhóm giải pháp.',
    href: '/nhan-hang',
    tag: 'Brands',
  },
  {
    title: 'Tính chi phí nhanh',
    desc: 'Ước tính suất đầu tư, hoàn vốn và phương án phù hợp trước khi tư vấn.',
    href: '/calculator',
    tag: 'Tools',
  },
];

const categories = [
  {
    slug: 'dien-mat-troi-co-ban',
    name: 'Điện Mặt Trời Cơ Bản',
    icon: Sun,
    color: 'bg-amber-100 text-amber-700',
    desc: 'Kiến thức nền tảng về hệ thống điện mặt trời, nguyên lý hoạt động, các loại hệ thống phổ biến.',
    articles: [
      { slug: 'dien-mat-troi-la-gi', title: 'Điện Mặt Trời Là Gì? Nguyên Lý Hoạt Động Chi Tiết' },
      { slug: 'cac-loai-he-thong-solar', title: '3 Loại Hệ Thống Điện Mặt Trời: On-Grid, Hybrid, Off-Grid' },
      { slug: 'so-sanh-on-grid-vs-hybrid', title: 'So Sánh On-Grid vs Hybrid: Nên Chọn Loại Nào?' },
      { slug: 'tam-pin-monocrystal-vs-polycrystal', title: 'Tấm Pin Mono vs Poly: Khác Biệt & Lựa Chọn Tốt Nhất' },
    ],
  },
  {
    slug: 'chi-phi-dau-tu',
    name: 'Chi Phí & Đầu Tư',
    icon: Calculator,
    color: 'bg-blue-100 text-blue-700',
    desc: 'Phân tích chi phí, thời gian hoàn vốn, ROI và các yếu tố ảnh hưởng đến giá hệ thống điện mặt trời.',
    articles: [
      { slug: 'chi-phi-lap-dien-mat-troi-2026', title: 'Chi Phí Lắp Điện Mặt Trời 2026: Bảng Giá Chi Tiết' },
      { slug: 'thoi-gian-hoan-von-solar', title: 'Thời Gian Hoàn Vốn Điện Mặt Trời: Tính Toán Chi Tiết' },
      { slug: 'co-nen-lap-dien-mat-troi', title: 'Có Nên Lắp Điện Mặt Trời Không? Phân Tích Lợi Ích' },
      { slug: 'gia-mua-dien-cua-evn', title: 'Giá Mua Điện EVN 2026: Biểu Giá & Cơ Chế Mới Nhất' },
    ],
  },
  {
    slug: 'pin-luu-tru',
    name: 'Pin Lưu Trữ & BESS',
    icon: BatteryHigh,
    color: 'bg-emerald-100 text-emerald-700',
    desc: 'Tìm hiểu về pin lưu trữ điện, hệ thống BESS, công nghệ Lithium và ứng dụng trong điện mặt trời.',
    articles: [
      { slug: 'pin-luu-tru-la-gi', title: 'Pin Lưu Trữ Điện Là Gì? Có Nên Lắp Đặt Không?' },
      { slug: 'cong-nghe-pin-lithium-vs-lfp', title: 'Pin Lithium-ion vs LFP: So Sánh Công Nghệ & Tuổi Thọ' },
      { slug: 'bess-la-gi', title: 'BESS Là Gì? Hệ Thống Lưu Trữ Năng Lượng Quy Mô Lớn' },
      { slug: 'cach-chon-pin-luu-tru', title: 'Hướng Dẫn Chọn Pin Lưu Trữ Phù Hợp Cho Gia Đình' },
    ],
  },
  {
    slug: 'ky-thuat-lap-dat',
    name: 'Kỹ Thuật & Lắp Đặt',
    icon: Wrench,
    color: 'bg-purple-100 text-purple-700',
    desc: 'Hướng dẫn kỹ thuật, quy trình lắp đặt, vị trí tối ưu và bảo trì hệ thống điện mặt trời.',
    articles: [
      { slug: 'quy-trinh-lap-dat-solar', title: 'Quy Trình Lắp Đặt Điện Mặt Trời: 7 Bước Chi Tiết' },
      { slug: 'huong-mai-nha-tot-nhat', title: 'Hướng Nhà & Góc Nghiêng Tối Ưu Cho Pin Mặt Trời' },
      { slug: 'bao-tri-he-thong-solar', title: 'Bảo Trì Hệ Thống Điện Mặt Trời: Hướng Dẫn Toàn Diện' },
      { slug: 'chong-set-cho-solar', title: 'Chống Sét Cho Hệ Thống Điện Mặt Trời: Tiêu Chuẩn & Giải Pháp' },
    ],
  },
  {
    slug: 'chinh-sach-phap-luat',
    name: 'Chính Sách & Pháp Luật',
    icon: Shield,
    color: 'bg-red-100 text-red-700',
    desc: 'Cập nhật chính sách, quy định pháp luật về điện mặt trời, cơ chế giá, thủ tục đấu nối.',
    articles: [
      { slug: 'chinh-sach-dien-mat-troi-2026', title: 'Chính Sách Điện Mặt Trời 2026: Cập Nhật Mới Nhất' },
      { slug: 'thu-tuc-dau-noi-dien-luc', title: 'Thủ Tục Đấu Nối Điện Lực: Hướng Dẫn Từ A-Z' },
      { slug: 'dpm-cao-cap-la-gi', title: 'Điện Mặt Trời Mái Nhà: Quy Định & Tiêu Chuẩn Kỹ Thuật' },
      { slug: 'co-che-mua-dien-moi', title: 'Cơ Chế Mua Bán Điện Mặt Trời Mới Nhất 2026' },
    ],
  },
  {
    slug: 'ung-dung-thuc-te',
    name: 'Ứng Dụng Thực Tế',
    icon: Lightning,
    color: 'bg-cyan-100 text-cyan-700',
    desc: 'Case study thực tế, kinh nghiệm lắp đặt, câu chuyện khách hàng và xu hướng ứng dụng.',
    articles: [
      { slug: 'lap-solar-cho-nha-pho', title: 'Lắp Điện Mặt Trời Cho Nhà Phố: Giải Pháp Tối Ưu' },
      { slug: 'lap-solar-cho-biet-thu', title: 'Điện Mặt Trời Biệt Thự: Thẩm Mỹ & Hiệu Quả Cao' },
      { slug: 'solar-ket-hop-sac-xe-dien', title: 'Kết Hợp Điện Mặt Trời & Sạc Xe Điện: Xu Hướng 2026' },
      { slug: 'ung-dung-solar-nong-nghiep', title: 'Điện Mặt Trời Nông Nghiệp: Mô Hình Agrisolar' },
    ],
  },
];

export default function KienThucHubPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Thư Viện Kiến Thức</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Kiến Thức Điện Mặt Trời
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Hub nội dung theo mô hình so sánh, hướng dẫn, thương hiệu và công cụ tính chi phí,
            giúp người dùng đi từ tìm hiểu đến chọn giải pháp phù hợp nhanh hơn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#danh-muc" className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all">
              Khám Phá Ngay
            </a>
            <a href="tel:0988446113" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Tư Vấn Miễn Phí
            </a>
          </div>
        </div>
      </section>

      {/* Content hubs */}
      <section className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-blue-700 mb-2">Nội dung chiến lược</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Lộ trình đọc giống hub RMSURV</h2>
            </div>
            <a href="/tin-tuc" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
              Xem toàn bộ bài viết
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {contentHubs.map((hub) => (
              <a
                key={hub.title}
                href={hub.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  {hub.tag}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{hub.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{hub.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Khám phá
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">24+</p>
              <p className="text-sm text-slate-600">Bài viết chuyên sâu</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">6</p>
              <p className="text-sm text-slate-600">Chủ đề chính</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-sm text-slate-600">Khách hàng tin tưởng</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">13+</p>
              <p className="text-sm text-slate-600">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="danh-muc" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Danh Mục Kiến Thức
            </h2>
            <p className="text-xl text-slate-600">
              Chọn chủ đề bạn quan tâm để đi thẳng vào nội dung phù hợp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.slug} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{cat.desc}</p>
                <div className="space-y-2">
                  {cat.articles.map((article) => (
                    <a
                      key={article.slug}
                      href={`/tin-tuc/${article.slug}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors group"
                    >
                      <CaretRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>{article.title}</span>
                    </a>
                  ))}
                </div>
                <a
                  href={`/kien-thuc/${cat.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Xem tất cả <CaretRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal linking block */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-slate-400 mb-3">Đi đường tắt</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Từ kiến thức đến báo giá, dự án và thương hiệu trong cùng một luồng đọc
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                Cách này giúp người đọc không chỉ đọc bài mà còn được dẫn sang trang giải pháp, trang sản phẩm và trang dự án ngay khi đã sẵn sàng ra quyết định.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ['Combo giải pháp', '/solar-home', 'Dẫn tới các cấu hình On-Grid, Hybrid và combo sẵn có.'],
                ['Dự án thực tế', '/du-an', 'Tăng độ tin cậy bằng case study và công trình đã triển khai.'],
                ['Hỏi đáp nhanh', '/hoi-dap', 'Bắt traffic từ nhu cầu tìm câu trả lời ngắn, rõ và thực tế.'],
              ].map(([title, href, desc]) => (
                <a key={title} href={href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cần Tư Vấn Chuyên Sâu?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Đội ngũ kỹ sư EPCVINA sẵn sàng tư vấn miễn phí giải pháp điện mặt trời phù hợp nhất cho gia đình bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-orange-50 transition-all">
              Gọi: 0988 446 113
            </a>
            <a href="/calculator" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
              Gửi Yêu Cầu Tư Vấn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
