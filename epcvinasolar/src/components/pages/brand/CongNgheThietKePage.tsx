import { Cpu, Monitor, Sun, Wind, Drop, Lightning, CheckCircle, Phone, ArrowRight } from '@phosphor-icons/react';

const technologies = [
  {
    name: 'PVSyst',
    icon: Sun,
    color: 'bg-amber-100 text-amber-700',
    desc: 'Phần mềm mô phỏng sản lượng điện mặt trời chuyên nghiệp hàng đầu thế giới.',
    features: ['Mô phỏng 3D bóng che chính xác', 'Tính toán tổn thất chi tiết', 'Báo cáo sản lượng theo giờ/năm', 'Phân tích kinh tế tự động'],
  },
  {
    name: 'Helioscope',
    icon: Monitor,
    color: 'bg-blue-100 text-blue-700',
    desc: 'Nền tảng thiết kế điện mặt trời trên cloud, cho phép tạo bản vẽ nhanh và chính xác.',
    features: ['Thiết kế layout trên bản vệ tinh', 'Tối ưu hóa vị trí tấm pin', 'Xuất bản vẽ kỹ thuật CAD', 'Tính toán dây dẫn & tủ điện'],
  },
  {
    name: 'AutoCAD / SketchUp',
    icon: Cpu,
    color: 'bg-purple-100 text-purple-700',
    desc: 'Phần mềm thiết kế kỹ thuật 2D/3D cho bản vẽ kết cấu, điện và kiến trúc.',
    features: ['Bản vẽ kết cấu khung giàn', 'Sơ đồ đơn tuyến (SLD)', 'Bản vẽ chi tiết lắp đặt', 'Phối cảnh 3D cho khách hàng'],
  },
];

const standards = [
  { name: 'TCVN 7447-7-712', desc: 'Hệ thống điện mặt trời nối lưới - Yêu cầu kỹ thuật' },
  { name: 'IEC 61215 / IEC 61730', desc: 'Tiêu chuẩn module PV - Hiệu suất và an toàn' },
  { name: 'IEC 62109', desc: 'An toàn bộ chuyển đổi điện cho hệ thống PV' },
  { name: 'TCVN 9366-2:2013', desc: 'Chống sét cho công trình xây dựng' },
  { name: 'IEC 62446', desc: 'Kiểm tra và bảo trì hệ thống PV' },
  { name: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
];

const advantages = [
  { title: 'Tối ưu sản lượng', desc: 'Mô phỏng chính xác giúp tối ưu hướng, góc nghiêng, tránh bóng che - tăng 15-25% sản lượng.' },
  { title: 'Dự báo chính xác', desc: 'Khách hàng biết chính xác sản lượng điện hàng năm trước khi lắp đặt, không có bất ngờ.' },
  { title: 'An toàn tuyệt đối', desc: 'Thiết kế theo tiêu chuẩn quốc tế, tính toán chịu gió, chống sét, tiếp địa đầy đủ.' },
  { title: 'Thẩm mỹ cao', desc: 'Phối cảnh 3D giúp khách hàng xem trước hệ thống trên mái nhà thực tế.' },
  { title: 'Tiết kiệm chi phí', desc: 'Thiết kế tối ưu giảm vật tư thừa, giảm chi phí lắp đặt 10-15%.' },
  { title: 'Dễ bảo trì', desc: 'Bản vẽ chi tiết giúp dễ dàng bảo trì, sửa chữa và nâng cấp sau này.' },
];

export default function CongNgheThietKePage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-medium">Công Nghệ Thiết Kế</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Công Nghệ Thiết Kế Điện Mặt Trời
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            EPCVINA sử dụng phần mềm thiết kế hàng đầu thế giới, 
            đảm bảo hệ thống được tính toán chính xác, tối ưu hiệu suất và an toàn.
          </p>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Phần Mềm Thiết Kế Chuyên Nghiệp
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className={`${tech.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tech.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{tech.desc}</p>
                <div className="space-y-2">
                  {tech.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Lợi Ích Của Thiết Kế Chuyên Nghiệp
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{adv.title}</h3>
                <p className="text-slate-600 text-sm">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Tiêu Chuẩn Kỹ Thuật Áp Dụng
          </h2>
          <div className="space-y-3">
            {standards.map((std, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-slate-200 flex items-start gap-3">
                <Lightning className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{std.name}</p>
                  <p className="text-sm text-slate-600">{std.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Muốn Xem Bản Thiết Kế Mẫu?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Liên hệ để nhận bản thiết kế demo miễn phí cho mái nhà của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-purple-600 font-bold px-8 py-3 rounded-lg hover:bg-purple-50 transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> 0988 446 113
            </a>
            <a href="/calculator" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              Yêu Cầu Thiết Kế <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
