import { useState, useMemo } from 'react';
import { Search, ChevronRight, Star, Zap, Battery, TrendingUp, Shield, ArrowRight, Package, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  price: number;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  warranty_years: number;
  main_image: string;
  is_available: boolean;
  product_type: string;
}

interface HomepageProps {
  productsByCategory: Record<string, Product[]>;
  brands: string[];
  totalProducts: number;
  totalBrands: number;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; gradient: string; emoji: string }> = {
  panel: { label: 'Tấm Pin Mặt Trời', icon: <Zap className="h-6 w-6 text-white" />, gradient: 'from-blue-500 to-blue-600', emoji: '☀️' },
  inverter: { label: 'Biến Tần / Inverter', icon: <TrendingUp className="h-6 w-6 text-white" />, gradient: 'from-orange-500 to-orange-600', emoji: '⚡' },
  battery: { label: 'Pin Lưu Trữ', icon: <Battery className="h-6 w-6 text-white" />, gradient: 'from-green-500 to-green-600', emoji: '🔋' },
  accessories: { label: 'Phụ Kiện Lắp Đặt', icon: <Shield className="h-6 w-6 text-white" />, gradient: 'from-gray-500 to-gray-600', emoji: '🔧' },
};

function formatPrice(price: number): string {
  if (price === 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
}

function ProductCard({ product, category }: { product: Product; category: string }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.accessories;
  const power = product.specifications?.['Công suất tấm pin Pmax'] || product.specifications?.['Công suất'] || '';
  const efficiency = product.specifications?.['Hiệu suất'] || '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col">
      <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-2">{meta.emoji}</div>
          <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
        </div>
        {product.warranty_years >= 15 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">BH {product.warranty_years} năm</span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">{product.name}</h3>
        {(power || efficiency) && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {power && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{power}</span>}
            {efficiency && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">{efficiency}</span>}
          </div>
        )}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
          <span className="text-xs text-gray-500 ml-1">(5.0)</span>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-100 space-y-1.5">
          <a href={`/equipment/${product.id}`} className="block text-center text-xs text-orange-600 hover:text-orange-700 font-semibold py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">Xem chi tiết</a>
          <a href={`https://epcvina.com/thiet-bi/${product.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1">
            Mua tại EPCVINA <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GigaDigitalHomepage({ productsByCategory, brands, totalProducts, totalBrands }: HomepageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryOrder = ['panel', 'inverter', 'battery', 'accessories'];
  const categories = categoryOrder.map(id => ({ id, ...CATEGORY_META[id], products: productsByCategory[id] || [] }));

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      products: cat.products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)),
    })).filter(cat => cat.products.length > 0);
  }, [searchQuery, productsByCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-4 border border-white/20">
              <Package className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">{totalProducts}+ sản phẩm chính hãng · {totalBrands} thương hiệu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Thiết Bị Điện Mặt Trời<br /><span className="text-yellow-300">Chính Hãng Giá Tốt</span>
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto mb-6">
              Tấm pin, Inverter, Pin lưu trữ & Phụ kiện từ các thương hiệu Tier 1<br className="hidden sm:block" />
              AIKO · LONGi · Canadian Solar · JA Solar · Deye · SAJ · Growatt · Sungrow
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm: tấm pin, inverter, pin lưu trữ..." className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-base shadow-2xl border-0 focus:ring-4 focus:ring-white/30" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 sm:gap-12 mt-8">
              <div className="text-center"><p className="text-2xl sm:text-3xl font-bold">{totalProducts}+</p><p className="text-xs sm:text-sm opacity-90">Sản phẩm</p></div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center"><p className="text-2xl sm:text-3xl font-bold">{totalBrands}+</p><p className="text-xs sm:text-sm opacity-90">Thương hiệu</p></div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center"><p className="text-2xl sm:text-3xl font-bold">25 năm</p><p className="text-xs sm:text-sm opacity-90">Bảo hành</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHORTCUTS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => { setActiveCategory(activeCategory === cat.id ? 'all' : cat.id); setSearchQuery(''); }}
              className={`${cat.id === 'panel' ? 'bg-blue-50' : cat.id === 'inverter' ? 'bg-orange-50' : cat.id === 'battery' ? 'bg-green-50' : 'bg-gray-50'} backdrop-blur-sm rounded-xl p-4 sm:p-5 border-2 ${activeCategory === cat.id ? 'border-orange-400 ring-2 ring-orange-200' : 'border-white'} shadow-lg hover:shadow-xl transition-all group text-left`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0`}>{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">{cat.label}</h3>
                  <p className="text-xs text-gray-600">{cat.products.length} sản phẩm</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeCategory === cat.id ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT SECTIONS BY CATEGORY */}
      {filteredCategories.map((category) => {
        const displayProducts = category.products.slice(0, 10);
        return (
          <section key={category.id} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>{category.icon}</div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{category.label}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{category.products.length} sản phẩm chính hãng</p>
                </div>
              </div>
              <a href={`/equipment/${category.id}`} className="hidden sm:flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold text-sm">Xem tất cả <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {displayProducts.map((product) => <ProductCard key={product.id} product={product} category={category.id} />)}
            </div>
            {category.products.length > 10 && (
              <div className="mt-6 text-center">
                <a href={`/equipment/${category.id}`} className="inline-flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold px-6 py-2.5 rounded-lg transition-all text-sm">
                  Xem thêm {category.products.length - 10} sản phẩm <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            )}
            <div className="mt-4 text-center sm:hidden">
              <a href={`/equipment/${category.id}`} className="text-orange-600 text-sm font-semibold">Xem tất cả {category.products.length} sản phẩm →</a>
            </div>
          </section>
        );
      })}

      {/* BRAND SHOWCASE */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Thương Hiệu Đối Tác</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {brands.map((brand) => (
              <a key={brand} href={`/equipment?brand=${encodeURIComponent(brand.toLowerCase())}`} className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-sm font-medium text-gray-700 hover:text-orange-700">
                {brand}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EPCVINA CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Cần tư vấn giải pháp điện mặt trời?</h2>
              <p className="text-blue-100 text-sm sm:text-base">EPCVINA - Tổng thầu EPC #1 Việt Nam cung cấp giải pháp trọn gói từ tư vấn, thiết kế đến lắp đặt và bảo trì.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://epcvina.com/bao-gia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors text-sm">
                Nhận báo giá <ExternalLink className="h-4 w-4" />
              </a>
              <a href="tel:0947776662" className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/40 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors text-sm">Gọi 0947 776 662</a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center"><div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><span className="text-2xl">🚚</span></div><h3 className="font-bold text-gray-900 text-sm mb-1">Miễn phí vận chuyển</h3><p className="text-xs text-gray-600">Toàn quốc cho đơn hàng lớn</p></div>
            <div className="text-center"><div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><span className="text-2xl">🛡️</span></div><h3 className="font-bold text-gray-900 text-sm mb-1">Bảo hành chính hãng</h3><p className="text-xs text-gray-600">Lên đến 25 năm</p></div>
            <div className="text-center"><div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><span className="text-2xl">📞</span></div><h3 className="font-bold text-gray-900 text-sm mb-1">Tư vấn 24/7</h3><p className="text-xs text-gray-600">Hotline: 0947 776 662</p></div>
            <div className="text-center"><div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><span className="text-2xl">✅</span></div><h3 className="font-bold text-gray-900 text-sm mb-1">CO, CQ đầy đủ</h3><p className="text-xs text-gray-600">Chứng nhận chính hãng</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
