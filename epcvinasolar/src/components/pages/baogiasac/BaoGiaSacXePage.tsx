import { Phone } from 'lucide-react';
import FAQSection from '../ad-landing/FAQSection';

export default function BaoGiaSacXePage() {
  return (
    <div className="min-h-screen pt-20 md:pt-20">
      <section className="bg-gradient-to-br from-slate-900 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Báo Giá Trạm Sạc Xe Điện 2026</h1>
          <p className="text-xl text-slate-300">Tương thích VF3, VF5, VF6. Lắp đặt nhanh 1 ngày.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { power: '7 kW', price: '15-20 triệu', time: '6-8 giờ' },
              { power: '11 kW', price: '20-30 triệu', time: '4-6 giờ', popular: true },
              { power: '22 kW', price: '30-50 triệu', time: '2-4 giờ' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-8 ${item.popular ? 'bg-green-600 text-white' : 'bg-white border border-slate-200'}`}>
                <h3 className="text-2xl font-bold text-center mb-2">Trạm {item.power}</h3>
                <p className={`text-center text-3xl font-bold mb-4 ${item.popular ? 'text-white' : 'text-green-600'}`}>{item.price}</p>
                <p className="text-center text-sm">Thời gian sạc: {item.time}</p>
                <a href="/lien-he" className={`block text-center mt-6 py-3 rounded-lg font-semibold ${item.popular ? 'bg-white text-green-600' : 'bg-green-600 text-white'}`}>Nhận báo giá</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
    </div>
  );
}
