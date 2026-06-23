import { useState } from 'react';
import { ShoppingCart, Heart, Star, Filter, Grid3X3, List, ChevronRight, Check } from 'lucide-react';
import { getCombos, localCombos } from '../../../data/combos';
import { useCart } from '../../../context/CartContext';

const BRAND_ORANGE = '#f97316';
const BRAND_RED = '#dc2626';

export default function EcommerceHomepage() {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả sản phẩm', count: localCombos.length },
    { id: 'on-grid', label: 'Hệ On-Grid', count: localCombos.filter(c => c.system_type === 'on-grid').length },
    { id: 'hybrid', label: 'Hệ Hybrid', count: localCombos.filter(c => c.system_type === 'hybrid').length },
    { id: '1-phase', label: '1 Pha', count: localCombos.filter(c => c.phase === '1-phase').length },
    { id: '3-phase', label: '3 Pha', count: localCombos.filter(c => c.phase === '3-phase').length },
  ];

  const filteredCombos = selectedCategory === 'all' 
    ? localCombos 
    : selectedCategory.includes('phase')
      ? localCombos.filter(c => c.phase === selectedCategory)
      : localCombos.filter(c => c.system_type === selectedCategory);

  const formatPrice = (million: number) => {
    return `${million.toLocaleString('vi-VN')} triệu`;
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
      {/* ═══════════════ E-COMMERCE HEADER BANNER ═══════════════ */}
      <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                🛒 Siêu Thị Điện Mặt Trời
              </h1>
              <p className="text-lg opacity-90">
                Combo chính hãng · Giá tốt nhất · Bảo hành 25 năm
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs">Sản phẩm đã bán</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-2xl font-bold">4.9★</p>
                <p className="text-xs">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEARCH & FILTER BAR ═══════════════ */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm combo, tấm pin, inverter..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ─── SIDEBAR CATEGORIES ─── */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Danh mục sản phẩm
              </h3>
              <nav className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Bộ lọc nhanh</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Giá dưới 100 triệu</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Pin lưu trữ included</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Hot Sale 🔥</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── PRODUCT GRID ─── */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-gray-900">{filteredCombos.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Sắp xếp:</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>Mặc định</option>
                  <option>Bán chạy nhất</option>
                  <option>Giá tốt nhất</option>
                  <option>Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredCombos.map((combo, index) => (
                <article
                  key={combo.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image Placeholder */}
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

                    {/* Wishlist Button */}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors">
                      <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                    </button>
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

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(48 đánh giá)</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-green-600 font-semibold">Đã bán: {Math.floor(Math.random() * 50 + 10)}</span>
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
                            <Check className="h-4 w-4" />
                            Đã thêm
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Thêm vào giỏ
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-600 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors">
                Xem thêm sản phẩm
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* ═══════════════ E-COMMERCE FEATURES ═══════════════ */}
      <section className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-3">
                🚚
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Giao hàng toàn quốc</h4>
              <p className="text-xs text-gray-600">Miễn phí vận chuyển</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-3xl mb-3">
                🛡️
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Bảo hành 25 năm</h4>
              <p className="text-xs text-gray-600">Chính hãng 100%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-3">
                💳
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Trả góp 0%</h4>
              <p className="text-xs text-gray-600">Qua thẻ tín dụng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-3">
                🎁
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Giảm 10%</h4>
              <p className="text-xs text-gray-600">Cho đơn đầu tiên</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; 2026 Solar Giá Rẻ 24h. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <span>•</span>
            <a href="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <span>•</span>
            <a href="/lien-he" className="hover:text-white transition-colors">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
