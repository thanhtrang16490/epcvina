import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CirclesThree, Lightning, Phone, SunDim } from '@phosphor-icons/react';
import CalculatorPageShell from './CalculatorPageShell';

export default function ThoiGianHoanVonPage() {
  const [paybackYears, setPaybackYears] = useState(2.5);
  const [selectedTab, setSelectedTab] = useState(0);

  const progressDots = useMemo(() => [0, 1, 2], []);

  return (
    <CalculatorPageShell
      title="Tính thời gian hoàn vốn rõ ràng theo mức đầu tư."
      description="Xem nhanh hệ thống mất bao lâu để thu hồi vốn dựa trên chi phí, sản lượng và mức tiết kiệm thực tế."
      stats={[
        { label: 'Bước', value: '3 / 3' },
        { label: 'Hoàn vốn', value: `~${paybackYears} năm` },
        { label: 'Điểm sáng', value: 'CO₂ giảm' },
      ]}
      sidebar={<div className="text-sm text-slate-300">Sidebar</div>}
    >
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f7a800] text-[#6b4300] shadow-[0_10px_28px_rgba(247,168,0,0.25)]">
              <SunDim className="h-10 w-10" weight="duotone" />
            </div>
            <div>
              <h1 className="text-[1.55rem] font-extrabold tracking-tight text-[#2b211b] sm:text-[1.8rem]">Máy tính Điện Mặt Trời</h1>
              <p className="mt-1 text-[0.9rem] leading-tight text-[#7d7168] sm:text-[1rem]">Ước tính theo hoá đơn thực tế</p>
            </div>
          </div>
          <span className="rounded-full border border-[#f3dfae] bg-[#fff3d6] px-5 py-3 text-[1.05rem] font-bold text-[#9a6a00] sm:text-[1.1rem]">
            Bước 3/3
          </span>
        </div>

        <section className="rounded-[36px] bg-[radial-gradient(circle_at_top_right,rgba(255,206,105,0.18),transparent_24%),linear-gradient(180deg,#0c1326_0%,#11192e_100%)] px-6 py-7 text-white shadow-[0_24px_80px_rgba(29,19,8,0.26)] sm:px-8 sm:py-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.82rem] font-black uppercase tracking-[0.24em] text-[#ffbf27] sm:text-[0.95rem]">TỐT CHO GIA ĐÌNH & MÔI TRƯỜNG</p>
              <h2 className="mt-5 text-[3.15rem] font-black leading-[0.92] tracking-tight text-white sm:text-[4rem]">
                ~2.7 tấn CO₂/năm
              </h2>
            </div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-[0.95rem] font-bold text-white/90 backdrop-blur sm:text-[1.05rem]">
              Giảm phát thải
            </span>
          </div>

          <div className="mt-6 space-y-3 rounded-[28px] bg-white/8 p-3 backdrop-blur-sm">
            {[
              { value: '~130', label: 'cây xanh hấp thụ CO₂ trong một năm', icon: '🌿' },
              { value: '18', label: 'chuyến bay Hà Nội - TP.HCM khử hối', icon: '✈️' },
              { value: '~23.000 km', label: 'quãng đường xe máy phát thải tương đương', icon: '🛵' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-[22px] bg-[rgba(255,255,255,0.08)] px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22304f] text-[1.25rem]">{item.icon}</div>
                <div>
                  <p className="text-[1.05rem] font-extrabold text-white sm:text-[1.15rem]">{item.value}</p>
                  <p className="text-[0.95rem] leading-6 text-slate-300 sm:text-[1rem]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[0.95rem] leading-7 text-slate-300 sm:text-[1rem]">
            Theo giá carbon EU: tương đương ~5 triệu đồng mỗi năm.
          </p>
        </section>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d7c2] bg-white text-[#8b7764] shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </button>
          {progressDots.map((dot) => (
            <span key={dot} className={`h-2.5 rounded-full ${dot === selectedTab ? 'w-8 bg-[#f59e0b]' : 'w-2.5 bg-[#e0cfbb]'}`} />
          ))}
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d7c2] bg-white text-[#8b7764] shadow-sm">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-5">
          <p className="text-[1rem] font-medium text-[#7d7168] sm:text-[1.05rem]">Hệ thống phù hợp với gia đình anh/chị</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { icon: <Lightning className="h-5 w-5" />, value: '3.9 kWp', label: 'Công suất nên lắp' },
              { icon: <CirclesThree className="h-5 w-5" />, value: '6 tấm', label: 'Pin 650 Wp/tấm' },
              { icon: <SunDim className="h-5 w-5" />, value: 'Hệ Hòa Lưới', label: 'không cần Pin lưu trữ' },
              { icon: <Phone className="h-5 w-5" />, value: '30–33 tr', label: 'Chi phí dự kiến' },
            ].map((item, index) => (
              <div key={item.label} className="rounded-[22px] border border-[#eadcc8] bg-[#fffdf7] px-4 py-4 shadow-[0_10px_22px_rgba(45,31,20,0.06)]">
                <div className="flex items-center gap-2 text-[#f59e0b]">{item.icon}</div>
                <p className={`mt-3 ${index < 2 ? 'text-[2.05rem]' : 'text-[1.55rem]'} font-black leading-none text-[#231b16]`}>{item.value}</p>
                <p className="mt-1 text-[0.92rem] leading-5 text-[#7d7168] sm:text-[0.98rem]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[24px] border border-[#eadcc8] bg-white px-4 py-5 shadow-[0_10px_22px_rgba(45,31,20,0.06)]">
            <h3 className="text-[1.2rem] font-black text-[#231b16] sm:text-[1.35rem]">Thời gian hoàn vốn</h3>
            <div className="mt-6 h-48 rounded-[20px] bg-[linear-gradient(180deg,#fffaf4_0%,#fff4e2_100%)] p-4">
              <div className="flex h-full items-end">
                <div className="relative w-full">
                  <div className="absolute left-0 top-16 right-0 border-t-2 border-dashed border-[#c9b7a2]" />
                  <div className="absolute left-0 bottom-10 text-[1rem] font-medium text-[#8d7a66]">0</div>
                  <div className="absolute left-[31%] bottom-10 text-[1rem] font-black text-[#1f8b45]">~{paybackYears} năm</div>
                  <div className="absolute right-0 bottom-10 text-[1rem] font-medium text-[#8d7a66]">12</div>
                  <div className="absolute left-10 top-16 text-[0.95rem] font-semibold text-[#8d7a66]">Vốn đầu tư</div>
                  <div className="absolute left-0 right-0 bottom-12 h-[2px] bg-[#e8d7c1]" />
                  <div
                    className="absolute left-0 top-[52px] h-[2px] bg-[#f59e0b]"
                    style={{ width: `${Math.min(100, Math.max(18, paybackYears * 14))}%` }}
                  />
                  <div className="absolute left-[30%] top-[49px] h-5 w-5 rounded-full border-4 border-[#f59e0b] bg-white shadow-sm" />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-[18px] bg-[#f59e0b] px-5 py-4 text-[1rem] font-extrabold text-white shadow-[0_16px_32px_rgba(245,158,11,0.25)] sm:text-[1.1rem]"
            >
              Đăng Ký Khảo Sát & Thiết Kế Miễn Phí
              <span className="mt-1 block text-[0.84rem] font-medium text-white/90 sm:text-[0.92rem]">
                Nhà thầu uy tín gần bạn lên phương án miễn phí
              </span>
            </button>
          </div>

          <p className="mt-4 text-[0.95rem] leading-7 text-[#7d7168] sm:text-[1rem]">
            Nhà bạn đủ điều kiện để khảo sát điện mặt trời. Bước tiếp theo: nhà thầu uy tín gần bạn kiểm tra mái, hóa đơn và lên thiết kế miễn phí.
          </p>

          <div className="mt-5 rounded-[26px] border border-[#eadcc8] bg-white px-5 py-6 shadow-[0_12px_28px_rgba(45,31,20,0.06)]">
            <p className="text-center text-[0.88rem] font-black tracking-[0.2em] text-[#1f8b45] sm:text-[0.95rem]">MIỄN PHÍ - NHÀ THẦU UY TÍN GẦN BẠN</p>
            <h4 className="mt-3 text-center text-[1.35rem] font-black leading-[1.1] text-[#231b16] sm:text-[1.55rem]">
              Để lại thông tin để được khảo sát & lên thiết kế miễn phí
            </h4>
            <p className="mt-4 text-center text-[0.95rem] leading-7 text-[#7d7168] sm:text-[1rem]">
              Kỹ thuật viên sẽ liên hệ, kiểm tra hóa đơn và mái nhà, rồi đề xuất phương án điện mặt trời phù hợp với nhu cầu thực tế của bạn.
            </p>
            <button
              type="button"
              className="mt-5 w-full rounded-[18px] bg-[#f59e0b] px-5 py-4 text-[1rem] font-extrabold text-white shadow-[0_16px_32px_rgba(245,158,11,0.25)] sm:text-[1.1rem]"
            >
              Gửi thông tin khảo sát miễn phí
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            className="mx-auto mt-5 block text-[0.95rem] font-medium text-[#94a3b8] sm:text-[1rem]"
          >
            Xem thêm chi tiết kỹ thuật
          </button>

          <div className="mt-5 flex justify-center gap-6 text-[0.95rem] font-medium text-[#8a7d70] sm:text-[1rem]">
            <button type="button">← Sửa lại</button>
            <button type="button">↩ Tính lại từ đầu</button>
          </div>
        </section>

        <div className="sticky bottom-3 mt-6 rounded-[22px] border border-[#eadcc8] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(45,31,20,0.08)]">
          <p className="text-center text-[0.9rem] text-[#8a7d70]">
            • Nhà đủ điều kiện để khảo sát điện mặt trời
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-[16px] bg-[#f59e0b] px-5 py-4 text-[1rem] font-extrabold text-white shadow-[0_16px_32px_rgba(245,158,11,0.24)]"
          >
            Đăng ký khảo sát & thiết kế miễn phí
          </button>
        </div>
      </div>
    </CalculatorPageShell>
  );
}
