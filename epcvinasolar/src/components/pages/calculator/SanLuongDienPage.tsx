import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Lightning, Sun } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

export default function SanLuongDienPage() {
  const [systemSize, setSystemSize] = useState(5);
  const [location, setLocation] = useState('hanoi');
  const sunHours: Record<string, number> = { hanoi: 4.2, hochiminh: 4.8, danang: 4.5, haiphong: 4.0, hue: 4.3 };
  const monthlyProduction = Math.round(systemSize * (sunHours[location] || 4.2) * 30 * 0.8);
  const yearlyProduction = monthlyProduction * 12;

  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-[#fff8f1] text-slate-900">
      <HeaderBar />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#1b2433] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,131,31,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(208,32,42,0.18),transparent_36%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-12">
          <a href="/calculator" className="inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Quay lại công cụ
          </a>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
                <Sun className="h-4 w-4" />
                Tính sản lượng điện
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
                Ước tính sản lượng điện
                <span className="block text-orange-300">theo công suất và khu vực</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Chọn công suất và vị trí địa lý để xem sản lượng theo tháng và theo năm theo mức bức xạ trung bình.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: <Sun className="h-4 w-4" weight="bold" />, label: 'Công suất', value: `${systemSize} kWp` },
                  { icon: <Lightning className="h-4 w-4" weight="bold" />, label: 'Tháng', value: `${monthlyProduction.toLocaleString('vi-VN')} kWh` },
                  { icon: <CheckCircle className="h-4 w-4" weight="bold" />, label: 'Năm', value: `${yearlyProduction.toLocaleString('vi-VN')} kWh` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-orange-200">{item.icon}</div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-5">
              <div className="rounded-[24px] bg-white px-5 py-5 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.08)] md:px-6 md:py-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Bảng tính nhanh</p>
                <h2 className="mt-1 text-xl font-bold">Nhập thông số hệ thống</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Công suất hệ thống (kWp)</label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      value={systemSize}
                      onChange={(e) => setSystemSize(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#f5831f]"
                    />
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>3 kWp</span>
                      <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-lg font-black text-[#d0202a]">{systemSize} kWp</span>
                      <span>20 kWp</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Khu vực</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                    >
                      <option value="hanoi">Hà Nội</option>
                      <option value="hochiminh">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                      <option value="hue">Huế</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/tu-van-giai-phap" className="inline-flex items-center gap-2 rounded-full bg-[#d0202a] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(208,32,42,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                    Nhận phương án
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
                    <CheckCircle className="h-4 w-4 text-[#f5831f]" weight="fill" />
                    Báo giá tham khảo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <h3 className="text-lg font-bold text-slate-950">Sản lượng ước tính</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-5 text-center">
                  <p className="text-sm text-slate-600">Hàng tháng</p>
                  <p className="mt-2 text-3xl font-black text-[#d0202a]">{monthlyProduction.toLocaleString('vi-VN')}</p>
                  <p className="text-sm text-slate-500">kWh/tháng</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-5 text-center">
                  <p className="text-sm text-slate-600">Hàng năm</p>
                  <p className="mt-2 text-3xl font-black text-[#d0202a]">{yearlyProduction.toLocaleString('vi-VN')}</p>
                  <p className="text-sm text-slate-500">kWh/năm</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Gợi ý nhanh</p>
              <div className="mt-4 space-y-3">
                {[
                  'Khu vực nắng tốt sẽ cho sản lượng cao hơn.',
                  'Công suất hệ thống càng lớn, sản lượng càng tăng tuyến tính.',
                  'Nên đối chiếu với điện tiêu thụ thực tế để ra phương án sát hơn.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f5831f]" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
