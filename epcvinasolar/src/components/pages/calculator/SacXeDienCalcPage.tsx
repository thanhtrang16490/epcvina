import { useState } from 'react';
import { ArrowLeft, ArrowRight, Car, CheckCircle, Lightning, ShieldCheck } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

export default function SacXeDienCalcPage() {
  const [batterySize, setBatterySize] = useState(60);
  const [chargePerWeek, setChargePerWeek] = useState(2);
  const electricityPrice = 3500;
  const costPerCharge = (batterySize * electricityPrice) / 1000000;
  const weeklyCost = costPerCharge * chargePerWeek;
  const monthlyCost = weeklyCost * 4;
  const solarSaving = monthlyCost * 0.6;

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
                <Car className="h-4 w-4" />
                Tính chi phí sạc xe
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
                Ước tính chi phí sạc xe điện
                <span className="block text-orange-300">so sánh lưới và solar</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Nhập dung lượng pin và tần suất sạc để xem mức chi phí hàng tháng và mức tiết kiệm khi kết hợp điện mặt trời.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: <Car className="h-4 w-4" weight="bold" />, label: 'Mỗi lần sạc', value: `${costPerCharge.toFixed(0)} đ` },
                  { icon: <Lightning className="h-4 w-4" weight="bold" />, label: 'Hàng tháng', value: `${monthlyCost.toFixed(0)} đ` },
                  { icon: <ShieldCheck className="h-4 w-4" weight="bold" />, label: 'Tiết kiệm', value: `${solarSaving.toFixed(0)} đ` },
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
                <h2 className="mt-1 text-xl font-bold">Nhập thông số xe</h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Dung lượng pin xe (kWh)</label>
                    <input
                      type="number"
                      value={batterySize}
                      onChange={(e) => setBatterySize(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Số lần sạc/tuần</label>
                    <input
                      type="number"
                      value={chargePerWeek}
                      onChange={(e) => setChargePerWeek(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                    />
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
              <h3 className="text-lg font-bold text-slate-950">Chi phí hàng tháng</h3>
              <div className="mt-4 rounded-2xl border border-[#ffd7be] bg-[#fff4e8] px-4 py-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Chi phí mỗi lần sạc</span>
                    <span className="text-base font-bold text-slate-950">{costPerCharge.toFixed(0)} đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Chi phí/tháng (sạc thường)</span>
                    <span className="text-base font-bold text-slate-950">{monthlyCost.toFixed(0)} đ</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#ffd7be] pt-3">
                    <span className="text-sm font-semibold text-slate-700">Tiết kiệm với solar</span>
                    <span className="text-xl font-black text-[#d0202a]">{solarSaving.toFixed(0)} đ/tháng</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Gợi ý nhanh</p>
              <div className="mt-4 space-y-3">
                {[
                  'Kết hợp solar giúp giảm đáng kể chi phí sạc.',
                  'Tần suất sạc cao thì phương án solar càng đáng cân nhắc.',
                  'Bài toán thực tế nên chốt theo loại xe và thói quen đi lại.',
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
