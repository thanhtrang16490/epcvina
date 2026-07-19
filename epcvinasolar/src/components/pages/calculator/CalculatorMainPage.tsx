import { Calculator, CurrencyDollar, Clock, Sun, BatteryHigh, Car, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

const tools = [
  { id: 'chi-phi-dau-tu', name: 'Chi Phí Đầu Tư', icon: CurrencyDollar, desc: 'Tính chi phí lắp đặt hệ thống', href: '/calculator/chi-phi-dau-tu' },
  { id: 'thoi-gian-hoan-von', name: 'Thời Gian Hoàn Vốn', icon: Clock, desc: 'Tính thời gian thu hồi vốn', href: '/calculator/thoi-gian-hoan-von' },
  { id: 'san-luong-dien', name: 'Sản Lượng Điện', icon: Sun, desc: 'Ước tính sản lượng điện', href: '/calculator/san-luong-dien' },
  { id: 'pin-luu-tru', name: 'Pin Lưu Trữ', icon: BatteryHigh, desc: 'Tính dung lượng pin phù hợp', href: '/calculator/pin-luu-tru' },
  { id: 'sac-xe-dien', name: 'Sạc Xe Điện', icon: Car, desc: 'Tính chi phí sạc xe', href: '/calculator/sac-xe-dien' },
];

export default function CalculatorMainPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20 bg-[#fff8f1] text-slate-900">
      <HeaderBar />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#1b2433] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,131,31,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(208,32,42,0.18),transparent_36%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
                <Calculator className="h-4 w-4" />
                Công cụ tính toán
              </div>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                Tính điện mặt trời online
                <span className="block text-orange-300">ước tính kWp, chi phí và hoàn vốn</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Nhập nhu cầu sử dụng để xem ngay mức đầu tư, sản lượng dự kiến và thời gian hoàn vốn theo hệ thống phù hợp.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/calculator/chi-phi-dau-tu"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5831f] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(245,131,31,0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Bắt đầu tính
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/tu-van-giai-phap"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
                >
                  Nhận tư vấn
                </a>
              </div>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl md:p-5">
              {[
                'Ước tính chi phí theo công suất',
                'So sánh On-Grid và Hybrid',
                'Tính nhanh thời gian hoàn vốn',
                'Gợi ý theo nhu cầu thực tế',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-orange-300" weight="fill" />
                  <p className="text-sm leading-6 text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                className="group block rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_42px_rgba(245,131,31,0.14)]"
              >
                <tool.icon className="mb-4 h-11 w-11 text-[#d0202a] transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-bold text-slate-950">{tool.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-orange-100 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:px-8 md:py-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Cần bản tính chi tiết hơn?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  EPCVINA có thể bóc tách theo mái nhà, sản lượng, số lượng tấm pin, inverter và pin lưu trữ để ra phương án sát thực tế hơn.
                </p>
              </div>
              <a
                href="/tu-van-giai-phap"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d0202a] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(208,32,42,0.25)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Tư vấn miễn phí
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
