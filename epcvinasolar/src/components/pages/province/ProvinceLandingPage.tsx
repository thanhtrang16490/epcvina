import { MapPin, Phone, CheckCircle, Sun, Lightning, Shield, ArrowRight, Star } from '@phosphor-icons/react';
import { getLocaleFromPathname } from '../../../i18n/messages';
import { getLocalePath } from '../../../i18n/routes';

interface ProvincePageProps {
  province: {
    name: string;
    slug: string;
    region: string;
    description: string;
    solarPotential: string;
    avgSunHours: string;
    installedCapacity: string;
    customersServed: string;
    popularSystems: string[];
    benefits: string[];
    localProofs?: string[];
    faqs: { q: string; a: string }[];
  };
  pathname?: string;
}

export default function ProvinceLandingPage({ province, pathname = '/' }: ProvincePageProps) {
  const locale = getLocaleFromPathname(pathname);
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-orange-400" />
            <span className="text-blue-200">EPCVINA Solar tại {province.region}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">
            Lắp Điện Mặt Trời Tại {province.name}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            {province.description}
          </p>
          <p className="text-sm sm:text-base text-blue-200/85 max-w-3xl mb-6 leading-relaxed">
            Trang địa phương này ưu tiên khách hàng tại {province.name}, dùng proof thực tế theo khu vực và dẫn thẳng về hub Solar C&I khi doanh nghiệp cần phương án tổng thể.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0988446113" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Gọi Tư Vấn: 0988 446 113
            </a>
            <a href={getLocalePath('/solar-cong-nghiep', locale)} className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all">
              Xem giải pháp doanh nghiệp
            </a>
            <a href="/calculator" className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-all">
              Tính chi phí nhanh
            </a>
          </div>
        </div>
      </section>

      {/* Local Proof */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Vì Sao Phù Hợp Tại {province.name}?
              </h2>
              <p className="text-slate-300 leading-relaxed max-w-2xl">
                Nội dung địa phương nên bám vào hạ tầng, cụm KCN, khí hậu và mô hình phụ tải thực tế tại {province.name}.
                Điều này giúp trang giữ intent địa phương nhưng vẫn dẫn người dùng về đúng hub Solar C&I khi họ cần tư vấn quy mô lớn.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(province.localProofs ?? [
                `Bám sát nhu cầu điện của doanh nghiệp tại ${province.name}`,
                `Phù hợp nhà máy, kho vận, văn phòng và dự án mái lớn`,
                `Có thể ước tính nhanh qua calculator trước khi nhận báo giá`,
                `Điểm chốt chuyển tiếp sang hub Solar C&I`,
              ]).map((proof) => (
                <div key={proof} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {proof}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{province.avgSunHours}</p>
              <p className="text-sm text-slate-600">Giờ nắng trung bình/năm</p>
            </div>
            <div>
              <Lightning className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{province.solarPotential}</p>
              <p className="text-sm text-slate-600">Tiềm năng điện mặt trời</p>
            </div>
            <div>
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{province.installedCapacity}</p>
              <p className="text-sm text-slate-600">Công suất đã lắp đặt</p>
            </div>
            <div>
              <Star className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{province.customersServed}</p>
              <p className="text-sm text-slate-600">Khách hàng tại {province.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Tại Sao Nên Lắp Điện Mặt Trời Tại {province.name}?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {province.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-slate-200">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Systems */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Hệ Thống Phổ Biến Tại {province.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {province.popularSystems.map((system, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{system}</h3>
                <a href="/calculator" className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
                  Tính chi phí <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Câu Hỏi Thường Gặp Về Điện Mặt Trời Tại {province.name}
          </h2>
          <div className="space-y-4">
            {province.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Lắp Điện Mặt Trời Tại {province.name}?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0988446113" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-orange-50 transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> 0988 446 113
            </a>
            <a href={getLocalePath('/solar-cong-nghiep', locale)} className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
              Xem hub Solar C&I
            </a>
            <a href="/bao-gia" className="border-2 border-white/40 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
              Nhận báo giá
            </a>
            <a href="/calculator" className="border-2 border-white/40 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
              Tính chi phí nhanh
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
