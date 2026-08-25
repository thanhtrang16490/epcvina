import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretRight, MagnifyingGlass, ArrowUp, ArrowDown, X } from '@phosphor-icons/react';
import type { ComboCardData } from './ComboListingCard';

type SortKey = 'power-asc' | 'power-desc' | 'price-asc' | 'price-desc';

type TableSection = {
  key: string;
  title: string;
  filter: (combo: ComboCardData) => boolean;
};

const TABLE_SECTIONS: TableSection[] = [
  {
    key: 'on-grid-1pha',
    title: 'Danh mục: On-grid - 1 pha',
    filter: (combo) => combo.system_type === 'on-grid' && combo.phase === '1-phase',
  },
  {
    key: 'on-grid-3pha',
    title: 'Danh mục: On-grid - 3 pha',
    filter: (combo) => combo.system_type === 'on-grid' && combo.phase === '3-phase',
  },
  {
    key: 'hybrid-1pha',
    title: 'Danh mục: Hybrid - 1 pha',
    filter: (combo) => combo.system_type === 'hybrid' && combo.phase === '1-phase',
  },
  {
    key: 'hybrid-1pha-lv',
    title: 'Danh mục: Hybrid - 3 pha áp thấp',
    filter: (combo) => combo.system_type === 'hybrid' && combo.phase === '3-phase' && combo.voltage === 'low',
  },
  {
    key: 'hybrid-1pha-hv',
    title: 'Danh mục: Hybrid - 3 pha áp cao',
    filter: (combo) => combo.system_type === 'hybrid' && combo.phase === '3-phase' && combo.voltage === 'high',
  },
];

export default function ComboTablePage() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [systemType, setSystemType] = useState<'all' | 'on-grid' | 'hybrid'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('power-asc');
  const [modalCombo, setModalCombo] = useState<ComboCardData | null>(null);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos');
        const json = await res.json();
        const data = json.data || json;

        if (Array.isArray(data) && data.length > 0) {
          const mapped: ComboCardData[] = data.map((c: any) => ({
            id: c.slug || c.id,
            slug: c.slug || c.id,
            name: c.name,
            power: c.power || c.power_kw || 0,
            battery: c.battery || c.battery_kwh || 0,
            price: c.price || c.investment_million_vnd * 1000000 || 0,
            system_type: c.system_type || c.systemType || 'on-grid',
            phase: c.phase || '1-phase',
            panel_brand: c.panel_brand || c.panelBrand,
            inverter_brand: c.inverter_brand || c.inverterBrand,
            inverter_model: c.inverter_model || c.inverterModel,
            battery_brand: c.battery_brand,
            battery_model: c.battery_model || c.batteryModel,
            panel_count: c.panelCount || c.panel_count,
            inverter_count: c.inverterCount || c.inverter_count,
            battery_count: c.batteryCount || c.battery_count,
            panel_warranty: c.warranty?.panel,
            inverter_warranty: c.warranty?.inverter,
            battery_warranty: c.warranty?.battery,
            monthly_production: c.monthly_production,
            payback_period: c.payback_period || c.payback_years,
            installation_area: c.installation_area || c.roof_area_m2,
            is_popular: c.is_popular,
            voltage: c.voltage,
            raw: c,
          }));
          setCombos(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch combos for table page:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCombos();
  }, []);

  const filtered = useMemo(() => {
    let list = [...combos];

    if (systemType !== 'all') {
      list = list.filter((combo) => combo.system_type === systemType);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((combo) =>
        combo.name.toLowerCase().includes(q) ||
        (combo.panel_brand || '').toLowerCase().includes(q) ||
        (combo.inverter_brand || '').toLowerCase().includes(q) ||
        (combo.battery_brand || '').toLowerCase().includes(q) ||
        combo.slug.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'power-desc':
          return b.power - a.power;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return a.power - b.power;
      }
    });

    return list;
  }, [combos, search, sortBy, systemType]);

  const sectionedCombos = TABLE_SECTIONS.map((section) => {
    let sectionCombos = filtered.filter(section.filter);
    if (sectionCombos.length === 0) return null;
    return { ...section, combos: sectionCombos };
  }).filter(Boolean) as Array<TableSection & { combos: ComboCardData[] }>;

  const formatPower = (value: number | string | undefined, unit: 'kWp' | 'kW' | 'kWh') => {
    if (value === undefined || value === null || value === '') return '';
    const normalized = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(normalized)) return `${value} ${unit}`;
    return `${new Intl.NumberFormat('vi-VN').format(normalized)} ${unit}`;
  };

  const getDeviceHead = (
    brand: string | undefined,
    powerLabel: string,
    fallback = '-',
  ) => {
    if (!brand) return fallback;
    return powerLabel ? `${brand} - ${powerLabel}` : brand;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <section className="rounded-[24px] border border-[#e7e7e7] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[#ededed] pb-3 text-[14px] text-gray-700">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap pr-4">
            <a href="/" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Trang chủ</a>
            <CaretRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
            <a href="/goi-combo" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Gói combo</a>
            <CaretRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
            <span className="min-w-0 truncate font-medium text-gray-900">Table kiểm tra dữ liệu</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Danh sách combo</p>
            <h1 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">Bảng kiểm tra dữ liệu combo</h1>
            <p className="mt-1 text-sm text-gray-500">Dùng để rà nhanh dữ liệu combo, công suất, giá và thông tin thương hiệu từ API.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[720px]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Tìm kiếm</span>
              <div className="relative">
                <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tên, thương hiệu, slug..."
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Loại hệ</span>
              <select
                value={systemType}
                onChange={(e) => setSystemType(e.target.value as typeof systemType)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="all">Tất cả</option>
                <option value="on-grid">On-Grid</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Sắp xếp</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="power-asc">Công suất tăng</option>
                <option value="power-desc">Công suất giảm</option>
                <option value="price-asc">Giá tăng</option>
                <option value="price-desc">Giá giảm</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="max-h-[72vh] overflow-auto">
                <table className="min-w-[1100px] w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Tên combo</th>
                      <th className="px-4 py-3 font-semibold">PV</th>
                      <th className="px-4 py-3 font-semibold">Inverter</th>
                      <th className="px-4 py-3 font-semibold">Battery</th>
                      <th className="px-4 py-3 font-semibold">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        {Array.from({ length: 6 }).map((__, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-4">
                            <div className="h-4 rounded bg-gray-100" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : sectionedCombos.length > 0 ? (
            sectionedCombos.map((section) => (
              <div key={section.key} className="overflow-hidden rounded-2xl border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Danh mục</p>
                  <h2 className="mt-1 text-sm font-bold text-gray-700">{section.title.replace('Danh mục: ', '')}</h2>
                </div>
                <div className="max-h-[72vh] overflow-auto">
                  <table className="min-w-[1100px] w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Tên combo</th>
                      <th className="px-4 py-3 font-semibold">PV</th>
                      <th className="px-4 py-3 font-semibold">Inverter</th>
                      <th className="px-4 py-3 font-semibold">Battery</th>
                      <th className="px-4 py-3 font-semibold">Giá bán</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {section.combos.map((combo, index) => (
                        <tr key={combo.id} className="hover:bg-blue-50/40">
                          <td className="px-4 py-4 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-4">
                            <button type="button" onClick={() => setModalCombo(combo)} className="block text-left">
                              <div className="font-semibold text-gray-900 hover:text-[#0B63CE]">{combo.name}</div>
                            </button>
                            <a href={`/goi-combo/${combo.slug}`} className="mt-1 inline-flex text-xs text-gray-500 hover:text-[#0B63CE] hover:underline">
                              {combo.slug}
                            </a>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700">
                            <div className="font-medium text-gray-900">
                              {getDeviceHead(combo.panel_brand, formatPower(combo.power, 'kWp'))}
                            </div>
                            <div className="text-xs text-gray-500">{combo.panel_model || '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.panel_warranty ? `${combo.panel_warranty} năm bảo hành` : '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.panel_count ? `${combo.panel_count} tấm` : '-'}</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700">
                            <div className="font-medium text-gray-900">
                              {getDeviceHead(combo.inverter_brand, formatPower(combo.power, 'kW'))}
                            </div>
                            <div className="text-xs text-gray-500">{combo.inverter_model || '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.inverter_warranty ? `${combo.inverter_warranty} năm bảo hành` : '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.inverter_count ? `${combo.inverter_count} bộ` : '-'}</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700">
                            <div className="font-medium text-gray-900">
                              {getDeviceHead(combo.battery_brand, formatPower(combo.battery, 'kWh'))}
                            </div>
                            <div className="text-xs text-gray-500">{combo.battery_model || '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.battery_warranty ? `${combo.battery_warranty} năm bảo hành` : '-'}</div>
                            <div className="text-[11px] text-gray-400">{combo.battery_count ? `${combo.battery_count} bộ` : '-'}</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-[#0B63CE]">
                            {new Intl.NumberFormat('vi-VN').format(combo.price)} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
              Không tìm thấy combo phù hợp.
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <p>Hiển thị {filtered.length} / {combos.length} combo</p>
          <a href="/goi-combo" className="font-semibold text-[#0B63CE] hover:text-[#084a9c]">
            Về trang combo
          </a>
        </div>
        {modalCombo && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={() => setModalCombo(null)} role="presentation">
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Chi tiết ${modalCombo.name}`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Xem nhanh combo</p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900">{modalCombo.name}</h3>
                  <a href={`/goi-combo/${modalCombo.slug}`} className="mt-1 inline-flex text-sm font-medium text-[#0B63CE] hover:underline">
                    Đi tới trang chi tiết
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setModalCombo(null)}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-5 px-5 py-5 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Thông tin chung</p>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Slug</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.slug}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Loại hệ</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.system_type === 'hybrid' ? 'Hybrid' : 'On-grid'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Pha</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.phase || '-'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Áp</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.voltage === 'high' ? 'Áp cao' : modalCombo.voltage === 'low' ? 'Áp thấp' : '-'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Công suất</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.power} kWp</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Sản lượng</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.monthly_production ? `${modalCombo.monthly_production} kWh/tháng` : '-'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Hoàn vốn</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.payback_period ? `${modalCombo.payback_period} năm` : '-'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Diện tích</dt>
                      <dd className="font-medium text-gray-900">{modalCombo.installation_area ? `${modalCombo.installation_area} m²` : '-'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-500">Giá bán</dt>
                      <dd className="font-medium text-[#0B63CE]">{new Intl.NumberFormat('vi-VN').format(modalCombo.price)} đ</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Thiết bị</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">Tấm pin</p>
                      <p className="font-semibold text-gray-900">
                        {getDeviceHead(modalCombo.panel_brand, formatPower(modalCombo.power, 'kWp'))}
                      </p>
                      <p className="text-gray-500">{modalCombo.panel_model || '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.panel_warranty ? `${modalCombo.panel_warranty} năm bảo hành` : '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.panel_count ? `${modalCombo.panel_count} tấm` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">Biến tần</p>
                      <p className="font-semibold text-gray-900">
                        {getDeviceHead(modalCombo.inverter_brand, formatPower(modalCombo.power, 'kW'))}
                      </p>
                      <p className="text-gray-500">{modalCombo.inverter_model || '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.inverter_warranty ? `${modalCombo.inverter_warranty} năm bảo hành` : '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.inverter_count ? `${modalCombo.inverter_count} bộ` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">Pin lưu trữ</p>
                      <p className="font-semibold text-gray-900">
                        {getDeviceHead(modalCombo.battery_brand, formatPower(modalCombo.battery, 'kWh'))}
                      </p>
                      <p className="text-gray-500">{modalCombo.battery_model || '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.battery_warranty ? `${modalCombo.battery_warranty} năm bảo hành` : '-'}</p>
                      <p className="text-xs text-gray-400">{modalCombo.battery_count ? `${modalCombo.battery_count} bộ` : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Dữ liệu gốc từ API</p>
                <pre className="mt-3 max-h-[320px] overflow-auto rounded-2xl bg-gray-950 p-4 text-[11px] leading-5 text-gray-100">
{JSON.stringify(modalCombo.raw || modalCombo, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        , document.body)}
      </section>
    </div>
  );
}
