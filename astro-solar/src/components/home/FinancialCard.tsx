

import { useState, memo } from 'react';
import { X, Phone, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';

interface FinancialCardProps {
  combo: {
    price: number;
    monthlySavings: number;
    roi: number;
    paybackPeriod: number;
    power?: number;
  };
  mounted: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-50/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function QuoteModal({ isOpen, onClose, combo }: { isOpen: boolean; onClose: () => void; combo: FinancialCardProps['combo'] }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', phone: '', email: '', note: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Xem chi tiết</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Hệ thống {combo.power ? `${combo.power} kWp` : ''} — {(combo.price / 1000000).toFixed(1)} triệu đồng
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-gray-500 hover:bg-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Gửi thành công!</h4>
            <p className="text-sm text-gray-500 mb-6">
              Chúng tôi sẽ liên hệ lại với bạn trong vòng <strong>24 giờ</strong>.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-left mb-4">
              <p className="text-xs text-gray-500 mb-1">Hoặc liên hệ trực tiếp:</p>
              <a href="tel:0962916488" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                <Phone className="h-4 w-4" />
                0962 916 488
              </a>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Họ và tên *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="tel"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  placeholder="Mái tôn, mái ngói, công suất mong muốn..."
                  rows={2}
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* System summary */}
            <div className="p-3 bg-blue-50 rounded-xl text-xs text-gray-600">
              <span className="font-medium text-gray-900">Hệ thống đang chọn: </span>
              {combo.power ? `${combo.power} kWp — ` : ''}{(combo.price / 1000000).toFixed(1)} triệu đồng · Hoàn vốn {combo.paybackPeriod} năm
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : 'Gửi yêu cầu báo giá'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Hoặc gọi ngay{' '}
              <a href="tel:0962916488" className="text-blue-600 font-semibold hover:underline">0962 916 488</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function FinancialCard({ combo, mounted }: FinancialCardProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <GlassCard className="p-3 lg:p-4">
        <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Thông tin tài chính</h4>
        <div className="space-y-2">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <p className="text-xs text-gray-600 mb-0.5">Tổng chi phí</p>
            <p className="text-xl font-bold text-blue-600 animate-counter-up" suppressHydrationWarning>
              {mounted ? (combo.price / 1000000).toFixed(1) : '-'} triệu
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-50 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">Tiết kiệm/năm</p>
              <p className="text-sm font-bold text-green-600 animate-counter-up delay-100" suppressHydrationWarning>
                {mounted ? (combo.monthlySavings * 12 / 1000000).toFixed(1) : '-'}M
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">Hoàn vốn</p>
              <p className="text-sm font-bold text-amber-600 animate-counter-up delay-200" suppressHydrationWarning>
                {mounted ? combo.paybackPeriod : '-'} năm
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">ROI</p>
              <p className="text-sm font-bold text-purple-600 animate-counter-up delay-300" suppressHydrationWarning>
                {mounted ? combo.roi : '-'}%
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Xem chi tiết
          </button>
        </div>
      </GlassCard>

      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        combo={combo}
      />
    </>
  );
}

export default memo(FinancialCard);
