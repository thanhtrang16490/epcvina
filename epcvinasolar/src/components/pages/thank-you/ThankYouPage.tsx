import { ArrowRight, CheckCircle, Clock, Phone } from '@phosphor-icons/react';

export default function ThankYouPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-emerald-50 via-white to-white px-4 pb-16 pt-28 sm:pt-36">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
          <CheckCircle className="h-11 w-11 text-emerald-600" weight="fill" aria-hidden="true" />
        </div>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Gửi thông tin thành công</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Cảm ơn anh/chị đã tin tưởng EPCVINA</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Chuyên viên EPCVINA Solar đã nhận được yêu cầu và sẽ liên hệ để tư vấn giải pháp phù hợp trong thời gian sớm nhất.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Clock className="h-7 w-7 text-orange-500" aria-hidden="true" />
            <h2 className="mt-3 font-bold text-slate-900">Thời gian phản hồi</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Trong giờ làm việc, đội ngũ tư vấn sẽ ưu tiên liên hệ sớm với anh/chị.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Phone className="h-7 w-7 text-emerald-600" aria-hidden="true" />
            <h2 className="mt-3 font-bold text-slate-900">Cần hỗ trợ ngay?</h2>
            <a href="tel:0988446113" className="mt-1 inline-block text-lg font-black text-emerald-700 hover:text-emerald-800">0988 446 113</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-800">
            Về trang chủ <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href="/du-an" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-50">
            Xem dự án đã triển khai
          </a>
        </div>
      </div>
    </main>
  );
}
