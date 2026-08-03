import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, CheckCircle, Shield, Medal, Users, Phone } from '@phosphor-icons/react';
import MicroNavigation from './MicroNavigation';
import HeroSection from './HeroSection';
import CalculatorSection from './CalculatorSection';
import VideoShowcaseSection from './VideoShowcaseSection';
import SocialProofSection from './SocialProofSection';
import BeforeAfterBillsSection from './BeforeAfterBillsSection';
import TestimonialsSection from './TestimonialsSection';
import PaymentOptionsSection from './PaymentOptionsSection';
import FAQSection from './FAQSection';
import ExitIntentPopup from './ExitIntentPopup';
import { redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';

const whyEpcvina = [
  { icon: Shield, title: 'Bảo hành rõ điều kiện', desc: 'Thiết bị chính hãng, hồ sơ bàn giao minh bạch' },
  { icon: Medal, title: '13+ công trình nhà dân', desc: 'Có ảnh thực tế và hóa đơn đối chiếu sau lắp' },
  { icon: Users, title: '15 năm kinh nghiệm cơ điện', desc: 'Tư vấn theo phụ tải thật, không ép cấu hình' },
  { icon: CheckCircle, title: 'Khảo sát trước khi báo giá', desc: 'Kiểm tra mái, hướng nắng và nhu cầu dùng đêm' },
];

const surveyFlow = [
  'Kiểm tra hóa đơn và thói quen dùng điện ngày / đêm',
  'Xem mái, hướng nắng, bóng che và vị trí đặt inverter',
  'Đề xuất On-Grid hoặc Hybrid theo nhu cầu thật',
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
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formFields = [
    { label: 'Họ tên', name: 'name', type: 'text', required: true, placeholder: 'VD: Anh Minh...', autoComplete: 'name' },
    { label: 'Số điện thoại', name: 'phone', type: 'tel', required: true, placeholder: 'VD: 0988 446 113...', autoComplete: 'tel', inputMode: 'tel' },
    { label: 'Địa chỉ', name: 'address', type: 'text', required: false, placeholder: 'VD: Hà Đông, Hà Nội...', autoComplete: 'street-address' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await submitCrmLead({ ...formData, source_form: 'family_landing_contact' });
      trackEvent('lead_submit', { event_category: 'conversion' });
      redirectToThankYou('family_landing_contact');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Chưa gửi được thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <MicroNavigation />
      <HeroSection />
      <SocialProofSection />
      <CalculatorSection
        onSubmit={async (data) => submitCrmLead({
          name: data.name,
          phone: data.phone,
          message: `Hộ gia đình cần lắp điện mặt trời. Hệ đề xuất: ${data.system_size} kWp`,
          source_form: 'family_inline_calculator',
          system_size_kw: Number(data.system_size),
          calculator_result: { combo_index: data.combo_index },
        })}
      />
      <div className="hidden md:block">
        <VideoShowcaseSection />
      </div>
      <BeforeAfterBillsSection />
      <div className="hidden md:block">
        <TestimonialsSection />
      </div>
      <div className="hidden md:block">
        <PaymentOptionsSection />
      </div>

      {/* Why EPCVINA */}
      <section id="bao-hanh" className="scroll-mt-24 bg-slate-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,.55)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-0 lg:grid-cols-[0.86fr_1.14fr]">
              <div className="bg-[radial-gradient(circle_at_20%_10%,rgba(245,130,32,.28),transparent_34%),linear-gradient(135deg,#14532D_0%,#166534_55%,#F58220_150%)] p-5 text-white sm:p-7 lg:p-8">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[.12em] text-orange-100">Bảo hành & năng lực</p>
                <h2 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Tại sao nên để EPCVINA khảo sát trước?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/82 sm:text-base">
                  Điện mặt trời gia đình cần đúng mái, đúng tải và đúng thói quen dùng điện. EPCVINA kiểm tra thực tế trước khi chốt chi phí.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[
                    { value: '10 năm', label: 'Bảo hành' },
                    { value: '13+', label: 'Dự án' },
                    { value: '150+ kWp', label: 'Đã lắp' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 backdrop-blur">
                      <p className="text-[15px] font-black sm:text-lg">{item.value}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.08em] text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {whyEpcvina.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                        <item.icon className="h-5 w-5" weight="duotone" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-black leading-snug text-slate-950 sm:text-base">{item.title}</h3>
                        <p className="mt-1 text-[12px] leading-relaxed text-slate-600 sm:text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-sm font-black text-slate-950">Sau khi anh/chị gửi thông tin, EPCVINA sẽ làm 3 việc</p>
                  <div className="mt-3 grid gap-2">
                    {surveyFlow.map((item, i) => (
                      <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white px-3 py-2.5 text-sm text-slate-700">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-[11px] font-black text-white">{i + 1}</span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <a
                    href="#contact"
                    onClick={() => trackEvent('why_epcvina_survey_click', { source: 'family_landing' })}
	                    className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-600 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    Nhận khảo sát miễn phí
                  </a>
                  <a
                    href="tel:0988446113"
                    onClick={() => trackEvent('why_epcvina_call_click', { source: 'family_landing' })}
	                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-800 transition-colors hover:bg-emerald-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    aria-label="Gọi EPCVINA 0988 446 113"
                  >
                    <Phone className="h-4 w-4" weight="bold" />
                    Gọi 0988 446 113
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nhận lịch kỹ sư gọi lại và sàng lọc phương án</h2>
              <p className="text-lg text-white/85">Gửi thông tin để EPCVINA kiểm tra sơ bộ hóa đơn, khu vực lắp đặt và nhu cầu dùng điện trước khi hẹn khảo sát mái.</p>
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
	                className="inline-flex items-center gap-2 bg-white text-[#C2410C] font-bold px-7 py-3.5 rounded-xl text-base hover:bg-slate-50 active:scale-[0.98] transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#414042]"
              >
                <Phone className="w-5 h-5" weight="bold" />
                Gọi Ngay: 0988 446 113
              </a>
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.08] p-4 text-sm text-white/82 sm:grid-cols-3">
                <span><strong className="text-white">Bước 1:</strong> gọi xác nhận nhu cầu</span>
                <span><strong className="text-white">Bước 2:</strong> kiểm hóa đơn và mái</span>
                <span><strong className="text-white">Bước 3:</strong> gửi cấu hình sơ bộ</span>
              </div>
            </motion.div>

	            <motion.form
	              onSubmit={handleSubmit}
	              className="bg-white rounded-2xl p-7 space-y-4 text-slate-900 shadow-xl shadow-black/10"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
	              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
	                <div className="mb-2 flex items-center gap-2 text-emerald-800">
	                  <CheckCircle className="h-5 w-5" weight="fill" />
	                  <p className="text-sm font-black">Dữ liệu tính toán bởi EPCVINA Solar</p>
	                </div>
	                <div className="grid gap-2 text-[12px] leading-relaxed text-slate-700 sm:grid-cols-3">
	                  <span>15 năm kinh nghiệm cơ điện</span>
	                  <span>13+ công trình nhà dân</span>
	                  <span>Bảo hành thiết bị rõ điều kiện</span>
	                </div>
	                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold">
	                  <a href="#calculator" className="text-orange-700 underline-offset-2 hover:underline">Phương pháp tính ở phần kết quả</a>
	                  <a href="/chinh-sach-bao-mat" className="text-emerald-800 underline-offset-2 hover:underline">Chính sách bảo mật</a>
	                </div>
	              </div>
	              <h3 className="text-xl font-bold mb-1">Gửi thông tin khảo sát miễn phí</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500">Chỉ cần tên và số điện thoại. Địa chỉ giúp kỹ sư kiểm tra vùng nắng nhanh hơn.</p>
              {formSubmitted && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-emerald-800 font-semibold text-sm">✓ Đã nhận thông tin!</p>
                  <p className="text-emerald-700 text-xs mt-1">Chúng tôi sẽ gọi lại tư vấn trong 24h.</p>
                </div>
              )}
              {formError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{formError}</div>}
	              {formFields.map(({ label, name, type, required, placeholder, autoComplete, inputMode }) => (
	                <div key={name}>
	                  <label htmlFor={`contact-${name}`} className="block text-sm font-medium text-slate-700 mb-1.5">
	                    {label} {required && <span className="text-red-500">*</span>}
	                  </label>
	                  <input
	                    id={`contact-${name}`}
	                    type={type}
	                    name={name}
	                    required={required}
	                    autoComplete={autoComplete}
	                    inputMode={inputMode as React.HTMLAttributes<HTMLInputElement>['inputMode']}
	                    value={formData[name as keyof typeof formData]}
	                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
	                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
	                    placeholder={placeholder}
	                  />
	                </div>
	              ))}
	              <div>
	                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1.5">Nhu cầu / Ghi chú</label>
	                <textarea
	                  id="contact-message"
	                  name="message"
	                  rows={3}
	                  autoComplete="off"
	                  value={formData.message}
	                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
	                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
	                  placeholder="VD: Hóa đơn khoảng 3 triệu/tháng, muốn dùng điện khi mất điện..."
	                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-base transition-colors min-h-[44px]"
              >
                {submitting ? 'Đang gửi...' : 'Nhận lịch khảo sát miễn phí'}
              </button>
              <p className="text-[11.5px] leading-relaxed text-slate-500">
                Thông tin chỉ dùng để tư vấn điện mặt trời EPCVINA. Anh/chị có thể yêu cầu không liên hệ lại bất cứ lúc nào.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      <ExitIntentPopup />

	      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-18px_44px_-30px_rgba(15,23,42,.45)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <a
            href="#calculator"
            onClick={() => trackEvent('mobile_sticky_calculator_click', { source: 'family_landing' })}
	            className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 text-[13px] font-black text-white transition-colors hover:bg-orange-600 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="Tính chi phí điện mặt trời"
          >
            <Calculator className="h-4 w-4" weight="bold" />
            Tính chi phí
          </a>
          <a
            href="tel:0988446113"
            onClick={() => trackEvent('mobile_sticky_call_click', { source: 'family_landing' })}
	            className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#15803D] px-3 text-[13px] font-black text-white transition-colors hover:bg-emerald-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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
