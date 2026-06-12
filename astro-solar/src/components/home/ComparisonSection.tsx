import { Check, X, Battery, Sun } from 'lucide-react';

const comparisonData = [
  { feature: 'Hoạt động khi mất điện lưới', onGrid: false, hybrid: true },
  { feature: 'Pin lưu trữ điện', onGrid: false, hybrid: true },
  { feature: 'Bán điện dư cho EVN', onGrid: true, hybrid: true },
  { feature: 'Tiết kiệm hóa đơn điện', onGrid: true, hybrid: true },
  { feature: 'Chi phí đầu tư ban đầu', onGrid: 'Thấp hơn', hybrid: 'Cao hơn' },
  { feature: 'Thời gian hoàn vốn', onGrid: '3-4 năm', hybrid: '5-7 năm' },
  { feature: 'Phù hợp cho', onGrid: 'Hộ gia đình, văn phòng', hybrid: 'Khu vực mất điện thường xuyên' },
  { feature: 'Tuổi thọ hệ thống', onGrid: '25+ năm', hybrid: '25+ năm (pin 10-15 năm)' },
  { feature: 'Bảo trì', onGrid: 'Đơn giản', hybrid: 'Phức tạp hơn' },
  { feature: 'Công suất phổ biến', onGrid: '5-30 kWp', hybrid: '5-20 kWp' },
];

export default function ComparisonSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            So sánh điện mặt trời Hybrid và On-Grid
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Tìm hiểu sự khác biệt giữa hai hệ thống phổ biến nhất để chọn giải pháp phù hợp
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-4 font-medium text-gray-600 w-[40%]">Tiêu chí</th>
                <th className="text-center px-5 py-4 w-[30%]">
                  <div className="flex items-center justify-center gap-2">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <span className="font-bold text-gray-900">On-Grid</span>
                  </div>
                </th>
                <th className="text-center px-5 py-4 w-[30%]">
                  <div className="flex items-center justify-center gap-2">
                    <Battery className="h-5 w-5 text-orange-600" />
                    <span className="font-bold text-gray-900">Hybrid</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={row.feature}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-5 py-3.5 text-gray-700 font-medium">{row.feature}</td>
                  <td className="px-5 py-3.5 text-center">
                    {typeof row.onGrid === 'boolean' ? (
                      row.onGrid ? (
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-700">{row.onGrid}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {typeof row.hybrid === 'boolean' ? (
                      row.hybrid ? (
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-700">{row.hybrid}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA under table */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/on-grid"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
          >
            <Sun className="h-4 w-4" />
            Xem combo On-Grid
          </a>
          <a
            href="/hybrid"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
          >
            <Battery className="h-4 w-4" />
            Xem combo Hybrid
          </a>
        </div>
      </div>
    </section>
  );
}
