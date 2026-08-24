export default function RightSidebarSection() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[18px] border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold">Cần tư vấn ngay?</h3>
          <p className="mt-2 text-sm text-emerald-100">
            Để lại số điện thoại, EPCVINA sẽ liên hệ lại và giải đáp nhanh các thắc mắc về mái, hoàn vốn và bảo hành.
          </p>
          <a
            href="tel:0988446113"
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Gọi tư vấn: 0988 446 113
          </a>
        </div>

        <div className="rounded-[18px] border border-gray-200 bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Cam kết</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
              Khảo sát mái miễn phí trước khi chốt phương án.
            </div>
            <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
              Báo giá minh bạch, rõ vật tư và hạng mục thi công.
            </div>
            <div className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] font-medium leading-6 text-gray-800">
              Phản hồi nhanh trong giờ hành chính.
            </div>
          </div>
        </div>
    </aside>
  );
}
