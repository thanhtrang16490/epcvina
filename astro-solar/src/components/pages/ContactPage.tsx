import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  MessageCircle,
  Headphones,
  ArrowRight,
  Sun,
} from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

/* ─── Contact Info Cards ─── */
const contactCards = [
  {
    icon: <Phone className="h-6 w-6" aria-hidden="true" />,
    title: 'Điện thoại',
    details: [
      { label: 'Hotline', value: '0988 446 113', href: 'tel:0988446113', note: '(Mrs. Giang)' },
      { label: 'Cố định', value: '024 7308 1868', href: 'tel:02473081868', note: '' },
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    alt: 'Đội ngũ tư vấn khách hàng EPCVINA Solar',
    gradient: 'from-emerald-600 to-emerald-500',
  },
  {
    icon: <Mail className="h-6 w-6" aria-hidden="true" />,
    title: 'Email',
    details: [
      { label: 'Email', value: 'epcvina@hotmail.com', href: 'mailto:epcvina@hotmail.com', note: '' },
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    alt: 'Văn phòng làm việc EPCVINA Solar',
    gradient: 'from-green-600 to-green-500',
  },
  {
    icon: <MapPin className="h-6 w-6" aria-hidden="true" />,
    title: 'Địa chỉ',
    details: [
      { label: '', value: 'Phòng 315, Khu TM Chung cư HVQP, Nguyễn Văn Huyên, Q. Tây Hồ, Hà Nội', href: '', note: '' },
    ],
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80',
    alt: 'Bản đồ vị trí văn phòng EPCVINA Solar',
    gradient: 'from-teal-600 to-teal-500',
  },
  {
    icon: <Clock className="h-6 w-6" aria-hidden="true" />,
    title: 'Giờ làm việc',
    details: [
      { label: 'Thứ 2 – Thứ 7', value: '8:00 – 17:30', href: '', note: '' },
      { label: 'Chủ nhật', value: 'Nghỉ', href: '', note: '' },
    ],
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80',
    alt: 'Phòng họp tư vấn EPCVINA Solar',
    gradient: 'from-cyan-600 to-cyan-500',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    systemType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBar />
      {/* ═══════════════════ Hero Section ═══════════════════ */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[50vh] sm:min-h-[60vh]">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80"
          alt="Đội ngũ tư vấn EPCVINA Solar sẵn sàng hỗ trợ khách hàng"
          loading="eager"
          width={1200}
          height={675}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/30 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-base border border-emerald-400/30 mb-6">
            <Headphones className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-emerald-300 font-semibold tracking-wide">Tư Vấn Miễn Phí</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Liên Hệ Với{' '}
            <span className="text-emerald-400">Chúng Tôi</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            EPCVINA SOLAR sẵn sàng tư vấn miễn phí giải pháp điện mặt trời tối ưu cho gia đình
            và doanh nghiệp của bạn. Khảo sát tận nơi — Báo giá trong 24 giờ — Hỗ trợ trọn đời.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="tel:0988446113"
              className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 ease-in-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Gọi ngay: 0988 446 113
            </a>
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat Zalo
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ Contact Info Cards ═══════════════════ */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="contact-info-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Thông tin liên hệ
            </div>
            <h2 id="contact-info-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
              Kênh <span className="text-emerald-600">Liên Hệ</span>
            </h2>
            <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
              Đội ngũ EPCVINA luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-shadow duration-200 motion-reduce:transition-none"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white mb-3`}>
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{card.title}</h3>
                  <div className="space-y-1.5">
                    {card.details.map((d) => (
                      <div key={d.label + d.value} className="text-sm text-gray-600 leading-relaxed">
                        {d.href ? (
                          <a
                            href={d.href}
                            className="hover:text-emerald-600 transition-colors duration-200 motion-reduce:transition-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-sm"
                          >
                            {d.label && <span className="text-gray-500">{d.label}: </span>}
                            <span className="font-medium text-gray-900">{d.value}</span>
                            {d.note && <span className="text-gray-400"> {d.note}</span>}
                          </a>
                        ) : (
                          <>
                            {d.label && <span className="text-gray-500">{d.label}: </span>}
                            <span className="font-medium text-gray-900">{d.value}</span>
                            {d.note && <span className="text-gray-400"> {d.note}</span>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ Form + Why Choose Us ═══════════════════ */}
      <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="consultation-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left — Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Gửi yêu cầu tư vấn
                </div>
                <h2 id="consultation-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Đăng Ký <span className="text-emerald-600">Tư Vấn Miễn Phí</span>
                </h2>
                <p className="text-base text-gray-500 mb-6 leading-relaxed">
                  Để lại thông tin, EPCVINA sẽ liên hệ tư vấn trong vòng 24 giờ
                </p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Gửi thành công!</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                      Cảm ơn bạn đã liên hệ. Đội ngũ EPCVINA sẽ phản hồi trong vòng 24 giờ.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', phone: '', email: '', systemType: '', message: '' });
                      }}
                      className="cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                    >
                      Gửi yêu cầu mới
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Họ và tên <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200 motion-reduce:transition-none"
                      />
                    </div>

                    {/* Phone & Email row */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Số điện thoại <span className="text-emerald-500">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0912 345 678"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200 motion-reduce:transition-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow duration-200 motion-reduce:transition-none"
                        />
                      </div>
                    </div>

                    {/* System Type */}
                    <div>
                      <label htmlFor="contact-system" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Loại hệ thống
                      </label>
                      <div className="relative">
                        <select
                          id="contact-system"
                          name="systemType"
                          value={formData.systemType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white transition-shadow duration-200 motion-reduce:transition-none cursor-pointer"
                        >
                          <option value="">Chọn loại hệ thống</option>
                          <option value="on-grid">On-Grid (Bán điện)</option>
                          <option value="hybrid-1-pha">Hybrid 1 pha</option>
                          <option value="hybrid-3-pha">Hybrid 3 pha</option>
                          <option value="cong-nghiep">Hệ thống công nghiệp</option>
                          <option value="tramsac">Trạm sạc xe điện V-GREEN</option>
                          <option value="khac">Khác</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nội dung tin nhắn
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Mô tả yêu cầu của bạn (diện tích mái, công suất mong muốn...)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow duration-200 motion-reduce:transition-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 ease-in-out shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Gửi yêu cầu tư vấn
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right — Why Choose Us */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-400/30">
                    <Sun className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold">Tại sao chọn EPCVINA SOLAR?</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: <CheckCircle className="h-5 w-5" aria-hidden="true" />, text: 'Tổng thầu EPC — Một đầu mối duy nhất' },
                    { icon: <Headphones className="h-5 w-5" aria-hidden="true" />, text: 'Tư vấn miễn phí — Khảo sát tận nơi' },
                    { icon: <Clock className="h-5 w-5" aria-hidden="true" />, text: 'Báo giá chi tiết trong 24 giờ' },
                    { icon: <MapPin className="h-5 w-5" aria-hidden="true" />, text: 'Đội kỹ sư riêng cho từng dự án' },
                    { icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />, text: 'Hỗ trợ bảo hành trọn đời 30 năm' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <span className="text-emerald-400 flex-shrink-0 mt-0.5">{item.icon}</span>
                      <span className="text-sm text-gray-200 leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick contact card */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="font-bold text-gray-900 text-base mb-4">Liên hệ nhanh</h3>
                <div className="space-y-3">
                  <a
                    href="tel:0988446113"
                    className="cursor-pointer flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Hotline</div>
                      <div className="font-semibold text-gray-900 text-sm">0988 446 113</div>
                    </div>
                  </a>
                  <a
                    href="https://zalo.me/0988446113"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Zalo</div>
                      <div className="font-semibold text-gray-900 text-sm">0988 446 113</div>
                    </div>
                  </a>
                  <a
                    href="mailto:epcvina@hotmail.com"
                    className="cursor-pointer flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-shadow duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-amber-600" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-semibold text-gray-900 text-sm">epcvina@hotmail.com</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ Map Section ═══════════════════ */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="map-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-base font-semibold text-emerald-700 mb-4">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Vị trí văn phòng
            </div>
            <h2 id="map-heading" className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hệ <span className="text-emerald-600">Số Bản Đồ</span>
            </h2>
            <p className="text-base text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
              Khu TM Chung cư HVQP, Nguyễn Văn Huyên, Quận Tây Hồ, Hà Nội
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8!2d105.8272!3d21.0675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135005a6c6b4a5b%3A0x6e1e5e2c6a1e5e2c!2zS2h1IG5ow6AgbyBI4buHIFZpZW4gUXVvYyBQaMawbmcsIFRheSBI4buHLCBIw6AgTuG7kWk!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EPC Solar văn phòng"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA Section ═══════════════════ */}
      <section className="py-12 sm:py-16 bg-emerald-50" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" aria-hidden="true">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Sun className="h-8 w-8 text-emerald-300" aria-hidden="true" />
              </div>
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Sẵn Sàng Chuyển Đổi Năng Lượng?
              </h2>
              <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Liên hệ ngay để nhận tư vấn miễn phí và bản đề xuất kỹ thuật dành riêng cho
                gia đình hoặc doanh nghiệp của bạn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:0988446113"
                  className="cursor-pointer inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors duration-200 ease-in-out hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Gọi Hotline: 0988 446 113
                </a>
                <a
                  href="https://zalo.me/0988446113"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 motion-reduce:transition-none min-h-[44px]"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Chat Zalo
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
