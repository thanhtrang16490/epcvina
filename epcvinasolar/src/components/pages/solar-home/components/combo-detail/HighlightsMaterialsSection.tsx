import { BatteryHigh, Sun, type ReactNode } from '@phosphor-icons/react';
import DetailRow from './DetailRow';
import MaterialRow from './MaterialRow';

export default function HighlightsMaterialsSection({
  data,
  systemLabel,
  phaseLabel,
  roofArea,
  avgProduction,
  isHybrid,
  materialIcons,
  panelModel,
  panelQuantity,
  inverterModel,
  inverterQuantity,
}: {
  data: {
    title: string;
    voltage: 'low' | 'high' | null;
    power_kw: number;
    production_min_kwh: number;
    production_max_kwh: number;
    payback_label: string;
    battery_kwh?: number;
  };
  systemLabel: string;
  phaseLabel: string;
  roofArea: number;
  avgProduction: number;
  isHybrid: boolean;
  materialIcons: Record<'panel' | 'inverter' | 'rail' | 'wiring' | 'cabinet' | 'grounding' | 'install', ReactNode>;
  panelModel: string;
  panelQuantity: number;
  inverterModel: string;
  inverterQuantity: number;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[18px] bg-[#eef6ff] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded bg-white ring-1 ring-black/5">
            {isHybrid ? <BatteryHigh className="h-6 w-6 text-blue-600" /> : <Sun className="h-6 w-6 text-amber-500" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[18px] font-semibold text-gray-900">{data.title}</p>
              <span className={`rounded px-2 py-0.5 text-[12px] font-semibold ${isHybrid ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{systemLabel}</span>
            </div>
            <p className="mt-1 text-[13px] text-gray-600">
              {phaseLabel}
              {data.voltage ? ` · ${data.voltage === 'high' ? 'áp cao' : 'áp thấp'}` : ''} · {data.power_kw} kWp
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{roofArea} m² mái</span>
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.payback_label} hoàn vốn</span>
              {isHybrid && data.battery_kwh ? <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-gray-700">{data.battery_kwh} kWh pin</span> : null}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-[16px] bg-white p-4">
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">
              {data.power_kw} <span className="text-[12px] font-medium text-gray-500">kWp</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-600">Công suất</p>
          </div>
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">~{avgProduction}</p>
            <p className="mt-2 text-[13px] text-gray-600">kWh/tháng</p>
          </div>
          <div>
            <p className="text-[17px] font-bold leading-none text-gray-900">{data.payback_label}</p>
            <p className="mt-2 text-[13px] text-gray-600">Hoàn vốn</p>
          </div>
        </div>
      </div>
      <div className="rounded-[18px] border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Thông số kỹ thuật</h3>
        <div className="overflow-hidden rounded-[12px] border border-gray-200">
          <DetailRow label="Hệ thống" value={systemLabel} />
          <DetailRow label="Pha" value={phaseLabel} />
          {data.voltage ? <DetailRow label="Điện áp" value={data.voltage === 'high' ? 'Áp cao' : 'Áp thấp'} /> : null}
          <DetailRow label="Công suất" value={`${data.power_kw} kWp`} />
          <DetailRow label="Sản lượng" value={`${data.production_min_kwh} - ${data.production_max_kwh} kWh/tháng`} />
          <DetailRow label="Mái yêu cầu" value={`~${roofArea} m²`} />
        </div>
      </div>
      <div className="rounded-[18px] border border-gray-200 bg-white p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">Bản kê chi tiết vật tư</p>
        <h3 className="mt-2 text-[22px] font-semibold leading-tight text-gray-900">Danh sách vật tư chính</h3>
        <div className="mt-5 overflow-hidden rounded-[18px] border border-gray-200">
          <div className="grid grid-cols-[minmax(0,1.5fr)_88px_120px] gap-4 border-b border-gray-200 bg-[#fafafa] px-5 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Nhóm vật tư</p>
            <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Số lượng</p>
            <p className="pr-1 text-right text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">Bảo hành</p>
          </div>
          <div className="bg-white">
            <MaterialRow icon={materialIcons.panel} name={`${panelModel} tấm pin`} warranty="12 năm" quantity={`${panelQuantity} tấm`} highlight />
            <MaterialRow icon={materialIcons.inverter} name={`${inverterModel} biến tần`} warranty="5 năm" quantity={`${inverterQuantity} bộ`} />
            <MaterialRow icon={materialIcons.rail} name="Hệ khung nhôm" warranty="5 năm" quantity="1 bộ" />
            <MaterialRow icon={materialIcons.wiring} name="Hệ dây điện" warranty="5 năm" quantity="1 bộ" />
            <MaterialRow icon={materialIcons.cabinet} name="Tủ điện" warranty="2 năm" quantity="1 bộ" />
            <MaterialRow icon={materialIcons.grounding} name="Hệ tiếp địa" warranty="2 năm" quantity="1 bộ" />
            <MaterialRow icon={materialIcons.install} name="Vận chuyển + lắp đặt" warranty="--" quantity="1 gói" />
          </div>
        </div>
      </div>
    </div>
  );
}
