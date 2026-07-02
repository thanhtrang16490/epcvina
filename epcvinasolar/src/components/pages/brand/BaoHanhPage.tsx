import { Shield, CheckCircle, Clock, Medal, Phone, WarningCircle, Wrench, Sun, Lightning, BatteryHigh, ClipboardText } from '@phosphor-icons/react';

const warrantyItems = [
  {
    category: 'Tấm Pin Mặt Trời',
    icon: <Sun weight="duotone" className="w-8 h-8 text-amber-500" />,
    items: [
      { name: 'Bảo hành hiệu suất (Performance)', duration: '25 năm', desc: 'Đảm bảo ≥80% công suất sau 25 năm' },
      { name: 'Bảo hành sản phẩm (Product)', duration: '12 năm', desc: 'Lỗi nhà sản xuất, nứt vỡ, hỏng hóc' },
    ]
  },
  {
    category: 'Inverter (Biến tần)',
    icon: <Lightning weight="duotone" className="w-8 h-8 text-yellow-500" />,
    items: [
      { name: 'Inverter Hybrid', duration: '10 năm', desc: 'Bảo hành chính hãng, đổi mới nếu lỗi' },
      { name: 'Inverter On-Grid', duration: '10 năm', desc: 'Hỗ trợ firmware update miễn phí' },
    ]
  },
  {
    category: 'Pin Lưu Trữ (BESS)',
    icon: <BatteryHigh weight="duotone" className="w-8 h-8 text-green-500" />,
    items: [
      { name: 'Pin Lithium LFP', duration: '10 năm', desc: '≥6000 chu kỳ, bảo hành dung lượng' },
      { name: 'Pin Lithium NMC', duration: '8 năm', desc: 'Bảo hành theo số chu kỳ sạc' },
    ]
  },
  {
    category: 'Thi Công & Lắp Đặt',
    icon: <Wrench weight="duotone" className="w-8 h-8 text-blue-500" />,
    items: [
      { name: 'Khung giàn & phụ kiện', duration: '10 năm', desc: 'Chống rỉ sét, chịu được gió bão' },
      { name: 'Công lắp đặt', duration: '5 năm', desc: 'Bảo hành thấm dột, kết cấu mái' },
      { name: 'Hệ thống dây điện', duration: '10 năm', desc: 'DC cable, AC cable, tủ điện' },
    ]
  },
  {
    category: 'Dịch Vụ Sau Bán Hàng',
    icon: <ClipboardText weight="duotone" className="w-8 h-8 text-indigo-500" />,
    items: [
      { name: 'Bảo trì miễn phí năm đầu', duration: '12 tháng', desc: 'Kiểm tra hệ thống, vệ sinh pin, báo cáo' },
      { name: 'Giám sát từ xa', duration: 'Trọn đời', desc: 'Monitoring 24/7 qua app, cảnh báo sự cố' },
    ]
  },
];

const conditions = [
  'Bảo hành áp dụng cho lỗi nhà sản xuất, không áp dụng cho thiệt hại do thiên tai, tai nạn',
  'Không bảo hành nếu khách hàng tự ý sửa chữa, thay đổi kết cấu hệ thống',
  'Bảo hành không bao gồm chi phí vận chuyển cho thiết bị gửi đi sửa chữa',
  'Thời gian xử lý bảo hành: 48h tiếp nhận, 7-15 ngày xử lý',
  'Khách hàng cần cung cấp hóa đơn, hợp đồng lắp đặt khi yêu cầu bảo hành',
];

export default function BaoHanhPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Chính Sách Bảo Hành</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Chính Sách Bảo Hành EPCVINA
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Cam kết bảo hành minh bạch, dài hạn nhất thị trường. 
            EPCVINA đồng hành cùng bạn trong suốt vòng đời hệ thống.
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-emerald-600">25 năm</p>
              <p className="text-sm text-slate-600">Bảo hành pin mặt trời</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">10 năm</p>
              <p className="text-sm text-slate-600">Bảo hành inverter</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">5 năm</p>
              <p className="text-sm text-slate-600">Bảo hành lắp đặt</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">48h</p>
              <p className="text-sm text-slate-600">Tiếp nhận yêu cầu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Details */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Chi Tiết Bảo Hành Theo Hạng Mục
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warrantyItems.map((group, gi) => (
              <div key={gi} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="mb-3">{group.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{group.category}</h3>
                <div className="space-y-3">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-emerald-600 font-medium">{item.duration}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Quy Trình Bảo Hành
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Liên hệ yêu cầu', desc: 'Gọi hotline 0988 446 113 hoặc gửi yêu cầu qua Zalo/Email', icon: Phone },
              { step: 2, title: 'Tiếp nhận & xác minh', desc: 'EPCVINA xác minh thông tin trong 48h, kiểm tra điều kiện bảo hành', icon: Clock },
              { step: 3, title: 'Khảo sát & xử lý', desc: 'Kỹ thuật viên đến tận nơi kiểm tra, xử lý hoặc thay thế thiết bị', icon: Wrench },
              { step: 4, title: 'Hoàn tất & báo cáo', desc: 'Lắp đặt lại, test hệ thống, bàn giao và cập nhật hồ sơ bảo hành', icon: Medal },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <WarningCircle className="w-6 h-6 text-amber-600" />
            Lưu Ý Về Điều Kiện Bảo Hành
          </h2>
          <div className="space-y-3">
            {conditions.map((c, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-amber-200">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 text-sm">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cần Hỗ Trợ Bảo Hành?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Liên hệ ngay để được hỗ trợ nhanh chóng. Đội ngũ kỹ thuật EPCVINA sẵn sàng phục vụ.
          </p>
          <a href="tel:0988446113" className="bg-white text-emerald-600 font-bold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-all inline-flex items-center gap-2">
            <Phone className="w-5 h-5" /> Hotline: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
