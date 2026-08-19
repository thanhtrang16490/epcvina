'use client';

import { useState } from 'react';
import { redirectToThankYou, submitCrmLead } from '../../../lib/crm-leads';
import { TECHNICAL_ZALO_URL } from '../../../lib/contact';

type FormState = {
  name: string;
  phone: string;
  school: string;
  age: string;
  note: string;
  schedule: string;
};

export default function InternshipRecruitmentForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    school: '',
    age: '',
    note: '',
    schedule: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buildMessage = () =>
    [
      'Ứng tuyển thực tập sinh kỹ sư điện mặt trời từ website EPCVINA Solar:',
      `Họ tên: ${form.name}`,
      `Số điện thoại: ${form.phone}`,
      `Trường: ${form.school}`,
      `Tuổi: ${form.age}`,
      form.schedule ? `Hình thức mong muốn: ${form.schedule}` : '',
      form.note ? `Mong muốn / câu hỏi: ${form.note}` : '',
    ].filter(Boolean).join('\n');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const message = buildMessage();
    try {
      await submitCrmLead({
        name: form.name,
        phone: form.phone,
        message,
        source_form: 'internship_solar_engineer',
          metadata: {
            school: form.school,
            age: form.age,
            schedule: form.schedule || undefined,
            note: form.note || undefined,
            role: 'Thực tập sinh kỹ sư điện mặt trời',
          },
        });
      setSubmitted(true);
      redirectToThankYou('internship_solar_engineer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chưa thể gửi thông tin. Vui lòng thử lại.');
      window.open(`${TECHNICAL_ZALO_URL}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 sm:py-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Đã gửi thông tin thành công</h3>
        <p className="text-gray-600">Bộ phận tuyển dụng sẽ liên hệ bạn sớm nhất có thể.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên <span className="text-red-500">*</span></label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nguyễn Văn A"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="0912 345 678"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Trường <span className="text-red-500">*</span></label>
          <input
            name="school"
            type="text"
            required
            value={form.school}
            onChange={(event) => setForm((prev) => ({ ...prev, school: event.target.value }))}
            placeholder="Đại học Bách Khoa Hà Nội"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuổi <span className="text-red-500">*</span></label>
          <input
            name="age"
            type="number"
            min="16"
            max="35"
            required
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
            placeholder="21"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi / mong muốn từ ứng viên</label>
        <textarea
          name="note"
          rows={4}
          value={form.note}
          onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
          placeholder="Ví dụ: Em muốn thực tập part-time, muốn học thiết kế hệ thống, hoặc có câu hỏi về chi phí hỗ trợ..."
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hình thức mong muốn</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-red-300">
            <input
              type="radio"
              name="schedule"
              value="Part-time"
              checked={form.schedule === 'Part-time'}
              onChange={(event) => setForm((prev) => ({ ...prev, schedule: event.target.value }))}
              className="h-4 w-4 accent-red-600"
            />
            <span className="text-sm font-medium text-gray-800">Part-time</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-red-300">
            <input
              type="radio"
              name="schedule"
              value="Full-time"
              checked={form.schedule === 'Full-time'}
              onChange={(event) => setForm((prev) => ({ ...prev, schedule: event.target.value }))}
              className="h-4 w-4 accent-red-600"
            />
            <span className="text-sm font-medium text-gray-800">Full-time</span>
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-amber-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-red-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Đang gửi...' : 'Gửi thông tin ứng tuyển'}
      </button>
      <p className="text-xs text-gray-500 text-center">
        Dữ liệu được gửi vào lead của EPCVINA Solar. Nếu cần, bạn cũng có thể bấm nút Zalo ở phần đầu trang.
      </p>
    </form>
  );
}
