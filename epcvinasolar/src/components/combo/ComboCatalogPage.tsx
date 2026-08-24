import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CaretRight,
  GridFour,
  GridNine,
  List,
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
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('price-asc');
  const [gridColumns, setGridColumns] = useState<number>(4);
  const [productLimit, setProductLimit] = useState<number>(24);
  const searchRef = useRef<HTMLDivElement>(null);

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
  }, [categoryCombos, productLimit, searchQuery, sortBy]);

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
      <div className="hidden md:block px-4 sm:px-6 lg:px-8 pt-4 md:pt-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
              <a href="/" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Trang chủ</a>
              <CaretRight className="h-3 w-3 flex-shrink-0" />
              <a href="/goi-combo" className="whitespace-nowrap hover:text-[#0B63CE] transition-colors">Gói Combo</a>
              <CaretRight className="h-3 w-3 flex-shrink-0" />
              <span className="min-w-0 truncate font-medium text-gray-900">{activeCategoryLabel}</span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-gray-300 p-1">
              <button
                onClick={() => setGridColumns(2)}
                className={`rounded-full p-2 transition-colors ${gridColumns === 2 ? 'bg-[#0B63CE] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Lưới 2 cột"
              >
                <GridFour className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`rounded-full p-2 transition-colors ${gridColumns === 3 ? 'bg-[#0B63CE] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Lưới 3 cột"
              >
                <GridNine className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`rounded-full p-2 transition-colors ${gridColumns === 4 ? 'bg-[#0B63CE] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Lưới 4 cột"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <section className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Danh mục</p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">Chọn loại combo</h3>
            </div>
            <a href="/solar-home" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B63CE] hover:text-[#084a9c]">
              Về Solar House
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
                  className={`group flex aspect-square flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
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
        </section>

        <section className="mt-4 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Bộ lọc</p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold text-gray-900">{activeCategoryLabel}</h3>
              <p className="mt-1 text-sm text-gray-500">{filteredCombos.length} combo</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setGridColumns(2)} className={`p-2 rounded-lg border ${gridColumns === 2 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><GridFour className="h-4 w-4" /></button>
              <button onClick={() => setGridColumns(3)} className={`p-2 rounded-lg border ${gridColumns === 3 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><GridNine className="h-4 w-4" /></button>
              <button onClick={() => setGridColumns(4)} className={`p-2 rounded-lg border ${gridColumns === 4 ? 'bg-[#0B63CE] text-white border-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}><List className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1" ref={searchRef}>
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm combo..."
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B63CE]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setSortBy('az')} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${sortBy === 'az' ? 'border-[#0B63CE] bg-blue-50 text-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <SortAscending className="h-3.5 w-3.5" /> A-Z
              </button>
              <button onClick={() => setSortBy('za')} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${sortBy === 'za' ? 'border-[#0B63CE] bg-blue-50 text-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <SortDescending className="h-3.5 w-3.5" /> Z-A
              </button>
              <button onClick={() => setSortBy('price-asc')} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${sortBy === 'price-asc' ? 'border-[#0B63CE] bg-blue-50 text-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <ArrowUp className="h-3.5 w-3.5" /> Giá tăng
              </button>
              <button onClick={() => setSortBy('price-desc')} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${sortBy === 'price-desc' ? 'border-[#0B63CE] bg-blue-50 text-[#0B63CE]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <ArrowDown className="h-3.5 w-3.5" /> Giá giảm
              </button>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section>
            <div className={`grid grid-cols-2 gap-3 ${gridColumns === 2 ? 'md:grid-cols-2' : gridColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
              {filteredCombos.map((combo) => (
                <ComboListingCard key={combo.id} combo={combo} basePath="/goi-combo" />
              ))}
            </div>
          </section>

          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                <BookOpen className="h-4 w-4" />
                Gợi ý nhanh
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-900">Đọc trước khi chọn combo</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Xem thêm các bài viết nền tảng để chọn đúng cấu hình On-Grid hoặc Hybrid cho nhu cầu thực tế.
              </p>

              <div className="mt-4 space-y-3">
                {relatedArticles.map((article) => (
                  <a
                    key={article.href}
                    href={article.href}
                    className="group block rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-[#0B63CE] hover:bg-blue-50 hover:shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Kiến thức</p>
                    <h4 className="mt-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-[#0B63CE]">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {article.desc}
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Tóm tắt</p>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between gap-3">
                    <span>Combo đang xem</span>
                    <span className="font-semibold text-gray-900">{filteredCombos.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Danh mục</span>
                    <span className="font-semibold text-gray-900">{activeCategoryLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Ưu tiên</span>
                    <span className="font-semibold text-gray-900">On-Grid / Hybrid</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
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
