import { MapPin, Calendar, Globe, ArrowRight, Shield, Package, CheckCircle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import HeaderBar from '../../home/layout/HeaderBar';
import type { Device, EquipmentCategory } from '../../../lib/types';

interface PartnerData {
  id: string;
  data: {
    name: string;
    slug: string;
    short_description: string;
    description: string;
    logo?: string;
    country?: string;
    founded_year?: number;
    website?: string;
    brand_type?: string;
    products?: string[];
    is_active: boolean;
    display_order: number;
  };
  body?: string;
}

interface PartnerPageProps {
  partner: PartnerData;
}

// Convert API product to Device format
function apiProductToDevice(product: any): Device {
  return {
    id: product.id,
    category: (product.category) as EquipmentCategory,
    brand: product.brand || 'Unknown',
    name: product.name || product.model || 'Unknown',
    model: product.model || product.name || 'Unknown',
    quantity: 1,
    unit: 'sản phẩm',
    price: product.price || 0,
    specs: {
      'Danh mục': product.category || '',
      'Thương hiệu': product.brand || '',
      ...(product.specifications || {}),
    },
    features: product.features || [],
    warranty: parseInt(product.warranty || '0') || 0,
    images: product.main_image ? [product.main_image] : [],
    image_url: product.main_image,
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  'panel': 'Tấm quang năng',
  'hybrid-inverter': 'Biến tần Hybrid',
  'on-grid-inverter': 'Biến tần On-Grid',
  'lv-battery': 'Pin lưu trữ áp thấp',
  'hv-battery': 'Pin lưu trữ áp cao',
  'mounting': 'Hệ khung nhôm',
  'wiring': 'Hệ dây điện',
  'cabinet': 'Tủ điện',
  'grounding': 'Hệ tiếp địa',
  'accessories': 'Phụ kiện',
};

export default function PartnerPage({ partner }: PartnerPageProps) {
  const [brandProducts, setBrandProducts] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?brand=${encodeURIComponent(partner.data.name)}`);
        const data = await response.json();
        if (data.success && data.data) {
          setBrandProducts(data.data.map(apiProductToDevice));
        }
      } catch (error) {
        console.error('Error fetching partner products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [partner.data.name]);

  return (
    <div className="flex-1 flex flex-col">
      <HeaderBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-6">
              {/* Brand Logo */}
              {partner.data.logo && (
                <div className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 bg-white rounded-2xl p-4 flex items-center justify-center">
                  <img
                    src={partner.data.logo}
                    alt={partner.data.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Đối tác chính hãng</p>
                    <h1 className="text-3xl font-bold">{partner.data.name}</h1>
                  </div>
                </div>
                <p className="text-blue-100 max-w-2xl text-base leading-relaxed mt-3">
                  {partner.data.short_description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {partner.data.country && (
                    <span className="flex items-center gap-1.5 text-sm text-blue-200 bg-white/10 px-3 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {partner.data.country}
                    </span>
                  )}
                  {partner.data.founded_year && (
                    <span className="flex items-center gap-1.5 text-sm text-blue-200 bg-white/10 px-3 py-1 rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      Desde {partner.data.founded_year}
                    </span>
                  )}
                  {partner.data.brand_type && (
                    <span className="text-sm text-blue-200 bg-white/10 px-3 py-1 rounded-full">
                      {partner.data.brand_type}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-orange-600 transition-colors">Trang chủ</a>
              <span>/</span>
              <a href="/doi-tac" className="hover:text-orange-600 transition-colors">Đối tác</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{partner.data.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu {partner.data.name}</h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                  {partner.data.description.split('\n').filter(Boolean).map((paragraph, idx) => (
                    <p key={idx} className="mb-3">{paragraph.trim()}</p>
                  ))}
                </div>
              </div>

              {/* Body Content from MD */}
              {partner.body && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
                  <div
                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: partner.body }}
                  />
                </div>
              )}

              {/* Products Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Sản phẩm {partner.data.name} tại EPCVINA Solar
                </h2>
                {loading ? (
                  <div className="text-center py-12 text-gray-500">Đang tải sản phẩm...</div>
                ) : brandProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {brandProducts.map((product) => (
                      <a
                        key={product.id}
                        href={`/thiet-bi/${product.id}`}
                        className="flex gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group"
                      >
                        {product.image_url && (
                          <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg p-2 flex items-center justify-center">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {CATEGORY_NAMES[product.category] || product.category}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có sản phẩm {partner.data.name} trong danh mục.</p>
                    <a href="/thiet-bi" className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2 inline-block">
                      Xem tất cả thiết bị →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Thông tin đối tác</h3>
                <div className="space-y-3">
                  {partner.data.country && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{partner.data.country}</span>
                    </div>
                  )}
                  {partner.data.founded_year && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Thành lập {partner.data.founded_year}</span>
                    </div>
                  )}
                  {partner.data.brand_type && (
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{partner.data.brand_type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">Tư vấn miễn phí</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Liên hệ EPCVINA Solar để được tư vấn sản phẩm {partner.data.name} chính hãng.
                </p>
                <a
                  href="tel:0988446113"
                  className="block w-full bg-orange-500 text-white text-center px-4 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
                >
                  Gọi ngay: 0988 446 113
                </a>
              </div>

              {/* Other Partners */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Đối tác khác</h3>
                <p className="text-sm text-gray-500 mb-3">Xem tất cả đối tác chính hãng của EPCVINA Solar</p>
                <a
                  href="/doi-tac"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-semibold"
                >
                  Xem tất cả đối tác
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
