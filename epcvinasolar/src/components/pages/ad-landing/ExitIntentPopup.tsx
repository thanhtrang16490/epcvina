import { useState, useEffect } from 'react';
import { X, Phone, Gift } from '@phosphor-icons/react';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({ phone: '' });

  useEffect(() => {
    // Check if already shown in this session
    if (sessionStorage.getItem('exitPopupShown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShow(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShow(false);
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exit_popup_submit', {
        event_category: 'conversion',
        event_label: formData.phone,
      });
    }
    alert('Đã nhận số điện thoại! Chúng tôi sẽ gọi tư vấn trong 30 phút.');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all cursor-pointer"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white text-center">
          <Gift className="w-16 h-16 mx-auto mb-3" weight="duotone" />
          <h3 className="text-2xl font-bold mb-2">Đừng Bỏ Lỡ!</h3>
          <p className="text-sm opacity-90">Nhận báo giá chi tiết qua Zalo trong 5 phút</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[
              'Báo giá chi tiết từng hạng mục',
              'Tư vấn giải pháp tối ưu nhất',
              'Khảo sát miễn phí tại nhà',
              'Không cam kết, không áp lực',
            ].map((item, i) => (
              <p key={i} className="text-slate-700 text-sm flex items-center gap-2">
                <span className="text-emerald-500">&#10003;</span> {item}
              </p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0988 446 113"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 rounded-lg text-lg transition-all shadow-lg"
            >
              Nhận Báo Giá Ngay
            </button>

            <p className="text-xs text-center text-slate-500">
              Bảo mật tuyệt đối, không spam
            </p>
          </form>

          {/* Alternative CTA */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600 mb-2">Hoặc gọi ngay:</p>
            <a
              href="tel:0988446113"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'exit_popup_hotline', {
                    event_category: 'conversion',
                  });
                }
              }}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-all"
            >
              <Phone className="w-5 h-5" />
              0988 446 113
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
