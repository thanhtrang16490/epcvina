import { CheckCircle, Factory, FileText, Handshake, Medal, ShieldCheck } from '@phosphor-icons/react';

export default function SolarCapabilitySection() {
  return (
    <div className="rounded-[18px] border border-gray-200 bg-white p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Năng lực EPCVINA Solar</p>
      <div className="mt-2 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
        <div>
          <h2 className="text-[28px] font-semibold leading-tight text-gray-900">Năng lực triển khai và hệ thống kho hàng vật tư</h2>
          <p className="mt-3 text-[14px] leading-7 text-gray-600">
            EPCVINA Solar tổ chức theo mô hình vừa tư vấn, vừa cung ứng vật tư và vừa triển khai thi công, giúp rút ngắn thời gian chuẩn bị và đảm bảo tính đồng bộ của combo từ báo giá đến bàn giao.
          </p>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 rounded-[18px] border border-gray-200 bg-[#fafafa] p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white ring-1 ring-gray-200">
                <img src="/images/generated/sales-consultant-woman.png" alt="Đội ngũ bán hàng EPCVINA" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Đội ngũ bán hàng</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-700">Tư vấn cấu hình, ngân sách, hiệu quả hoàn vốn và hỗ trợ khách hàng ra quyết định nhanh, đúng nhu cầu.</p>
              </div>
            </div>

            <div className="grid gap-4 rounded-[18px] border border-gray-200 bg-[#fafafa] p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white ring-1 ring-gray-200">
                <img src="/images/generated/construction-engineer.png" alt="Đội ngũ thi công EPCVINA" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Đội ngũ thi công</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-700">Phụ trách khảo sát, bóc tách vật tư, lắp đặt và nghiệm thu theo tiêu chuẩn kỹ thuật thực tế.</p>
              </div>
            </div>

            <div className="rounded-[18px] border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-white ring-1 ring-gray-200">
                  <img src="/brands/sungrow.png" alt="Năng lực đối tác EPCVINA" className="h-full w-full object-contain p-2" loading="lazy" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Năng lực đối tác</p>
                  <p className="mt-1 text-[13px] leading-6 text-gray-600">
                    EPCVINA hợp tác với nhiều thương hiệu và nhà cung cấp trong hệ sinh thái điện mặt trời để đảm bảo nguồn hàng, độ tương thích thiết bị và tiến độ giao vật tư cho từng cấu hình combo.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ['Thương hiệu thiết bị', 'Tương thích cao với cấu hình thực tế'],
                  ['Nhà cung cấp vật tư', 'Nguồn hàng ổn định, chủ động tiến độ'],
                  ['Đơn vị thi công phối hợp', 'Hỗ trợ triển khai nhiều hạng mục đồng thời'],
                  ['Đối tác dự án', 'Phối hợp linh hoạt theo quy mô công trình'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[14px] border border-gray-200 bg-[#fafafa] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
                    <p className="mt-1 text-[13px] leading-6 text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 rounded-[18px] border border-[#0B63CE]/15 bg-[#eef6ff] p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white ring-1 ring-[#0B63CE]/10">
                <img src="/favicon.svg" alt="Lợi thế nền tảng cơ điện EPCVINA" className="h-full w-full object-contain p-4" loading="lazy" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0B63CE]">Lợi thế từ nền tảng cơ điện</p>
                <div className="mt-3 grid gap-3">
                  {[
                    'Gốc là nhà thầu cơ điện nên EPCVINA hiểu rõ kết cấu, đấu nối, an toàn điện và đồng bộ hệ thống ngay từ giai đoạn thiết kế.',
                    'Có kinh nghiệm phối hợp nhiều hạng mục MEP, giúp tối ưu tiến độ, hạn chế xung đột giữa mái, điện và hạ tầng công trình.',
                    'Cách triển khai thiên về kỹ thuật và kiểm soát chất lượng, phù hợp với công trình cần độ tin cậy cao.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                      <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0B63CE] text-white">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[13px] leading-6 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Có khả năng đáp ứng nhiều cấu hình combo khác nhau theo nhu cầu thực tế.',
                'Nguồn hàng vật tư được chuẩn hóa để giữ tiến độ triển khai ổn định.',
                'Quy trình kiểm tra - đóng gói - xuất kho hỗ trợ giảm sai lệch khi thi công.',
                'Phù hợp cả đơn hàng lẻ và các công trình cần phối hợp nhiều hạng mục.',
              ].map((item) => (
                <div key={item} className="rounded-[16px] border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] leading-6 text-gray-700">
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Nguồn hàng', 'Chủ động'],
                ['Vật tư', 'Đồng bộ'],
                ['Tiến độ', 'Nhanh'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] border border-gray-200 bg-white px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</p>
                  <p className="mt-2 text-[18px] font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { image: '/images/generated/warehouse-solar-panels.jpg', title: 'Kho tấm pin', desc: 'Tấm pin phổ biến cho nhiều cấu hình combo.' },
              { image: '/images/generated/warehouse-inverters.jpg', title: 'Kho biến tần', desc: 'Nhóm thiết bị trung tâm cho hệ thống.' },
              { image: '/images/generated/warehouse-cabinets.jpg', title: 'Tủ điện - phụ trợ', desc: 'Hạng mục phục vụ vận hành an toàn.' },
              { image: '/images/generated/warehouse-wiring-grounding.jpg', title: 'Dây - tiếp địa', desc: 'Vật tư hỗ trợ thi công và hoàn thiện.' },
            ].map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[18px] border border-gray-200 bg-[#fafafa]">
                <div className="relative aspect-square bg-white p-4">
                  <img src={item.image} alt={item.title} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="border-t border-gray-200 p-4">
                  <h3 className="text-[15px] font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-[13px] leading-6 text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}

            <div className="sm:col-span-2 space-y-4">
              <div className="rounded-[18px] border border-gray-200 bg-white p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Nhãn hàng phân phối</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Aiko', logo: '/brands/aiko.png' },
                    { name: 'Canadian Solar', logo: '/brands/canadian-solar.png' },
                    { name: 'Growatt', logo: '/brands/growatt.png' },
                    { name: 'Huawei', logo: '/brands/huawei.jpg' },
                    { name: 'Saj', logo: '/brands/saj.png' },
                    { name: 'Sungrow', logo: '/brands/sungrow.svg' },
                    { name: 'Deye', logo: '/brands/deye.png' },
                    { name: 'Pylontech', logo: '/brands/pylontech.svg' },
                  ].map((brand) => (
                    <div key={brand.name} className="flex items-center gap-3 rounded-[14px] border border-gray-200 bg-[#fafafa] px-3 py-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-white ring-1 ring-gray-200">
                        <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain p-1.5" loading="lazy" />
                      </div>
                      <span className="min-w-0 text-[13px] font-medium leading-5 text-gray-800">{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-gray-200 bg-white p-4 sm:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Chứng nhận & hệ thống quản lý</p>
                <p className="mt-2 max-w-3xl text-[13px] leading-6 text-gray-600">
                  Những tài liệu này hỗ trợ bộ phận mua hàng, chủ đầu tư và tư vấn kỹ thuật khi cần xác minh năng lực trước khi mời EPCVINA vào vòng chào giá hoặc đấu thầu.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: <Medal className="h-5 w-5 text-[#0B63CE]" />, title: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
                    { icon: <Factory className="h-5 w-5 text-[#0B63CE]" />, title: 'Năng lực MEP', desc: 'Thi công công trình công nghiệp' },
                    { icon: <ShieldCheck className="h-5 w-5 text-[#0B63CE]" />, title: 'An toàn lao động', desc: 'Quy trình an toàn thi công' },
                    { icon: <FileText className="h-5 w-5 text-[#0B63CE]" />, title: 'Hồ sơ pháp lý', desc: 'Đầy đủ năng lực và hồ sơ dự án' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[16px] border border-gray-200 bg-[#fafafa] p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#eaf2ff]">{item.icon}</div>
                        <div>
                          <h3 className="text-[14px] font-semibold text-gray-900">{item.title}</h3>
                          <p className="mt-1 text-[12px] leading-5 text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Khách hàng và đối tác</p>
                    <p className="mt-2 text-[13px] leading-6 text-gray-600">Danh sách dưới đây thể hiện nhóm khách hàng doanh nghiệp và đối tác tiêu biểu đã hợp tác cùng EPCVINA.</p>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full bg-[#eef6ff] px-4 py-2 text-[12px] font-semibold text-[#0B63CE] sm:inline-flex">
                    <Handshake className="h-4 w-4" />
                    Đối tác tiêu biểu
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { name: 'Samsung', logo: '/partners/samsung.svg' },
                    { name: 'VinFast', logo: '/partners/vinfast.png' },
                    { name: 'Vinhomes', logo: '/partners/vincom.webp' },
                    { name: 'Lotte', logo: '/partners/lotte.jpg' },
                    { name: 'Keangnam', logo: '/partners/keangnam.png' },
                    { name: 'Đại sứ quán HQ', logo: '/partners/korea-embassy.svg' },
                    { name: 'Coteccons', logo: '/partners/coteccons.png' },
                  ].map((brand) => (
                    <div key={brand.name} className="flex items-center gap-3 rounded-[14px] border border-gray-200 bg-[#fafafa] px-3 py-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-white ring-1 ring-gray-200">
                        <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain p-1.5" loading="lazy" />
                      </div>
                      <span className="min-w-0 text-[13px] font-medium leading-5 text-gray-800">{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
