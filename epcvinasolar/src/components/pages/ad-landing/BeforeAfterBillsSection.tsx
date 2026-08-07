import { ArrowRight, CalendarCheck, CheckCircle, MapPin, TrendDown } from '@phosphor-icons/react';
import { trackConversionEvent } from '../../../lib/tracking';

export default function BeforeAfterBillsSection() {
  const bills = [
    {
      customer: 'Chị Hà - Hà Đông',
      capacity: '15 kWp Hybrid',
      before: {
        label: '3.000.000đ/tháng',
      },
      after: {
        label: '400.000đ/tháng',
      },
      savings: 2600000,
      savingsPercent: 87,
      location: 'Hà Đông, Hà Nội',
      completed: 'T7.2024',
      note: 'Hybrid cho gia đình dùng cả ngày và đêm',
      image: '/du-an/solar-nha-dan/du-an-chi-ha-ha-dong.png',
    },
    {
      customer: 'Chú Thanh - Hải Dương',
      capacity: '22 kWp Hybrid',
      before: {
        label: '5.000.000đ/tháng',
      },
      after: {
        label: '500.000đ/tháng',
      },
      savings: 4500000,
      savingsPercent: 90,
      location: 'TP. Hải Dương',
      completed: 'T6.2024',
      note: 'Có pin lưu trữ cho tải quan trọng',
      image: '/du-an/solar-nha-dan/du-an-anh-thang-hai-duong.png',
    },
    {
      customer: 'Anh Linh - Dương Nội',
      capacity: '7.5 kWp Hybrid',
      before: {
        label: '2.000.000đ/tháng',
      },
      after: {
        label: '250.000đ/tháng',
      },
      savings: 1750000,
      savingsPercent: 88,
      location: 'Dương Nội, Hà Nội',
      completed: 'T9.2024',
      note: 'Tối ưu hóa đơn cho nhà phố',
      image: '/du-an/solar-nha-dan/du-an-anh-linh-duong-noi.png',
    },
  ];

  return (
    <section id="hoa-don" className="scroll-mt-24 bg-white py-10 sm:py-16">
      <span id="du-an" className="block scroll-mt-24" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 sm:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-orange-600 font-display">Hóa đơn thực tế</p>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl font-display">
              Case nhà dân đã lắp: hóa đơn giảm bao nhiêu?
            </h2>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-[12px] leading-relaxed text-slate-700 sm:text-sm">
            Gộp bằng chứng hóa đơn và thông tin dự án trong một chỗ để anh/chị xem nhanh. Mức giảm còn phụ thuộc mái, hướng nắng, biểu giá điện và tỷ lệ dùng điện.
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between md:hidden">
          <p className="text-[12px] font-semibold text-slate-500">Vuốt ngang để xem thêm case</p>
          <div className="flex gap-1.5" aria-hidden="true">
            {bills.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-5 bg-orange-500' : 'w-1.5 bg-slate-300'}`} />
            ))}
          </div>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:gap-5">
          {bills.map((bill, i) => (
            <article key={i} className="flex min-w-[82vw] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-36px_rgba(15,23,42,.45)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_24px_60px_-36px_rgba(245,130,32,.45)] sm:min-w-[380px] md:min-w-0">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={bill.image}
                  alt={bill.customer}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  width="640"
                  height="640"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.08em] text-emerald-700 shadow-sm">
                  Ảnh công trình thực tế
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4 lg:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-black text-orange-700">
                      {bill.capacity}
                    </div>
                    <h3 className="text-[16px] font-black leading-tight text-slate-950 sm:text-lg font-display">{bill.customer}</h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.08em] text-emerald-700 sm:text-[11px]">Đã đối chiếu hóa đơn</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    -{bill.savingsPercent}%
                  </div>
                </div>

                <div className="grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-orange-500" weight="fill" />
                    <span>{bill.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4 text-emerald-600" weight="duotone" />
                    <span>{bill.completed}</span>
                  </div>
                </div>

                <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] font-medium leading-relaxed text-slate-600">
                  {bill.note}
                </p>

                <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[.12em] text-slate-500">Kết quả hóa đơn</p>
                  <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-white p-2.5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">Trước</p>
                      <p className="text-[12px] font-black text-slate-900 sm:text-sm">{bill.before.label}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange-500" weight="bold" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.12em] text-emerald-600">Sau</p>
                      <p className="text-[12px] font-black text-emerald-700 sm:text-sm">{bill.after.label}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-emerald-700">
                        <TrendDown className="h-4 w-4" weight="duotone" />
                        <span className="text-xs font-bold">Tiết kiệm/tháng</span>
                      </div>
                      <p className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl font-display">
                        {(bill.savings / 1000000).toFixed(1)} triệu
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[.1em] text-emerald-700">Mỗi năm</p>
                      <p className="text-sm font-black text-emerald-800">{(bill.savings * 12 / 1000000).toFixed(0)} triệu</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mt-10 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
          <div className="mb-4 flex items-start gap-2.5 sm:mb-0">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" weight="fill" />
            <p className="text-sm leading-relaxed text-slate-700">
              Muốn biết nhà mình có thể giảm bao nhiêu? Nhập hóa đơn để EPCVINA tính phương án sơ bộ trước khi khảo sát.
            </p>
          </div>
          <a 
            href="#calculator" 
            onClick={() => trackConversionEvent('bill_case_calculator_click', { event_label: 'family_landing', conversion_action: 'bill_case_calculator_click' })}
            className="inline-flex min-h-[48px] w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-[15px] font-black text-white shadow-lg shadow-orange-500/20 transition-[background-color,box-shadow] hover:bg-orange-600 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-auto sm:px-6"
          >
            Tính cho nhà tôi
            <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
