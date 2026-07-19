import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Buildings, Factory, HouseLine, Phone, SunDim } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

const billPresetsByType: Record<string, string[]> = {
  home: ['500k', '1 triệu', '2 triệu', '3 triệu', '5 triệu', '8 triệu'],
  business: ['3 triệu', '5 triệu', '10 triệu', '20 triệu', '30 triệu', '50 triệu'],
  factory: ['20 triệu', '50 triệu', '100 triệu', '200 triệu', '500 triệu'],
};

const systemTypes = [
  { id: 'home', label: 'Gia đình', sub: 'Nhà ở, biệt thự', icon: HouseLine },
  { id: 'business', label: 'Kinh doanh', sub: 'Quán, cửa hàng', icon: Buildings },
  { id: 'factory', label: 'Nhà xưởng', sub: 'Cơ sở sản xuất', icon: Factory },
];

export default function CalculatorMainPage() {
  const [step, setStep] = useState(1);
  const [systemType, setSystemType] = useState('home');
  const [bill, setBill] = useState('');
  const progress = useMemo(() => `${Math.min(step, 4) * 25}%`, [step]);
  const billPresets = billPresetsByType[systemType] ?? billPresetsByType.home;

  return (
    <div className="min-h-screen bg-[#f5ead7] text-[#231b16]">
      <HeaderBar />
      <main className="mx-auto flex min-h-[100dvh] max-w-[920px] flex-col px-4 pb-6 pt-20 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#f7a800] text-[#6b4300] shadow-[0_10px_28px_rgba(247,168,0,0.25)]">
              <SunDim className="h-9 w-9" weight="duotone" />
            </div>
            <div>
              <h1 className="text-[1.7rem] font-extrabold tracking-tight text-[#2b211b] sm:text-[1.95rem]">Máy tính Điện Mặt Trời</h1>
              <p className="mt-1 text-xs text-[#7d7168] sm:text-sm">Ước tính theo hoá đơn thực tế</p>
            </div>
          </div>
          <span className="rounded-full border border-[#97e8b0] bg-[#eaf8ee] px-5 py-3 text-base font-bold text-[#1b7a3b]">
            Miễn phí
          </span>
        </div>

        <section className="rounded-[36px] bg-[radial-gradient(circle_at_top_right,rgba(255,206,105,0.18),transparent_24%),linear-gradient(180deg,#0c1326_0%,#11192e_100%)] px-6 py-7 text-white shadow-[0_24px_80px_rgba(29,19,8,0.26)] sm:px-8 sm:py-9">
          <div className="max-w-4xl">
            <h2 className="max-w-3xl text-[1.75rem] font-black leading-[1.08] tracking-tight text-[#ffbf27] sm:text-[2.2rem]">
              Tính nhanh hệ điện mặt trời phù hợp
            </h2>
            <p className="mt-4 max-w-3xl text-[1.05rem] leading-[1.55] text-[#d6d8e4] sm:text-[1.2rem]">
              Nhập hóa đơn điện trung bình để hệ thống ước tính công suất nên lắp, chi phí đầu tư và thời gian hoàn vốn.
            </p>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-[1.55rem] font-extrabold text-[#f59e0b]">Bước {step} / 4</p>
            <p className="text-[1.45rem] font-extrabold text-[#7d7168]">Hóa đơn điện</p>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-2 rounded-full bg-[#ded4c6]">
                <div
                  className="h-2 rounded-full bg-[#f59e0b] transition-all duration-300"
                  style={{ width: idx === 0 ? progress : '0%' }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <h3 className="max-w-4xl text-[2.05rem] font-black leading-[1.03] tracking-tight text-[#231b16] sm:text-[2.75rem]">
            Tiền điện trung bình mỗi tháng của bạn khoảng bao nhiêu?
          </h3>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {systemTypes.map((item) => {
              const active = item.id === systemType;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSystemType(item.id)}
                  className={`rounded-[28px] border px-5 py-6 text-left shadow-[0_10px_22px_rgba(45,31,20,0.08)] transition-all ${
                    active
                      ? 'border-[#f0a000] bg-[#fcb318] text-white'
                      : 'border-[#eadcc8] bg-[#fffdf7] text-[#53473d]'
                  }`}
                >
                  <Icon className={`h-10 w-10 ${active ? 'text-white' : 'text-[#4f4237]'}`} weight="regular" />
                  <p className="mt-5 text-[1.2rem] font-extrabold">{item.label}</p>
                  <p className={`mt-1.5 text-sm sm:text-base ${active ? 'text-white/90' : 'text-[#7d7168]'}`}>{item.sub}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-[1.15rem] font-extrabold text-[#7d7168] sm:text-[1.25rem]">Chọn nhanh theo hóa đơn phổ biến</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {billPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBill(preset)}
                  className="rounded-full border border-[#e1d4bf] bg-[#fffdf9] px-5 py-3 text-[1.05rem] font-semibold text-[#4d4035] shadow-[0_8px_18px_rgba(45,31,20,0.04)] sm:px-6 sm:text-[1.2rem]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-[#eadcc8] bg-white px-6 py-5 shadow-[0_16px_36px_rgba(45,31,20,0.08)]">
            <div className="flex items-center justify-between">
              <input
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full border-0 bg-transparent text-[1.65rem] font-black text-[#7d7168] outline-none placeholder:text-[#7d7168]/80 sm:text-[2rem]"
              />
              <span className="ml-4 text-[1.15rem] font-extrabold text-[#7d7168] sm:text-2xl">VND</span>
            </div>
          </div>

          <p className="mt-6 max-w-4xl text-sm leading-7 text-[#7d7168] sm:text-lg">
            Có thể nhập gần đúng, không cần chính xác. Hãy dùng số trên hóa đơn điện tháng gần nhất.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-[24px] bg-[#f8cb84] px-6 py-4 text-[1.15rem] font-extrabold text-white shadow-[0_16px_32px_rgba(248,203,132,0.45)] sm:py-5 sm:text-[1.5rem]"
            >
              Tiếp tục
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 text-[1.15rem] font-bold text-[#7d7168] sm:text-2xl">
              <ArrowLeft className="h-5 w-5" />
              Quay lại
            </button>
          </div>
        </section>

        <div className="mt-auto flex justify-end pt-8">
          <a
            href="/tu-van-giai-phap"
            className="inline-flex items-center gap-3 rounded-full bg-[#16a34a] px-7 py-4 text-[1.2rem] font-bold text-white shadow-[0_18px_36px_rgba(22,163,74,0.28)] sm:px-8 sm:text-2xl"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" weight="bold" />
            0914.264.369
          </a>
        </div>
      </main>
    </div>
  );
}
