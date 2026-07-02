import { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Lightning, BatteryHigh, Shield, MagnifyingGlass, CaretRight, List, GridNine, GridFour, SortAscending, SortDescending, ArrowUp, ArrowDown, X, Package } from '@phosphor-icons/react';
import HeaderBar from '../home/layout/HeaderBar';
import ComboListingCard from './ComboListingCard';
import type { ComboCardData } from './ComboListingCard';

// Combo categories for sidebar
const COMBO_CATEGORIES = [
  { id: 'on-grid-1pha', label: 'On-Grid 1 pha', icon: <Sun className="h-5 w-5" />, color: 'text-orange-600', bg: 'bg-orange-50', system_type: 'on-grid' as const, phase: '1-phase' },
  { id: 'on-grid-3pha', label: 'On-Grid 3 pha', icon: <Lightning className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50', system_type: 'on-grid' as const, phase: '3-phase' },
  { id: 'hybrid-1pha', label: 'Hybrid 1 pha', icon: <BatteryHigh className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', system_type: 'hybrid' as const, phase: '1-phase' },
  { id: 'hybrid-3pha', label: 'Hybrid 3 pha', icon: <BatteryHigh className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50', system_type: 'hybrid' as const, phase: '3-phase' },
];

// All combos fallback data
const ALL_COMBOS: ComboCardData[] = [
  // On-Grid 1-phase
  { id: 'og1p-5', slug: 'on-grid-5kw-1pha', name: 'Hệ On-Grid 5 kWp 1 pha', power: 5, battery: 0, price: 54500000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-8', slug: 'on-grid-88kw-1pha', name: 'Hệ On-Grid 8.8 kWp 1 pha', power: 8.8, battery: 0, price: 86400000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og1p-10', slug: 'on-grid-107kw-1pha', name: 'Hệ On-Grid 10.7 kWp 1 pha', power: 10.7, battery: 0, price: 100600000, system_type: 'on-grid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  // On-Grid 3-phase
  { id: 'og3p-10', slug: 'on-grid-107kw-3pha', name: 'Hệ On-Grid 10.7 kWp 3 pha', power: 10.7, battery: 0, price: 98500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-15', slug: 'on-grid-157kw-3pha', name: 'Hệ On-Grid 15.7 kWp 3 pha', power: 15.7, battery: 0, price: 132500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol', is_popular: true },
  { id: 'og3p-18', slug: 'on-grid-188kw-3pha', name: 'Hệ On-Grid 18.8 kWp 3 pha', power: 18.8, battery: 0, price: 152000000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-29', slug: 'on-grid-294kw-3pha', name: 'Hệ On-Grid 29.4 kWp 3 pha', power: 29.4, battery: 0, price: 252700000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  { id: 'og3p-48', slug: 'on-grid-488kw-3pha', name: 'Hệ On-Grid 48.8 kWp 3 pha', power: 48.8, battery: 0, price: 400500000, system_type: 'on-grid', phase: '3-phase', panel_brand: 'Aiko', inverter_brand: 'Auxsol' },
  // Hybrid 1-phase
  { id: 'hyb-5-5', slug: 'hybrid-5kw-1pha-5kwh', name: 'Hybrid 5 kWp 1 pha – 5 kWh', power: 5, battery: 5.12, price: 100500000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-5-10', slug: 'hybrid-5kw-1pha-10kwh', name: 'Hybrid 5 kWp 1 pha – 10 kWh', power: 5, battery: 10.24, price: 125000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-5', slug: 'hybrid-88kw-1pha-5kwh', name: 'Hybrid 8.8 kWp 1 pha – 5 kWh', power: 8.75, battery: 5.12, price: 145000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-88-10', slug: 'hybrid-88kw-1pha-10kwh', name: 'Hybrid 8.8 kWp 1 pha – 10 kWh', power: 8.75, battery: 10.24, price: 168000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-88-16', slug: 'hybrid-88kw-1pha-16kwh', name: 'Hybrid 8.8 kWp 1 pha – 16 kWh', power: 8.75, battery: 16.38, price: 195000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-10', slug: 'hybrid-107kw-1pha-10kwh', name: 'Hybrid 10.7 kWp 1 pha – 10 kWh', power: 10.63, battery: 10.24, price: 185000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
  { id: 'hyb-107-16', slug: 'hybrid-107kw-1pha-16kwh', name: 'Hybrid 10.7 kWp 1 pha – 16 kWh', power: 10.63, battery: 16.38, price: 215000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ', is_popular: true },
  { id: 'hyb-157-16', slug: 'hybrid-157kw-1pha-16kwh', name: 'Hybrid 15.7 kWp 1 pha – 16 kWh', power: 15.63, battery: 16.38, price: 285000000, system_type: 'hybrid', phase: '1-phase', panel_brand: 'Aiko', inverter_brand: 'SAJ' },
];

export default function ComboCatalogPage() {
  const [combos, setCombos] = useState<ComboCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-asc' | 'price-desc'>('price-asc');
  const [gridColumns, setGridColumns] = useState<number>(4);
  const [productLimit, setProductLimit] = useState<number>(24);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };
    if (showSearch) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  // Fetch all combos
  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/combos');
        if (res.ok) {
          const json = await res.json();
          const rawData = json.data || json;
          if (Array.isArray(rawData) && rawData.length > 0) {
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
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch combos:', e);
      }
      setCombos(ALL_COMBOS);
      setLoading(false);
    }
    fetchCombos();
  }, []);

  // Filter by category
  const categoryCombos = useMemo(() => {
    if (activeCategory === 'all') return combos;
    const cat = COMBO_CATEGORIES.find(c => c.id === activeCategory);
    if (!cat) return combos;
    return combos.filter(c => c.system_type === cat.system_type && c.phase === cat.phase);
  }, [combos, activeCategory]);

  // Filter & sort
  const filteredCombos = useMemo(() => {
    let filtered = [...categoryCombos];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.panel_brand || '').toLowerCase().includes(q) ||
        (c.inverter_brand || '').toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'az': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'za': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    }
    if (productLimit > 0) filtered = filtered.slice(0, productLimit);
    return filtered;
  }, [categoryCombos, searchQuery, sortBy, productLimit]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: combos.length };
    COMBO_CATEGORIES.forEach(cat => {
      counts[cat.id] = combos.filter(c => c.system_type === cat.system_type && c.phase === cat.phase).length;
    });
    return counts;
  }, [combos]);

  const activeCatMeta = COMBO_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="flex-1 flex flex-col">
      <HeaderBar />

      {/* Hero Section */}
      <section className="hidden md:block relative bg-gradient-to-br from-slate-900 to-gray-800 text-white py-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50/20 flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Giải pháp điện mặt trời trọn gói</p>
              <h1 className="text-3xl font-bold">Combo Hệ Thống Điện</h1>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl">
            Combo trọn gói từ tấm pin, biến tần đến pin lưu trữ. Lắp đặt chuyên nghiệp, bảo hành 25 năm.
          </p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-400">{combos.length}</span>
              <span className="text-sm text-gray-400">combo</span>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-400">2</span>
              <span className="text-sm text-gray-400">hệ thống</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile */}
      <div className="md:hidden px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Combo Hệ Thống Điện</h1>
        <div className="grid grid-cols-2 gap-3">
          {filteredCombos.map(combo => (
            <ComboListingCard key={combo.id} combo={combo} basePath="/solar-home/he-thong" />
          ))}
        </div>
      </div>

      {/* Desktop: Sidebar + Content */}
      <div className="hidden md:flex flex-1 px-4 sm:px-6 lg:px-8 py-4 gap-4">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Danh mục Combo</h3>
              </div>
              <div className="p-3">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory('all'); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeCategory === 'all' ? 'bg-orange-500 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCategory === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                    <Package className={`h-4 w-4 ${activeCategory === 'all' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Tất cả Combo</p>
                    <p className={`text-xs ${activeCategory === 'all' ? 'text-white/80' : 'text-gray-500'}`}>{categoryCounts.all} combo</p>
                  </div>
                </a>
                {COMBO_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategory;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <a key={cat.id} href="#" onClick={(e) => { e.preventDefault(); setActiveCategory(cat.id); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : cat.bg}`}>
                        <div className={isActive ? 'text-white' : cat.color}>{cat.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cat.label}</p>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{count} combo</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng combo</span>
                  <span className="text-lg font-bold text-orange-600">{combos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On-Grid</span>
                  <span className="text-lg font-bold text-orange-600">{combos.filter(c => c.system_type === 'on-grid').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hybrid</span>
                  <span className="text-lg font-bold text-orange-600">{combos.filter(c => c.system_type === 'hybrid').length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-1">
                <a href="/" className="hover:text-orange-600 transition-colors">Trang chủ</a>
                <CaretRight className="h-3 w-3" />
                <a href="/solar-home" className="hover:text-orange-600 transition-colors">Solar House</a>
                <CaretRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">{activeCatMeta?.label || 'Tất cả Combo'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div ref={searchRef}>
                  {showSearch ? (
                    <div className="relative w-64">
                      <input type="text" placeholder="Tìm combo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" autoFocus />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setShowSearch(true)} className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-500 transition-colors" title="Tìm kiếm">
                      <MagnifyingGlass className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                  <button onClick={() => setGridColumns(1)} className={`p-2 rounded transition-colors ${gridColumns === 1 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="1 cột"><List className="h-4 w-4" /></button>
                  <button onClick={() => setGridColumns(3)} className={`p-2 rounded transition-colors ${gridColumns === 3 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="3 cột"><GridNine className="h-4 w-4" /></button>
                  <button onClick={() => setGridColumns(4)} className={`p-2 rounded transition-colors ${gridColumns === 4 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="4 cột"><GridFour className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                  {[16, 24, 32, 40].map((limit) => (
                    <button key={limit} onClick={() => setProductLimit(limit)} className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${productLimit === limit ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{limit}</button>
                  ))}
                </div>
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                  <button onClick={() => setSortBy('az')} className={`p-2 rounded transition-colors ${sortBy === 'az' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="A-Z"><SortAscending className="h-4 w-4" /></button>
                  <button onClick={() => setSortBy('za')} className={`p-2 rounded transition-colors ${sortBy === 'za' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="Z-A"><SortDescending className="h-4 w-4" /></button>
                  <button onClick={() => setSortBy('price-asc')} className={`p-2 rounded transition-colors ${sortBy === 'price-asc' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="Giá tăng"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => setSortBy('price-desc')} className={`p-2 rounded transition-colors ${sortBy === 'price-desc' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`} title="Giá giảm"><ArrowDown className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Combo Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
              <p className="text-gray-500 mt-3">Đang tải...</p>
            </div>
          ) : filteredCombos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Package className="h-16 w-16 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">Không tìm thấy combo phù hợp</p>
            </div>
          ) : (
            <div className={gridColumns === 1 ? 'flex flex-col gap-4' : `grid grid-cols-1 sm:grid-cols-2 ${gridColumns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
              {filteredCombos.map(combo => (
                <ComboListingCard key={combo.id} combo={combo} basePath="/solar-home/he-thong" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
