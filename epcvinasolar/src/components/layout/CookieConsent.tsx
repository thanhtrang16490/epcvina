import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, X } from '@phosphor-icons/react';
import { submitCrmLead } from '../../lib/crm-leads';

const STORAGE_KEY = 'epcvina_cookie_consent_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

type ConsentState = 'accepted' | 'essential' | null;
type ConsentRecord = {
  value: Exclude<ConsentState, null>;
  expiresAt: number;
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const storedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (!storedRaw) {
        setVisible(true);
        return;
      }

      const stored = JSON.parse(storedRaw) as Partial<ConsentRecord>;
      if (!stored?.expiresAt || stored.expiresAt <= Date.now()) {
        window.localStorage.removeItem(STORAGE_KEY);
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const saveConsent = (value: Exclude<ConsentState, null>) => {
    try {
      const record: ConsentRecord = {
        value,
        expiresAt: Date.now() + DAY_MS,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage failures and just dismiss the banner.
    }
    setVisible(false);
  };

  const dismissWithoutPreference = () => {
    setVisible(false);
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
        message: 'Khách đăng ký nhận miễn phí khảo sát từ popup cookie.',
      });
      saveConsent('accepted');
      showThankYou();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không gửi được thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 lg:left-20 z-[95] hidden lg:flex max-w-[calc(100vw-2rem)] justify-start pointer-events-none">
      <div className="pointer-events-auto w-[390px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
        {submitted ? (
          <div className="px-5 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <ShieldCheck className="h-8 w-8" weight="bold" />
            </div>
            <h2 className="mt-4 text-[22px] font-semibold leading-tight text-slate-900">
              Cảm ơn bạn đã đăng ký
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              EPCVINA sẽ liên hệ lại sớm với bạn để hỗ trợ khảo sát và tư vấn phù hợp.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Tự động đóng sau 5 giây
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 bg-white px-5 pb-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                  <ShieldCheck className="h-6 w-6" weight="bold" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[20px] font-semibold leading-tight text-slate-900">
                    ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    (*) Nhận ngay miễn phí khảo sát
                  </p>
                </div>

                <button
                  type="button"
                  onClick={dismissWithoutPreference}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" weight="bold" />
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                *Miễn phí khảo sát sẽ được xác nhận sau 24h, chỉ áp dụng cho khách hàng mới
              </div>

              <div className="mt-4 space-y-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Số điện thoại
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    aria-label="Tôi đồng ý với điều khoản của EPCVINA"
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    Tôi đồng ý với điều khoản của EPCVINA
                  </span>
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {submitting ? 'ĐANG GỬI...' : 'ĐĂNG KÝ NGAY'}
                </button>
                <button
                  type="button"
                  onClick={() => saveConsent('essential')}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Bữa khác nha!
                </button>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
