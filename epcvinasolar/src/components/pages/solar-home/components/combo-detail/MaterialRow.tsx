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
    <div className="grid grid-cols-[minmax(0,1.5fr)_88px_120px] gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f8fafc] text-gray-700 ring-1 ring-gray-200">{icon}</div>
          <p className="text-[15px] font-medium text-gray-900">{name}</p>
        </div>
      </div>
      <div className={`text-center text-[15px] font-semibold ${highlight ? 'text-[#ff6a00]' : 'text-gray-900'}`}>{quantity}</div>
      <div className="text-right text-[15px] text-gray-600">{warranty}</div>
    </div>
  );
}
