import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, CheckCircle, Shield, Medal, Users, Phone } from '@phosphor-icons/react';
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

const whyEpcvina = [
  { icon: Shield, title: 'Bảo hành 10 năm', desc: 'Toàn bộ hệ thống' },
  { icon: Medal, title: '13+ dự án', desc: 'Đã triển khai thành công' },
  { icon: Users, title: '150+ kWp', desc: 'Công suất lắp đặt' },
  { icon: CheckCircle, title: 'Thiết bị chính hãng', desc: 'Longi, Aiko, Deye' },
];

const brands = [
  { name: 'LONGi Solar', desc: 'TOP 1 tấm pin toàn cầu', bg: 'bg-red-50', border: 'border-red-100' },
  { name: 'AIKO Solar', desc: 'Công nghệ ABC hiệu suất cao', bg: 'bg-blue-50', border: 'border-blue-100' },
  { name: 'Canadian Solar', desc: 'TOP 5 thế giới', bg: 'bg-sky-50', border: 'border-sky-100' },
  { name: 'Sharp Solar', desc: 'Thương hiệu Nhật Bản', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  { name: 'Sungrow', desc: 'Inverter số 1 thế giới', bg: 'bg-amber-50', border: 'border-amber-100' },
  { name: 'DEYE', desc: 'Biến tần Hybrid hàng đầu', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { name: 'SAJ', desc: 'Biến tần On-Grid', bg: 'bg-violet-50', border: 'border-violet-100' },
  { name: 'Growatt', desc: 'Inverter dân dụng', bg: 'bg-orange-50', border: 'border-orange-100' },
  { name: 'CFE', desc: 'Pin lưu trữ năng lượng', bg: 'bg-lime-50', border: 'border-lime-100' },
];

const trackEvent = (eventName: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export default function DienMatTroiGiaDinh() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_submit', {
        event_category: 'conversion',
        event_label: formData.phone,
      });
    }
    setFormData({ name: '', phone: '', address: '', message: '' });
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <MicroNavigation />
      <HeroSection />
      <SocialProofSection />
      <CalculatorSection
        onSubmit={(data) => setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          phone: data.phone || prev.phone,
          message: `Hộ gia đình cần lắp điện mặt trời. Hệ đề xuất: ${data.system_size} kWp`,
        }))}
      />
      <div className="hidden md:block">
        <VideoShowcaseSection />
      </div>
      <BeforeAfterBillsSection />
      <ProjectsSection />
      <div className="hidden md:block">
        <TestimonialsSection />
      </div>
      <div className="hidden md:block">
        <PaymentOptionsSection />
      </div>

      {/* Why EPCVINA */}
      <section id="bao-hanh" className="py-16 sm:py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tại Sao Chọn EPCVINA</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {whyEpcvina.map((item, i) => (
              <motion.div
                key={i}
                className="text-center space-y-2.5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <item.icon className="w-10 h-10 mx-auto text-amber-300" weight="duotone" />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Brands */}
      <section id="bang-gia" className="hidden py-16 bg-white md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Thiết Bị Chính Hãng</h2>
            <p className="text-lg text-slate-600">Chỉ sử dụng thương hiệu top đầu thế giới</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                className={`${brand.bg} ${brand.border} border rounded-2xl p-5 text-center`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <h3 className="text-lg font-bold text-slate-900 mb-1">{brand.name}</h3>
                <p className="text-xs text-slate-500">{brand.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section id="contact" className="py-16 sm:py-20 bg-[radial-gradient(circle_at_18%_12%,rgba(255,176,32,.28),transparent_28%),linear-gradient(135deg,#414042_0%,#2F3035_48%,#F58220_150%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-black uppercase tracking-[.1em] text-orange-100">
                Khảo sát 0đ
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nhận phương án solar phù hợp cho nhà anh/chị</h2>
              <p className="text-lg text-white/85">Gửi thông tin, EPCVINA gọi lại để kiểm tra hóa đơn, mái nhà và nhu cầu dùng điện ban đêm.</p>
              <div className="space-y-2.5">
                {['Không thu phí khảo sát ban đầu', 'Tư vấn On-Grid hay Hybrid theo nhu cầu thật', 'Báo giá theo từng hạng mục thiết bị', 'Không ép lắp đặt khi phương án chưa phù hợp'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" weight="fill" />
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="tel:0988446113"
                className="inline-flex items-center gap-2 bg-white text-[#C2410C] font-bold px-7 py-3.5 rounded-xl text-base hover:bg-slate-50 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Phone className="w-5 h-5" weight="bold" />
                Gọi Ngay: 0988 446 113
              </a>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-7 space-y-4 text-slate-900 shadow-xl shadow-black/10"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <h3 className="text-xl font-bold mb-1">Gửi thông tin khảo sát miễn phí</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500">Chỉ cần tên và số điện thoại. Địa chỉ giúp kỹ sư kiểm tra vùng nắng nhanh hơn.</p>
              {formSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-emerald-800 font-semibold text-sm">✓ Đã nhận thông tin!</p>
                  <p className="text-emerald-700 text-xs mt-1">Chúng tôi sẽ gọi lại tư vấn trong 24h.</p>
                </div>
              )}
              {[
                { label: 'Họ tên', name: 'name', type: 'text', required: true, placeholder: 'VD: Anh Minh' },
                { label: 'Số điện thoại', name: 'phone', type: 'tel', required: true, placeholder: 'VD: 0988 446 113' },
                { label: 'Địa chỉ', name: 'address', type: 'text', required: false, placeholder: 'VD: Hà Đông, Hà Nội' },
              ].map(({ label, name, type, required, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    name={name}
                    required={required}
                    value={formData[name as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nhu cầu / Ghi chú</label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                  placeholder="VD: Hóa đơn khoảng 3 triệu/tháng, muốn dùng điện khi mất điện"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-base transition-colors min-h-[44px]"
              >
                Nhận lịch khảo sát miễn phí
              </button>
              <p className="text-[11.5px] leading-relaxed text-slate-500">
                Thông tin chỉ dùng để tư vấn điện mặt trời EPCVINA. Anh/chị có thể yêu cầu không liên hệ lại bất cứ lúc nào.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      <ExitIntentPopup />

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-18px_44px_-30px_rgba(15,23,42,.45)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <a
            href="#calculator"
            onClick={() => trackEvent('mobile_sticky_calculator_click', { source: 'family_landing' })}
            className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 text-[13px] font-black text-white active:scale-[0.98]"
            aria-label="Tính chi phí điện mặt trời"
          >
            <Calculator className="h-4 w-4" weight="bold" />
            Tính chi phí
          </a>
          <a
            href="tel:0988446113"
            onClick={() => trackEvent('mobile_sticky_call_click', { source: 'family_landing' })}
            className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#15803D] px-3 text-[13px] font-black text-white active:scale-[0.98]"
            aria-label="Gọi hotline 0988 446 113"
          >
            <Phone className="h-4 w-4" weight="bold" />
            Gọi EPCVINA
          </a>
        </div>
      </div>
    </div>
  );
}
