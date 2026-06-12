import { Building2, Factory, ArrowRight } from 'lucide-react';

const solutions = [
  {
    title: 'Nhà xưởng & Khu công nghiệp',
    desc: 'Giải pháp điện mặt trởi công suất lớn cho nhà xưởng, giảm chi phí điện năng sản xuất.',
    href: '/applications/nha-xuong',
  },
  {
    title: 'Văn phòng & Trung tâm thương mại',
    desc: 'Hệ thống On-Grid & Hybrid cho văn phòng, tiết kiệm chi phí vận hành hàng tháng.',
    href: '/applications/van-phong',
  },
  {
    title: 'Khách sạn & Resort',
    desc: 'Giải pháp điện mặt trởi cho khách sạn, tối ưu chi phí năng lượng 24/7.',
    href: '/applications/khach-san',
  },
];

export default function IndustrialSolutions() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Giải pháp công nghiệp</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Giải pháp điện mặt trởi quy mô lớn cho doanh nghiệp, nhà máy và các công trình công nghiệp
          </p>
        </div>

        {/* Solution cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <Factory className="h-5 w-5 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {item.desc}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium text-orange-600">
                Tìm hiểu thêm
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
