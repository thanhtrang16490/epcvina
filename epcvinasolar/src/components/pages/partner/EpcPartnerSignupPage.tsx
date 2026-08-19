import { useMemo, useState } from 'react';
import {
  CheckCircle,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  FileText,
  Users,
  Warehouse,
  ClipboardText,
  Lightning,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';

const benefits = [
  { icon: <Warehouse className="h-5 w-5" />, title: 'Tồn kho sẵn', desc: 'Chủ động giao hàng cho EPC, đại lý và nhà thầu.' },
  { icon: <FileText className="h-5 w-5" />, title: 'BOM / CO-CQ', desc: 'Hỗ trợ bộ hồ sơ theo dự án và tài liệu kỹ thuật.' },
  { icon: <Truck className="h-5 w-5" />, title: 'Giao toàn quốc', desc: 'Phối hợp xuất hàng theo tiến độ công trình.' },
  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Hàng chính hãng', desc: 'Thiết bị đầy đủ bảo hành và minh bạch xuất xứ.' },
];

const supportPoints = [
  'Báo giá sỉ theo số lượng / cấu hình',
  'Kiểm tra tồn kho và lead time',
  'Bộ tài liệu kỹ thuật cho EPC',
  'Hỗ trợ cấu hình và tương thích thiết bị',
  'Ưu tiên phản hồi trong giờ làm việc',
];

type FormState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  role: string;
  needs: string;
  volume: string;
};

export default function EpcPartnerSignupPage() {
  const [form, setForm] = useState<FormState>({
    company: '',
    name: '',
    phone: '',
    email: '',
    province: '',
    role: '',
    needs: '',
    volume: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const readinessLabel = useMemo(() => {
    const parts = [];
    if (form.role) parts.push(form.role);
    if (form.needs) parts.push(form.needs);
    if (form.volume) parts.push(form.volume);
    return parts.filter(Boolean).join(' • ') || 'EPC / nhà thầu / đại lý';
  }, [form.needs, form.role, form.volume]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitCrmLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: [
          `Công ty: ${form.company || 'N/A'}`,
          `Khu vực: ${form.province || 'N/A'}`,
          `Vai trò: ${form.role || 'N/A'}`,
          `Nhu cầu: ${form.needs || 'N/A'}`,
          `Số lượng / quy mô: ${form.volume || 'N/A'}`,
        ].join('\n'),
        source_form: 'epc_partner_signup',
        metadata: {
          company: form.company,
          province: form.province,
          role: form.role,
          needs: form.needs,
          volume: form.volume,
        },
      });
      setSubmitted(true);
      redirectToThankYou('epc_partner_signup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chưa gửi được thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <HeaderBar />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/4 rounded-full bg-orange-500/25" />
          <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/4 translate-y-1/3 rounded-full bg-cyan-500/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                Đăng ký đối tác EPC
              </div>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Nhanh chóng đăng ký để nhận giá dự án, tồn kho và hỗ trợ kỹ thuật
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                EPCVINA hỗ trợ EPC, nhà thầu, đại lý và đội thi công trên toàn quốc với thiết bị chính hãng, BOM, CO/CQ và phản hồi báo giá theo dự án.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Giá sỉ', 'Theo số lượng & cấu hình'],
                  ['Kho hàng', 'Kiểm tra lead time'],
                  ['Hồ sơ', 'BOM / datasheet / CO-CQ'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{k}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#epc-signup-form"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-400 active:scale-[0.98]"
                >
                  Đăng ký ngay
                </a>
                <a
                  href="tel:0988446113"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
                >
                  Gọi EPCVINA
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Quyền lợi đối tác</p>
                  <p className="mt-1 text-lg font-bold text-white">Dành cho EPC / nhà thầu / đại lý</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-200">
                      {item.icon}
                    </div>
                    <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                <Package className="h-4 w-4" />
                Hỗ trợ đối tác
              </div>
              <h2 className="mt-2 text-2xl font-black text-slate-950">EPCVINA hỗ trợ gì cho đối tác?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {supportPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" weight="fill" />
                    <p className="text-sm leading-relaxed text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                <ClipboardText className="h-4 w-4" />
                Quy trình hợp tác
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  'Gửi form đăng ký đối tác EPC',
                  'EPCVINA xác nhận nhu cầu và nhóm hàng',
                  'Kiểm tra tồn kho / lead time / BOM',
                  'Chốt báo giá và phương án giao hàng',
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="epc-signup-form" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Form đăng ký</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Đăng ký đối tác EPC</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Gửi thông tin công ty, khu vực và nhu cầu để EPCVINA phản hồi nhanh về giá dự án, tồn kho và tài liệu kỹ thuật.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" weight="fill" />
                <p className="mt-4 text-lg font-bold text-slate-950">Đã ghi nhận đăng ký đối tác</p>
                <p className="mt-2 text-sm text-slate-600">
                  EPCVINA sẽ liên hệ lại sớm để xác nhận nhu cầu và hỗ trợ báo giá.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tên công ty</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Công ty ABC"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Người liên hệ</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="0988 446 113"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="email@congty.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tỉnh / thành</label>
                    <input
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      placeholder="Hà Nội, Hải Phòng..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Vai trò</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="">Chọn vai trò</option>
                      <option value="EPC">EPC</option>
                      <option value="Nhà thầu">Nhà thầu</option>
                      <option value="Đại lý">Đại lý / reseller</option>
                      <option value="M&E">M&E / tư vấn</option>
                      <option value="Chủ đầu tư">Chủ đầu tư</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nhu cầu thiết bị</label>
                  <input
                    name="needs"
                    value={form.needs}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Tấm pin, inverter, pin lưu trữ, mounting..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Số lượng / quy mô</label>
                  <input
                    name="volume"
                    value={form.volume}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="VD: 50 bộ / 1MWp / 20 container"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    <Lightning className="h-4 w-4" />
                    Tóm tắt nhu cầu
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{readinessLabel}</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-400 disabled:opacity-60"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đăng ký đối tác'}
                </button>
              </form>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="tel:0988446113" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-200 hover:text-orange-600">
                <Phone className="h-4 w-4" />
                Hotline EPCVINA
              </a>
              <a href="https://zalo.me/0368927332" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-200 hover:text-orange-600">
                <Users className="h-4 w-4" />
                Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
