'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const NEEDS = [
  { value: 'solar', label: 'Solar Home' },
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
    // TODO: wire to real API / Supabase / Zalo OA
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section id="tu-van" className="py-14 sm:py-20 bg-gradient-to-br from-[#7C2D12] via-[#9A3412] to-[#C2410C]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-200 mb-3">
            ĐĂNG KÝ TƯ VẤN MIỄN PHÍ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Nhận Báo Giá <span className="text-amber-300">Sơ Bộ</span> Ngay Hôm Nay
          </h2>
          <p className="mt-3 text-orange-100 text-sm sm:text-base max-w-xl mx-auto">
            Điền thông tin bên dưới — đội kỹ sư EPCVINA Solar sẽ liên hệ tư vấn và khảo sát miễn phí trong 24h.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <CheckCircle className="h-14 w-14 text-green-500" />
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Nhu cầu <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
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
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors duration-200 shadow-lg shadow-orange-200 motion-reduce:transition-none"
              >
                {loading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? 'Đang gửi...' : 'Đăng ký tư vấn miễn phí'}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-2">
                Thông tin của bạn được bảo mật tuyệt đối. Không spam.
              </p>
            </form>
          )}
        </div>

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
