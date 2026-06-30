import { CheckCircle, Phone, Car, Zap } from 'lucide-react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import FAQSection from '../ad-landing/FAQSection';

export default function KetHopSacXeLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="relative bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Solar + EV Charging</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Kết Hợp Sạc Xe Điện</h1>
            <p className="text-xl text-slate-300 mb-8">Xe chạy bằng năng lượng mặt trời. Giảm 70% chi phí sạc. Xanh & Tiết kiệm.</p>
            <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
              <Phone className="w-5 h-5" /> Tư Vấn Ngay
            </a>
          </div>
        </div>
      </section>
      <SocialProofSection />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Lợi Ích Kết Hợp</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Giảm 50-70% chi phí sạc xe',
              'Sạc hoàn toàn bằng năng lượng sạch',
              'Không phát thải carbon',
              'Hoàn vốn 3-5 năm',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gói Kết Hợp</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { config: '5kWp + Sạc 7kW', price: '80-100 triệu' },
              { config: '8kWp + Sạc 11kW', price: '130-160 triệu', popular: true },
              { config: '10kWp + Sạc 22kW', price: '170-200 triệu' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-green-600 text-white ring-4 ring-green-200' : 'bg-white border border-slate-200'}`}>
                <h3 className="text-xl font-bold text-center mb-2">{item.config}</h3>
                <p className={`text-center text-3xl font-bold ${item.popular ? 'text-white' : 'text-green-600'}`}>{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Xe Xanh - Năng Lượng Sạch</h2>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl text-lg">
            <Phone className="w-5 h-5" /> 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
