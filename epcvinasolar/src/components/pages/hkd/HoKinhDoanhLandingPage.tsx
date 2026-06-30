import { CheckCircle, Phone, Building2 } from 'lucide-react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import FAQSection from '../ad-landing/FAQSection';

export default function HoKinhDoanhLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="relative bg-gradient-to-br from-slate-900 to-amber-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Giải Pháp Hộ Kinh Doanh</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Cho Hộ Kinh Doanh</h1>
            <p className="text-xl text-slate-300 mb-8">Giảm 70-90% chi phí điện. Tăng lợi nhuận. Hoàn vốn nhanh 3-4 năm.</p>
            <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
              <Phone className="w-5 h-5" /> Tư Vấn Ngay
            </a>
          </div>
        </div>
      </section>
      <SocialProofSection />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Phù Hợp Cho</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['Cửa hàng', 'Nhà hàng', 'Quán cafe', 'Khách sạn'].map((item, i) => (
              <div key={i} className="text-center p-6 bg-amber-50 rounded-xl">
                <h3 className="text-lg font-bold">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gói Phù Hợp</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5 kWp', price: '60-80 triệu', saving: '2-3 triệu/tháng' },
              { power: '10 kWp', price: '110-150 triệu', saving: '4-6 triệu/tháng', popular: true },
              { power: '15 kWp', price: '160-200 triệu', saving: '6-8 triệu/tháng' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border border-slate-200'}`}>
                {item.popular && <div className="text-center mb-4"><span className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">Phổ biến</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">{item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
                <p className="text-center text-sm">Tiết kiệm: {item.saving}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tăng Lợi Nhuận Ngay Hôm Nay</h2>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg">
            <Phone className="w-5 h-5" /> 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
