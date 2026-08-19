import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { useMemo } from 'react';

interface EquipmentAlibabaHeaderProps {
  title: string;
  subtitle: string;
}

export default function EquipmentAlibabaHeader({ title, subtitle }: EquipmentAlibabaHeaderProps) {
  const searchPlaceholder = useMemo(() => title || 'Tìm thiết bị, thương hiệu, model', [title]);

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
              <span className="text-[12px] text-gray-500">Deliver to:</span>
              <span className="font-semibold">VN</span>
            </div>
            <a href="/dang-ky" className="inline-flex items-center rounded-full bg-[#ff6a00] px-5 py-2.5 font-semibold text-white shadow-sm">
              Đăng ký
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-[#ededed] py-3 text-[14px] text-gray-700">
          <div className="flex min-w-0 items-center gap-8 overflow-x-auto whitespace-nowrap pr-4">
            <span className="font-medium">☰ Tất cả danh mục</span>
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
