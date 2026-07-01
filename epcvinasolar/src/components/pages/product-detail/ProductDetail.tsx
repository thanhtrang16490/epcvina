import { ArrowLeft, Check, Package, Shield, Zap, TrendingUp, Award, MapPin, Star, Quote } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import HeaderBar from '../../home/layout/HeaderBar';
import { localBrands } from '../../../data/brands';

interface Product {
  id?: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty_years?: number;
  warranty?: string;
  unit_price?: number;
  price?: number;
  main_image?: string;
  product_type?: string;
}

interface Project {
  id: string;
  data: {
    title: string;
    customer: string;
    capacity: string;
    system_type: string;
    location: string;
    completion_date: string;
    description: string;
    image: string;
    equipment_items?: Array<{
      label: string;
      value: string;
      product_slug?: string;
    }>;
    testimonial?: {
      quote: string;
      rating: number;
      aspect?: string;
    };
  };
}

interface ProductDetailProps {
  product: Product;
  relatedProjects?: Project[];
}

const CATEGORY_NAMES: Record<string, string> = {
  'panel': 'Tấm quang năng',
  'hybrid-inverter': 'Biến tần Hybrid',
  'on-grid-inverter': 'Biến tần On-Grid',
  'on-grid-1phase': 'Biến tần On-Grid 1 Pha',
  'on-grid-3phase-lv': 'Biến tần On-Grid 3 Pha Hạ Thế',
  'on-grid-3phase-hv': 'Biến tần On-Grid 3 Pha Trung Thế',
  'lv-battery': 'Pin lưu trữ áp thấp',
  'hv-battery': 'Pin lưu trữ áp cao',
  'wiring': 'Dây điện & Phụ kiện',
  'cabinet': 'Tủ điện',
  'mounting': 'Khung nhôm mount',
  'grounding': 'Tiếp địa',
  'battery': 'Pin lưu trữ',
  'accessories': 'Phụ kiện lắp đặt',
};

export default function ProductDetail({ product, relatedProjects = [] }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const images = product.main_image ? [product.main_image] : [];

  // Find brand info from local brand data
  const brandInfo = useMemo(() => {
    return localBrands.find(b => b.name.toLowerCase() === product.brand.toLowerCase()) || null;
  }, [product.brand]);

  // Fetch related products from same category
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`/api/products?category=${product.category}`);
        const data = await response.json();
        if (data.success && data.data) {
          // Filter out current product and limit to 4
          const related = data.data
            .filter((p: any) => p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };
    fetchRelated();
  }, [product.category, product.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Extract key specs for highlight cards (GPG Solar style)
  const keySpecs = {
    power: product.specifications?.['Công suất tấm pin Pmax'] || '',
    efficiency: product.specifications?.['Hiệu suất'] || '',
    cellType: product.specifications?.['Loại cell'] || '',
  };

  return (
    <div className="relative bg-[#f6f8f6]">
      {/* Header Bar - Desktop Navigation */}
      <HeaderBar />
      
      {/* Common Hero Section - Equipment */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Thiết bị năng lượng mặt trời</p>
                <h1 className="text-3xl font-bold">{CATEGORY_NAMES[product.category] || product.category}</h1>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
              Cung cấp thiết bị chính hãng từ các thương hiệu Tier 1 hàng đầu thế giới, đảm bảo hiệu suất và tuổi thọ trên 25 năm.
            </p>
          </div>
        </div>
      </section>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
              <a href="/thiet-bi/danh-sach/panel" className="hover:text-orange-600 transition-colors cursor-pointer">
                Thiết bị
              </a>
              <span aria-hidden="true">/</span>
              <a 
                href={`/thiet-bi/danh-sach/${product.category}`} 
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                {CATEGORY_NAMES[product.category] || product.category}
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-gray-900 font-medium truncate" aria-current="page">{product.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Layout with Right Sidebar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-12">
          
          {/* Section 1: Product Image + Info (2-column grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 p-6 lg:p-8 flex items-center justify-center">
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

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Brand Badge - Linkable */}
              <div className="mb-4">
                {brandInfo ? (
                  <a
                    href={`/doi-tac/${brandInfo.slug}`}
                    className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg inline-flex items-center gap-2 hover:bg-orange-200 transition-colors"
                  >
                    {product.brand}
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </a>
                ) : (
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Model */}
              <p className="text-sm lg:text-base text-gray-600 mb-6">{product.model}</p>

              {/* Features Section - Displayed below title */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Đặc điểm nổi bật</h3>
                  <div className="space-y-3">
                    {product.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">{feature.split(':')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <a
                  href="tel:0904038448"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-center text-sm cursor-pointer min-h-[44px] flex items-center justify-center"
                  aria-label="Gọi tư vấn: 0904038448"
                >
                  Liên hệ tư vấn
                </a>
                <a
                  href="/bao-gia"
                  className="flex-1 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-all text-center text-sm cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Báo giá chi tiết
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Product Description (MOVED DOWN) */}
          <div className="border-t border-orange-100 pt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h3>
            <div className="space-y-4 mb-8">
              {product.description && (
                <div className="text-justify leading-relaxed text-gray-600">
                  {product.description.split('. ').map((sentence, idx) => (
                    <p key={idx} className="mb-3 last:mb-0">
                      {sentence}{idx < product.description.split('. ').length - 1 ? '.' : ''}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Key Specs Highlight (Thông số chính) */}
          <div className="border-t border-orange-100 pt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thông số chính</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {keySpecs.power && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{keySpecs.power}</div>
                  <div className="text-sm text-gray-600">Công suất tấm pin</div>
                </div>
              )}
              {keySpecs.efficiency && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{keySpecs.efficiency}</div>
                  <div className="text-sm text-gray-600">Hiệu suất</div>
                </div>
              )}
              {keySpecs.cellType && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-orange-600 mb-2">{keySpecs.cellType}</div>
                  <div className="text-sm text-gray-600">Loại cell</div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-10 scroll-mt-24" id="tech-specs">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Thông số kỹ thuật chi tiết
                </h2>
                
                {/* Specs grouped in tables like GPG Solar */}
                <div className="space-y-6">
                  {/* Electrical Specs */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Thông số điện</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(product.specifications)
                            .filter(([key]) => 
                              key.includes('Công suất') || 
                              key.includes('Hiệu suất') || 
                              key.includes('Điện áp') || 
                              key.includes('Dòng') ||
                              key.includes('cell')
                            )
                            .map(([key, value], idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/3 border-r border-gray-200">
                                  {key}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {value}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Physical & Mechanical Specs */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Thông số cấu hình & cơ khí</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(product.specifications)
                            .filter(([key]) => 
                              key.includes('Chiều') || 
                              key.includes('Trọng') || 
                              key.includes('Kính') || 
                              key.includes('Khung') ||
                              key.includes('Hộp') ||
                              key.includes('Đầu') ||
                              key.includes('Cáp')
                            )
                            .map(([key, value], idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/3 border-r border-gray-200">
                                  {key}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {value}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 3: Other Specifications */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Thông số khác</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(product.specifications)
                            .filter(([key]) => 
                              key.includes('Nhiệt') || 
                              key.includes('Tải') ||
                              key.includes('đóng gói') ||
                              key.includes('Hệ số') ||
                              key.includes('Cấp') ||
                              key.includes('Thử') ||
                              key.includes('Xếp')
                            )
                            .map(([key, value], idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/3 border-r border-gray-200">
                                  {key}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {value}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 4: Warranty */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Bảo hành</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(product.specifications)
                            .filter(([key]) => 
                              key.includes('Bảo hành')
                            )
                            .map(([key, value], idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/3 border-r border-gray-200">
                                  {key}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {value}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Brand Introduction Section */}
          <div className="border-t border-orange-100 pt-10">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6 lg:p-8">
              <div className="flex items-start gap-5">
                {/* Brand Logo */}
                {brandInfo?.logo_url && (
                  <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-white rounded-xl border border-indigo-100 p-3 flex items-center justify-center">
                    <img
                      src={brandInfo.logo_url}
                      alt={brandInfo.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                {!brandInfo?.logo_url && (
                  <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-white rounded-xl border border-indigo-100 p-3 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-indigo-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{brandInfo?.name || product.brand}</h2>
                    {brandInfo?.country && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                        <MapPin className="w-3 h-3" />
                        {brandInfo.country}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {brandInfo?.description || `Sản phẩm ${product.brand} chính hãng - Bảo hành đầy đủ, hỗ trợ kỹ thuật 24/7.`}
                  </p>
                  <div className="flex items-center gap-3">
                    {brandInfo && (
                      <a
                        href={`/doi-tac/${brandInfo.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Xem thông tin đối tác {brandInfo.name}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Related Projects Section */}
            {relatedProjects.length > 0 && (
              <div className="mt-12 pt-12 border-t border-gray-200">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span>Dự án sử dụng thiết bị này</span>
                  </h2>
                  <p className="text-gray-600 text-base">Các dự án thực tế đã lắp đặt {product.name}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.map((project) => {
                    const projectSlug = project.id.replace('.md', '');
                    const tagColors: Record<string, string> = {
                      'Hybrid có lưu trữ': 'bg-blue-100 text-blue-700',
                      'Hòa Lưới bám tải': 'bg-sky-100 text-sky-700',
                      'On Grid / Hybrid': 'bg-emerald-100 text-emerald-700',
                    };
                    const tagColor = tagColors[project.data.system_type] || 'bg-gray-100 text-gray-700';
                    
                    return (
                      <a
                        key={project.id}
                        href={`/du-an/${projectSlug}`}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-200 group block"
                      >
                        {/* Project Image */}
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={project.data.image}
                            alt={project.data.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute bottom-3 left-4 right-4">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 backdrop-blur-sm text-white">
                                {project.data.capacity}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
                                {project.data.system_type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Project Info */}
                        <div className="p-5">
                          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {project.data.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {project.data.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {project.data.location.split(' - ').pop()}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {project.data.completion_date}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
                
                <div className="mt-6 text-center">
                  <a
                    href="/du-an"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Xem tất cả dự án
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div className="mt-12 pt-12 border-t border-gray-200">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <span>Đánh giá từ khách hàng</span>
                </h2>
                <p className="text-gray-600 text-base">Phản hồi từ khách hàng đã sử dụng sản phẩm và dịch vụ của EPCVINA Solar</p>
              </div>

              {/* Extract testimonials from related projects */}
              {relatedProjects.filter(p => p.data.testimonial).length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedProjects
                    .filter(p => p.data.testimonial)
                    .map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-2xl border border-gray-200 p-6 relative"
                      >
                        <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />
                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (project.data.testimonial?.rating || 5)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Quote */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                          "{project.data.testimonial?.quote}"
                        </p>
                        {/* Customer Info */}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-700 font-bold text-sm">
                              {project.data.customer.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{project.data.customer}</p>
                            <p className="text-xs text-gray-500">
                              {project.data.capacity} • {project.data.location.split(' - ').pop()}
                            </p>
                          </div>
                          {project.data.testimonial?.aspect && (
                            <span className="ml-auto text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                              {project.data.testimonial.aspect}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* Default reviews when no project testimonials */
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                      "Sản phẩm chính hãng, chất lượng tốt. Đội ngũ tư vấn nhiệt tình, lắp đặt nhanh chóng. Hệ thống hoạt động ổn định từ ngày đầu tiên."
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-bold text-sm">N</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Anh Nguyễn Văn A</p>
                        <p className="text-xs text-gray-500">Hệ thống 10kWp • Hà Nội</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                      "Giá cả hợp lý, bảo hành đầy đủ. Sau 6 tháng sử dụng rất hài lòng, điện giảm đáng kể. Sẽ giới thiệu cho bạn bè."
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-sm">T</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Chị Trần Thị B</p>
                        <p className="text-xs text-gray-500">Hệ thống 5kWp • TP.HCM</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Overall Rating Summary */}
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">4.9</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Đánh giá trung bình</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'Chất lượng sản phẩm', percent: 98 },
                      { label: 'Dịch vụ tư vấn', percent: 96 },
                      { label: 'Thi công lắp đặt', percent: 97 },
                      { label: 'Bảo hành hậu mãi', percent: 95 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-32 flex-shrink-0">{item.label}</span>
                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Products */}
            <div className="text-center pt-8 border-t border-gray-200">
              <a
                href="/thiet-bi"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách thiết bị
              </a>
            </div>
            </div>
          </div>

          {/* Right Sidebar - Related Products */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h3>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <a
                    key={relatedProduct.id}
                    href={`/thiet-bi/${relatedProduct.slug || relatedProduct.id}`}
                    className="flex gap-3 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow p-3 cursor-pointer"
                  >
                    {/* Image on Left */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={relatedProduct.main_image || '/images/placeholder.png'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    
                    {/* Title & Details on Right */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug line-clamp-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{relatedProduct.brand}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                          {relatedProduct.specifications?.['Công suất'] || relatedProduct.specifications?.['Công suất tấm pin Pmax'] || 'N/A'}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                          {relatedProduct.specifications?.['Hiệu suất'] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Đang tải sản phẩm...
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
