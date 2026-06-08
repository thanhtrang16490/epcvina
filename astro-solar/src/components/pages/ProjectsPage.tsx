import { Sun, Building2, MapPin, Calendar, ArrowRight } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────
const solarProjects = [
  { name: 'Trang trại Điện mặt trời Bình Thuận', capacity: '~42 MWp', type: 'Solar Farm', location: 'Bình Thuận', year: '2020' },
  { name: 'Trang trại Điện mặt trời Khánh Hòa', capacity: '~35 MWp', type: 'Solar Farm', location: 'Khánh Hòa', year: '2020' },
  { name: 'Điện mặt trời mái nhà C&I Thái Nguyên', capacity: '~12.6 MWp', type: 'Rooftop C&I', location: 'Thái Nguyên', year: '2021' },
  { name: 'Điện mặt trời mái nhà C&I Nghệ An', capacity: '~7.3 MWp', type: 'Rooftop C&I', location: 'Nghệ An', year: '2022' },
  { name: 'Điện mặt trời mái nhà C&I Nam Định', capacity: '~4.8 MWp', type: 'Rooftop C&I', location: 'Nam Định', year: '2022' },
];

const mepProjects = [
  { name: 'Samsung SEV - Bắc Ninh', scope: 'HVAC, Chiller, Hệ thống nước, Đường ống', client: 'Samsung', year: '2014-2015' },
  { name: 'Samsung SEVT - Thái Nguyên', scope: 'HVAC, Khí nén, Hệ thống DI/RO', client: 'Samsung', year: '2014-2016' },
  { name: 'VinFast Auto Complex - Hải Phòng', scope: 'Đường ống công nghệ, HVAC, PCCC', client: 'VinFast', year: '2018-2020' },
  { name: 'Lotte Mall Tây Hồ', scope: 'HVAC, Hệ thống nước, PCCC', client: 'Lotte', year: '2021-2023' },
  { name: 'Shilla Hotel - StarLake', scope: 'HVAC, Hệ thống nước, Vệ sinh', client: 'Shilla', year: '2024-2026' },
  { name: 'Đại sứ quán Hàn Quốc - Hà Nội', scope: 'HVAC, Nước, PCCC, Xử lý nước thải', client: 'Chính phủ Hàn Quốc', year: '2017-2018' },
  { name: 'Samsung SEHC - TP.HCM', scope: 'PCCC, Lắp đặt cơ khí', client: 'Samsung', year: '2015-2016' },
  { name: 'Vinhomes Metropolis Liễu Giai', scope: 'HVAC, Hệ thống Chiller', client: 'VinGroup', year: '2017-2018' },
];

const clientNames = ['Samsung', 'VinFast', 'VinGroup', 'Lotte', 'Keangnam', 'Coteccons', 'Shilla'];

// ── Component ────────────────────────────────────────────────
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Dự án tiêu biểu
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Hơn 15 năm kinh nghiệm với các dự án quy mô lớn trên toàn quốc
          </p>
        </div>
      </section>

      {/* ── Solar Projects ────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <Sun className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dự án Điện mặt trời
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solarProjects.map((project) => (
              <div
                key={project.name}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Orange gradient top bar */}
                <div className="h-2 bg-gradient-to-r from-amber-400 to-emerald-500" />

                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
                    {project.name}
                  </h3>

                  <p className="text-2xl font-bold text-amber-500 mb-4">
                    {project.capacity}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {project.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEP / Industrial Projects ──────────────────────── */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dự án Cơ điện (MEP)
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mepProjects.map((project) => (
              <div
                key={project.name}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Gray top bar */}
                <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-500" />

                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {project.scope}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {project.client}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {project.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Logos ───────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Đối tác tin cậy
            </h2>
            <p className="text-gray-500 mt-2">
              Các đối tác lớn tin tưởng lựa chọn EPC Solar
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {clientNames.map((name) => (
              <div
                key={name}
                className="border border-gray-200 rounded-lg px-6 py-3 bg-gray-50 text-gray-600 font-semibold text-sm sm:text-base hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Bạn có dự án cần triển khai?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn giải pháp phù hợp
          </p>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-900 font-semibold rounded-full cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-lg"
          >
            Liên hệ tư vấn
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
