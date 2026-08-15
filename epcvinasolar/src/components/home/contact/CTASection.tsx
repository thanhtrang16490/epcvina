'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { PaperPlaneRight, CheckCircle } from '@phosphor-icons/react';
import { redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';
import { getLocaleFromPathname, messages } from '../../../i18n/messages';

const NEEDS_BY_LOCALE: Record<string, { value: string; label: string }[]> = {
  vi: [
    { value: 'solar', label: 'Solar House' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'bess', label: 'BESS (Lưu trữ)' },
    { value: 'ev', label: 'EV Charger' },
    { value: 'factory', label: 'Nhà xưởng' },
  ],
  en: [
    { value: 'solar', label: 'Solar Home' },
    { value: 'hybrid', label: 'Hybrid BESS' },
    { value: 'bess', label: 'Battery storage' },
    { value: 'ev', label: 'EV Charger' },
    { value: 'factory', label: 'Industrial site' },
  ],
  zh: [
    { value: 'solar', label: '住宅太阳能' },
    { value: 'hybrid', label: '混合储能' },
    { value: 'bess', label: '储能电池' },
    { value: 'ev', label: '电动车充电' },
    { value: 'factory', label: '工厂屋顶' },
  ],
  ja: [
    { value: 'solar', label: '住宅用太陽光' },
    { value: 'hybrid', label: 'ハイブリッド蓄電' },
    { value: 'bess', label: '蓄電池' },
    { value: 'ev', label: 'EV充電器' },
    { value: 'factory', label: '工場・倉庫' },
  ],
  ko: [
    { value: 'solar', label: '주택용 태양광' },
    { value: 'hybrid', label: '하이브리드 BESS' },
    { value: 'bess', label: '에너지 저장장치' },
    { value: 'ev', label: 'EV 충전기' },
    { value: 'factory', label: '공장 지붕' },
  ],
};

export default function CTASection({ pathname = '/' }: { pathname?: string }) {
  const locale = getLocaleFromPathname(pathname);
  const t = messages[locale]?.home ?? messages.vi.home;
  const needs = NEEDS_BY_LOCALE[locale] ?? NEEDS_BY_LOCALE.vi;
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
      locale === 'vi' ? 'Xin chào EPCVINA, tôi cần tư vấn:' : 'Hello EPCVINA, I need consultation:',
      `${locale === 'vi' ? '• Họ tên' : '• Name'}: ${form.name}`,
      `${locale === 'vi' ? '• SĐT' : '• Phone'}: ${form.phone}`,
      `${locale === 'vi' ? '• Địa chỉ' : '• Address'}: ${form.address || 'N/A'}`,
      `${locale === 'vi' ? '• Hóa đơn điện' : '• Monthly bill'}: ${form.bill || 'N/A'}`,
      `${locale === 'vi' ? '• Nhu cầu' : '• Need'}: ${form.need || 'N/A'}`,
    ].join('\n');
    const zaloUrl = `https://zalo.me/0368927332?text=${encodeURIComponent(msg)}`;
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
            {t.ctaLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {t.ctaTitle}
          </h2>
          <p className="mt-3 text-orange-100 text-sm sm:text-base max-w-xl mx-auto">
            {t.ctaLead}
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
              <h3 className="text-xl font-bold text-gray-900">{t.ctaSuccessTitle}</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                {t.ctaSuccessLead}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Họ tên + SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="consultation-need" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    {t.ctaName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={locale === 'vi' ? 'Nguyễn Văn A' : locale === 'en' ? 'John Smith' : locale === 'zh' ? '张伟' : locale === 'ja' ? '山田 太郎' : '김민수'}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    {t.ctaPhone} <span className="text-red-500">*</span>
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
                    {t.ctaAddress} <span className="text-red-500">*</span>
                  </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder={locale === 'vi' ? 'Số nhà, đường, phường/xã, tỉnh/thành phố' : locale === 'en' ? 'House number, street, ward, city/province' : locale === 'zh' ? '门牌号、街道、坊/社、城市/省' : locale === 'ja' ? '番地、通り、区/町、市/省' : '번지, 도로명, 동/읍, 시/도'}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                />
              </div>

              {/* Row 3: Tiền điện + Nhu cầu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    {t.ctaBill}
                  </label>
                  <input
                    type="text"
                    name="bill"
                    value={form.bill}
                    onChange={handleChange}
                    placeholder={locale === 'vi' ? 'VD: 2.000.000 đ' : locale === 'en' ? 'e.g. 2,000,000 VND' : locale === 'zh' ? '例如：2,000,000 越盾' : locale === 'ja' ? '例：2,000,000 VND' : '예: 2,000,000 VND'}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    {t.ctaNeed} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="consultation-need"
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition bg-white"
                  >
                    <option value="">{t.ctaNeedPlaceholder}</option>
                    {needs.map((n) => (
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
                {loading ? t.ctaSending : t.ctaSubmit}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-2">
                {locale === 'vi'
                  ? 'Thông tin của bạn được bảo mật tuyệt đối. Không spam.'
                  : locale === 'en'
                    ? 'Your information is fully protected. No spam.'
                    : locale === 'zh'
                      ? '您的信息将被严格保密，不会收到垃圾信息。'
                      : locale === 'ja'
                        ? 'お客様の情報は厳重に保護され、スパム送信はありません。'
                        : '고객 정보는 철저히 보호되며, 스팸은 없습니다.'}
              </p>
            </form>
          )}
        </motion.div>

        {/* Or call directly */}
        <p className="text-center text-orange-200 text-sm mt-6">
          {locale === 'vi' ? 'Hoặc gọi thẳng:' : 'Or call directly:'}{' '}
          <a href="tel:0988446113" className="text-white font-bold hover:text-amber-300 transition-colors">
            0988 446 113
          </a>
          {' '}{locale === 'vi' ? '(Ms. Giang)' : '(Ms Giang)'}
        </p>
      </div>
    </section>
  );
}
