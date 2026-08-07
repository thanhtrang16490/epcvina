'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { PaperPlaneRight, CheckCircle } from '@phosphor-icons/react';
import { redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';

const NEEDS = [
  { value: 'solar', label: 'Solar House' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'bess', label: 'BESS (Lưu trữ)' },
  { value: 'ev', label: 'EV Charger' },
  { value: 'factory', label: 'Nhà xưởng' },
];

export default function CTASection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    bill: '',
    need: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Build Zalo message from form data
    const msg = [
      'Xin chào EPCVINA, tôi cần tư vấn:',
      `• Họ tên: ${form.name}`,
      `• SĐT: ${form.phone}`,
      `• Địa chỉ: ${form.address || 'N/A'}`,
      `• Hóa đơn điện: ${form.bill || 'N/A'}`,
      `• Nhu cầu: ${form.need || 'N/A'}`,
    ].join('\n');
    const zaloUrl = `https://zalo.me/0988446113?text=${encodeURIComponent(msg)}`;
    try {
      await submitCrmLead({
        name: form.name,
        phone: form.phone,
        address: form.address,
        monthly_bill: form.bill,
        system_type: form.need,
        message: msg,
        source_form: 'home_cta',
      });
      setSubmitted(true);
      redirectToThankYou('home_cta');
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      setSubmitted(true);
      window.open(zaloUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="tu-van"
      data-header-theme="dark"
      className="py-14 sm:py-20 bg-gradient-to-br from-[#7F1D1D] via-[#991B1B] to-[#DC2626]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-200 mb-3">
            ĐĂNG KÝ TƯ VẤN MIỄN PHÍ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Xem chi tiết <span className="text-amber-300">Sơ Bộ</span> Ngay Hôm Nay
          </h2>
          <p className="mt-3 text-orange-100 text-sm sm:text-base max-w-xl mx-auto">
            Điền thông tin bên dưới — đội kỹ sư EPCVINA Solar sẽ liên hệ tư vấn và khảo sát miễn phí trong 24h.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <CheckCircle className="h-14 w-14 text-green-500" weight="fill" />
              <h3 className="text-xl font-bold text-gray-900">Đã nhận thông tin!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ trong vòng 24 giờ để tư vấn và sắp xếp khảo sát miễn phí.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Họ tên + SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="consultation-need" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="0988 446 113"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Row 2: Địa chỉ lắp đặt */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Địa chỉ lắp đặt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                />
              </div>

              {/* Row 3: Tiền điện + Nhu cầu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tiền điện trung bình/tháng
                  </label>
                  <input
                    type="text"
                    name="bill"
                    value={form.bill}
                    onChange={handleChange}
                    placeholder="VD: 2.000.000 đ"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Nhu cầu <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="consultation-need"
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition bg-white"
                  >
                    <option value="">Chọn nhu cầu...</option>
                    {NEEDS.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#DC2626] hover:bg-[#B01A22] disabled:opacity-60 text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-colors duration-200 shadow-lg shadow-red-200"
              >
                {loading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <PaperPlaneRight className="h-4 w-4" weight="bold" />
                )}
                {loading ? 'Đang gửi...' : 'Đăng ký tư vấn miễn phí'}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-2">
                Thông tin của bạn được bảo mật tuyệt đối. Không spam.
              </p>
            </form>
          )}
        </motion.div>

        {/* Or call directly */}
        <p className="text-center text-orange-200 text-sm mt-6">
          Hoặc gọi thẳng:{' '}
          <a href="tel:0988446113" className="text-white font-bold hover:text-amber-300 transition-colors">
            0988 446 113
          </a>
          {' '}(Mrs. Giang)
        </p>
      </div>
    </section>
  );
}
'use client';
