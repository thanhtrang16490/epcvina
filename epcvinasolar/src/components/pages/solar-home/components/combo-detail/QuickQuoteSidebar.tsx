import { CheckCircle } from '@phosphor-icons/react';

export default function QuickQuoteSidebar({
  leadSubmitted,
  leadPhone,
  leadSubmitting,
  leadError,
  setLeadPhone,
  handleLeadSubmit,
}: {
  leadSubmitted: boolean;
  leadPhone: string;
  leadSubmitting: boolean;
  leadError: string;
  setLeadPhone: (value: string) => void;
  handleLeadSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="space-y-0">
          <div className="pb-4">
            <h3 className="text-[18px] font-semibold text-gray-900">Nhận báo giá nhanh</h3>
            <p className="mt-4 text-[13px] leading-6 text-gray-700">
              Gửi thông tin để EPCVINA liên hệ tư vấn, kiểm tra nhu cầu thực tế và đề xuất phương án phù hợp nhất cho công trình của bạn.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="grid gap-3">
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">Khảo sát mái miễn phí trước khi chốt phương án.</div>
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">Báo giá minh bạch, rõ vật tư và hạng mục thi công.</div>
              <div className="rounded-[14px] border border-[#ffe3d2] bg-[#fff7f2] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">Kỹ sư EPCVINA liên hệ lại để tư vấn nhanh trong giờ hành chính.</div>
            </div>
          </div>
          <a href="/calculator" className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] bg-[#f60] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_-16px_rgba(255,102,0,.65)] transition active:scale-[0.98]">
            Nhận báo giá ngay
          </a>
          <a href="https://zalo.me/0368927332" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-gray-400 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition active:scale-[0.98]">
            Chat ngay
          </a>
          <a href="tel:0988446113" className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-[999px] border border-[#f60] bg-[#fff7f2] px-5 py-3 text-[14px] font-semibold text-[#c24f00] transition active:scale-[0.98]">
            Gọi kỹ sư tư vấn
          </a>
        </div>
      </div>
      <div className="rounded-[18px] bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
        {leadSubmitted ? (
          <div className="py-2 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <CheckCircle className="h-7 w-7" weight="fill" />
            </div>
            <h3 className="mt-3 text-lg font-bold">Cảm ơn bạn</h3>
            <p className="mt-1 text-sm text-emerald-100">EPCVINA sẽ liên hệ sớm để tư vấn giải pháp phù hợp.</p>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-lg font-bold">Để lại số, chúng tôi sẽ liên hệ lại</h3>
            <p className="mb-4 text-sm text-emerald-100">Chỉ cần nhập số điện thoại, đội ngũ EPCVINA sẽ gọi lại để tư vấn giải pháp phù hợp cho công trình của bạn.</p>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100/90">Số điện thoại</span>
                <div className="flex items-stretch gap-2 rounded-2xl border border-white/20 bg-white p-1">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={leadPhone}
                    onChange={(event) => setLeadPhone(event.target.value)}
                    placeholder="VD: 0988 446 113"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleLeadSubmit}
                    disabled={leadSubmitting}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {leadSubmitting ? 'ĐANG GỬI...' : 'Gửi'}
                  </button>
                </div>
              </label>
              {leadError && <p className="text-sm text-amber-100">{leadError}</p>}
            </div>
            <p className="mt-3 text-center text-xs text-emerald-200">
              Hotline: <a href="tel:0988446113" className="underline hover:text-white">0988 446 113</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
