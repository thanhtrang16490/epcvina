import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  LinkSimple,
  Megaphone,
  Phone,
  ShieldCheck,
  Sparkle,
  Target,
  Timer,
  Users,
  FileText,
  ChartLine,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { submitCrmLead, redirectToThankYou } from '../../../lib/crm-leads';

const benefits = [
  {
    title: 'Link giới thiệu riêng',
    desc: 'Mỗi đối tác có thể dùng link riêng để chia sẻ khách hàng và đo lường hiệu quả dễ dàng.',
    icon: <LinkSimple className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Tài liệu truyền thông',
    desc: 'EPCVINA cung cấp nội dung, hình ảnh, thông tin sản phẩm và gợi ý nội dung đăng bài.',
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Tư vấn chốt đơn',
    desc: 'Đội ngũ EPCVINA hỗ trợ tư vấn kỹ thuật, xử lý thắc mắc và đi cùng khách khi cần.',
    icon: <Megaphone className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Hoa hồng minh bạch',
    desc: 'Ghi nhận theo kết quả phát sinh, rõ ràng theo từng cơ hội hoặc chiến dịch.',
    icon: <ChartLine className="h-5 w-5" aria-hidden="true" />,
  },
];

const affiliateSteps = [
  'Đăng ký nhận link và bộ tài liệu tiếp thị.',
  'Chia sẻ qua mạng xã hội, website hoặc nhóm khách hàng.',
  'EPCVINA tiếp nhận, tư vấn và xử lý phần kỹ thuật.',
  'Báo cáo kết quả và nhận hoa hồng theo thỏa thuận.',
];

export default function AffiliateSalesPage({ pathname = '/' }: { pathname?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    channel: '',
    audience: '',
    message: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitCrmLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message || `Kênh: ${form.channel || 'Chưa cung cấp'}; Tệp khách: ${form.audience || 'Chưa cung cấp'}`,
        source_form: 'tiep_thi_lien_ket_page',
        metadata: {
          channel: form.channel,
          audience: form.audience,
          partnership_type: 'affiliate_sales',
        },
      });
      setDone(true);
      redirectToThankYou('tiep_thi_lien_ket_page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chưa gửi được thông tin.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f6f8fb] text-slate-900">
      <div className="hidden lg:block">
        <HeaderBar pathname={pathname} />
      </div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img src="/images/generated/tiep-thi-lien-ket-hero.png" alt="" className="h-full w-full object-cover opacity-55" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_35%),radial-gradient(circle_at_80%_10%,_rgba(16,185,129,0.06),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.5),_rgba(2,6,23,0.72))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 lg:pt-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
                <Sparkle className="h-4 w-4" aria-hidden="true" />
                Tiếp thị liên kết bán hàng cùng EPCVINA
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]">
                Chia sẻ link, EPCVINA lo phần tư vấn và chốt đơn
              </h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
                Bạn chỉ cần đưa khách hàng đến đúng link giới thiệu. EPCVINA sẽ hỗ trợ toàn bộ tài liệu,
                tư vấn kỹ thuật, theo dõi cơ hội và xử lý phần triển khai.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#dang-ky" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-400">
                  Đăng ký nhận link
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="tel:0988446113" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Hỏi chính sách
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Link riêng', 'Dễ theo dõi nguồn khách'],
                  ['Nội dung sẵn', 'Có tài liệu để chia sẻ'],
                  ['Hỗ trợ chốt', 'EPCVINA tư vấn phía sau'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm text-slate-300">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="rounded-2xl bg-white/95 p-5 text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Users className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-sky-700">Mô hình affiliate</div>
                    <div className="text-lg font-bold">Phù hợp người có mạng lưới khách hàng</div>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />Có thể đăng bài, gửi link hoặc nhúng trên website, fanpage.</li>
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />EPCVINA hỗ trợ tư vấn, khảo sát và báo giá khi khách quan tâm.</li>
                  <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />Có thể theo dõi kết quả hợp tác theo từng nguồn giới thiệu.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bạn sẽ nhận được gì?</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Mục tiêu là giúp bạn có sẵn công cụ để chia sẻ nhanh, còn EPCVINA đảm nhận phần cần chuyên môn và chốt bán hàng.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Quy trình làm việc</h2>
              <div className="mt-8 space-y-4">
                {affiliateSteps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="dang-ky" className="rounded-[28px] border border-sky-100 bg-sky-50 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700">
                <Target className="h-4 w-4" aria-hidden="true" />
                Nhận link giới thiệu
              </div>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">Để lại thông tin để EPCVINA liên hệ lại</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Chúng tôi sẽ tư vấn mô hình hợp tác, cách dùng link và bộ tài liệu phù hợp với kênh bạn đang có.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                {done && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Đã gửi thông tin, EPCVINA sẽ liên hệ lại sớm.</div>}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-name">Họ và tên</label>
                  <input id="affiliate-name" name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Nhập họ và tên" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-phone">Số điện thoại</label>
                  <input id="affiliate-phone" name="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Nhập số điện thoại" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-email">Email</label>
                    <input id="affiliate-email" name="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="name@email.com" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-channel">Kênh của bạn</label>
                    <input id="affiliate-channel" name="channel" value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Facebook, TikTok, website..." />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-audience">Tệp khách hàng</label>
                  <input id="affiliate-audience" name="audience" value={form.audience} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Chủ nhà, doanh nghiệp, nhà xưởng..." />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="affiliate-message">Ghi chú</label>
                  <textarea id="affiliate-message" name="message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Bạn muốn tham gia theo mô hình nào?" />
                </div>
                <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                  {submitting ? 'Đang gửi...' : 'Nhận link giới thiệu'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Những câu hỏi thường gặp</h2>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-slate-700 leading-relaxed">
                  Nếu bạn đang có cộng đồng, website hoặc tệp khách sẵn có, mô hình tiếp thị liên kết giúp bạn chuyển đổi khách hàng mà không cần tự xử lý phần kỹ thuật.
                </p>
              </div>
            </div>
            <aside className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-300">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                EPCVINA hỗ trợ phía sau
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3"><Timer className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />Phản hồi nhanh khi có lead mới hoặc khách quan tâm.</li>
                <li className="flex gap-3"><Users className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />Tư vấn cùng khách để tăng khả năng chốt đơn.</li>
                <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />Minh bạch ghi nhận theo cơ hội và thỏa thuận hợp tác.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
