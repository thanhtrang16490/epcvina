import { useState } from 'react';
import { Search, ChevronRight, Star, Zap, Battery, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { localProducts } from '../../../data/products';

const BRAND_ORANGE = '#f97316';
const BRAND_RED = '#dc2626';

export default function GigaDigitalHomepage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Product categories
  const categories = [
    {
      id: 'panel',
      name: 'Tấm Pin Mặt Trời',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      products: localProducts.filter(p => p.product_type === 'panel'),
    },
    {
      id: 'inverter',
      name: 'Biến Tần / Inverter',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      products: localProducts.filter(p => p.product_type === 'inverter'),
    },
    {
      id: 'battery',
      name: 'Pin Lưu Trữ',
      icon: Battery,
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      products: localProducts.filter(p => p.category === 'battery'),
    },
    {
      id: 'accessories',
      name: 'Phụ Kiện Lắp Đặt',
      icon: Shield,
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-50',
      products: localProducts.filter(p => p.category === 'accessories'),
    },
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <section className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02di00aC00djRoNHptLTYgNmgtNHYyaDR2LTJ6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Thiết Bị Điện Mặt Trời
              <br />
              <span className="text-yellow-300">Chính Hãng Giá Tốt</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Tấm pin, Inverter, Pin lưu trữ & Phụ kiện từ các thương hiệu Tier 1
              <br className="hidden sm:block" />
              AIKO · LONGi · DEYE · SAJ · HOPE TREK
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm: tấm pin, inverter, pin lưu trữ..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-base shadow-2xl border-0 focus:ring-4 focus:ring-white/30"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-12 mt-10">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold">31+</p>
                <p className="text-sm opacity-90">Sản phẩm</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold">10+</p>
                <p className="text-sm opacity-90">Thương hiệu</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold">25 năm</p>
                <p className="text-sm opacity-90">Bảo hành</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORY SHORTCUTS ═══════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={`/equipment/${cat.id}`}
                className={`${cat.bg} backdrop-blur-sm rounded-xl p-6 border-2 border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {cat.products.length} sản phẩm
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ PRODUCT SECTIONS BY CATEGORY ═══════════════ */}
      {categories.map((category, index) => (
        <section
          key={category.id}
          className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ${
            index % 2 === 0 ? 'py-12' : 'py-12 bg-white'
          }`}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {category.products.length} sản phẩm chính hãng
                </p>
              </div>
            </div>
            <a
              href={`/equipment/${category.id}`}
              className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
            >
              Xem tất cả
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {category.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-2">
                      {category.id === 'panel' && '☀️'}
                      {category.id === 'inverter' && '⚡'}
                      {category.id === 'battery' && '🔋'}
                      {category.id === 'accessories' && '🔧'}
                    </div>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>

                  {/* Badge */}
                  {product.warranty_years >= 15 && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      BH {product.warranty_years} năm
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* Specs */}
                  {product.specifications.power && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {product.specifications.power}
                      </span>
                      {product.specifications.efficiency && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">
                          {product.specifications.efficiency}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-base font-bold text-red-600">
                      {formatPrice(product.unit_price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More - Hidden since we show all products */}
          {false && category.products.length > 5 && (
            <div className="mt-8 text-center">
              <a
                href={`/equipment/${category.id}`}
                className="inline-flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Xem thêm {category.products.length - 5} sản phẩm
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          )}
        </section>
      ))}

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Miễn phí vận chuyển</h3>
              <p className="text-sm text-gray-600">Toàn quốc cho đơn hàng lớn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Bảo hành 25 năm</h3>
              <p className="text-sm text-gray-600">Chính hãng từ nhà sản xuất</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tư vấn 24/7</h3>
              <p className="text-sm text-gray-600">Hỗ trợ kỹ thuật chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
