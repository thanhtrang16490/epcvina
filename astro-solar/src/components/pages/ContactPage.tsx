import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ChevronDown } from 'lucide-react';
import HeaderBar from '../home/HeaderBar';
import FooterSection from '../home/FooterSection';

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
      <div className="md:pt-16">
        {/* Section 1 - Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Liên hệ với <span className="text-amber-400">chúng tôi</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Tư vấn miễn phí - Khảo sát tận nơi - Báo giá trong 24h
            </p>
          </div>
        </section>

        {/* Section 2 - Two Column Layout */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left - Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi yêu cầu tư vấn</h2>

                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Gửi thành công!</h3>
                      <p className="text-gray-500 mb-6">
                        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', phone: '', email: '', systemType: '', message: '' });
                        }}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      >
                        Gửi yêu cầu mới
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Họ và tên <span className="text-emerald-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Số điện thoại <span className="text-emerald-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0912 345 678"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                        />
                      </div>

                      {/* System Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Loại hệ thống
                        </label>
                        <div className="relative">
                          <select
                            name="systemType"
                            value={formData.systemType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white transition-shadow"
                          >
                            <option value="">Chọn loại hệ thống</option>
                            <option value="hybrid-1-pha">Hybrid 1 pha</option>
                            <option value="hybrid-3-pha">Hybrid 3 pha</option>
                            <option value="cong-nghiep">Hệ thống công nghiệp</option>
                            <option value="khac">Khác</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Nội dung tin nhắn
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Mô tả yêu cầu của bạn (diện tích mái, công suất mong muốn...)"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-shadow"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-amber-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      >
                        <Send className="h-4 w-4" />
                        Gửi yêu cầu tư vấn
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right - Contact Info Cards */}
              <div className="lg:col-span-2 space-y-4">
                {/* Phone */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Điện thoại</h3>
                      <a href="tel:02473081868" className="block text-gray-600 hover:text-emerald-600 transition-colors">
                        024.7308.1868
                      </a>
                      <a href="tel:0985703619" className="block text-gray-600 hover:text-emerald-600 transition-colors">
                        0985.703.619
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                      <a href="mailto:epcvina@hotmail.com" className="text-gray-600 hover:text-emerald-600 transition-colors">
                        epcvina@hotmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Phòng 315, Khu nhà ở Học Viện Quốc Phòng, Đường Xuân Tảo, Phường Xuân Tảo, Tây Hồ, Hà Nội
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">Thứ 2 - Thứ 7: 8:00 - 17:30</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Map */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Vị trí văn phòng</h2>
              <p className="text-gray-500 mt-2">Khu nhà ở Học Viện Quốc Phòng, Tây Hồ, Hà Nội</p>
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

        <FooterSection />
      </div>
    </div>
  );
}
