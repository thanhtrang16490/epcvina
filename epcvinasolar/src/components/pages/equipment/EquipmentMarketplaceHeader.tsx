import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';

interface EquipmentMarketplaceHeaderProps {
  title: string;
  subtitle: string;
}

export default function EquipmentMarketplaceHeader({ title, subtitle }: EquipmentMarketplaceHeaderProps) {
  const searchPlaceholder = useMemo(() => title || 'Tìm thiết bị, thương hiệu, model', [title]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const megaMenuSections = [
    {
      title: 'Thiết bị chính',
      items: [
        { label: 'Tấm quang năng', href: '/thiet-bi/panel' },
        { label: 'Biến tần On-Grid', href: '/thiet-bi/on-grid-inverter' },
        { label: 'Biến tần Hybrid', href: '/thiet-bi/hybrid-inverter' },
        { label: 'Pin lưu trữ áp cao', href: '/thiet-bi/hv-battery' },
        { label: 'Pin lưu trữ áp thấp', href: '/thiet-bi/lv-battery' },
      ],
    },
    {
      title: 'Phụ kiện & tủ điện',
      items: [
        { label: 'Hệ khung nhôm', href: '/thiet-bi/mounting' },
        { label: 'Hệ dây điện', href: '/thiet-bi/wiring' },
        { label: 'Tủ điện', href: '/thiet-bi/cabinet' },
        { label: 'Hệ tiếp địa', href: '/thiet-bi/grounding' },
      ],
    },
    {
      title: 'Giải pháp ứng dụng',
      items: [
        { label: 'Điện công nghiệp', href: '/ung-dung/dien-cong-nghiep' },
        { label: 'Điện dân dụng', href: '/ung-dung/dien-dan-dung' },
        { label: 'Điện nông nghiệp', href: '/ung-dung/dien-nong-nghiep' },
        { label: 'Combo hệ thống', href: '/solar-home/he-thong' },
      ],
    },
    {
      title: 'Thương hiệu',
      items: [
        { label: 'AIKO', href: '/nhan-hang/aiko' },
        { label: 'Huawei', href: '/nhan-hang/huawei' },
        { label: 'Growatt', href: '/nhan-hang/growatt' },
        { label: 'Pylontech', href: '/nhan-hang/pylontech' },
        { label: 'Xem tất cả nhãn hàng', href: '/nhan-hang' },
      ],
    },
  ];

  return (
    <header className="border-b border-[#e7e7e7] bg-white">
      <div className="bg-gradient-to-r from-[#b6f0de] via-[#d6f7ea] to-[#19c3b6] text-[#0f172a]">
        <div className="mx-auto flex max-w-[1824px] items-center justify-between gap-4 px-3 py-2 text-[13px] sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-4 truncate">
              <span className="hidden truncate text-[#0b3a2d] sm:inline">
              EPCVINA Solar - Thiết bị chính hãng, tồn kho sẵn, báo giá nhanh cho EPC toàn quốc
            </span>
          </div>
          <a
            href="/bao-gia"
            className="flex items-center gap-2 rounded-full bg-[#0d2b23] px-4 py-1.5 font-semibold text-white transition hover:bg-[#081f19]"
          >
            <span>Nhận báo giá</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1824px] px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 py-4">
          <a href="/thiet-bi" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo-epcvina-solar.png" alt="EPCVINA Solar" className="h-10 w-auto" />
          </a>

          <div className="min-w-0">
            <div className="flex items-stretch rounded-full border-2 border-[#ff6a00] bg-white shadow-[0_8px_24px_-18px_rgba(255,106,0,.55)]">
              <input
                type="text"
                value={searchPlaceholder}
                readOnly
                className="min-w-0 flex-1 rounded-full bg-transparent px-6 py-4 text-[16px] text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                className="m-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a19] to-[#ff5a00] px-6 py-3 text-[15px] font-semibold text-white shadow-sm"
              >
              <MagnifyingGlass className="h-4 w-4" />
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[14px] text-gray-800">
            <div className="hidden flex-col leading-tight xl:flex">
              <span className="text-[12px] text-gray-500">Giao đến:</span>
              <span className="font-semibold">VN</span>
            </div>
            <a href="/dang-ky" className="inline-flex items-center rounded-full bg-[#ff6a00] px-5 py-2.5 font-semibold text-white shadow-sm">
              Đăng ký
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-6 border-t border-[#ededed] py-3 text-[14px] text-gray-700">
          <div className="relative flex min-w-0 items-center gap-8 overflow-x-auto whitespace-nowrap pr-4">
            <button
              type="button"
              onClick={() => setIsMegaMenuOpen((current) => !current)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition ${
                isMegaMenuOpen ? 'border-[#ff6a00] bg-[#fff7f2] text-[#c24f00]' : 'border-transparent bg-transparent text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="text-[16px]">☰</span>
              <span>Tất cả danh mục</span>
            </button>
            {isMegaMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[min(1120px,calc(100vw-24px))] rounded-[20px] border border-gray-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {megaMenuSections.map((section) => (
                    <div key={section.title} className="min-w-0">
                      <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-gray-500">{section.title}</p>
                      <div className="mt-3 space-y-1">
                        {section.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="block rounded-xl px-3 py-2 text-[14px] text-gray-700 transition hover:bg-[#fff7f2] hover:text-[#c24f00]"
                            onClick={() => setIsMegaMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-[#f8fafc] px-4 py-3">
                  <p className="text-[13px] text-gray-600">
                    EPCVINA phân phối thiết bị solar cho nhà ở, đại lý và EPC toàn quốc.
                  </p>
                  <a
                    href="/thiet-bi"
                    className="inline-flex items-center rounded-full bg-[#ff6a00] px-4 py-2 text-[13px] font-semibold text-white"
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    Xem toàn bộ thiết bị
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="hidden items-center gap-8 lg:flex">
            <a href="/gioi-thieu" className="hover:text-[#ff6a00]">Về EPCVINA</a>
            <a href="/trung-tam-ho-tro" className="hover:text-[#ff6a00]">Trung tâm trợ giúp</a>
            <a href="/ban-hang" className="hover:text-[#ff6a00]">Bán hàng cùng EPCVINA</a>
          </div>
        </div>
      </div>
    </header>
  );
}
