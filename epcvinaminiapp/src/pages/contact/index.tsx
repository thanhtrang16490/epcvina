import Section from "@/components/section";
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight, ExternalLink, Send } from "lucide-react";
import TransitionLink from "@/components/transition-link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to API or email
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <div className="px-4 py-4 space-y-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-5 text-white">
          <h1 className="text-xl font-bold mb-2">EPCVINA Solar</h1>
          <p className="text-sm opacity-90 mb-3">
            Chuyên cung cấp thiết bị & thi công hệ thống điện mặt trời hòa lưới
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>0988 446 113</span>
          </div>
        </div>

        {/* Contact Information */}
        <Section title="Thông tin liên hệ">
          <div className="flex flex-col space-y-4">
            {/* Phone */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Điện thoại</p>
                <a 
                  href="tel:0988446113" 
                  className="text-2xs text-primary block hover:underline"
                >
                  Hotline: 0988 446 113 (Mrs. Giang)
                </a>
                <a 
                  href="tel:02473081868" 
                  className="text-2xs text-primary block hover:underline mt-0.5"
                >
                  Cố định: 024 7308 1868
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Email</p>
                <a 
                  href="mailto:epcvina@hotmail.com" 
                  className="text-2xs text-primary hover:underline"
                >
                  epcvina@hotmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Địa chỉ</p>
                <p className="text-2xs text-muted">
                  Phòng 315, Khu TM Chung cư HVQP, Nguyễn Văn Huyên, Q. Tây Hồ, Hà Nội
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Giờ làm việc</p>
                <p className="text-2xs text-muted">Thứ 2 – Thứ 7: 8:00 – 17:30</p>
                <p className="text-2xs text-muted">Chủ nhật: Nghỉ</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Quick Actions */}
        <Section title="Hỗ trợ nhanh">
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:0988446113"
              className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all active:scale-95 flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-center">Gọi ngay</span>
            </a>

            <a
              href="mailto:epcvina@hotmail.com"
              className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all active:scale-95 flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-center">Gửi email</span>
            </a>

            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all active:scale-95 flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-center">Chat Zalo</span>
            </a>

            <a
              href="https://maps.google.com/?q=Phòng+315+Khu+TM+Chung+cư+HVQP+Nguyễn+Văn+Huyên+Tây+Hồ+Hà+Nội"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all active:scale-95 flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs font-medium text-center">Chỉ đường</span>
            </a>
          </div>
        </Section>

        {/* Contact Form */}
        <Section title="Gửi tin nhắn">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-green-900 mb-1">Đã gửi thành công!</h3>
              <p className="text-2xs text-green-700">
                Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ và tên"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nội dung tư vấn
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ví dụ: Tôi muốn tư vấn lắp điện mặt trời cho mái tôn 100m2"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Gửi tin nhắn
              </button>
            </form>
          )}
        </Section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">💡 Tư vấn miễn phí</h3>
              <p className="text-2xs text-gray-600">
                Liên hệ ngay để được tư vấn giải pháp điện mặt trời phù hợp nhất cho ngôi nhà của bạn
              </p>
            </div>
          </div>
          <a
            href="tel:0988446113"
            className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Gọi 0988 446 113
          </a>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl p-4 border border-border">
          <p className="text-xs font-medium text-gray-700 mb-3">Kết nối với chúng tôi</p>
          <div className="flex items-center gap-3">
            <a
              href="https://zalo.me/0988446113"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-500 text-white text-center py-2.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Zalo
            </a>
            <a
              href="mailto:epcvina@hotmail.com"
              className="flex-1 bg-red-500 text-white text-center py-2.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href="https://maps.google.com/?q=Phòng+315+Khu+TM+Chung+cư+HVQP+Nguyễn+Văn+Huyên+Tây+Hồ+Hà+Nội"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white text-center py-2.5 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
