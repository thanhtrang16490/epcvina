import { useState } from 'react';
import { CheckCircle, Shield, Award, Users, Phone } from 'lucide-react';
import MicroNavigation from './MicroNavigation';
import HeroSection from './HeroSection';
import CalculatorSection from './CalculatorSection';
import VideoShowcaseSection from './VideoShowcaseSection';
import SocialProofSection from './SocialProofSection';
import ProjectsSection from './ProjectsSection';
import BeforeAfterBillsSection from './BeforeAfterBillsSection';
import TestimonialsSection from './TestimonialsSection';
import PaymentOptionsSection from './PaymentOptionsSection';
import FAQSection from './FAQSection';
import ExitIntentPopup from './ExitIntentPopup';

export default function DienMatTroiGiaDinh() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_submit', {
        event_category: 'conversion',
        event_label: formData.phone,
      });
    }
    alert('Đã nhận thông tin! Chúng tôi sẽ gọi lại trong 24h.');
  };

  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <MicroNavigation />
      <HeroSection />
      <SocialProofSection />
      <CalculatorSection onSubmit={(data) => setFormData(prev => ({ ...prev, message: `Hộ gia đình cần lắp điện mặt trời. Hệ đề xuất: ${data.system_size} kWp` }))} />
      <VideoShowcaseSection />
      <BeforeAfterBillsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <PaymentOptionsSection />

      {/* Why EPCVINA */}
      <section id="bao-hanh" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tại Sao Chọn EPCVINA</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { icon: Shield, title: 'Bảo hành 10 năm', desc: 'Toàn bộ hệ thống' },
              { icon: Award, title: '13+ dự án', desc: 'Đã triển khai thành công' },
              { icon: Users, title: '150+ kWp', desc: 'Công suất lắp đặt' },
              { icon: CheckCircle, title: 'Thiết bị chính hãng', desc: 'Longi, Aiko, Deye' },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <item.icon className="w-12 h-12 mx-auto text-yellow-400" />
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Brands */}
      <section id="bang-gia" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Thiết Bị Chính Hãng</h2>
            <p className="text-xl text-slate-600">Chỉ sử dụng thương hiệu top đầu thế giới</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'LONGi Solar', desc: 'TOP 1 toàn cầu', color: 'from-red-50 to-red-100' },
              { name: 'AIKO Solar', desc: 'Công nghệ ABC', color: 'from-blue-50 to-blue-100' },
              { name: 'DEYE', desc: 'Biến tần & Hybrid', color: 'from-green-50 to-green-100' },
              { name: 'SAJ', desc: 'Biến tần hàng đầu', color: 'from-purple-50 to-purple-100' },
            ].map((brand, i) => (
              <div key={i} className={`bg-gradient-to-br ${brand.color} rounded-xl p-6 text-center border border-slate-200`}>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{brand.name}</h3>
                <p className="text-sm text-slate-600">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section id="contact" className="py-16 sm:py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">Sẵn Sàng Bắt Đầu?</h2>
              <p className="text-xl opacity-90">Gửi thông tin, nhận tư vấn & báo giá chi tiết trong 24h</p>
              <div className="space-y-3">
                {['Khảo sát & thiết kế miễn phí', 'Báo giá chi tiết từng hạng mục', 'Không phát sinh chi phí', 'Hỗ trợ kỹ thuật trọn đời'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-all min-h-[44px]">
                <Phone className="w-5 h-5" />
                Gọi Ngay: 0988 446 113
              </a>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Gửi Thông Tin Tư Vấn</h3>
              {[
                { label: 'Họ tên', name: 'name', type: 'text', required: true },
                { label: 'Số điện thoại', name: 'phone', type: 'tel', required: true },
                { label: 'Địa chỉ', name: 'address', type: 'text', required: false },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
                  <input
                    type={type}
                    name={name}
                    required={required}
                    value={formData[name as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-2">Nhu cầu / Ghi chú</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="VD: Lắp hệ hybrid 10kWp, có pin lưu trữ..."
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg transition-all min-h-[44px]">
                Gửi Yêu Cầu Tư Vấn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
}
