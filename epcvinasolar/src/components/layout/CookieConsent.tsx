import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { submitCrmLead } from '../../lib/crm-leads';

const STORAGE_KEY = 'epcvina_cookie_consent_v1';
const LEAD_SUPPRESSION_MS = 24 * 60 * 60 * 1000;
const MOBILE_DISMISS_SUPPRESSION_MS = 30 * 60 * 1000;

type ConsentRecord = {
  value: 'accepted' | 'essential';
  expiresAt?: number;
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const updateViewport = () => setIsDesktop(media.matches);
    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (isDesktop === null) return;
    try {
      const storedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (!storedRaw) {
        setVisible(true);
        return;
      }
      const stored = JSON.parse(storedRaw) as Partial<ConsentRecord>;
      const hasActiveSuppression = typeof stored.expiresAt === 'number'
        && stored.expiresAt > Date.now();
      const hasActiveDesktopLeadSuppression = isDesktop
        && stored?.value === 'accepted'
        && hasActiveSuppression;
      setVisible(isDesktop ? !hasActiveDesktopLeadSuppression : !hasActiveSuppression);
    } catch {
      setVisible(true);
    }

    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [isDesktop]);

  const saveMobileDismissal = () => {
    try {
      const record: ConsentRecord = {
        value: 'essential',
        expiresAt: Date.now() + MOBILE_DISMISS_SUPPRESSION_MS,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage failures and just dismiss the banner.
    }
    setVisible(false);
  };

  const dismissWithoutPreference = () => {
    if (isDesktop) return;
    saveMobileDismissal();
  };

  const saveLeadSubmission = () => {
    try {
      const record: ConsentRecord = {
        value: 'accepted',
        expiresAt: Date.now() + LEAD_SUPPRESSION_MS,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Storage is best-effort; the success state still remains visible.
    }
  };

  const showThankYou = () => {
    setSubmitted(true);
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setSubmitted(false);
      hideTimerRef.current = null;
    }, 5000);
  };

  const handleSubmit = async () => {
    const value = phone.trim();
    if (!value) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await submitCrmLead({
        phone: value,
        source_form: 'cookie_offer_popup',
        message: 'Khách để lại số điện thoại để được gọi tư vấn miễn phí từ popup trang chủ.',
      });
      saveLeadSubmission();
      showThankYou();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không gửi được thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-3 right-3 z-[95] pointer-events-none lg:hidden">
        <div className="pointer-events-auto ml-0 mr-auto w-[min(100%,22rem)] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          {submitted ? (
            <div className="px-3.5 py-3 text-left">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold leading-tight text-slate-900">
                    Cảm ơn bạn, EPCVINA sẽ liên hệ sớm
                  </h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                    Chúng tôi sẽ gọi lại để tư vấn giải pháp phù hợp, rõ ràng và chuyên nghiệp.
                  </p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                    Tự động đóng sau 5 giây
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 bg-white px-3 pb-2.5 pt-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-semibold leading-none text-slate-900">
                      <span className="hidden min-[390px]:inline sm:hidden">Để lại số, chúng tôi sẽ liên hệ lại !</span>
                      <span className="min-[390px]:hidden">Chúng tôi sẽ gọi lại !</span>
                      <span className="hidden sm:inline">Để lại số, chúng tôi sẽ liên hệ lại !</span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={dismissWithoutPreference}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Đóng"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="px-3 py-3">
                <label className="block">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="VD: 0988 446 113 - Tư vấn 24/7"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>

                <div className="mt-3 grid grid-cols-[2fr_1fr] gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? 'ĐANG GỬI...' : 'NHẬN TƯ VẤN'}
                  </button>
                  <button
                    type="button"
                    onClick={dismissWithoutPreference}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-2.5 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Để sau
                  </button>
                </div>

                {error && <p className="mt-2.5 text-[13px] text-red-600">{error}</p>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-4 lg:left-20 z-[95] hidden lg:flex max-w-[calc(100vw-2rem)] justify-start pointer-events-none">
        <div className="pointer-events-auto w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
        {submitted ? (
          <div className="px-4 py-4 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="mt-2.5 text-[18px] font-semibold leading-tight text-slate-900">
              Cảm ơn bạn, EPCVINA sẽ liên hệ sớm
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Chúng tôi sẽ gọi lại để tư vấn giải pháp phù hợp, rõ ràng và chuyên nghiệp.
            </p>
            <p className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Tự động đóng sau 5 giây
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 bg-white px-4 pb-2 pt-3">
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                  <ShieldCheck className="h-5 w-5" weight="bold" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[18px] font-semibold leading-tight text-slate-900">
                    TƯ VẤN CHUẨN CƠ ĐIỆN
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                    EPCVINA sẽ gọi tư vấn giải pháp phù hợp theo nhu cầu thực tế của bạn.
                  </p>
                </div>

              </div>
            </div>

            <div className="px-4 py-3">
              <div className="space-y-1.5">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Số điện thoại
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="VD: 0988 446 113"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.75 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {submitting ? 'ĐANG GỬI...' : 'NHẬN TƯ VẤN'}
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}
