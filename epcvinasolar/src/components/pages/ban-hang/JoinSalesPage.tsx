import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Handshake,
  Headphones,
  Phone,
  ShieldCheck,
  Sparkle,
  Target,
  Timer,
  Users,
  FileText,
  ChartLine,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';
import { submitCrmLead, redirectToThankYou } from '../../../lib/crm-leads';

const supportItems = [
  {
    title: 'Tài liệu bán hàng đầy đủ',
    desc: 'Slide, brochure, checklist khảo sát, mẫu báo giá và câu hỏi thường gặp để bạn tự tin làm việc với khách.',
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Tư vấn cùng EPCVINA',
    desc: 'Đội ngũ kỹ thuật và kinh doanh hỗ trợ chốt phương án, giải thích lợi ích và xử lý các câu hỏi khó.',
    icon: <Headphones className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Giám sát cơ hội',
    desc: 'Đồng hành xuyên suốt để theo dõi tiến độ, phân loại lead và tránh bỏ sót khách hàng tiềm năng.',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Hoa hồng rõ ràng',
    desc: 'Chính sách thưởng theo kết quả, minh bạch theo dự án, giúp bạn có hướng phát triển lâu dài.',
    icon: <ChartLine className="h-5 w-5" aria-hidden="true" />,
  },
];

const steps = [
  'Đăng ký thông tin và khu vực bạn muốn khai thác.',
  'Nhận bộ tài liệu, kịch bản tư vấn và hướng dẫn làm việc.',
  'EPCVINA hỗ trợ tư vấn kỹ thuật, khảo sát và báo giá.',
  'Chốt đơn, triển khai và nhận hoa hồng theo thỏa thuận.',
];

const faqs = [
  {
    q: 'Tôi có cần kinh nghiệm ngành điện mặt trời không?',
    a: 'Không bắt buộc. EPCVINA sẽ cung cấp tài liệu, kịch bản tư vấn và hỗ trợ kỹ thuật để bạn bắt đầu nhanh hơn.',
  },
  {
    q: 'EPCVINA hỗ trợ những gì?',
    a: 'Chúng tôi hỗ trợ toàn bộ tài liệu bán hàng, tư vấn giải pháp, giám sát cơ hội và phối hợp khảo sát khi cần.',
  },
  {
    q: 'Hoa hồng được tính thế nào?',
    a: 'Hoa hồng được trao đổi minh bạch theo từng dự án hoặc từng nhóm sản phẩm phù hợp, tùy mô hình hợp tác.',
  },
  {
    q: 'Tôi có thể làm bán thời gian không?',
    a: 'Có. Bạn có thể chủ động thời gian, tự khai thác khách hàng và nhận hỗ trợ từ EPCVINA khi cần.',
  },
];

export default function JoinSalesPage({ pathname = '/' }: { pathname?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    experience: '',
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
        message: form.message || `Khu vực: ${form.area || 'Chưa cung cấp'}; Kinh nghiệm: ${form.experience || 'Chưa cung cấp'}`,
        source_form: 'ban_hang_page',
        metadata: {
          area: form.area,
          experience: form.experience,
        },
      });
      redirectToThankYou('ban_hang_page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chưa gửi được thông tin.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f4f7f5] text-slate-900">
      <div className="hidden lg:block">
        <HeaderBar pathname={pathname} />
      </div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img src="/images/generated/ban-hang-hero.png" alt="" className="h-full w-full object-cover opacity-55" loading="eager" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_35%),radial-gradient(circle_at_80%_10%,_rgba(34,197,94,0.06),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.5),_rgba(2,6,23,0.72))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 lg:pt-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <Sparkle className="h-4 w-4" aria-hidden="true" />
                Cùng EPCVINA phát triển kênh bán hàng
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]">
                Tham gia bán hàng cùng EPCVINA Solar
              </h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
                Bạn có thể chủ động tìm khách, EPCVINA sẽ hỗ trợ toàn bộ tài liệu, tư vấn kỹ thuật,
                giám sát cơ hội và đồng hành trong suốt quá trình chốt đơn.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#dang-ky"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
                >
                  Đăng ký ngay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="tel:0988446113"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Gọi EPCVINA
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Tài liệu', 'Đầy đủ và dễ dùng'],
                  ['Tư vấn', 'Có người đồng hành'],
                  ['Giám sát', 'Theo dõi cơ hội sát sao'],
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Handshake className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">Mô hình hợp tác</div>
                    <div className="text-lg font-bold">Bán hàng linh hoạt, hỗ trợ trọn gói</div>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    EPCVINA cung cấp bộ tài liệu bán hàng và thông tin sản phẩm chuẩn hóa.
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    Hỗ trợ tư vấn kỹ thuật và giám sát để bạn yên tâm làm việc với khách.
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    Phù hợp cho cộng tác viên cá nhân, đội nhóm bán hàng hoặc đơn vị kết nối dự án.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">EPCVINA hỗ trợ bạn như thế nào?</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Trang bị sẵn công cụ, kịch bản và lớp hỗ trợ để bạn có thể bắt đầu công tác bán hàng nhanh hơn và tự tin hơn.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {supportItems.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Quy trình hợp tác ngắn gọn</h2>
              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="dang-ky" className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                <Target className="h-4 w-4" aria-hidden="true" />
                Đăng ký nhận hỗ trợ
              </div>
              <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">Để lại thông tin để EPCVINA liên hệ lại</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Chúng tôi sẽ gọi lại, trao đổi về khu vực bạn muốn làm, kinh nghiệm hiện có và cách EPCVINA hỗ trợ bạn tốt nhất.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-name">Họ và tên</label>
                  <input
                    id="sales-name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-phone">Số điện thoại</label>
                  <input
                    id="sales-phone"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-email">Email</label>
                    <input
                      id="sales-email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      placeholder="name@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-area">Khu vực</label>
                    <input
                      id="sales-area"
                      name="area"
                      value={form.area}
                      onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      placeholder="Ví dụ: Hà Nội, Hưng Yên..."
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-experience">Kinh nghiệm</label>
                  <input
                    id="sales-experience"
                    name="experience"
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Ví dụ: sales, M&E, xây dựng, điện..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="sales-message">Ghi chú</label>
                  <textarea
                    id="sales-message"
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Bạn muốn làm cộng tác viên, đại lý hay kết nối khách hàng?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="text-xs text-slate-500">EPCVINA sẽ liên hệ lại để tư vấn mô hình hợp tác phù hợp nhất.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Câu hỏi thường gặp</h2>
              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
                    <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900 flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-2xl leading-none text-slate-400 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                <Users className="h-4 w-4" aria-hidden="true" />
                Dành cho ai?
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3"><MagnifyingGlass className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />Người muốn tham gia bán hàng ngành điện mặt trời nhưng chưa có tài liệu chuẩn.</li>
                <li className="flex gap-3"><Timer className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />Người cần một bên kỹ thuật hỗ trợ tư vấn và giám sát cơ hội.</li>
                <li className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />Đơn vị muốn có thêm nguồn sản phẩm, giải pháp và đầu mối triển khai.</li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                EPCVINA hỗ trợ song song cả tài liệu, tư vấn, giám sát và phối hợp triển khai để bạn tập trung vào việc tìm khách hàng.
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
