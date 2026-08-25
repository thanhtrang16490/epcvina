import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CaretRight,
  GridFour,
  GridNine,
  List,
  DotsThreeVertical,
  MagnifyingGlass,
  Package,
  SortAscending,
  SortDescending,
  ArrowUp,
  ArrowDown,
  X,
  Sun,
  Lightning,
  BatteryHigh,
} from '@phosphor-icons/react';
import HeaderBar from '../home/layout/HeaderBar';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

const COMBO_CATEGORIES = [
  { id: 'on-grid-1pha', label: 'On-Grid 1 pha', icon: <Sun className="h-5 w-5" />, color: 'text-orange-600', bg: 'bg-orange-50', system_type: 'on-grid' as const, phase: '1-phase' },
  { id: 'on-grid-3pha', label: 'On-Grid 3 pha', icon: <Lightning className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50', system_type: 'on-grid' as const, phase: '3-phase' },
  { id: 'hybrid-1pha', label: 'Hybrid 1 pha', icon: <BatteryHigh className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', system_type: 'hybrid' as const, phase: '1-phase' },
  { id: 'hybrid-3pha-lv', label: 'Hybrid 3 pha - áp thấp', icon: <BatteryHigh className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50', system_type: 'hybrid' as const, phase: '3-phase', voltage: 'low' as const },
  { id: 'hybrid-3pha-hv', label: 'Hybrid 3 pha - áp cao', icon: <BatteryHigh className="h-5 w-5" />, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', system_type: 'hybrid' as const, phase: '3-phase', voltage: 'high' as const },
];

const ALL_COMBOS: ComboCardData[] = [
  { id: 'og1p-5', slug: 'on-grid-5kw-1pha', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-8', slug: 'on-grid-88kw-1pha', name: 'Hệ On-Grid 8.8 kWp 1 pha', power: 8.8, battery: 0, price: 86400000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-10', slug: 'on-grid-107kw-1pha', name: 'Hệ On-Grid 10.7 kWp 1 pha', power: 10.7, battery: 0, price: 100600000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-10', slug: 'on-grid-107kw-3pha', name: 'Hệ On-Grid 10.7 kWp 3 pha', power: 10.7, battery: 0, price: 98500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-15', slug: 'on-grid-157kw-3pha', name: 'Hệ On-Grid 15.7 kWp 3 pha', power: 15.7, battery: 0, price: 132500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol', is_popular: true },
  { id: 'og3p-18', slug: 'on-grid-188kw-3pha', name: 'Hệ On-Grid 18.8 kWp 3 pha', power: 18.8, battery: 0, price: 152000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-29', slug: 'on-grid-294kw-3pha', name: 'Hệ On-Grid 29.4 kWp 3 pha', power: 29.4, battery: 0, price: 252700000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-48', slug: 'on-grid-488kw-3pha', name: 'Hệ On-Grid 48.8 kWp 3 pha', power: 48.8, battery: 0, price: 400500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'hyb-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hybrid 5 kWp 1 pha - 5 kWh', power: 5, battery: 5.12, price: 100500000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hybrid 5 kWp 1 pha - 10 kWh', power: 5, battery: 10.24, price: 125000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-5', slug: 'hybrid-88kw-1pha-5kwh', name: 'Hybrid 8.8 kWp 1 pha - 5 kWh', power: 8.75, battery: 5.12, price: 145000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-88-10', slug: 'hybrid-88kw-1pha-10kwh', name: 'Hybrid 8.8 kWp 1 pha - 10 kWh', power: 8.75, battery: 10.24, price: 168000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-16', slug: 'hybrid-88kw-1pha-16kwh', name: 'Hybrid 8.8 kWp 1 pha - 16 kWh', power: 8.75, battery: 16.38, price: 195000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-10', slug: 'hybrid-107kw-1pha-10kwh', name: 'Hybrid 10.7 kWp 1 pha - 10 kWh', power: 10.63, battery: 10.24, price: 185000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-16', slug: 'hybrid-107kw-1pha-16kwh', name: 'Hybrid 10.7 kWp 1 pha - 16 kWh', power: 10.63, battery: 16.38, price: 215000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-157-16', slug: 'hybrid-157kw-1pha-16kwh', name: 'Hybrid 15.7 kWp 1 pha - 16 kWh', power: 15.63, battery: 16.38, price: 285000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
];

export default function ComboCatalogPage() {
  const [combos, setCombos] = useState<ComboCardData[]>(ALL_COMBOS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [panelBrand, setPanelBrand] = useState('all');
  const [inverterBrand, setInverterBrand] = useState('all');
  const [batteryBrand, setBatteryBrand] = useState('all');
  const [powerFilter, setPowerFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('price-asc');
  const [gridColumns, setGridColumns] = useState<number>(4);
  const [productLimit, setProductLimit] = useState<number>(24);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos');
        if (!res.ok) return;
        const json = await res.json();
        const rawData = json.data || json;
        if (!Array.isArray(rawData) || rawData.length === 0) return;

        const mapped: ComboCardData[] = rawData.map((c: any) => ({
          id: c.id,
          slug: c.slug || c.id,
          name: c.name,
          power: c.power || c.capacity || 0,
          battery: c.battery || 0,
          price: c.price || 0,
          system_type: c.system_type || c.systemType || 'on-grid',
          phase: c.phase || '1-phase',
          panel_brand: c.panelBrand || c.panel_brand || 'Aiko',
          inverter_brand: c.inverterBrand || c.inverter_brand,
          battery_brand: c.battery_brand,
          monthly_production: c.monthly_production,
          payback_period: c.payback_period || c.paybackYears,
          installation_area: c.installation_area || c.areaRequired,
          is_popular: c.is_popular,
          voltage: c.voltage,
        }));
        setCombos(mapped);
      } catch (error) {
        console.error('Failed to fetch combos:', error);
      }
    }

    fetchCombos();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: combos.length };
    COMBO_CATEGORIES.forEach((cat) => {
      counts[cat.id] = combos.filter((combo) => {
        const matchesCore = combo.system_type === cat.system_type && combo.phase === cat.phase;
        if (!matchesCore) return false;
        if ('voltage' in cat && cat.voltage) {
          return combo.voltage === cat.voltage;
        }
        return true;
      }).length;
    });
    return counts;
  }, [combos]);

  const categoryCombos = useMemo(() => {
    if (activeCategory === 'all') return combos;
    const cat = COMBO_CATEGORIES.find((item) => item.id === activeCategory);
    if (!cat) return combos;
    return combos.filter((combo) => {
      const matchesCore = combo.system_type === cat.system_type && combo.phase === cat.phase;
      if (!matchesCore) return false;
      if ('voltage' in cat && cat.voltage) {
        return combo.voltage === cat.voltage;
      }
      return true;
    });
  }, [combos, activeCategory]);

  const brandOptions = useMemo(() => {
    const uniqueValues = (items: Array<string | undefined>) =>
      Array.from(new Set(items.map((item) => item?.trim()).filter((item): item is string => Boolean(item)))).sort((a, b) =>
        a.localeCompare(b, 'vi')
      );

    return {
      panel: uniqueValues(combos.map((combo) => combo.panel_brand)),
      inverter: uniqueValues(combos.map((combo) => combo.inverter_brand)),
      battery: uniqueValues(combos.map((combo) => combo.battery_brand)),
      power: Array.from(new Set(combos.map((combo) => combo.power))).sort((a, b) => a - b),
    };
  }, [combos]);

  const filteredCombos = useMemo(() => {
    let filtered = [...categoryCombos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((combo) =>
        combo.name.toLowerCase().includes(q) ||
        (combo.panel_brand || '').toLowerCase().includes(q) ||
        (combo.inverter_brand || '').toLowerCase().includes(q)
      );
    }

    if (panelBrand !== 'all') {
      filtered = filtered.filter((combo) => (combo.panel_brand || '').toLowerCase() === panelBrand.toLowerCase());
    }

    if (inverterBrand !== 'all') {
      filtered = filtered.filter((combo) => (combo.inverter_brand || '').toLowerCase() === inverterBrand.toLowerCase());
    }

    if (batteryBrand !== 'all') {
      filtered = filtered.filter((combo) => (combo.battery_brand || '').toLowerCase() === batteryBrand.toLowerCase());
    }

    if (powerFilter !== 'all') {
      const selectedPower = Number(powerFilter);
      filtered = filtered.filter((combo) => Math.abs(combo.power - selectedPower) < 0.01);
    }

    switch (sortBy) {
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return productLimit > 0 ? filtered.slice(0, productLimit) : filtered;
  }, [batteryBrand, categoryCombos, inverterBrand, panelBrand, powerFilter, productLimit, searchQuery, sortBy]);

  const relatedArticles = [
    {
      title: 'So sánh On-Grid và Hybrid trước khi đầu tư',
      href: '/tin-tuc/so-sanh-on-grid-vs-hybrid',
      desc: 'Xác định giải pháp phù hợp cho gia đình hoặc công trình của bạn.',
    },
    {
      title: 'Cách chọn công suất hệ thống điện mặt trời',
      href: '/tin-tuc/cac-loai-he-thong-solar',
      desc: 'Gợi ý chọn kWp theo nhu cầu sử dụng và diện tích mái.',
    },
    {
      title: 'Kinh nghiệm chọn pin lưu trữ cho hệ Hybrid',
      href: '/tin-tuc/cach-chon-pin-luu-tru',
      desc: 'Chọn đúng dung lượng để tối ưu chi phí và hiệu năng.',
    },
  ];

  const activeCategoryLabel =
    activeCategory === 'all'
      ? 'Tất cả Combo'
      : COMBO_CATEGORIES.find((item) => item.id === activeCategory)?.label || 'Combo';

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <section className="rounded-[24px] border border-[#e7e7e7] bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#ededed] pb-3 text-[14px] text-gray-700">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap pr-4">
              <a href="/" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Trang chủ</a>
              <CaretRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
              <a href="/goi-combo" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Gói combo</a>
              <CaretRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
              <span className="min-w-0 truncate font-medium text-gray-900">{activeCategoryLabel}</span>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => setGridColumns(2)}
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-semibold transition ${
                  gridColumns === 2 ? 'border-[#0B63CE] bg-[#0B63CE] text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                2 cột
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-semibold transition ${
                  gridColumns === 3 ? 'border-[#0B63CE] bg-[#0B63CE] text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                3 cột
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-semibold transition ${
                  gridColumns === 4 ? 'border-[#0B63CE] bg-[#0B63CE] text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                4 cột
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 pt-4 sm:items-end">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Danh mục</p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">Chọn loại combo</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
              onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setPanelBrand('all');
                  setInverterBrand('all');
                  setBatteryBrand('all');
                  setPowerFilter('all');
                }}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Bỏ lọc
              </button>
              <div className="relative" ref={searchRef}>
                <button
                  type="button"
                  onClick={() => setSearchOpen((open) => !open)}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Tìm combo"
                >
                  <MagnifyingGlass className="h-4 w-4" />
                </button>
                {searchOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-[280px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl sm:w-[360px]">
                    <div className="relative">
                      <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm combo..."
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <a href="/solar-home" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B63CE] hover:text-[#084a9c]">
                Về Solar House
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="relative" ref={filterMenuRef}>
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <DotsThreeVertical className="h-4 w-4" />
                </button>

                {filterMenuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-[260px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Hiển thị</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => setGridColumns(2)} className={`p-2 rounded-lg border ${gridColumns === 2 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><GridFour className="h-4 w-4" /></button>
                        <button onClick={() => setGridColumns(3)} className={`p-2 rounded-lg border ${gridColumns === 3 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><GridNine className="h-4 w-4" /></button>
                        <button onClick={() => setGridColumns(4)} className={`p-2 rounded-lg border ${gridColumns === 4 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><List className="h-4 w-4" /></button>
                      </div>
                    </div>

                    <div className="px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Sắp xếp</p>
                      <div className="mt-2 space-y-1">
                        <button onClick={() => { setSortBy('price-asc'); setFilterMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${sortBy === 'price-asc' ? 'bg-blue-50 text-[#0B63CE]' : 'text-gray-700 hover:bg-gray-50'}`}>
                          Giá tăng
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setSortBy('price-desc'); setFilterMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${sortBy === 'price-desc' ? 'bg-blue-50 text-[#0B63CE]' : 'text-gray-700 hover:bg-gray-50'}`}>
                          Giá giảm
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setSortBy('az'); setFilterMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${sortBy === 'az' ? 'bg-blue-50 text-[#0B63CE]' : 'text-gray-700 hover:bg-gray-50'}`}>
                          A-Z
                          <SortAscending className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setSortBy('za'); setFilterMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${sortBy === 'za' ? 'bg-blue-50 text-[#0B63CE]' : 'text-gray-700 hover:bg-gray-50'}`}>
                          Z-A
                          <SortDescending className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 pr-1 snap-x snap-mandatory lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0 lg:pr-0">
            {[
              { id: 'all', label: 'Tất cả', icon: <Package className="h-5 w-5" />, count: categoryCounts.all, bg: 'bg-orange-50', color: 'text-orange-600' },
              ...COMBO_CATEGORIES.map((cat) => ({
                id: cat.id,
                label: cat.label,
                icon: cat.icon,
                count: categoryCounts[cat.id] || 0,
                bg: cat.bg,
                color: cat.color,
              })),
            ].map((tile) => {
              const active = tile.id === activeCategory;
              return (
                <button
                  key={tile.id}
                  onClick={() => setActiveCategory(tile.id)}
                  className={`group flex shrink-0 snap-start flex-col justify-between rounded-2xl border p-3 text-left transition-all w-[128px] sm:w-[140px] lg:w-auto lg:aspect-square lg:flex-1 ${
                    active
                      ? 'border-[#0B63CE] bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-[#0B63CE] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? 'bg-[#0B63CE] text-white' : `${tile.bg} ${tile.color}`}`}>
                      {tile.icon}
                    </div>
                    <div className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${active ? 'bg-[#0B63CE] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {tile.count}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-1 text-sm font-semibold leading-none text-gray-900 group-hover:text-orange-600">
                    {tile.label}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Tấm pin</span>
              <select
                value={panelBrand}
                onChange={(event) => setPanelBrand(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brandOptions.panel.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Biến tần</span>
              <select
                value={inverterBrand}
                onChange={(event) => setInverterBrand(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brandOptions.inverter.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Pin lưu trữ</span>
              <select
                value={batteryBrand}
                onChange={(event) => setBatteryBrand(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brandOptions.battery.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Công suất hệ</span>
              <select
                value={powerFilter}
                onChange={(event) => setPowerFilter(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/20"
              >
                <option value="all">Tất cả công suất</option>
                {brandOptions.power.map((power) => (
                  <option key={power} value={power}>{power} kWp</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 sm:text-xl">{activeCategoryLabel}</h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{filteredCombos.length} combo</p>
            </div>
          </div>
        </section>

        <div className="mt-4">
          <section>
            <div className={`grid grid-cols-2 gap-3 ${gridColumns === 2 ? 'md:grid-cols-2' : gridColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
              {filteredCombos.map((combo) => (
                <ComboListingCard key={combo.id} combo={combo} basePath="/goi-combo" />
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm lg:hidden">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                <BookOpen className="h-4 w-4" />
                Bài viết liên quan
              </div>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">Đọc thêm trước khi chọn combo</h3>
            </div>
            <a href="/kien-thuc" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B63CE] hover:text-[#084a9c]">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="group rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-[#0B63CE] hover:bg-blue-50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Kiến thức</p>
                    <h4 className="mt-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-[#0B63CE]">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {article.desc}
                    </p>
                  </div>
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-gray-400 transition-colors group-hover:text-[#0B63CE]">
                    <CaretRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
