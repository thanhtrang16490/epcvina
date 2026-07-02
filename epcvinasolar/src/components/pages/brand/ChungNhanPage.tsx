import { Medal, Shield, CheckCircle, Phone, FileText, Users, Building, Star } from '@phosphor-icons/react';

const certifications = [
  {
    name: 'Chứng Chỉ Năng Lực Xây Dựng',
    issuer: 'Bộ Xây Dựng',
    desc: 'Chứng nhận năng lực hoạt động xây dựng hạng II, đủ điều kiện thi công các công trình điện mặt trời.',
    icon: Building,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Chứng Chỉ Phòng Cháy Chữa Cháy',
    issuer: 'Cục Cảnh sát PCCC',
    desc: 'Đáp ứng đầy đủ yêu cầu về phòng cháy chữa cháy cho công trình điện mặt trời.',
    icon: Shield,
    color: 'bg-red-100 text-red-700',
  },
  {
    name: 'ISO 9001:2015',
    issuer: 'Tổ chức chứng nhận quốc tế',
    desc: 'Hệ thống quản lý chất lượng đạt chuẩn ISO 9001:2015, đảm bảo quy trình nhất quán.',
    icon: Medal,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Chứng Nhận Đại Lý Ủy Quyền',
    issuer: 'Deye, SAJ, Hopetrek, Longi',
    desc: 'Đại lý ủy quyền chính hãng cho các thương hiệu inverter và pin mặt trời hàng đầu.',
    icon: Star,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Chứng Chỉ An Toàn Điện',
    issuer: 'Bộ Công Thương',
    desc: 'Đội ngũ kỹ thuật có chứng chỉ an toàn điện, đủ điều kiện thi công hệ thống điện.',
    icon: FileText,
    color: 'bg-purple-100 text-purple-700',
  },
];

const partners = [
  { name: 'LONGi Solar', desc: 'Nhà cung cấp tấm pin số 1 thế giới' },
  { name: 'Deye', desc: 'Inverter Hybrid hàng đầu Trung Quốc' },
  { name: 'SAJ Electric', desc: 'Inverter On-Grid & Hybrid chất lượng cao' },
  { name: 'Hopetrek', desc: 'Inverter & BESS công nghệ mới' },
  { name: 'Genixgreen', desc: 'Pin lưu trữ LFP an toàn, bền bỉ' },
  { name: 'Qcells', desc: 'Tấm pin Hàn Quốc hiệu suất cao' },
];

const stats = [
  { value: '13+', label: 'Năm kinh nghiệm' },
  { value: '500+', label: 'Công trình hoàn thành' },
  { value: '98%', label: 'Khách hàng hài lòng' },
  { value: '0', label: 'Tai nạn lao động' },
];

export default function ChungNhanPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Medal className="w-5 h-5" />
            <span className="text-sm font-medium">Chứng Nhận & Năng Lực</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Chứng Nhận & Năng Lực EPCVINA
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            EPCVINA là nhà thầu điện mặt trời có đầy đủ chứng chỉ năng lực, 
            đối tác chính hãng và đội ngũ kỹ thuật chuyên nghiệp.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-amber-600">{s.value}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Chứng Chỉ & Chứng Nhận
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className={`${cert.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <cert.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{cert.name}</h3>
                <p className="text-sm text-amber-600 font-medium mb-2">{cert.issuer}</p>
                <p className="text-sm text-slate-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Đối Tác Chính Hãng
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((p, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-sm text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Đội Ngũ Kỹ Thuật Chuyên Nghiệp
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">20+</p>
              <p className="text-sm text-slate-600">Kỹ sư điện, xây dựng</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-600">Có chứng chỉ an toàn điện</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <Medal className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-slate-900">5+</p>
              <p className="text-sm text-slate-600">Năm kinh nghiệm trung bình</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Chọn Nhà Thầu Uy Tín</h2>
          <p className="text-xl text-amber-100 mb-8">
            EPCVINA cam kết chất lượng, minh bạch và đồng hành lâu dài.
          </p>
          <a href="tel:0988446113" className="bg-white text-amber-600 font-bold px-8 py-3 rounded-lg hover:bg-amber-50 transition-all inline-flex items-center gap-2">
            <Phone className="w-5 h-5" /> Liên Hệ Ngay: 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
