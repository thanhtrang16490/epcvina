import { CheckCircle } from '@phosphor-icons/react';

export default function ProcessFaqSection({
  faqExpanded,
  setFaqExpanded,
}: {
  faqExpanded: boolean;
  setFaqExpanded: (value: boolean) => void;
}) {
  return (
    <>
      <section className="rounded-[18px] border border-gray-200 bg-white p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Quy trình triển khai</p>
        <div className="mt-2 grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight text-gray-900">Các bước EPCVINA thực hiện sau khi khách quan tâm</h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-7 text-gray-600">
              Quy trình được trình bày theo hướng dễ theo dõi: khách hàng xem nhanh cách EPCVINA tiếp nhận, khảo sát, đề xuất phương án và bàn giao,
              để có cảm giác rõ ràng như một bộ hồ sơ triển khai thực tế.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Rõ đầu việc, dễ hiểu ngay trong 30 giây đầu.',
                'Mỗi bước đều gắn với một ảnh minh hoạ thực tế.',
                'Tạo cảm giác chuyên nghiệp, có quy trình.',
                'Giúp khách hàng yên tâm hơn trước khi để lại thông tin.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[16px] border border-gray-200 bg-[#fafafa] px-4 py-3">
                  <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[13px] leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-gray-200 bg-[#0b63ce] p-4 text-white shadow-[0_18px_50px_rgba(11,99,206,0.14)]">
            <div className="relative overflow-hidden rounded-[18px] bg-white/10">
              <img src="/images/combo/roof-bang/1.png" alt="Quy trình triển khai EPCVINA" className="h-[220px] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#073a78]/75 via-[#073a78]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">Ảnh minh hoạ</p>
                <h3 className="mt-1 text-[18px] font-semibold leading-snug">Từ tiếp nhận đến thi công, mọi bước đều có lộ trình rõ ràng</h3>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Tiếp nhận', 'Nhanh gọn'],
                ['Khảo sát', 'Tận nơi'],
                ['Báo giá', 'Rõ ràng'],
                ['Bàn giao', 'Đúng hẹn'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-white/65">{label}</p>
                  <p className="mt-1 text-[14px] font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {[
            {
              step: '01',
              title: 'Tiếp nhận yêu cầu',
              desc: 'Ghi nhận nhu cầu sử dụng điện, loại mái, mức đầu tư dự kiến và thông tin liên hệ để tư vấn nhanh.',
              image: '/images/combo/source-install.webp',
            },
            {
              step: '02',
              title: 'Khảo sát thực tế',
              desc: 'Kỹ sư kiểm tra mái, hướng nắng, kết cấu và các điều kiện kỹ thuật để xác định phương án phù hợp.',
              image: '/images/combo/roof-ton/1.png',
            },
            {
              step: '03',
              title: 'Thiết kế và báo giá',
              desc: 'Lên cấu hình combo, tối ưu vật tư và gửi báo giá chi tiết để khách hàng dễ so sánh, ra quyết định.',
              image: '/images/combo/source-cabinet.webp',
            },
            {
              step: '04',
              title: 'Thi công và bàn giao',
              desc: 'Triển khai lắp đặt, kiểm tra vận hành, hướng dẫn sử dụng và bàn giao hồ sơ theo đúng cam kết.',
              image: '/images/combo/source-grounding.webp',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`overflow-hidden rounded-[18px] border border-gray-200 bg-[#fafafa] ${index === 0 ? 'ring-1 ring-[#0B63CE]/10' : ''}`}
            >
              <div className="grid gap-0 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
                <div className="min-w-0 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-bold text-[#0B63CE] shadow-sm ring-1 ring-gray-200">
                      {item.step}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-gray-500">Bước {index + 1}</p>
                    </div>
                  </div>
                  <p className="mt-3 max-w-2xl text-[13px] leading-6 text-gray-600">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[18px] border border-gray-200 bg-white p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">FAQ</p>
        <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Câu hỏi thường gặp</h2>
        <div className="mt-5 space-y-3">
          {[
            {
              question: 'Cần bao nhiêu m² mái?',
              answer: 'Diện tích mái sẽ được tính theo công suất combo và điều kiện lắp đặt thực tế. Kỹ sư EPCVINA sẽ kiểm tra để xác nhận phương án phù hợp nhất.',
            },
            {
              question: 'Bao lâu hoàn vốn?',
              answer: 'Thời gian hoàn vốn phụ thuộc mức tiêu thụ điện, biểu giá điện và vị trí lắp đặt. Thông thường EPCVINA sẽ tư vấn con số ước tính ngay khi báo giá.',
            },
            {
              question: 'Có cần xin phép không?',
              answer: 'Tùy quy mô công trình và yêu cầu địa phương. EPCVINA sẽ hỗ trợ đánh giá hồ sơ cần thiết trước khi thi công để tránh phát sinh thủ tục.',
            },
            {
              question: 'Bảo hành gồm những gì?',
              answer: 'Bảo hành bao gồm thiết bị chính, hệ khung, tủ điện và các hạng mục liên quan theo từng cấu hình combo. Chi tiết sẽ được xác nhận trong báo giá.',
            },
            {
              question: 'Khi nào kỹ sư khảo sát?',
              answer: 'Sau khi tiếp nhận yêu cầu, EPCVINA sẽ liên hệ sớm để đặt lịch khảo sát mái và tư vấn phương án trong thời gian thuận tiện nhất cho khách hàng.',
            },
          ]
            .slice(0, faqExpanded ? 6 : 3)
            .map((item) => (
              <details key={item.question} className="group rounded-[16px] border border-gray-200 bg-[#fafafa] px-5 py-4 open:bg-white open:shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                <summary className="cursor-pointer list-none text-[16px] font-semibold text-gray-900">
                  <span className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-[20px] leading-none text-gray-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-7 text-gray-600">{item.answer}</p>
              </details>
            ))}
        </div>
        <div className="mt-6 flex justify-center">
          {!faqExpanded ? (
            <button
              type="button"
              onClick={() => setFaqExpanded(true)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094ea2]"
            >
              Xem thêm
            </button>
          ) : (
            <a href="/hoi-dap" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0B63CE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094ea2]">
              Xem tất cả
            </a>
          )}
        </div>
      </section>
    </>
  );
}
