import { ArrowLeft, Check, Package, Shield, Zap, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty_years?: number;
  unit_price?: number;
  main_image?: string;
  product_type?: string;
}

interface ProductDetailProps {
  product: Product;
}

const CATEGORY_NAMES: Record<string, string> = {
  'panel': 'Tấm quang năng',
  'hybrid-inverter': 'Biến tần Hybrid',
  'on-grid-1phase': 'Biến tần On-Grid 1 Pha',
  'on-grid-3phase-lv': 'Biến tần On-Grid 3 Pha Hạ Thế',
  'on-grid-3phase-hv': 'Biến tần On-Grid 3 Pha Trung Thế',
  'lv-battery': 'Pin lưu trữ áp thấp',
  'hv-battery': 'Pin lưu trữ áp cao',
  'wiring': 'Dây điện & Phụ kiện',
  'cabinet': 'Tủ điện',
  'mounting': 'Khung nhôm mount',
  'grounding': 'Tiếp địa',
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.main_image ? [product.main_image] : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/equipment" className="hover:text-yellow-600 transition-colors">
              Thiết bị
            </a>
            <span>/</span>
            <a 
              href={`/equipment?category=${product.category}`} 
              className="hover:text-yellow-600 transition-colors"
            >
              {CATEGORY_NAMES[product.category] || product.category}
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.png';
                  }}
                />
              </div>
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-yellow-500 ring-2 ring-yellow-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                  {product.brand}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {CATEGORY_NAMES[product.category] || product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.model}</p>
            </div>

            {/* Price */}
            {product.unit_price && product.unit_price > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                <div className="text-sm text-gray-600 mb-1">Giá tham khảo:</div>
                <div className="text-4xl font-bold text-yellow-600">
                  {formatPrice(product.unit_price)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Đã bao gồm VAT</div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-yellow-600" />
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Tính năng nổi bật
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warranty */}
            {product.warranty_years && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Bảo hành
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-blue-600">{product.warranty_years} năm</div>
                  <div className="text-sm text-gray-600">Bảo hành chính hãng</div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <a
                href="tel:0904038448"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Liên hệ tư vấn
              </a>
              <a
                href="/bao-gia"
                className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold border-2 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                Báo giá chi tiết
              </a>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                Thông số kỹ thuật
              </h2>
            </div>
            <div className="divide-y">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-2 ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="px-6 py-4 font-medium text-gray-900 border-r">{key}</div>
                  <div className="px-6 py-4 text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products CTA */}
        <div className="mt-12 text-center">
          <a
            href="/equipment"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách thiết bị
          </a>
        </div>
      </div>
    </div>
  );
}
