import { CheckCircle, Phone, Battery } from 'lucide-react';
import SocialProofSection from '../ad-landing/SocialProofSection';
import FAQSection from '../ad-landing/FAQSection';

export default function CoLuuTruLandingPage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Battery className="w-8 h-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Hybrid Solar + Pin Lưu Trữ</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Điện Mặt Trời Có Lưu Trữ</h1>
            <p className="text-xl text-slate-300 mb-8">Có điện khi mất điện. Dùng điện ban đêm. Tự chủ năng lượng 80-90%.</p>
            <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
              <Phone className="w-5 h-5" /> Tư Vấn Ngay
            </a>
          </div>
        </div>
      </section>
      <SocialProofSection />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Lợi Ích Hệ Có Lưu Trữ</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Có Điện Khi Mất Điện', desc: 'Pin tự động cấp điện khi mất lưới' },
              { title: 'Dùng Điện Ban Đêm', desc: 'Lưu trữ điện dư ban ngày' },
              { title: 'Tự Chủ 80-90%', desc: 'Giảm phụ thuộc điện lưới' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Gói Hybrid Phổ Biến</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '5kWp + 5kWh', price: '120-150 triệu' },
              { power: '8.8kWp + 10kWh', price: '180-220 triệu', popular: true },
              { power: '10kWp + 15kWh', price: '250-300 triệu' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-orange-500 text-white ring-4 ring-orange-200' : 'bg-white border border-slate-200'}`}>
                <h3 className="text-2xl font-bold text-center mb-2">{item.power}</h3>
                <p className={`text-center text-3xl font-bold ${item.popular ? 'text-white' : 'text-orange-500'}`}>{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Không Lo Mất Điện</h2>
          <a href="tel:0988446113" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg">
            <Phone className="w-5 h-5" /> 0988 446 113
          </a>
        </div>
      </section>
    </div>
  );
}
