import { type ReactNode } from 'react';

export default function MaterialRow({
  name,
  warranty,
  quantity,
  icon,
  highlight = false,
}: {
  name: string;
  warranty: string;
  quantity: string;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="border-b border-gray-200 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.5fr)_88px_120px] sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f8fafc] text-gray-700 ring-1 ring-gray-200">{icon}</div>
            <p className="text-[14px] font-medium leading-6 text-gray-900 sm:text-[15px]">{name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 sm:block sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 sm:hidden">Số lượng</span>
            <div className={`text-right text-[14px] font-semibold sm:text-center sm:text-[15px] ${highlight ? 'text-[#ff6a00]' : 'text-gray-900'}`}>{quantity}</div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 sm:block sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 sm:hidden">Bảo hành</span>
            <div className="text-right text-[14px] text-gray-600 sm:text-right sm:text-[15px]">{warranty}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
