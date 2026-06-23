import { useState } from 'react';
import { ShoppingCart, Filter, Grid3X3, List, Search, SlidersHorizontal } from 'lucide-react';
import { getCombos, localCombos } from '../../../data/combos';
import { useCart } from '../../../context/CartContext';

const BRAND_ORANGE = '#f97316';
const BRAND_RED = '#dc2626';

export default function CatalogHomepage() {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả sản phẩm', count: localCombos.length, icon: '🏠' },
    { id: 'on-grid', label: 'Hệ On-Grid', count: localCombos.filter(c => c.system_type === 'on-grid').length, icon: '⚡' },
    { id: 'hybrid', label: 'Hệ Hybrid', count: localCombos.filter(c => c.system_type === 'hybrid').length, icon: '🔋' },
    { id: '1-phase', label: '1 Pha', count: localCombos.filter(c => c.phase === '1-phase').length, icon: '🔌' },
    { id: '3-phase', label: '3 Pha', count: localCombos.filter(c => c.phase === '3-phase').length, icon: '🔌' },
  ];

  const filteredCombos = selectedCategory === 'all' 
    ? localCombos 
    : selectedCategory.includes('phase')
      ? localCombos.filter(c => c.phase === selectedCategory)
      : localCombos.filter(c => c.system_type === selectedCategory);

  const searchedCombos = searchQuery.trim()
    ? filteredCombos.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.system_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredCombos;

  const sortedCombos = [...searchedCombos].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.investment_million_vnd - b.investment_million_vnd;
      case 'price-desc':
        return b.investment_million_vnd - a.investment_million_vnd;
      case 'power':
        return b.power_kw - a.power_kw;
      default:
        return 0;
    }
  });

  const formatPrice = (million: number) => {
    return `${million.toLocaleString('vi-VN')} triệu`;
  };

  const formatCurrency = (million: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(million * 1_000_000);
  };

  const handleAddToCart = (combo: any) => {
    addToCart({
      id: combo.id,
      name: combo.name,
      price: combo.investment_million_vnd,
      originalPrice: Math.round(combo.investment_million_vnd * 1.2),
      capacity: `${combo.power_kw} kWp`,
      systemType: combo.system_type,
      phase: combo.phase,
    });
    setAddedToCartId(combo.id);
    setTimeout(() => setAddedToCartId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              🛒 Siêu Thị Điện Mặt Trời
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Combo chính hãng · Giá tốt nhất · Bảo hành 25 năm
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs">Sản phẩm đã bán</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">4.9★</p>
                <p className="text-xs">Đánh giá</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">29</p>
                <p className="text-xs">Combo sẵn có</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT: SIDEBAR + GRID ═══════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ═══════════════ SIDEBAR ═══════════════ */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-5 w-5 text-gray-700" />
                  <h3 className="font-bold text-gray-900">Danh mục sản phẩm</h3>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                          : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">💡 Tư vấn nhanh</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Miễn phí vận chuyển</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Bảo hành 25 năm</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Hỗ trợ lắp đặt</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Trả góp 0%</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 rounded-lg transition-all">
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </aside>

          {/* ═══════════════ MAIN CONTENT ═══════════════ */}
          <main className="flex-1">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 sticky top-24 z-30 shadow-sm">
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm combo, hệ thống điện mặt trời..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="popular">Phổ biến</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="power">Công suất</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Đang xem:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </span>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-600">{sortedCombos.length} sản phẩm</span>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedCombos.map((combo, index) => (
                <article
                  key={combo.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">☀️</div>
                      <p className="text-sm text-gray-600 font-medium">{combo.name}</p>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {index < 3 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          🔥 Hot
                        </span>
                      )}
                      {combo.investment_million_vnd < 100 && (
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Giá tốt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* System Type Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        combo.system_type === 'hybrid' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {combo.system_type === 'hybrid' ? '🔋 Hybrid' : '⚡ On-Grid'}
                      </span>
                      {combo.battery_kwh && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Pin: {combo.battery_kwh} kWh
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {combo.name}
                    </h3>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                      <div>
                        <span className="font-semibold">Công suất:</span> {combo.power_kw} kWp
                      </div>
                      <div>
                        <span className="font-semibold">Pha:</span> {combo.phase === '1-phase' ? '1 pha' : '3 pha'}
                      </div>
                      <div>
                        <span className="font-semibold">Sản lượng:</span> {combo.production_min_kwh}-{combo.production_max_kwh} kWh/năm
                      </div>
                      <div>
                        <span className="font-semibold">Hoàn vốn:</span> {combo.payback_label}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(combo.investment_million_vnd * 1.2)}
                        </p>
                        <p className="text-xl font-bold text-red-600">
                          {formatPrice(combo.investment_million_vnd)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(combo)}
                        disabled={addedToCartId === combo.id}
                        className={`font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          addedToCartId === combo.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                        }`}
                      >
                        {addedToCartId === combo.id ? (
                          <>
                            <span>✓</span>
                            Đã thêm
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Thêm
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {sortedCombos.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg mb-2">Không tìm thấy sản phẩm</p>
                <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
