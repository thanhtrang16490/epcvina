import { useState } from 'react';
import { ArrowRight, CurrencyDollar, ShieldCheck } from '@phosphor-icons/react';
import CalculatorPageShell from './CalculatorPageShell';
import { normalizeVietnamPhone, redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';

export default function ChiPhiDauTuPage() {
  const [province, setProvince] = useState('Hà Nội');
  const [systemSize, setSystemSize] = useState(5);
  const [systemType, setSystemType] = useState('on-grid');
  const [roofType, setRoofType] = useState('tiled');
  const [billType, setBillType] = useState('family');
  const [roofArea, setRoofArea] = useState('45');
  const [dayUsage, setDayUsage] = useState(60);
  const [phaseType, setPhaseType] = useState('one');
  const [installTiming, setInstallTiming] = useState('30days');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadDemand, setLeadDemand] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const provinceOptions = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Bình Dương',
    'Đồng Nai',
    'Bắc Ninh',
    'Hải Phòng',
    'Hưng Yên',
    'Vĩnh Phúc',
    'Hà Nam',
    'Quảng Ninh',
    'Đà Nẵng',
    'Khánh Hòa',
    'Bình Phước',
    'Long An',
    'Cần Thơ',
  ];

  const roofAreaValue = Number(roofArea) || 0;
  const nightUsage = 100 - dayUsage;
  const billValue = billType === 'factory' ? 18000000 : billType === 'business' ? 9000000 : 4500000;
  const baseCostPerKwp = systemType === 'hybrid' ? 18.5 : 11.8;
  const sizeDiscount = systemSize >= 10 ? 0.92 : systemSize >= 7 ? 0.96 : 1;
  const roofFactor = roofType === 'metal' ? 0.95 : roofType === 'flat' ? 1.03 : 1;
  const systemCostPerKwp = baseCostPerKwp * sizeDiscount * roofFactor;
  const systemCost = Math.round(systemSize * systemCostPerKwp);
  const batteryKwh = systemType === 'hybrid' ? Math.max(5, Math.round(systemSize * 1.2)) : 0;
  const batteryCost = systemType === 'hybrid' ? Math.round(batteryKwh * 4.2) : 0;
  const inverterAndAccessories = Math.round(systemSize * (systemType === 'hybrid' ? 1.15 : 0.7));
  const installationCost = Math.round(systemSize * (roofType === 'flat' ? 0.75 : 0.55));
  const grandTotal = systemCost + batteryCost + inverterAndAccessories + installationCost;
  const monthlyProduction = Math.round(systemSize * 115);
  const selfConsumptionRate = systemType === 'hybrid' ? 0.72 : 0.62;
  const monthlySaving = Math.round(monthlyProduction * selfConsumptionRate * 2.45);
  const paybackYears = Math.max(2.8, Math.min(7.8, grandTotal / Math.max(monthlySaving * 12, 1)));
  const annualSaving = monthlySaving * 12;
  const estimatedSaving = Math.round(monthlySaving / 1000);
  const panelCount = Math.max(0, Math.round(systemSize * 1.54));
  const inverterKw = systemSize <= 6 ? 5 : systemSize <= 10 ? 8 : systemSize <= 15 ? 12 : 15;
  const estimatedRoofNeed = Math.max(0, Math.round(systemSize * 6.5));
  const estimatedRoofCoverage = roofAreaValue > 0 ? Math.min(100, Math.round((estimatedRoofNeed / roofAreaValue) * 100)) : 0;
  const paybackOptions = [
    { label: 'Thận trọng', value: `${Math.max(3.2, paybackYears + 0.8).toFixed(1)} năm`, note: 'Chi phí cao hơn, tiết kiệm thấp hơn' },
    { label: 'Cơ sở', value: `${paybackYears.toFixed(1)} năm`, note: 'Theo dữ liệu hiện tại' },
    { label: 'Tốt', value: `${Math.max(2.5, paybackYears - 0.6).toFixed(1)} năm`, note: 'Mái đẹp, tự dùng tốt hơn' },
  ];
  const technicalCards = [
    { value: `${panelCount} tấm`, label: 'Tấm pin', extra: 'Quy đổi ước tính theo công suất hiện tại' },
    { value: `${inverterKw} kW`, label: 'Inverter', extra: 'Chọn theo nhóm hệ thống phổ biến' },
    { value: `${estimatedRoofNeed} m²`, label: 'Mái cần dùng', extra: roofAreaValue ? `Đang có ${roofAreaValue} m²` : 'Chưa nhập mái' },
    { value: `${estimatedRoofCoverage}%`, label: 'Tỷ lệ phủ mái', extra: 'Để xem mức tương quan diện tích' },
  ];
  const financeCards = [
    { value: `${systemCost.toLocaleString('vi-VN')} tr`, label: 'Phần hệ thống', extra: 'Tấm pin + cấu hình chính' },
    { value: `${batteryCost.toLocaleString('vi-VN')} tr`, label: 'Pin lưu trữ', extra: batteryKwh > 0 ? `${batteryKwh} kWh` : 'Không chọn pin' },
    { value: `${grandTotal.toLocaleString('vi-VN')} tr`, label: 'Tổng đầu tư', extra: 'Tham khảo chưa gồm VAT' },
    { value: `${monthlySaving.toLocaleString('vi-VN')} tr`, label: 'Tiết kiệm/tháng', extra: `Sau khi khấu trừ theo ${billType}` },
  ];
  const resultSummary = {
    province,
    systemSize,
    systemType,
    roofType,
    billType,
    roofArea: roofAreaValue,
    dayUsage,
    nightUsage,
    phaseType,
    installTiming,
    systemCost,
    batteryKwh,
    batteryCost,
    inverterAndAccessories,
    installationCost,
    grandTotal,
    monthlyProduction,
    monthlySaving,
    annualSaving,
    paybackYears,
    panelCount,
    inverterKw,
    billValue,
  };
  const canSubmitLead = Boolean(normalizeVietnamPhone(leadPhone)) && !leadSubmitting;

  return (
    <CalculatorPageShell
      title="Ước tính chi phí điện mặt trời và gửi thông tin một lần."
      description="Nhập đủ thông tin để EPCVINA bóc tách mức đầu tư, hoàn vốn và liên hệ lại với phương án sát hơn."
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">Khu vực / tỉnh thành</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  {provinceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Nhóm khách hàng</label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  <option value="family">Gia đình / nhà phố</option>
                  <option value="business">Kinh doanh / văn phòng</option>
                  <option value="factory">Nhà xưởng / công nghiệp</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Loại mái</label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  <option value="tiled">Mái ngói / mái dân dụng</option>
                  <option value="metal">Mái tôn / mái kim loại</option>
                  <option value="flat">Mái bê tông / mái phẳng</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Diện tích mái khả dụng (m²)</label>
                <input
                  type="number"
                  min="10"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  placeholder="45"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Tỷ lệ dùng điện ban ngày</label>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={dayUsage}
                  onChange={(e) => setDayUsage(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#f5831f]"
                />
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <span>Ban đêm {nightUsage}%</span>
                  <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-base font-black text-[#d0202a]">Ban ngày {dayUsage}%</span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Pha điện</label>
                <select
                  value={phaseType}
                  onChange={(e) => setPhaseType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  <option value="one">1 pha</option>
                  <option value="three">3 pha</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Thời điểm dự kiến lắp</label>
                <select
                  value={installTiming}
                  onChange={(e) => setInstallTiming(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
                >
                  <option value="now">Ngay</option>
                  <option value="30days">Trong 30 ngày</option>
                  <option value="3months">Trong 3 tháng</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/calculator" className="inline-flex items-center gap-2 rounded-full bg-[#d0202a] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(208,32,42,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                Tính chi tiết hơn
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
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-white to-[#fff7ef] p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d5c0] bg-[#fff4e8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">
            <CurrencyDollar className="h-4 w-4" />
            Tính chi phí đầu tư
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-950">Một trang, đủ dữ liệu, đủ kết quả</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Trang này gom toàn bộ phần nhập liệu, tính nhanh, gợi ý kỹ thuật và lead form vào cùng một mạch để người dùng không phải đi từng bước.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {financeCards.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.extra}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
            <h3 className="text-lg font-bold text-slate-950">Kết quả tính nhanh</h3>
            <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-600">Chi phí hệ thống {systemSize}kWp</span>
                  <span className="text-base font-bold text-slate-950">{systemCost.toLocaleString('vi-VN')} triệu</span>
                </div>
                {systemType === 'hybrid' && (
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                    <span className="text-sm text-slate-600">Pin lưu trữ ~{batteryKwh} kWh</span>
                    <span className="text-base font-bold text-slate-950">{batteryCost.toLocaleString('vi-VN')} triệu</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-600">Inverter & phụ kiện</span>
                  <span className="text-base font-bold text-slate-950">{inverterAndAccessories.toLocaleString('vi-VN')} triệu</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                  <span className="text-sm text-slate-600">Thi công & lắp đặt</span>
                  <span className="text-base font-bold text-slate-950">{installationCost.toLocaleString('vi-VN')} triệu</span>
                </div>
                <div className="rounded-2xl border border-[#ffd7be] bg-[#fff4e8] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-700">Tổng chi phí</span>
                    <span className="text-2xl font-black text-[#d0202a]">{grandTotal.toLocaleString('vi-VN')} triệu</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Giá tham khảo theo cấu hình cơ bản, chưa gồm biến động vật tư và VAT.</p>
                </div>
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sản lượng/tháng</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{monthlyProduction.toLocaleString('vi-VN')} kWh</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Hoàn vốn</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{paybackYears.toFixed(1)} năm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tấm pin</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{panelCount} tấm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Mái cần dùng</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{estimatedRoofNeed} m²</p>
                  </div>
                </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Kỹ thuật sơ bộ</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {technicalCards.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.extra}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#f5d5c0] bg-gradient-to-br from-[#fffaf6] to-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">So sánh hoàn vốn</p>
              <div className="mt-4 grid gap-3">
                {paybackOptions.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                    <div>
                      <p className="text-sm font-bold text-slate-950">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                    </div>
                    <p className="text-lg font-black text-[#d0202a]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Gợi ý nhanh</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                'On-Grid phù hợp nếu ưu tiên hoàn vốn nhanh.',
                'Hybrid phù hợp nếu cần lưu điện khi mất lưới.',
                'Công suất lớn thường tối ưu giá/kWp hơn.',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-[#fff4e8] px-4 py-4 text-sm leading-6 text-[#9A3412]">
              Dữ liệu này sẽ đi thẳng vào hồ sơ tư vấn để EPCVINA gọi lại và không phải hỏi lại nhiều lần.
            </div>
          </div>

          <form
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] md:sticky md:top-6 md:p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              const normalizedPhone = normalizeVietnamPhone(leadPhone);
              if (!normalizedPhone) {
                setLeadError('Vui lòng nhập số điện thoại hợp lệ để EPCVINA liên hệ.');
                return;
              }
              setLeadSubmitting(true);
              setLeadError('');
              try {
                await submitCrmLead({
                  name: leadName.trim() || undefined,
                  phone: normalizedPhone,
                  email: leadEmail.trim() || undefined,
                  address: province || undefined,
                  source_form: 'calculator_investment_cost',
                  system_type: systemType,
                  roof_area: roofAreaValue ? `${roofAreaValue} m²` : undefined,
                  monthly_bill: `${billValue.toLocaleString('vi-VN')} VND`,
                  system_size_kw: systemSize,
                  message: leadDemand.trim() || `Khách xem trang chi phí đầu tư: ${systemSize} kWp, ${systemType === 'hybrid' ? 'Hybrid' : 'On-Grid'}, mái ${roofType}, ${province}, tổng đầu tư khoảng ${grandTotal.toLocaleString('vi-VN')} triệu, hoàn vốn ${paybackYears.toFixed(1)} năm. Đơn vị: ${leadCompany.trim() || 'không cung cấp'}.`,
                  calculator_result: resultSummary,
                  metadata: {
                    page: '/calculator/chi-phi-dau-tu',
                    source: 'investment_cost_page',
                    company: leadCompany.trim() || undefined,
                    bill_type: billType,
                    phase_type: phaseType,
                    install_timing: installTiming,
                    day_usage: dayUsage,
                    roof_area_m2: roofAreaValue,
                  },
                });
                window.localStorage.setItem('epcvina-calculator-lead', JSON.stringify({
                  customerName: leadName.trim(),
                  customerPhone: leadPhone.trim(),
                  province,
                  systemType,
                  roofType,
                  billType,
                  roofArea: roofAreaValue,
                  dayUsage,
                  nightUsage,
                  phaseType,
                  installTiming,
                  systemSize,
                  grandTotal,
                  paybackYears,
                }));
                setLeadSubmitted(true);
                redirectToThankYou('calculator_investment_cost');
              } catch (error) {
                setLeadError(error instanceof Error ? error.message : 'Chưa gửi được thông tin.');
              } finally {
                setLeadSubmitting(false);
              }
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0202a]">Nhận lead nhanh</p>
            <h3 className="mt-1 text-lg font-bold text-slate-950">Để EPCVINA gọi lại và chốt phương án</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nhập đủ thông tin để không phải chia bước. EPCVINA sẽ lưu hồ sơ và phản hồi với báo giá phù hợp hơn.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">Họ và tên</span>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">Công ty / đơn vị</span>
              <input
                type="text"
                value={leadCompany}
                onChange={(e) => setLeadCompany(e.target.value)}
                placeholder="Tên công ty hoặc để trống"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">Số điện thoại / Zalo</span>
              <input
                type="tel"
                value={leadPhone}
                onChange={(e) => {
                  setLeadPhone(e.target.value);
                  if (leadError) setLeadError('');
                }}
                placeholder="0988 446 113"
                inputMode="tel"
                autoComplete="tel"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">Email</span>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="email@domain.com"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-800">Nhu cầu / ghi chú</span>
              <textarea
                value={leadDemand}
                onChange={(e) => setLeadDemand(e.target.value)}
                placeholder="Ví dụ: cần báo giá cho mái tôn 120m², ưu tiên hoàn vốn nhanh, muốn lắp trong tháng tới..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f5831f] focus:ring-4 focus:ring-[#fff4e8]"
              />
            </label>
          </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={!canSubmitLead}
              className="flex min-h-[54px] items-center justify-center rounded-2xl bg-[#d0202a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(208,32,42,0.22)] transition-transform hover:-translate-y-0.5 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {leadSubmitting ? 'Đang gửi...' : leadSubmitted ? 'Đã gửi xong' : 'Gửi lead và nhận báo giá'}
            </button>
            <a
              href="/lien-he"
              className="flex min-h-[54px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#f5831f] hover:text-[#d0202a]"
              >
              Liên hệ trực tiếp
            </a>
            </div>
            {leadError ? <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{leadError}</p> : null}
            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Mẫu khảo sát</p>
              <p className="mt-1 font-semibold text-slate-900">{billType === 'factory' ? 'Nhà xưởng' : billType === 'business' ? 'Kinh doanh' : 'Gia đình'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Mức đầu tư</p>
              <p className="mt-1 font-semibold text-slate-900">{grandTotal.toLocaleString('vi-VN')} triệu</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sản lượng/tháng</p>
              <p className="mt-1 font-semibold text-slate-900">{monthlyProduction.toLocaleString('vi-VN')} kWh</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Mái cần dùng</p>
              <p className="mt-1 font-semibold text-slate-900">{estimatedRoofNeed} m²</p>
            </div>
          </div>
          </form>
        </section>
      </div>
    </CalculatorPageShell>
  );
}
