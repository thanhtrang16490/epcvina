import { useState } from 'react';
import { ArrowLeft, ArrowRight, CurrencyDollar, Lightning, ShieldCheck, SunDim } from '@phosphor-icons/react';
import CalculatorPageShell from './CalculatorPageShell';

export default function ChiPhiDauTuPage() {
  const [systemSize, setSystemSize] = useState(5);
  const [systemType, setSystemType] = useState('on-grid');
  const costPerKwp = systemType === 'hybrid' ? 25 : 12;
  const totalCost = systemSize * costPerKwp;
  const batteryCost = systemType === 'hybrid' ? systemSize * 5 : 0;
  const grandTotal = totalCost + batteryCost;
  const paybackYears = systemType === 'hybrid' ? 4.8 : 3.6;
  const estimatedSaving = Math.round(systemSize * (systemType === 'hybrid' ? 1.65 : 1.35));

  return (
    <CalculatorPageShell
      title="Ước tính chi phí điện mặt trời nhanh, rõ, dễ so sánh."
      description="Chọn công suất và loại hệ thống để xem ngay mức đầu tư tham khảo, chi phí pin lưu trữ và tổng vốn dự kiến."
      stats={[
        { label: 'kWp phù hợp', value: `${systemSize.toFixed(0)} kWp` },
        { label: 'Hoàn vốn', value: `${paybackYears.toFixed(1)} năm` },
        { label: 'Tiết kiệm/tháng', value: `${estimatedSaving.toLocaleString('vi-VN')} tr` },
      ]}
      sidebar={
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Bảng tính nhanh</p>
          <div className="mt-4 rounded-[24px] bg-white px-5 py-5 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.08)] md:px-6 md:py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Nhập cấu hình</p>
                <h2 className="mt-1 text-xl font-bold">Hệ thống điện mặt trời</h2>
              </div>
              <div className="rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#b01a22]">Demo tham khảo</div>
            </div>
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">Loại hệ thống</label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  <option value="on-grid">On-Grid (không pin lưu trữ)</option>
                  <option value="hybrid">Hybrid (có pin lưu trữ)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/tu-van-giai-phap" className="inline-flex items-center gap-2 rounded-full bg-[#d0202a] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(208,32,42,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                Nhận phương án
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
                <ShieldCheck className="h-4 w-4 text-[#f5831f]" weight="fill" />
                Báo giá tham khảo
              </span>
            </div>
          </div>
        </>
      }
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
          <CurrencyDollar className="h-4 w-4" />
          Tính chi phí đầu tư
        </div>
        <div className="mt-5">
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <h3 className="text-lg font-bold text-slate-950">Kết quả tính nhanh</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-600">Chi phí hệ thống {systemSize}kWp</span>
                  <span className="text-base font-bold text-slate-950">{totalCost.toLocaleString('vi-VN')} triệu</span>
                </div>
                {systemType === 'hybrid' && (
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                    <span className="text-sm text-slate-600">Chi phí pin lưu trữ</span>
                    <span className="text-base font-bold text-slate-950">{batteryCost.toLocaleString('vi-VN')} triệu</span>
                  </div>
                )}
                <div className="rounded-2xl border border-[#ffd7be] bg-[#fff4e8] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-700">Tổng chi phí</span>
                    <span className="text-2xl font-black text-[#d0202a]">{grandTotal.toLocaleString('vi-VN')} triệu</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Giá tham khảo chưa bao gồm biến động vật tư và VAT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
            <h3 className="text-lg font-bold text-slate-950">Kết quả tính nhanh</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                <span className="text-sm text-slate-600">Chi phí hệ thống {systemSize}kWp</span>
                <span className="text-base font-bold text-slate-950">{totalCost.toLocaleString('vi-VN')} triệu</span>
              </div>
              {systemType === 'hybrid' && (
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-600">Chi phí pin lưu trữ</span>
                  <span className="text-base font-bold text-slate-950">{batteryCost.toLocaleString('vi-VN')} triệu</span>
                </div>
              )}
              <div className="rounded-2xl border border-[#ffd7be] bg-[#fff4e8] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-700">Tổng chi phí</span>
                  <span className="text-2xl font-black text-[#d0202a]">{grandTotal.toLocaleString('vi-VN')} triệu</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Giá tham khảo chưa bao gồm biến động vật tư và VAT.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Gợi ý nhanh</p>
              <div className="mt-4 space-y-3">
                {[
                  'On-Grid phù hợp nếu ưu tiên hoàn vốn nhanh.',
                  'Hybrid phù hợp nếu cần dùng điện khi mất lưới.',
                  'Công suất càng lớn, giá/kWp thường càng tối ưu.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f5831f]" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#f5d5c0] bg-gradient-to-br from-[#fffaf6] to-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-sm font-semibold text-slate-900">Bạn muốn nhận báo giá sát hơn?</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Gửi nhu cầu thực tế để EPCVINA bóc tách theo mái, tải và phương án tối ưu vật tư.
              </p>
              <a
                href="/lien-he"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f5831f] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(245,131,31,0.24)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Nhận báo giá chi tiết
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPageShell>
  );
}
