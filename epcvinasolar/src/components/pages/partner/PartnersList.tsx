import { MapPin, Calendar, Shield, ArrowRight } from '@phosphor-icons/react';
import HeaderBar from '../../home/layout/HeaderBar';

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
    brand_type?: string;
    products?: string[];
    is_active: boolean;
    display_order: number;
  };
}

interface PartnersListProps {
  partners: PartnerData[];
}

export default function PartnersList({ partners }: PartnersListProps) {
  return (
    <div className="flex-1 flex flex-col">
      <HeaderBar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white py-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Đối tác chính hãng</h1>
            <p className="text-blue-200 max-w-2xl mx-auto text-base">
              EPCVINA Solar là đối tác phân phối chính hãng của các thương hiệu năng lượng mặt trời hàng đầu thế giới.
            </p>
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
              <span className="text-gray-900 font-medium">Đối tác</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={`/doi-tac/${partner.data.slug}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group block"
              >
                {/* Card Header */}
                <div className="p-6 flex items-start gap-4">
                  {partner.data.logo && (
                    <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                      <img
                        src={partner.data.logo}
                        alt={partner.data.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {!partner.data.logo && (
                    <div className="w-14 h-14 flex-shrink-0 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Shield className="w-7 h-7 text-indigo-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {partner.data.name}
                    </h2>
                    {partner.data.brand_type && (
                      <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {partner.data.brand_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {partner.data.short_description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {partner.data.country && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {partner.data.country}
                      </span>
                    )}
                    {partner.data.founded_year && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {partner.data.founded_year}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
