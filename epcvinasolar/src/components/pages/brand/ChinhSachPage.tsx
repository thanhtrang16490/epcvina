import { FileText, Shield, CheckCircle, Phone, Users, Heart, Scale, Clock } from 'lucide-react';

const policies = [
  {
    title: 'Chính Sách Bảo Mật Thông Tin',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    href: '/chinh-sach-bao-mat',
    content: [
      'EPCVINA cam kết bảo mật thông tin cá nhân của khách hàng theo quy định pháp luật.',
      'Thông tin chỉ được sử dụng cho mục đích tư vấn, báo giá và chăm sóc khách hàng.',
      'Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý của khách hàng.',
      'Khách hàng có quyền yêu cầu xóa hoặc cập nhật thông tin cá nhân bất cứ lúc nào.',
    ],
  },
  {
    title: 'Chính Sách Thanh Toán',
    icon: Scale,
    color: 'bg-emerald-100 text-emerald-700',
    href: '/chinh-sach-thanh-toan',
    content: [
      'Đặt cọc 30% khi ký hợp đồng để xác nhận đơn hàng và đặt thiết bị.',
      'Thanh toán 40% khi thiết bị được giao đến công trình.',
      'Thanh toán 30% còn lại khi nghiệm thu và bàn giao hệ thống.',
      'Hỗ trợ trả góp qua ngân hàng liên kết, lãi suất 0% trong 6-12 tháng.',
      'Chấp nhận chuyển khoản, tiền mặt, thẻ tín dụng.',
    ],
  },
  {
    title: 'Chính Sách Đổi Trả & Hoàn Tiền',
    icon: Clock,
    color: 'bg-amber-100 text-amber-700',
    href: '/chinh-sach-doi-tra',
    content: [
      'Thiết bị lỗi nhà sản xuất: Đổi mới trong vòng 30 ngày đầu.',
      'Thiết bị hỏng trong thời gian bảo hành: Sửa chữa hoặc thay thế miễn phí.',
      'Hoàn tiền 100% nếu EPCVINA không thể khắc phục lỗi sau 3 lần sửa chữa.',
      'Không hoàn tiền cho thiệt hại do khách hàng tự ý sửa chữa hoặc sử dụng sai.',
    ],
  },
  {
    title: 'Chính Sách Chăm Sóc Khách Hàng',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    href: '/lien-he',
    content: [
      'Tư vấn miễn phí 24/7 qua hotline, Zalo, email.',
      'Bảo trì miễn phí năm đầu tiên sau lắp đặt.',
      'Giám sát hệ thống từ xa 24/7, cảnh báo sự cố tự động.',
      'Chương trình ưu đãi cho khách hàng giới thiệu: Giảm 5% cho người giới thiệu.',
      'Hỗ trợ xử lý sự cố trong vòng 24h tại Hà Nội, 48h tại các tỉnh.',
    ],
  },
  {
    title: 'Chính Sách Bảo Hành',
    icon: FileText,
    color: 'bg-purple-100 text-purple-700',
    href: '/bao-hanh',
    content: [
      'Pin mặt trời: Bảo hành hiệu suất 25 năm, sản phẩm 12 năm.',
      'Inverter: Bảo hành 10 năm chính hãng.',
      'Lắp đặt: Bảo hành 5 năm cho công trình.',
      'Chi tiết xem tại trang Chính Sách Bảo Hành.',
    ],
  },
  {
    title: 'Chính Sách Giao Nhận & Triển Khai',
    icon: Users,
    color: 'bg-cyan-100 text-cyan-700',
    href: '/chinh-sach-giao-nhan',
    content: [
      'Miễn phí vận chuyển trong bán kính 50km từ văn phòng EPCVINA.',
      'Phí vận chuyển ngoài khu vực: Thỏa thuận theo thực tế.',
      'Thời gian lắp đặt: 3-7 ngày cho hệ gia đình, 7-30 ngày cho doanh nghiệp.',
      'EPCVINA chịu trách nhiệm bảo hiểm cho thiết bị trong quá trình vận chuyển.',
    ],
  },
];

export default function ChinhSachPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Chính Sách Công Ty</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Chính Sách EPCVINA
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            EPCVINA cam kết minh bạch, công bằng và bảo vệ quyền lợi khách hàng. 
            Dưới đây là các chính sách áp dụng cho mọi dịch vụ.
          </p>
        </div>
      </section>

      {/* Policies */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {policies.map((policy, i) => (
              <a key={i} href={policy.href} className="block bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 hover:shadow-md hover:border-slate-300 transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`${policy.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <policy.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <h2 className="text-xl font-bold text-slate-900">{policy.title}</h2>
                      <span className="text-slate-400 group-hover:text-[#DC2626] transition-colors text-sm flex-shrink-0">Xem chi tiết →</span>
                    </div>
                    <div className="space-y-3">
                      {policy.content.map((item, ii) => (
                        <div key={ii} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Trang Liên Quan
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a href="/bao-hanh" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Chính Sách Bảo Hành</p>
            </a>
            <a href="/chinh-sach-thanh-toan" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <Scale className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Chính Sách Thanh Toán</p>
            </a>
            <a href="/chinh-sach-doi-tra" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Chính Sách Đổi Trả</p>
            </a>
            <a href="/chinh-sach-giao-nhan" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <Users className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Chính Sách Giao Nhận</p>
            </a>
            <a href="/quy-trinh-thi-cong" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Quy Trình Thi Công</p>
            </a>
            <a href="/chung-nhan" className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow text-center">
              <Scale className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Chứng Nhận</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Có Câu Hỏi Về Chính Sách?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Liên hệ với chúng tôi để được giải đáp mọi thắc mắc.
          </p>
          <a href="tel:0988446113" className="bg-white text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2">
            <Phone className="w-5 h-5" /> 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
